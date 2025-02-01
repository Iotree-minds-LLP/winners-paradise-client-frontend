import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import imageLogo from "../../assets/Logos/logo1.png";
import image3 from "../../assets/Images/sideImage.png";
import { TextField } from '@mui/material';
import backButton from "../../assets/Logos/backButton.png";
import { useForm } from 'react-hook-form';
import { useToast } from "../../context/Toast/toastHook";
import { goBack } from "../../utils/Functions/goBackScreen";
import { addBankDetails, updateBankDetails, sendOtpForUpdate } from "../../network/BankDetails/page";
import { getCustomerById } from "../../network/Customer/page";

const BankDetails = () => {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm();

    const { addToast } = useToast();

    const handleSuccessClick = (SuccessMessage) => {
        addToast(SuccessMessage, 'success');
    };

    const navigate = useNavigate();
    const [ErrorMessage, setErrorMessage] = useState("");
    const [isLoading, setisLoading] = useState(false);
    const [CustomerDetailsFromAPI, setCustomerDetailsFromAPI] = useState({});
    const [UpdateBankDetails, setUpdateBankDetails] = useState(false);
    const [showOtpField, setShowOtpField] = useState(false); // State to toggle OTP field
    const [otp, setOtp] = useState(""); // State to store OTP

    const watchbankAccountNumber = watch("bank_acc_no");
    const watchbankName = watch("bank_name");
    const watchbankIfsc = watch("bank_Ifsc_code");
    const watchbankBranch = watch("bank_branch_name");

    useEffect(() => {
        const data = localStorage.getItem("customerDetails");
        const customer = JSON.parse(data);
        fetchCustomerDetails(customer._id);
    }, []);


    const fetchCustomerDetails = async (id) => {
        setisLoading(true);
        try {
            if (id) {
                const resp = await getCustomerById(id);
                if (resp.data.status === 200) {
                    setCustomerDetailsFromAPI(resp.data.data.customer);
                    setValue("bank_acc_no", resp.data.data.customer.bank_acc_no);
                    setValue("bank_name", resp.data.data.customer.bank_name);
                    setValue("bank_Ifsc_code", resp.data.data.customer.bank_Ifsc_code);
                    setValue("bank_branch_name", resp.data.data.customer.bank_branch_name);
                    if (resp.data.data.customer.bank_acc_no) {
                        setUpdateBankDetails(true);
                    }
                }
            }
        } catch (error) {
            console.error("Error fetching customer details:", error);
        } finally {
            setisLoading(false);
        }
    };

    const onSubmit = async (data) => {
        setisLoading(true);
        const payload = {
            bank_acc_no: data.bank_acc_no,
            bank_name: data.bank_name,
            bank_Ifsc_code: data.bank_Ifsc_code,
            bank_branch_name: data.bank_branch_name,
        };

        try {
            if (UpdateBankDetails) {
                if (!showOtpField) {
                    const otpResponse = await sendOtpForUpdate();
                    if (otpResponse.data.success) {
                        setShowOtpField(true); // Show OTP field
                        handleSuccessClick(otpResponse.data.message);
                        localStorage.setItem("bankUpdateToken", otpResponse.data.token)
                    } else {
                        setErrorMessage("Failed to send OTP. Please try again.");
                    }
                } else {
                    const token = localStorage.getItem("bankUpdateToken")
                    const updateResponse = await updateBankDetails({ ...payload, otp: Number(otp), updateBankAccountToken: token });
                    if (updateResponse.data.success) {
                        handleSuccessClick(updateResponse.data.message);
                        navigate("/profile-and-settings");
                    } else {
                        setErrorMessage(updateResponse.data.message);
                    }
                }
            } else {
                // If in create mode, call add API
                const addResponse = await addBankDetails(payload);
                if (addResponse.data.success) {
                    handleSuccessClick(addResponse.data.message);
                    navigate("/profile-and-settings");
                } else {
                    setErrorMessage(addResponse.data.message);
                }
            }
        } catch (error) {
            setErrorMessage("An error occurred. Please try again.");
        } finally {
            setisLoading(false);
        }
    };

    return (
        <>
            <div className="h-screen flex flex-col">
                <div className="h-[60px] fixed top-100 mb-4 z-10 w-full sm:hidden  bg-gradient-to-l from-[#020065] to-[#0400CB] flex flex-row p-3">
                    <img src={backButton} onClick={goBack} className="w-8 h-8" alt="Back" />
                    <p className="text-white font-semibold my-1">{UpdateBankDetails && "Update"}Bank Account Details</p>
                </div>

                <div className="h-full bg-white grid grid-cols-12 md:grid-cols-12 md:overflow-hidden md:p-0 sm:p-10">
                    <div className="col-span-12 md:col-span-6 w-full order-1 md:order-2 md:px-20 mt-10 overflow-auto">
                        <div className="flex flex-row">
                            <p style={{ color: '#020065' }} className="mx-5 hidden sm:block text-start font-semibold text-3xl">
                                {UpdateBankDetails && "Update"} Bank Account Details
                            </p>
                        </div>

                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="my-5 grid grid-cols-1 gap-4 md:mx:0 mx-5 py-3"
                        >
                            {/* Bank Account Number */}
                            <TextField
                                value={watchbankAccountNumber}
                                label="Bank Account Number *"
                                variant="outlined"
                                fullWidth
                                type="number"
                                {...register("bank_acc_no", {
                                    required: "Bank Account Number is required",
                                    pattern: {
                                        value: /^\d{9,18}$/,
                                        message: "Enter a valid account number (9-18 digits)",
                                    },
                                })}
                                error={!!errors.bank_acc_no}
                                helperText={errors.bank_acc_no?.message}
                                onInput={(e) => {
                                    if (e.target.value.length > 18) {
                                        e.target.value = e.target.value.slice(0, 18); // Truncate input to 18 digits
                                    }
                                }}
                                sx={{
                                    "& input[type=number]": {
                                        MozAppearance: "textfield", // Removes spinner in Firefox
                                    },
                                    "& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button": {
                                        WebkitAppearance: "none", // Removes spinner in Chrome, Safari
                                        margin: 0,
                                    },
                                }}
                                InputLabelProps={{
                                    shrink: watchbankAccountNumber,
                                }}
                            />

                            {/* Bank Name */}
                            <TextField
                                value={watchbankName}
                                label="Bank Name *"
                                variant="outlined"
                                fullWidth
                                {...register("bank_name", {
                                    required: "Bank Name is required",
                                    minLength: {
                                        value: 3,
                                        message: "Bank name must be at least 3 characters",
                                    },
                                })}
                                error={!!errors.bank_name}
                                helperText={errors.bank_name?.message}
                                InputLabelProps={{
                                    shrink: watchbankName,
                                }}
                            />

                            {/* IFSC Code */}
                            <TextField
                                label="IFSC Code *"
                                variant="outlined"
                                fullWidth
                                {...register("bank_Ifsc_code", {
                                    required: "IFSC Code is required",
                                    pattern: {
                                        value: /^[A-Z]{4}0[A-Z0-9]{6}$/,
                                        message: "Enter a valid IFSC code (e.g., SBIN0001234)",
                                    },
                                })}
                                error={!!errors.bank_Ifsc_code}
                                helperText={errors.bank_Ifsc_code?.message}
                                InputLabelProps={{
                                    shrink: watchbankIfsc,
                                }}
                            />

                            {/* Bank Branch Name */}
                            <TextField
                                label="Bank Branch Name *"
                                variant="outlined"
                                fullWidth
                                {...register("bank_branch_name", {
                                    required: "Bank Branch Name is required",
                                    minLength: {
                                        value: 3,
                                        message: "Branch name must be at least 3 characters",
                                    },
                                })}
                                error={!!errors.bank_branch_name}
                                helperText={errors.bank_branch_name?.message}
                                InputLabelProps={{
                                    shrink: watchbankBranch,
                                }}
                            />

                            {/* OTP Field (Conditional Rendering) */}
                            {showOtpField && (
                                <TextField
                                    label="Enter OTP *"
                                    variant="outlined"
                                    fullWidth
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    error={!!errors.otp}
                                    helperText={errors.otp?.message}
                                />
                            )}

                            {/* Submit Button */}
                            <div>
                                <div className="fixed z-10 bottom-0 left-0  w-full sm:hidden bg-white shadow-lg bg-white">
                                    <div className="absolute bottom-0 left-0 w-full flex flex-col items-start p-4">
                                        <div className="w-full mt-4">
                                            <button
                                                type="submit"
                                                className="w-full p-3 px-24 flex justify-center rounded-full text-white bg-gradient-to-l from-[#020065] to-[#0400CB]"
                                            >
                                                {isLoading ? (
                                                    <svg
                                                        aria-hidden="true"
                                                        className="w-5 h-5 text-gray-200 flex justify-center animate-spin dark:text-gray-600 fill-blue-600"
                                                        viewBox="0 0 100 101"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                                            fill="currentColor"
                                                        />
                                                        <path
                                                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                                            fill="currentFill"
                                                        />
                                                    </svg>
                                                ) : (
                                                    UpdateBankDetails ? (showOtpField ? "Update" : "Send OTP") : "Save & Continue"
                                                )}
                                            </button>
                                        </div>
                                        <div className="text-start">
                                            {ErrorMessage && (
                                                <span style={{ fontSize: '14px' }} className="text-red-400 text-xs text-start">
                                                    {ErrorMessage}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="hidden md:block">
                                    <div className="w-full flex flex-col items-start">
                                        <div className="w-full mt-4">
                                            <button
                                                type="submit"
                                                className="w-full p-3 px-24 flex justify-center rounded-full text-white bg-gradient-to-l from-[#020065] to-[#0400CB]"
                                            >
                                                {isLoading ? (
                                                    <svg
                                                        aria-hidden="true"
                                                        className="w-5 h-5 text-gray-200 flex justify-center animate-spin dark:text-gray-600 fill-blue-600"
                                                        viewBox="0 0 100 101"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                                            fill="currentColor"
                                                        />
                                                        <path
                                                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                                            fill="currentFill"
                                                        />
                                                    </svg>
                                                ) : (
                                                    UpdateBankDetails ? (showOtpField ? "Update" : "Send OTP") : "Save & Continue"
                                                )}
                                            </button>
                                        </div>
                                        <div className="text-start">
                                            {ErrorMessage && (
                                                <span style={{ fontSize: '14px' }} className="text-red-400 text-xs text-start">
                                                    {ErrorMessage}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Right Side Image Section */}
                    <div className="col-span-12 hidden sm:block overflow-hidden md:col-span-6 w-full max-h-[100vh] order-2 md:order-1 responsive relative">
                        <img src={image3} alt="Image description" className="w-full h-auto object-cover" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <h1 className="text-white text-2xl md:text-4xl font-bold bg-opacity-75 p-4 rounded-lg flex flex-col justify-center items-center">
                                <img
                                    className="h-auto w-1/2 p-3 md:mt-0 sm:mt-20 mt-10 text-start"
                                    src={imageLogo}
                                    alt="Logo"
                                />
                            </h1>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BankDetails;
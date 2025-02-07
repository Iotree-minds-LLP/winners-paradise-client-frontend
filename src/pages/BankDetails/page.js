import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import imageLogo from "../../assets/Logos/logo1.png";
import image3 from "../../assets/Images/sideImage.png";
import { TextField } from '@mui/material';
import backButton from "../../assets/Logos/backButton.png";
import { useForm } from 'react-hook-form';
import { useToast } from "../../context/Toast/toastHook";
import { goBack } from "../../utils/Functions/goBackScreen";
import { addBankDetails, updateBankDetails, sendOtpForUpdate } from "../../network/BankDetails/page";
import addNomineeImage from "../../assets/Images/addnominee.png"
import infoPng from "../../assets/Images/info.png"
import { getCustomerById } from "../../network/Customer/page";
import { useLanguage } from "../../context/Language/loginContext";
import translations from "../../utils/Json/translation.json"
import { MoreRounded } from "@mui/icons-material";
import image2 from "../../assets/Images/robo 1 (1).png";

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

    const { language, setLanguage } = useLanguage();
    const navigate = useNavigate();
    const [ErrorMessage, setErrorMessage] = useState("");
    const [isLoading, setisLoading] = useState(false);
    const [CustomerDetailsFromAPI, setCustomerDetailsFromAPI] = useState({});
    const [UpdateBankDetails, setUpdateBankDetails] = useState(false);
    const [showOtpField, setShowOtpField] = useState(false); // State to toggle OTP field
    const [otp, setOtp] = useState(""); // State to store OTP
    const [ConnectedBankHolder, setConnectedBankHolder] = useState("")
    const watchbankAccountNumber = watch("bank_acc_no");
    const watchbankName = watch("bank_name");
    const watchbankIfsc = watch("bank_Ifsc_code");
    const watchbankBranch = watch("bank_branch_name");

    useEffect(() => {
        const data = localStorage.getItem("customerDetails");
        const customer = JSON.parse(data);
        if (!customer) {
            navigate("/")
        }
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
                    setConnectedBankHolder(resp?.data?.data?.customer?.connected_bank_account_holder_name)
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

    const handleSendOtpAgain = async () => {
        const otpResponse = await sendOtpForUpdate();
        if (otpResponse.data.success) {
            setShowOtpField(true);
            handleSuccessClick(otpResponse.data.message);
            localStorage.setItem("bankUpdateToken", otpResponse.data.token)
        } else {
            setErrorMessage("Failed to send OTP. Please try again.");
        }
    }

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
                    <p className="text-white font-semibold my-1">{UpdateBankDetails && `${translations.global.update[language]}`}{translations.BankAccount.heading[language]}</p>
                </div>



                <div className="h-full bg-white grid grid-cols-12 md:grid-cols-12 md:overflow-hidden md:p-0 sm:p-10">
                    <div className="col-span-12 md:col-span-6 w-full order-1 md:order-2 md:px-20 mt-10 overflow-auto">
                        <div className="flex flex-row">
                            <div>
                                <p style={{ color: '#020065' }} className="mx-5 hidden sm:block text-start font-semibold text-3xl">
                                    {UpdateBankDetails && `${translations.global.update[language]}`} {translations.BankAccount.heading[language]}

                                </p>

                                {ConnectedBankHolder &&
                                    <div className="text-xs text-start mx-5 my-3">
                                        <p>{translations.global.connectedBankAccountHolderName[language]}</p>
                                        <p>{ConnectedBankHolder ? ConnectedBankHolder : ""}</p>
                                    </div>
                                }

                            </div>

                        </div>

                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="my-5 grid grid-cols-1 gap-4 md:mx:0 mx-5 py-3"
                        >
                            {/* Bank Account Number */}
                            <TextField
                                value={watchbankAccountNumber}
                                label={translations.BankAccount.bankAccountNumber[language]}
                                variant="outlined"
                                fullWidth
                                type="number"
                                {...register("bank_acc_no", {
                                    required: translations.validations.bankDetails.bankAccount[language],
                                    pattern: {
                                        value: /^\d{9,18}$/,
                                        message: translations.validations.bankDetails.bankAccount1[language],
                                    },
                                })}
                                error={!!errors.bank_acc_no}
                                helperText={errors.bank_acc_no?.message}
                                onInput={(e) => {
                                    if (e.target.value.length > 18) {
                                        e.target.value = e.target.value.slice(0, 18); // Truncate input to 18 digits
                                    }
                                }}
                                onWheel={(e) => e.target.blur()} // Prevents value change on scroll

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

                            <TextField
                                value={watchbankName}
                                label={translations.BankAccount.bankName[language]}
                                variant="outlined"
                                fullWidth
                                {...register("bank_name", {
                                    required: translations.validations.bankDetails.bankName[language],
                                    minLength: {
                                        value: 3,
                                        message: translations.validations.bankDetails.bankName1[language],
                                    },
                                    maxLength: {
                                        value: 40,
                                        message: translations.validations.bankDetails.bankName2[language],
                                    },
                                    pattern: {
                                        value: /^[A-Za-z\s]+$/,
                                        message: translations.validations.bankDetails.bankName3[language],
                                    },
                                })}
                                error={!!errors.bank_name}
                                helperText={errors.bank_name?.message}
                                InputLabelProps={{
                                    shrink: watchbankName,
                                }}
                                onInput={(e) => {
                                    e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, "").slice(0, 40);
                                }}
                            />

                            <TextField
                                label={translations.BankAccount.ifscCode[language]}
                                variant="outlined"
                                fullWidth
                                {...register("bank_Ifsc_code", {
                                    required: translations.validations.bankDetails.ifscCode[language],
                                    pattern: {
                                        value: /^[A-Z]{4}0[A-Z0-9]{6}$/,
                                        message: translations.validations.bankDetails.ifscCode1[language],
                                    },
                                })}
                                error={!!errors.bank_Ifsc_code}
                                helperText={errors.bank_Ifsc_code?.message}
                                InputLabelProps={{
                                    shrink: watchbankIfsc,
                                }}
                            />

                            <TextField
                                label={translations.BankAccount.bankBranchName[language]}
                                variant="outlined"
                                fullWidth
                                {...register("bank_branch_name", {
                                    required: translations.validations.bankDetails.bankBranch[language],
                                    minLength: {
                                        value: 3,
                                        message: translations.validations.bankDetails.bankBranch1[language],
                                    },
                                    maxLength: {
                                        value: 40,
                                        message: translations.validations.bankDetails.bankBranch2[language],
                                    },
                                    pattern: {
                                        value: /^[A-Za-z\s]+$/,
                                        message: translations.validations.bankDetails.bankBranch3[language],
                                    },
                                })}
                                error={!!errors.bank_branch_name}
                                helperText={errors.bank_branch_name?.message}
                                InputLabelProps={{
                                    shrink: watchbankBranch,
                                }}
                                onInput={(e) => {
                                    e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, "").slice(0, 40);
                                }}
                            />


                            {/* OTP Field (Conditional Rendering) */}
                            {showOtpField && (
                                <>
                                    <TextField
                                        label={translations.BankAccount.enterOtp[language]}
                                        variant="outlined"
                                        fullWidth
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        error={!!errors.otp}
                                        helperText={errors.otp?.message}
                                    />
                                    <p onClick={handleSendOtpAgain} className="underline text-end flex justify-end mb-0 cursor-pointer items-end text-gradient-to-l from-[#020065] to-[#0400CB]">Resend OTP ?</p>
                                </>

                            )}

                            {/* Submit Button */}


                            {/* <div className="text-start rounded-lg grid gap-4">
                                <div className="p-4 md:p-6 rounded-lg w-full " style={{ backgroundColor: 'rgba(245, 245, 245, 1)' }}>
                                    <div className="flex justify-between items-center">
                                        <p style={{ color: 'rgba(0, 0, 148, 1)' }} className="font-bold text-lg">Nominee account</p>
                                        <Link to="/profile-and-settings/edit-nominee">
                                            <button aria-label="Edit" className="p-2 ">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                    fill="black"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    className="w-6 h-6"
                                                >
                                                    <path d="M12 20h9"></path>
                                                    <path d="M16.5 3.5l4 4L7 21H3v-4L16.5 3.5z"></path>
                                                </svg>
                                            </button>
                                        </Link>
                                    </div>

                                    <div className="flex justify-between items-center mt-2">
                                        <div>
                                            <p className="text-sm text-gray-800">Account Holder Name</p>
                                            <p style={{ color: 'rgba(0, 0, 148, 1)', fontWeight: '700', fontSize: '18px' }}>
                                                ajsdk
                                            </p>
                                        </div>

                                    </div>

                                    <div className="my-3">
                                        <p className="text-sm text-gray-800">Account Number</p>
                                        <p style={{ color: 'rgba(0, 0, 148, 1)', fontWeight: '700', fontSize: '18px' }}>12839</p>
                                    </div>

                                    <div className="my-3">
                                        <p className="text-sm text-gray-800">IFSC Code</p>
                                        <p style={{ color: 'rgba(0, 0, 148, 1)', fontWeight: '700', fontSize: '18px' }}>ajsd</p>
                                    </div>

                                    <div className="my-3">
                                        <p className="text-sm text-gray-800">Bank Name & Branch</p>
                                        <p style={{ color: 'rgba(0, 0, 148, 1)', fontWeight: '700', fontSize: '18px' }}>
                                            asdjk
                                        </p>

                                    </div>

                                </div>

                            </div> */}

                            {/* <Link to="/profile-and-settings/add-nominee" className="mb-10 md:mb-0">
                                <div className="mt-5 p-5 w-full rounded-lg border border-black border-dotted  border-2 text-start flex justify-between">
                                    <p className="text-lg font-bold" style={{ color: 'rgba(0, 0, 148, 1)' }}>{translations.Nominee.heading[language]}</p>
                                    <img className="w-6 h-6" src={addNomineeImage}></img>
                                </div>
                            </Link> */}

                            {/* Submit Button */}
                            {UpdateBankDetails &&
                                <div className="bg-gray-100 rounded-lg">
                                    <div className="text-start p-4 flex flex-row">
                                        <img className="w-6 h-6" src={infoPng}></img>
                                        <p className="text-xs mx-2 mt-1">{translations.global.verifyMobile[language]}</p>
                                    </div>
                                </div>
                            }
                            <div>

                                <div className="fixed z-10 bottom-0 left-0  w-full sm:hidden bg-white shadow-lg bg-white">
                                    <div className="absolute bottom-0 left-0 w-full flex flex-col items-start p-4">
                                        <div className="w-full mt-4">
                                            <button
                                                disabled={isLoading}
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
                                                    UpdateBankDetails ? (showOtpField ? `${translations.BankAccount.updateButton[language]}` : `${translations.BankAccount.sendOtpButton[language]}`) : `${translations.BankAccount.saveButton[language]}`
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
                                                    UpdateBankDetails ? (showOtpField ? `${translations.BankAccount.updateButton[language]}` : `${translations.BankAccount.sendOtpButton[language]}`) : `${translations.BankAccount.saveButton[language]}`
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
                    <div className="fixed bottom-0 left-0 w-full sm:hidden">
                        <div className="bg-white shadow-md">
                            <img
                                src={image2}
                                alt="Image description"
                                className="w-full h-full object-contain"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BankDetails;
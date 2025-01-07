import { createCustomer, getCustomerById, updatecustomer } from "../../network/Customer/page";
import { useNavigate } from "react-router-dom";
import { SendOtp, VerifyOtp } from "../../network/OtpVerification/page";
import { useContext, useEffect, useState } from "react";
import WidgetButton from "../../widgets/Button/page";
import FormattedJsonViewer from "../../widgets/JsonView/page";
import Button from '@mui/material/Button';
import imageLogo from "../../assets/Logos/logo1.png";
import image1 from "../../assets/Images/robo 1 (3).png";
import image3 from "../../assets/Images/sideImage.png";
import image2 from "../../assets/Images/robo 1 (1).png";
import { Radio, FormControlLabel, FormControl, FormLabel, RadioGroup, TextField } from '@mui/material';
import { PwaContext } from "../../context/PwaContext/page";
import backButton from "../../assets/Logos/backButton.png"
import { useForm } from 'react-hook-form';
import { useLanguage } from "../../context/Language/loginContext";
import { useToast } from "../../context/Toast/toastHook";
import { goBack } from "../../utils/Functions/goBackScreen";

const EditCustomerProfile = () => {

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

    const [ShowPhoneField, setShowPhoneField] = useState(true);
    const { language, setLanguage } = useLanguage();
    const tokenDetails = localStorage.getItem("tokenDetails");
    const [response, setResponse] = useState([]);
    const [isError, setIsError] = useState(false);
    const navigate = useNavigate();
    const [ErrorMessage, setErrorMessage] = useState("")
    const [isLoading, setisLoading] = useState(false)
    const [customerDetails, setCustomerDetails] = useState([]);

    const watchedName = watch("fullName");

    useEffect(() => {
        const data = localStorage.getItem("customerDetails");
        const customer = JSON.parse(data);
        onformSubmit2(customer._id);
    }, []);

    const onSubmit = async (data) => {

        setisLoading(true);
        const date = new Date(data.dateOfBirth);
        const formattedDateOfBirth = `${(date.getMonth() + 1).toString().padStart(2, '0')}-${date
            .getDate()
            .toString()
            .padStart(2, '0')}-${date.getFullYear()}`;

        const payload = {
            name: data.fullName,
            dob: formattedDateOfBirth,
            email_id: data.email,
            mobile_no: data.phoneNumber,
            state: data.state,
            district: data.district,
            city: data.city,
            address: data.address,
            language_preference: language.toLowerCase(),
            token: tokenDetails,
        };
        let resp;
        try {
            resp = await updatecustomer(payload, customerDetails._id);
            if (resp.data.status === 200) {
                setisLoading(false);
                localStorage.removeItem("customerDetails");
                localStorage.setItem("customerDetails", JSON.stringify(resp.data.data.data));
                setErrorMessage("");
                handleSuccessClick(resp.data.data.message);
                navigate("/catalogs");
            }
            else {
                setErrorMessage(resp.data.error);
                setisLoading(false);
            }
        } catch (error) {
            setErrorMessage(resp.data.error);
            setisLoading(false);
        }
    };

    const onformSubmit2 = async (id) => {
        if (id) {
            const resp = await getCustomerById(id);

            if (resp.data.status === 200) {
                setCustomerDetails(resp?.data?.data?.customer);
                setValue("fullName", resp?.data?.data?.customer?.name);
                setValue("phoneNumber", resp?.data?.data?.customer?.mobile_no);
                setValue("email", resp?.data?.data?.customer?.email_id);
                const dob = new Date(resp?.data?.data?.customer?.dob);
                const formattedDob = `${dob.getFullYear()}-${(dob.getMonth() + 1)
                    .toString()
                    .padStart(2, '0')}-${dob.getDate().toString().padStart(2, '0')}`;

                setValue("dateOfBirth", formattedDob);
                setValue("address", resp?.data?.data?.customer?.address);
                setValue("state", resp?.data?.data?.customer?.state);
                setValue("district", resp?.data?.data?.customer?.district);
                setValue("city", resp?.data?.data?.customer?.city);
                setValue("alternatePhoneNumber", resp?.data?.data?.customer?.alternate_mobile_no);
            }
        }
    };


    return (
        <>
            <div className="h-screen flex flex-col">
                {/* Mobile Header */}
                <div className="h-[60px] fixed top-100 z-10 w-full sm:hidden  bg-gradient-to-l from-[#020065] to-[#0400CB] flex flex-row p-3">
                    <img src={backButton} onClick={goBack} className="w-8 h-8" alt="Back" />
                    <p className="text-white font-semibold my-1">Update Personal details</p>
                </div>

                {/* Main Content */}
                <div className="h-full md:mt-0 mt-5 bg-white grid grid-cols-12 md:grid-cols-12 md:overflow-hidden md:p-0 sm:p-10">
                    {/* Form Section */}
                    <div className="col-span-12 md:col-span-6 w-full order-1 md:order-2 md:px-20 mt-10 overflow-auto">
                        <div className="flex flex-row">
                            <p style={{ color: '#020065' }} className="mx-5 hidden sm:block text-start font-semibold text-3xl">
                                Update Personal details
                            </p>
                        </div>
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="my-5 grid grid-cols-1 gap-4 md:mx:0 mx-5"
                        >
                            {/* Form Fields */}
                            <TextField
                                label="Full Name *"
                                variant="outlined"
                                size="medium"
                                fullWidth
                                {...register('fullName', {
                                    required: 'Full Name is required',
                                    minLength: {
                                        value: 3,
                                        message: 'Full Name must be at least 3 characters long',
                                    },
                                    maxLength: {
                                        value: 30,
                                        message: 'Full Name cannot exceed 30 characters',
                                    },
                                    validate: {
                                        noSpecialChars: (value) =>
                                            /^[a-zA-Z\s]+$/.test(value) || 'Full Name must contain only alphabets',
                                    },
                                })}
                                error={!!errors.fullName}
                                helperText={errors.fullName?.message}
                                InputLabelProps={{
                                    shrink: true, // Ensures the label stays at the top when value is present
                                }}
                            />

                            <TextField
                                label="Phone Number"
                                variant="outlined"
                                size="medium"
                                disabled
                                type="text"
                                fullWidth
                                {...register('phoneNumber', {
                                    required: 'Phone number is required',
                                    pattern: {
                                        value: /^[0-9]{10}$/,
                                        message: 'Please enter a valid 10-digit phone number',
                                    },
                                })}
                                error={!!errors.phoneNumber}
                                helperText={errors.phoneNumber?.message}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />

                            <TextField
                                label="Email Id *"
                                variant="outlined"
                                type="text"
                                size="medium"
                                fullWidth
                                {...register('email', {
                                    required: 'Email is required',
                                    maxLength: {
                                        value: 30,
                                        message: 'Email cannot exceed 30 characters',
                                    },
                                    pattern: {
                                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                        message: 'Invalid email address',
                                    },
                                })}
                                error={!!errors.email}
                                helperText={errors.email?.message}
                                InputLabelProps={{
                                    shrink: true, // Ensures the label stays at the top when value is present
                                }}
                            />

                            <TextField
                                variant="outlined"
                                type="date"
                                size="medium"
                                fullWidth
                                {...register('dateOfBirth', {
                                    required: 'Date of Birth is required',
                                    validate: {
                                        notFutureDate: (value) => {
                                            const today = new Date();
                                            const selectedDate = new Date(value);
                                            return selectedDate <= today || 'Date of Birth cannot be in the future';
                                        },
                                    },
                                })}
                                error={!!errors.dateOfBirth}
                                helperText={errors.dateOfBirth?.message}
                                InputLabelProps={{
                                    shrink: true, // Ensures the label stays at the top when value is present
                                }}
                            />

                            <TextField
                                label="Residential Address *"
                                variant="outlined"
                                size="medium"
                                fullWidth
                                {...register('address', {
                                    required: 'Address is required',
                                    minLength: {
                                        value: 3,
                                        message: 'Residential Address must be at least 3 characters long',
                                    },
                                    maxLength: {
                                        value: 30,
                                        message: 'Residential Address cannot exceed 30 characters',
                                    },
                                    validate: {
                                        noSpecialChars: (value) =>
                                            /^[a-zA-Z\s]+$/.test(value) || 'State must contain only alphabets',
                                    },
                                })}
                                error={!!errors.address}
                                helperText={errors.address?.message}
                                InputLabelProps={{
                                    shrink: true, // Ensures the label stays at the top when value is present
                                }}
                            />

                            <TextField
                                label="State *"
                                variant="outlined"
                                size="medium"
                                fullWidth
                                {...register('state', {
                                    required: 'State is required',
                                    minLength: {
                                        value: 3,
                                        message: 'State must be at least 3 characters long',
                                    },
                                    maxLength: {
                                        value: 30,
                                        message: 'State cannot exceed 30 characters',
                                    },
                                    validate: {
                                        noSpecialChars: (value) =>
                                            /^[a-zA-Z\s]+$/.test(value) || 'State must contain only alphabets',
                                    },
                                })}
                                error={!!errors.state}
                                helperText={errors.state?.message}
                                InputLabelProps={{
                                    shrink: true, // Ensures the label stays at the top when value is present
                                }}
                            />

                            <TextField
                                label="District *"
                                variant="outlined"
                                size="medium"
                                fullWidth
                                {...register('district', {
                                    required: 'District is required',
                                    minLength: {
                                        value: 3,
                                        message: 'District must be at least 3 characters long',
                                    },
                                    maxLength: {
                                        value: 30,
                                        message: 'District cannot exceed 30 characters',
                                    },
                                    validate: {
                                        noSpecialChars: (value) =>
                                            /^[a-zA-Z\s]+$/.test(value) || 'District must contain only alphabets',
                                    },
                                })}
                                error={!!errors.district}
                                helperText={errors.district?.message}
                                InputLabelProps={{
                                    shrink: true, // Ensures the label stays at the top when value is present
                                }}
                            />




                            <TextField
                                label="City *"
                                variant="outlined"
                                size="medium"
                                fullWidth
                                {...register('city', {
                                    required: 'City is required',
                                    minLength: {
                                        value: 3,
                                        message: 'City must be at least 3 characters long',
                                    },
                                    maxLength: {
                                        value: 30,
                                        message: 'City cannot exceed 30 characters',
                                    },
                                    validate: {
                                        noSpecialChars: (value) =>
                                            /^[a-zA-Z\s]+$/.test(value) || 'City must contain only alphabets',
                                    },
                                })}
                                error={!!errors.city}
                                helperText={errors.city?.message}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />

                            <TextField
                                label="Alternative Phone Number"
                                variant="outlined"
                                size="medium"
                                type="text"
                                fullWidth
                                {...register('alternatePhoneNumber', {
                                    pattern: {
                                        value: /^[0-9]{10}$/,
                                        message: 'Please enter a valid 10-digit Alternative phone number',
                                    },
                                })}
                                error={!!errors.alternatePhoneNumber}
                                helperText={errors.alternatePhoneNumber?.message}

                            />

                            <TextField
                                label="Referral Code *"
                                variant="outlined"
                                size="medium"
                                type="text"
                                fullWidth
                                {...register('referralCode', {
                                    required: 'Referral Code is required',
                                })}
                                error={!!errors.referralCode}
                                helperText={errors.referralCode?.message}
                                InputLabelProps={{
                                    shrink: true, // Ensures the label stays at the top when value is present
                                }}
                            />

                            {/* Submit Button */}
                            <div className="mt-5">
                                <button
                                    type="submit"
                                    className="md:w-full w-full p-3 rounded-full text-white bg-gradient-to-l from-[#020065] to-[#0400CB] flex items-center justify-center"
                                >
                                    {isLoading ? (
                                        <svg
                                            aria-hidden="true"
                                            className="w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
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
                                        "Update"
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
                        </form>
                    </div>

                    <div className="col-span-12 hidden sm:block overflow-hidden md:col-span-6 w-full max-h-[100vh] order-2 md:order-1 responsive relative">
                        <img src={image3} alt="Image description" className="w-full h-auto object-cover" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <h1 className="text-white text-2xl md:text-4xl font-bold bg-opacity-75 p-4 rounded-lg flex flex-col justify-center items-center">
                                <img
                                    className="h-auto w-1/2 p-3 md:mt-0 sm:mt-20 mt-10 text-start"
                                    src={imageLogo}
                                    alt="Logo"
                                />
                                <div className="p-2">
                                    <h1 className="text-3xl text-white font-semibold">Welcome to</h1>
                                </div>
                                <div className="">
                                    <h1 className="text-4xl mt-2 text-white font-bold pt-4">Algo Achievers</h1>
                                </div>
                            </h1>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
};

export default EditCustomerProfile;

import { createCustomer } from "../../network/Customer/page";
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
import { Radio, FormControlLabel, FormControl, FormLabel, RadioGroup, TextField, InputAdornment } from '@mui/material';
import { PwaContext } from "../../context/PwaContext/page";
import backButton from "../../assets/Logos/backButton.png"
import { useForm } from 'react-hook-form';
import { useLanguage } from "../../context/Language/loginContext";
import { useToast } from "../../context/Toast/toastHook";
import { goBack } from "../../utils/Functions/goBackScreen";
import translations from "../../utils/Json/translation.json"

const SignupPage = () => {

    const {
        register,
        handleSubmit,
        setValue,
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
            ...(data.alternatePhoneNumber && { alternate_mobile_no: data.alternatePhoneNumber }),
        };

        console.log(payload, "Payload");
        let resp;
        try {
            resp = await createCustomer(payload);
            if (resp.data.status === 200) {
                setisLoading(false);
                localStorage.setItem("customerDetails", JSON.stringify(resp.data.data.customer));
                localStorage.setItem("tokenDetails", resp.data.data.token);
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


    useEffect(() => {
        const mob = localStorage.getItem("tempMobileNumber")
        setValue("phoneNumber", mob)
    }, [])

    return (
        <>
            <div className="h-screen flex flex-col">
                {/* Mobile Header */}
                <div className="h-[60px] fixed top-100 mb-4 z-10 w-full sm:hidden  bg-gradient-to-l from-[#020065] to-[#0400CB] flex flex-row p-3">
                    <img src={backButton} onClick={goBack} className="w-8 h-8" alt="Back" />
                    <p className="text-white font-semibold my-1">{translations.registerModule.heading[language]}</p>
                </div>

                {/* Main Content */}
                <div className="h-full bg-white grid grid-cols-12 md:grid-cols-12 md:overflow-hidden md:p-0 sm:p-10">
                    {/* Form Section */}
                    <div className="col-span-12 md:col-span-6 w-full order-1 md:order-2 md:px-20 mt-10 overflow-auto">
                        <div className="flex flex-row">
                            <p style={{ color: '#020065' }} className="mx-5 hidden sm:block text-start font-semibold text-3xl">
                                {translations.registerModule.heading[language]}
                            </p>
                        </div>
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="my-5 grid grid-cols-1 gap-4 md:mx:0 mx-5 py-3"
                        >
                            <TextField
                                label={translations.registerModule.fullname_field[language]}
                                variant="outlined"
                                size="medium"
                                fullWidth
                                {...register('fullName', {
                                    required: `${translations.validations.fullname_1[language]}`,
                                    minLength: {
                                        value: 3,
                                        message: `${translations.validations.fullname_3[language]}`,
                                    },
                                    maxLength: {
                                        value: 30,
                                        message: `${translations.validations.fullname_4[language]}`,
                                    },
                                    validate: {
                                        noSpecialChars: (value) =>
                                            /^[a-zA-Z\s]+$/.test(value) || `${translations.validations.fullname_2[language]}`,
                                    },
                                })}
                                error={!!errors.fullName}
                                helperText={errors.fullName?.message}
                            />

                            <TextField
                                label={translations.registerModule.phone_field[language]}
                                variant="outlined"
                                size="medium"
                                disabled
                                type="number"
                                fullWidth
                                {...register('phoneNumber', {
                                    required: `${translations.validations.phoneField_1[language]}`,
                                    pattern: {
                                        value: /^[0-9]{10}$/,
                                        message: `${translations.validations.phoneField_2[language]}`,
                                    },
                                    pattern: {
                                        value: /^[9876][0-9]{9}$/,
                                        message: `Invalid Phone
                                         Number`,
                                    },
                                })}
                                error={!!errors.phoneNumber}
                                helperText={errors.phoneNumber?.message}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                InputProps={{
                                    inputProps: {
                                        style: {
                                            MozAppearance: "textfield", // Removes spinner in Firefox
                                        },
                                    },
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <span style={{ fontWeight: 'medium', color: "rgba(0, 0, 0, 0.38)" }}>+91</span>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <TextField
                                label={translations.registerModule.email_id[language]}
                                variant="outlined"
                                type="text"
                                size="medium"
                                fullWidth
                                {...register('email', {
                                    required: `${translations.validations.email_1[language]}`,
                                    maxLength: {
                                        value: 40,
                                        message: 'Email cannot exceed 40 characters',
                                    },
                                    pattern: {
                                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                        message: 'Invalid email address',
                                    },
                                })}
                                error={!!errors.email}
                                helperText={errors.email?.message}
                            />

                            <TextField
                                variant="outlined"
                                label={translations.registerModule.data_of_birth[language]}
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
                                    shrink: true,
                                }}
                            />

                            <TextField
                                label={translations.registerModule.Residential_addressfield[language]}
                                variant="outlined"
                                size="medium"
                                fullWidth
                                {...register('address', {
                                    required: 'Address is required',
                                })}
                                error={!!errors.address}
                                helperText={errors.address?.message}
                            />

                            <TextField
                                label={translations.registerModule.statefield[language]}
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
                                        value: 40,
                                        message: 'State cannot exceed 40 characters',
                                    },
                                    validate: {
                                        noSpecialChars: (value) =>
                                            /^[a-zA-Z\s]+$/.test(value) || 'State must contain only alphabets',
                                    },
                                })}
                                error={!!errors.state}
                                helperText={errors.state?.message}
                            />

                            <TextField
                                label={translations.registerModule.Destrictfield[language]}
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
                                        value: 40,
                                        message: 'District cannot exceed 40 characters',
                                    },
                                    validate: {
                                        noSpecialChars: (value) =>
                                            /^[a-zA-Z\s]+$/.test(value) || 'District must contain only alphabets',
                                    },
                                })}
                                error={!!errors.district}
                                helperText={errors.district?.message}
                            />

                            <TextField
                                label={translations.registerModule.cityfield[language]}
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
                                        value: 40,
                                        message: 'City cannot exceed 40 characters',
                                    },
                                    validate: {
                                        noSpecialChars: (value) =>
                                            /^[a-zA-Z\s]+$/.test(value) || 'City must contain only alphabets',
                                    },
                                })}
                                error={!!errors.city}
                                helperText={errors.city?.message}
                            />

                            <TextField
                                label={translations.registerModule.altno_field[language]}
                                variant="outlined"
                                size="medium"
                                type="number"
                                fullWidth
                                {...register('alternatePhoneNumber', {
                                    pattern: {
                                        value: /^[0-9]{10}$/,
                                        message: 'Please enter a valid 10-digit Alternative phone number',
                                    },
                                    pattern: {
                                        value: /^[9876][0-9]{9}$/,
                                        message: `Invalid Phone Number`,
                                    },
                                })}
                                error={!!errors.alternatePhoneNumber}
                                helperText={errors.alternatePhoneNumber?.message}

                                InputProps={{
                                    inputProps: {
                                        style: {
                                            MozAppearance: "textfield",
                                        },
                                    },
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <span style={{ fontWeight: 'medium', color: "#1D1B20" }}>+91</span>
                                        </InputAdornment>
                                    ),
                                }}

                                onInput={(e) => {
                                    if (e.target.value.length > 10) {
                                        e.target.value = e.target.value.slice(0, 10); // Truncate input to 12 digits
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

                            />

                            <TextField
                                label={translations.registerModule.Referralcodefield[language]}
                                variant="outlined"
                                size="medium"
                                type="text"
                                fullWidth
                                {...register('referralCode', {
                                    required: 'Referral Code is required',
                                })}
                                error={!!errors.referralCode}
                                helperText={errors.referralCode?.message}
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
                                        `${translations.registerModule.continue_btn[language]}`
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
                                <div className="p-2 ">
                                    <h1 className="text-3xl text-white font-semibold"> {translations.loginScreen.sendOtpScreen.heading1[language]}</h1>
                                </div>

                                <div className="">
                                    <h1 className="text-4xl mt-2 text-white font-bold pt-4"> {translations.loginScreen.sendOtpScreen.heading2[language]}</h1>
                                </div>
                            </h1>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
};

export default SignupPage;

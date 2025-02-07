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
import { Radio, FormControlLabel, FormControl, FormLabel, RadioGroup, TextField, InputAdornment, Checkbox, IconButton } from '@mui/material';
import { PwaContext } from "../../context/PwaContext/page";
import backButton from "../../assets/Logos/backButton.png"
import { useForm } from 'react-hook-form';
import { useLanguage } from "../../context/Language/loginContext";
import { useToast } from "../../context/Toast/toastHook";
import { goBack } from "../../utils/Functions/goBackScreen";
import translations from "../../utils/Json/translation.json"
import { saveTokenForFcm } from "../../network/Fcm/saveToken";
import { AddAPhoto, CheckBox, DeleteForeverOutlined } from "@mui/icons-material";

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
    const [isChecked, setIsChecked] = useState(false);
    const [ImageError, setImageError] = useState("")
    const [ErrorMessageTop, setErrorMessageTop] = useState("")

    const handleChange = (event) => {
        setIsChecked(event.target.checked);
    };

    const [image, setImage] = useState(null);

    // Convert selected file to Base64
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file && (file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/jpg")) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result); // Set Base64 image
            };
            reader.readAsDataURL(file);
            setImageError("")
        } else {
            setImageError("Please select a valid image file (JPEG, JPG, PNG).");
        }
    };

    // Remove the image
    const handleRemoveImage = () => {
        setImage(null);
    };


    const onSubmit = async (data) => {
        setisLoading(true);

        if (!isChecked) {
            setisLoading(false);
            setErrorMessageTop("You Need to accept the terms and conditions to proceed");
            return
        }

        // if (!image) {
        //     setisLoading(false);
        //     setErrorMessage("Profile Image Is Required");
        //     return
        // }

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
            referred_by: data.referralCode,
            district: data.district,
            city: data.city,
            address: data.address,
            language_preference: language.toLowerCase(),
            token: tokenDetails,
            isTermsAccepted: isChecked,
            ...(image && { profile_image: image }),
            ...(data.alternatePhoneNumber && { alternate_mobile_no: data.alternatePhoneNumber }),
        };

        let resp;
        try {
            resp = await createCustomer(payload);
            if (resp.data.status === 200) {
                setisLoading(false);
                localStorage.setItem("customerDetails", JSON.stringify(resp.data.data.customer));
                localStorage.setItem("tokenDetails", resp.data.data.token);

                const fcmToken = localStorage.getItem("fcmToken")
                if (fcmToken) {
                    const data = {
                        fcmData: fcmToken
                    }
                    const saveToken = await saveTokenForFcm(data);
                    console.log(saveToken);
                }

                setErrorMessage("");
                setErrorMessageTop("");
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
                            <p className="text-md text-start text-gray-500">{translations.registerModule.profileImage[language]}</p>

                            <div className="flex flex-col items-center justify-center">
                                {/* Label for Image Upload */}

                                <div
                                    className={`border-dashed border-2 ${image ? "border-gray-300" : "border-gray-500"
                                        } flex items-center justify-center rounded-full relative`}
                                >
                                    {image ? (
                                        <>
                                            {/* Uploaded Image */}
                                            <div className="relative w-full h-full group">
                                                {/* Image */}
                                                <img
                                                    src={image}
                                                    alt="Uploaded"
                                                    className="object-cover w-full h-full rounded-full w-40 h-40 sm:w-40 sm:h-40 "
                                                />

                                                {/* Overlay */}
                                                <div className="absolute inset-0 bg-black bg-opacity-10 rounded-full flex justify-end items-start group-hover:bg-opacity-20 transition duration-300">
                                                    {/* Delete Icon */}
                                                    <IconButton
                                                        aria-label="delete"
                                                        size="small"
                                                        className="absolute top-2 right-2 bg-white text-red-500 p-2 rounded-full group-hover:bg-red-500 group-hover:text-white shadow-md transition duration-300"
                                                        onClick={handleRemoveImage}
                                                    >
                                                        <DeleteForeverOutlined fontSize="small" />
                                                    </IconButton>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <label
                                            htmlFor="upload-image"
                                            className="flex flex-col w-40 h-40 sm:w-40 sm:h-40  items-center justify-center cursor-pointer text-gray-400"
                                        >
                                            <AddAPhoto fontSize="large" />
                                            <span className="text-sm">{translations.registerModule.profileImageField[language]}</span>
                                            <input
                                                id="upload-image"
                                                type="file"
                                                accept="image/jpeg,image/png,image/jpg"
                                                className="hidden w-40 h-40 sm:w-40 sm:h-40 "
                                                onChange={handleImageUpload}
                                            />
                                        </label>
                                    )}
                                </div>
                            </div>

                            {ImageError &&
                                <p className="text-start text-red-400 text-sm my-3">{ImageError}</p>
                            }

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
                                        message: translations.validations.phoneField_3[language],
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
                                        message: `${translations.validations.email_3[language]}`,
                                    },
                                    pattern: {
                                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                        message: `${translations.validations.email_2[language]}`,
                                    },
                                })}
                                error={!!errors.email}
                                helperText={errors.email?.message}
                            />

                            <TextField
                                variant="outlined"
                                placeholder="Select Date"
                                label={translations.registerModule.data_of_birth[language]}
                                type="date"
                                size="medium"
                                {...register('dateOfBirth', {
                                    required: `${translations.validations.dob_1[language]}`,
                                    validate: {
                                        notFutureDate: (value) => {
                                            const today = new Date();
                                            const selectedDate = new Date(value);
                                            return selectedDate <= today || `${translations.validations.dob[language]}`;
                                        },
                                        minimumAge: (value) => {
                                            const today = new Date();
                                            const selectedDate = new Date(value);
                                            const minDate = new Date();
                                            minDate.setFullYear(today.getFullYear() - 18);
                                            return selectedDate <= minDate || `${translations.validations.dob_2[language]}`;
                                        },
                                        withinLast100Years: (value) => {
                                            const today = new Date();
                                            const selectedDate = new Date(value);
                                            const maxDate = new Date();
                                            maxDate.setFullYear(today.getFullYear() - 150);
                                            return selectedDate >= maxDate || `${translations.validations.dob_3[language]}`;
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
                                    required: `${translations.validations.address_1[language]}`,
                                    pattern: {
                                        value: /^[a-zA-Z0-9 ,./-]+$/,
                                        message: `${translations.validations.address_2[language]}`,
                                    },
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
                                    required: `${translations.validations.state_1[language]}`,
                                    minLength: {
                                        value: 3,
                                        message: `${translations.validations.state_2[language]}`,
                                    },
                                    maxLength: {
                                        value: 40,
                                        message: `${translations.validations.state_3[language]}`,
                                    },
                                    validate: {
                                        noSpecialChars: (value) =>
                                            /^[a-zA-Z\s]+$/.test(value) || `${translations.validations.state_4[language]}`,
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
                                    required: `${translations.validations.district_1[language]}`,
                                    minLength: {
                                        value: 3,
                                        message: `${translations.validations.district_2[language]}`,
                                    },
                                    maxLength: {
                                        value: 40,
                                        message: `${translations.validations.district_3[language]}`,
                                    },
                                    validate: {
                                        noSpecialChars: (value) =>
                                            /^[a-zA-Z\s]+$/.test(value) || `${translations.validations.district_4[language]}`,
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
                                    required: `${translations.validations.city_1[language]}`,
                                    minLength: {
                                        value: 3,
                                        message: `${translations.validations.city_2[language]}`,
                                    },
                                    maxLength: {
                                        value: 40,
                                        message: `${translations.validations.city_3[language]}`,
                                    },
                                    validate: {
                                        noSpecialChars: (value) =>
                                            /^[a-zA-Z\s]+$/.test(value) || `${translations.validations.city_4[language]}`,
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
                                        value: /^[9876][0-9]{9}$/,
                                        message: `${translations.validations.phoneField_3[language]}`,
                                    },
                                })}
                                error={!!errors.alternatePhoneNumber}
                                helperText={errors.alternatePhoneNumber?.message}
                                InputProps={{
                                    inputProps: {
                                        style: { MozAppearance: "textfield" }, // Removes spinner in Firefox
                                    },
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <span style={{ fontWeight: 'medium', color: "#1D1B20" }}>+91</span>
                                        </InputAdornment>
                                    ),
                                }}
                                onInput={(e) => {
                                    if (e.target.value.length > 10) {
                                        e.target.value = e.target.value.slice(0, 10); // Truncate input to 10 digits
                                    }
                                }}
                                onWheel={(e) => e.target.blur()} // Prevents scrolling from changing the number
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
                                    required: false,
                                })}
                                error={!!errors.referralCode}
                                helperText={errors.referralCode?.message}
                            />

                            <div className="flex flex-row">
                                <Checkbox
                                    checked={isChecked}
                                    onChange={handleChange}
                                    sx={{
                                        width: { xs: 30, sm: 30 }, // Mobile: 40px, Desktop: 20px
                                        height: { xs: 30, sm: 30 }, // Mobile: 40px, Desktop: 20px
                                        "& .MuiSvgIcon-root": { fontSize: { xs: 30, sm: 30 } }, // Adjust icon size
                                    }}
                                />
                                <p className="text-sm text-start mx-2 text-gray-600 font-semibold">
                                    Investments are subject to the market conditions and risks associated with the Indian stock market.
                                </p>
                            </div>

                            <div className="text-start">
                                {ErrorMessageTop && (
                                    <span style={{ fontSize: '14px' }} className="text-red-400 text-xs text-start">
                                        {ErrorMessageTop}
                                    </span>
                                )}
                            </div>
                            {/* Submit Button */}
                            <div className="mt-5">
                                <button
                                    disabled={isLoading}
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
                </div >
            </div >

        </>
    );
};

export default SignupPage;

import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import imageLogo from "../../assets/Logos/logo1.png";
import image3 from "../../assets/Images/sideImage.png";
import { TextField } from '@mui/material';
import backButton from "../../assets/Logos/backButton.png";
import { useForm } from 'react-hook-form';
import { useToast } from "../../context/Toast/toastHook";
import { goBack } from "../../utils/Functions/goBackScreen";
import { addBankDetails, addNomineeDetails, UpdateNominee } from "../../network/BankDetails/page";
import { useLanguage } from "../../context/Language/loginContext";
import translations from "../../utils/Json/translation.json"
import { getCustomerById } from "../../network/Customer/page";
import { DeleteForever } from "@mui/icons-material";

const AddNominee = () => {

    const {
        register,
        handleSubmit,
        setValue,
        trigger,
        watch,
        formState: { errors },
    } = useForm();

    const { addToast } = useToast();


    const handlePreviewClick = (base64String) => {
        if (base64String.startsWith('http://') || base64String.startsWith('https://')) {
            window.open(base64String, '_blank');
        } else {
            try {
                const byteCharacters = atob(base64String.split(',')[1]);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: 'application/pdf' });
                const blobUrl = URL.createObjectURL(blob);
                window.open(blobUrl, '_blank');
            } catch (error) {
                console.error("Error processing the Base64 string:", error);
            }
        }
    };


    const handleSuccessClick = (SuccessMessage) => {
        addToast(SuccessMessage, 'success');
    };

    const [UpdateNomineeDetails, setUpdateNomineeDetails] = useState(false)
    const [AadhaarBase64, setAadhaarBase64] = useState("")
    const [PanBase64, setPanBase64] = useState("")
    const [ChequeBase64, setChequeBase64] = useState("")
    const [PhotoBase64, setPhotoBase64] = useState("")
    const fileInputRef = useRef(null);
    const fileInputRef1 = useRef(null);


    const handleDelete = (field) => {
        if (field === "photo") {
            setPhotoBase64("");
            if (fileInputRef.current) {
                fileInputRef.current.value = ""; // Reset file input field
            }
        }
        if (field === "cheque") {
            setChequeBase64("");
            if (fileInputRef1.current) {
                fileInputRef1.current.value = ""; // Reset file input field
            }
        }
    }

    const { language } = useLanguage();
    const navigate = useNavigate();
    const [ErrorMessage, setErrorMessage] = useState("");
    const [isLoading, setisLoading] = useState(false);

    const watchbankAccountNumber = watch("bank_acc_no");
    const watchbankIfsc = watch("bank_Ifsc_code");
    const watchbankBranch = watch("bank_branch_name");
    const watchNomineeName = watch("nominee_name");
    const watchAadhaarNumber = watch("aadhaar_number");
    const watchPanNumber = watch("pan_no");

    useEffect(() => {
        console.log(AadhaarBase64)
    }, [AadhaarBase64])

    useEffect(() => {
        const data = localStorage.getItem("customerDetails");
        const customer = JSON.parse(data);
        if (!customer) {
            navigate("/")
        }
        fetchCustomerDetails(customer._id)
    }, []);

    const fetchCustomerDetails = async (id) => {
        setisLoading(true);

        try {
            if (id) {

                const resp = await getCustomerById(id);
                console.log(resp, "resp")

                if (resp.data.status === 200) {

                    if (resp.data.data.customer.nominee_id) {
                        setUpdateNomineeDetails(true);
                    }

                    setValue("bank_acc_no", resp.data.data.customer.nominee_id?.nominee_bank_acc_no);
                    setValue("bank_Ifsc_code", resp.data.data.customer.nominee_id?.nominee_bank_ifsc_code);
                    setValue("bank_branch_name", resp.data.data.customer.nominee_id?.nominee_bank_branch);
                    setValue("nominee_name", resp.data.data.customer.nominee_id?.nominee_name);
                    setValue("aadhaar_number", resp.data.data.customer.nominee_id?.nominee_aadhar_no);
                    setValue("pan_no", resp.data.data.customer.nominee_id?.nominee_pan_no);
                    setAadhaarBase64(resp.data.data.customer.nominee_id?.nominee_aadhar_file);
                    setChequeBase64(resp.data.data.customer.nominee_id?.nominee_cancelled_cheque);
                    setPanBase64(resp.data.data.customer.nominee_id?.nominee_pan_file);
                    setPhotoBase64(resp.data.data.customer.nominee_id?.nominee_photo)

                    const nomineeDob = resp.data.data.customer.nominee_id?.nominee_dob;

                    if (nomineeDob) {
                        const formattedDate = new Date(nomineeDob).toISOString().split('T')[0]; // Extract YYYY-MM-DD
                        setValue("dateOfBirth", formattedDate, { shouldValidate: true, shouldDirty: true });
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
            nominee_bank_acc_no: data.bank_acc_no,
            nominee_bank_ifsc_code: data.bank_Ifsc_code,
            nominee_bank_branch: data.bank_branch_name,
            nominee_dob: data.dateOfBirth,

            nominee_name: data.nominee_name,
            nominee_aadhar_no: data.aadhaar_number,
            nominee_pan_no: data.pan_no,

            nominee_aadhar_file: AadhaarBase64,
            nominee_pan_file: PanBase64,
            nominee_photo: PhotoBase64,
            nominee_cancelled_cheque: ChequeBase64
        };

        if (UpdateNomineeDetails) {

            try {
                const updateResponse = await UpdateNominee(payload);
                console.log(updateResponse, "updateResponse")
                if (updateResponse.data.status === 200) {
                    handleSuccessClick(updateResponse.data.data.message);
                    navigate("/profile-and-settings");
                } else {
                    setErrorMessage(updateResponse.data.message);
                }

            } catch (error) {
                setErrorMessage("An error occurred. Please try again.");
            } finally {
                setisLoading(false);
            }
        }

        else {
            try {
                const addResponse = await addNomineeDetails(payload);
                console.log(addResponse, "addResponse")
                if (addResponse.data.status === 201) {
                    handleSuccessClick(addResponse.data.data.message);
                    navigate("/profile-and-settings");
                } else {
                    setErrorMessage(addResponse.data.message);
                }
            } catch (error) {
                setErrorMessage("An error occurred. Please try again.");
            } finally {
                setisLoading(false);
            }
        }


    };

    return (
        <>
            <div className="h-screen flex flex-col">
                <div className="h-[60px] fixed top-100 mb-4 z-10 w-full sm:hidden  bg-gradient-to-l from-[#020065] to-[#0400CB] flex flex-row p-3">
                    <img src={backButton} onClick={goBack} className="w-8 h-8" alt="Back" />
                    <p className="text-white font-semibold my-1">{UpdateNomineeDetails ? `${translations.global.update[language]}` : `${translations.global.add[language]}`} {translations.global.nomineeDetails[language]}</p>
                </div>

                <div className="h-full bg-white grid grid-cols-12 md:grid-cols-12 md:overflow-hidden md:p-0 sm:p-10">
                    <div className="col-span-12 md:col-span-6 w-full order-1 md:order-2 md:px-20 mt-10 overflow-auto">
                        <div className="flex flex-row">
                            <div>
                                <p style={{ color: '#020065' }} className="mx-5 hidden sm:block text-start font-semibold text-3xl">
                                    {UpdateNomineeDetails ? `${translations.global.update[language]}` : `${translations.global.add[language]}`} {translations.global.nomineeDetails[language]}
                                </p>
                            </div>
                        </div>
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="my-5 grid grid-cols-1 gap-4 md:mx:0 mx-5 py-3 mb-20"
                        >

                            <TextField
                                label={translations.Nominee.nomineeField[language]}
                                variant="outlined"
                                fullWidth
                                {...register("nominee_name", {
                                    required: translations.validations.nomineeValidations.nominee[language],
                                    minLength: {
                                        value: 3,
                                        message: translations.validations.nomineeValidations.nominee1[language],
                                    },
                                    maxLength: {
                                        value: 40,
                                        message: translations.validations.nomineeValidations.nominee2[language],
                                    },
                                    pattern: {
                                        value: /^[A-Za-z\s]+$/,
                                        message: translations.validations.nomineeValidations.nominee3[language],
                                    },
                                })}
                                error={!!errors.nominee_name}
                                helperText={errors.nominee_name?.message}

                                onInput={(e) => {
                                    e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, "").slice(0, 40);
                                }}

                                InputLabelProps={{
                                    shrink: watchNomineeName,
                                }}
                            />

                            <TextField
                                variant="outlined"
                                label={translations.registerModule.data_of_birth[language]}
                                type="date"
                                size="medium"
                                {...register('dateOfBirth', {
                                    required: false,
                                    validate: {
                                        notFutureDate: (value) => {
                                            if (!value) return true; // Skip validation if no date is selected
                                            const today = new Date();
                                            const selectedDate = new Date(value);
                                            return selectedDate <= today || `${translations.validations.dob[language]}`;
                                        },
                                        withinLast100Years: (value) => {
                                            if (!value) return true; // Skip validation if no date is selected
                                            const today = new Date();
                                            const selectedDate = new Date(value);
                                            const maxDate = new Date();
                                            maxDate.setFullYear(today.getFullYear() - 100);
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
                                label={translations.BankAccount.bankAccountNumber[language]}
                                variant="outlined"
                                fullWidth
                                type="number"
                                {...register("bank_acc_no", {
                                    required: false,
                                    pattern: {
                                        value: /^\d{9,18}$/,
                                        message: translations.validations.bankDetails.bankAccount1[language],
                                    },
                                })}
                                onWheel={(e) => e.target.blur()}
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

                            <TextField
                                label={translations.BankAccount.ifscCode[language]}
                                variant="outlined"
                                fullWidth
                                {...register("bank_Ifsc_code", {
                                    required: false,
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
                                    required: false,
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

                                onInput={(e) => {
                                    e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, "").slice(0, 40);
                                }}

                                InputLabelProps={{
                                    shrink: watchbankBranch,
                                }}
                            />


                            <TextField
                                label={translations.Nominee.aadharField[language]}  // Update label for Aadhaar
                                variant="outlined"
                                fullWidth
                                {...register("aadhaar_number", {
                                    required: false,
                                    minLength: {
                                        value: 12,
                                        message: translations.validations.nomineeValidations.aadhaarField1[language],
                                    },
                                    maxLength: {
                                        value: 12,
                                        message: translations.validations.nomineeValidations.aadhaarField1[language],
                                    },
                                    pattern: {
                                        value: /^[0-9]{12}$/,
                                        message: translations.validations.nomineeValidations.aadhaarField1[language],
                                    },
                                })}
                                error={!!errors.aadhaar_number}
                                helperText={errors.aadhaar_number?.message}

                                onInput={(e) => {
                                    e.target.value = e.target.value.replace(/\D/g, "").slice(0, 12);  // Allow only numbers, max 12 digits
                                }}

                                InputLabelProps={{
                                    shrink: watchAadhaarNumber,
                                }}
                            />


                            <TextField
                                label={translations.Nominee.panNumber[language]}
                                variant="outlined"
                                fullWidth
                                {...register("pan_no", {
                                    required: false,
                                    minLength: {
                                        value: 10,
                                        message: translations.validations.nomineeValidations.panNumberfield[language],
                                    },
                                    maxLength: {
                                        value: 10,
                                        message: translations.validations.nomineeValidations.panNumberfield[language],
                                    },
                                    pattern: {
                                        value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
                                        message: translations.validations.nomineeValidations.valid[language],
                                    },
                                })}
                                error={!!errors.pan_no}
                                helperText={errors.pan_no?.message}

                                onInput={(e) => {
                                    e.target.value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10);
                                }}

                                InputLabelProps={{
                                    shrink: watchPanNumber,
                                }}
                            />

                            {AadhaarBase64 && (
                                <p
                                    className="bg-gradient-to-l from-[#020065] to-[#0400CB] bg-clip-text text-transparent text-xs text-end cursor-pointer"
                                    onClick={() => handlePreviewClick(AadhaarBase64)}
                                >
                                    {translations.global.preview[language]}
                                </p>
                            )}


                            <TextField
                                label={translations.Nominee.uploadAadhaar[language]}
                                variant="outlined"
                                fullWidth
                                type="file"
                                inputProps={{
                                    accept: ".pdf"
                                }}
                                {...register("aadhaar_pdf", {
                                    validate: (value) => {
                                        if (!value || value.length === 0) {
                                            return true; // No file, no validation required
                                        }
                                        const file = value[0];
                                        if (file.type !== "application/pdf") {
                                            return translations.validations.nomineeValidations.aadhaarUpload1[language]; // Invalid file type
                                        }
                                        if (file.size > 2 * 1024 * 1024) {
                                            return translations.validations.nomineeValidations.aadhaarUpload2[language]; // File size too large
                                        }
                                        return true;
                                    }
                                })}
                                error={!!errors.aadhaar_pdf}
                                helperText={errors.aadhaar_pdf?.message}
                                onChange={(e) => {
                                    const file = e.target.files;
                                    if (file.length > 0) {
                                        const reader = new FileReader();
                                        reader.readAsDataURL(file[0]);
                                        reader.onload = () => {
                                            setAadhaarBase64(reader.result);
                                        };
                                    }
                                }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />

                            {PanBase64 && (
                                <p
                                    className="bg-gradient-to-l from-[#020065] to-[#0400CB] bg-clip-text text-transparent text-xs text-end cursor-pointer"
                                    onClick={() => handlePreviewClick(PanBase64)}
                                >
                                    {translations.global.preview[language]}

                                </p>
                            )}


                            <TextField
                                label={translations.Nominee.uploadPan[language]}
                                variant="outlined"
                                fullWidth
                                type="file"
                                inputProps={{
                                    accept: ".pdf"
                                }}
                                {...register("pan_pdf", {
                                    validate: (value) => {
                                        if (!value || value.length === 0) {
                                            return true; // No file, no validation required
                                        }
                                        const file = value[0];
                                        if (file.type !== "application/pdf") {
                                            return translations.validations.nomineeValidations.panUpload1[language]; // Invalid file type
                                        }
                                        if (file.size > 2 * 1024 * 1024) {
                                            return translations.validations.nomineeValidations.panUpload2[language]; // File size too large
                                        }
                                        return true;
                                    }
                                })}
                                error={!!errors.pan_pdf}
                                helperText={errors.pan_pdf?.message}
                                onChange={(e) => {
                                    const file = e.target.files;
                                    if (file.length > 0) {
                                        const reader = new FileReader();
                                        reader.readAsDataURL(file[0]);
                                        reader.onload = () => {
                                            setPanBase64(reader.result);
                                        };
                                    }
                                }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />

                            {PhotoBase64 ? (
                                <>
                                    <p className="text-start text-sm">Uploaded Photo</p>
                                    <div className="relative w-1/3 border-2 border-gray-300 rounded-md overflow-hidden">
                                        <button
                                            onClick={() => handleDelete("photo")}
                                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow-md hover:bg-red-600"
                                        >
                                            <DeleteForever />
                                        </button>

                                        <img className="w-full h-auto" src={PhotoBase64} alt="Preview" />
                                    </div>
                                </>
                            ) : (

                                <TextField
                                    type="file"
                                    variant="outlined"
                                    label={translations.Nominee.uploadPhoto[language]}
                                    size="medium"
                                    {...register('selfie_photo', {
                                        required: false,
                                        validate: {
                                            validFileType: (fileList) => {
                                                if (!fileList || fileList.length === 0) return true; // Skip validation if no file is selected

                                                const file = fileList[0];
                                                const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

                                                if (!allowedTypes.includes(file.type)) {
                                                    return translations.validations.nomineeValidations.selfieUpload1[language]; // Invalid file type
                                                }

                                                if (file.size > 2 * 1024 * 1024) {
                                                    return translations.validations.nomineeValidations.selfieUpload2[language]; // File size too large
                                                }
                                                return true;
                                            },
                                        },
                                    })}
                                    error={!!errors.selfie_photo}
                                    helperText={errors.selfie_photo?.message}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    onChange={(e) => {
                                        const file = e.target.files;
                                        if (file.length > 0) {
                                            const reader = new FileReader();
                                            reader.readAsDataURL(file[0]);
                                            reader.onload = () => {
                                                setPhotoBase64(reader.result);
                                            };
                                        }
                                    }}
                                    inputProps={{
                                        accept: 'image/jpeg, image/jpg, image/png', // Restrict file selection to images only
                                    }}
                                    inputRef={(input) => (fileInputRef.current = input)}
                                />
                            )}




                            {ChequeBase64 ? (
                                <>
                                    <p className="text-start text-sm">Uploaded Cheque Photo</p>
                                    <div className="relative w-1/3 border-2 border-gray-300 rounded-md overflow-hidden">
                                        <button
                                            onClick={() => handleDelete("cheque")}
                                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow-md hover:bg-red-600"
                                        >
                                            <DeleteForever />
                                        </button>

                                        <img className="w-full h-auto" src={ChequeBase64} alt="Preview" />
                                    </div>
                                </>
                            ) : (

                                <TextField
                                    type="file"
                                    variant="outlined"
                                    label={translations.Nominee.cheque[language]}
                                    size="medium"
                                    {...register('cheque_photo', {
                                        required: false,
                                        validate: {
                                            validFileType: (fileList) => {
                                                if (!fileList || fileList.length === 0) return true; // Skip validation if no file is selected

                                                const file = fileList[0];
                                                const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

                                                if (!allowedTypes.includes(file.type)) {
                                                    return translations.validations.nomineeValidations.chequeUpload1[language]; // Invalid file type
                                                }

                                                if (file.size > 2 * 1024 * 1024) {
                                                    return translations.validations.nomineeValidations.chequeUpload2[language]; // File size too large
                                                }
                                                return true;
                                            },
                                        },
                                    })}
                                    error={!!errors.cheque_photo}
                                    helperText={errors.cheque_photo?.message}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    onChange={(e) => {
                                        const file = e.target.files;
                                        if (file.length > 0) {
                                            const reader = new FileReader();
                                            reader.readAsDataURL(file[0]);
                                            reader.onload = () => {
                                                setChequeBase64(reader.result);
                                            };
                                        }
                                    }}
                                    inputProps={{
                                        accept: 'image/jpeg, image/jpg, image/png', // Restrict file selection to images only
                                    }}

                                    inputRef={(input) => (fileInputRef1.current = input)}

                                />
                            )}




                            <div className="">

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
                                                    `${UpdateNomineeDetails ? `${translations.global.update[language]}` : `${translations.BankAccount.saveButton[language]}`}`
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
                                                    `${UpdateNomineeDetails ? `${translations.global.update[language]}` : `${translations.BankAccount.saveButton[language]}`}`
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

export default AddNominee;
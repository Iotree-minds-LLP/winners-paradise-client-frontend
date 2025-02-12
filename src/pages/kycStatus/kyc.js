import { useEffect, useState } from "react";
import bellIcon from "../../assets/Logos/bellIcon2.png";
import userIcon from "../../assets/Logos/usericon.png";
import backImage from "../../assets/Images/backImage.jpg"
import imageLogo from "../../assets/Logos/Algo-Achievers-Logo_009600960_38721 1 (1).png";
import { Link, useNavigate } from "react-router-dom";
import { getCustomerById } from "../../network/Customer/page";
import backButton from "../../assets/Logos/backButton.png"
import acrrowright from "../../assets/Images/arrow_circle_right.png"
import image2 from "../../assets/Images/robo 1 (1).png";
import { goBack } from "../../utils/Functions/goBackScreen";
import { FormControl, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { CheckBox } from "@mui/icons-material";
import { creteCustomerKycRequest, getKycDetailsByCustomerId } from "../../network/KycVerification/page";
import { useConsent } from "../../context/consent/consentProvider";
import { useToast } from "../../context/Toast/toastHook";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useLanguage } from "../../context/Language/loginContext";
import translations from "../../utils/Json/translation.json"

const KycStatusPage = () => {
    const [ShowConsentForm, setShowConsentForm] = useState(true)
    const { language, setLanguage } = useLanguage();
    const { isConsentAgreed, setIsConsentAgreed } = useConsent();
    const [isDisabled, setisDisabled] = useState(false);
    const [data, setdata] = useState([])
    const [errorMessage, seterrorMessage] = useState("");
    const { addToast } = useToast();
    const [kycCardShow, setkycCardShow] = useState(false)

    const handleSuccessClick = (SuccessMessage) => {
        addToast(SuccessMessage, 'success');
    };

    const [isLoading, setisLoading] = useState(false)
    const [response, setResponse] = useState([]);
    const [customerDetails, setCustomerDetails] = useState([]);
    const [isModalOpen, setisModalOpen] = useState(false);
    const navigate = useNavigate();
    const [KycRequestData, setKycRequestData] = useState({})

    useEffect(() => {
        onformSubmit2();
    }, []);

    const handleConsentSave = async () => {
        setisLoading(true);

        const payload = {
            is_consent_given: isConsentAgreed
        }
        try {
            const res = await creteCustomerKycRequest(payload);
            if (res?.data?.status === 200) {
                setisLoading(false);
                handleSuccessClick(res.data.data.message);
                navigate("/profile-and-settings")
            } else {
                setisLoading(false);
                seterrorMessage(res.data.error);
            }
        } catch (error) {
            setisLoading(false);
            seterrorMessage("Something went wrong");
        }
    }


    const onformSubmit2 = async () => {
        setkycCardShow(true);
        try {
            const res = await getKycDetailsByCustomerId(); // Fetching KYC details
            if (res.status === 500) {

                const data500 = [
                    { id: 1, title: "AADHAAR CARD", uploaded: 1 },
                    { id: 2, title: "PAN CARD", uploaded: 2 },
                    { id: 3, title: "CANCELLED CHEQUE", uploaded: 3 },
                    { id: 4, title: "SELFIE", uploaded: 4 },
                ];

                // Update all items to "Upload" for status 500
                const updatedData = data500.map(item => ({
                    ...item,
                    status: "Upload",
                    backgroundColor: '#F5F5F5',
                    textColor: '#000094',
                }));
                setdata(updatedData);
                setkycCardShow(false);
                setShowConsentForm(false);
            } else if (res.data.status === 200) {

                if (res?.data?.data?.is_consent_given) {
                    setShowConsentForm(false);
                    setIsConsentAgreed(res?.data?.data?.is_consent_given || false)
                    setisDisabled(true);
                }
                else if (isConsentAgreed) {
                    setShowConsentForm(true);
                    setisDisabled(false);
                    setIsConsentAgreed(true);
                }
                else {
                    setIsConsentAgreed(false)
                }

                setKycRequestData(res.data.data);
                const {
                    is_aadhar_verified,
                    is_pan_verified,
                    is_blank_cheque_verified,
                    is_profile_image_verified
                } = res.data.data;

                // Define mapping for statuses and styles
                const verificationStatuses = {
                    "NOT SUBMITTED": { status: "Upload", backgroundColor: '#F5F5F5', textColor: '#000094' },
                    "REVIEW PENDING": { status: "Review Pending", backgroundColor: '#000094', textColor: '#ffffff' },
                    "CLEARED": { status: "Cleared", backgroundColor: '#BBFF99', textColor: '#1C5400' },
                    "REJECTED": { status: "Rejected", backgroundColor: '#FFDA99', textColor: '#533400' },
                };

                const dataToBeUpdate = [
                    {
                        id: 1,
                        title: "AADHAAR CARD",
                        uploaded: 1,
                        ...verificationStatuses[is_aadhar_verified] || verificationStatuses["NOT SUBMITTED"],
                    },
                    {
                        id: 2,
                        title: "PAN CARD",
                        uploaded: 2,
                        ...verificationStatuses[is_pan_verified] || verificationStatuses["NOT SUBMITTED"],
                    },
                    {
                        id: 3,
                        title: "CANCELLED CHEQUE",
                        uploaded: 3,
                        ...verificationStatuses[is_blank_cheque_verified] || verificationStatuses["NOT SUBMITTED"],
                    },
                    {
                        id: 4,
                        title: "SELFIE",
                        uploaded: 4,
                        ...verificationStatuses[is_profile_image_verified] || verificationStatuses["NOT SUBMITTED"],
                    },
                ];

                setdata(dataToBeUpdate);
                setkycCardShow(false);


            }
        } catch (error) {
            console.error("Error fetching KYC details:", error);
            setkycCardShow(false);
        }
    };

    const handleUpload = (item) => {

        // if (item.status === "Cleared" || item.status === "Review Pending") {
        //     return;
        // }

        if (item.title === "AADHAAR CARD") {
            navigate("/kyc/aadhar-card-upload", { state: { KycRequestData } })
        }

        if (item.title === "PAN CARD") {
            navigate("/kyc/pan-card-upload", { state: { KycRequestData } })
        }

        if (item.title === "CANCELLED CHEQUE") {
            navigate("/kyc/cancelled-checque-upload", { state: { KycRequestData } })
        }

        if (item.title === "SELFIE") {
            navigate("/kyc/selfie-upload", { state: { KycRequestData } })
        }
    }

    const toggleModal = () => {
        setisModalOpen(!isModalOpen);
    }

    const yesLogout = () => {
        localStorage.removeItem("customerDetails");
        localStorage.removeItem("tokenDetails");
        navigate("/")
    }

    return (
        <>
            <div className="sm:ml-72 relative bg-white">
                {/* Background Image */}
                <img src={backImage} className="opacity-30	hidden md:block absolute inset-0 object-cover z-0 w-full" alt="Background" />

                {/* Content Wrapper */}
                <div className="relative z-10">
                    {/* Gradient Header */}
                    <div className="h-[60px] sm:hidden bg-gradient-to-l from-[#020065] to-[#0400CB] flex flex-row justify-between p-4">
                        <div className="flex flex-row">
                            <img src={backButton} onClick={goBack} className="w-8 h-8" alt="Back" />
                            <p className="text-white font-semibold my-1">{translations.Kyc.heading[language]}</p>
                        </div>
                        {/* <div className="text-white" onClick={toggleModal}>
                            Logout
                        </div> */}
                    </div>

                    <div className="flex justify-between hidden md:block">

                        <div className="flex flex-row mx-4 gap-4 mt-14">
                            <img onClick={goBack} src="https://cdn-icons-png.flaticon.com/512/3114/3114883.png" className="w-auto h-8" alt="Background" />
                            <h1 className="text-start font-bold text-2xl text-black hidden md:block">{translations.Kyc.heading[language]}</h1>
                        </div>
                        {/* <p className="text-start font-bold text-xl p-4 text-black hidden md:block mt-10 cursor-pointer	" onClick={toggleModal}>Logout</p> */}
                    </div>

                    <div className="text-start rounded-lg p-4 md:p-10 grid md:grid-cols-12 grid-cols-1 gap-4">
                        <div className="col-span-6">
                            <div className="grid grid-cols-2 gap-4 p-3 md:p-0">
                                {kycCardShow ? (
                                    // Shimmer effect for loading state
                                    Array.from({ length: 4 }).map((_, index) => (
                                        <div
                                            key={index}
                                            className="p-4 sm:p-4 md:p-6 rounded-2xl w-full"
                                            style={{ backgroundColor: "#f5f5f5" }}
                                        >
                                            <div className="flex justify-between">
                                                <Skeleton width="50%" height={20} />
                                                <Skeleton width="20%" height={20} />
                                            </div>
                                            <Skeleton height={30} className="my-3" />
                                            <Skeleton width="40%" height={20} />
                                        </div>
                                    ))
                                ) : (
                                    // Render actual data cards
                                    data?.map((item) => (
                                        <div
                                            onClick={() => handleUpload(item)}
                                            key={item.id}
                                            className="p-4 sm:p-4 md:p-6 rounded-2xl w-full"
                                            style={{ backgroundColor: item.backgroundColor }}
                                        >
                                            <div className="flex justify-between">
                                                <p
                                                    className="text-sm sm:text-md font-semibold"
                                                    style={{ color: item.textColor }}
                                                >
                                                    {item.status === "Cleared" ||
                                                        item.status === "Review Pending" ||
                                                        item.status === "Rejected"
                                                        ? "Uploaded"
                                                        : "Upload"}
                                                </p>
                                                <p
                                                    className={`text-sm sm:text-md ${item.status === "Review Pending"
                                                        ? "text-white"
                                                        : "text-black"
                                                        }`}
                                                >
                                                    {`0${item.uploaded}`}
                                                </p>
                                            </div>
                                            <h1
                                                className="my-3 text-lg sm:text-xl md:text-2xl font-bold"
                                                style={{ color: item.textColor }}
                                            >
                                                {item.title}
                                            </h1>
                                            <h1
                                                className="my-1 text-xs sm:text-sm font-medium "
                                                style={{ color: item.textColor }}
                                            >
                                                {item.status}
                                            </h1>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                    {ShowConsentForm &&
                        <>

                            {!kycCardShow && (

                                <div className="mx-0 md:mx-4 fixed bottom-0 left-0 md:static">
                                    {data?.every(item => item.status === "Review Pending" || item.status === "Cleared") && (
                                        <>
                                            <div className="md:w-1/2">
                                                <div className="w-full flex flex-col items-start p-4 cursor-pointer">
                                                    <div className="flex justify-between items-start w-full">
                                                        <div className="text-start" onClick={() => navigate("/kyc-status/consent-form")}>
                                                            <p className="mx-4" onClick={() => navigate("/kyc-status/consent-form")}>{translations.global.readAndAgree[language]}                                                    </p>
                                                            <h1 onClick={() => navigate("/kyc-status/consent-form")} className="mx-4 text-lg font-bold" style={{ color: "#000094" }}>
                                                                {translations.global.consentForm[language]}
                                                            </h1>

                                                        </div>
                                                        <div className="bg-[#D4D4FF] rounded-xl p-3" onClick={() => navigate("/kyc-status/consent-form")}>
                                                            <input
                                                                onClick={() => navigate("/kyc-status/consent-form")}
                                                                checked={isConsentAgreed}
                                                                type="checkbox"
                                                                id="customCheckbox"
                                                                className="w-6 p-3 border border-blue-300 bg-gray-300 h-6 cursor-pointer accent-blue-500"
                                                            />
                                                        </div>
                                                    </div>
                                                    {/* <p className="text-xs mx-4">{translations.global.clickOnConsentForm[language]}</p> */}
                                                </div>
                                            </div>
                                            <div className="w-full md:w-1/3 mt-4 mx-6">
                                                <button
                                                    onClick={handleConsentSave}
                                                    type="submit"
                                                    disabled={!isConsentAgreed}
                                                    className={`w-full p-3 px-24 flex justify-center rounded-full text-white ${isConsentAgreed
                                                        ? "bg-gradient-to-l from-[#020065] to-[#0400CB]" // Original gradient background
                                                        : "bg-gray-400 cursor-not-allowed" // Gray background and disabled cursor
                                                        }`} >
                                                    {isLoading ? (
                                                        <svg
                                                            aria-hidden="true"
                                                            className="w-5 h-5 w-full mx-10 text-gray-200 flex justify-center animate-spin dark:text-gray-600 fill-blue-600"
                                                            viewBox="0 0 100 101"
                                                            fill="none"
                                                            xmlns="http1://www.w3.org/2000/svg"
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
                                                        `${translations.global.submitRequest[language]}`
                                                    )}
                                                </button>
                                            </div>
                                            <div className="px-5 mt-4">
                                                {errorMessage && (
                                                    <p className="text-start text-red-400">{errorMessage}</p>
                                                )}
                                            </div>
                                        </>
                                    )}

                                </div>
                            )}
                        </>
                    }
                </div>
                {console.log(ShowConsentForm, "ShowConsentForm")}
                {!ShowConsentForm &&
                    <div className="fixed bottom-0 left-0 w-full sm:hidden">
                        <div className="bg-white shadow-md">
                            <img
                                src={image2}
                                alt="Image description"
                                className="w-full h-full object-contain"
                            />
                        </div>
                    </div>
                }
            </div >
        </>
    );
};

export default KycStatusPage;

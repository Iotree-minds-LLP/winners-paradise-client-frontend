import { useState, useRef, useEffect } from "react";
import backImage from "../../assets/Images/backImage.jpg";
import { useLocation, useNavigate } from "react-router-dom";
import backButton from "../../assets/Logos/backButton.png";
import uploadImage from "../../assets/Images/upload.png";
import ResetImage from "../../assets/Images/reset.png";
import { creteCustomerKycRequest } from "../../network/KycVerification/page";
import { useToast } from "../../context/Toast/toastHook";
import { useForm } from "react-hook-form";
import { TextField } from "@mui/material";
import { CameraAlt, CancelOutlined, FileUpload } from "@mui/icons-material";
import { goBack } from "../../utils/Functions/goBackScreen";
import { useLanguage } from "../../context/Language/loginContext";
import translations from "../../utils/Json/translation.json"
import image2 from "../../assets/Images/robo 1 (1).png";
import infoPng from "../../assets/Images/info.png"

const PanUpload = () => {

    const { language, setLanguage } = useLanguage();
    const [frontImage, setFrontImage] = useState(null);
    const [backImagePreview, setBackImagePreview] = useState(null);
    const [showCamera, setShowCamera] = useState(false);
    const [currentImageSetter, setCurrentImageSetter] = useState(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const navigate = useNavigate();
    const [isLoading, setisLoading] = useState(false)
    const [ErrorMessage, setErrorMessage] = useState(null);
    const [customerDetails, setcustomerDetails] = useState({})
    const [panNumber, setpanNumber] = useState(null);
    const location = useLocation();
    const [locationStateDetails, setLocationStateDetails] = useState(null);
    const [panFrontStatus, setpanFrontStatus] = useState('');
    const [panBackStatus, setpanBackStatus] = useState('');
    const [showOptions, setshowOptions] = useState(false);

    useEffect(() => {
        const data = localStorage.getItem("customerDetails");
        const customer = JSON.parse(data);
        setcustomerDetails(customer)
    }, []);



    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file && (file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/jpg")) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFrontImage(reader.result); // Set Base64 image
            };
            reader.readAsDataURL(file);
        } else {
            alert("Please select a valid image file (JPEG, JPG, PNG).");
        }
        setshowOptions(false);
    };


    useEffect(() => {
        if (location.state?.KycRequestData && Object.keys(location.state.KycRequestData).length > 0) {
            setLocationStateDetails(location.state.KycRequestData);
            setFrontImage(location.state.KycRequestData.pan_file);
            setpanFrontStatus(location.state.KycRequestData.is_pan_verified);
        } else {
            setLocationStateDetails(null);
            setpanFrontStatus(null);
            setFrontImage(null);
        }


    }, [location.state]);




    const handlepanChange = (e) => {
        setpanNumber(e.target.value);
    }

    const startCamera = (setImage) => {
        setCurrentImageSetter(() => setImage);
        setShowCamera(true);
        setshowOptions(false);

        const isMobile = /Mobi|Android/i.test(navigator.userAgent);

        const constraints = {
            video: {
                facingMode: isMobile ? { exact: "environment" } : "user", // Back camera for mobile, front for desktop
            },
        };

        navigator.mediaDevices
            .getUserMedia(constraints)
            .then((stream) => {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            })
            .catch((err) => {
                console.error("Error accessing the camera:", err);
                setShowCamera(false);
                setshowOptions(false);

            });
    };


    const capturePhoto = () => {
        const canvas = canvasRef.current;
        const video = videoRef.current;

        if (!canvas || !video) {
            console.error("Canvas or video is not available.");
            return;
        }

        const context = canvas.getContext("2d");

        // Define the green bordered box dimensions
        const scannerWidth = 300;
        const scannerHeight = 190;

        // Get video feed dimensions
        const videoWidth = video.videoWidth;
        const videoHeight = video.videoHeight;

        // Center the green box in the video feed
        const cropX = (videoWidth - scannerWidth) / 2;
        const cropY = (videoHeight - scannerHeight) / 2;

        // Set canvas dimensions to match the green box
        canvas.width = scannerWidth;
        canvas.height = scannerHeight;

        // Crop the image to the green box dimensions
        context.drawImage(
            video,
            cropX,
            cropY,
            scannerWidth,
            scannerHeight,
            0,
            0,
            scannerWidth,
            scannerHeight
        );

        const base64Image = canvas.toDataURL("image/jpeg");
        currentImageSetter(base64Image);

        stopCamera();
        setshowOptions(false);
    };

    const stopCamera = () => {
        const video = videoRef.current;
        const stream = video.srcObject;

        if (stream) {
            const tracks = stream.getTracks();
            tracks.forEach((track) => track.stop());
        }

        setShowCamera(false);
    };

    const { addToast } = useToast();

    const handleSuccessClick = (SuccessMessage) => {
        addToast(SuccessMessage, 'success');
    };


    const handleContinue = async () => {
        setisLoading(true);

        if (!frontImage) {
            setErrorMessage(translations.validations.panCard.panImage[language]);
            setisLoading(false);
            return;
        }

        const payload = {
            ...(frontImage && !frontImage.startsWith("https") && { pan_file: frontImage }),
        };

        try {
            const res = await creteCustomerKycRequest(payload, customerDetails._id);
            if (res?.data?.status === 200) {
                setisLoading(false);
                handleSuccessClick(translations.global.kycRequestSuccess[language]);
                navigate("/Kyc-status")
            } else {
                setisLoading(false);
                setErrorMessage(res.data.error);
            }
        } catch (error) {
            setErrorMessage(translations.global.kycRequestSentError[language]);
            setisLoading(false);
        }
    };



    return (
        <>
            <div className="sm:ml-72 relative bg-white h-screen overflow-y-auto">
                <img
                    src={backImage}
                    className="opacity-30 hidden md:block absolute inset-0 object-cover z-0 w-full"
                    alt="Background"
                />

                <div className="relative z-10">
                    <div className="h-[60px] sm:hidden bg-gradient-to-l from-[#020065] to-[#0400CB] flex flex-row justify-between p-4">
                        <div className="flex flex-row">
                            <img
                                src={backButton}
                                onClick={() => navigate(-1)}
                                className="w-8 h-8"
                                alt="Back"
                            />
                            <p className="text-white font-semibold my-1">{translations.Kyc.pan_card.heading[language]}</p>
                        </div>
                    </div>

                    <div className="flex justify-between hidden md:block">
                        <div className="flex flex-row mx-4 gap-4 mt-14">
                            <img onClick={goBack} src="https://cdn-icons-png.flaticon.com/512/3114/3114883.png" className="w-auto h-8" alt="Background" />
                            <h1 className="text-start font-bold text-2xl text-black hidden md:block">
                                {translations.Kyc.pan_card.heading[language]}
                            </h1>
                        </div>
                    </div>

                    {panFrontStatus === "REVIEW PENDING" &&
                        <div className="mt-3 md:mt-10 grid grid-cols-1 md:grid-cols-3 mx-3">
                            <div className="text-start p-4 flex flex-row bg-gray-100 rounded-lg">
                                <img className="w-6 h-6" src={infoPng}></img>
                                <p className="text-xs mx-2 mt-1">{translations.global.noUpdateMessage[language]}</p>
                            </div>
                        </div>
                    }


                    <div className={`flex flex-col md:flex-row gap-10 p-4 md:mb-0 overflow-y-auto ${locationStateDetails?.is_pan_verified === "REJECTED" ? "mb-0" : "mb-20"}`}>
                        <div
                            className={`flex flex-col text-center items-center justify-start p-4 border border-2 border-dotted border-gray-300 relative w-full max-w-md rounded-md ${frontImage
                                ? panFrontStatus === "CLEARED"
                                    ? "bg-[#BBFF99]"
                                    : panFrontStatus === "REJECTED"
                                        ? "bg-[#FFDA99]"
                                        : "bg-[#F1F1FF]"
                                : ""
                                }`}
                        >
                            {frontImage ? (
                                <div className="w-full h-64 flex items-center justify-center overflow-hidden">
                                    <img
                                        src={frontImage}
                                        className="w-full h-full object-contain"
                                        alt="Uploaded Back"
                                    />
                                </div>

                            ) : null}
                            <div className="mt-4 flex flex-row items-center justify-between w-full px-4">

                                <div className="flex flex-col text-start">
                                    {panFrontStatus === "CLEARED" ? (
                                        <p className="text-sm">{translations.global.uploaded[language]}</p>
                                    ) : (
                                        <p className="text-sm">{translations.Kyc.pan_card.upload[language]}</p>
                                    )}
                                    <p className="text-lg font-bold">{translations.Kyc.pan_card.heading1[language]}</p>
                                </div>


                                {!((panFrontStatus === "REVIEW PENDING" || panFrontStatus === "CLEARED")) && (
                                    <div
                                        className="p-2 rounded-2xl cursor-pointer"
                                        {...(frontImage ? { style: { backgroundColor: "#ffffff" } } : { style: { backgroundColor: "#D4D4FF" } })}
                                    >
                                        {frontImage ?
                                            (
                                                <img src={ResetImage} onClick={() => setshowOptions(true)} className="w-10 h-auto" alt="Upload Icon" />
                                            ) : (
                                                <img src={uploadImage} onClick={() => setshowOptions(true)} className="w-10 h-auto" alt="Upload Icon" />
                                            )
                                        }
                                    </div>
                                )}

                            </div>
                        </div>


                    </div>

                    {locationStateDetails?.is_pan_verified === "REJECTED" && (
                        <div className="p-3 w-full md:w-1/3 text-start rounded-lg md:mx-5 mb-20 md:mb-0" style={{ background: "#F1F1FF" }}>
                            <p className="text-sm" style={{ color: "#020065" }}>{translations.global.reasonForRejection[language]}</p>
                            <p className="text-lg text-black">{locationStateDetails.reason_for_rejection}</p>
                        </div>
                    )}


                    {!((panFrontStatus === "REVIEW PENDING" || panFrontStatus === "CLEARED")) && (
                        <>
                            <div className="flex justify-start mt-6 mx-4 hidden md:block ">
                                <button
                                    onClick={handleContinue}
                                    className="w-1/4 p-3  flex justify-center rounded-full text-white bg-gradient-to-l from-[#020065] to-[#0400CB]"
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
                                        `${translations.global.button[language]}`
                                    )}
                                </button>
                            </div>
                            <div className="text-start px-5 py-3 hidden md:block">
                                {ErrorMessage && (
                                    <span style={{ fontSize: '14px' }} className="text-red-400 text-xs text-start">
                                        {ErrorMessage}
                                    </span>
                                )}
                            </div>
                        </>
                    )}
                </div>

            </div>

            {!((panFrontStatus === "REVIEW PENDING" || panFrontStatus === "CLEARED")) && (
                <>
                    <div>
                        <div className="fixed z-10 bottom-0 left-0 w-full sm:hidden bg-white shadow-lg bg-white">
                            <div className="absolute bottom-0 left-0 w-full flex flex-col items-start p-4">
                                <div className="w-full mt-4">
                                    <button
                                        onClick={handleContinue}
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
                                            `${translations.global.button[language]}`
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
                </>

            )}


            {showCamera && (
                <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
                    {/* Camera feed */}
                    <video ref={videoRef} className="w-full md:w-1/2 rounded-md relative" autoPlay playsInline />
                    <canvas ref={canvasRef} className="hidden" />

                    {/* Faded background overlay with clear scanner area */}
                    <div className="absolute inset-0">
                        {/* Full-screen overlay */}
                        <div className="absolute inset-0 "></div>

                        {/* Scanner rectangle */}
                        <div
                            className="absolute"
                            style={{
                                top: "50%",
                                left: "50%",
                                width: "300px", // Scanner size width
                                height: "190px", // Scanner size height
                                transform: "translate(-50%, -50%)",
                                boxShadow: "0 0 0 2000px rgba(0, 0, 0, 0.6)", // Fades the rest of the screen
                                zIndex: 2, // Ensures scanner area is visible
                            }}
                        >
                            {/* Corners */}
                            {/* Top-left corner */}
                            <div
                                className="absolute top-0 left-0 border-t-4 border-l-4 border-green-500"
                                style={{
                                    width: "30px",
                                    height: "30px",
                                }}
                            ></div>

                            {/* Top-right corner */}
                            <div
                                className="absolute top-0 right-0 border-t-4 border-r-4 border-green-500"
                                style={{
                                    width: "30px",
                                    height: "30px",
                                }}
                            ></div>

                            {/* Bottom-left corner */}
                            <div
                                className="absolute bottom-0 left-0 border-b-4 border-l-4 border-green-500"
                                style={{
                                    width: "30px",
                                    height: "30px",
                                }}
                            ></div>

                            {/* Bottom-right corner */}
                            <div
                                className="absolute bottom-0 right-0 border-b-4 border-r-4 border-green-500"
                                style={{
                                    width: "30px",
                                    height: "30px",
                                }}
                            ></div>
                        </div>
                    </div>

                    {/* Capture and Cancel buttons */}
                    <div className="absolute bottom-10 flex gap-4 z-10">
                        <button
                            onClick={capturePhoto}
                            className="px-6 py-2  bg-gradient-to-l from-[#020065] to-[#0400CB] text-white font-bold rounded-full"
                        >
                            {translations.global.capture[language]}
                        </button>
                        <button
                            onClick={stopCamera}
                            className="px-6 py-2 bg-gray-500 text-white font-bold rounded-full"
                        >
                            {translations.global.cancel[language]}
                        </button>
                    </div>
                </div>
            )}


            {showOptions && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex md:items-center items-end justify-center z-50">
                    <div
                        className="bg-white rounded-lg w-full max-w-md p-6 shadow-lg animate-slide-up"
                    >
                        {/* Header */}
                        <div className="flex justify-between">
                            <p className="text-lg font-semibold text-center mb-6">{translations.global.chooseOption[language]}</p>
                            <CancelOutlined onClick={() => setshowOptions(false)}></CancelOutlined>
                            {/* Options */}
                        </div>
                        <div className="flex flex-col gap-4">
                            {/* Use Camera Option */}
                            <button
                                onClick={() => startCamera(setFrontImage)}
                                className="w-full p-4 flex items-center gap-4 border border-gray-100 bg-white text-black rounded-lg hover:bg-gray-100  transition"
                            >
                                <CameraAlt></CameraAlt>
                                <p className="font-medium">{translations.global.useCamera[language]}</p>
                            </button>

                            {/* Upload from Files Option */}
                            <label
                                htmlFor="file-upload"
                                className="w-full p-4 flex items-center gap-4 bg-white border border-gray-100 hover:bg-gray-100 text-black rounded-lg transition cursor-pointer"
                            >
                                <FileUpload></FileUpload>
                                <p className="font-medium">{translations.global.uploadFromFiles[language]}</p>
                                <input
                                    id="file-upload"
                                    type="file"
                                    accept="image/jpeg,image/png,image/jpg"
                                    className="hidden"
                                    onChange={handleFileUpload}
                                />
                            </label>



                        </div>
                    </div>
                </div>
            )}

            <div className="fixed bottom-0 left-0 w-full sm:hidden">
                <div className="bg-white shadow-md">
                    <img
                        src={image2}
                        alt="Image description"
                        className="w-full h-full object-contain"
                    />
                </div>
            </div>
        </>
    );
};

export default PanUpload;

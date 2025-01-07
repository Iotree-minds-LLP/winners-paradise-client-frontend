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

const SelfieUpload = () => {
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
    const [selfieUploadNumber, setselfieUploadNumber] = useState(null);
    const location = useLocation();
    const [locationStateDetails, setLocationStateDetails] = useState(null);
    const [selfieUpload, setselfieUpload] = useState('');

    useEffect(() => {
        const data = localStorage.getItem("customerDetails");
        const customer = JSON.parse(data);
        setcustomerDetails(customer)
    }, []);


    useEffect(() => {
        console.log(location.state?.item, "location.state?.item")
        setLocationStateDetails(location.state?.item)
        setselfieUpload('Cleared')
        setFrontImage("data:image/jpeg;base64,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")

    }, [location.state]);


    const handleselfieUploadChange = (e) => {
        setselfieUploadNumber(e.target.value);
    }

    const startCamera = (setImage) => {
        setCurrentImageSetter(() => setImage);
        setShowCamera(true);

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
            });
    };

    const capturePhoto = () => {
        const canvas = canvasRef.current;
        const video = videoRef.current;

        if (!canvas || !video) {
            console.error("Canvas or video is not available.");
            return;
        }

        // Set canvas dimensions to match video feed dimensions
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw the full video feed directly onto the canvas
        const context = canvas.getContext("2d");
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert the canvas content to a base64 image string
        const base64Image = canvas.toDataURL("image/jpeg");
        currentImageSetter(base64Image);

        // Stop the camera after capturing the photo
        stopCamera();
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

        if (!frontImage || !backImagePreview) {
            setErrorMessage("Please capture both front and back images before continuing.");
            setisLoading(false);
        }

        const payload = {
            selfieUpload_file_front: frontImage,
            selfieUpload_file_back: backImagePreview,
            selfieUpload_no: selfieUploadNumber,
            customer_selfie: frontImage,
            blank_cheque_file: frontImage,
        }

        try {
            const res = await creteCustomerKycRequest(payload, customerDetails._id);
            if (res?.data?.status === 200) {
                setisLoading(false);
                handleSuccessClick("KYC Request Submitted Successfully");
            } else {
                setisLoading(false);
                setErrorMessage(res.data.error);
            }
        } catch (error) {
            setErrorMessage("Failed to submit KYC Request");
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
                            <p className="text-white font-semibold my-1">Upload Selfie</p>
                        </div>
                    </div>

                    <div className="flex justify-between">
                        <h1 className="text-start font-bold text-2xl p-4 text-black hidden md:block mt-10">
                            Upload Selfie
                        </h1>
                    </div>

                    <div className="flex flex-col md:flex-row gap-10 p-4 mb-20 md:mb-0 overflow-y-auto ">
                        <div
                            className={`flex flex-col text-center items-center justify-start p-4 border border-2 border-dotted border-gray-300 relative w-full max-w-md rounded-md ${frontImage
                                ? selfieUpload === "Cleared"
                                    ? "bg-[#BBFF99]"
                                    : selfieUpload === "Rejected"
                                        ? "bg-[#FFDA99]"
                                        : "bg-[#F1F1FF]"
                                : ""
                                }`}
                        >
                            {frontImage ? (
                                <div className="w-full h-auto">
                                    <img
                                        src={frontImage}
                                        className="w-full max-h-50 object-contain"
                                        alt="Uploaded Front"
                                    />
                                </div>
                            ) : null}
                            <div className="mt-4 flex flex-row items-center justify-between w-full px-4">
                                <div className="flex flex-col text-start">
                                    <p className="text-sm">Upload</p>
                                    <p className="text-lg font-bold">Upload Selfie</p>
                                </div>
                                <div
                                    className="p-2 rounded-2xl cursor-pointer"
                                    {...(frontImage ? { style: { backgroundColor: "#ffffff" } } : { style: { backgroundColor: "#D4D4FF" } })}
                                    onClick={() => startCamera(setFrontImage)}
                                >
                                    {frontImage ?
                                        (
                                            <img src={ResetImage} className="w-10 h-auto" alt="Upload Icon" />
                                        ) : (
                                            <img src={uploadImage} className="w-10 h-auto" alt="Upload Icon" />
                                        )
                                    }
                                </div>
                            </div>
                        </div>


                    </div>

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
                                "Save & Continue"
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
                </div>

            </div>

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
                                    "Save & Continue"
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
            {showCamera && (
                <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
                    {/* Camera feed */}
                    <video ref={videoRef} className="w-full md:w-1/2 rounded-md" autoPlay playsInline />
                    <canvas ref={canvasRef} className="hidden" />

                    {/* Capture and Cancel buttons */}
                    <div className="absolute bottom-10 flex gap-4">
                        <button
                            onClick={capturePhoto}
                            className="px-6 py-2 bg-blue-500 text-white font-bold rounded-lg"
                        >
                            Capture
                        </button>
                        <button
                            onClick={stopCamera}
                            className="px-6 py-2 bg-red-500 text-white font-bold rounded-lg"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}


        </>
    );
};

export default SelfieUpload;

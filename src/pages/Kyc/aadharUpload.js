import { useState, useRef } from "react";
import backImage from "../../assets/Images/backImage.jpg";
import { useNavigate } from "react-router-dom";
import backButton from "../../assets/Logos/backButton.png";
import uploadImage from "../../assets/Images/upload.png";

const AadharUpload = () => {
    const [frontImage, setFrontImage] = useState(null);
    const [backImagePreview, setBackImagePreview] = useState(null);
    const [showCamera, setShowCamera] = useState(false);
    const [currentImageSetter, setCurrentImageSetter] = useState(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const navigate = useNavigate();

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
        const context = canvas.getContext("2d");

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const base64Image = canvas.toDataURL("image/jpeg");
        currentImageSetter(base64Image);

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
                            <p className="text-white font-semibold my-1">Upload AADHAR card</p>
                        </div>
                    </div>

                    <div className="flex justify-between">
                        <h1 className="text-start font-bold text-2xl p-4 text-black hidden md:block mt-10">
                            Upload AADHAR card
                        </h1>
                    </div>

                    <div className="flex flex-col md:flex-row  gap-10 p-4">
                        <div
                            className={`flex flex-col text-center items-center justify-start p-4 border border-2 border-dotted border-gray-300 relative w-full max-w-md rounded-md ${frontImage ? "bg-[#F1F1FF]" : ""
                                }`}
                        >       {frontImage ? (
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
                                    <p className="text-lg font-bold">AADHAR CARD FRONT</p>
                                </div>
                                <div
                                    className="p-2 rounded-2xl cursor-pointer"
                                    style={{ backgroundColor: "#D4D4FF" }}
                                    onClick={() => startCamera(setFrontImage)}
                                >
                                    <img src={uploadImage} className="w-10 h-auto" alt="Upload Icon" />
                                </div>
                            </div>
                        </div>

                        <div
                            className={`flex flex-col text-center items-center justify-start p-4 border border-2 border-dotted border-gray-300 relative w-full max-w-md rounded-md ${backImagePreview ? "bg-[#F1F1FF]" : ""
                                }`}
                        >
                            {backImagePreview ? (
                                <div className="w-full h-auto">
                                    <img
                                        src={backImagePreview}
                                        className="w-full max-h-50 object-contain"
                                        alt="Uploaded Back"
                                    />
                                </div>
                            ) : null}
                            <div className="mt-4 flex flex-row items-center justify-between w-full px-4">
                                <div className="flex flex-col text-start">
                                    <p className="text-sm">Upload</p>
                                    <p className="text-lg font-bold">AADHAR CARD BACK</p>
                                </div>
                                <div
                                    className="p-2 rounded-2xl cursor-pointer"
                                    style={{ backgroundColor: "#D4D4FF" }}
                                    onClick={() => startCamera(setBackImagePreview)}
                                >
                                    <img src={uploadImage} className="w-10 h-auto" alt="Upload Icon" />
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {showCamera && (
                <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
                    <video ref={videoRef} className="w-full md:w-1/2 rounded-md" autoPlay playsInline />
                    <canvas ref={canvasRef} className="hidden" />
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

export default AadharUpload;

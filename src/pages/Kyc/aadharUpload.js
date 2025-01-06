import { useState } from "react";
import backImage from "../../assets/Images/backImage.jpg";
import { useNavigate } from "react-router-dom";
import backButton from "../../assets/Logos/backButton.png";
import uploadImage from "../../assets/Images/upload.png";

const AadharUpload = () => {
    const [isLoading, setisLoading] = useState(false);
    const [frontImage, setFrontImage] = useState(null);
    const [backImagePreview, setBackImagePreview] = useState(null);
    const navigate = useNavigate();

    const openCamera = async (setImage) => {
        try {
            // Open the device camera
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            const video = document.createElement("video");
            video.srcObject = stream;
            video.play();

            // Create a dialog for the video stream
            const dialog = document.createElement("div");
            dialog.style.position = "fixed";
            dialog.style.top = "0";
            dialog.style.left = "0";
            dialog.style.width = "100vw";
            dialog.style.height = "100vh";
            dialog.style.background = "rgba(0, 0, 0, 0.8)";
            dialog.style.display = "flex";
            dialog.style.alignItems = "center";
            dialog.style.justifyContent = "center";
            dialog.appendChild(video);

            // Add capture button
            const captureButton = document.createElement("button");
            captureButton.textContent = "Capture";
            captureButton.style.position = "absolute";
            captureButton.style.bottom = "20px";
            captureButton.style.padding = "10px 20px";
            captureButton.style.background = "#0400CB";
            captureButton.style.color = "#fff";
            captureButton.style.border = "none";
            captureButton.style.borderRadius = "8px";
            dialog.appendChild(captureButton);

            // Handle capture button click
            captureButton.onclick = () => {
                const canvas = document.createElement("canvas");
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const context = canvas.getContext("2d");
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                const base64 = canvas.toDataURL("image/jpeg");
                setImage(base64);
                stream.getTracks().forEach((track) => track.stop());
                dialog.remove();
            };

            // Append dialog to the body
            document.body.appendChild(dialog);
        } catch (error) {
            console.error("Error accessing the camera:", error);
        }
    };

    return (
        <>
            <div className="sm:ml-72 relative bg-white">
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
                        <h1 className="text-start font-bold text-2xl p-4 text-black hidden md:block mt-10 mx-6">
                            Upload AADHAR card
                        </h1>
                    </div>

                    <div className="flex flex-wrap gap-10 p-4 md:p-10 grid grid-cols-1 md:grid-cols-3">
                        <div className="w-full md:full flex items-center text-start justify-between p-4 border border-2 border-dotted border-gray-300">
                            <div className="flex flex-col">
                                <p className="text-sm">Upload</p>
                                <p className="text-lg font-bold">AADHAR CARD FRONT</p>
                            </div>
                            <div
                                className="ml-4 p-2 rounded-2xl cursor-pointer"
                                style={{ backgroundColor: "#D4D4FF" }}
                                onClick={() => openCamera(setFrontImage)}
                            >
                                {frontImage ? (
                                    <img src={frontImage} className="w-10 h-auto" alt="Uploaded" />
                                ) : (
                                    <img src={uploadImage} className="w-10 h-auto" alt="Upload Icon" />
                                )}
                            </div>
                        </div>

                        <div className="flex w-full items-center text-start justify-between p-4 border border-2 border-dotted border-gray-300">
                            <div className="flex flex-col">
                                <p className="text-sm">Upload</p>
                                <p className="text-lg font-bold">AADHAR CARD BACK</p>
                            </div>
                            <div
                                className="ml-4 p-2 rounded-2xl cursor-pointer"
                                style={{ backgroundColor: "#D4D4FF" }}
                                onClick={() => openCamera(setBackImagePreview)}
                            >
                                {backImagePreview ? (
                                    <img src={backImagePreview} className="w-10 h-auto" alt="Uploaded" />
                                ) : (
                                    <img src={uploadImage} className="w-10 h-auto" alt="Upload Icon" />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AadharUpload;

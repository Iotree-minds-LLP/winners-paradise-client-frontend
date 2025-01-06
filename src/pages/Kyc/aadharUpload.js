import { useState } from "react";
import backImage from "../../assets/Images/backImage.jpg"
import { Link, useNavigate } from "react-router-dom";
import backButton from "../../assets/Logos/backButton.png"
import acrrowright from "../../assets/Images/arrow_circle_right.png"
import image2 from "../../assets/Images/robo 1 (1).png";
import { goBack } from "../../utils/Functions/goBackScreen";
import { FormControl, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { CheckBox } from "@mui/icons-material";
import uploadImage from "../../assets/Images/upload.png";

const AadharUpload = () => {

    const [isLoading, setisLoading] = useState(false)
    const [response, setResponse] = useState([]);
    const [customerDetails, setCustomerDetails] = useState([]);
    const [isModalOpen, setisModalOpen] = useState(false);
    const navigate = useNavigate();

    const handleUpload = (item) => {
        if (item.status === "Uplaod" && item.title === "AADHAR CARD") {
            navigate("/kyc/aadhar-card-upload")
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
                <img src={backImage} className="opacity-30	hidden md:block absolute inset-0 object-cover z-0 w-full" alt="Background" />

                <div className="relative z-10">
                    <div className="h-[60px] sm:hidden bg-gradient-to-l from-[#020065] to-[#0400CB] flex flex-row justify-between p-4">
                        <div className="flex flex-row">
                            <img src={backButton} onClick={goBack} className="w-8 h-8" alt="Back" />
                            <p className="text-white font-semibold my-1">Upload AADHAR card</p>
                        </div>
                        <div className="text-white" onClick={toggleModal}>
                            Logout
                        </div>
                    </div>

                    <div className="flex justify-between">
                        <h1 className="text-start font-bold text-2xl p-4 text-black hidden md:block mt-10 mx-6">Upload AADHAR card</h1>
                        <p className="text-start font-bold text-xl p-4 text-black hidden md:block mt-10 cursor-pointer	" onClick={toggleModal}>Logout</p>
                    </div>

                    <div className="flex flex-wrap gap-10 p-4 md:p-10 grid grid-cols-1 md:grid-cols-3">
                        <div className="w-full md:full flex items-center text-start justify-between p-4  border border-2 border-dotted border-gray-300">
                            <div className="flex flex-col">
                                <p className="text-sm">Upload</p>
                                <p className="text-lg font-bold">AADHAR CARD FRONT</p>
                            </div>
                            <div className="ml-4 p-2 rounded-2xl" style={{ backgroundColor: "#D4D4FF" }}>
                                <img src={uploadImage} className="w-10 h-auto" alt="Upload Icon" />
                            </div>
                        </div>
                        <div className="flex w-full items-center text-start justify-between p-4  border border-2 border-dotted border-gray-300">
                            <div className="flex flex-col">
                                <p className="text-sm">Upload</p>
                                <p className="text-lg font-bold">AADHAR CARD BACK</p>
                            </div>
                            <div className="ml-4 p-2 rounded-2xl" style={{ backgroundColor: "#D4D4FF" }}>
                                <img src={uploadImage} className="w-10 h-auto" alt="Upload Icon" />
                            </div>
                        </div>
                    </div>

                </div>
                <div>

                    <div>
                        <div className="fixed bottom-0 left-0 w-full sm:hidden bg-white shadow-lg">
                            <div className="absolute bottom-0 left-0 w-full flex flex-col items-start p-4">
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
                                            "Save & Continue"
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
            </div >
        </>
    );
};

export default AadharUpload;

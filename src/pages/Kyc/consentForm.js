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
import { useConsent } from "../../context/consent/consentProvider";

const ConsentForm = () => {

    const [response, setResponse] = useState([]);
    const [customerDetailsFromAPI, setCustomerDetailsFromAPI] = useState([]);
    const [isLoading, setisLoading] = useState(false)
    const [ErrorMessage, setErrorMessage] = useState("")
    const [isModalOpen, setisModalOpen] = useState(false);
    const { isConsentAgreed, setIsConsentAgreed } = useConsent();

    const navigate = useNavigate();

    const toggleModal = () => {
        setisModalOpen(!isModalOpen);
    }

    const handleSubmit = () => {
        setIsConsentAgreed(true)
    }

    return (
        <>
            <div className="sm:ml-72 relative bg-white">
                <img src={backImage} className="opacity-30	hidden md:block absolute inset-0 object-cover z-0 w-full" alt="Background" />

                <div className="relative z-10">
                    <div className="h-[60px] sm:hidden bg-gradient-to-l from-[#020065] to-[#0400CB] flex flex-row justify-between p-4">
                        <div className="flex flex-row">
                            <img src={backButton} onClick={goBack} className="w-8 h-8" alt="Back" />
                            <p className="text-white font-semibold my-1">Consent form</p>
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <h1 className="text-start font-bold text-2xl p-4 text-black hidden md:block mt-10 mx-6">Consent form</h1>
                    </div>
                    <div className="text-start rounded-lg mt-5 p-4 md:px-10 grid md:grid-cols-1 grid-cols-1 gap-4">
                        <div className="p-4 md:p-6 rounded-lg w-full md:w-1/2" style={{ backgroundColor: 'rgba(245, 245, 245, 1)' }}>
                            <div style={{ lineHeight: "40px" }} className="flex justify-between items-center">
                                <p>Lorem Ipsum is simply dummy text of the printing and  typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of  type and scrambled it to make a type specimen book. It has survived not  only five centuries, but also the leap into electronic typesetting,  remaining essentially unchanged. It was popularised in the 1960s with  the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker  including versions of Lorem Ipsum.</p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-5 hidden sm:block  w-1/2 px-4 mx-4">
                        <Link to="/Kyc-status" >
                            <button
                                onClick={handleSubmit}
                                className="md:w-full w-full p-3 rounded-full text-white bg-gradient-to-l from-[#020065] to-[#0400CB] flex items-center justify-center"
                            >
                                Agree & Continue
                            </button>
                        </Link>
                    </div>
                </div>

                <div className="mt-5 sm:hidden p-3 fixed bottom-0 left-0 w-full bg-white shadow-md z-10">
                    <Link to="/Kyc-status" >
                        <button
                            onClick={handleSubmit}
                            className="md:w-full w-full p-3 rounded-full text-white bg-gradient-to-l from-[#020065] to-[#0400CB] flex items-center justify-center"
                        >
                            Agree & Continue
                        </button>
                    </Link>
                </div>
            </div >
        </>
    );
};

export default ConsentForm;

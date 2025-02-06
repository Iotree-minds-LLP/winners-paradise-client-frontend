import { useEffect, useState } from "react";
import backImage from "../../assets/Images/backImage.jpg";
import { Link, useNavigate } from "react-router-dom";
import backButton from "../../assets/Logos/backButton.png";
import acrrowright from "../../assets/Images/arrow_circle_right.png";
import image2 from "../../assets/Images/robo 1 (1).png";
import { Logoutuser } from "../../network/Authentication/page";
import translations from "../../utils/Json/translation.json"
import { useLanguage } from "../../context/Language/loginContext";
import { getCustomerById } from "../../network/Customer/page";

const ProfileAndSettings = () => {

    const [isModalOpen, setisModalOpen] = useState(false);
    const [isPwaPromptAvailable, setIsPwaPromptAvailable] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isLoadingLogoutButton, setisLoadingLogoutButton] = useState(false)
    const { language, setLanguage } = useLanguage();

    const navigate = useNavigate();

    const toggleModal = () => {
        setisModalOpen(!isModalOpen);
    };

    const yesLogout = async () => {
        setisLoadingLogoutButton(true);
        const resp = await Logoutuser();
        if (resp.data.status === 200) {
            localStorage.removeItem("customerDetails");
            localStorage.removeItem("tokenDetails");
            localStorage.removeItem("fcmToken");
            localStorage.removeItem("tempMobileNumber");
            localStorage.removeItem("bankUpdateToken");
            localStorage.removeItem("language");
            setisLoadingLogoutButton(false);
            navigate("/");
        }
        else {
            localStorage.removeItem("customerDetails");
            localStorage.removeItem("tokenDetails");
            localStorage.removeItem("fcmToken");
            localStorage.removeItem("tempMobileNumber");
            localStorage.removeItem("bankUpdateToken");
            localStorage.removeItem("language");

            setisLoadingLogoutButton(false);
            navigate("/");
        }
    };

    const dontdeleteuser = () => {
        setisModalOpen(!isModalOpen);
    };

    useEffect(() => {
        const isPwa = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone;

        if (isPwa) {
            console.log("App is already running as a PWA");
            return;
        }

        window.addEventListener("beforeinstallprompt", (e) => {
            console.log("beforeinstallprompt event fired");
            e.preventDefault();
            setDeferredPrompt(e);
            setIsPwaPromptAvailable(true);
        });

        return () => {
            window.removeEventListener("beforeinstallprompt", () => { });
        };
    }, []);

    const handlePwaInstallation = () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === "accepted") {
                    console.log("User accepted the PWA installation prompt");
                } else {
                    console.log("User dismissed the PWA installation prompt");
                }
                setDeferredPrompt(null);
            });
        } else {
            console.log("PWA installation prompt is not available.");
        }
    };

    useEffect(() => {
        const data = localStorage.getItem("customerDetails");
        const customer = JSON.parse(data);
        fetchCustomerDetails(customer?._id);
    }, []);

    const [bankDetails, setbankDetails] = useState(false);

    const fetchCustomerDetails = async (id) => {

        if (id) {
            const resp = await getCustomerById(id);
            if (resp.data.status === 200) {

                if (resp.data.data.customer.bank_acc_no) {
                    setbankDetails(true)
                } else {
                    setbankDetails(false)
                }
            }
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
                            <img src={backButton} onClick={() => navigate(-1)} className="w-8 h-8" alt="Back" />
                            <p className="text-white font-semibold my-1 ">{translations.ProfileAndSettings.heading[language]}</p>
                        </div>
                    </div>

                    <div className="flex justify-between hidden md:block">
                        <div className="flex flex-row mx-4 gap-4 mt-14">
                            <h1 className="text-start font-bold text-2xl text-black hidden md:block mx-5">{translations.ProfileAndSettings.heading[language]}</h1>
                        </div>
                    </div>


                    <div className="text-start rounded-lg mt-5 p-4 md:p-10 grid md:grid-cols-1 grid-cols-1 gap-4">
                        <div
                            className="p-4 md:p-6 rounded-lg w-full md:w-1/2"
                            style={{ backgroundColor: "rgba(245, 245, 245, 1)" }}
                        >
                            <Link to="/my-profile">
                                <div className="flex justify justify-between">
                                    <p
                                        style={{
                                            color: "rgba(0, 0, 148, 1)",
                                            fontWeight: "700",
                                            fontSize: "18px",
                                        }}
                                    >
                                        {translations.ProfileAndSettings.heading1[language]}
                                    </p>
                                    <img src={acrrowright} className="w-auto h-8" alt="Arrow Icon"></img>
                                </div>
                            </Link>
                        </div>

                        <Link to="/Kyc-status">
                            <div
                                className="p-4 md:p-6 rounded-lg md:w-1/2"
                                style={{ backgroundColor: "rgba(245, 245, 245, 1)" }}
                            >
                                <div className="flex justify justify-between">
                                    <p
                                        style={{
                                            color: "rgba(0, 0, 148, 1)",
                                            fontWeight: "700",
                                            fontSize: "18px",
                                        }}
                                    >
                                        {translations.ProfileAndSettings.heading2[language]}
                                    </p>
                                    <img src={acrrowright} className="w-auto h-8" alt="Arrow Icon"></img>
                                </div>
                            </div>
                        </Link>

                        {bankDetails ? (
                            <Link to="/profile-and-settings/view-bank-details">
                                <div
                                    className="p-4 md:p-6 rounded-lg md:w-1/2"
                                    style={{ backgroundColor: "rgba(245, 245, 245, 1)" }}
                                >
                                    <div className="flex justify justify-between">
                                        <p
                                            style={{
                                                color: "rgba(0, 0, 148, 1)",
                                                fontWeight: "700",
                                                fontSize: "18px",
                                            }}
                                        >
                                            {translations.ProfileAndSettings.heading3[language]}
                                        </p>
                                        <img src={acrrowright} className="w-auto h-8" alt="Arrow Icon"></img>
                                    </div>
                                </div>
                            </Link>
                        ) : (

                            <Link to="/profile-and-settings/bank-details">
                                <div
                                    className="p-4 md:p-6 rounded-lg md:w-1/2"
                                    style={{ backgroundColor: "rgba(245, 245, 245, 1)" }}
                                >
                                    <div className="flex justify justify-between">
                                        <p
                                            style={{
                                                color: "rgba(0, 0, 148, 1)",
                                                fontWeight: "700",
                                                fontSize: "18px",
                                            }}
                                        >
                                            {translations.ProfileAndSettings.heading3[language]}
                                        </p>
                                        <img src={acrrowright} className="w-auto h-8" alt="Arrow Icon"></img>
                                    </div>
                                </div>
                            </Link>
                        )}
                        <div
                            className="p-4 md:p-6 rounded-lg md:w-1/2"
                            style={{ backgroundColor: "rgba(245, 245, 245, 1)" }}
                        >
                            <Link to="/update-language-preference">
                                <div className="flex justify justify-between">
                                    <p
                                        style={{
                                            color: "rgba(0, 0, 148, 1)",
                                            fontWeight: "700",
                                            fontSize: "18px",
                                        }}
                                    >
                                        {translations.ProfileAndSettings.heading4[language]}
                                    </p>
                                    <img src={acrrowright} className="w-auto h-8" alt="Arrow Icon"></img>
                                </div>
                            </Link>
                        </div>

                        {/* New Section: Download PWA */}
                        {isPwaPromptAvailable && (
                            <div
                                className="p-4 md:p-6 rounded-lg md:w-1/2 sm:hidden"
                                style={{ backgroundColor: "rgba(245, 245, 245, 1)" }}
                                onClick={handlePwaInstallation}
                            >
                                <div className="flex justify-between cursor-pointer">
                                    <p
                                        style={{
                                            color: "rgba(0, 0, 148, 1)",
                                            fontWeight: "700",
                                            fontSize: "18px",
                                        }}
                                    >
                                        {translations.ProfileAndSettings.pwaMessage[language]}
                                    </p>
                                    <img src={acrrowright} className="w-auto h-8" alt="Arrow Icon"></img>
                                </div>
                            </div>
                        )}

                        <div
                            className="p-4 md:p-6 rounded-lg md:w-1/2"
                            style={{ backgroundColor: "rgba(245, 245, 245, 1)" }}
                        >
                            <>
                                <div onClick={toggleModal} className="flex justify justify-between">
                                    <p
                                        style={{
                                            color: "rgba(0, 0, 148, 1)",
                                            fontWeight: "700",
                                            fontSize: "18px",
                                        }}
                                    >
                                        {translations.ProfileAndSettings.heading5[language]}
                                    </p>
                                    <img src={acrrowright} className="w-auto h-8" alt="Arrow Icon"></img>
                                </div>
                            </>
                        </div>
                    </div>

                </div>
            </div>
            <div>
                {isModalOpen && (
                    <div
                        id="popup-modal"
                        tabIndex="-1"
                        className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full bg-gray-800 bg-opacity-50"
                        data-modal-target="popup-modal"
                        onClick={(e) => {
                            if (e.target.id === "popup-modal") {
                                toggleModal(); // Close the modal when clicking outside
                            }
                        }}
                    >
                        <div className="relative p-4 w-full max-w-md max-h-full">
                            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                                <button
                                    type="button"
                                    onClick={toggleModal}
                                    className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                    data-modal-hide="popup-modal"
                                >
                                    <svg
                                        className="w-3 h-3"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 14 14"
                                    >
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                        />
                                    </svg>
                                    <span className="sr-only">Close modal</span>
                                </button>
                                <div className="p-4 md:p-5 text-center">
                                    <svg
                                        className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                        />
                                    </svg>
                                    <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                        {translations.ProfileAndSettings.logoutMessage[language]}
                                    </h3>
                                    <button
                                        type="button"
                                        className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
                                        data-modal-hide="popup-modal"
                                        onClick={yesLogout}
                                    >
                                        {isLoadingLogoutButton ? (
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
                                            `${translations.ProfileAndSettings.agree[language]}`
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100  focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                                        data-modal-hide="popup-modal"
                                        onClick={dontdeleteuser}
                                    >
                                        {translations.ProfileAndSettings.cancel[language]}
                                    </button>
                                </div>
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

            </div>
        </>
    );
};

export default ProfileAndSettings;

import { useEffect, useState } from "react";
import backImage from "../../assets/Images/backImage.jpg";
import { Link, useNavigate } from "react-router-dom";
import backButton from "../../assets/Logos/backButton.png";
import acrrowright from "../../assets/Images/arrow_circle_right.png";
import image2 from "../../assets/Images/robo 1 (1).png";
import logoutImage from "../../assets/Images/logoutItemLogo.png";

const ProfileAndSettings = () => {
    const [isModalOpen, setisModalOpen] = useState(false);
    const [isPwaPromptAvailable, setIsPwaPromptAvailable] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const navigate = useNavigate();

    const toggleModal = () => {
        setisModalOpen(!isModalOpen);
    };

    const yesLogout = () => {
        localStorage.removeItem("customerDetails");
        localStorage.removeItem("tokenDetails");
        navigate("/");
    };

    const dontdeleteuser = () => {
        setisModalOpen(!isModalOpen);
    };

    useEffect(() => {
        // Check if the app is running as a PWA
        const isPwa = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone;

        if (isPwa) {
            console.log("App is already running as a PWA");
            return; // Do not show the PWA installation prompt
        }

        // Listen for the `beforeinstallprompt` event
        window.addEventListener("beforeinstallprompt", (e) => {
            console.log("beforeinstallprompt event fired");
            e.preventDefault(); // Prevent the browser's default installation prompt
            setDeferredPrompt(e);
            setIsPwaPromptAvailable(true); // Show the "Download PWA" option
        });

        return () => {
            // Clean up the event listener
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
                setDeferredPrompt(null); // Clear the deferred prompt
            });
        } else {
            console.log("PWA installation prompt is not available.");
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
                            <p className="text-white font-semibold my-1">Profile & Setting</p>
                        </div>
                    </div>

                    <div className="flex justify-between">
                        <h1 className="text-start font-bold text-2xl p-4 text-black hidden md:block mt-10 mx-6">
                            Profile & Settings
                        </h1>
                        <p
                            className="text-start font-bold text-xl p-4 text-black hidden md:block mt-10 cursor-pointer"
                            onClick={toggleModal}
                        >
                            Logout
                        </p>
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
                                        Personal Details
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
                                        KYC
                                    </p>
                                    <img src={acrrowright} className="w-auto h-8" alt="Arrow Icon"></img>
                                </div>
                            </div>
                        </Link>

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
                                        Bank Account
                                    </p>
                                    <img src={acrrowright} className="w-auto h-8" alt="Arrow Icon"></img>
                                </div>
                            </div>
                        </Link>

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
                                        Language
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
                                        Download PWA
                                    </p>
                                    <img src={acrrowright} className="w-auto h-8" alt="Arrow Icon"></img>
                                </div>
                            </div>
                        )}
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
                                        Are you sure you want to Logout ?
                                    </h3>
                                    <button
                                        type="button"
                                        className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
                                        data-modal-hide="popup-modal"
                                        onClick={yesLogout}
                                    >
                                        Yes, I'm sure
                                    </button>
                                    <button
                                        type="button"
                                        className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100  focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                                        data-modal-hide="popup-modal"
                                        onClick={dontdeleteuser}
                                    >
                                        No, cancel
                                    </button>
                                    {/* <div className="text-start my-2">
                                            {ErrormessageforDeleteModal && (
                                                <span style={{ fontSize: '14px' }} className="text-red-400 text-xs text-satrt my-3">
                                                    {ErrormessageforDeleteModal}
                                                </span>
                                            )}
                                        </div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </>
    );
};

export default ProfileAndSettings;

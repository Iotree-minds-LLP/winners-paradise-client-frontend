import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import backImage from "../../assets/Images/backImage.jpg";
import backButton from "../../assets/Logos/backButton.png";
import { goBack } from "../../utils/Functions/goBackScreen";
import { getCustomersNotifications } from "../../network/Notifications/page";

const CatalogDetails = () => {

    const [expandedCard, setExpandedCard] = useState(null);
    const [isModalOpen, setisModalOpen] = useState(false);
    const navigate = useNavigate();
    const [notificationData, setnotificationData] = useState([])
    const location = useLocation();

    useEffect(() => {
        console.log(location.state?.item, "location");
    }, [location.state]);

    const toggleModal = () => {
        setisModalOpen(!isModalOpen);
    };

    useEffect(() => {
        const data = localStorage.getItem("customerDetails");
        const customer = JSON.parse(data);
        getAllNotifications(customer._id);
    }, []);

    const getAllNotifications = async (id) => {
        const resp = await getCustomersNotifications(id);
        console.log(resp.data.data.payoutsNotifications.notifications, "resp")
        setnotificationData(resp.data.data.payoutsNotifications.notifications)
    }


    const toggleCard = (id) => {
        setExpandedCard(expandedCard === id ? null : id);
    };

    const yesLogout = () => {
        localStorage.removeItem("customerDetails");
        localStorage.removeItem("tokenDetails");
        navigate("/");
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
                            <img src={backButton} onClick={goBack} className="w-8 h-8" alt="Back" />
                            <p className="text-white font-semibold my-1">Catalog Details</p>
                        </div>
                        <div className="text-white" onClick={toggleModal}>
                            Logout
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <h1 className="text-start font-bold text-2xl p-4 text-black hidden md:block mt-10">
                            Catalog Details
                        </h1>
                        <p
                            className="text-start font-bold text-xl p-4 text-black hidden md:block mt-10 cursor-pointer"
                            onClick={toggleModal}
                        >
                            Logout
                        </p>
                    </div>

                    <div className="text-start rounded-lg mt-5 p-4 grid md:grid-cols-3 grid-cols-1 gap-4">

                    </div>
                </div>
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
                                    <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                        Are you sure you want to Logout?
                                    </h3>
                                    <button
                                        type="button"
                                        className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
                                        onClick={yesLogout}
                                    >
                                        Yes, I'm sure
                                    </button>
                                    <button
                                        type="button"
                                        className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 bg-white rounded-lg border hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                                        onClick={toggleModal}
                                    >
                                        No, cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default CatalogDetails;

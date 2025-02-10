import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import backImage from "../../assets/Images/backImage.jpg";
import backButton from "../../assets/Logos/backButton.png";
import { goBack } from "../../utils/Functions/goBackScreen";
import { getCustomersNotifications } from "../../network/Notifications/page";
import image2 from "../../assets/Images/robo 1 (1).png";
import translations from "../../utils/Json/translation.json"
import { useLanguage } from "../../context/Language/loginContext";

const Notifications = () => {

    const [expandedCard, setExpandedCard] = useState(null);
    const { language, setLanguage } = useLanguage();
    const [isModalOpen, setisModalOpen] = useState(false);
    const [notificationData, setnotificationData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();


    useEffect(() => {
        const data = localStorage.getItem("customerDetails");
        const customer = JSON.parse(data);
        getAllNotifications(customer._id);
    }, []);

    const getAllNotifications = async (id) => {
        setLoading(true);
        try {
            const resp = await getCustomersNotifications(id);
            setnotificationData(resp?.data?.data?.payoutsNotifications?.notifications || []);
        } catch (error) {
            console.error("Error fetching notifications:", error);
            setnotificationData([]);
        } finally {
            setLoading(false);
        }
    };

    const toggleModal = () => {
        setisModalOpen(!isModalOpen);
    };

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
                    <div className="h-[60px] fixed top-0 right-0 left-0 w-full sm:hidden bg-gradient-to-l from-[#020065] to-[#0400CB] flex flex-row justify-between p-4">
                        <div className="flex flex-row">
                            <img src={backButton} onClick={goBack} className="w-8 h-8" alt="Back" />
                            <p className="text-white font-semibold my-1">{translations.Notifications.heading[language]}</p>
                        </div>
                    </div>
                    <div className="flex justify-between hidden md:block">
                        <div className="flex flex-row mx-4 gap-4 mt-14">
                            <h1 className="text-start font-bold text-2xl text-black hidden md:block">{translations.Notifications.heading1[language]}</h1>
                        </div>
                    </div>

                    <div className="text-start rounded-lg md:mt-5 mt-14 p-4 grid md:grid-cols-1 w-full md:w-1/3 grid-cols-1 gap-4 ">

                        {loading ? (
                            Array.from({ length: 6 }).map((_, index) => (
                                <div key={index} className="p-4 rounded-lg bg-gray-100">
                                    <Skeleton height={20} width={`60%`} />
                                    <Skeleton height={15} width={`80%`} className="mt-2" />
                                    <Skeleton height={15} width={`90%`} className="mt-2" />
                                    <Skeleton height={15} width={`70%`} className="mt-2" />
                                </div>
                            ))
                        ) : notificationData && notificationData.length > 0 ? (
                            notificationData.map((notification) => (
                                <div
                                    key={notification._id}
                                    className={`p-4 rounded-lg transition-all duration-300 flex flex-col justify-between ${expandedCard === notification.id ? "h-auto" : "h-32"
                                        }`}
                                    style={{ backgroundColor: "rgba(245, 245, 245, 1)" }}
                                >
                                    <div>
                                        <p
                                            style={{
                                                color: "rgba(0, 0, 148, 1)",
                                                fontWeight: "700",
                                                fontSize: "14px",
                                            }}
                                        >
                                            {notification.title}
                                        </p>

                                        {expandedCard === notification._id ? (
                                            <p className="my-2 text-gray-600">{notification.body}</p>
                                        ) : (
                                            <p className="my-2">
                                                {notification.body.slice(0, 30) + "..."}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex justify-between items-center mt-2">
                                        <p className="text-sm text-gray-500">
                                            {translations.global.postedOn[language]}{" "}
                                            {new Date(notification.createdAt).toLocaleDateString(
                                                "en-US",
                                                {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                }
                                            )}
                                        </p>
                                        {notification.body.trim().length > 30 &&
                                            <p
                                                className="text-sm cursor-pointer text-blue-600"
                                                onClick={() => toggleCard(notification._id)}
                                            >
                                                <b>{expandedCard === notification._id ? "Know Less" : "Know More"}</b>
                                            </p>
                                        }

                                    </div>

                                </div>
                            ))
                        ) : (
                            <div className="text-center md:text-start md:mx-2  text-gray-500 font-medium text-lg md:text-xl">
                                {translations.Notifications.noNotificationsMessage[language]}
                            </div>
                        )}
                    </div>

                </div>
            </div>

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

export default Notifications;
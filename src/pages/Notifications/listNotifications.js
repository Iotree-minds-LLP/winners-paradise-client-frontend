import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css"; // Import default styles
import backImage from "../../assets/Images/backImage.jpg";
import backButton from "../../assets/Logos/backButton.png";
import { goBack } from "../../utils/Functions/goBackScreen";
import { getCustomersNotifications } from "../../network/Notifications/page";
import image2 from "../../assets/Images/robo 1 (1).png";


const Notifications = () => {
    const [expandedCard, setExpandedCard] = useState(null);
    const [isModalOpen, setisModalOpen] = useState(false);
    const [notificationData, setnotificationData] = useState(null); // Initial null to show loading state
    const [loading, setLoading] = useState(true); // Loading state
    const navigate = useNavigate();

    useEffect(() => {
        const data = localStorage.getItem("customerDetails");
        const customer = JSON.parse(data);
        getAllNotifications(customer._id);
    }, []);

    const getAllNotifications = async (id) => {
        setLoading(true); // Start loading
        try {
            const resp = await getCustomersNotifications(id);
            setnotificationData(resp?.data?.data?.payoutsNotifications?.notifications || []);
        } catch (error) {
            console.error("Error fetching notifications:", error);
            setnotificationData([]);
        } finally {
            setLoading(false); // End loading
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
                    <div className="h-[60px] sm:hidden bg-gradient-to-l from-[#020065] to-[#0400CB] flex flex-row justify-between p-4">
                        <div className="flex flex-row">
                            <img src={backButton} onClick={goBack} className="w-8 h-8" alt="Back" />
                            <p className="text-white font-semibold my-1">Notifications</p>
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <h1 className="text-start font-bold text-2xl p-4 text-black hidden md:block mt-10">
                            My Notifications
                        </h1>
                    </div>

                    <div className="text-start rounded-lg mt-5 p-4 grid md:grid-cols-3 grid-cols-1 gap-4">
                        {loading ? (
                            // Shimmering Effect Using Skeleton
                            Array.from({ length: 6 }).map((_, index) => (
                                <div key={index} className="p-4 rounded-lg bg-gray-100">
                                    <Skeleton height={20} width={`60%`} />
                                    <Skeleton height={15} width={`80%`} className="mt-2" />
                                    <Skeleton height={15} width={`90%`} className="mt-2" />
                                    <Skeleton height={15} width={`70%`} className="mt-2" />
                                </div>
                            ))
                        ) : notificationData && notificationData.length > 0 ? (
                            // Notifications List
                            notificationData.map((notification) => (
                                <div
                                    key={notification.id}
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

                                        {expandedCard === notification.id ? (
                                            <p className="my-2 text-gray-600">{notification.body}</p>
                                        ) : (
                                            <p className="my-2">
                                                {notification.body.slice(0, 30) + "..."}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex justify-between items-center mt-2">
                                        <p className="text-sm text-gray-500">
                                            Posted By{" "}
                                            {new Date(notification.createdAt).toLocaleDateString(
                                                "en-US",
                                                {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                }
                                            )}
                                        </p>
                                        <p
                                            className="text-sm cursor-pointer text-blue-600"
                                            onClick={() => toggleCard(notification.id)}
                                        >
                                            <b>{expandedCard === notification.id ? "Know Less" : "Know More"}</b>
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center md:text-start md:mx-2  text-gray-500 font-medium text-lg md:text-xl">
                                No notifications yet.
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

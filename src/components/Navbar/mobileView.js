import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import imageLogo from "../../assets/Logos/logohere.png"; // Adjust based on your project structure
import bellIcon from "../../assets/Logos/bellIcon2.png"; // Adjust based on your project structure
import translations from "../../utils/Json/translation.json"; // Adjust translation file if applicable
import { getCustomerById } from "../../network/Customer/page";
import { useLanguage } from "../../context/Language/loginContext";

const GlobalHeader = () => {
    const [customerDetails, setCustomerDetails] = useState(null);
    const { language, setLanguage } = useLanguage();

    useEffect(() => {
        const data = localStorage.getItem("customerDetails");
        if (data) {
            const customer = JSON.parse(data);
            fetchCustomerDetails(customer?._id);
        }
    }, []);

    const fetchCustomerDetails = async (id) => {
        if (id) {
            const resp = await getCustomerById(id);
            if (resp?.data?.status === 200) {
                setCustomerDetails(resp?.data?.data?.customer);
            }
        }
    };

    return (
        <div className="object-contain overflow-auto z-50 fixed top-0 right-0 left-0 w-full flex justify-between sm:hidden bg-gradient-to-l from-[#020065] to-[#0400CB]">
            {/* Dashboard Title */}
            <h1 className="text-start font-bold text-2xl p-4 text-white hidden md:block">
                {translations.PayoutsDetails.dashboard[language]}
            </h1>

            {/* Logo */}
            <img className="h-auto sm:hidden w-1/6 p-4 md:mt-0 text-start" src={imageLogo} alt="Logo" />

            {/* Subtitle */}
            <p className="mt-6 sm:hidden text-white font-semibold text-xl">
                {translations.PayoutsDetails.winnersParadise[language]}
            </p>

            {/* Notification and Profile */}
            <div className="flex flex-row justify-center items-center text-white">
                <Link to="/notifications">
                    <img src={bellIcon} className="w-auto h-12" alt="Bell Icon" />
                </Link>
                <Link to="/profile-and-settings">
                    <Avatar
                        className="mr-3 flex justify-center items-center"
                        alt="User Avatar"
                        sx={{ width: 30, height: 30, bgcolor: "primary.main", fontSize: 14, fontWeight: "bold" }}
                    >
                        {customerDetails?.profile_image ? (
                            <img
                                src={customerDetails.profile_image}
                                alt="Profile"
                                className="w-full h-full object-cover rounded-full"
                            />
                        ) : (
                            customerDetails?.name?.charAt(0)?.toUpperCase() || "U"
                        )}
                    </Avatar>
                </Link>
            </div>
        </div>
    );
};

export default GlobalHeader;

import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import backImage from "../../assets/Images/backImage.jpg";
import backButton from "../../assets/Logos/backButton.png";
import { Link, useNavigate } from "react-router-dom";
import { getCustomerById } from "../../network/Customer/page";
import { goBack } from "../../utils/Functions/goBackScreen";
import image2 from "../../assets/Images/robo 1 (1).png";
import { useLanguage } from "../../context/Language/loginContext";
import translations from "../../utils/Json/translation.json"

const MyProfile = () => {
    const [customerDetailsFromAPI, setCustomerDetailsFromAPI] = useState(null); // Initially null to show loading state
    const [isLoading, setisLoading] = useState(true);
    const navigate = useNavigate();
    const { language, setLanguage } = useLanguage();



    useEffect(() => {
        const data = localStorage.getItem("customerDetails");
        const customer = JSON.parse(data);
        fetchCustomerDetails(customer._id);
    }, []);

    const fetchCustomerDetails = async (id) => {
        setisLoading(true); // Start loading
        try {
            if (id) {
                const resp = await getCustomerById(id);
                if (resp.data.status === 200) {
                    setCustomerDetailsFromAPI(resp.data.data.customer);
                }
            }
        } catch (error) {
            console.error("Error fetching customer details:", error);
        } finally {
            setisLoading(false); // End loading
        }
    };

    return (
        <>
            <div className="sm:ml-72 relative bg-white">
                {/* Background Image */}
                <img src={backImage} className="opacity-30 hidden md:block absolute inset-0 object-cover z-0 w-full" alt="Background" />

                {/* Content Wrapper */}
                <div className="relative z-10">
                    {/* Gradient Header */}
                    <div className="h-[60px] sm:hidden bg-gradient-to-l from-[#020065] to-[#0400CB] flex flex-row justify-between p-4">
                        <div className="flex flex-row">
                            <img src={backButton} onClick={goBack} className="w-8 h-8" alt="Back" />
                            <p className="text-white font-semibold my-1">{translations.MyProfile.heading[language]}
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-between hidden md:block">
                        <div className="flex flex-row mx-4 gap-4 mt-14">
                            <img onClick={goBack} src="https://cdn-icons-png.flaticon.com/512/3114/3114883.png" className="w-auto h-8" alt="Background" />
                            <h1 className="text-start font-bold text-2xl text-black hidden md:block">{translations.MyProfile.heading1[language]}</h1>
                        </div>
                        {/* <p className="text-start font-bold text-xl p-4 text-black hidden md:block mt-10 cursor-pointer	" onClick={toggleModal}>Logout</p> */}
                    </div>


                    <div className="text-start rounded-lg mt-5 p-4 md:px-10 grid md:grid-cols-1 grid-cols-1 gap-4">
                        <div className="p-4 md:p-6 rounded-lg w-full md:w-1/2" style={{ backgroundColor: 'rgba(245, 245, 245, 1)' }}>
                            {isLoading ? (
                                // Shimmering Effect for Loading State
                                <>
                                    <div className="mb-4">
                                        <Skeleton width="50%" height={20} />
                                        <Skeleton width="80%" height={25} className="mt-2" />
                                    </div>
                                    <div className="my-3">
                                        <Skeleton width="50%" height={20} />
                                        <Skeleton width="80%" height={25} className="mt-2" />
                                    </div>
                                    <div className="my-3">
                                        <Skeleton width="50%" height={20} />
                                        <Skeleton width="80%" height={25} className="mt-2" />
                                    </div>
                                    <div className="my-3">
                                        <Skeleton width="50%" height={20} />
                                        <Skeleton width="80%" height={25} className="mt-2" />
                                    </div>
                                </>
                            ) : (
                                // Render Profile Details
                                <>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-sm text-gray-800">{translations.MyProfile.fullName[language]}</p>
                                            <p style={{ color: 'rgba(0, 0, 148, 1)', fontWeight: '700', fontSize: '18px' }}>
                                                {customerDetailsFromAPI.name}
                                            </p>
                                        </div>
                                        <Link to="/edit-customer-details">
                                            <button aria-label="Edit" className="p-2 hidden sm:block">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                    fill="black"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    className="w-6 h-6"
                                                >
                                                    <path d="M12 20h9"></path>
                                                    <path d="M16.5 3.5l4 4L7 21H3v-4L16.5 3.5z"></path>
                                                </svg>
                                            </button>
                                        </Link>
                                    </div>

                                    <div className="my-3">
                                        <p className="text-sm text-gray-800">{translations.MyProfile.phoneNumber[language]}</p>
                                        <p style={{ color: 'rgba(0, 0, 148, 1)', fontWeight: '700', fontSize: '18px' }}>+91 {customerDetailsFromAPI.mobile_no}</p>
                                    </div>

                                    <div className="my-3">
                                        <p className="text-sm text-gray-800">{translations.MyProfile.emailId[language]}</p>
                                        <p style={{ color: 'rgba(0, 0, 148, 1)', fontWeight: '700', fontSize: '18px' }}>{customerDetailsFromAPI.email_id}</p>
                                    </div>

                                    <div className="my-3">
                                        <p className="text-sm text-gray-800">{translations.MyProfile.dob[language]}</p>
                                        <p style={{ color: 'rgba(0, 0, 148, 1)', fontWeight: '700', fontSize: '18px' }}>
                                            {new Date(customerDetailsFromAPI.dob).toLocaleDateString('en-GB', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric'
                                            })}
                                        </p>
                                    </div>

                                    <div className="my-3">
                                        <p className="text-sm text-gray-800">{translations.MyProfile.address[language]}</p>
                                        <p
                                            style={{
                                                color: 'rgba(0, 0, 148, 1)',
                                                fontWeight: '700',
                                                fontSize: '18px',
                                                wordWrap: 'break-word', // Ensures text wraps to the next line
                                                overflowWrap: 'break-word', // Break long words if needed
                                                whiteSpace: 'normal', // Prevents text from staying in a single line
                                            }}
                                        >
                                            {customerDetailsFromAPI.address}, {customerDetailsFromAPI.state}, {customerDetailsFromAPI.district}, {customerDetailsFromAPI.city}
                                        </p>
                                    </div>


                                    {customerDetailsFromAPI.alternate_mobile_no && (
                                        <div className="my-3">
                                            <p className="text-sm text-gray-800">{translations.MyProfile.alternatePhone[language]}</p>
                                            <p style={{ color: 'rgba(0, 0, 148, 1)', fontWeight: '700', fontSize: '18px' }}>
                                                {customerDetailsFromAPI.alternate_mobile_no}
                                            </p>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div>

                <div className="fixed bottom-0 left-0 w-full sm:hidden">
                    <div className="bg-white shadow-md">
                        <img
                            src={image2}
                            alt="Image description"
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <Link to="/edit-customer-details">

                        <div className="absolute bottom-0 left-0 w-full flex justify-center items-center p-3">
                            <button
                                type="submit"
                                className="w-full p-3 px-24 flex justify-center rounded-full text-white bg-gradient-to-l from-[#020065] to-[#0400CB]"
                            >
                                {translations.MyProfile.editProfileButton[language]}
                            </button>
                        </div>
                    </Link>
                </div>


            </div>

        </>
    );
};

export default MyProfile;

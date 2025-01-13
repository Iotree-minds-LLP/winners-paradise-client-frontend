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

const MyProfile = () => {

    const [response, setResponse] = useState([]);
    const [customerDetailsFromAPI, setCustomerDetailsFromAPI] = useState([]);
    const [isLoading, setisLoading] = useState(false)
    const [ErrorMessage, setErrorMessage] = useState("")
    const [isModalOpen, setisModalOpen] = useState(false);

    const navigate = useNavigate();

    const toggleModal = () => {
        setisModalOpen(!isModalOpen);
    }

    useEffect(() => {
        const data = localStorage.getItem("customerDetails");
        const customer = JSON.parse(data);
        onformSubmit2(customer._id)
    }, []);


    const onformSubmit2 = async (id) => {
        if (id) {
            const resp = await getCustomerById(id);
            if (resp.data.status === 200) {
                console.log(resp.data.data.customer)
                setCustomerDetailsFromAPI(resp.data.data.customer)
            }
        }
    };



    return (
        <>
            <div className="sm:ml-72 relative bg-white">
                {/* Background Image */}
                <img src={backImage} className="opacity-30	hidden md:block absolute inset-0 object-cover z-0 w-full" alt="Background" />

                {/* Content Wrapper */}
                <div className="relative z-10">
                    {/* Gradient Header */}
                    <div className="h-[60px] sm:hidden bg-gradient-to-l from-[#020065] to-[#0400CB] flex flex-row justify-between p-4">
                        <div className="flex flex-row">
                            <img src={backButton} onClick={goBack} className="w-8 h-8" alt="Back" />
                            <p className="text-white font-semibold my-1">Profile Details</p>
                        </div>

                    </div>

                    <div className="flex justify-between">
                        <h1 className="text-start font-bold text-2xl p-4 text-black hidden md:block mt-10 mx-6">Personal Details</h1>
                    </div>

                    <div className="text-start rounded-lg mt-5 p-4 md:px-10 grid md:grid-cols-1 grid-cols-1 gap-4">
                        <div className="p-4 md:p-6 rounded-lg w-full md:w-1/2" style={{ backgroundColor: 'rgba(245, 245, 245, 1)' }}>
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-sm text-gray-800">Full Name</p>
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
                                <p className="text-sm text-gray-800">Phone Number</p>
                                <p style={{ color: 'rgba(0, 0, 148, 1)', fontWeight: '700', fontSize: '18px' }}>+91 {customerDetailsFromAPI.mobile_no}</p>
                            </div>

                            <div className="my-3">
                                <p className="text-sm text-gray-800">Email Id</p>
                                <p style={{ color: 'rgba(0, 0, 148, 1)', fontWeight: '700', fontSize: '18px' }}>{customerDetailsFromAPI.email_id}</p>
                            </div>

                            <div className="my-3">
                                <p className="text-sm text-gray-800">DOB</p>
                                <p style={{ color: 'rgba(0, 0, 148, 1)', fontWeight: '700', fontSize: '18px' }}>
                                    {new Date(customerDetailsFromAPI.dob).toLocaleDateString('en-GB', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric'
                                    })}
                                </p>

                            </div>

                            <div className="my-3">
                                <p className="text-sm text-gray-800">Address</p>
                                <p style={{ color: 'rgba(0, 0, 148, 1)', fontWeight: '700', fontSize: '18px' }}>{customerDetailsFromAPI.address},{customerDetailsFromAPI.state},{customerDetailsFromAPI.district},{customerDetailsFromAPI.city}</p>
                            </div>

                            {customerDetailsFromAPI.alternate_mobile_no && (
                                <div className="my-3">
                                    <p className="text-sm text-gray-800">Alternate Phone number</p>
                                    <p style={{ color: 'rgba(0, 0, 148, 1)', fontWeight: '700', fontSize: '18px' }}>{customerDetailsFromAPI.alternate_mobile_no}</p>
                                </div>
                            )}


                        </div>

                    </div>


                </div>

                <div className="mt-5 sm:hidden p-3 fixed bottom-0 left-0 w-full bg-white shadow-md">
                    <Link to="/edit-customer-details">
                        <button
                            type="submit"
                            className="md:w-full w-full p-3 rounded-full text-white bg-gradient-to-l from-[#020065] to-[#0400CB] flex items-center justify-center"
                        >
                            Edit Details
                        </button>
                    </Link>
                </div>
            </div >
        </>
    );
};

export default MyProfile;

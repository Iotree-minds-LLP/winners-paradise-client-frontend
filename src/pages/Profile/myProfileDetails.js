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

const MyProfile = () => {

    const [response, setResponse] = useState([]);
    const [customerDetailsFromToken, setCustomerDetailsFromToken] = useState([]);
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
        setCustomerDetailsFromToken(customer);
    }, []);

    useEffect(() => {

        const onformSubmit2 = async () => {
            const resp = await getCustomerById(customerDetailsFromToken._id);
            if (resp.data.status === 200) {
                console.log(resp.data.data.customer)
                setCustomerDetailsFromAPI(resp.data.data.customer)
            }
        };

        onformSubmit2()

    }, [customerDetailsFromToken])


    const yesLogout = () => {
        localStorage.removeItem("customerDetails");
        localStorage.removeItem("tokenDetails");
        navigate("/")
    }


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
                            <img src={backButton} className="w-8 h-8" alt="Back" />
                            <p className="text-white font-semibold my-1">Profile Details</p>
                        </div>
                        <div className="text-white" onClick={toggleModal}>
                            Logout
                        </div>
                    </div>

                    <div className="flex justify-between">
                        <h1 className="text-start font-bold text-2xl p-4 text-black hidden md:block mt-10 mx-6">Personal Details</h1>
                        <p className="text-start font-bold text-xl p-4 text-black hidden md:block mt-10 cursor-pointer	" onClick={toggleModal}>Logout</p>
                    </div>

                    <div className="text-start rounded-lg mt-5 p-4 md:px-10 grid md:grid-cols-1 grid-cols-1 gap-4">
                        <div className="p-4 md:p-6 rounded-lg w-full md:w-1/2" style={{ backgroundColor: 'rgba(245, 245, 245, 1)' }}>
                            <div className="">
                                <p className="text-sm text-gray-800">Full Name</p>
                                <p style={{ color: 'rgba(0, 0, 148, 1)', fontWeight: '700', fontSize: '18px' }}>{customerDetailsFromAPI.name}</p>
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
                                        // onClick={dontdeleteuser}
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

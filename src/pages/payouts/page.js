import { useEffect, useState } from "react";
import imageLogo from "../../assets/Logos/Algo-Achievers-Logo_009600960_38721 1 (1).png";
import bellIcon from "../../assets/Logos/bellIcon2.png";
import userIcon from "../../assets/Logos/usericon.png";
import footerLogo1 from "../../assets/Logos/onboardingLogos/featured_play_list.png";
import footerLogo2 from "../../assets/Logos/onboardingLogos/timeline (1).png";
import footerLogo3 from "../../assets/Logos/onboardingLogos/icon-container (2).png";
import backImage from "../../assets/Images/backImage.jpg"
import { Link, useNavigate } from "react-router-dom";
import logo1 from "../../assets/Images/payouts1.png"
import logo2 from "../../assets/Images/payouts2.png"
import { getAllOverAllPayouts, getAllPayouts, getAllReferralPayouts } from "../../network/Payouts/page";

const Payouts = () => {

    const [isModalOpen, setisModalOpen] = useState(false);
    const navigate = useNavigate();
    const [past, setpast] = useState(false)
    const [response, setResponse] = useState([]);
    const [listPayouts, setlistPayouts] = useState([])

    useEffect(() => {
        const data = localStorage.getItem("customerDetails");
        const customer = JSON.parse(data);
        onformSubmit(customer._id)
    }, []);


    const onformSubmit = async () => {
        const resp = await getAllOverAllPayouts();
        setlistPayouts(resp.data.data.payouts)
    };
    const today = new Date();

    const upcomingPayouts = listPayouts.filter(
        (payout) => new Date(payout.expected_payout_date) >= today
    );

    const pastPayouts = listPayouts.filter(
        (payout) => new Date(payout.expected_payout_date) < today
    );

    const payoutsToDisplay = past ? pastPayouts : upcomingPayouts;

    const onformSubmit2 = async () => {
        const id = "673b19d8175d733ba756d211";
        const resp = await getAllReferralPayouts(id);
        setResponse(resp.data.data);
    };


    const toggleModal = () => {
        setisModalOpen(!isModalOpen);
    }

    const toggleSelection = () => {
        setpast(!past);
    }


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
                    <div className="object-contain flex justify-between  sm:hidden bg-gradient-to-l from-[#020065] to-[#0400CB]">
                        <h1 className="text-start font-bold text-2xl p-4 text-white hidden md:block">Dashboard</h1>
                        <img
                            className="h-auto sm:hidden w-1/5 p-4 md:mt-0 text-start"
                            src={imageLogo}
                            alt="Logo"
                        />
                        <p className="mt-6 sm:hidden text-white font-semibold text-xl">
                            Winners Paradise
                            {/* <p className="mt-6 sm:hidden text-white font-semibold text-sm" onClick={toggleModal}>Logout</p> */}
                        </p>
                        <div className="flex flex-row text-white">
                            <img src={bellIcon} className="w-auto h-12 mt-4" alt="Bell Icon"></img>
                            <img src={userIcon} className="w-auto h-12 mt-4" alt="User Icon"></img>

                        </div>
                    </div>

                    <div className="flex justify-between">
                        <h1 className="text-start font-bold text-2xl p-4 text-black hidden md:block mt-10 px-10">Payouts Tracker</h1>
                        <p className="text-start font-bold text-xl p-4 text-black hidden md:block mt-10 cursor-pointer	" onClick={toggleModal}>Logout</p>
                    </div>

                    {/* Catalogue Heading */}

                    {/* Return Calculator */}
                    <div className="text-start grid grid-cols-12 grid-cols-12 p-0 md:p-10">
                        <div className="col-span-6">
                            <div onClick={toggleSelection}
                                className="p-4 flex flex-row justify-center items-center gap-2" style={{ background: "#E7E7FF" }}
                            >
                                <img className="w-5 h-5" src={logo1}></img>
                                <p style={{ color: "#020065" }} className="font-bold text-md">
                                    Upcoming
                                </p>
                            </div>
                            {!past && (
                                <p style={{ background: "#020065", height: '2.5px' }} ></p>
                            )}
                        </div>
                        <div className="col-span-6">
                            <div
                                onClick={toggleSelection}
                                className="p-4 flex flex-row justify-center gap-2 items-center" style={{ background: "#E7E7FF" }}
                            >
                                <img className="w-5 h-5" src={logo2}></img>
                                <p style={{ color: "#020065" }} className="font-bold text-md">
                                    Past
                                </p>

                            </div>
                            {past && (
                                <p style={{ background: "#020065", height: '2.5px' }} ></p>
                            )}
                        </div>
                    </div>



                    <div className="grid grid-cols-1 md:grid-cols-3 px-5 gap-4 mx-0 md:mx-4">
                        {payoutsToDisplay?.map((payout, index) => (
                            <>
                                <div
                                    key={index}
                                    className="flex justify-between p-4 rounded-lg"
                                    style={{ background: "#F5F5F5" }}
                                >
                                    <div className="flex flex-col text-start">
                                        <p className="text-md">Payout Amount</p>
                                        <p
                                            className="font-bold text-md"
                                            style={{ color: "#020065" }}
                                        >
                                            ₹{payout?.expected_payout_amount}
                                        </p>
                                    </div>
                                    <div className="flex flex-col text-start">
                                        <p className="text-md">Payout On</p>
                                        <p
                                            className="font-bold text-md"
                                            style={{ color: "#020065" }}
                                        >
                                            {new Date(payout?.expected_payout_date).toLocaleDateString("en-GB")}
                                        </p>
                                    </div>

                                </div>
                                <div className="hidden sm:block"></div>
                                <div className="hidden sm:block"></div>
                            </>
                        ))}
                    </div>


                    {/* Investment Cards */}

                    {/* Footer Navigation */}
                    <div
                        className="sm:hidden bg-gradient-to-l from-[#020065] to-[#0400CB]"
                        style={{
                            position: 'fixed',
                            bottom: 0,
                            width: '100%',
                        }}
                    >
                        <div className="grid grid-cols-3">
                            {/* Catalogue */}

                            <Link to="/catalogs">
                                <div className=" p-2 flex flex-col items-center">
                                    <div className="px-5 p-3 rounded-full flex items-center justify-center">
                                        <img className="w-auto h-8" src={footerLogo1} alt="Footer Logo 1" />
                                    </div>
                                    <p className="mt-2 text-md font-bold text-center text-white">
                                        Catalogue
                                    </p>
                                </div>
                            </Link>

                            <Link to="/dashboard">

                                {/* Dashboard */}
                                <div className="p-2  flex flex-col items-center">
                                    <div className="p-3 rounded-full flex items-center justify-center">
                                        <img className="w-auto h-8" src={footerLogo2} alt="Footer Logo 2" />
                                    </div>
                                    <p className="mt-2 text-md font-bold text-center text-white" >
                                        Dashboard
                                    </p>
                                </div>

                            </Link>

                            <Link to="/payouts">

                                {/* Payouts */}
                                <div className=" p-2 flex flex-col items-center">
                                    <div className="bg-white p-3 rounded-full flex items-center justify-center">
                                        <img className="w-auto h-8" src={footerLogo3} alt="Footer Logo 3" />
                                    </div>
                                    <p className="mt-2 text-md font-bold text-center text-white">
                                        Payouts
                                    </p>
                                </div>
                            </Link>

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
            </div>

        </>
    );
};

export default Payouts;

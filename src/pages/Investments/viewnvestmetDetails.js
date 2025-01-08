import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import backImage from "../../assets/Images/backImage.jpg";
import backButton from "../../assets/Logos/backButton.png";
import { goBack } from "../../utils/Functions/goBackScreen";
import { getAllOverAllPayouts, getAllPayouts, getAllPayoutsBYInvestmentId } from "../../network/Payouts/page";


const InvestmentDetails = () => {

    const [isModalOpen, setisModalOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const [SelectedInvestmentDetails, setSelectedInvestmentDetails] = useState({});
    const [totalReturn, settotalReturn] = useState(0);
    const [listPayouts, setlistPayouts] = useState([]);

    useEffect(() => {
        setSelectedInvestmentDetails(location.state?.item?.investment);
    }, [location.state]);

    useEffect(() => {
        const totalReturn =
            SelectedInvestmentDetails.amount *
            (SelectedInvestmentDetails.interest_per_month / 100) *
            SelectedInvestmentDetails.period_in_months;
        settotalReturn(totalReturn);
    }, [SelectedInvestmentDetails])

    const toggleModal = () => {
        setisModalOpen(!isModalOpen);
    };

    useEffect(() => {

        const onformSubmit = async () => {
            const resp = await getAllPayoutsBYInvestmentId(SelectedInvestmentDetails._id);
            setlistPayouts(resp?.data?.data?.payouts)
        };

        onformSubmit();

    }, [SelectedInvestmentDetails])

    const today = new Date();

    const upcomingPayouts = listPayouts?.filter(
        (payout) => new Date(payout.expected_payout_date) >= today || payout.status === "not_paid"
    );

    const pastPayouts = listPayouts?.filter(
        (payout) => new Date(payout.expected_payout_date) < today
    );

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
                            <p className="text-white font-semibold my-1">Investment Details </p>
                        </div>
                        <div className="text-white" onClick={toggleModal}>
                            Logout
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <h1 className="text-start font-bold text-2xl p-4 text-black hidden md:block mt-10">
                            Investment Details
                        </h1>
                        <p
                            className="text-start font-bold text-xl p-4 text-black hidden md:block mt-10 cursor-pointer"
                            onClick={toggleModal}
                        >
                            Logout
                        </p>
                    </div>

                    <div className=" text-start rounded-lg px-4 mt-4 grid md:grid-cols-3 grid-cols-1 gap-4">
                        <div className="flex flex-row  ">
                            <p style={{ color: "#020065" }} className="text-md font-semibold">Investment Description </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <p className="text-md px-4 mt-3 text-start font-medium">Lorem Ipsum is simply dummy text of the printing and  typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of  type and scrambled it to make a type specimen book. It has survived not  only five centuries,</p>
                    </div>

                    <div className="grid grid-cols-1 px-4 mt-4 md:grid-cols-2 gap-4 text-start">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4"  >
                            <div style={{ background: "#F5F5F5" }} className="p-3">
                                <p>Investment Amount</p>
                                <p
                                    className="text-md font-bold my-2"
                                    style={{ color: 'rgba(0, 0, 148, 1)' }}
                                >
                                    ₹{SelectedInvestmentDetails.amount}

                                </p>
                            </div>
                            <div style={{ background: "#F5F5F5" }} className="p-4">
                                <p>Returns</p>
                                <p></p>
                                <p
                                    className="text-md font-bold my-2"
                                    style={{ color: 'rgba(0, 0, 148, 1)' }}
                                >
                                    {SelectedInvestmentDetails.interest_per_month}%
                                </p>
                            </div>
                            <div style={{ background: "#F5F5F5" }} className="p-4">
                                <p>Duration</p>
                                <p
                                    className="text-md font-bold my-2"
                                    style={{ color: 'rgba(0, 0, 148, 1)' }}
                                >
                                    {SelectedInvestmentDetails.period_in_months} Months
                                </p>
                            </div>
                            <div style={{ background: "#F5F5F5" }} className="p-4">
                                <p>Returns per month</p>
                                <p></p>
                                <p
                                    className="text-md font-bold my-2"
                                    style={{ color: 'rgba(0, 0, 148, 1)' }}
                                >
                                    ₹{totalReturn}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className=" text-start rounded-lg px-4 mt-4 grid md:grid-cols-3 grid-cols-1 gap-4">
                        <div className="flex flex-row  ">
                            <p style={{ color: "#020065" }} className="text-md font-semibold">Upcoming Payout </p>
                        </div>
                    </div>

                    <div className="z-10 my-4 grid grid-cols-1 md:grid-cols-3 px-5 gap-4 mx-0 ">
                        {upcomingPayouts?.map((payout, index) => (
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


                    <div className=" text-start rounded-lg px-4 mt-4 grid md:grid-cols-3 grid-cols-1 gap-4">
                        <div className="flex flex-row  ">
                            <p style={{ color: "#020065" }} className="text-md font-semibold">Payout History </p>
                        </div>
                    </div>

                    <div className="z-10 my-4 grid grid-cols-1 md:grid-cols-3 px-5 gap-4 mx-0 ">

                        {pastPayouts?.map((payout, index) => (
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

            </div >
        </>
    );
};

export default InvestmentDetails;

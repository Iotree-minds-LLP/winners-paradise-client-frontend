import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import backImage from "../../assets/Images/backImage.jpg";
import backButton from "../../assets/Logos/backButton.png";
import { goBack } from "../../utils/Functions/goBackScreen";
import { getAllOverAllPayouts, getAllPayouts, getAllPayoutsBYInvestmentId } from "../../network/Payouts/page";
import { DownloadForOffline } from "@mui/icons-material";


const InvestmentDetails = () => {

    const [isModalOpen, setisModalOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const [SelectedInvestmentDetails, setSelectedInvestmentDetails] = useState({});
    const [totalReturn, settotalReturn] = useState(0);
    const [listPayouts, setlistPayouts] = useState([]);
    const [ReturnPerMonth, setReturnPerMonth] = useState()
    useEffect(() => {
        setSelectedInvestmentDetails(location.state?.item?.investment);
        console.log(location.state?.item?.investment, "location.state?.item?.investment")
    }, [location.state]);

    useEffect(() => {
        if (
            SelectedInvestmentDetails?.amount &&
            SelectedInvestmentDetails?.interest_per_month &&
            SelectedInvestmentDetails?.period_in_months
        ) {
            // Calculate the monthly interest and add it to the amount
            const totalReturn =
                SelectedInvestmentDetails.amount +
                (SelectedInvestmentDetails.amount *
                    (SelectedInvestmentDetails.interest_per_month / 100) *
                    SelectedInvestmentDetails.period_in_months);

            // Calculate return per month
            const returnPerMonth =
                (SelectedInvestmentDetails.amount *
                    (SelectedInvestmentDetails.interest_per_month / 100));

            // Update states
            settotalReturn(totalReturn);
            setReturnPerMonth(returnPerMonth);
        }
    }, [SelectedInvestmentDetails]);


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


    const investmentAmount = SelectedInvestmentDetails?.amount || 0;
    const annualReturnRate = SelectedInvestmentDetails?.interest_per_month || 0;
    const durationInMonths = SelectedInvestmentDetails?.period_in_months || 12;


    // Calculate total amount after 12 months
    const totalReturnsIn12Months = annualReturnRate * 12;
    const amountAfter12Months = investmentAmount + totalReturnsIn12Months;

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
                        {/* <div className="text-white" onClick={toggleModal}>
                            Logout
                        </div> */}
                    </div>
                    <div className="flex justify-between hidden md:block">
                        <div className="flex flex-row mx-4 gap-4 mt-14">
                            <img onClick={goBack} src="https://cdn-icons-png.flaticon.com/512/3114/3114883.png" className="w-auto h-8" alt="Background" />
                            <h1 className="text-start font-bold text-2xl text-black hidden md:block">
                                Investment Details
                            </h1>
                        </div>
                    </div>

                    {/* <div className=" text-start rounded-lg px-4 mt-4 grid md:grid-cols-3 grid-cols-1 gap-4">
                        <div className="flex flex-row  ">
                            <p style={{ color: "#020065" }} className="text-md font-semibold">Investment Description </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <p className="text-md px-4 mt-3 text-start font-medium">Lorem Ipsum is simply dummy text of the printing and  typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of  type and scrambled it to make a type specimen book. It has survived not  only five centuries,</p>
                    </div> */}

                    <div className="grid grid-cols-1 px-4 mt-4 md:grid-cols-2 gap-4 text-start">


                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4"  >
                            <div style={{ background: "#F5F5F5" }} className="p-3">
                                <p>Investment Amount</p>
                                <p
                                    className="text-md font-bold my-2"
                                    style={{ color: 'rgba(0, 0, 148, 1)' }}
                                >
                                    ₹{SelectedInvestmentDetails?.amount?.toLocaleString("en-IN")}

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
                                    ₹{ReturnPerMonth?.toLocaleString("en-IN")}
                                </p>
                            </div>

                            <div style={{ background: "#F5F5F5" }} className="p-4">
                                <p>Total Returns</p>
                                <p
                                    className="text-md font-bold my-2"
                                    style={{ color: 'rgba(0, 0, 148, 1)' }}
                                >
                                    ₹{totalReturn?.toLocaleString("en-IN")}
                                </p>
                            </div>
                            <div style={{ background: "#F5F5F5" }} className="p-4">
                                <p>Download Investment Plan<DownloadForOffline className="mx-0 md:mx-1"></DownloadForOffline></p>
                            </div>
                        </div>
                    </div>


                    <div className=" text-start rounded-lg px-4 mt-4 grid md:grid-cols-3 grid-cols-1 gap-4">
                        <div className="flex flex-row">
                            <p style={{ color: "#020065" }} className="text-md font-semibold">
                                Upcoming Payout
                            </p>
                        </div>
                    </div>

                    <div className="z-10 my-4 grid grid-cols-1 md:grid-cols-3 px-5 gap-4 mx-0">
                        {upcomingPayouts?.length > 0 ? (
                            upcomingPayouts.map((payout, index) => (
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
                            ))
                        ) : (
                            <p className="text-start text-md font-bold text-gray-400">
                                No upcoming payouts available.
                            </p>
                        )}
                    </div>
                    <div className=" text-start rounded-lg px-4 mt-4 grid md:grid-cols-3 grid-cols-1 gap-4">
                        <div className="flex flex-row">
                            <p style={{ color: "#020065" }} className="text-md font-semibold">
                                Payout History
                            </p>
                        </div>
                    </div>

                    <div className="z-10 my-4 grid grid-cols-1 md:grid-cols-3 px-5 gap-4 mx-0">
                        {pastPayouts?.length > 0 ? (
                            pastPayouts.map((payout, index) => (
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
                            ))
                        ) : (
                            <p className="text-start text-md font-bold text-gray-400">
                                No payout history available.
                            </p>
                        )}
                    </div>
                </div>
            </div >
        </>
    );
};

export default InvestmentDetails;

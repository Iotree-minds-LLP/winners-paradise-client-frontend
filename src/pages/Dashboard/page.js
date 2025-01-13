import { useEffect, useState } from "react";
import { getAllCatalogByCustomerId } from "../../network/Catalog/page";
import profileIcon from "../../assets/Logos/trailing-icon.png"
import belIcon from "../../assets/Logos/belIcon.png"
import { TextField } from "@mui/material";
import NavBar from "../../components/Navbar/page";
import calculateicon from "../../assets/Images/calculate.png"
import acrrowright from "../../assets/Images/arrow_circle_right.png"
import imageLogo from "../../assets/Logos/Algo-Achievers-Logo_009600960_38721 1 (1).png";
import bellIcon from "../../assets/Logos/bellIcon2.png";
import userIcon from "../../assets/Logos/usericon.png";
import footerLogo1 from "../../assets/Logos/onboardingLogos/featured_play_list.png";
import footerLogo2 from "../../assets/Logos/onboardingLogos/icon-container.png";
import footerLogo3 from "../../assets/Logos/onboardingLogos/icon-container (1).png";
import footerLogo4 from "../../assets/Logos/onboardingLogos/icon-container (1).png";
import backImage from "../../assets/Images/backImage.jpg"
import { Link, useNavigate } from "react-router-dom";
import { getAllInvestments } from "../../network/Investments/page";
import { getAllPayouts } from "../../network/Payouts/page";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const DashboardPage = () => {
    const [showAllInvestments, setShowAllInvestments] = useState(false);
    const [showAllPayouts, setShowAllPayouts] = useState(false);
    const [isModalOpen, setisModalOpen] = useState(false);
    const navigate = useNavigate();
    const [listInvestments, setlistInvestments] = useState([])
    const [listPayouts, setlistPayount] = useState([])
    const [showShimmerStatistics, setshowShimmerStatistics] = useState(false);

    useEffect(() => {
        const data = localStorage.getItem("customerDetails");
        // if (!data) {
        //     navigate("/");
        //     return;
        // }
        const customer = JSON.parse(data);
        onformSubmit(customer?._id)
        onformSubmit2(customer?._id)
    }, []);

    const toggleModal = () => {
        setisModalOpen(!isModalOpen);
    }


    const onformSubmit = async (id) => {
        setshowShimmerStatistics(true);
        const resp = await getAllInvestments(id);
        if (resp.data.status === 201) {
            setlistInvestments(resp.data.data.data)
        }
        setshowShimmerStatistics(false);
    };


    const onformSubmit2 = async (id) => {
        const resp = await getAllPayouts();
        console.log(resp, "Resp")
        if (resp.data.status === 200) {
            setlistPayount(resp.data.data.payouts)
            console.log(resp.data.data.payouts, "resp.data.data.payouts")
        }
    };

    const investmentsToDisplay = showAllInvestments ? listInvestments : [listInvestments[0]];
    const payoutsToDisplay = showAllPayouts ? listPayouts : [listPayouts[0]];
    const totalInvested = listInvestments.reduce((total, investment) => total + investment.amount, 0);

    // Calculate total earned till now
    const today = new Date();
    const totalEarned = listInvestments.reduce((total, investment) => {
        const createdAtDate = new Date(investment.createdAt);
        const monthsSinceCreation =
            (today.getFullYear() - createdAtDate.getFullYear()) * 12 +
            today.getMonth() -
            createdAtDate.getMonth();
        const effectiveMonths = Math.max(monthsSinceCreation, 0); // Ensure non-negative months
        const earned = investment.amount * (investment.interest_per_month / 100) * effectiveMonths;
        return total + earned;
    }, 0);

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
                            <Link to="/notifications">
                                <img src={bellIcon} className="w-auto h-12 mt-4" alt="Bell Icon"></img>
                            </Link>
                            <Link to="/profile-and-settings">
                                <img src={userIcon} className="w-auto h-12 mt-4" alt="User Icon"></img>
                            </Link>

                        </div>
                    </div>

                    <div className="flex justify-between">
                        <h1 className="text-start font-bold text-2xl p-4 text-black hidden md:block mt-10">Dashboard</h1>
                        {/* <p className="text-start font-bold text-xl p-4 text-black hidden md:block mt-10 cursor-pointer	" onClick={toggleModal}>Logout</p> */}
                    </div>

                    {/* Catalogue Heading */}


                    {/* Return Calculator */}
                    <div className="text-start rounded-full mt-5 px-4 grid md:grid-cols-3 grid-cols-1">
                        <div className="p-4 rounded-lg bg-gradient-to-l from-[#020065] to-[#0400CB]">
                            <p className="text-white font-bold text-xl">
                                Your Investment Statistics
                            </p>

                            <div className="grid grid-cols-2 gap-4 my-3">
                                {showShimmerStatistics ? (
                                    // Skeleton placeholders while loading
                                    <>
                                        <div className="flex flex-col">
                                            <p className="text-primary" style={{ color: "#7C79EB" }}>
                                                <Skeleton width={100} />
                                            </p>
                                            <p className="text-white text-lg mt-2">
                                                <Skeleton width={80} />
                                            </p>
                                        </div>
                                        <div className="flex flex-col">
                                            <p className="text-primary" style={{ color: "#7C79EB" }}>
                                                <Skeleton width={100} />
                                            </p>
                                            <p className="text-white text-lg mt-2">
                                                <Skeleton width={80} />
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    // Actual data when shimmer is false
                                    <>
                                        <div className="flex flex-col">
                                            <p className="text-primary" style={{ color: "#7C79EB" }}>
                                                Total Invested
                                            </p>
                                            <p className="text-white text-lg mt-2">₹ {totalInvested}</p>
                                        </div>
                                        <div className="flex flex-col">
                                            <p className="text-primary" style={{ color: "#7C79EB" }}>
                                                Total Earned
                                            </p>
                                            <p className="text-white text-lg mt-2">₹ {totalEarned}</p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 p-3">
                        <div className="flex justify-between mx-2">
                            <p style={{ color: "#020065" }} className="text-lg font-bold">
                                Upcoming Payouts
                            </p>
                            <p
                                style={{
                                    color: "#020065",
                                    textDecoration: "underline",
                                    cursor: "pointer",
                                }}
                                onClick={() => setShowAllPayouts(!showAllPayouts)}
                            >
                                {showAllPayouts ? "View Less" : "View All"}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 px-5 gap-4">
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


                    <div className="grid grid-cols-1 md:grid-cols-3 p-3">
                        <div className="flex justify-between mx-2">
                            <p style={{ color: "#020065" }} className="text-lg font-bold">
                                Your Investments
                            </p>

                            {investmentsToDisplay[0] != undefined && (
                                <p
                                    style={{ color: "#020065", textDecoration: "underline", cursor: "pointer" }}
                                    onClick={() => setShowAllInvestments(!showAllInvestments)}
                                >
                                    {showAllInvestments ? "View Less" : "View All"}
                                </p>
                            )}

                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 px-5">
                        {investmentsToDisplay[0] === undefined ? (
                            <div>
                                <p className="text-start text-md font-bold text-gray-400">No investments found. Invest now! </p>
                            </div>
                        ) : (
                            <>
                                {investmentsToDisplay?.map((investment, index) => {
                                    // Calculate number of months between createdAt and today
                                    const createdAtDate = new Date(investment?.createdAt);
                                    const today = new Date();
                                    const monthsSinceCreation =
                                        (today.getFullYear() - createdAtDate.getFullYear()) * 12 +
                                        today.getMonth() -
                                        createdAtDate.getMonth();

                                    // Ensure at least 0 months (in case the dates are the same month)
                                    const effectiveMonths = Math.max(monthsSinceCreation, 0);

                                    // Calculate earned returns
                                    const earnedReturnsAmount =
                                        investment?.amount *
                                        (investment?.interest_per_month / 100) *
                                        effectiveMonths;

                                    const earnedReturnsPercentage =
                                        investment?.interest_per_month * effectiveMonths;

                                    return (
                                        <div
                                            onClick={() => navigate(`/dashboard/investment-details`, { state: { item: { investment } } })}
                                            key={index}
                                            className="flex justify-between p-4 rounded-lg  border border-[#020065]"
                                            style={{ background: "#F5F5F5" }}
                                        >
                                            <div className="flex flex-col text-start">
                                                <p className="text-md">Invested Amount</p>
                                                <p
                                                    className="font-bold text-md"
                                                    style={{ color: "#020065" }}
                                                >
                                                    ₹{investment?.amount.toLocaleString()}
                                                </p>
                                            </div>
                                            <div className="flex flex-col text-start">
                                                <p className="text-md">Returns earned</p>
                                                <p
                                                    className="font-bold text-md"
                                                    style={{ color: "#020065" }}
                                                >
                                                    ₹{earnedReturnsAmount.toLocaleString()} (
                                                    {earnedReturnsPercentage}%)
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </>
                        )}
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
                                    <div className="bg-white p-3 rounded-full flex items-center justify-center">
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
                                    <div className="p-3 rounded-full flex items-center justify-center">
                                        <img className="w-auto h-8" src={footerLogo4} alt="Footer Logo 3" />
                                    </div>
                                    <p className="mt-2 text-md font-bold text-center text-white">
                                        Payouts
                                    </p>
                                </div>
                            </Link>

                        </div>
                    </div>
                </div>

            </div>

        </>
    );
};

export default DashboardPage;

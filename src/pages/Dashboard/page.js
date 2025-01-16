import { useEffect, useState } from "react";
import { getAllCatalogByCustomerId } from "../../network/Catalog/page";
import profileIcon from "../../assets/Logos/trailing-icon.png"
import belIcon from "../../assets/Logos/belIcon.png"
import { Avatar, TextField } from "@mui/material";
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
import { goBack } from "../../utils/Functions/goBackScreen";

const DashboardPage = () => {
    const [showAllInvestments, setShowAllInvestments] = useState(false);
    const [loadingInvestments, setloadingInvestments] = useState(false)
    const [loadingPayouts, setloadingPayouts] = useState(false)
    const [showAllPayouts, setShowAllPayouts] = useState(false);
    const [isModalOpen, setisModalOpen] = useState(false);
    const navigate = useNavigate();
    const [listInvestments, setlistInvestments] = useState([])
    const [listPayouts, setlistPayount] = useState([])
    const [showShimmerStatistics, setshowShimmerStatistics] = useState(false);
    const [CustomerDetails, setCustomerDetails] = useState('')
    useEffect(() => {
        const data = localStorage.getItem("customerDetails");
        const customer = JSON.parse(data);
        setCustomerDetails(customer);
        onformSubmit(customer?._id)
        onformSubmit2(customer?._id)
    }, []);

    const toggleModal = () => {
        setisModalOpen(!isModalOpen);
    }


    const onformSubmit = async (id) => {
        setloadingInvestments(true);
        setshowShimmerStatistics(true);
        const resp = await getAllInvestments(id);
        if (resp.data.status === 200) {
            setlistInvestments(resp.data.data.data)
        }
        setshowShimmerStatistics(false);
        setloadingInvestments(false);
    };


    const onformSubmit2 = async (id) => {
        setloadingPayouts(true);
        const resp = await getAllPayouts();
        console.log(resp, "Resp")
        if (resp.data.status === 200) {
            setlistPayount(resp.data.data.payouts)
            console.log(resp.data.data.payouts, "resp.data.data.payouts")
        }
        else {
            setlistPayount([])
        }
        setloadingPayouts(false)
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
                        <div className="flex flex-row items-center text-white space-x-2">
                            {/* Notifications Icon */}
                            <Link to="/notifications">
                                <img
                                    src={bellIcon}
                                    className="w-auto h-12 mt-1 cursor-pointer"
                                    alt="Bell Icon"
                                />
                            </Link>

                            {/* Profile Avatar */}
                            <Link to="/profile-and-settings">
                                <Avatar
                                    className="mr-3"
                                    alt="User Avatar"
                                    sx={{ width: 30, height: 30, bgcolor: "primary.main" }} // Matches the size and alignment of bellIcon
                                >
                                    <p className="text-sm"> {CustomerDetails?.name?.charAt(0) || "U"}</p>
                                </Avatar>
                            </Link>
                        </div>

                    </div>

                    <div className="flex flex-row justify-between items-center mx-4 mt-14 hidden md:flex">
                        {/* Left Section */}
                        <h1 className="font-bold text-2xl text-black">Dashboard</h1>
                        <Avatar
                            alt="User Avatar"
                            color="primary"

                            sx={{ width: 40, height: 40, bgcolor: "primary.main" }} // Adjust size as needed
                        >
                            {CustomerDetails?.name?.charAt(0) || "U"}
                        </Avatar>
                    </div>
                    {/* 
                    
                     {<img src={"data:image/jpeg;base64,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"}></img>}
                    
                    */}


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
                                            <p className="text-white text-lg mt-2">₹ {totalInvested.toLocaleString("en-IN")
                                            }</p>
                                        </div>
                                        <div className="flex flex-col">
                                            <p className="text-primary" style={{ color: "#7C79EB" }}>
                                                Total Earned
                                            </p>
                                            <p className="text-white text-lg mt-2">₹ {totalEarned.toLocaleString("en-IN")
                                            }</p>
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
                            {payoutsToDisplay && payoutsToDisplay[0] !== undefined && (

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
                            )}

                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 px-5 gap-4">
                        {loadingPayouts ? (
                            Array.from({ length: 3 }).map((_, index) => (
                                <Skeleton
                                    key={index}
                                    height={100}
                                    style={{ borderRadius: "8px", background: "#F5F5F5" }}
                                />
                            ))
                        ) : payoutsToDisplay && payoutsToDisplay[0] === "undefined" && payoutsToDisplay.length > 0 ? (
                            payoutsToDisplay.map((payout, index) => (
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
                            <div>
                                <p className="text-start text-md font-bold text-gray-400">No Payouts Available Yet </p>
                            </div>
                        )}
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
                    <div className="grid grid-cols-1 md:grid-cols-3 px-5 gap-4 overflow-y-auto">

                        {loadingInvestments ? (
                            Array.from({ length: 3 }).map((_, index) => (
                                <Skeleton
                                    key={index}
                                    height={100}
                                    style={{ borderRadius: "8px", background: "#F5F5F5" }}
                                />
                            ))
                        ) : (

                            <>
                                {
                                    investmentsToDisplay[0] === undefined ? (
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
                                                    <>
                                                        <div
                                                            onClick={() => navigate(`/dashboard/investment-details`, { state: { item: { investment } } })}
                                                            key={index}
                                                            className=" flex justify-between p-4 rounded-lg  border border-[#020065]"
                                                            style={{ background: "#F5F5F5" }}
                                                        >
                                                            <div className="flex flex-col text-start">
                                                                <p className="text-md">Invested Amount</p>
                                                                <p
                                                                    className="font-bold text-md"
                                                                    style={{ color: "#020065" }}
                                                                >
                                                                    ₹{investment?.amount.toLocaleString("en-IN")
                                                                    }
                                                                </p>
                                                            </div>
                                                            <div className="flex flex-col text-start">
                                                                <p className="text-md">Returns earned</p>
                                                                <p
                                                                    className="font-bold text-md"
                                                                    style={{ color: "#020065" }}
                                                                >
                                                                    ₹{earnedReturnsAmount.toLocaleString("en-IN")
                                                                    } (
                                                                    {earnedReturnsPercentage}%)
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="hidden sm:block"></div>
                                                        <div className="hidden sm:block"></div>
                                                    </>
                                                );
                                            })}
                                        </>
                                    )
                                }
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

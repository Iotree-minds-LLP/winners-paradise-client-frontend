import { useEffect, useState } from "react";
import { Avatar, TextField } from "@mui/material";
import imageLogo from "../../assets/Logos/logohere.png";
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
import translations from "../../utils/Json/translation.json"
import { useLanguage } from "../../context/Language/loginContext";
import { getCustomerById } from "../../network/Customer/page";
import { useSwipeable } from "react-swipeable";
import GlobalHeader from "../../components/Navbar/mobileView";

const DashboardPage = () => {

    const [isSwipingHorizontally, setIsSwipingHorizontally] = useState(false);

    const handlers = useSwipeable({
        onSwipedLeft: () => {
            navigate("/payouts"); // Navigate forward
        },
        onSwipedRight: () => {
            navigate("/catalogs"); // Navigate backward
        },
        onSwipeStart: (eventData) => {
            // Detect if the swipe is primarily horizontal
            setIsSwipingHorizontally(Math.abs(eventData.deltaX) > Math.abs(eventData.deltaY));
        },
        onSwiped: () => {
            setIsSwipingHorizontally(false); // Reset after swipe ends
        },
        preventScrollOnSwipe: false, // Do not block scrolling
        trackTouch: true, // Ensure touch gestures work on mobile
        trackMouse: false, // Disable mouse swipes (optional)
    });

    useEffect(() => {
        const disableTouchMove = (e) => {
            if (isSwipingHorizontally) {
                e.preventDefault(); // Only prevent default if swiping horizontally
            }
        };

        document.addEventListener("touchmove", disableTouchMove, { passive: false });

        return () => {
            document.removeEventListener("touchmove", disableTouchMove);
        };
    }, [isSwipingHorizontally]);


    const [InvestmentLength, setInvestmentLength] = useState();
    const [PayoutsLength, setPayoutsLength] = useState()

    const { language, setLanguage } = useLanguage();
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
        onformSubmit(customer?._id)
        onformSubmit2(customer?._id)
    }, []);

    useEffect(() => {
        const data = localStorage.getItem("customerDetails");
        const customer = JSON.parse(data);
        fetchCustomerDetails(customer?._id);
    }, []);

    const fetchCustomerDetails = async (id) => {
        if (id) {
            const resp = await getCustomerById(id);
            if (resp.data.status === 200) {
                setCustomerDetails(resp.data.data.customer);
            }
        }
    };

    const toggleModal = () => {
        setisModalOpen(!isModalOpen);
    }

    const onformSubmit = async (id) => {
        setloadingInvestments(true);
        setshowShimmerStatistics(true);
        const resp = await getAllInvestments(id);
        if (resp.data.status === 200) {
            setlistInvestments(resp.data.data.data)
            setInvestmentLength(resp?.data?.data?.data?.length);
        }
        setshowShimmerStatistics(false);
        setloadingInvestments(false);
    };


    const onformSubmit2 = async (id) => {
        setloadingPayouts(true);
        const resp = await getAllPayouts();
        console.log(resp.data.status, "Rsp")
        if (resp.data.status === 200) {
            setPayoutsLength(resp?.data?.data?.payouts?.length);

            const upcomingPayouts = resp.data.data.payouts?.filter(
                (payout) => payout.status === "not_paid"
            );
            setlistPayount(upcomingPayouts)
        }
        else {
            setlistPayount([])
        }
        setloadingPayouts(false)
    };

    const investmentsToDisplay = showAllInvestments ? listInvestments : [listInvestments[0]];
    const payoutsToDisplay = showAllPayouts ? listPayouts : [listPayouts[0]];
    const totalInvested = listInvestments.reduce((total, investment) => total + investment.amount, 0);
    const today = new Date();
    const totalEarned = listInvestments.reduce((total, investment) => {
        const createdAtDate = new Date(investment.createdAt);
        const monthsSinceCreation =
            (today.getFullYear() - createdAtDate.getFullYear()) * 12 +
            today.getMonth() -
            createdAtDate.getMonth();
        const effectiveMonths = Math.max(monthsSinceCreation, 0);
        const earned = investment.amount * (investment.interest_per_month / 100) * effectiveMonths;
        return total + earned;
    }, 0);

    return (
        <>
            <div
                {...handlers}
                className="sm:ml-72 relative bg-white">
                <img src={backImage} className="opacity-30	hidden md:block absolute inset-0 object-cover z-0 w-full" alt="Background" />

                <div className="relative z-10">
                    {/* <div className="object-contain  fixed top-0 z-10 flex justify-between  sm:hidden bg-gradient-to-l from-[#020065] to-[#0400CB]">
                        <h1 className="text-start font-bold text-2xl p-4 text-white hidden md:block">Dashboard</h1>
                        <img
                            className="h-auto sm:hidden w-1/6 p-4 md:mt-0 text-start"
                            src={imageLogo}
                            alt="Logo"
                        />
                        <p className="mt-6 sm:hidden text-white font-semibold text-xl">
                            {translations.logoHeading[language]}
                        </p>
                        <div className="flex flex-row justify-center items-center text-white">
                            <Link to="/notifications">
                                <img src={bellIcon} className="w-auto h-12 " alt="Bell Icon"></img>
                            </Link>
                            <Link to="/profile-and-settings">
                                <Avatar
                                    className="mr-3 flex justify-center items-center"
                                    alt="User Avatar"
                                    sx={{ width: 30, height: 30, bgcolor: "primary.main", fontSize: 14, fontWeight: "bold" }}
                                >
                                    {CustomerDetails?.profile_image ? (
                                        <img
                                            src={CustomerDetails.profile_image}
                                            alt="Profile"
                                            className="w-full h-full object-cover rounded-full"
                                        />
                                    ) : (
                                        CustomerDetails?.name?.charAt(0)?.toUpperCase() || "U"
                                    )}
                                </Avatar>
                            </Link>
                        </div>

                    </div> */}

                    {/* <GlobalHeader></GlobalHeader> */}

                    <div className="flex flex-row justify-between items-center mx-4 mt-10 hidden md:flex">
                        <h1 className="font-bold text-2xl text-black">{translations.sideBar.heading1[language]}</h1>
                        <div className="flex flex-row justify-center items-center gap-4">
                            <p style={{ color: "#020065" }} className="text-md font-bold">{translations.Dashboard.heading[language]},{CustomerDetails.name}</p>
                            <Avatar
                                alt="User Avatar"
                                color="primary"
                                sx={{ width: 40, height: 40, bgcolor: "primary.main" }}
                            >
                                {CustomerDetails.profile_image ?
                                    (
                                        <img className="text-sm w-full h-full" src={CustomerDetails?.profile_image}></img>
                                    )
                                    : (
                                        <p className="text-sm"> {CustomerDetails?.name?.charAt(0) || "U"}</p>
                                    )
                                }
                            </Avatar>
                        </div>
                    </div>


                    <div className="text-start rounded-full mt-1 px-4 grid md:grid-cols-3 grid-cols-1">

                        <div className="mt-20 border bg-gray-100 mb-3 p-3 md:hidden flex flex-row items-center justify-start gap-3 rounded-lg">
                            {CustomerDetails?.profile_image ? (
                                <img className="text-sm w-10 h-10 rounded-full" src={CustomerDetails.profile_image} alt="Profile" />
                            ) : (
                                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-300 text-gray-700 text-lg font-bold">
                                    {CustomerDetails?.name?.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <p className="text-sm">{translations.Dashboard.heading[language]}: {CustomerDetails?.name}</p>
                        </div>

                        <div className="p-4 rounded-lg bg-gradient-to-l from-[#020065] to-[#0400CB]">

                            <p className="text-white font-bold text-xl">
                                {translations.Dashboard.heading1[language]}
                            </p>

                            <div className="grid grid-cols-2 gap-4 my-3">
                                {showShimmerStatistics ? (
                                    <>
                                        <div className="flex flex-col">
                                            <p className="text-primary" style={{ color: "#7C79EB" }}>
                                                <Skeleton width={100} baseColor="#B0C4FF" highlightColor="#D0E0FF" />
                                            </p>
                                            <p className="text-white text-lg mt-2">
                                                <Skeleton width={80} baseColor="#B0C4FF" highlightColor="#D0E0FF" />
                                            </p>
                                        </div>
                                        <div className="flex flex-col">
                                            <p className="text-primary" style={{ color: "#7C79EB" }}>
                                                <Skeleton width={100} baseColor="#B0C4FF" highlightColor="#D0E0FF" />
                                            </p>
                                            <p className="text-white text-lg mt-2">
                                                <Skeleton width={80} baseColor="#B0C4FF" highlightColor="#D0E0FF" />
                                            </p>
                                        </div>


                                    </>
                                ) : (
                                    <>
                                        <div className="flex flex-col">
                                            <p className="text-primary" style={{ color: "#7C79EB" }}>
                                                {translations.Dashboard.heading2[language]}
                                            </p>
                                            <p className="text-white whitespace-wrap text-lg mt-2">
                                                ₹ {Math.round(totalInvested).toLocaleString("en-IN")}
                                            </p>

                                        </div>
                                        <div className="flex flex-col">
                                            <p className="text-primary" style={{ color: "#7C79EB" }}>
                                                {translations.Dashboard.heading3[language]}
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
                                {translations.Dashboard.heading4[language]}
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

                                    {PayoutsLength > 1 &&
                                        <>
                                            {showAllPayouts ? `${translations.Dashboard.heading8[language]}` : `${translations.Dashboard.heading7[language]}`}
                                        </>
                                    }
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
                        ) : payoutsToDisplay && payoutsToDisplay.length > 0 ? (payoutsToDisplay.map((payout, index) => (
                            <>
                                <div
                                    key={index}
                                    className="flex justify-between p-4 rounded-lg"
                                    style={{ background: "#F5F5F5" }}
                                >
                                    <div className="flex flex-col text-start">
                                        <p className="text-md">{translations.Dashboard.heading9[language]}</p>
                                        <p
                                            className="font-bold text-md"
                                            style={{ color: "#020065" }}
                                        >
                                            ₹{Math.round(payout?.expected_payout_amount)}
                                        </p>
                                    </div>
                                    <div className="flex flex-col text-start">
                                        <p className="text-md">{translations.Dashboard.heading10[language]}</p>
                                        <p
                                            className="font-bold text-md"
                                            style={{ color: "#020065" }}
                                        >
                                            {new Date(payout?.expected_payout_date).toLocaleDateString("en-GB")}
                                        </p>
                                    </div>
                                </div>
                            </>
                        ))
                        ) : (
                            <div>
                                <p className="text-start text-md font-bold text-gray-400">{translations.Dashboard.heading11[language]}</p>
                            </div>
                        )}
                    </div>


                    <div className="grid grid-cols-1 md:grid-cols-3 p-3">
                        <div className="flex justify-between mx-2">

                            <p style={{ color: "#020065" }} className="text-lg font-bold">
                                {translations.Dashboard.heading12[language]}
                            </p>

                            {investmentsToDisplay[0] != undefined && (
                                <p
                                    style={{ color: "#020065", textDecoration: "underline", cursor: "pointer" }}
                                    onClick={() => setShowAllInvestments(!showAllInvestments)}
                                >
                                    {InvestmentLength > 1 && (
                                        <>
                                            {showAllInvestments ? `${translations.Dashboard.heading8[language]}` : `${translations.Dashboard.heading7[language]}`}
                                        </>
                                    )}
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
                                            <p className="text-start text-md font-bold text-gray-400">{translations.Dashboard.heading13[language]} </p>
                                        </div>
                                    ) : (
                                        <>
                                            {investmentsToDisplay?.map((investment, index) => {
                                                const createdAtDate = new Date(investment?.createdAt);
                                                const today = new Date();
                                                const monthsSinceCreation =
                                                    (today.getFullYear() - createdAtDate.getFullYear()) * 12 +
                                                    today.getMonth() -
                                                    createdAtDate.getMonth();

                                                const effectiveMonths = Math.max(monthsSinceCreation, 0);

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
                                                                <p className="text-md">{translations.Dashboard.heading14[language]}</p>
                                                                <p
                                                                    className="font-bold text-md"
                                                                    style={{ color: "#020065" }}
                                                                >
                                                                    ₹{Math.round(investment?.amount).toLocaleString("en-IN")
                                                                    }
                                                                </p>
                                                            </div>
                                                            <div className="flex flex-col text-start">
                                                                <p className="text-md">{translations.Dashboard.heading15[language]}</p>
                                                                <p
                                                                    className="font-bold text-md"
                                                                    style={{ color: "#020065" }}
                                                                >
                                                                    ₹{Math.round(earnedReturnsAmount).toLocaleString("en-IN")
                                                                    } (
                                                                    {earnedReturnsPercentage}%)
                                                                </p>
                                                            </div>
                                                        </div>
                                                        {/* <div className="hidden sm:block"></div>
                                                        <div className="hidden sm:block"></div> */}
                                                    </>
                                                );
                                            })}
                                        </>
                                    )
                                }
                            </>
                        )}

                    </div>

                    <div
                        className="sm:hidden bg-gradient-to-l from-[#020065] to-[#0400CB]"
                        style={{
                            position: 'fixed',
                            bottom: 0,
                            width: '100%',
                        }}
                    >
                        <div className="grid grid-cols-3">

                            <Link to="/catalogs">
                                <div className=" p-2 flex flex-col items-center">
                                    <div className="px-5 p-1 rounded-full flex items-center justify-center">
                                        <img className="w-auto h-8" src={footerLogo1} alt="Footer Logo 1" />
                                    </div>
                                    <p className="mt-2 text-sm font-bold text-center text-white">
                                        {translations.Dashboard.catalogs[language]}
                                    </p>
                                </div>
                            </Link>

                            <div className="p-2 flex flex-col items-center">
                                <div className="bg-white p-1 rounded-full flex items-center justify-center animate-expandPadding">
                                    <img className="w-auto h-8" src={footerLogo2} alt="Footer Logo 1" />
                                </div>

                                <p className="mt-2 text-sm font-bold text-center text-white">
                                    {translations.Dashboard.dashboard[language]}
                                </p>
                            </div>

                            <Link to="/payouts">
                                <div className=" p-2 flex flex-col items-center">
                                    <div className="p-1 rounded-full flex items-center justify-center">
                                        <img className="w-auto h-8" src={footerLogo4} alt="Footer Logo 3" />
                                    </div>
                                    <p className="mt-2 text-sm font-bold text-center text-white">
                                        {translations.Dashboard.payouts[language]}
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

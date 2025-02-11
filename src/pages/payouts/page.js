import { useEffect, useState } from "react";
import imageLogo from "../../assets/Logos/logohere.png";
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
import { useInvestment } from "../../context/Investment/investmentContext";
import translations from "../../utils/Json/translation.json"
import { useLanguage } from "../../context/Language/loginContext";
import { Avatar } from "@mui/material";
import { getCustomerById } from "../../network/Customer/page";
import { useSwipeable } from "react-swipeable";
import Skeleton from "react-loading-skeleton";


const Payouts = () => {
    const [isSwipingHorizontally, setIsSwipingHorizontally] = useState(false);

    const handlers = useSwipeable({
        onSwipedRight: () => {
            navigate("/dashboard"); // Navigate backward
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
    const { isInvestmentCreated, setIsInvestmentCreated } = useInvestment();
    const { language, setLanguage } = useLanguage();
    const [CustomerDetails, setCustomerDetails] = useState();
    const [isModalOpen, setisModalOpen] = useState(false);
    const navigate = useNavigate();
    const [past, setpast] = useState(false)
    const [response, setResponse] = useState([]);
    const [listPayouts, setlistPayouts] = useState([])
    const [showShimmerStatistics, setshowShimmerStatistics] = useState(true)

    useEffect(() => {
        const data = localStorage.getItem("customerDetails");
        const customer = JSON.parse(data);
        fetchCustomerDetails(customer?._id);
        onformSubmit()
    }, []);




    const fetchCustomerDetails = async (id) => {
        if (id) {
            const resp = await getCustomerById(id);
            if (resp?.data?.status === 200) {
                setCustomerDetails(resp.data.data.customer);
            }
        }
    };



    const onformSubmit = async () => {
        setshowShimmerStatistics(true);
        const resp = await getAllOverAllPayouts();
        if (resp?.data?.data?.payouts) {
            console.log(resp?.data?.data?.payouts, "resp?.data?.data?.payouts")
            setlistPayouts(resp?.data?.data?.payouts)
            setshowShimmerStatistics(false);
        }
        else {
            setlistPayouts([])
            setshowShimmerStatistics(false);
        }
    };

    const today = new Date();

    const upcomingPayouts = listPayouts.filter((payout => payout.status === "not_paid"))

    const pastPayouts = listPayouts.filter((payout => payout.status === "paid"))

    const payoutsToDisplay = past ? pastPayouts : upcomingPayouts;

    const toggleSelection = () => {
        setpast(!past);
    }




    return (
        <>
            <div
                {...handlers}
                className="sm:ml-72 relative bg-white">
                <img src={backImage} className="opacity-30	hidden md:block absolute inset-0 object-cover z-0 w-full" alt="Background" />

                <div className="relative z-10">
                    <div className="mt-14 md:mt-0 ">
                        {/* <div className="object-contain flex justify-between  sm:hidden bg-gradient-to-l from-[#020065] to-[#0400CB]">
                            <h1 className="text-start font-bold text-2xl p-4 text-white hidden md:block">{translations.PayoutsDetails.dashboard[language]}</h1>
                            <img
                                className="h-auto sm:hidden w-1/6 p-4 md:mt-0 text-start"
                                src={imageLogo}
                                alt="Logo"
                            />
                            <p className="mt-6 sm:hidden text-white font-semibold text-xl">
                                {translations.PayoutsDetails.winnersParadise[language]}
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
                        <div className="flex justify-between">
                            <h1 className="text-start font-bold text-2xl p-4 text-black hidden md:block mt-10 px-10">{translations.PayoutsDetails.payoutsTracker[language]}</h1>
                        </div>

                        <div className="text-start py-3 md:py-0 fixed w-full sm:static grid grid-cols-12 grid-cols-12  md:p-10">
                            <div className="col-span-6">
                                <div onClick={toggleSelection}
                                    className={`p-4 flex flex-row justify-center items-center gap-2 ${!past && "shadow-lg text-lg"}`} style={{ background: "#E7E7FF" }}
                                >
                                    <img className="w-5 h-5" src={logo1}></img>
                                    <p style={{ color: "#020065" }} className="font-bold text-md">
                                        {translations.PayoutsDetails.upcoming[language]}
                                    </p>
                                </div>
                                {!past && (
                                    <p style={{ background: "#020065", height: '2.5px' }} ></p>
                                )}
                            </div>
                            <div className="col-span-6">
                                <div
                                    onClick={toggleSelection}
                                    className={`p-4 flex flex-row justify-center items-center gap-2 ${past && "shadow-lg text-lg"}`} style={{ background: "#E7E7FF" }}
                                >
                                    <img className="w-5 h-5" src={logo2}></img>
                                    <p style={{ color: "#020065" }} className="font-bold text-md">
                                        {translations.PayoutsDetails.past[language]}
                                    </p>

                                </div>
                                {past && (
                                    <p style={{ background: "#020065", height: '2.5px' }} ></p>
                                )}
                            </div>
                        </div>

                    </div>

                    <div className="mt-12 md:mt-4 py-8 md:py-0 grid grid-cols-1 md:grid-cols-3 px-5 gap-4 mx-0 md:mx-4 mb-20 ">
                        {showShimmerStatistics && (
                            <>
                                <div className="p-4 rounded-lg bg-gray-100">
                                    <Skeleton height={20} width={`60%`} />
                                    <Skeleton height={15} width={`80%`} className="mt-2" />
                                    <Skeleton height={15} width={`90%`} className="mt-2" />
                                    <Skeleton height={15} width={`70%`} className="mt-2" />
                                </div>
                                <div className="p-4 rounded-lg bg-gray-100">
                                    <Skeleton height={20} width={`60%`} />
                                    <Skeleton height={15} width={`80%`} className="mt-2" />
                                    <Skeleton height={15} width={`90%`} className="mt-2" />
                                    <Skeleton height={15} width={`70%`} className="mt-2" />
                                </div>
                                <div className="p-4 rounded-lg bg-gray-100">
                                    <Skeleton height={20} width={`60%`} />
                                    <Skeleton height={15} width={`80%`} className="mt-2" />
                                    <Skeleton height={15} width={`90%`} className="mt-2" />
                                    <Skeleton height={15} width={`70%`} className="mt-2" />
                                </div>
                                <div className="p-4 rounded-lg bg-gray-100">
                                    <Skeleton height={20} width={`60%`} />
                                    <Skeleton height={15} width={`80%`} className="mt-2" />
                                    <Skeleton height={15} width={`90%`} className="mt-2" />
                                    <Skeleton height={15} width={`70%`} className="mt-2" />
                                </div>
                                <div className="p-4 rounded-lg bg-gray-100">
                                    <Skeleton height={20} width={`60%`} />
                                    <Skeleton height={15} width={`80%`} className="mt-2" />
                                    <Skeleton height={15} width={`90%`} className="mt-2" />
                                    <Skeleton height={15} width={`70%`} className="mt-2" />
                                </div>
                                <div className="p-4 rounded-lg bg-gray-100">
                                    <Skeleton height={20} width={`60%`} />
                                    <Skeleton height={15} width={`80%`} className="mt-2" />
                                    <Skeleton height={15} width={`90%`} className="mt-2" />
                                    <Skeleton height={15} width={`70%`} className="mt-2" />
                                </div>
                            </>
                        )}

                        {payoutsToDisplay?.map((payout, index) => (
                            <>
                                <div
                                    key={index}
                                    className="flex justify-between p-4 rounded-lg"
                                    style={{ background: "#F5F5F5" }}
                                >
                                    {!past ? (
                                        <>
                                            <div className="flex flex-col text-start">
                                                <p className="text-md">{translations.PayoutsDetails.payoutAmount[language]}</p>
                                                <p
                                                    className="font-bold text-md"
                                                    style={{ color: "#020065" }}
                                                >
                                                    ₹{Math.round(payout?.expected_payout_amount)}
                                                </p>
                                                <p className="mt-2 text-xs py-2 rounded-lg p-2 text-black" style={{ backgroundColor: "#E7E7FF" }}>Payout Type:{payout.payout_type}</p>

                                            </div>
                                            <div className="flex flex-col text-start">
                                                <p className="text-md">{translations.PayoutsDetails.payoutOn[language]}</p>
                                                <p
                                                    className="font-bold text-md"
                                                    style={{ color: "#020065" }}
                                                >
                                                    {new Date(payout?.expected_payout_date).toLocaleDateString("en-GB")}
                                                </p>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="flex flex-col text-start">
                                                <p className="text-md">{translations.global.expectedAmount[language]}</p>
                                                <p
                                                    className="font-bold text-md"
                                                    style={{ color: "#020065" }}
                                                >
                                                    ₹{Math.round(payout?.expected_payout_amount)}
                                                </p>

                                                <p className="text-md mt-2">{translations.global.actualPaidAmount[language]}</p>
                                                <p
                                                    className="font-bold text-md"
                                                    style={{ color: "#020065" }}
                                                >
                                                    ₹{Math.round(payout?.actual_paid_amount)}
                                                </p>


                                                <p className="mt-2 text-xs py-2 rounded-lg p-2 text-black" style={{ backgroundColor: "#E7E7FF" }}>Payout Type:{payout.payout_type}</p>


                                            </div>
                                            <div className="flex flex-col text-start">
                                                <p className="text-md">{translations.global.expectedDate[language]}</p>
                                                <p
                                                    className="font-bold text-md"
                                                    style={{ color: "#020065" }}
                                                >
                                                    {new Date(payout?.expected_payout_date).toLocaleDateString("en-GB")}
                                                </p>

                                                <p className="text-md mt-2">{translations.global.actualPaidDate[language]}</p>
                                                <p
                                                    className="font-bold text-md"
                                                    style={{ color: "#020065" }}
                                                >
                                                    {new Date(payout?.actual_paid_date).toLocaleDateString("en-GB")}
                                                </p>


                                            </div>
                                        </>
                                    )}
                                </div>
                                <div className="hidden sm:block"></div>
                                <div className="hidden sm:block"></div>
                            </>
                        ))}
                    </div>

                    <div className="p-3 my-10 mx-10 flex justify-center items-center font-bold text-gray-400 text-lg">

                        {payoutsToDisplay.length === 0 && !showShimmerStatistics &&
                            (
                                <p className="mt-20 flex justify-center items-center">{translations.PayoutsDetails.noPayoutsFound[language]} </p>
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
                        <div className={`grid ${isInvestmentCreated ? "grid-cols-3" : "grid-cols-2"} `}>
                            {/* Catalogue */}

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
                            {isInvestmentCreated && (
                                <Link to="/dashboard">
                                    {/* Dashboard */}
                                    <div className="p-2  flex flex-col items-center">
                                        <div className="p-1 rounded-full flex items-center justify-center">
                                            <img className="w-auto h-8" src={footerLogo2} alt="Footer Logo 2" />
                                        </div>
                                        <p className="mt-2 text-sm font-bold text-center text-white" >
                                            {translations.PayoutsDetails.dashboard[language]}
                                        </p>
                                    </div>

                                </Link>
                            )}


                            {/* Payouts */}
                            <div className="p-2 flex flex-col items-center">
                                <div className="bg-white p-1 rounded-full flex items-center justify-center animate-expandPadding">
                                    <img className="w-auto h-8" src={footerLogo3} alt="Footer Logo 1" />
                                </div>

                                <p className="mt-2 text-sm font-bold text-center text-white">
                                    {translations.Dashboard.payouts[language]}
                                </p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

        </>
    );
};

export default Payouts;

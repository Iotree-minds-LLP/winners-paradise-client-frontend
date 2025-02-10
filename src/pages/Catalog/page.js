import { useEffect, useState } from "react";
import { getAllCatalog, getAllCatalogByReturnCalculator } from "../../network/Catalog/page";
import { TextField } from "@mui/material";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import acrrowright from "../../assets/Images/arrow_circle_right.png"
import imageLogo from "../../assets/Logos/logohere.png";
import bellIcon from "../../assets/Logos/bellIcon2.png";
import userIcon from "../../assets/Logos/usericon.png";
import footerLogo1 from "../../assets/Logos/onboardingLogos/featured_play_list (1).png";
import footerLogo2 from "../../assets/Logos/onboardingLogos/timeline (1).png";
import footerLogo3 from "../../assets/Logos/onboardingLogos/icon-container (1).png";
import footerLogo4 from "../../assets/Logos/onboardingLogos/icon-container (1).png";
import backImage from "../../assets/Images/backImage.jpg"
import { Link, useNavigate } from "react-router-dom";
import { useInvestment } from "../../context/Investment/investmentContext";
import { useForm, useWatch } from "react-hook-form";
import logoImage from "../../assets/Images/algologo.png"
import image2 from "../../assets/Images/robo 1 (1).png";
import image3 from "../../assets/Images/arrow_circle_right (1).png";
import { LogoutUser } from "../../network/Fcm/saveToken";
import { getKycDetailsByCustomerId } from "../../network/KycVerification/page";
import { goBack } from "../../utils/Functions/goBackScreen";
import { useLanguage } from "../../context/Language/loginContext";
import translations from "../../utils/Json/translation.json"
import { getCustomerById } from "../../network/Customer/page";
import { Avatar } from "@mui/material";
import { useSwipeable } from "react-swipeable";
import GlobalHeader from "../../components/Navbar/mobileView";

const Catalogs = () => {
    const [isSwipingHorizontally, setIsSwipingHorizontally] = useState(false);

    const handlers = useSwipeable({
        onSwipedLeft: () => {
            navigate("/dashboard"); // Navigate forward
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

    const {
        control,
        register,
        watch,
        setValue,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const [ErrorMessage, setErrorMessage] = useState("");
    const [isModalOpen, setisModalOpen] = useState(false);
    const navigate = useNavigate();
    const [listCatalogs, setlistCatalogs] = useState([])
    const { isInvestmentCreated, setIsInvestmentCreated } = useInvestment();
    const watchedCatalogAmount = watch("returnCalculator");
    const [showCompleteKycCard, setshowCompleteKycCard] = useState(false);
    const [completeCardsLoading, setcompleteCardsLoading] = useState(false)
    const [catalogListShow, setcatalogListShow] = useState(false);
    const [LoadingButtonStart, setLoadingButtonStart] = useState(false);
    const { language, setLanguage } = useLanguage();
    const [BankDetailsPresent, setBankDetailsPresent] = useState(true);
    const [CustomerDetails, setCustomerDetails] = useState()

    const getKycStatus = async () => {

        setcompleteCardsLoading(true);
        const res = await getKycDetailsByCustomerId();
        if (res.data?.data?.is_aadhar_verified === "REVIEW PENDING" && res?.data?.data?.is_blank_cheque_verified === "REVIEW PENDING" && res?.data?.data?.is_pan_verified === "REVIEW PENDING" && res?.data?.data?.is_profile_image_verified === "REVIEW PENDING") {
            setcompleteCardsLoading(false);
        }
        else {
            setshowCompleteKycCard(true);
            setcompleteCardsLoading(false);
        }
        if (res.status === 500) {
            setshowCompleteKycCard(true);
            setcompleteCardsLoading(false);
        }

    }

    useEffect(() => {
        const data = localStorage.getItem("customerDetails");
        const customer = JSON.parse(data);
        fetchCustomerDetails(customer?._id);

        onformSubmit()
        getKycStatus()
    }, []);

    const fetchCustomerDetails = async (id) => {
        if (id) {
            const resp = await getCustomerById(id);
            if (resp?.data?.status === 200) {
                if (resp.data.data.customer.bank_acc_no) {
                    setBankDetailsPresent(false);
                }
                setCustomerDetails(resp.data.data.customer);
            }
        }
    };

    const toggleModal = () => {
        setisModalOpen(!isModalOpen);
    }

    const yesLogout = async () => {
        localStorage.removeItem("customerDetails");
        localStorage.removeItem("tokenDetails");
        navigate("/")
    }

    const dontdeleteuser = () => {
        setisModalOpen(!isModalOpen);
    }

    const onformSubmit = async () => {
        setcatalogListShow(true);
        const resp = await getAllCatalog();
        if (resp?.data?.catalogs) {
            setlistCatalogs(resp.data.catalogs)
            setcatalogListShow(false);
        }
        else {
            setcatalogListShow(false);
        }
    };

    useEffect(() => {
        if (!watchedCatalogAmount) {
            onformSubmit()
        }
    }, [watchedCatalogAmount]);

    const onSubmit = async (data) => {
        setLoadingButtonStart(true);

        const payload = {
            amount: data.returnCalculator
        }

        const resp = await getAllCatalogByReturnCalculator(payload);
        console.log(resp, "Resp")
        if (resp?.data?.catalogs?.length > 0) {
            navigate(`/catalogs/catalog-details`, { state: { item: resp.data.catalogs[0] } })
        }
        else {
            setErrorMessage("The minimum investment amount is ₹1 Lakh.");
        }

        setLoadingButtonStart(false);
    }

    return (
        <>
            <div
                {...handlers}
                className="sm:ml-72 relative bg-white">
                <img src={backImage} className="opacity-30	hidden md:block absolute inset-0 object-cover z-0 w-full" alt="Background" />

                <div className="relative z-10">
                    {/* <div className="object-contain w-full fixed top-0 z-10 flex justify-between bg-gradient-to-l sm:hidden from-[#0400CB] to-[#020065]">
                        <h1 className="text-start font-bold text-2xl p-4 text-white hidden md:block"> {translations.Catalog.heading[language]}</h1>
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
                    <div className="flex justify-between hidden md:block">
                        <div className="flex flex-row mx-4 gap-4 mt-14 mb-8">
                            <h1 className="text-start font-bold text-2xl text-black hidden md:block">{translations.Catalog.heading[language]}</h1>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:py-0 md:grid-cols-3 px-4 gap-0 md:gap-10 mt-20 md:mt-0 text-start">

                        {!isInvestmentCreated && (
                            <div className="my-3 border bg-gray-100 p-3 md:hidden flex flex-row items-center justify-start gap-3 rounded-lg">
                                {CustomerDetails?.profile_image ? (
                                    <img className="text-sm w-10 h-10 rounded-full" src={CustomerDetails.profile_image} alt="Profile" />
                                ) : (
                                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-300 text-gray-700 text-lg font-bold">
                                        {CustomerDetails?.name?.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <p className="text-sm">{translations.Dashboard.heading[language]}: {CustomerDetails?.name}</p>
                            </div>
                        )}

                        {completeCardsLoading ? (
                            <>
                                <div className="p-4 w-full px-5 mb-3 bg-gray-100 rounded-lg flex justify-between">
                                    <div className="flex-1">
                                        <Skeleton width="60%" height={20} />
                                        <Skeleton width="90%" height={15} className="mt-2" />
                                    </div>
                                    <div>
                                        <Skeleton circle={true} width={40} height={40} />
                                    </div>
                                </div>
                                <div className="p-4 w-full px-5 mb-3 rounded-lg bg-gray-100 flex justify-between">
                                    <div className="flex-1">
                                        <Skeleton width="60%" height={20} />
                                        <Skeleton width="90%" height={15} className="mt-2" />
                                    </div>
                                    <div>
                                        <Skeleton circle={true} width={40} height={40} />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                {showCompleteKycCard && (
                                    <div
                                        className="p-4 w-full px-5 mb-3 rounded-lg bg-gradient-to-r from-[#0400CB] to-[#020065] flex justify-between"
                                        onClick={() => navigate("/Kyc-status")}
                                    >
                                        <div>
                                            <p className="text-start text-md font-bold text-white">{translations.Catalog.kyc_card.heading[language]}</p>
                                            <p style={{ color: "#54E3FC" }} className="text-xs my-2">
                                                {translations.Catalog.kyc_card.heading2[language]}
                                            </p>
                                        </div>
                                        <div>
                                            <img src={image3} className="w-10 h-10 object-contain" />
                                        </div>
                                    </div>
                                )}

                                {BankDetailsPresent && (
                                    <Link to="/profile-and-settings/bank-details">
                                        <div className="p-4 w-full px-5 mb-3 rounded-lg bg-gradient-to-r from-[#0400CB] to-[#020065] flex justify-between">
                                            <div>
                                                <p className="text-start text-md font-bold text-white"> {translations.Catalog.bank_Card.heading[language]}</p>
                                                <p style={{ color: "#54E3FC" }} className="text-xs my-2">
                                                    {translations.Catalog.bank_Card.heading2[language]}
                                                </p>
                                            </div>
                                            <div>
                                                <img src={image3} className="w-10 h-10 object-contain" />
                                            </div>
                                        </div>
                                    </Link>
                                )}

                            </>
                        )}
                    </div>
                    <div className="text-start rounded-lg px-4 grid md:grid-cols-1 grid-cols-1">

                        <div
                            className="px-6 py-3 pb-4 rounded-lg w-full md:w-1/3"
                            style={{ backgroundColor: 'rgba(245, 245, 245, 1)' }}
                        >

                            <p style={{ color: 'rgba(128, 128, 128, 1)', fontWeight: '500', fontSize: '12px' }}>
                                {translations.Catalog.returnCalculatorNote[language]}
                            </p>
                            <p className="my-2" style={{ color: 'rgba(0, 0, 148, 1)', fontWeight: '700', fontSize: '14px' }}>
                                {translations.Catalog.card1[language]}
                            </p>

                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="mt-3 md:flex md:justify-between gap-4">
                                    <TextField
                                        label={translations.Catalog.fieldValidation[language]}
                                        variant="outlined"
                                        size="medium"
                                        type="number"
                                        fullWidth
                                        error={!!errors.returnCalculator}
                                        helperText={errors.returnCalculator ? errors.returnCalculator.message : ''}
                                        {...register('returnCalculator', {
                                            required: translations.validations.global[language],
                                        })}
                                        onChange={(e) => {
                                            console.log('Value changed:', e.target.value); // Log the value to the console
                                            setValue("returnCalculator", e.target.value.replace(/[^0-9]/g, '')); // Remove non-numeric values
                                        }}
                                        InputProps={{
                                            inputProps: {
                                                min: 0, // Ensure no negative values
                                                style: {
                                                    MozAppearance: "textfield",
                                                },
                                            },
                                        }}
                                        onInput={(e) => {
                                            if (e.target.value.length > 10) {
                                                e.target.value = e.target.value.slice(0, 10);
                                            }
                                        }}
                                        onKeyDown={(e) => {
                                            if (["-", "+", "e", "E"].includes(e.key)) {
                                                e.preventDefault();
                                            }
                                        }}
                                        sx={{
                                            "& input[type=number]": {
                                                MozAppearance: "textfield",
                                            },
                                            "& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button": {
                                                WebkitAppearance: "none",
                                                margin: 0,
                                            },
                                        }}
                                    />

                                    <div>
                                        <button
                                            type="submit"
                                            className="text-white p-3 md:p-4 w-full mt-4 md:mt-0 rounded-full md:rounded-lg bg-gradient-to-r from-[#0400CB] to-[#020065] flex items-center justify-center whitespace-nowrap"
                                        >
                                            {LoadingButtonStart ? (
                                                // Loading spinner
                                                <svg
                                                    aria-hidden="true"
                                                    className="w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                                                    viewBox="0 0 100 101"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                                        fill="currentColor"
                                                    />
                                                    <path
                                                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                                        fill="currentFill"
                                                    />
                                                </svg>
                                            ) : (
                                                // Text before loading
                                                <span className="text-sm">{translations.Catalog.button[language]}</span>
                                            )}
                                        </button>

                                    </div>


                                </div>


                            </form>
                            {ErrorMessage && (
                                <div className="text-red-500 text-sm mt-2">
                                    {ErrorMessage}
                                </div>
                            )}
                        </div>
                    </div>


                    <p
                        className="text-lg text-start font-bold my-2 mx-4 mt-5 "
                        style={{ color: 'rgba(0, 0, 148, 1)' }}
                    >   {translations.Catalog.listingHeading[language]}</p>

                    <div className="text-start rounded-lg p-4 grid md:grid-cols-3 grid-cols-1 gap-4 mb-36">
                        {catalogListShow ? (
                            Array.from({ length: 2 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="relative bg-gray-100  p-6 rounded-xl "
                                >
                                    <div className="flex justify-between">
                                        <Skeleton width="60%" height={20} />
                                        <Skeleton circle={true} height={32} width={32} />
                                    </div>

                                    <div className="grid grid-cols-2 my-2">
                                        <p><Skeleton width="80%" height={15} /></p>
                                        <p><Skeleton width="50%" height={15} /></p>
                                        <p><Skeleton width="60%" height={20} className="my-2" /></p>
                                        <p><Skeleton width="40%" height={20} className="my-2" /></p>
                                        <p><Skeleton width="70%" height={15} /></p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            // Show actual catalog cards

                            listCatalogs.map((item, index) => {


                                return (
                                    <div
                                        onClick={() => navigate(`/catalogs/catalog-details`, { state: { item } })}
                                        key={index}
                                        className="relative bg-gradient-to-r from-white to-[#c2c2f5] p-6 rounded-xl border border-2 border-[#0400CB]"
                                    >
                                        <div className="flex justify-between">
                                            <p
                                                style={{
                                                    color: 'rgba(0, 0, 148, 1)',
                                                    fontWeight: '700',
                                                    fontSize: '17px',
                                                }}
                                            >
                                                {item.name}
                                            </p>
                                            <img
                                                src={acrrowright}
                                                className="w-auto h-8"
                                                alt="Arrow Icon"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 my-2">
                                            <p>{translations.Catalog.card2.heading1[language]}</p>
                                            <p>{translations.Catalog.card2.heading2[language]}</p>
                                            <p
                                                className="text-md font-bold my-2"
                                                style={{ color: 'rgba(0, 0, 148, 1)' }}
                                            >
                                                ₹{item.min_amt.toLocaleString()}
                                            </p>
                                            <p
                                                className="text-md font-bold my-2"
                                                style={{ color: 'rgba(0, 0, 148, 1)' }}
                                            >
                                                {item.no_of_months} {translations.Catalog.card2.months[language]}
                                            </p>
                                            <p>{translations.Catalog.card2.heading3[language]}</p>
                                            <p></p>
                                            <p
                                                className="text-md font-bold my-2"
                                                style={{ color: 'rgba(0, 0, 148, 1)' }}
                                            >
                                                ₹{item.returns_per_month}
                                            </p>
                                        </div>

                                        {/* Bottom-right image */}
                                        <img
                                            src={logoImage} // Replace with your image source or item.image if dynamic
                                            alt="Card Decoration"
                                            className="absolute bottom-2 right-0 w-20 h-auto object-contain opacity-20"
                                        />
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {listCatalogs.length === 0 && (
                        <div className="mx-3">
                            <p className="p-3 font-bold text-gray-400 text-lg">{translations.Catalog.noCatalogsMessage[language]}</p>
                        </div>
                    )}

                    {/* Footer Navigation */}
                    <div
                        className="sm:hidden bg-gradient-to-l from-[#0400CB] to-[#020065]"
                        style={{
                            position: 'fixed',
                            bottom: 0,
                            width: '100%',
                        }}
                    >
                        {isInvestmentCreated && (

                            <div className={`grid ${isInvestmentCreated ? "grid-cols-3" : "grid-cols-2"} `}>

                                <div className="p-2 flex flex-col items-center">
                                    <div className="bg-white p-1 rounded-full flex items-center justify-center animate-expandPadding">
                                        <img className="w-auto h-8 px-3" src={footerLogo1} alt="Footer Logo 1" />
                                    </div>

                                    <p className="mt-2 text-sm font-bold text-center text-white">
                                        {translations.Dashboard.catalogs[language]}
                                    </p>
                                </div>

                                <Link to="/dashboard">
                                    <div className="p-2  flex flex-col items-center">
                                        <div className="p-1 rounded-full flex items-center justify-center">
                                            <img className="w-auto h-8" src={footerLogo2} alt="Footer Logo 2" />
                                        </div>
                                        <p className="mt-2 text-sm font-bold text-center text-white" >
                                            {translations.Dashboard.dashboard[language]}
                                        </p>
                                    </div>
                                </Link>

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
                        )}

                    </div>
                </div>

            </div >

            <div className="mt-5 opacity-20  sm:hidden fixed bottom-0 left-0 w-full bg-white shadow-md ">
                <img src={image2} alt="Image description" className="w-full h-full object-contain" />
            </div>

        </>
    );
};

export default Catalogs;

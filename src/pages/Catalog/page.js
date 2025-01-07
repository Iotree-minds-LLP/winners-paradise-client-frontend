import { useEffect, useState } from "react";
import { getAllCatalogByCustomerId, getAllCatalogByReturnCalculator } from "../../network/Catalog/page";
import profileIcon from "../../assets/Logos/trailing-icon.png"
import belIcon from "../../assets/Logos/belIcon.png"
import { TextField } from "@mui/material";
import NavBar from "../../components/Navbar/page";
import calculateicon from "../../assets/Images/calculate.png"
import acrrowright from "../../assets/Images/arrow_circle_right.png"
import imageLogo from "../../assets/Logos/Algo-Achievers-Logo_009600960_38721 1 (1).png";
import bellIcon from "../../assets/Logos/bellIcon2.png";
import userIcon from "../../assets/Logos/usericon.png";
import footerLogo1 from "../../assets/Logos/onboardingLogos/featured_play_list (1).png";
import footerLogo2 from "../../assets/Logos/onboardingLogos/timeline (1).png";
import footerLogo3 from "../../assets/Logos/onboardingLogos/icon-container (1).png";
import footerLogo4 from "../../assets/Logos/onboardingLogos/icon-container (1).png";
import backImage from "../../assets/Images/backImage.jpg"
import { Link, useNavigate } from "react-router-dom";
import { useInvestment } from "../../context/Investment/investmentContext";
import { useForm } from "react-hook-form";

const Catalogs = () => {

    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const [isModalOpen, setisModalOpen] = useState(false);
    const navigate = useNavigate();
    const [listCatalogs, setlistCatalogs] = useState([])
    const { isInvestmentCreated, setIsInvestmentCreated } = useInvestment();

    useEffect(() => {
        const data = localStorage.getItem("customerDetails");
        const customer = JSON.parse(data);
        onformSubmit()
    }, []);

    const toggleModal = () => {
        setisModalOpen(!isModalOpen);
    }

    const yesLogout = () => {
        localStorage.removeItem("customerDetails");
        localStorage.removeItem("tokenDetails");
        navigate("/")
    }

    const onformSubmit = async () => {
        const resp = await getAllCatalogByCustomerId();
        if (resp?.data?.catalogs) {
            setlistCatalogs(resp.data.catalogs)
        }
    };

    const onSubmit = async (data) => {

        const payload = {
            amount: data.returnCalculator
        }

        const resp = await getAllCatalogByReturnCalculator(payload);

        if (resp?.data?.catalogs) {
            setlistCatalogs(resp.data.catalogs)
        }
    }

    return (
        <>
            <div className="sm:ml-72 relative bg-white">
                {/* Background Image */}
                <img src={backImage} className="opacity-30	hidden md:block absolute inset-0 object-cover z-0 w-full" alt="Background" />

                {/* Content Wrapper */}
                <div className="relative z-10">
                    {/* Gradient Header */}
                    <div className="object-contain fixed top-100  flex justify-between bg-gradient-to-l sm:hidden from-[#0400CB] to-[#020065]">
                        <h1 className="text-start font-bold text-2xl p-4 text-white hidden md:block">Catalogue</h1>
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
                            </Link>   <Link to="/profile-and-settings">
                                <img src={userIcon} className="w-auto h-12 mt-4" alt="User Icon"></img>
                            </Link>
                        </div>
                    </div>

                    <div className="flex justify-between">
                        <h1 className="text-start font-bold text-2xl p-4 text-black hidden md:block mt-10">Catalogue</h1>
                        <p className="text-start font-bold text-xl p-4 text-black hidden md:block mt-10 cursor-pointer	" onClick={toggleModal}>Logout</p>
                    </div>

                    <div className="text-start rounded-lg mt-20 md:mt-5  p-4 grid md:grid-cols-3 grid-cols-1">
                        <div
                            className="p-6 rounded-lg"
                            style={{ backgroundColor: 'rgba(245, 245, 245, 1)' }}
                        >

                            <p style={{ color: 'rgba(0, 0, 148, 1)', fontWeight: '700', fontSize: '14px' }}>
                                Return Calculator
                            </p>

                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="mt-3 flex justify-between gap-4">
                                    <TextField
                                        label="Returns Calculator"
                                        variant="outlined"
                                        size="medium"
                                        type="number"
                                        fullWidth
                                        error={!!errors.returnCalculator}
                                        helperText={errors.returnCalculator ? errors.returnCalculator.message : ''}
                                        {...register('returnCalculator', {
                                            required: 'This field is required',
                                        })}
                                        InputProps={{
                                            inputProps: {
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
                                            className="text-white p-4 rounded-lg"
                                            style={{ background: 'rgba(0, 0, 148, 1)' }}
                                        >
                                            <img className="w-9 h-auto" src={calculateicon} alt="Calculate Icon"></img>

                                        </button>
                                    </div>

                                </div>


                            </form>
                        </div>
                    </div>

                    <div className="text-start rounded-lg p-4 grid md:grid-cols-3 grid-cols-1 gap-4 mb-36">
                        {listCatalogs.map((item, index) => {

                            const totalReturn =
                                item.min_amt *
                                (item.int_percent_per_month / 100) *
                                item.no_of_months;

                            return (
                                <div
                                    onClick={() => navigate(`/catalogs/catalog-details`, { state: { item } })}
                                    key={index}
                                    className="p-6 rounded-lg border border-1 border-[#020065]"
                                    style={{ backgroundColor: '#E7E7FF' }}
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
                                        <p>Investment Amount</p>
                                        <p>Duration</p>
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
                                            {item.no_of_months} Months
                                        </p>
                                        <p>Returns per month</p>
                                        <p></p>
                                        <p
                                            className="text-md font-bold my-2"
                                            style={{ color: 'rgba(0, 0, 148, 1)' }}
                                        >
                                            ₹{item.returns_per_month}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>


                    {/* Footer Navigation */}
                    <div
                        className="sm:hidden bg-gradient-to-l from-[#0400CB] to-[#020065]"
                        style={{
                            position: 'fixed',
                            bottom: 0,
                            width: '100%',
                        }}
                    >
                        <div className={`grid ${isInvestmentCreated ? "grid-cols-3" : "grid-cols-2"} `}>
                            {/* Catalogue */}
                            <div className=" p-2 flex flex-col items-center">
                                <div className="bg-white px-5 p-3 rounded-full flex items-center justify-center">
                                    <img className="w-auto h-8" src={footerLogo1} alt="Footer Logo 1" />
                                </div>
                                <p className="mt-2 text-md font-bold text-center text-white">
                                    Catalogue
                                </p>
                            </div>

                            {/* Dashboard */}
                            {isInvestmentCreated && (
                                <Link to="/dashboard">
                                    <div className="p-2  flex flex-col items-center">
                                        <div className="p-3 rounded-full flex items-center justify-center">
                                            <img className="w-auto h-8" src={footerLogo2} alt="Footer Logo 2" />
                                        </div>
                                        <p className="mt-2 text-md font-bold text-center text-white" >
                                            Dashboard
                                        </p>
                                    </div>
                                </Link>
                            )}

                            <Link to="/payouts">
                                {/*zPayouts */}
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
            </div >

        </>
    );
};

export default Catalogs;

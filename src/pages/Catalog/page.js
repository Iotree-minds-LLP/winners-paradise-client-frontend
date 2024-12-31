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
import footerLogo4 from "../../assets/Logos/onboardingLogos/icon-container (2).png";

const Catalogs = () => {

    const [response, setResponse] = useState([]);
    const [customerDetails, setCustomerDetails] = useState([]);

    useEffect(() => {
        const data = localStorage.getItem("customerDetails");
        const customer = JSON.parse(data);
        setCustomerDetails(customer);
    }, []);

    const onformSubmit = async () => {
        if (customerDetails && customerDetails._id) {
            const resp = await getAllCatalogByCustomerId(customerDetails._id);
            setResponse(resp.data);
        }
    };

    return (
        <>
            <div className="sm:ml-72 bg-white ">
                <div className="flex justify-between bg-gradient-to-l from-[#0400CB] to-[#020065]">
                    <h1 className="text-start font-bold text-2xl p-4 text-white hidden md:block">Catalogue</h1>
                    <img
                        className="h-auto sm:hidden w-1/5 p-4 md:mt-0  text-start"
                        src={imageLogo}
                        alt="Logo"
                    />
                    <p className="mt-6 sm:hidden text-white font-semibold text-xl">
                        Winners Paradise
                    </p>
                    <div className="flex flex-row text-white">
                        <img src={bellIcon} className="w-auto h-12 mt-4"></img>
                        <img src={userIcon} className="w-auto h-12 mt-4"></img>
                    </div>
                </div>

                <div
                    className="text-start rounded-lg mt-5 p-4  grid md:grid-cols-3 grid-cols-1 "
                >
                    <div
                        className="p-6 rounded-lg"
                        style={{ backgroundColor: 'rgba(245, 245, 245, 1)' }}

                    >
                        <p style={{ color: 'rgba(0, 0, 148, 1)', fontWeight: '700', fontSize: '14px' }}>
                            Return Calculator
                        </p>

                        <div className="mt-3 flex justify-between gap-4">
                            <TextField
                                label="Enter the amount"
                                variant="outlined"
                                size="medium"
                                fullWidth />
                            <button className="text-white p-4 rounded-lg" style={{ background: 'rgba(0, 0, 148, 1)' }}><img className="w-6 h-auto" src={calculateicon}></img> </button>
                        </div>
                    </div>

                </div>
                <div
                    className="text-start rounded-lg p-4  grid md:grid-cols-3 grid-cols-1 gap-4 "
                >
                    <div
                        className="p-6 rounded-lg border border-1 border-[#020065]"

                        style={{ backgroundColor: '#E7E7FF' }}

                    >
                        <div className="flex justify-between">
                            <p style={{ color: 'rgba(0, 0, 148, 1)', fontWeight: '700', fontSize: '17px' }}>
                                Investment Name
                            </p>
                            <img src={acrrowright} className="w-auto h-8"></img>
                        </div>

                        <div className="grid grid-cols-2 my-2">
                            <p>Investment Amount</p>
                            <p>Duration</p>
                            <p className="text-md font-bold my-2" style={{ color: 'rgba(0, 0, 148, 1)' }}>₹00,00,000</p>
                            <p className="text-md font-bold my-2" style={{ color: 'rgba(0, 0, 148, 1)' }}>00 Months</p>
                            <p>Returns per month</p>
                            <p></p>
                            <p className="text-md font-bold my-2" style={{ color: 'rgba(0, 0, 148, 1)' }}>₹00,00,000 (00%)</p>
                        </div>
                    </div>


                    <div
                        className="p-6 rounded-lg border border-1 border-[#020065]"

                        style={{ backgroundColor: '#E7E7FF' }}

                    >
                        <div className="flex justify-between">
                            <p style={{ color: 'rgba(0, 0, 148, 1)', fontWeight: '700', fontSize: '17px' }}>
                                Investment Name
                            </p>
                            <img src={acrrowright} className="w-auto h-8"></img>
                        </div>

                        <div className="grid grid-cols-2 my-2">
                            <p>Investment Amount</p>
                            <p>Duration</p>
                            <p className="text-md font-bold my-2" style={{ color: 'rgba(0, 0, 148, 1)' }}>₹00,00,000</p>
                            <p className="text-md font-bold my-2" style={{ color: 'rgba(0, 0, 148, 1)' }}>00 Months</p>
                            <p>Returns per month</p>
                            <p></p>
                            <p className="text-md font-bold my-2" style={{ color: 'rgba(0, 0, 148, 1)' }}>₹00,00,000 (00%)</p>
                        </div>
                    </div>
                </div>

                <div
                    className="sm:hidden"
                    style={{
                        backgroundColor: '#E7E7FF',
                        position: 'fixed',
                        bottom: 0,
                        width: '100%',
                    }}
                >
                    <div className="grid grid-cols-3">
                        {/* Catalogue */}
                        <div className="p-4 flex flex-col items-center">
                            <div className="bg-gradient-to-l px-5 p-3 from-[#0400CB] to-[#020065] rounded-full flex items-center justify-center">
                                <img className="w-auto h-8" src={footerLogo1} alt="Footer Logo 1" />
                            </div>
                            <p className="mt-2 text-md font-bold text-center" style={{ color: "#020065" }}>
                                Catalogue
                            </p>
                        </div>

                        {/* Dashboard */}
                        <div className="p-4 flex flex-col items-center">
                            <div className="p-3  rounded-full flex items-center justify-center">
                                <img className="w-auto h-8" src={footerLogo2} alt="Footer Logo 2" />
                            </div>
                            <p className="mt-2 text-md font-bold text-center" style={{ color: "#7674C6" }}>
                                Dashboard
                            </p>
                        </div>

                        {/* Payouts */}
                        <div className="p-4 flex flex-col items-center">
                            <div className="p-3 rounded-full flex items-center justify-center">
                                <img className="w-auto h-8" src={footerLogo4} alt="Footer Logo 3" />
                            </div>
                            <p className="mt-2 text-md font-bold text-center" style={{ color: "#7674C6" }}>
                                Payouts
                            </p>
                        </div>
                    </div>
                </div>


            </div>
        </>
    );
};

export default Catalogs;

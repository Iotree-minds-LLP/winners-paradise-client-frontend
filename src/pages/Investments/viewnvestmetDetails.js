import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import backImage from "../../assets/Images/backImage.jpg";
import backButton from "../../assets/Logos/backButton.png";
import { goBack } from "../../utils/Functions/goBackScreen";
import { getAllOverAllPayouts, getAllPayouts, getAllPayoutsBYInvestmentId } from "../../network/Payouts/page";
import { DownloadForOffline } from "@mui/icons-material";
import translations from "../../utils/Json/translation.json"
import { useLanguage } from "../../context/Language/loginContext";


const InvestmentDetails = () => {
    const { language, setLanguage } = useLanguage();
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
            const totalReturn =
                SelectedInvestmentDetails.amount +
                (SelectedInvestmentDetails.amount *
                    (SelectedInvestmentDetails.interest_per_month / 100) *
                    SelectedInvestmentDetails.period_in_months);

            const returnPerMonth =
                (SelectedInvestmentDetails.amount *
                    (SelectedInvestmentDetails.interest_per_month / 100));

            settotalReturn(totalReturn);
            setReturnPerMonth(returnPerMonth);
        }
    }, [SelectedInvestmentDetails]);




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
                            <p className="text-white font-semibold my-1">{translations.InvestementDetails.investmentDetails[language]}</p>
                        </div>
                    </div>
                    <div className="flex justify-between hidden md:block">
                        <div className="flex flex-row mx-4 gap-4 mt-14">
                            <img onClick={goBack} src="https://cdn-icons-png.flaticon.com/512/3114/3114883.png" className="w-auto h-8" alt="Background" />
                            <h1 className="text-start font-bold text-2xl text-black hidden md:block">
                                {translations.InvestementDetails.investmentDetails[language]}
                            </h1>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 px-4 mt-4 md:grid-cols-2 gap-4 text-start">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4"  >
                            <div style={{ background: "#F5F5F5" }} className="p-3">
                                <p> {translations.InvestementDetails.investmentAmount[language]}</p>
                                <p
                                    className="text-md font-bold my-2"
                                    style={{ color: 'rgba(0, 0, 148, 1)' }}
                                >
                                    ₹{SelectedInvestmentDetails?.amount?.toLocaleString("en-IN")}

                                </p>
                            </div>
                            <div style={{ background: "#F5F5F5" }} className="p-4">
                                <p> {translations.InvestementDetails.returns[language]}</p>
                                <p></p>
                                <p
                                    className="text-md font-bold my-2"
                                    style={{ color: 'rgba(0, 0, 148, 1)' }}
                                >
                                    {SelectedInvestmentDetails.interest_per_month}%
                                </p>
                            </div>
                            <div style={{ background: "#F5F5F5" }} className="p-4">
                                <p> {translations.InvestementDetails.duration[language]}</p>
                                <p
                                    className="text-md font-bold my-2"
                                    style={{ color: 'rgba(0, 0, 148, 1)' }}
                                >
                                    {SelectedInvestmentDetails.period_in_months} Months
                                </p>
                            </div>
                            <div style={{ background: "#F5F5F5" }} className="p-4">
                                <p> {translations.InvestementDetails.returnsPerMonth[language]}</p>
                                <p></p>
                                <p
                                    className="text-md font-bold my-2"
                                    style={{ color: 'rgba(0, 0, 148, 1)' }}
                                >
                                    ₹{ReturnPerMonth?.toLocaleString("en-IN")}
                                </p>
                            </div>

                            <div style={{ background: "#F5F5F5" }} className="p-4">
                                <p> {translations.InvestementDetails.totalReturns[language]}</p>
                                <p
                                    className="text-md font-bold my-2"
                                    style={{ color: 'rgba(0, 0, 148, 1)' }}
                                >
                                    ₹{SelectedInvestmentDetails.totalPayout?.toLocaleString("en-IN")}
                                </p>
                            </div>
                            <div style={{ background: "#F5F5F5" }} className="p-4">
                                <p> {translations.InvestementDetails.downloadInvestmentPlan[language]}<DownloadForOffline className="mx-0 md:mx-1"></DownloadForOffline></p>
                            </div>
                        </div>
                    </div>


                    <div className=" text-start rounded-lg px-4 mt-4 grid md:grid-cols-3 grid-cols-1 gap-4">
                        <div className="flex flex-row">
                            <p style={{ color: "#020065" }} className="text-md font-semibold">
                                {translations.InvestementDetails.upcomingPayout[language]}
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
                                        <p className="text-md"> {translations.InvestementDetails.payoutAmount[language]}</p>
                                        <p
                                            className="font-bold text-md"
                                            style={{ color: "#020065" }}
                                        >
                                            ₹{payout?.expected_payout_amount}
                                        </p>
                                    </div>
                                    <div className="flex flex-col text-start">
                                        <p className="text-md"> {translations.InvestementDetails.payoutOn[language]}</p>
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
                                {translations.InvestementDetails.noUpcomingPayouts[language]}
                            </p>
                        )}
                    </div>
                    <div className=" text-start rounded-lg px-4 mt-4 grid md:grid-cols-3 grid-cols-1 gap-4">
                        <div className="flex flex-row">
                            <p style={{ color: "#020065" }} className="text-md font-semibold">
                                {translations.InvestementDetails.payoutHistory[language]}
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
                                        <p className="text-md"> {translations.InvestementDetails.payoutAmount[language]}</p>
                                        <p
                                            className="font-bold text-md"
                                            style={{ color: "#020065" }}
                                        >
                                            ₹{payout?.expected_payout_amount}
                                        </p>
                                    </div>
                                    <div className="flex flex-col text-start">
                                        <p className="text-md"> {translations.InvestementDetails.payoutOn[language]}</p>
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
                                {translations.InvestementDetails.noPayoutHistory[language]}
                            </p>
                        )}
                    </div>
                </div>
            </div >
        </>
    );
};

export default InvestmentDetails;

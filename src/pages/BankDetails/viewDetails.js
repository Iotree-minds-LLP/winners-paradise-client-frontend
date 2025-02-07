import imageLogo from "../../assets/Logos/logo1.png";
import image3 from "../../assets/Images/sideImage.png";
import backButton from "../../assets/Logos/backButton.png"
import { useForm } from 'react-hook-form';
import { useLanguage } from "../../context/Language/loginContext";
import { useToast } from "../../context/Toast/toastHook";
import { goBack } from "../../utils/Functions/goBackScreen";
import translations from "../../utils/Json/translation.json"
import Skeleton from "react-loading-skeleton";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCustomerById } from "../../network/Customer/page";
import addNomineeImage from "../../assets/Images/addnominee.png"
import formatDate from "../../utils/Functions/formatDate";
import image2 from "../../assets/Images/robo 1 (1).png";

const ViewDetails = () => {

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();

    const { addToast } = useToast();
    const { language, setLanguage } = useLanguage();
    const [isLoading, setisLoading] = useState(false)
    const [customerDetailsFromAPI, setCustomerDetailsFromAPI] = useState({});
    const [NomineeDetails, setNomineeDetails] = useState(null)

    useEffect(() => {
        const data = localStorage.getItem("customerDetails");
        const customer = JSON.parse(data);
        fetchCustomerDetails(customer._id);
    }, []);

    const fetchCustomerDetails = async (id) => {
        setisLoading(true);
        try {
            if (id) {
                const resp = await getCustomerById(id);
                console.log(resp, "Resp")
                if (resp.data.status === 200) {
                    setCustomerDetailsFromAPI(resp.data.data.customer);
                }
                if (resp.data.data.customer.nominee_id) {
                    setNomineeDetails(resp.data.data.customer.nominee_id)
                }
                else {
                    setNomineeDetails(null)
                }
            }
        } catch (error) {
            console.error("Error fetching customer details:", error);
        } finally {
            setisLoading(false);
        }
    };


    return (
        <>
            <div className="h-screen flex flex-col">
                {/* Mobile Header */}
                <div className="h-[60px] fixed top-100 mb-4 z-10 w-full sm:hidden  bg-gradient-to-l from-[#020065] to-[#0400CB] flex flex-row p-3">
                    <img src={backButton} onClick={goBack} className="w-8 h-8" alt="Back" />
                    <p className="text-white font-semibold my-1">{translations.BankAccount.heading[language]}</p>
                </div>

                <div className="h-full bg-white grid grid-cols-12 md:grid-cols- md:overflow-hidden md:p-0 sm:p-10">
                    <div className="col-span-12 md:col-span-6 w-full order-1 md:order-2 md:px-20 mt-10 overflow-auto">

                        <div className="flex flex-row">
                            <p style={{ color: '#020065' }} className="mx-5 hidden sm:block text-start font-semibold text-3xl">
                                {translations.BankAccount.heading[language]}
                            </p>
                        </div>

                        <div className="text-start rounded-lg mt-5 p-4  grid md:grid-cols-1 grid-cols-1 gap-4">
                            <div className="p-4 md:p-6 rounded-lg w-full " style={{ backgroundColor: 'rgba(245, 245, 245, 1)' }}>
                                {isLoading ? (
                                    <>
                                        <div className="mb-4">
                                            <Skeleton width="50%" height={20} />
                                            <Skeleton width="80%" height={25} className="mt-2" />
                                        </div>
                                        <div className="my-3">
                                            <Skeleton width="50%" height={20} />
                                            <Skeleton width="80%" height={25} className="mt-2" />
                                        </div>
                                        <div className="my-3">
                                            <Skeleton width="50%" height={20} />
                                            <Skeleton width="80%" height={25} className="mt-2" />
                                        </div>
                                        <div className="my-3">
                                            <Skeleton width="50%" height={20} />
                                            <Skeleton width="80%" height={25} className="mt-2" />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-sm text-gray-800">  {translations.BankAccount.heading[language]}</p>
                                            </div>
                                            <Link to="/profile-and-settings/bank-details">
                                                <button aria-label="Edit" className="p-2">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 24 24"
                                                        fill="black"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        className="w-4 md:w-6 md:h-6 h-4"
                                                    >
                                                        <path d="M12 20h9"></path>
                                                        <path d="M16.5 3.5l4 4L7 21H3v-4L16.5 3.5z"></path>
                                                    </svg>
                                                </button>
                                            </Link>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                            <div>
                                                <div className="text-sm ">{translations.BankAccount.bankAccountNumber[language]}</div>
                                                <p style={{ color: 'rgba(0, 0, 148, 1)', fontWeight: '700', fontSize: '18px' }}>
                                                    {customerDetailsFromAPI.bank_acc_no}
                                                </p>
                                            </div>

                                            <div>
                                                <div className="text-sm ">{translations.BankAccount.ifscCode[language]}</div>
                                                <p style={{ color: 'rgba(0, 0, 148, 1)', fontWeight: '700', fontSize: '18px' }}>
                                                    {customerDetailsFromAPI.bank_Ifsc_code}
                                                </p>
                                            </div>

                                            <div>
                                                <div className="text-sm ">{translations.BankAccount.bankBranchName[language]}</div>
                                                <p style={{ color: 'rgba(0, 0, 148, 1)', fontWeight: '700', fontSize: '18px' }}>
                                                    {customerDetailsFromAPI.bank_branch_name}
                                                </p>
                                            </div>

                                            <div>
                                                <div className="text-sm ">{translations.BankAccount.bankName[language]}</div>
                                                <p style={{ color: 'rgba(0, 0, 148, 1)', fontWeight: '700', fontSize: '18px' }}>
                                                    {customerDetailsFromAPI.bank_name}
                                                </p>
                                            </div>
                                        </div>

                                    </>
                                )}
                            </div>
                        </div>

                        {NomineeDetails ? (
                            <div className="text-start rounded-lg mt-1 p-4  grid md:grid-cols-1 grid-cols-1 gap-4">
                                <div className="p-4 md:p-6 rounded-lg w-full " style={{ backgroundColor: 'rgba(245, 245, 245, 1)' }}>
                                    {isLoading ? (
                                        <>
                                            <div className="mb-4">
                                                <Skeleton width="50%" height={20} />
                                                <Skeleton width="80%" height={25} className="mt-2" />
                                            </div>
                                            <div className="my-3">
                                                <Skeleton width="50%" height={20} />
                                                <Skeleton width="80%" height={25} className="mt-2" />
                                            </div>
                                            <div className="my-3">
                                                <Skeleton width="50%" height={20} />
                                                <Skeleton width="80%" height={25} className="mt-2" />
                                            </div>
                                            <div className="my-3">
                                                <Skeleton width="50%" height={20} />
                                                <Skeleton width="80%" height={25} className="mt-2" />
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="text-sm text-gray-800">{translations.Nominee.nomineeDetails[language]} *</p>
                                                </div>
                                                <Link to="/profile-and-settings/add-nominee">
                                                    <button aria-label="Edit" className="p-2">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 24 24"
                                                            fill="black"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            className="w-4 md:w-6 md:h-6 h-4"
                                                        >
                                                            <path d="M12 20h9"></path>
                                                            <path d="M16.5 3.5l4 4L7 21H3v-4L16.5 3.5z"></path>
                                                        </svg>
                                                    </button>
                                                </Link>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">

                                                <div>
                                                    <div className="text-sm ">{translations.Nominee.nomineeField[language]}</div>
                                                    <p style={{ color: 'rgba(0, 0, 148, 1)', fontWeight: '700', fontSize: '18px' }}>
                                                        {NomineeDetails.nominee_name}
                                                    </p>
                                                </div>

                                                {NomineeDetails.nominee_dob &&

                                                    <div>
                                                        <div className="text-sm ">{translations.MyProfile.dob[language]}</div>
                                                        <p style={{ color: 'rgba(0, 0, 148, 1)', fontWeight: '700', fontSize: '18px' }}>
                                                            {formatDate(NomineeDetails.nominee_dob)}
                                                        </p>
                                                    </div>


                                                }

                                                {NomineeDetails.nominee_pan_no &&
                                                    <div>
                                                        <div className="text-sm ">{translations.Nominee.panNumber[language]}</div>
                                                        <p style={{ color: 'rgba(0, 0, 148, 1)', fontWeight: '700', fontSize: '18px' }}>
                                                            {NomineeDetails.nominee_pan_no}
                                                        </p>
                                                    </div>
                                                }

                                                {NomineeDetails.nominee_bank_acc_no &&

                                                    <div>
                                                        <div className="text-sm ">{translations.BankAccount.bankAccountNumber[language]}</div>
                                                        <p style={{ color: 'rgba(0, 0, 148, 1)', fontWeight: '700', fontSize: '18px' }}>
                                                            {NomineeDetails.nominee_bank_acc_no}
                                                        </p>
                                                    </div>

                                                }

                                                {NomineeDetails.nominee_bank_branch &&

                                                    <div>
                                                        <div className="text-sm ">{translations.BankAccount.bankBranchName[language]}</div>
                                                        <p style={{ color: 'rgba(0, 0, 148, 1)', fontWeight: '700', fontSize: '18px' }}>
                                                            {NomineeDetails.nominee_bank_branch}
                                                        </p>
                                                    </div>

                                                }

                                                {NomineeDetails.nominee_bank_ifsc_code &&

                                                    <div>
                                                        <div className="text-sm ">{translations.BankAccount.ifscCode[language]}</div>
                                                        <p style={{ color: 'rgba(0, 0, 148, 1)', fontWeight: '700', fontSize: '18px' }}>
                                                            {NomineeDetails.nominee_bank_ifsc_code}
                                                        </p>
                                                    </div>
                                                }


                                            </div>

                                        </>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="mx-3">

                                    {isLoading ? (
                                        <div className="mb-4" >
                                            <Skeleton width="50%" height={20} />
                                            <Skeleton width="80%" height={25} className="mt-2" />
                                        </div>
                                    ) : (
                                        <Link to="/profile-and-settings/add-nominee" className="mb-10 md:mb-0 mx-4 p-5">
                                            <div className="mt-5 p-5 w-full rounded-lg border border-black border-dotted border-2 text-start flex justify-between">
                                                <p className="text-lg font-bold" style={{ color: 'rgba(0, 0, 148, 1)' }}>
                                                    {translations.Nominee.heading[language]}
                                                </p>
                                                <img className="w-6 h-6" src={addNomineeImage} alt="Add Nominee" />
                                            </div>
                                        </Link>
                                    )}

                                </div>

                            </>
                        )}

                    </div>
                    <div className="col-span-12 hidden sm:block overflow-hidden md:col-span-6 w-full max-h-[100vh] order-2 md:order-1 responsive relative">
                        <img src={image3} alt="Image description" className="w-full h-auto object-cover" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <h1 className="text-white text-2xl md:text-4xl font-bold bg-opacity-75 p-4 rounded-lg flex flex-col justify-center items-center">
                                <img
                                    className="h-auto w-1/2 p-3 md:mt-0 sm:mt-20 mt-10 text-start"
                                    src={imageLogo}
                                    alt="Logo"
                                />
                                <div className="p-2 ">
                                    <h1 className="text-3xl text-white font-semibold"> {translations.loginScreen.sendOtpScreen.heading1[language]}</h1>
                                </div>

                                <div className="">
                                    <h1 className="text-4xl mt-2 text-white font-bold pt-4"> {translations.loginScreen.sendOtpScreen.heading2[language]}</h1>
                                </div>
                            </h1>
                        </div>
                    </div>
                </div >
            </div >

            {!NomineeDetails &&
                <div className="fixed bottom-0 left-0 w-full sm:hidden">
                    <div className="bg-white shadow-md">
                        <img
                            src={image2}
                            alt="Image description"
                            className="w-full h-full object-contain"
                        />
                    </div>
                </div>
            }

        </>
    );
};

export default ViewDetails;

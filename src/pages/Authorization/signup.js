import { createCustomer } from "../../network/Customer/page";
import { useNavigate } from "react-router-dom";
import { SendOtp, VerifyOtp } from "../../network/OtpVerification/page";
import { useContext, useState } from "react";
import WidgetButton from "../../widgets/Button/page";
import FormattedJsonViewer from "../../widgets/JsonView/page";
import Button from '@mui/material/Button';
import imageLogo from "../../assets/Logos/logo1.png";
import image1 from "../../assets/Images/robo 1 (3).png";
import image3 from "../../assets/Images/sideImage.png";
import image2 from "../../assets/Images/robo 1 (1).png";
import { Radio, FormControlLabel, FormControl, FormLabel, RadioGroup, TextField } from '@mui/material';
import { PwaContext } from "../../context/PwaContext/page";
import backButton from "../../assets/Logos/backButton.png"

const SignupPage = () => {
    const [ShowPhoneField, setShowPhoneField] = useState(true);

    const tokenDetails = localStorage.getItem("tokenDetails");
    const [response, setResponse] = useState([]);
    const [isError, setIsError] = useState(false);
    const navigate = useNavigate();
    const onformSubmit = async () => {
        const payload = {
            name: "CUS 1",
            dob: "10-10-1000",
            email_id: "cus3@gmail.com",
            mobile_no: "9922129050",
            state: "KA",
            district: "KLR",
            city: "BNG",
            address: "BNG",
            language_preference: "kannada",
            nominee: {
                nominee_name: "venkanna",
                nominee_aadhar_no: "123412341234",
                nominee_dob: "01-10-1230",
                nominee_aadhar_file: "dfsjfshffjshfjsfj",
                nominee_pan_file: "sdfsfsfjsfsjfsjf",
                nominee_photo: "sdfksfkjsffjksdf",
                nominee_pan_no: "sfsfsjkfsfjk",
                nominee_cancelled_cheque: "sfsfsfsf",
                nominee_bank_acc_no: "sfsfsfdsf",
                nominee_bank_ifsc_code: "sdfsfsfdsfd",
                nominee_bank_branch: "sfdsfsf",
            },
            token: tokenDetails,
        };
        try {
            const resp = await createCustomer(payload);
            localStorage.setItem("customerDetails", JSON.stringify(resp.data.data.customer));
            localStorage.setItem("tokenDetails", resp.data.data.token);
            setResponse(resp.data.data);
            setIsError(false);
            setTimeout(() => {
                navigate("/homepage")
            }, 3000);
        } catch (error) {
            setResponse(`Error: ${error.message}`);
            setIsError(true);
        }
    };

    return (
        <>
            <div className="h-screen flex flex-col">
                <div className="h-[60px] sm:hidden bg-gradient-to-l from-[#020065] to-[#0400CB] flex flex-row p-3 ">
                    <img src={backButton} className="w-8 h-8"></img>
                    <p className="text-white font-semibold my-1">Submit Personal details</p>
                </div>
                <div className="h-full bg-white grid grid-cols-12 md:grid-cols-12 md:overflow-y-hidden  md:p-0 sm:p-10">
                    <div className="col-span-12 md:col-span-6 w-full order-1 md:order-2  md:px-20 mt-10 ">
                        <div className="flex flex-row">
                            <p style={{ color: '#020065' }} className="mx-3 hidden sm:block text-start font-semibold text-3xl">Submit Personal details</p>
                        </div>
                        {/* <img src={backButton}></img> */}
                        <form className="my-5 grid grid-cols-1 gap-4 md:mx:0 mx-5">
                            <TextField
                                label="Full Name *"
                                variant="outlined"
                                size="medium"
                                fullWidth
                            />
                            <TextField
                                label="Phone Number"
                                variant="outlined"
                                type="number"
                                size="medium"
                                placeholder="+91 00000 00000"
                                fullWidth
                            />
                            <TextField
                                label="Email Id *"
                                variant="outlined"
                                type="text"
                                size="medium"
                                fullWidth
                            />
                            <TextField
                                variant="outlined"
                                type="date"
                                size="medium"
                                fullWidth
                            />
                            <TextField
                                label="Residential Address *"
                                variant="outlined"
                                size="medium"
                                fullWidth
                            />
                            <TextField
                                label="Alternate Phone Number"
                                variant="outlined"
                                type="number"
                                size="medium"
                                placeholder="+91 00000 00000"
                                fullWidth
                            />
                            <TextField
                                label="Referral Code *"
                                variant="outlined"
                                size="medium"
                                type="text"
                                fullWidth
                            />
                            <div className="mt-5">
                                <button
                                    className="md:w-full w-full p-3 rounded-full text-white bg-gradient-to-l from-[#020065] to-[#0400CB]"
                                >
                                    Continue
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="col-span-12 hidden sm:block overflow-hidden md:col-span-6 w-full max-h-[100vh] order-2 md:order-1 responsive relative">
                        {/* Image */}
                        <img src={image3} alt="Image description" className="w-full h-auto object-cover" />

                        {/* Centered Content */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <h1 className="text-white text-2xl md:text-4xl font-bold bg-opacity-75 p-4 rounded-lg flex flex-col justify-center items-center">
                                <img
                                    className="h-auto w-1/2 p-3 md:mt-0 sm:mt-20 mt-10 text-start"
                                    src={imageLogo}
                                    alt="Logo"
                                />
                                <div className="p-2 ">
                                    <h1 className="text-3xl text-white font-semibold">Welcome to</h1>
                                </div>

                                <div className="">
                                    <h1 className="text-4xl mt-2 text-white font-bold pt-4">Algo Achievers </h1>
                                </div>
                            </h1>
                        </div>
                    </div>


                    {/* <div className="col-span-12 md:col-span-6 sm:hidden w-full h-full order-2 md:order-1 responsive">
                        <img src={image2} alt="Image description" className="w-full h-full object-contain" />
                    </div> */}
                </div>

            </div >
        </>
    );
};

export default SignupPage;

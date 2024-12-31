import { useNavigate } from "react-router-dom";
import { SendOtp, VerifyOtp } from "../../network/OtpVerification/page";
import { useContext, useState } from "react";
import NavBar from "../../components/Navbar/page";
import WidgetButton from "../../widgets/Button/page";
import FormattedJsonViewer from "../../widgets/JsonView/page";
import Button from '@mui/material/Button';
import imageLogo from "../../assets/Logos/logo1.png";
import image1 from "../../assets/Images/robo 1 (3).png";
import image3 from "../../assets/Images/sideImage.png";
import image2 from "../../assets/Images/robo 1 (1).png";
import { Radio, FormControlLabel, FormControl, FormLabel, RadioGroup, TextField } from '@mui/material';
import { PwaContext } from "../../context/PwaContext/page";

const OtpVerification = () => {
    const [response, setResponse] = useState([]);
    const [otp, setOtp] = useState();
    const [ShowotpField, setShowotpField] = useState(false);
    const [ShowPhoneField, setShowPhoneField] = useState(true);

    const [token, setToken] = useState();
    const [inputValue, setInputValue] = useState();
    const [isError, setIsError] = useState(false);
    const navigate = useNavigate();

    const { deferredPrompt, isInstalled, handleInstallClick } = useContext(PwaContext);

    const sendOtp = async () => {
        setShowotpField(true);
        setShowPhoneField(false);
        const payload = {
            mobileNumber: inputValue,
        };
        let resp;
        try {
            resp = await SendOtp(payload);
            setOtp(resp.data.data.otp);
            setToken(resp.data.data.token);
            setResponse(resp.data.data);
            setIsError(false);
        } catch (error) {
            setResponse(`Error: ${error.message}`);
            setIsError(true);
        }
    };

    const verifyOtp = async () => {
        const payload = {
            otp,
            token
        };
        try {
            const resp = await VerifyOtp(payload);
            setResponse(resp.data.data);
            setIsError(false);
            if (resp.data.data?.customer) {
                localStorage.setItem("customerDetails", JSON.stringify(resp.data.data.customer));
                setTimeout(() => {
                    navigate("/homepage");
                }, 3000);
            } else {
                setTimeout(() => {
                    navigate("/register");
                }, 3000);
            }
            localStorage.setItem("tokenDetails", resp.data.data.token);
        } catch (error) {
            setResponse(`Error: ${error.message}`);
            setIsError(true);
        }
    };

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    return (
        <>
            <div className="h-screen flex flex-col">
                <div className="h-1/2 sm:hidden bg-gradient-to-l from-[#020065] to-[#0400CB] flex flex-col justify-center md:justify-start items-center md:items-start">
                    <img
                        className="h-auto md:hidden w-1/2 p-3 md:mt-0 sm:mt-20 mt-10 text-start"
                        src={imageLogo}
                        alt="Logo"
                    />
                    <div className="p-2 sm:hidden">
                        <h1 className="text-2xl text-white font-semibold">Welcome to</h1>
                    </div>

                    <div className="sm:hidden">
                        <h1 className="text-4xl mt-2 text-white font-bold pb-6">Algo Achievers </h1>
                    </div>
                </div>


                <div className="h-full bg-white grid grid-cols-12 md:grid-cols-12 ">
                    {/* Content Section */}
                    <div className=" col-span-12 md:col-span-6 w-full order-1 md:order-2 md:mt-10 mt-0 p-0 md:p-20 ">
                        <p style={{ color: '#020065' }} className="hidden sm:block text-start mx-5 font-semibold text-3xl">Login</p>
                        <div
                            className="text-start mt-5 mx-5 rounded-lg p-4"
                            style={{ backgroundColor: 'rgba(245, 245, 245, 1)' }}
                        >
                            <p style={{ color: 'rgba(0, 0, 148, 1)', fontWeight: '500', fontSize: '14px' }}>
                                Select preferred language
                            </p>

                            <FormControl component="fieldset" style={{ marginTop: '16px' }}>
                                <RadioGroup
                                    row
                                    aria-label="language"
                                    name="language-group"
                                    defaultValue="English"
                                    className="gap-4 sm:gap-6"
                                >
                                    <FormControlLabel
                                        value="English"
                                        control={
                                            <Radio
                                                sx={{
                                                    color: 'rgba(2, 0, 101, 1)',
                                                    '&.Mui-checked': {
                                                        color: 'rgba(2, 0, 101, 1)',
                                                    },
                                                }}
                                            />
                                        }
                                        label="English"
                                        style={{ color: 'rgba(2, 0, 101, 1)', fontWeight: 'bold' }}
                                    />
                                    <FormControlLabel
                                        value="Kannada"
                                        control={
                                            <Radio
                                                sx={{
                                                    color: 'rgba(2, 0, 101, 1)',
                                                    '&.Mui-checked': {
                                                        color: 'rgba(2, 0, 101, 1)',
                                                    },
                                                }}
                                            />
                                        }
                                        label="ಕನ್ನಡ"
                                        style={{ color: 'rgba(2, 0, 101, 1)', fontWeight: 'bold' }}
                                    />
                                </RadioGroup>
                            </FormControl>

                        </div>

                        {/* Login/Register Form */}
                        {ShowPhoneField && (
                            <div
                                className="text-start mt-5 mx-5 rounded-lg p-5 mt-5 lg:mt-10 "
                                style={{ backgroundColor: 'rgba(245, 245, 245, 1)' }}
                            >
                                <p style={{ color: 'rgba(0, 0, 148, 1)', fontWeight: '500', fontSize: '14px' }}>
                                    Login/Register to continue
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-1 mt-3">
                                    <TextField
                                        label="Phone Number"
                                        variant="outlined"
                                        size="medium"
                                        fullWidth
                                        value={inputValue}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="mt-5">
                                    <button
                                        onClick={sendOtp}
                                        className="md:w-full w-full p-3 rounded-full text-white bg-gradient-to-l from-[#020065] to-[#0400CB]"
                                    >
                                        Get Otp
                                    </button>
                                </div>
                            </div>
                        )}

                        {ShowotpField && (
                            <div
                                className="text-start mt-5 mx-5 rounded-lg p-5 mt-5 lg:mt-10 "
                                style={{ backgroundColor: 'rgba(245, 245, 245, 1)' }}
                            >
                                <div className="flex justify justify-between">
                                    <p style={{ color: 'rgba(0, 0, 148, 1)', fontWeight: '500', fontSize: '14px' }}>
                                        Confirm Phone number
                                    </p>

                                    <p style={{ color: 'rgba(0, 0, 148, 1)', fontWeight: '500', textDecoration: "underline", fontSize: '14px' }}>
                                        Resend OTP?
                                    </p>
                                </div>
                                <div className="md:grid grid-cols-1 mt-3">
                                    <TextField
                                        label="Enter OTP"
                                        variant="outlined"
                                        size="medium"
                                        fullWidth
                                        type="password"
                                    />
                                </div>
                                <p className="text-centerlg:text-start  text-sm mt-2" style={{ color: "#49454F" }}>
                                    Enter the OTP shared thorough text message
                                </p>
                                <div className="mt-5">
                                    <button
                                        onClick={sendOtp}
                                        className="md:w-full w-full p-3 rounded-full text-white bg-gradient-to-l from-[#020065] to-[#0400CB]"
                                    >
                                        Confirm
                                    </button>
                                </div>
                            </div>
                        )}
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


                    <div className="col-span-12 md:col-span-6 sm:hidden w-full h-full order-2 md:order-1 responsive">
                        <img src={image2} alt="Image description" className="w-full h-full object-contain" />
                    </div>
                </div>

            </div>
        </>
    );
};

export default OtpVerification;

import imageLogo from "../../assets/Logos/logo1.png";
import imageLogo1 from "../../assets/Images/candleStick.png";
import image2 from "../../assets/Images/splashScreen.png";
import logo from "../../assets/Logos/Algo-Achievers-Logo_009600960_38721 1 (1).png";

const SplashScreen = () => {

    return (
        <div className="h-screen flex flex-col">
            <div className="h-1/2 bg-gradient-to-l from-[#020065] to-[#0400CB]">
                <div className="flex justify-end text-end items-end">
                    <img src={logo} className="w-14 flex  justify-end" alt="Top Logo" />
                </div>
                <div className="flex flex-col justify-center text-center items-center">
                    <img
                        className="h-auto w-64"
                        src={imageLogo}
                        alt="Main Logo"
                    />
                    <div className="text-center mt-5">
                        <h1 className="text-2xl text-white font-semibold">Welcome to</h1>
                        <h1 className="text-4xl mt-2 text-white font-semibold">Winners Paradise</h1>
                        <p className="text-white mt-5">Artificial intelligence robot for stock market</p>
                    </div>
                    <img
                        className="h-auto w-80"
                        src={imageLogo1}
                        alt="Candle Stick"
                    />
                </div>
            </div>
            <div className="h-1/2">
                <img
                    src={image2}
                    alt="Splash Screen"
                    className="w-full h-full object-cover"
                />
            </div>
        </div>
    );
};

export default SplashScreen;

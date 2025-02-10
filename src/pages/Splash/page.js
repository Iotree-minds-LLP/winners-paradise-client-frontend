import imageLogo from "../../assets/Logos/logo1.png";
import imageLogo1 from "../../assets/Images/candleStick.png";
import image2 from "../../assets/Images/robo 1 (1).png";
import logo from "../../assets/Logos/Algo-Achievers-Logo_009600960_38721 1 (1).png";

const SplashScreen = () => {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Top Section */}
            <div className="flex flex-col flex-grow bg-gradient-to-l from-[#020065] to-[#0400CB]">
                {/* Top Right Logo */}
                <div className="flex justify-end p-4">
                    <img src={logo} className="w-12 sm:w-14" alt="Top Logo" />
                </div>

                {/* Center Content */}
                <div className="flex flex-col items-center justify-center flex-grow px-4 text-center">
                    <img className="w-48 sm:w-64 h-auto" src={imageLogo} alt="Main Logo" />
                    <div className="mt-4">
                        <h1 className="text-xl sm:text-2xl text-white font-semibold">Welcome to</h1>
                        <h1 className="text-2xl sm:text-4xl mt-2 text-white font-semibold">Winners Paradise</h1>
                        <p className="text-white mt-3 text-sm sm:text-base">Artificial intelligence robot for stock market</p>
                    </div>
                    <img className="w-64 sm:w-80 h-auto mt-4" src={imageLogo1} alt="Candle Stick" />
                </div>
            </div>

            {/* Bottom Section (Splash Screen Image) */}
            <div className="relative w-full">
                <img
                    src={image2}
                    alt="Splash Screen"
                    className="w-full h-[40vh] sm:h-[50vh] object-cover"
                />
            </div>
        </div>
    );
};

export default SplashScreen;

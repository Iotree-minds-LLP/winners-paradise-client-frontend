import { useState, useRef, useEffect } from "react";
import backImage from "../../assets/Images/backImage.jpg";
import { useLocation, useNavigate } from "react-router-dom";
import backButton from "../../assets/Logos/backButton.png";
import uploadImage from "../../assets/Images/upload.png";
import ResetImage from "../../assets/Images/reset.png";
import { creteCustomerKycRequest } from "../../network/KycVerification/page";
import { useToast } from "../../context/Toast/toastHook";
import { useForm } from "react-hook-form";
import { TextField } from "@mui/material";

const AadharUpload = () => {
    const [frontImage, setFrontImage] = useState(null);
    const [backImagePreview, setBackImagePreview] = useState(null);
    const [showCamera, setShowCamera] = useState(false);
    const [currentImageSetter, setCurrentImageSetter] = useState(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const navigate = useNavigate();
    const [isLoading, setisLoading] = useState(false)
    const [ErrorMessage, setErrorMessage] = useState(null);
    const [customerDetails, setcustomerDetails] = useState({})
    const [AadharNumber, setAadharNumber] = useState(null);
    const location = useLocation();
    const [locationStateDetails, setLocationStateDetails] = useState(null);
    const [AadharFrontStatus, setAadharFrontStatus] = useState('');
    const [AadharBackStatus, setAadharBackStatus] = useState('');

    useEffect(() => {
        const data = localStorage.getItem("customerDetails");
        const customer = JSON.parse(data);
        setcustomerDetails(customer)
    }, []);


    useEffect(() => {
        console.log(location.state?.item, "location.state?.item")
        setLocationStateDetails(location.state?.item)
        // setAadharNumber(location.state?.item?.aadhar_no)
        setAadharNumber(173871829731)
        setAadharFrontStatus("Cleared")
        setAadharBackStatus('Rejected')
        setBackImagePreview("data:image/jpeg;base64,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")
        setFrontImage("data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAH0A4gMBIgACEQEDEQH/xAAbAAACAgMBAAAAAAAAAAAAAAAABQMEAQIHBv/EAEkQAAECBAIFBQwJAQYHAAAAAAECAwAEBRESIRMUMUFRBiJSYZMyNFNUVXGBkpSz0uIVIzNCcnSDkaJiJIKhscHwBxY1Q2Rzsv/EABkBAQEBAQEBAAAAAAAAAAAAAAABAwIFBP/EACwRAQACAQIEBAUFAQAAAAAAAAABAhEDMQQSE1EhQZHwFSIyUmEzQ3Gh0QX/2gAMAwEAAhEDEQA/AOuydHlmlF+ZbamZ5xIDs040MSrZ2F72SDeyQbC/G5NrUJLxRjs0xZERvuhllx1SVKCElWFIuTYbhxgItQkvFGOzTBqEl4ox2aY53XOV83Ny2GWc0aXFXRolKQblJIBUCDYA3Oy9iQQMoKRyzdlEKS4rSIUvHhdcU5h4pCjnawJBzzIOw2gOiahJeKMdmmDUJLxRjs0xtKPpmZZp9KVJDiAvCrIi4vY9cE1MMyrKnn1hLadqjuhM4WImZxDXUJLxRjs0wahJeKMdmmKR5RUnBi11vzZ3/aN0V6lKRi11rDszuP8AOM+rTvDToav2z6LWoSXijHZpg1CS8UY7NMUUcoqUpaU62gFXSBA/fZGBykpOJxKptKVNqIViSRsNsss4dWneDoa32z6L+oSXijHZpg1CS8UY7NML3eUtKaCf7SHMVu4TfbE0zWqdLIUpU20qwvhQoKJ9Ah1adzoasY+WfH8LWoSXijHZpg1CS8UY7NMVG69S3UYkzrXpyP7GKi+VFNQ0pTa3HNuFKWzziMyAT6D1CHW0+6xw+tO1Z9DbUJLxRjs0wahJeKMdmmE8tyqk32tIlmZunNacFwgZ5k7LWBMM2J9D+HRNr53FNsgbX8x3Qrq0ttKX0NSn1RhLqEl4ox2aYNQkvFGOzTEqHQrD/Vs64ljRkq6hJeKMdmmDUJLxRjs0xu/MNMICnnEthRtzuMaTM0GJZT6UlwfdCM8UZ21aVzmdlisyNQkvFGOzTBqEl4ox2aY0p83rbOJxtTax3SVJI9IvuiRmZYeUoMuocKe6wqvaJTWpeImJ32WaTEzE+SCYpNPmUYH5KWWm4ObQyI2EcCNoO0RikuLKJiWdWpxUs8WsatqhhChfrAUBffa++GMLqV35Vvzg9y3GrkxggggCEslKMVFap6dYQ+8l51DOlSFBlKVlFkg7CQLk7STa9gAHULaF3h+u/wC9XAWNQkvFGOzTBFqCAwIzGBGYDjPK6iVhuvTTjcsHpVMyXUYFJFwoKULA2JwhKgbZ5emNOTlGqczyjp+lpurMKdEwrGkYQhABJI3EkgWIG3hDblBXJufnEzMtJDU1LKEYlBKnQAtAWDe4FlOHO1rg5xrSOU78hVHH3ZJSpNyZA0iXArRocI5wzOWEIIAvcBXXAdVitNsNTUutiYTiaWLKGyLMUqpJpn5B6VUrDjHdcCDcH94k7EzNfGu5K9yRpakKKXHmxlztICAPTEjXJOlpQPtXD0lLvfMHZs3W80KneRkyMWinW1bLYkkZf42iVjkdMJQlLs/wKkoSQLg8fNfdtj5I04z+mnxHjp8MT6rK+SVOdWnRTK04dqQoG4uT/rt6ornkhKrWdDUOYNqcIJuDxvlw8/7RA5yOm0rbUxMtf1KzBGZNx/hl54rvclKoXlfZLxZqVitck55b+Mc20q+emfFuOr5Svr5JSjDP10/hUpXdKsBYnIdZ2efqi4jkrTJZlSn3Xe5spxSwkbR6Bw80JBySqSmsalNYr2SnEdg2G+4QwTyWn3kYpuo414SnCVFQFyN56r7tsWulWP2yf+px1/CYn1Mk8mqWrEtKDzttlZEE32bB6Irml0iWONc0lKJdJ2KFxcFKid5uCkZbwOqIEckC0FYZ1SUq+6m/N6777Dq4xq1yUKNGjEjC2k4lKTfEVJKTltysCPTvOXfJ2o5njeMmNv7NZd6iaFIYclMDgSi1xztwBB3+fOGLb0srnNKQo9xzbbjmPRwhbL8m5BhDjaUlQcbwLUrbssSDuuCb24wyZk2WcOiThCU2Cdw67bL9cbVi0bxCVtrW+tOlSVdzEUzMtSzWN9WFP++ESBtPN5vc7OqK082w+zoJhWFKtmeZtnlDWm0Umab+We7WkRzRksrDzUzKNPJQMCbrxvqLbSBsus7bcAMz1DOPNpqb0z3m9X51pOxVMlEMMD8OLM/uYlrj6Z2clFrYVOLeQF06lOJKG0C2bz4PDcDsG697LlPTE6hx91VaqqWb6V6nPavLN22hoAgrw2274xikRbmx807y9fQ0sUjPv33zH4yZSdZnWi9q01Nz4aTeYp0/LpbmkI3qQQAF24EG/GHlHmJMqTMMdxMNY2lI7l1O3IblDYRHi11JTkpMTLM2uafo2jnJKbcSQ67LqNloWTttmCd5h9JtasiryrPNbk5pEzK2+4h1IUQOABKsow4rwr1o8Zr4/wCrraEbbe4/jvHlnfO2XrZOdYm0KUyvFh280i37xBSu/Kt+cHuW4KUGNFpG7JW+A6tN9l+A4XvBSu/Kt+cHuW4+rhr2vpRa0xn8PJ1IiLTEGUEEEbuBC2hd4frv+9XDKFtC7w/Xf96uAZQQQQGBGYwIzAczq1ACZ5xMlN1RiWbd5kumRxpQq5JIVcEjba+7qjMjQEt1KX1ubqUzLOaNS5dMlokrvYoxqBvZOVxutbZkelwQBBBBAEEEEAQQQQBBBBAEEEEAQQQQBFZUoyuYS+pH1idisRy9EWYI5tStt4WJmNih+g019ybcdZUpc4kJmFaVQK0jdcHIdQsIBQqamZl5hEthcl0YGcLigltNiLBN7DIndDeCLiHXV1MY5p9SX/luj6EsaoNGZbVMOkV9le+Hbx37euLYp0okvKSym7yUoczPOCRZI9EX4Ik1rMYmCdS87zKiinyza21pbwqbGFHOOQzy29ZiOld+Vb84PctwyhdSu/Kt+cHuW4lNOlPpjDmZmdzGCCCO0ELaF3h+u/71cMoW0LvD9d/3q4BlBBBAaL7hX4TC2GK/slfhMLYDMZIUnukqi5KITgxb1RMpIULKgFkWpL7/AKIrLThWpPRVFmS+/wCiAxMMuKdxJTlEeru9H+QiSYccS7hSo2iPTu9IxUGru9H+Qg1d3o/yEGnd6Rg07vSMAau70f5CDV3ej/IQad3pGDTu9IwBq7vR/kI3ZZcS8lSk830Rpp3ekYNO70jAMIIX6d3pGDTu9IxFMIIX6d3pGModdxp5x7qAvxTdqMiytTbs7LtuJ2pU6kEecExcjk/KNmoqm605RJSUfm/pch3StsKUEau1b7Tde+yA6Z9JSODHrstgxYcWlTa/C99toPpKRwY9dlsGLDi0qbX4XvtyMcxm6dJTyJyQdbaYfVVWVsOISnRMrRJtrcJAyIwpcFrEXIy3xtJ0huSRItvsSrjExW9YRMZYZlCpZ9SCUGwRYEC1gMoDpjdSkHVpbanZZS1bEpdSSfMLxFSu/Kt+cHuW45rydZqaXqa5XZKSYmfpVnRaJphKsOjcxfZ7r22x0qld+Vb84PctwDGCCCAIW0LvD9d/3q4ZQtoXeH67/vVwDDDfOyf2gjMEBov7JX4TC2GS/slfhMV5NrF9Yr+7AbygWlGFSebuideLDzdsbQQCtYVj53dRZkvv+iJnm0uJ690RSO1z0f6wGX5hTS8KUiI9cX0RGy5iU1gsuOtadLWkKSoXCL2xW4X3xXbqdJdlnJlqblFMNpSpbgcTZIWApJJ3XBBHG4gJtcX0RBri+iIj12mYEuaxL4FOlhKsQzcBIKB/UClVxtFjwjZmbp72raB+Xc1lsusYVA6VAsSpPEc4ZjLMcYDbXF9EQa4voiNlOSqZluWWppL7iVLQ2SMSkpIBIG8C4v54rIqVIcZedRNyimmWdO4rGLIbN+eTuTzVZ7MjwgJ9cX0RBri+iIiE9TNE45rMto23UsrVjHNcVbCg8CcabDacQ4xs3OU5xEupt6XUmacKGcKh9YoAkgcSAk3G6x4QG+uL6Ig1xfREbOuSjDzLTi2kuzCiltKiAXCEkkAbzYE24AxCxO0x91TbMzLOLSFFSUuA2CFFKj6CCDwORgJNcX0RGUzalLSnCIrt1OkOSzky3NyimG0JWtzSJslKkgpJPAggg77xImcpqkpWmZl8KnzLpViGboJBR+IEEW25GAYRzjlEyliYq1WckaNVFNTjcuiR1RBdWVhtIC3Sm4Vdd7WOVs88ujxynlHNSUpWqhUp5NMZUzUAyw8qj6d4qS02sKKsYzGIWy3CAjrFLn5um02Sp7CaXOTFSXo0lhMoE/ULJF2ybiwIuQCdlonm6HP0ulMySX5erKZdQmdZVT231M/VKKVXWRiCckpvayT1WirOSkoxJ1Kqv0+lKfps827rjUkEXC2kLSVtXOM43AO6FjZWeGxUzErWuUQkZutSlTdTo3FtzDUoo6tiWFpUM/rE2FgLiwIzNswfclVJm5mizctJUlt9xSVOty0g2OYE2ccS5YEFKigKAFklYAJ2x0Old+Vb84Pctxz7/hop5+f0jE3roU4+tc061dTCMaboIvzS6SF3v/2zkdo6DSu/Kt+cHuW4BlBBBAELaF3h+u/71cMoW0LvD9d/3q4BhZMEZggNVDEjD1RhlGjQExuIzAEEEEARGhvCtaulEkEB43lzIzNUdl2JCUU67LtLefUUkJfYOSpW+Qu7bzDACd16lUS5P1qVrUpITH0bJpY1xlUstLk1fnNkIIBJYKwu1jmSBzk2j3sEB4WWYeb5XuVlUi99GPPrZQnRqJbeCAkzOG2QUEFu4GwBWxao35HSr8pV3n5mRdaYqTSnpIFKv7I3jKiyoHuCcYctlmSjY2mPbwQHk+XMlN1RmUp9MQpM8pS3kTXOSlhISQoFQ2FYVgte9lFQ7mE9aZcqKadMyFHmmWKdKodnJNTakF1rGDqoAyWUlsqsLjmhOxwx0SCA8LMsvO8rm6y1JPKpjLrUu6jRqBddKSEzARbMIxhBNthUTk2I2oUq8zyqcqbkk8mSqCnhJtls3lFXBWtQ+6HsGK5tYpAOaiI9xBAec5ZS0xPyEvISCXEzzz6SxNBJIlCjnF0kcALAE84kJORMebqdPfqlEpcjIUd2WmJFhzWGlpUEqbTzHJYOG2IOkZHO4AWc7X6PBAeAq4cnatK1qUp00adItMKnGVSy0rmgVY0AIOZLF9JaxuVFIzBETsyzyeWf0vqTv0c5MKl0t6NV0PhIQZojgQC1e2wBV8KiY9xBAEeKqfI+bnZyeXpKS/LTUzrKWZ2SW4W1FtKDYhwDYgbo9rBAeGd5H1ZSNM1WJZmc15M1ialFBsJSyGgjCVk2IAvnx2Q2rXJtVbkESs9N4krcQt7CmwbsgpOh6BJN+diyJG8EejggPHUHkNJ0RMuphEu6+zNKXrDrZK9ESbJBBAxAEC9rZHLPL0FK78q35we5bhjC2ld+Vb84PctwDKCCCAIW0LvD9d/3q4ZQtoXeH67/AL1cAxzgjMEAv0FS8fZ9m+aDV6l5QZ9m+aL4jMHXNPuC/V6l5QZ9m+aDV6l5QZ9m+aLb4UplWHbFXRP9frQwc0savUvKDPs3zQavUvKDPs3zRnRP9frQaJ/r9aGE5pY1epeUGfZvmg1epeUGfZvmjOif6/Wg0T/X60MHNLGr1Lygz7N80Gr1Lygz7N80Z0T/AF+tGzbb+NOPFhxdKGF5paavUvKDPs3zQavUvKDPs3zRPMocUtOjv60Q6J/r9aGDmljV6l5QZ9m+aDV6l5QZ9m+aM6J/r9aDRP8AX60MJzSxq9S8oM+zfNBq9S8oM+zfNGdE/wBfrQaJ/r9aGDmljV6l5QZ9m+aDV6l5QZ9m+aM6J/r9aDRP9frQwc0savUvKDPs3zQavUvKDPs3zRnRP9frQaJ/r9aGDmljV6l5QZ9m+aDV6l5QZ9m+aJ5ZLicWkvuizBeafcF+r1Lygz7N80Q0VLiXamH3EuOa0MSkpwg/VN7rm37w2hbS+/Ksf/MHuW4JM5MoIIIIIQ0lqeVJrLE202jWH7JUxit9avfiEPoXUHvBX5l/3q4LE4Z1epeUGfZvmghhBBeafcFFNYmW5NkS0yjVlNpLTbqCtTYIvbFiFwNguL8SYu4J7w8v2Svigpf/AE2T/wDQj/5EWoOVXBPeHl+yV8UGCe8PL9kr4otQQFXBPeHl+yV8UGCe8PL9kr4otQQFXBPeHl+yV8UGCe8PL9kr4otQQFXBPeHl+yV8UGCe8PL9kr4otQQFXBPeHl+yV8UGCe8PL9kr4otQQFXBPeHl+yV8UGCe8PL9kr4otQQFXBPeHl+yV8UGCe8PL9kr4otQQFXBPeHl+yV8UGCe8PL9kr4otQQFXBPeHl+yV8UGCe8PL9kr4otQQFXBPeHl+yV8UaDWypSUzEtiTt+qVlf+9F2Eo5OyZwlKnEqSVZjDmDkRs2WvbhcwFo664j6ibld3ODBVbYenw/zESyMu3LNFlpSlFKiVqUq6lKJuSes3vbIcABaF7XJuntOJwpVZOHm5WOEIAuLf0i/H9raq5OSIAF3e6t9zgB0eAAtsIFjcEgg5QtLnOSoKGYy6jY/5RJCg0OUDK2MTmBTpdOYyUoEG2WW024brQSVFkpZxbzaFaQ3QpWQuLZjICw6tgytsEAx0zWPR6RGLEE4bi4Nr2t5s4Xc1iYU5KVCXbaeVjUy6AoYiL3SQoWvtIzvmRa5J3nqOxPOl5514GwNkEC2RGRte9iRe97EjYSDCugyqi2FOOqCCgJScNhhJIyw/7GQsMoCwJh9QBTPU8g5g4Dn/ADgiVFMaQhKdLM5C2T6kj9gbD0QQH//Z")

    }, [location.state]);


    const handleAadharChange = (e) => {
        setAadharNumber(e.target.value);
    }

    const startCamera = (setImage) => {
        setShowCamera(true);

        if (setImage) {
            setCurrentImageSetter(() => setImage);
        }


        const isMobile = /Mobi|Android/i.test(navigator.userAgent);

        const constraints = {
            video: {
                facingMode: isMobile ? { exact: "environment" } : "user", // Back camera for mobile, front for desktop
            },
        };

        navigator.mediaDevices
            .getUserMedia(constraints)
            .then((stream) => {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            })
            .catch((err) => {
                console.error("Error accessing the camera:", err);
                setShowCamera(false);
            });
    };

    const capturePhoto = () => {
        const canvas = canvasRef.current;
        const video = videoRef.current;

        if (!canvas || !video) {
            console.error("Canvas or video is not available.");
            return;
        }

        const context = canvas.getContext("2d");

        const outputWidth = 300;
        const outputHeight = 190;

        canvas.width = outputWidth;
        canvas.height = outputHeight;

        const videoWidth = video.videoWidth;
        const videoHeight = video.videoHeight;

        const aspectRatio = videoWidth / videoHeight;
        const targetAspectRatio = outputWidth / outputHeight;

        let cropWidth, cropHeight;

        if (aspectRatio > targetAspectRatio) {
            cropHeight = videoHeight;
            cropWidth = cropHeight * targetAspectRatio;
        } else {
            cropWidth = videoWidth;
            cropHeight = cropWidth / targetAspectRatio;
        }

        const cropX = (videoWidth - cropWidth) / 2;
        const cropY = (videoHeight - cropHeight) / 2;

        context.drawImage(
            video,
            cropX,
            cropY,
            cropWidth,
            cropHeight,
            0,
            0,
            outputWidth,
            outputHeight
        );

        const base64Image = canvas.toDataURL("image/jpeg");
        currentImageSetter(base64Image);

        stopCamera();
    };


    const stopCamera = () => {
        const video = videoRef.current;
        const stream = video.srcObject;

        if (stream) {
            const tracks = stream.getTracks();
            tracks.forEach((track) => track.stop());
        }

        setShowCamera(false);
    };

    const { addToast } = useToast();

    const handleSuccessClick = (SuccessMessage) => {
        addToast(SuccessMessage, 'success');
    };


    const handleContinue = async () => {
        setisLoading(true);

        if (!frontImage || !backImagePreview) {
            setErrorMessage("Please capture both front and back images before continuing.");
            setisLoading(false);
        }

        const payload = {
            aadhar_file_front: frontImage,
            aadhar_file_back: backImagePreview,
            aadhar_no: AadharNumber,
            customer_selfie: frontImage,
            blank_cheque_file: frontImage,
        }

        try {
            const res = await creteCustomerKycRequest(payload, customerDetails._id);
            if (res?.data?.status === 200) {
                setisLoading(false);
                handleSuccessClick("KYC Request Submitted Successfully");
            } else {
                setisLoading(false);
                setErrorMessage(res.data.error);
            }
        } catch (error) {
            setErrorMessage("Failed to submit KYC Request");
            setisLoading(false);
        }
    };



    return (
        <>
            <div className="sm:ml-72 relative bg-white h-screen overflow-y-auto">
                <img
                    src={backImage}
                    className="opacity-30 hidden md:block absolute inset-0 object-cover z-0 w-full"
                    alt="Background"
                />

                <div className="relative z-10">
                    <div className="h-[60px] sm:hidden bg-gradient-to-l from-[#020065] to-[#0400CB] flex flex-row justify-between p-4">
                        <div className="flex flex-row">
                            <img
                                src={backButton}
                                onClick={() => navigate(-1)}
                                className="w-8 h-8"
                                alt="Back"
                            />
                            <p className="text-white font-semibold my-1">Upload AADHAR card</p>
                        </div>
                    </div>

                    <div className="flex justify-between">
                        <h1 className="text-start font-bold text-2xl p-4 text-black hidden md:block mt-10">
                            Upload AADHAR card
                        </h1>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
                        <div className="flex flex-col text-start items-start justify-start w-full max-w-md rounded-md">
                            <label className="my-2"><p>Enter Aadhar Number Here</p></label>
                            <TextField
                                onChange={handleAadharChange}
                                label="Aadhar Number"
                                value={AadharNumber}
                                variant="outlined"
                                size="medium"
                                type="number"
                                fullWidth
                                inputProps={{
                                    maxLength: 12,
                                }}
                                InputProps={{
                                    inputProps: {
                                        style: {
                                            MozAppearance: "textfield", // Removes spinner in Firefox
                                        },
                                    },
                                }}
                                onInput={(e) => {
                                    if (e.target.value.length > 12) {
                                        e.target.value = e.target.value.slice(0, 12); // Truncate input to 12 digits
                                    }
                                }}
                                sx={{
                                    "& input[type=number]": {
                                        MozAppearance: "textfield", // Removes spinner in Firefox
                                    },
                                    "& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button": {
                                        WebkitAppearance: "none", // Removes spinner in Chrome, Safari
                                        margin: 0,
                                    },
                                }}

                                InputLabelProps={{
                                    shrink: { AadharNumber }, // Ensures the label stays at the top when value is present
                                }}
                            />

                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-10 p-4 mb-20 md:mb-0 overflow-y-auto ">
                        <div
                            className={`flex flex-col text-center items-center justify-start p-4 border border-2 border-dotted border-gray-300 relative w-full max-w-md rounded-md ${frontImage
                                ? AadharFrontStatus === "Cleared"
                                    ? "bg-[#BBFF99]"
                                    : AadharFrontStatus === "Rejected"
                                        ? "bg-[#FFDA99]"
                                        : "bg-[#F1F1FF]"
                                : ""
                                }`}
                        >
                            {frontImage ? (
                                <div className="w-full h-auto">
                                    <img
                                        src={frontImage}
                                        className="w-full max-h-50 object-contain"
                                        alt="Uploaded Front"
                                    />
                                </div>
                            ) : null}
                            <div className="mt-4 flex flex-row items-center justify-between w-full px-4">
                                <div className="flex flex-col text-start">
                                    <p className="text-sm">Upload</p>
                                    <p className="text-lg font-bold">AADHAR CARD FRONT</p>
                                </div>
                                <div
                                    className="p-2 rounded-2xl cursor-pointer"
                                    {...(frontImage ? { style: { backgroundColor: "#ffffff" } } : { style: { backgroundColor: "#D4D4FF" } })}
                                >
                                    {frontImage ?
                                        (
                                            <img
                                                onClick={() => startCamera()}
                                                src={ResetImage} className="w-10 h-auto" alt="Upload Icon" />
                                        ) : (
                                            <img
                                                onClick={() => startCamera(setFrontImage)}
                                                src={uploadImage} className="w-10 h-auto" alt="Upload Icon" />
                                        )
                                    }
                                </div>
                            </div>
                        </div>

                        <div
                            className={`flex flex-col text-center items-center justify-start p-4 border border-2 border-dotted border-gray-300 relative w-full max-w-md rounded-md ${backImagePreview
                                ? AadharBackStatus === "Cleared"
                                    ? "bg-[#BBFF99]" // Green if AadharStatus is Cleared
                                    : AadharBackStatus === "Rejected"
                                        ? "bg-[#FFDA99]" // Orange if AadharStatus is Rejected
                                        : "bg-[#F1F1FF]" // Default blue color if AadharStatus is neither Cleared nor Rejected
                                : "" // No additional class if backImagePreview is false
                                }`}
                        >
                            {backImagePreview ? (
                                <div className="w-full h-auto">
                                    <img
                                        src={backImagePreview}
                                        className="w-full max-h-50 object-contain"
                                        alt="Uploaded Back"
                                    />
                                </div>
                            ) : null}
                            <div className="mt-4 flex flex-row items-center justify-between w-full px-4">
                                <div className="flex flex-col text-start">
                                    <p className="text-sm">Upload</p>
                                    <p className="text-lg font-bold">AADHAR CARD BACK</p>
                                </div>
                                <div
                                    className="p-2 rounded-2xl cursor-pointer"
                                    // style={{ backgroundColor: "#D4D4FF" }}
                                    {...(backImagePreview ? { style: { backgroundColor: "#ffffff" } } : { style: { backgroundColor: "#D4D4FF" } })}
                                >
                                    {backImagePreview ?
                                        (
                                            <img
                                                onClick={() => startCamera()}
                                                src={ResetImage} className="w-10 h-auto" alt="Upload Icon" />
                                        ) : (
                                            <img
                                                onClick={() => startCamera(setBackImagePreview)}
                                                src={uploadImage} className="w-10 h-auto" alt="Upload Icon" />
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-start mt-6 mx-4 hidden md:block ">
                        <button
                            onClick={handleContinue}
                            className="w-1/4 p-3  flex justify-center rounded-full text-white bg-gradient-to-l from-[#020065] to-[#0400CB]"
                        >
                            {isLoading ? (
                                <svg
                                    aria-hidden="true"
                                    className="w-5 h-5 text-gray-200 flex justify-center animate-spin dark:text-gray-600 fill-blue-600"
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
                                "Save & Continue"
                            )}
                        </button>
                    </div>
                    <div className="text-start px-5 py-3 hidden md:block">
                        {ErrorMessage && (
                            <span style={{ fontSize: '14px' }} className="text-red-400 text-xs text-start">
                                {ErrorMessage}
                            </span>
                        )}
                    </div>
                </div>

            </div>

            <div>
                <div className="fixed z-10 bottom-0 left-0 w-full sm:hidden bg-white shadow-lg bg-white">
                    <div className="absolute bottom-0 left-0 w-full flex flex-col items-start p-4">
                        <div className="w-full mt-4">
                            <button
                                onClick={handleContinue}
                                type="submit"
                                className="w-full p-3 px-24 flex justify-center rounded-full text-white bg-gradient-to-l from-[#020065] to-[#0400CB]"
                            >
                                {isLoading ? (
                                    <svg
                                        aria-hidden="true"
                                        className="w-5 h-5 text-gray-200 flex justify-center animate-spin dark:text-gray-600 fill-blue-600"
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
                                    "Save & Continue"
                                )}
                            </button>
                        </div>
                        <div className="text-start">
                            {ErrorMessage && (
                                <span style={{ fontSize: '14px' }} className="text-red-400 text-xs text-start">
                                    {ErrorMessage}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {showCamera && (
                <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
                    {/* Camera feed */}
                    <video ref={videoRef} className="w-full md:w-1/2 rounded-md relative" autoPlay playsInline />
                    <canvas ref={canvasRef} className="hidden" />

                    {/* Faded background overlay with clear scanner area */}
                    <div className="absolute ">
                        {/* Full-screen overlay */}
                        <div className="absolute inset-0 bg-black"></div>

                        {/* Scanner rectangle */}
                        <div
                            className="absolute"
                            style={{
                                top: "50%",
                                left: "50%",
                                width: "300px", // Scanner size width
                                height: "190px", // Scanner size height
                                transform: "translate(-50%, -50%)",
                                boxShadow: "0 0 0 2000px rgba(0, 0, 0, 0.6)", // Fades the rest of the screen
                                zIndex: 2, // Ensures scanner area is visible
                            }}
                        >
                            {/* Corners */}
                            {/* Top-left corner */}
                            <div
                                className="absolute top-0 left-0 border-t-4 border-l-4 border-green-500"
                                style={{
                                    width: "30px",
                                    height: "30px",
                                }}
                            ></div>

                            {/* Top-right corner */}
                            <div
                                className="absolute top-0 right-0 border-t-4 border-r-4 border-green-500"
                                style={{
                                    width: "30px",
                                    height: "30px",
                                }}
                            ></div>

                            {/* Bottom-left corner */}
                            <div
                                className="absolute bottom-0 left-0 border-b-4 border-l-4 border-green-500"
                                style={{
                                    width: "30px",
                                    height: "30px",
                                }}
                            ></div>

                            {/* Bottom-right corner */}
                            <div
                                className="absolute bottom-0 right-0 border-b-4 border-r-4 border-green-500"
                                style={{
                                    width: "30px",
                                    height: "30px",
                                }}
                            ></div>
                        </div>
                    </div>

                    {/* Capture and Cancel buttons */}
                    <div className="absolute bottom-10 flex gap-4 z-10">
                        <button
                            onClick={capturePhoto}
                            className="px-6 py-2 bg-blue-500 text-white font-bold rounded-lg"
                        >
                            Capture
                        </button>
                        <button
                            onClick={stopCamera}
                            className="px-6 py-2 bg-red-500 text-white font-bold rounded-lg"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}


        </>
    );
};

export default AadharUpload;

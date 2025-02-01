import { axiosInstance } from "../../axiosInstance/AxiosConfig/page";


const addBankDetails = async (payload) => {
    try {
        const res = await axiosInstance.post(`customer/add-bank-account-details`, payload);
        const data = res.data;
        return { data };
    } catch (err) {
        const errRes = (err && err.response) || "Network Error";
        return { ...errRes };
    }
};


const updateBankDetails = async (payload) => {
    try {
        const res = await axiosInstance.put(`customer/update-bank-account-details`, payload);
        const data = res.data;
        return { data };
    } catch (err) {
        const errRes = (err && err.response) || "Network Error";
        return { ...errRes };
    }
};


const sendOtpForUpdate = async () => {
    try {
        const res = await axiosInstance.get(`customer/update-bank-account-otp`);
        const data = res.data;
        return { data };
    } catch (err) {
        const errRes = (err && err.response) || "Network Error";
        return { ...errRes };
    }
};


export { addBankDetails, sendOtpForUpdate, updateBankDetails };

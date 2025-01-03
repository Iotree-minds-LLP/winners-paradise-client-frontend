import { axiosInstance, axiosInstanceWithoutToken } from "../../axiosInstance/AxiosConfig/page";


const getAllPayouts = async (id) => {
    try {
        const res = await axiosInstanceWithoutToken.get(`payouts/list-my-payouts/${id}`);
        const data = res;
        return { data };
    } catch (err) {
        const errRes = (err && err.response) || "Network Error";
        return { ...errRes };
    }
};

const getAllOverAllPayouts = async (id) => {
    try {
        const res = await axiosInstanceWithoutToken.get(`payouts/list-my-payouts`);
        const data = res;
        return { data };
    } catch (err) {
        const errRes = (err && err.response) || "Network Error";
        return { ...errRes };
    }
};

const getAllReferralPayouts = async (id) => {
    try {
        const res = await axiosInstanceWithoutToken.get(`payouts/list-referral-payouts/${id}`);
        const data = res;
        return { data };
    } catch (err) {
        const errRes = (err && err.response) || "Network Error";
        return { ...errRes };
    }
};


export { getAllPayouts, getAllReferralPayouts, getAllOverAllPayouts };

import axios from "axios";
import { axiosInstance, axiosInstanceWithoutToken } from "../../axiosInstance/AxiosConfig/page";


const creteCustomerKycRequest = async (payload, id) => {

    try {
        const res = await axiosInstance.post(`kyc/create-kyc-request`, payload);
        const data = res;
        return { data };
    } catch (err) {
        const errRes = (err && err.response) || "Network Error";
        return { ...errRes };
    }
};

const getKycDetailsByCustomerId = async (id) => {

    try {
        const res = await axiosInstance.get(`kyc/get-my-kyc-details`);
        const data = res;
        return { data };
    } catch (err) {
        const errRes = (err && err.response) || "Network Error";
        return { ...errRes };
    }
};

export { creteCustomerKycRequest, getKycDetailsByCustomerId };

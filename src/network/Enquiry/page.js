import axios from "axios";
import { axiosInstance, axiosInstanceWithoutToken } from "../../axiosInstance/AxiosConfig/page";


const createEnquiry = async (payload, id) => {
    try {
        const res = await axiosInstance.post(`customer/create-enquiry`, payload);
        const data = res;
        return { data };
    } catch (err) {
        const errRes = (err && err.response) || "Network Error";
        return { ...errRes };
    }
};

export { createEnquiry };

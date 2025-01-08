import axios from "axios";
import { axiosInstance, axiosInstanceWithoutToken } from "../../axiosInstance/AxiosConfig/page";


const createCustomer = async (payload) => {
    try {
        const res = await axiosInstance.post("customer/create", payload);
        const data = res;
        return { data };
    } catch (err) {
        const errRes = (err && err.response) || "Network Error";
        return { ...errRes };
    }
};


const getCustomerById = async (id) => {
    try {
        const res = await axiosInstance.post(`customer/get-my-account-details`);
        const data = res;
        return { data };
    } catch (err) {
        const errRes = (err && err.response) || "Network Error";
        return { ...errRes };
    }
};


const updatecustomer = async (payload) => {
    try {
        const res = await axiosInstance.put(`customer/edit`, payload);
        const data = res;
        return { data };
    } catch (err) {
        const errRes = (err && err.response) || "Network Error";
        return { ...errRes };
    }
};


export { getCustomerById, updatecustomer, createCustomer };

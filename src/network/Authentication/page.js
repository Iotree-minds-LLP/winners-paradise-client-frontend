import axios from "axios";
import { axiosInstance } from "../../axiosInstance/AxiosConfig/page";

const getpermissions = async (payload) => {
    try {
        const res = await axiosInstance.get("/authentication/get-my-permission");
        const data = res;
        return { data };
    } catch (err) {
        const errRes = (err && err.response) || "Network Error";
        return { ...errRes };
    }
};


const login = async (payload) => {
    try {
        const res = await axios.post("/authentication/login", payload);
        const data = res;
        return { data };
    } catch (err) {
        const errRes = (err && err.response) || "Network Error";
        return { ...errRes };
    }
};

const ResetPassword = async (payload) => {
    try {
        const res = await axios.put("/password-reset/change-my-account-password", payload);
        const data = res;
        return { data };
    } catch (err) {
        const errRes = (err && err.response) || "Network Error";
        return { ...errRes };
    }
};


export { getpermissions, login, ResetPassword };

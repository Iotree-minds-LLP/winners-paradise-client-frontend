import { axiosInstance } from "../../axiosInstance/AxiosConfig/page";

const saveTokenForFcm = async (payload) => {
    try {
        const res = await axiosInstance.post(`fcm-notification/save-token`, payload);
        const data = res;
        return { data };
    } catch (err) {
        const errRes = (err && err.response) || "Network Error";
        return { ...errRes };
    }
};

const LogoutUser = async () => {
    try {
        const res = await axiosInstance.post("user-auth/logout");
        const data = res;
        return { data };
    } catch (err) {
        const errRes = (err && err.response) || "Network Error";
        return { ...errRes };
    }
};

export { saveTokenForFcm, LogoutUser };

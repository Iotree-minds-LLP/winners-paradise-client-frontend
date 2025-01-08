import axios from "axios";
import { axiosInstance, axiosInstanceWithoutToken } from "../../axiosInstance/AxiosConfig/page";


const getCustomersNotifications = async (id) => {
    try {
        const res = await axiosInstance.get(`notifications/list-notifications`);
        const data = res;
        return { data };
    } catch (err) {
        const errRes = (err && err.response) || "Network Error";
        return { ...errRes };
    }
};


export { getCustomersNotifications };

import { axiosInstance, axiosInstanceWithoutToken } from "../../axiosInstance/AxiosConfig/page";

const getAllInvestments = async () => {
    try {
        const res = await axiosInstance.get(`investments/list-my-investments`);
        const data = res;
        return { data };
    } catch (err) {
        const errRes = (err && err.response) || "Network Error";
        return { ...errRes };
    }
};

export { getAllInvestments };

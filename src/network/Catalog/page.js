import axios from "axios";
import { axiosInstance, axiosInstanceWithoutToken } from "../../axiosInstance/AxiosConfig/page";


const getAllCatalogByCustomerId = async () => {
    try {
        const res = await axiosInstanceWithoutToken.post(`catalogs/list/`);
        const data = res.data;
        return { data };
    } catch (err) {
        const errRes = (err && err.response) || "Network Error";
        return { ...errRes };
    }
};


const getAllCatalogByReturnCalculator = async (payload) => {
    try {
        const res = await axiosInstanceWithoutToken.post(`catalogs/get-all-catalog-returns`, payload);
        const data = res.data;
        return { data };
    } catch (err) {
        const errRes = (err && err.response) || "Network Error";
        return { ...errRes };
    }
};

export { getAllCatalogByCustomerId, getAllCatalogByReturnCalculator };

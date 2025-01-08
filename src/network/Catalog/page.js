import axios from "axios";
import { axiosInstance } from "../../axiosInstance/AxiosConfig/page";


const getAllCatalog = async () => {
    try {
        const res = await axiosInstance.post(`catalogs/list`);
        const data = res.data;
        return { data };
    } catch (err) {
        const errRes = (err && err.response) || "Network Error";
        return { ...errRes };
    }
};


const getAllCatalogByReturnCalculator = async (payload) => {
    try {
        const res = await axiosInstance.post(`catalogs/get-all-catalog-returns`, payload);
        const data = res.data;
        return { data };
    } catch (err) {
        const errRes = (err && err.response) || "Network Error";
        return { ...errRes };
    }
};

export { getAllCatalog, getAllCatalogByReturnCalculator };

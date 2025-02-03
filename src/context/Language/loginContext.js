import React, { createContext, useContext, useEffect, useState } from 'react';
import { getCustomerById } from '../../network/Customer/page';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {

    const [language, setLanguage] = useState(localStorage.getItem('language') || 'english');

    useEffect(() => {
        const data = localStorage.getItem("customerDetails");
        const customer = JSON.parse(data);
        if (customer) {
            onformSubmit2(customer._id);
        }
    }, []);

    const onformSubmit2 = async (id) => {
        const resp = await getCustomerById(id);
        if (resp.data.status === 200) {
            const formattedLanguage = resp.data.data.customer.language_preference;
            setLanguage(formattedLanguage);
        }
    };


    return (
        <LanguageContext.Provider value={{ language, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);

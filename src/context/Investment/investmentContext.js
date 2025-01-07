import React, { createContext, useContext, useState } from 'react';

const InvestmentContext = createContext();

export const InvestmentProvider = ({ children }) => {

    const [isInvestmentCreated, setIsInvestmentCreated] = useState(false);

    return (
        <InvestmentContext.Provider value={{ isInvestmentCreated, setIsInvestmentCreated }}>
            {children}
        </InvestmentContext.Provider>
    );
};

export const useInvestment = () => useContext(InvestmentContext);

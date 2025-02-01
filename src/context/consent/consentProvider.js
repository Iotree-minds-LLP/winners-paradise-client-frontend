import React, { createContext, useContext, useEffect, useState } from 'react';

const ConsentContext = createContext();

export const ConsentProvider = ({ children }) => {
    const [isConsentAgreed, setIsConsentAgreed] = useState(false);
    useEffect(() => {
        console.log(isConsentAgreed)
    }, [])
    return (
        <ConsentContext.Provider value={{ isConsentAgreed, setIsConsentAgreed }}>
            {children}
        </ConsentContext.Provider>
    );
};

export const useConsent = () => useContext(ConsentContext);

import React, { createContext, useContext, useState } from 'react';

const ConsentContext = createContext();

export const ConsentProvider = ({ children }) => {
    const [isConsentAgreed, setIsConsentAgreed] = useState(false);

    return (
        <ConsentContext.Provider value={{ isConsentAgreed, setIsConsentAgreed }}>
            {children}
        </ConsentContext.Provider>
    );
};

export const useConsent = () => useContext(ConsentContext);

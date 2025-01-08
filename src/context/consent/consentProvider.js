import React, { createContext, useContext, useState } from 'react';

// Create the context
const ConsentContext = createContext();

// Create the provider component
export const ConsentProvider = ({ children }) => {
    const [isConsentAgreed, setIsConsentAgreed] = useState(false);

    return (
        <ConsentContext.Provider value={{ isConsentAgreed, setIsConsentAgreed }}>
            {children}
        </ConsentContext.Provider>
    );
};

// Custom hook to use the context
export const useConsent = () => useContext(ConsentContext);

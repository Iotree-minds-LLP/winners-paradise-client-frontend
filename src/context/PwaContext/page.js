import React, { createContext, useState, useEffect } from 'react';

export const PwaContext = createContext();

export const PwaProvider = ({ children }) => {
    
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isInstalled, setIsInstalled] = useState(false);

    const handleInstallClick = () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the A2HS prompt');
                } else {
                    console.log('User dismissed the A2HS prompt');
                }
            });
        }
    };

    useEffect(() => {
        const handleBeforeInstallPrompt = (event) => {
            console.log("Before install prompt event fired");
            event.preventDefault();
            setDeferredPrompt(event);
        };

        const checkIfInstalled = () => {
            setIsInstalled(window.matchMedia('(display-mode: standalone)').matches);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        window.addEventListener('appinstalled', () => {
            console.log('PWA was installed');
            setIsInstalled(true);
        });

        checkIfInstalled();

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    return (
        <PwaContext.Provider value={{ deferredPrompt, setDeferredPrompt, isInstalled, setIsInstalled, handleInstallClick }}>
            {children}
        </PwaContext.Provider>
    );
};

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ToastProvider } from './context/Toast/toastProvider';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { PwaProvider } from './context/PwaContext/page';
import { LanguageProvider } from './context/Language/loginContext';
import { InvestmentProvider } from './context/Investment/investmentContext';
import { ConsentProvider } from './context/consent/consentProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <ConsentProvider>
      <InvestmentProvider>
        <PwaProvider>
          <ToastProvider>
            <LanguageProvider>
              <App></App>
            </LanguageProvider>
          </ToastProvider>
        </PwaProvider>
      </InvestmentProvider>
    </ConsentProvider>
  </React.StrictMode>
);

serviceWorkerRegistration.register();

reportWebVitals();

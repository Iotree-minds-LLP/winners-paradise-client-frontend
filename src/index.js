import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ToastProvider } from './context/Toast/toastProvider';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { PwaProvider } from './context/PwaContext/page';
import { LanguageProvider } from './context/Language/loginContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <PwaProvider>
      <ToastProvider>
        <LanguageProvider>
          <App></App>
        </LanguageProvider>
      </ToastProvider>
    </PwaProvider>
  </React.StrictMode>
);


serviceWorkerRegistration.register();

reportWebVitals();

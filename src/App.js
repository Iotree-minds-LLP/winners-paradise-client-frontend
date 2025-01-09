import React, { useEffect } from 'react';
import RouterPage from "./routes/page";
import './index.css';
import { generateToken, messaging } from './firebase';
import { onMessage } from "firebase/messaging"
const App = () => {


  useEffect(() => {
    generateToken();
    onMessage(messaging, (payload) => {
      console.log(payload, "Paylouad is there")
    });
  }, [])

  return (
    <div>
      <RouterPage />
    </div>
  );
};

export default App;

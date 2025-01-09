import React, { useEffect, useState } from 'react';
import RouterPage from "./routes/page";
import './index.css';
import { generateToken, messaging } from './firebase';
import { onMessage } from "firebase/messaging"
const App = () => {
  const [token, settoken] = useState()

  useEffect(() => {
    const generateTokenFromFcm = async () => {
      const res = await generateToken();
      settoken(res);
    }
    onMessage(messaging, (payload) => {
      console.log(payload, "Paylouad is there")
    });

    generateTokenFromFcm();

  }, [])

  return (
    <div>
      <p>{token}</p>
      <RouterPage />
    </div>
  );
};

export default App;

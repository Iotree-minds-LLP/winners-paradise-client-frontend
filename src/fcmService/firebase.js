import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
console.log("Initializing Firebase...");
const app = initializeApp(firebaseConfig);
console.log("Firebase Initialized.");

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Messaging
export const messaging = getMessaging(app);
// Function to request notification permissions and get token
export const requestNotificationPermission = async () => {
    try {
        console.log("Requesting Notification Permission...");
        const token = await getToken(messaging, { vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY });
        if (!token) {
            console.log("Token Not Generated")
        }
        console.log("FCM Token retrieved successfully:", token);
        return token; // Return the token for further use
    } catch (error) {
        console.error("Error while retrieving FCM Token:", error.message);
        return null;
    }
};

export const setupOnMessageListener = () => {
    onMessage(messaging, (payload) => {
        console.log("Foreground Message received:", payload);
    });
};

requestNotificationPermission()


export default app;

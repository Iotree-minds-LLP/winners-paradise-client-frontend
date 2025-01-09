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

console.log(process.env.REACT_APP_FIREBASE_API_KEY, " process.env.REACT_APP_FIREBASE_API_KEY")

// Initialize Firebase
console.log("Initializing Firebase...");
const app = initializeApp(firebaseConfig);
console.log("Firebase Initialized.");

// Initialize Firestore
console.log("Initializing Firestore...");
export const db = getFirestore(app);
console.log("Firestore Initialized.");

// Initialize Messaging
console.log("Initializing Messaging...");
export const messaging = getMessaging(app);
console.log("Messaging Initialized.");

// Function to request notification permissions and get token
export const requestNotificationPermission = async () => {
    console.log("Requesting Notification Permission...");
    try {
        console.log(process.env.REACT_APP_FIREBASE_VAPID_KEY, "process.env.REACT_APP_FIREBASE_VAPID_KEY ")
        const token = await getToken(messaging, { vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY });
        console.log(token, "Token")
        if (token) {
            console.log("FCM Token retrieved successfully:", token);
            // Save the token to your database or use it as needed
        } else {
            console.warn("No registration token available. Request permission to generate one.");
        }
    } catch (error) {
        console.error("Error while retrieving FCM Token:", error);
    }
};

// Listener for incoming messages
export const setupOnMessageListener = () => {
    console.log("Setting up onMessage listener for foreground messages...");
    onMessage(messaging, (payload) => {
        console.log("Foreground Message received:", payload);
        // Handle foreground messages (e.g., show notifications or update the UI)
    });
    console.log("onMessage listener is set.");
};

export default app;

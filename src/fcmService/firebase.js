import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
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

console.log("Initializing Firebase...");
const app = initializeApp(firebaseConfig);
console.log(app, "Firebase Initialized.");

export const db = getFirestore(app);
export const messaging = getMessaging(app);
export const requestNotificationPermission = async () => {
    try {
        console.log("Checking Notification Permission...");

        // Check the notification permission
        if (Notification.permission === "granted") {
            console.log("Notification permission already granted. Proceeding to generate FCM token...");
        } else if (Notification.permission === "default") {
            console.log("Requesting notification permission from the user...");
            const permission = await Notification.requestPermission();

            if (permission !== "granted") {
                console.log("Notification permission was not granted. Exiting.");
                return null; // Exit if permission is not granted
            }

            console.log("Notification permission granted.");
        } else {
            console.log("Notification permission is denied. Exiting.");
            return null; // Exit if permission is denied
        }



        if ("serviceWorker" in navigator) {
            navigator.serviceWorker
                .register("/firebase-messaging-sw.js")
                .then((registration) => {
                    console.log("Service Worker registered successfully:", registration);

                    // Pass the service worker registration when generating the token
                    getToken(messaging, {
                        vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY,
                        serviceWorkerRegistration: registration,
                    })
                        .then((currentToken) => {
                            if (currentToken) {
                                console.log("FCM Token retrieved successfully:", currentToken);
                            } else {
                                console.log("No registration token available. Request permission to generate one.");
                            }
                        })
                        .catch((err) => {
                            console.error("An error occurred while retrieving the token. ", err);
                        });
                })
                .catch((error) => {
                    console.error("Service Worker registration failed:", error);
                });
        }
        // Generate the FCM token only if permission is granted
        const token = await getToken(messaging, { vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY });

        if (!token) {
            console.log("Token not generated.");
            return null;
        }

        console.log("FCM Token retrieved successfully:", token);

        // Add FCM token to Firestore
        const userId = "user-id-placeholder"; // Replace with actual user ID
        const userDoc = doc(db, "users", userId);

        await setDoc(userDoc, {
            fcmToken: token,
            timestamp: new Date().toISOString(),
        });

        console.log("User added to Firestore with FCM token.");

        return token;
    } catch (error) {
        console.error("Error while retrieving FCM Token:", error.message);
        return null;
    }
};

// Listener for incoming messages
export const setupOnMessageListener = () => {
    onMessage(messaging, (payload) => {
        console.log("Foreground Message received:", payload);
    });
};


export default app;

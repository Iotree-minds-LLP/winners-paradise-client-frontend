import { doc, setDoc } from "firebase/firestore";
import { messaging, db } from "./firebase";
import { getToken } from "firebase/messaging";

async function saveUserToFirestore(userId, userName) {
    try {
        const token = await getToken(messaging, { vapidKey: "BM6Wo9mPbYEwJSOAqxgO7LQcutVX5meCDLtyr7qVZpvKvGVCYFhMbeEs5WMIsyTicBCCbRUP61Vs_ybIuJejA_Q" });

        if (token) {
            await setDoc(doc(db, "users", userId), {
                name: userName,
                fcmToken: token,
                createdAt: new Date().toISOString(),
            });

            console.log("User and FCM Token saved successfully.");
        } else {
            console.log("Failed to get FCM Token.");
        }
    } catch (error) {
        console.error("Error saving user to Firestore:", error);
    }
}

export default saveUserToFirestore;

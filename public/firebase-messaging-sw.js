importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging.js');

const firebaseConfig = {
    apiKey: "AIzaSyDu8ETEDG_HwGlSOn5vovuZ1StiZPKc83k",
    authDomain: "matchmakers-c4ddc.firebaseapp.com",
    projectId: "matchmakers-c4ddc",
    storageBucket: "matchmakers-c4ddc.firebasestorage.app",
    messagingSenderId: "1044662746666",
    appId: "1:1044662746666:web:5022cd4265654f26d60d53",
    measurementId: "G-EPC1T8G31J",
};

console.log("Helli I am in public")

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage(function (payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/logo192.png',
    };

    self.addEventListener('error', (event) => {
        console.error('Service Worker Error:', event.message);
    });

    return self.registration.showNotification(notificationTitle, notificationOptions);
});
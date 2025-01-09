
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');


firebase.initializeApp({
    apiKey: "AIzaSyDu8ETEDG_HwGlSOn5vovuZ1StiZPKc83k",
    authDomain: "matchmakers-c4ddc.firebaseapp.com",
    projectId: "matchmakers-c4ddc",
    storageBucket: "matchmakers-c4ddc.firebasestorage.app",
    messagingSenderId: "1044662746666",
    appId: "1:1044662746666:web:5022cd4265654f26d60d53",
    measurementId: "G-EPC1T8G31J"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message:', payload);

    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
    };
    self.registration.showNotification(notificationTitle, notificationOptions);
});

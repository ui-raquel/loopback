// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCB4W69BnQZVOTKVgNSgsNBIWRfshnatFI",
  authDomain: "loopback-e1fb6.firebaseapp.com",
  projectId: "loopback-e1fb6",
  storageBucket: "loopback-e1fb6.firebasestorage.app",
  messagingSenderId: "830753962688",
  appId: "1:830753962688:web:54ff7f2cbf49689aac8b25",
  measurementId: "G-N3ZDMRZE42"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
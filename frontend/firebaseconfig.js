// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC7JQVSI1AlXuLD_k1FwPAkeic3E7kq9Yk",
  authDomain: "sunianphotos.firebaseapp.com",
  projectId: "sunianphotos",
  storageBucket: "sunianphotos.firebasestorage.app",
  messagingSenderId: "71111238514",
  appId: "1:71111238514:web:566a5c01642fa7241a33eb",
  measurementId: "G-EEQ1KPN2VK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
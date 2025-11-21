// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDNzRwag19IFuEYKTscFXb0VrJ92Tt1ums",
  authDomain: "medium-a3a20.firebaseapp.com",
  projectId: "medium-a3a20",
  storageBucket: "medium-a3a20.firebasestorage.app",
  messagingSenderId: "566724851214",
  appId: "1:566724851214:web:b32fd952ea82779de26e5f",
  measurementId: "G-0Z71JJWE3M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
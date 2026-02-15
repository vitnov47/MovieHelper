import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC2bDPH5Y24HyIoNmQrH9-DE9DNJql7MwA",
  authDomain: "moviehelper-36c09.firebaseapp.com",
  projectId: "moviehelper-36c09",
  storageBucket: "moviehelper-36c09.firebasestorage.app",
  messagingSenderId: "614746008225",
  appId: "1:614746008225:web:d3cef4abfd236382ad5ee0",
  measurementId: "G-3QPHLC4Q2V",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

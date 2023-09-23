// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCYk36PmpwPNkJ6mJuzQcMwZTjuoUAEKXs",
  authDomain: "rct-portfolio.firebaseapp.com",
  projectId: "rct-portfolio",
  storageBucket: "rct-portfolio.appspot.com",
  messagingSenderId: "476093204548",
  appId: "1:476093204548:web:5884c314a85907f49bd411"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

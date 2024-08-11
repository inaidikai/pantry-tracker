// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBT5DNN0e51dpo8esn6YLlhmrYBW40HnyA",
  authDomain: "pantry-1c138.firebaseapp.com",
  projectId: "pantry-1c138",
  storageBucket: "pantry-1c138.appspot.com",
  messagingSenderId: "72221638810",
  appId: "1:72221638810:web:59d6d1fff6bc3db33e1f23",
  measurementId: "G-YKDLTZFWY5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore };

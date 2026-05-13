import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAW9QIdBX8AeGLWz4C8fYqLtuIZQ-kWW5g",
  authDomain: "gen-lang-client-0525081373.firebaseapp.com",
  projectId: "gen-lang-client-0525081373",
  storageBucket: "gen-lang-client-0525081373.firebasestorage.app",
  messagingSenderId: "803864550820",
  appId: "1:803864550820:web:22c223eca907e15d0ef531"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
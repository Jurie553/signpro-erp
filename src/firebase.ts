import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDu5Z3UOm1bUgS45qMaZyYZHiQwmQq0V6U",
  authDomain: "xtreme-production-490518.firebaseapp.com",
  projectId: "xtreme-production-490518",
  storageBucket: "xtreme-production-490518.firebasestorage.app",
  messagingSenderId: "315500701382",
  appId: "1:315500701382:web:fa65d54ae49cef06e219c7"
};

const app = initializeApp(firebaseConfig);

// ✅ ADD THIS
export const auth = getAuth(app);

export default app;
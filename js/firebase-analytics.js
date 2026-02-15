// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDjDE3_2z-t1n3Wiqj3lQT9rnYMsuZxBmg",
  authDomain: "impucalculo-analytics-2026.firebaseapp.com",
  projectId: "impucalculo-analytics-2026",
  storageBucket: "impucalculo-analytics-2026.firebasestorage.app",
  messagingSenderId: "683013434858",
  appId: "1:683013434858:web:ec7cfbb2c930ac1f4f1693"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

console.log("Firebase Analytics Initialized for Impucálculo");

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDEp9BLnroBBvxx5XpSJzjn0iWPEl43s-Q",
  authDomain: "impucalculo-rd.firebaseapp.com",
  projectId: "impucalculo-rd",
  storageBucket: "impucalculo-rd.firebasestorage.app",
  messagingSenderId: "222433319439",
  appId: "1:222433319439:web:d72352ea017ce5cf9ee17a",
  measurementId: "G-0C71EYB36J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

console.log("Firebase Analytics Initialized for Impucálculo");

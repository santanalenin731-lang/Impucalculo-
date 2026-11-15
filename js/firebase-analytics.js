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

// Google Consent Mode v2 regional default (strict pre-consent for EEA/UK/CH; DO measures normally)
if (!window.__consentDefaultSet) {
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () {
    window.dataLayer.push(arguments);
  };
  window.__consentDefaultSet = true;
  window.gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    region: ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'IS', 'LI', 'NO', 'GB', 'CH'],
    wait_for_update: 500
  });
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

console.log("Firebase Analytics Initialized for Impucálculo");

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBesB4O_qkRTymdKZMKCfUDj1lSiqKzLuU",
  authDomain: "gcet-confessions-b4a31.firebaseapp.com",
  projectId: "gcet-confessions-b4a31",
  storageBucket: "gcet-confessions-b4a31.firebasestorage.app",
  messagingSenderId: "396435609693",
  appId: "1:396435609693:web:8b2e43ffbcc28ae19a55b4",
  measurementId: "G-YJS0ENZHLE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Trust quotes array
const trustQuotes = [
  "Trust is the glue of life. It's the most essential ingredient in effective communication.",
  "Trust is built with consistency.",
  "Trust is the foundation of any relationship.",
  "Without trust, there can be no genuine connection."
];

// Declare userLocation globally
let userLocation = {};

// Function to fetch location using Geolocation API
function getGeolocation() {
  return new Promise((resolve, reject) => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          userLocation = {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
            source: "HTML5 Geolocation"
          };
          console.log("Geolocation success:", userLocation);
          resolve(userLocation);
        },
        (error) => {
          console.warn("Geolocation denied or failed:", error);
          reject(error);
        }
      );
    } else {
      reject("Geolocation not supported");
    }
  });
}

// Function to fetch location using IP-based API (Fallback)
function getIPLocation() {
  return fetch("https://ipinfo.io/json?token=6af38cddcbc187")
    .then(response => response.json())
    .then(data => {
      userLocation = {
        ip: data.ip,
        city: data.city,
        region: data.region,
        country: data.country,
        loc: data.loc, // Contains "lat,lon"
        source: "IP-based"
      };
      console.log("IP-based location fetched:", userLocation);
    })
    .catch(error => console.error("Error fetching IP-based location:", error));
}

// First try Geolocation, if denied, use IP-based
getGeolocation().catch(() => getIPLocation());

// Display random trust quote
const quoteElement = document.getElementById('trust-quote');
quoteElement.textContent = trustQuotes[Math.floor(Math.random() * trustQuotes.length)];

// Handle confession submission
const confessionForm = document.getElementById('confession-form');
confessionForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  // Get form values
  const name = document.getElementById('name').value;
  const branch = document.getElementById('branch').value;
  const confession = document.getElementById('confession-box').value;

  try {
    // Save confession to Firestore
    await addDoc(collection(db, 'confessions'), {
      name: name || "Anonymous",
      branch: branch || "Not specified",
      text: confession,
      location: userLocation,
      timestamp: serverTimestamp()
    });

    alert('Confession submitted successfully!');
    confessionForm.reset(); // Clear the form
  } catch (error) {
    console.error('Error submitting confession:', error);
  }
});

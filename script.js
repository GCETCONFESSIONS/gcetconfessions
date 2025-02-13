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

let userLocation = {};
navigator.geolocation.getCurrentPosition((position) => {
    userlocation={
      lat:position.coords.latitude, 
      long:position.coords.longitude
});
const quoteElement = document.getElementById('trust-quote');
quoteElement.textContent = trustQuotes[Math.floor(Math.random() * trustQuotes.length)];
const confessionForm = document.getElementById('confession-form');
confessionForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  
  const name = document.getElementById('name').value;
  const branch = document.getElementById('branch').value;
  const confession = document.getElementById('confession-box').value;

  try {
    
    await addDoc(collection(db, 'confessions'), {
      name: name || "Anonymous", 
      branch: branch || "Not specified", 
      text: confession,
      location: userLocation, 
      timestamp: serverTimestamp()
    });

    alert('Confession submitted successfully!');
    confessionForm.reset(); 
  } catch (error) {
    console.error('Error submitting confession:', error);
  }
});

// firebase-config.js
console.log('Loading Firebase configuration...');

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyAkQ6JjzCpMDNNd9q8bFo9CS-gTROYczCA",
  authDomain: "confidence-rl-xp-final.firebaseapp.com",
  projectId: "confidence-rl-xp-final",
  storageBucket: "confidence-rl-xp-final.firebasestorage.app",
  messagingSenderId: "597255080162",
  appId: "1:597255080162:web:902d8247656b117d2d76bb"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log('✅ Firebase initialized successfully');

// Fonction pour sauvegarder des données dans Firestore
export async function sendToFirebase(collectionName, data) {
    try {
        const { collection, addDoc, serverTimestamp } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js');
        
        const docRef = await addDoc(collection(db, collectionName), {
            ...data,
            timestamp: serverTimestamp()
        });
        
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error('Firebase write error:', error);
        return { success: false, error: error.message };
    }
}

export { db, firebaseConfig, sendToFirebase };

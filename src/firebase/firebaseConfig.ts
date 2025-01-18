// src/firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth'; // Import other services if needed
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBVHJA-D5lwj9AF8DhtQPeZYKbTCmxEwQg",
  authDomain: "test-ab11e.firebaseapp.com",
  projectId: "test-ab11e",
  storageBucket: "test-ab11e.appspot.com",
  messagingSenderId: "705987734114",
  appId: "1:705987734114:web:2e4b921259420c6dc0ff3b",
  measurementId: "G-59QR2ZPK8K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the Firebase services you want to use
export const auth = getAuth(app);
export const storage = getStorage(app);
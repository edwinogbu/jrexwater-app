import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from "firebase/database";
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage'; // Import getStorage


const firebaseConfig = {
  apiKey: "AIzaSyBsSC7WP0qNvxuGYJdwQSn8v_Ciw1wamYY",
  authDomain: "jrexwater-2ffc1.firebaseapp.com",
  projectId: "jrexwater-2ffc1",
  storageBucket: "jrexwater-2ffc1.appspot.com",
  messagingSenderId: "123726894567",
  appId: "1:123726894567:web:aad995c8084e8051c6d942",
  measurementId: "G-4XQ4SV2NNE",

  databaseURL: "https://jrexwater-2ffc1-default-rtdb.firebaseio.com/",

};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase


// Initialize other Firebase services
const database = getDatabase(app);
const db = getFirestore(app);
const firestore = getFirestore(app);
const auth = getAuth(app);

// Initialize Firebase Storage
const storage = getStorage(app);

export {analytics, app, db, database, auth, firestore, storage }; // Include storage in exports



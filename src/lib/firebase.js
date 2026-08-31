import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB8ntZl824kWnH-Xtq9ZHDbQvMqPNGtXDc",
  authDomain: "dorek-international-3ef93.firebaseapp.com",
  projectId: "dorek-international-3ef93",
  storageBucket: "dorek-international-3ef93.firebasestorage.app",
  messagingSenderId: "911540014",
  appId: "1:911540014:web:1a4fed269836252e9944bf",
  measurementId: "G-41GTSBZP9Q"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { app, db };

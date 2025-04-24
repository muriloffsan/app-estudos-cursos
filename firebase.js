// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; 
import { getFirestore } from "firebase/firestore"; 
export const firebaseConfig = {
  apiKey: "AIzaSyCQYJggbFLTg6eUvGRDFO3jcn0rqsb8g2o", 
  authDomain: "app-estudos-cursos.firebaseapp.com",
  projectId: "app-estudos-cursos",
  storageBucket: "app-estudos-cursos.appspot.com", 
  messagingSenderId: "994781637010",
  appId: "1:994781637010:web:4261d5252694747c16f94b",
  measurementId: "G-K4C7NZHZ62" 
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app); 



export { app, auth, db }; 

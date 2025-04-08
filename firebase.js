// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyCQYJggbFLTg6eUvGRDFO3jcn0rqsb8g2o",
  authDomain: "app-estudos-cursos.firebaseapp.com",
  projectId: "app-estudos-cursos",
  storageBucket: "app-estudos-cursos.firebasestorage.app",
  messagingSenderId: "994781637010",
  appId: "1:994781637010:web:4261d5252694747c16f94b",
  measurementId: "G-K4C7NZHZ62"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
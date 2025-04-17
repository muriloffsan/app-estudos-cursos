// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Importar getAuth
import { getFirestore } from "firebase/firestore"; // Importar getFirestore
// import { getAnalytics } from "firebase/analytics"; // Descomente se for usar Analytics

// Your web app's Firebase configuration
// Para segurança, considere usar variáveis de ambiente para suas chaves de API
export const firebaseConfig = {
  apiKey: "AIzaSyCQYJggbFLTg6eUvGRDFO3jcn0rqsb8g2o", // Substitua pela sua chave real ou use variáveis de ambiente
  authDomain: "app-estudos-cursos.firebaseapp.com",
  projectId: "app-estudos-cursos",
  storageBucket: "app-estudos-cursos.appspot.com", // Corrigido: geralmente termina com .appspot.com
  messagingSenderId: "994781637010",
  appId: "1:994781637010:web:4261d5252694747c16f94b",
  measurementId: "G-K4C7NZHZ62" // Opcional
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app); // Inicializa o Firestore
// const analytics = getAnalytics(app); // Descomente se for usar Analytics

// Export initialized services
export { app, auth, db }; // Exporta auth e db

// Importar a função principal de inicialização do SDK do Firebase
import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage';

// Importar as ferramentas de Autenticação, Base de Dados e Analytics
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";

// As credenciais da tua aplicação web (fornecidas pela consola do Firebase)
const firebaseConfig = {
  apiKey: "AIzaSyCB4W69BnQZVOTKVgNSgsNBIWRfshnatFI",
  authDomain: "loopback-e1fb6.firebaseapp.com",
  projectId: "loopback-e1fb6",
  storageBucket: "loopback-e1fb6.firebasestorage.app",
  messagingSenderId: "830753962688",
  appId: "1:830753962688:web:54ff7f2cbf49689aac8b25",
  measurementId: "G-N3ZDMRZE42",
};

// Inicializar a aplicação Firebase com as credenciais fornecidas
const app = initializeApp(firebaseConfig);

// Inicializar o serviço de Analytics
// const analytics = getAnalytics(app);

// Inicializar e exportar a instância de Autenticação para uso noutros componentes
export const auth = getAuth(app);

// Inicializar e exportar a instância da Base de Dados (Firestore) para uso noutros componentes
export const db = getFirestore(app);
export const storage = getStorage(app);
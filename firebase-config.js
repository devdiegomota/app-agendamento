import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getFirestore, where, collection, getDoc,deleteDoc, updateDoc, query, getDocs, doc, setDoc, addDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

// Configuração do Firebase
    const firebaseConfig = {
        apiKey: "AIzaSyC6CNIyYzP5jjwih2_AagpP3zsmzqxEPVo",
        authDomain: "agendamento-2974c.firebaseapp.com",
        projectId: "agendamento-2974c",
        storageBucket: "agendamento-2974c.firebasestorage.app",
        messagingSenderId: "180079994438",
        appId: "1:180079994438:web:3322290845c5c625128c47",
        measurementId: "G-JQ31P0VMG8"
    };
export {initializeApp};
export {getFirestore, getDocs, deleteDoc, collection, query, addDoc, doc, where, getDoc, setDoc, updateDoc, onSnapshot, firebaseConfig};
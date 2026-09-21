// Firebase Configuration for Ribhi Studio
const firebaseConfig = {
  apiKey: "AIzaSyAeD7WyIh4a6TLZG9VEBt6PI2FafWk7l5c",
  authDomain: "ribhi-cdb63.firebaseapp.com",
  databaseURL: "https://ribhi-cdb63-default-rtdb.firebaseio.com",
  projectId: "ribhi-cdb63",
  storageBucket: "ribhi-cdb63.firebasestorage.app",
  messagingSenderId: "42014679262",
  appId: "1:42014679262:web:022b4d852752d56826a24f",
  measurementId: "G-RF0LM16L2D"
};

// تهيئة Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// تصدير مرجع قاعدة البيانات للاستخدام في كل الموقع
const db = firebase.database();
console.log("⚡ Firebase Realtime Database Connected Successfully!");
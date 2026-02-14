// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBghna59kOD9GjqnoMcr-MuI5D8XAueDM8",
    authDomain: "default-workbook.firebaseapp.com",
    projectId: "default-workbook",
    storageBucket: "default-workbook.firebasestorage.app",
    messagingSenderId: "33766583433",
    appId: "1:33766583433:web:c23725c965d24916d86a58"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize services
const auth = firebase.auth();
const db = firebase.firestore();

// Export for use in other files
window.firebaseAuth = auth;
window.firebaseDb = db;

// Firebase initialized successfully

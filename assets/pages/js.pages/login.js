// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-analytics.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBGrcRVf1Kktffn_fYl_CtSvoCsHUK2eTg",
    authDomain: "safepath-87ebf.firebaseapp.com",
    projectId: "safepath-87ebf",
    storageBucket: "safepath-87ebf.firebasestorage.app",
    messagingSenderId: "904889745500",
    appId: "1:904889745500:web:c2404615bc6e86c8bea699",
    measurementId: "G-RYFJ9DQFER"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app); // Initialize auth with the app instance

// Get the login button and set up the click event listener
const loginBtn = document.getElementById('login-btn');
loginBtn.addEventListener('click', function(event) {
    event.preventDefault(); // Prevent default form submission behavior

    const email = document.getElementById('email').value;
    const password = document.getElementById('PASSWORD').value;

    // Sign in with email and password
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in successfully
            const user = userCredential.user;
            alert('Login successfully');
            window.location.href = "/assets/pages/html-pages/justice.html"; // Correctly specify the URL as a string
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(errorMessage); // Display the error message
        });
});

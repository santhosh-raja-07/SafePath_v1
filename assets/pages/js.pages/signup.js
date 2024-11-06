// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

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
const auth = getAuth(app); // Initialize the auth object

// Add event listener for sign-up
const signupbtn = document.getElementById("btn");
signupbtn.addEventListener("click", (event) => {
    event.preventDefault();
    
    const email = document.getElementById("Signup-email").value;
    const password = document.getElementById("Signup-PASSWORD").value;
    const conPassword = document.getElementById("Signup-ConPASSWORD").value;
    const passError = document.getElementById("passError");
    const conPassError = document.getElementById("conPassError");

    // Clear previous error messages
    passError.textContent = "";
    conPassError.textContent = "";

    // Validate password length
    if (password.length < 8) {
        passError.textContent = "Please enter a minimum of 8 characters for the password.";
        return;
    }

    // Validate password confirmation
    if (password !== conPassword) {
        conPassError.textContent = "Passwords do not match.";
        return;
    }

    // Create user
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed up successfully
            alert("Account created successfully!");
            window.location.href = "/assets/pages/html-pages/justice.html";
        })
        .catch((error) => {
            // Display error message
            const errorMessage = error.message;
            alert(errorMessage);
        });
});

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

// Firebase configuration
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
const auth = getAuth(app);

// DOM Elements
const loginBtn = document.getElementById('login-btn');
const passwordError = document.getElementById("passwordError");
const logEmailError = document.getElementById("logEmailError");
const loginEmail = document.getElementById('email');
const loginPassword = document.getElementById('PASSWORD');
const body = document.querySelector("body");
const overlay = document.getElementById("overlay");
const login = document.querySelector(".login-page");
// Handle login button click
loginBtn.addEventListener('click', function (event) {
    event.preventDefault();
    const email = loginEmail.value.trim();
    const password = loginPassword.value.trim();

    // Clear previous error messages
    passwordError.textContent = "";
    logEmailError.textContent = "";

    // Basic validation for non-empty fields
    if (email === "") {
        logEmailError.textContent = "Email cannot be empty";
        return;
    }
    if (password === "") {
        passwordError.textContent = "Password cannot be empty";
        return;
    }

    // Attempt to sign in with email and password
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;

            // Store the user in localStorage for future use
            localStorage.setItem("user", JSON.stringify(user));

            alert("Login successful");
            passwordError.textContent = "";
            logEmailError.textContent = "";
            displayLoggedInUI();

        })
        .catch((error) => {
            // Clear previous errors
            passwordError.textContent = "";
            logEmailError.textContent = "";

            // Handle specific Firebase error codes
            if (error.code === 'auth/invalid-email' || error.code === 'auth/user-not-found') {
                logEmailError.textContent = "Invalid email or user not found";
            } else if (error.code === 'auth/wrong-password') {
                passwordError.textContent = "Invalid password";
            } 
            // else {
            //     // Log the error for debugging purposes
            //     console.error("Firebase error:", error);
            //     passwordError.textContent = "An error occurred. Please try again.";
            // }
        });
});

function displayLoggedInUI() {
    
    login.style.display = "none";
    body.style.overflow = "initial";
    overlay.style.display = "none";
    
    // Retrieve user data from localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    const loginButton = document.getElementById("login-button");

    if (user) {
        
        loginButton.style.display = "none";
        const userDiv = document.querySelector(".username");
        userDiv.textContent = user.displayName || user.email;
        userDiv.style.color = "#0097b2";

        const logoutButton = document.querySelector(".loginout");
        logoutButton.textContent = "Logout";
        logoutButton.style.backgroundColor = "#0097b2";
        logoutButton.style.color = "white";
        logoutButton.style.border = "none";
        logoutButton.style.cursor = "pointer";
        logoutButton.style.paddingRight = "3px";
        logoutButton.style.paddingLeft = "3px";

        logoutButton.addEventListener("click", () => {
            signOut(auth).then(() => {
                // Clear localStorage on logout
                localStorage.removeItem("user");
                loginButton.style.display = "block";
                updateUIOnLogout();
            });
        });
    }
}

function updateUIOnLogout() {
    alert("You have successfully logged out.");
    window.location.reload();
}

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { firebaseConfig } from "./config.js";
import { getUsername } from "./forAthu.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Elements
const loginBtn = document.getElementById("signIn");
const loginEmail = document.getElementById("email");
const loginPassword = document.getElementById("PASSWORD");
const logEmailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const logoutButton = document.getElementById("loginout");

// Login Button Event
loginBtn.addEventListener("click", (event) => {
    event.preventDefault();

    // Reset error messages
    logEmailError.textContent = "";
    passwordError.textContent = "";

    const email = loginEmail.value.trim();
    const password = loginPassword.value.trim();

    // Validate email and password
    if (!validateEmail(email)) {
        logEmailError.textContent = "Enter a valid email address.";
        return;
    }

    if (!password) {
        passwordError.textContent = "Password cannot be empty.";
        return;
    }

    // Firebase Login
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            alert("Login successful!");
            redirect();
        })
        .catch((error) => {
            switch (error.code) {
                case "auth/invalid-email":
                case "auth/user-not-found":
                    logEmailError.textContent = "Email not found. Please check your email.";
                    break;
                case "auth/wrong-password":
                    passwordError.textContent = "Incorrect password.";
                    break;
                default:
                    console.error("Firebase error:", error);
                    passwordError.textContent = "An unexpected error occurred. Please try again.";
                    break;
            }
        });
});

// Email Validation
function validateEmail(email) {
    const emailPattern = /^[a-zA-Z][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/;
    return emailPattern.test(email);
}

function redirect() {
    const loadingAnimation = document.querySelector(".loading");
    loadingAnimation.style.display = "block";

    setTimeout(() => {
        loadingAnimation.style.display = "none";
        window.location.href = "/assets/pages/lawyerHome.html";
    }, 1000);
}

// Signup Redirect
document.getElementById("sign-up").addEventListener("click", () => {
    window.location.href = "/assets/pages/lawyerfom.html";
});

// Hide loading animation on load
document.querySelector(".loading").style.display = "none";

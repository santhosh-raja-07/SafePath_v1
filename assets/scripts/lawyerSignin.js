import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
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
const alertMessage = document.getElementById('alert-message');

let em = ""
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
            localStorage.setItem("userEmail", JSON.stringify({ clientEmail: loginEmail.value.trim() }));
            alertMessage.style.background = "#4CAF50"
            alertMessage.textContent = "Login successfully!"
            alertMessage.classList.add('show')
            setTimeout(() => {
                alertMessage.classList.remove('show');

            }, 1000);
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
    setTimeout(() => {
    window.location.href = "/assets/pages/lawyerHome.html";
}, 2000);
}

// Signup Redirect
document.getElementById("sign-up").addEventListener("click", () => {
    window.location.href = "/assets/pages/lawyerfom.html";
});

// Hide loading animation on load
document.querySelector(".loading").style.display = "none";

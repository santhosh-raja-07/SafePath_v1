import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut , onAuthStateChanged} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import {firebaseConfig } from "./config.js"
import { getFirestore, collection, getDocs, doc , updateDoc, addDoc ,query, where} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const loginBtn = document.getElementById("login-btn");
const loginEmail = document.getElementById("email");
const loginPassword = document.getElementById("PASSWORD");
const logEmailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");

loginBtn.addEventListener("click", (event) => {
    event.preventDefault();

    // Reset error messages
    logEmailError.textContent = "";
    passwordError.textContent = "";

    const email = loginEmail.value.trim();
    const password = loginPassword.value.trim();

    // Validate email and password
    if (!validateEmail(email) || email == "") {
        logEmailError.textContent = "Enter a valid email address.";

    }

    if (!password || password == "") {
        passwordError.textContent = "Password cannot be empty.";

    }

    // Attempt Firebase login
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            alert("Login successful!");
            redirect()
        })
        .catch((error) => {
            // Handle Firebase errors
            switch (error.code) {
                case "auth/invalid-email":
                case "auth/user-not-found":
                    logEmailError.textContent = "Enter a valid email address.";
                    break;
                case "auth/wrong-password":
                    passwordError.textContent = "Incorrect password.";
                    break;
                default:
                    console.error("Firebase error:", error);
                    passwordError.textContent = "An error occurred. Please try again.";
                    break;
            }
        });
});

// Validate Email
function validateEmail(email) {
    const emailPattern = /^[a-zA-Z][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/;
    return emailPattern.test(email);
}

document.querySelector(".loading").style.display = "none";

// document.querySelector("body").style.opacity = "1"
function redirect() {
    // document.querySelector("body").style.opacity = "0.3"
    document.querySelector(".loading").style.display = "block";
    setTimeout(() => {
        document.querySelector(".loading").style.display = "none";
        window.location.href= "/assets/pages/lawyerHome.html";
    }, 3000);
}

document.getElementById("sign-up").addEventListener("click" , ()=>{
    window.location.href = "/assets/pages/lawyerfom.html"
})


// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-analytics.js";
import { getAuth, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

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
const auth = getAuth(app);

// DOM Elements
const loginBtn = document.getElementById('login-btn');
const passwordError = document.getElementById("passwordError");
// const loginbutton = document.getElementById("login-button");

loginBtn.addEventListener('click', function (event) {
    event.preventDefault();
    passwordError.textContent = "";

    const email = document.getElementById('email').value;
    const password = document.getElementById('PASSWORD').value;

    signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            alert('Login successful');
            passwordError.textContent = "";
            displayLoggedInUI();
        })
        .catch((error) => {
            if (error.code === 'auth/invalid-email' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                passwordError.textContent = "Invalid email or password";
            } 
        });
});

function displayLoggedInUI() {
    let login=document.querySelector(".login-page");
    let bodyPage=document.querySelector(".body");
    login.style.display = "none";
    bodyPage.style.opacity=1
    const user = JSON.parse(localStorage.getItem("user"));
    const loginButton = document.getElementById("login-button");
    const handlingLogout = document.getElementById("handling-logout");

    if (user) {
        loginButton.style.display = "none";
        const userDiv = document.createElement("div");
        userDiv.textContent = `Welcome, ${user.displayName || user.email}`;
        userDiv.style.color="#0097b2";
        const logoutButton = document.createElement("button");
        logoutButton.textContent = "Logout";
        logoutButton.style.backgroundColor="#0097b2";
        logoutButton.style.color="white";
        logoutButton.style.border="none";
        logoutButton.style.cursor="pointer";
        logoutButton.style.paddingRight="3px";
        logoutButton.style.paddingLeft="3px";
        logoutButton.addEventListener("click", () => {
            signOut(auth).then(() => {
                logoutButton.style.display="none";
                userDiv.style.display="none";
                loginButton.style.display="block"
                updateUIOnLogout();
            });
        });
        handlingLogout.appendChild(userDiv);
        handlingLogout.appendChild(logoutButton);
    }
}
function updateUIOnLogout() {
    alert("You have successfully logged out.");
    window.location.reload();
}
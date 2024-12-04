import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, updateProfile, signOut , onAuthStateChanged} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-analytics.js";
import { getUsername} from "./signup.js";
import {firebaseConfig } from "./config.js"

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Selectors
const loginBtn = document.getElementById("login-btn");
const loginEmail = document.getElementById("email");
const loginPassword = document.getElementById("PASSWORD");
const logEmailError = document.getElementById("logEmailError");
const passwordError = document.getElementById("passwordError");
const body = document.querySelector("body");
const overlay = document.getElementById("overlay");
const loginPage = document.querySelector(".login-page");

/* <button id="login-button">Login</button> */
const appendloginbtn = document.querySelector(".appendloginbtn")


// Handle Login Button Click
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
            displayLoggedInUI();
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

// UI for Logged-In User
 function displayLoggedInUI() {
    loginPage.style.display = "none";
    body.style.overflow = "initial";
    overlay.style.display = "none";

    const logoutButton = document.querySelector("#loginout"); // Declare logoutButton here globally
    const loginButton = document.getElementById("login-button");

    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in
            const userDiv = document.querySelector(".username");
            appendloginbtn.style.display = "none"
            userDiv.style.color = "rgb(9, 98, 9)";
            logoutButton.textContent = "Logout";
            // Fetch user details after login
            getUsername(user.email)
                .then((userDetails) => {
                    if (userDetails) {
                        localStorage.setItem(
                            "user",
                            JSON.stringify({
                              userNameee: userDetails.userName
                            })
                          );
                          userDiv.textContent = userDetails.userName;
                    }
                })
                .catch((error) => {
                    console.error('Error fetching user details:', error);
                });

            // Attach logout listener here, inside the onAuthStateChanged callback
            logoutButton.addEventListener("click", () => {
                if(confirm("Are you want to logout")){
                    signOut(auth).then(() => {
                        userDiv.textContent = ""; // Clear the username div
                        loginButton.style.display = "block";
                        appendloginbtn.style.display = "block"
                        localStorage.removeItem("user")
                        updateUIOnLogout();
                    }).catch((error) => {
                      alert("Logout error: ", error);
                    });
                  }
            });
        } else {
            loginButton.style.display = "block";
        }
    });


function updateUIOnLogout() {
    alert("You have successfully logged out.");
    window.location.reload();
}
    
}

onAuthStateChanged(auth, (user) => {
    if (user) {
       displayLoggedInUI();
    } else {
        loginBtn.style.display = "block";
    }
});
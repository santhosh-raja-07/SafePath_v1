import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, updateProfile, signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBGrcRVf1Kktffn_fYl_CtSvoCsHUK2eTg",
    authDomain: "safepath-87ebf.firebaseapp.com",
    projectId: "safepath-87ebf",
    storageBucket: "safepath-87ebf.firebasestorage.app",
    messagingSenderId: "904889745500",
    appId: "1:904889745500:web:c2404615bc6e86c8bea699",
    measurementId: "G-RYFJ9DQFER",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Selectors
const email = document.getElementById("Signup-email");
const password = document.getElementById("Signup-PASSWORD");
const conPassword = document.getElementById("Signup-ConPASSWORD");
const username = document.getElementById("fullname");

const emailError = document.getElementById("emailError");
const passError = document.getElementById("passError");
const conPassError = document.getElementById("conPassError");
const usernameError = document.getElementById("nameError");

const signupBtn = document.getElementById("btn");
const xmark1 = document.getElementById("x-mark1");
const signup = document.getElementById("sign-up");
const xmark2 = document.getElementById("x-mark2");
const login = document.getElementById("login-link");
const loginbutton = document.getElementById("login-button");
const body = document.querySelector("body");
const overlay = document.getElementById("overlay");

loginbutton.addEventListener("click", () => {
    let login = document.querySelector(".login-page");
    login.style.display = "initial";
    body.style.overflow = "hidden";
    overlay.style.display = "block";
});

xmark1.addEventListener("click", () => {
    let login = document.querySelector(".login-page");
    login.style.display = "none";
    emailError.textContent = "";
    passError.textContent = "";
    conPassError.textContent = "";
    body.style.overflow = "initial";
    overlay.style.display = "none";
});

signup.addEventListener("click", () => {
    let login = document.querySelector(".login-page");
    let sign = document.querySelector(".sign-up-page");
    login.style.display = "none";
    sign.style.display = "initial";
    body.style.overflow = "hidden";
    overlay.style.display = "block";
});

xmark2.addEventListener("click", () => {
    let sign = document.querySelector(".sign-up-page");
    sign.style.display = "none";
    emailError.textContent = "";
    passError.textContent = "";
    conPassError.textContent = "";
    body.style.overflow = "initial";
    overlay.style.display = "none";
});

login.addEventListener("click", () => {
    let login = document.querySelector(".login-page");
    let sign = document.querySelector(".sign-up-page");
    login.style.display = "initial";
    sign.style.display = "none";
    overlay.style.display = "block";
    body.style.overflow = "initial";
});

// Validate Username
username.addEventListener("input", () => {
    validateUsername();
});

function validateUsername() {
    const trimmedValue = username.value.trim();
    const hasLowercase = /[a-z]/.test(trimmedValue);
    const hasUppercase = /[A-Z]/.test(trimmedValue);
    const hasNumber = /^[0-9]+$/.test(trimmedValue);
    const isValidLength = trimmedValue.length >= 3 && trimmedValue.length <= 32;

    if (hasNumber) {
        usernameError.textContent = "Username should not contain numbers.";
        return false;
    }

    if ((hasLowercase || hasUppercase) && isValidLength) {
        usernameError.textContent = "";
        return true;
    } else {
        if (username.value.startsWith(" ") || username.value.endsWith(" ")) {
            usernameError.textContent = "should not have spaces at the beginning or end.";
        } else {
            usernameError.textContent = "Enter a username with 3 to 32 characters";
        }
        return false;
    }
}

// Email Validation
function validateEmail(email) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
        return { isValid: false, message: "Enter a valid email address." };
    }
    return { isValid: true, message: "" };
}

email.addEventListener("input", () => {
    const validation = validateEmail(email.value);
    if (validation.isValid) {
        emailError.textContent = "";
    } else {
        emailError.textContent = validation.message;
    }
});

// Password Validation
password.addEventListener("input", () => {
    validatePassword();
});

function validatePassword() {
    const Lowercase = /[a-z]/.test(password.value);
    const Uppercase = /[A-Z]/.test(password.value);
    const Number = /[0-9]/.test(password.value);
    const SpecialChar = /[!@#$%^&*()?><,]/.test(password.value);
    const decimalAndNegative = /[.-]/.test(password.value)

    if (Lowercase && Uppercase && Number && SpecialChar && password.value.length >= 8 && !decimalAndNegative) {
        passError.textContent = "";
        return true;
    } else {
        let errorMsg = "Password must have at least: ";
        if(decimalAndNegative) errorMsg ="please use whole numbers, "
        if (!Lowercase) errorMsg = "one lowercase letter, ";
        if (!Uppercase) errorMsg = "one uppercase letter, ";
        if (!Number) errorMsg = "one number, ";
        if (!SpecialChar) errorMsg = "one special character, ";
        if (password.value.length < 8) errorMsg += "and at least 8 characters";
        passError.textContent = errorMsg;
        return false;
    }
}

// Confirm Password Validation
function validateConfirmPassword() {
    if (password.value === conPassword.value) {
        conPassError.textContent = "";
        return true;
    } else {
        conPassError.textContent = "Passwords do not match.";
        return false;
    }
}

// Signup Function
signupBtn.addEventListener("click", (event) => {
    event.preventDefault();

    // Reset previous errors
    emailError.textContent = "";
    passError.textContent = "";
    conPassError.textContent = "";

    const isValid = validateUsername() && validateEmail(email.value) && validatePassword() && validateConfirmPassword();

    if (isValid) {
        createUserWithEmailAndPassword(auth, email.value.trim(), password.value.trim())
            .then((userCredential) => {
                const user = userCredential.user;
                return updateProfile(user, { displayName: username.value.trim() });
            })
            .then(() => {
                alert("Account created successfully!");
                localStorage.setItem("user", JSON.stringify(auth.currentUser));
                displayLoggedInUI();
            })
            .catch((error) => {
                if (error.code === "auth/email-already-in-use") {
                    emailError.textContent = "Email is already in use.";
                } else if (error.code === "auth/invalid-email") {
                    emailError.textContent = "Invalid email format.";
                } else {
                    console.error(error);
                }
            });
    }
});

// Display UI for Logged-In User
export function displayLoggedInUI() {
    let sign = document.querySelector(".sign-up-page");
    sign.style.display = "none";
    body.style.overflow = "initial";
    overlay.style.display = "none";

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

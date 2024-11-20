import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, updateProfile, signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

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
const signupBtn = document.getElementById("btn");
const email = document.getElementById("Signup-email");
const password = document.getElementById("Signup-PASSWORD");
const conPassword = document.getElementById("Signup-ConPASSWORD");
const username = document.getElementById("fullname");

const emailError = document.getElementById("emailError");
const passError = document.getElementById("passError");
const conPassError = document.getElementById("conPassError");
const usernameError = document.getElementById("nameError");

const xmark1=document.getElementById("x-mark1");
const signup=document.getElementById("sign-up");
const xmark2=document.getElementById("x-mark2");
const login=document.getElementById("login-link");
const loginbutton=document.getElementById("login-button");

loginbutton.addEventListener("click" ,()=>{
    let login=document.querySelector(".login-page");
    let bodyPage=document.querySelector(".body");
    login.style.display = "initial";
    bodyPage.style.opacity=0.3;
})
xmark1.addEventListener("click",()=>{
    let login=document.querySelector(".login-page");
    let bodyPage=document.querySelector(".body");
    login.style.display = "none";
    bodyPage.style.opacity=1
    emailError.textContent = "";
    passError.textContent = "";
    conPassError.textContent = "";
})
signup.addEventListener("click",()=>{
    let login=document.querySelector(".login-page");
    let sign=document.querySelector(".sign-up-page");
    let bodyPage=document.querySelector(".body");
    login.style.display = "none";
    sign.style.display = "initial";
    bodyPage.style.opacity=0.3
})
xmark2.addEventListener("click",()=>{
    let sign=document.querySelector(".sign-up-page");
    let bodyPage=document.querySelector(".body");
    sign.style.display = "none";
    bodyPage.style.opacity=1;
    emailError.textContent = "";
    passError.textContent = "";
    conPassError.textContent = "";
})
login.addEventListener("click",()=>{
    let login=document.querySelector(".login-page");
    let sign=document.querySelector(".sign-up-page");
    let bodyPage=document.querySelector(".body");
    login.style.display = "initial";
    sign.style.display = "none";
    bodyPage.style.opacity=0.3;
})


username.addEventListener("input", () => {
    validateUsername();
});

function validateUsername() {
    const trimmedValue = username.value.trim();
    const hasLowercase = /[a-z]/.test(trimmedValue);
    const hasUppercase = /[A-Z]/.test(trimmedValue);
    const hasNumber = /[0-9]/.test(trimmedValue);
    const isValidLength = trimmedValue.length >= 3 && trimmedValue.length <= 32;

    if (hasNumber) {
        usernameError.textContent = "Username should not contain numbers.";
        return false;
    } 

    if ((hasLowercase || hasUppercase ) && isValidLength) {
        usernameError.textContent = "";
        return true;
    } 
    else {
       if ( username.value.startsWith(" ") || username.value.endsWith(" ")) {
            usernameError.textContent = "should not have spaces at the beginning or end.";
        } else {
            usernameError.textContent = "Enter a username with 3 to 32 characters";
        }
        return false;
    }
}

function validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.com$/;

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
        emailError.textContent =validation.message;
    }
});

password.addEventListener("input", () => {
    validatePassword();
});

function validatePassword() {
    const Lowercase = /[a-z]/.test(password.value);
    const Uppercase = /[A-Z]/.test(password.value);
    const Number = /[0-9]/.test(password.value);
    const SpecialChar = /[!@#$%^&*()?><.,]/.test(password.value);
    
    if (Lowercase && Uppercase && Number && SpecialChar && password.value.length >= 8) {
        passError.textContent = "";
        return true;
    } else {
        let errorMsg = "Password must have at least: ";
        if (!Lowercase) errorMsg = "one lowercase letter, ";
        if (!Uppercase) errorMsg = "one uppercase letter, ";
        if (!Number) errorMsg = "one number, ";
        if (!SpecialChar) errorMsg = "one special character, ";
        if (password.value.length < 8) errorMsg += "and at least 8 characters";
        passError.textContent = errorMsg;
        return false;
    }
}

function validateConfirmPassword() {
    if (password.value === conPassword.value) {
        conPassError.textContent = "";
        return true;
    }
    else{
        conPassError.textContent = "Passwords do not match.";
    return false;
    }
}

// Signup Function
signupBtn.addEventListener("click", (event) => {
    event.preventDefault();

    if(email.value===""){
        emailError.textContent ="Enter a valid email address";
    }
    if(password.value===""){
        passError.textContent = "Enter valid password";
    }
    if(conPassword.value===""){
        conPassError.textContent = "Passwords do not match";
    }
    // Reset errors
    else {
        emailError.textContent = "";
    passError.textContent = "";
    conPassError.textContent = "";
    usernameError.textContent = "";
    }
    const isValid = validateUsername() && validateEmail() && validatePassword() && validateConfirmPassword();

    if (isValid) {
        createUserWithEmailAndPassword(auth, email.value.trim(), password.value.trim())
            .then((userCredential) => {
                // Update profile with username
                const user = userCredential.user;
                return updateProfile(user, {
                    displayName: username.value.trim(),
                });
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
function displayLoggedInUI() {
    let sign=document.querySelector(".sign-up-page");
    let bodyPage=document.querySelector(".body");
    sign.style.display = "none";
    bodyPage.style.opacity=1;
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
    window.location.reload()
}


// email.addEventListener("input", () => {

// });
// password.addEventListener("input",()=>{
//     if()
// })
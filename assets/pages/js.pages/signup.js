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
const auth = getAuth(app);

const signupbtn = document.getElementById("btn");
const email = document.getElementById("Signup-email");
const password = document.getElementById("Signup-PASSWORD");
const conPassword = document.getElementById("Signup-ConPASSWORD");
const passError = document.getElementById("passError");
const conPassError = document.getElementById("conPassError");
const emailError = document.getElementById("emailError");

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

email.addEventListener("input", () => {
    if (emailPattern.test(email.value)) {
        emailError.textContent = ""; 
    } else {
        emailError.textContent = "Enter a valid email";
    }
});

password.addEventListener("input", () => {
    const Lowercase = /[a-z]/.test(password.value);
    const Uppercase = /[A-Z]/.test(password.value);
    const Number = /[0-9]/.test(password.value);
    const SpecialChar = /[!@#$%^&*()?><.,]/.test(password.value);
    if (Lowercase && Uppercase && Number && SpecialChar && password.value.length >= 8) {
        passError.textContent = ""; 
    } else {
        passError.textContent = "Enter a valid password";
    }
});


conPassword.addEventListener("input",()=>{
if (password.value === conPassword.value) {
    conPassError.textContent = "";
} else {
    conPassError.textContent = "Passwords do not match.";
}
})

signupbtn.addEventListener("click", (event) => {
    event.preventDefault();

    emailError.textContent = "";
    passError.textContent = "";
    conPassError.textContent = "";

    let isValid = true;
    if (!emailPattern.test(email.value)) {
        emailError.textContent = "Enter a valid email";
        isValid = false;
    } else {
        emailError.textContent = "";
    }

    const Lowercase = /[a-z]/.test(password.value);
    const Uppercase = /[A-Z]/.test(password.value);
    const Number = /[0-9]/.test(password.value);
    const SpecialChar = /[!@#$%^&*()?><.,]/.test(password.value);
    if (!Lowercase || !Uppercase || !Number || !SpecialChar || password.value.length< 8) {
        passError.textContent = "Enter valid password";
        isValid = false;
    } else {
        passError.textContent = "";
    }

    if (password.value !== conPassword.value) {
        conPassError.textContent = "Passwords do not match.";
        isValid = false;
    } else {
        conPassError.textContent = "";
    }
    if (isValid) {
        createUserWithEmailAndPassword(auth, email.value, password.value)
            .then((userCredential) => {
                alert("Account created successfully!");
                window.location.href = "/assets/pages/html-pages/justice.html";
            })
            .catch((error) => {
                emailError.textContent = "Error creating account. Please try again.";
                console.error(error);
            });
    }
});


const favicon=document.querySelector(".favicon");
const xmark1=document.getElementById("x-mark1");
const signup=document.getElementById("sign-up");
const xmark2=document.getElementById("x-mark2");
const login=document.getElementById("login-link");

favicon.addEventListener("click" ,()=>{
    let login=document.querySelector(".login-page");
    let bodyPage=document.querySelector(".body");
    login.style.display = "initial";
    bodyPage.style.opacity=0.3
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
    bodyPage.style.opacity=0.3
})
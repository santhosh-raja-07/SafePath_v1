import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, updateProfile, signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import {firebaseConfig } from "./config.js"

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const lawyerName = document.getElementById("lawyername");
const lawyerEmail = document.getElementById("lawyermail");
const lawyersId = document.getElementById("lawyersId");
const otherCategory = document.getElementById("otherCategory");
const YearsOfExp = document.getElementById("YearsOfExp");
const signIn = document.getElementById("signIn");

const lawyerNameError = document.getElementById("lawyernameError");
const lawyerEmailError = document.getElementById("lawyermailError");
const lawyersIdError = document.getElementById("lawyersIdError");
const lawCategoryError = document.getElementById("lawCategoryError");
const YearsOfExpError = document.getElementById("YearsOfExpError");

lawyerName.addEventListener("input", () => {
    validateUsername();
});

function validateUsername() {
    const trimmedValue = lawyerName.value.trim();
    const hasLowercase = /[a-z]/.test(trimmedValue);
    const hasUppercase = /[A-Z]/.test(trimmedValue);
    const hasNumber = /^[0-9]+$/.test(trimmedValue);
    const isValidLength = trimmedValue.length >= 3 && trimmedValue.length <= 32;

    if (hasNumber) {
        lawyerNameError.textContent = "Username should not contain numbers.";
        return false;
    }

    if ((hasLowercase || hasUppercase) && isValidLength) {
        lawyerNameError.textContent = "";
        return true;
    } else {
        if (lawyerName.value.startsWith(" ") || lawyerName.value.endsWith(" ")) {
            lawyerNameError.textContent = "should not have spaces at the beginning or end.";
        } else {
            lawyerNameError.textContent = "Enter a username with 3 to 32 characters";
        }
        return false;
    }
}


function validateEmail() {
    const emailPattern = /^[a-zA-Z][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/;
    if (!emailPattern.test(lawyerEmail.value.trim())) {
        return { isValid: false, message: "Enter a valid email address." };
    }
    return { isValid: true, message: "" };
}

lawyerEmail.addEventListener("input", () => {
    const validation = validateEmail();
    if (validation.isValid) {
        lawyerEmailError.textContent = "";
    } else {
        lawyerEmailError.textContent = validation.message;
    }
});

lawyersId.addEventListener("input", () => {
    validatelawyersId();
});

function validatelawyersId() {
    const trimmedValue = lawyersId.value.trim(); 
    const isValidLength = trimmedValue.length === 11; 
    const idPattern = /^[A-Z]\/\d{4}\/\d{4}$/; 

    if (!isValidLength || !idPattern.test(trimmedValue)) {
        lawyersIdError.textContent = "Enter a valid ID ";
        return false;
    } else {
        lawyersIdError.textContent = "";
        return true;
    }
}

// Validate the "Category of Law" field
const lawCategory = document.querySelector('.category');
lawCategory.addEventListener('change', () => {
    validateLawCategory();
});

function validateLawCategory() {
    if (lawCategory.value === "Areas of Legal Expertise") {
        lawCategoryError.textContent = "Please select a valid area of legal expertise.";
        return false;
    } else {
        lawCategoryError.textContent = "";
        return true;
    }
}


lawCategory.addEventListener("change", () => {
    if (lawCategory.value === "other") {
        otherCategory.innerHTML = `<input type="text" id="otherCategoryInput" placeholder="Please specify">`;
    } else {
        otherCategory.innerHTML = "";
    }
});


YearsOfExp.addEventListener("input", () => {
    validateYearsOfExperience();
});

function validateYearsOfExperience() {
    const experience = Number(YearsOfExp.value, 10);

    if (isNaN(experience) || experience < 0 || experience > 50 || YearsOfExp.value === "") {
        YearsOfExpError.textContent = "Enter a valid number of years between 0 and 50.";
        return false;
    } else {
        YearsOfExpError.textContent = "";
        return true;
    }
}

// Form submission
signIn.addEventListener("click", (event) => {
    event.preventDefault(); // Prevent the default form submission

    const isNameValid = validateUsername();
    const emailValidation = validateEmail(); // Validate email here
    const isEmailValid = emailValidation.isValid;
    const isIdValid = validatelawyersId();
    const isCategoryValid = validateLawCategory();
    const isExperienceValid = validateYearsOfExperience();

    // Show email validation error if invalid
    if (!isEmailValid) {
        lawyerEmailError.textContent = emailValidation.message;
    }

    if (isNameValid && isEmailValid && isIdValid && isCategoryValid && isExperienceValid) {
        // Proceed with form submission
        alert("Form submitted successfully!");
        lawyerNameError.textContent = ""
        lawyerEmailError.textContent = ""
        lawyersIdError.textContent = ""
        lawCategoryError.textContent = ""
        YearsOfExpError.textContent = ""
    }
});

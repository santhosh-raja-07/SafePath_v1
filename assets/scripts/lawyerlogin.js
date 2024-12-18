import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, updateProfile, signOut , onAuthStateChanged} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getFirestore, collection, addDoc , query, where, getDocs , doc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import { firebaseConfig } from "../../config.js";


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const lawyerName = document.getElementById("lawyername");
const lawyerEmail = document.getElementById("lawyermail");
const lawyersId = document.getElementById("lawyersId");
const otherCategory = document.getElementById("otherCategory");
const YearsOfExp = document.getElementById("YearsOfExp");
const signIn = document.getElementById("signIn");
const password = document.getElementById("password")
const conPassword = document.getElementById("con-password")

const lawyerNameError = document.getElementById("lawyernameError");
const lawyerEmailError = document.getElementById("lawyermailError");
const lawyersIdError = document.getElementById("lawyersIdError");
const lawCategoryError = document.getElementById("lawCategoryError");
const YearsOfExpError = document.getElementById("YearsOfExpError");
const passwordError = document.getElementById("passwordError")
const conPasswordError = document.getElementById("con-passwordError")

lawyerName.addEventListener("input", validateUsername);
lawyerEmail.addEventListener("input", validateEmail);
lawyersId.addEventListener("input", validatelawyersId);
YearsOfExp.addEventListener("input", validateYearsOfExperience);
conPassword.addEventListener("input" , validateConfirmPassword);
password.addEventListener("input", validatePassword);

// Validation functions
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
        lawyerEmailError.textContent = "Enter a valid email address.";
        return false;
    }
    lawyerEmailError.textContent = "";
    return true;
}

// Password Validation

function validatePassword() {
    const Lowercase = /[a-z]/.test(password.value);
    const Uppercase = /[A-Z]/.test(password.value);
    const Number = /[0-9]/.test(password.value);
    const SpecialChar = /[!@#$%^&*()?><,]/.test(password.value);
    const decimalAndNegative = /[.-]/.test(password.value)
    if (Lowercase && Uppercase && Number && SpecialChar && password.value.length >= 8 && !decimalAndNegative) {
        passwordError.textContent = "";
        return true;
    } else {
        let errorMsg = "Password must have at least: ";
        if(decimalAndNegative) errorMsg ="please use whole numbers, "
        if (!Lowercase) errorMsg = "one lowercase letter, ";
        if (!Uppercase) errorMsg = "one uppercase letter, ";
        if (!Number) errorMsg = "one number, ";
        if (!SpecialChar) errorMsg = "one special character, ";
        if (password.value.length < 8) errorMsg += "and at least 8 characters";
        passwordError.textContent = errorMsg;
        return false;
    }
}
// Confirm Password Validation
function validateConfirmPassword() {
    if (password.value === conPassword.value) {
        conPasswordError.textContent = "";
        return true;
    } else {
        conPasswordError.textContent = "Passwords do not match.";
        return false;
    }
}

function validatelawyersId() {
    const trimmedValue = lawyersId.value.trim();
    const isValidLength = trimmedValue.length === 11;
    const idPattern = /^[A-Z]\/\d{4}\/\d{4}$/;

    if (!isValidLength || !idPattern.test(trimmedValue)) {
        lawyersIdError.textContent = "Enter a valid ID.";
        return false;
    } else {
        lawyersIdError.textContent = "";
        return true;
    }
}

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

function validateLawCategory() {
    const lawCategory = document.querySelector('.category');
    if (lawCategory.value === "Areas of Legal Expertise") {
        lawCategoryError.textContent = "Please select a valid area of legal expertise.";
        return false;
    } else {
        lawCategoryError.textContent = "";
        return true;
    }
}

// Form Submission
signIn.addEventListener("click", async (event) => {
    event.preventDefault(); // Prevent default form submission
    const lawyerNameValue = lawyerName.value.trim()
    const lawCategory = document.querySelector('.category').value.trim()
    // Validation
    const isNameValid = validateUsername();
    const isEmailValid = validateEmail();
    const isIdValid = validatelawyersId();
    const isCategoryValid = validateLawCategory();
    const isExperienceValid = validateYearsOfExperience();
    const isPasswordValid = validatePassword();
    const isConPasswordValid = validateConfirmPassword();

    if (isNameValid && isEmailValid && isIdValid && isCategoryValid && isExperienceValid && isPasswordValid && isConPasswordValid) {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, lawyerEmail.value.trim(), password.value.trim());
            const user = userCredential.user;

            // Update the user's display name
            await updateProfile(user, { displayName: lawyerNameValue});

            // Add lawyer data to Firestore
            const docRef = collection(db, "lawyerDetails");
            const obj = {
                lawyerName: lawyerNameValue,
                lawyerEmail: lawyerEmail.value.trim(),
                lawyersId: lawyersId.value.trim(),
                lawCategory: lawCategory,
                experience: YearsOfExp.value
            };
            await addDoc(docRef, obj);

            localStorage.setItem("user", JSON.stringify({ lawyerName : lawyerNameValue , lawyerEmail : lawyerEmail.value.trim() , lawyersId: lawyersId.value.trim() , lawCategory : lawCategory , experience : YearsOfExp.value }));

            alert("Account created successfully!");
            console.log("User details saved to Firestore");
            window.location.href = "/assets/pages/lawyerHome.html";
        } catch (error) {
            if (error.code === "auth/email-already-in-use") {
                lawyerEmailError.textContent = "Email is already in use.";
            } else if (error.code === "auth/invalid-email") {
                lawyerEmailError.textContent = "Invalid email format.";
            } else {
                console.error(error);
            }
        }
    }
});


//
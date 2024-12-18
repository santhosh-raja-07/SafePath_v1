import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getFirestore, collection, getDocs, doc , updateDoc, addDoc ,query, where} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import {firebaseConfig } from "../../config.js"
// import {goToIssuePage , check} from './login.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

    // Selectors
    const email = document.getElementById("Signup-email");
    const password = document.getElementById("Signup-PASSWORD");
    const conPassword = document.getElementById("Signup-ConPASSWORD");
    const userNameee = document.getElementById("fullname");
  
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
  
    // Event Listeners
    if (loginbutton) {
      loginbutton.addEventListener("click", () => {
        let login = document.querySelector(".login-page");
        login.style.display = "initial";
        body.style.overflow = "hidden";
        overlay.style.display = "block";
      });
    }
  
    if (xmark1) {
      xmark1.addEventListener("click", () => {
        let login = document.querySelector(".login-page");
        login.style.display = "none";
        emailError.textContent = "";
        passError.textContent = "";
        conPassError.textContent = "";
        body.style.overflow = "initial";
        overlay.style.display = "none";
      });
    }
  
    if (signup) {
      signup.addEventListener("click", () => {
        let login = document.querySelector(".login-page");
        let sign = document.querySelector(".sign-up-page");
        login.style.display = "none";
        sign.style.display = "initial";
        body.style.overflow = "hidden";
        overlay.style.display = "block";
      });
    }
  
    if (xmark2) {
      xmark2.addEventListener("click", () => {
        let sign = document.querySelector(".sign-up-page");
        sign.style.display = "none";
        emailError.textContent = "";
        passError.textContent = "";
        conPassError.textContent = "";
        body.style.overflow = "initial";
        overlay.style.display = "none";
      });
    }
  
    if (login) {
      login.addEventListener("click", () => {
        let login = document.querySelector(".login-page");
        let sign = document.querySelector(".sign-up-page");
        login.style.display = "initial";
        sign.style.display = "none";
        overlay.style.display = "block";
        body.style.overflow = "initial";
      });
    }
  

// Validate Username
userNameee.addEventListener("input", () => {
    validateUsername();
});

function validateUsername() {
    const trimmedValue = userNameee.value.trim();
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
        if (userNameee.value.startsWith(" ") || userNameee.value.endsWith(" ")) {
            usernameError.textContent = "should not have spaces at the beginning or end.";
        } else {
            usernameError.textContent = "Enter a userNameee with 3 to 32 characters";
        }
        return false;
    }
}

// Email Validation
function validateEmail() {
    const emailPattern = /^[a-zA-Z][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/;
    if (!emailPattern.test(email.value.trim())) {
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
signupBtn.addEventListener("click", async (event) => {
    event.preventDefault();
    const usernameValue = userNameee.value.trim();

    // Validate all fields
    const isValid =
        validateUsername() &&
        validateEmail() &&
        validatePassword() &&
        validateConfirmPassword();

    if (isValid) {
        try {
            // Create User with Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email.value.trim(),
                password.value.trim()
            );
            const user = userCredential.user;

            // Update user profile with display name
            await updateProfile(user, { displayName: usernameValue });

            // Save user details to Firestore
            const userDetailsRef = collection(db, "userDetails");
            const userDetails = {
                userName: usernameValue,
                userEmail: email.value.trim(),
                lastSignUp: new Date(),
            };

            // Write to Firestore
            await addDoc(userDetailsRef, userDetails);

            // Store user details in localStorage
            localStorage.setItem("user", JSON.stringify({ userNameee: usernameValue }));

            alert("Account created successfully!");
            console.log("User details saved to Firestore");

            // Reset the form fields after successful sign-up
            email.value = "";
            password.value = "";
            conPassword.value = "";
            userNameee.value = "";
        } catch (error) {
            console.error("Error during signup: ", error);

            // Handle Firebase Auth errors
            if (error.code === "auth/email-already-in-use") {
                emailError.textContent = "Email is already in use.";
            } else if (error.code === "auth/invalid-email") {
                emailError.textContent = "Invalid email format.";
            } else {
                emailError.textContent = "An error occurred. Please try again.";
            }
        }
    }
});


export async function getUsername(email){
    try{
        const q = query(collection(db,"userDetails"), where("userEmail", "==" , email));
        const qsnapshot = await getDocs(q);

        if(!qsnapshot.empty){
            const userDoc = qsnapshot.docs[0];
            const userData = userDoc.data();
            const userId = userDoc.id; 
        
        return { ...userData, id: userId };  
    } else {
      console.log('No user found with the provided email.');
      return null;
    }
  } catch (error) {
    console.error('Error fetching user details: ', error);
  }
}

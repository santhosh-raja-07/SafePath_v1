import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, updateProfile, signOut , onAuthStateChanged} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getUsername} from "./signup.js";
import {firebaseConfig } from "./config.js"
import { getDatabase, ref, set, get, child ,  update } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";


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
const alertMessage = document.getElementById('alert-message');

/* <button id="login-button">Login</button> */
const appendloginbtn = document.querySelector(".appendloginbtn")

// export let check = false
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
            checkIssueStatus()
            localStorage.setItem("role", JSON.stringify({ roleName: "user" }));
            alertMessage.style.background = "#4CAF50"
                alertMessage.textContent = "Login succesfully"
                alertMessage.classList.add('show')
                setTimeout(() => {
                    alertMessage.classList.remove('show');

                }, 2000); 


            displayLoggedInUI();
            // check = true
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

    const logoutButton = document.querySelector("#loginout"); 
    const loginButton = document.getElementById("login-button");

    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in
            const userDiv = document.querySelector(".username");
            appendloginbtn.style.display = "none"
            userDiv.style.color = "rgb(9, 98, 9)";
            logoutButton.textContent = "Logout";
            getUsername(user.email)
                .then((userDetails) => {
                    console.log("User Details:", userDetails);
                    if (userDetails) {
                        localStorage.setItem(
                            "user",
                            JSON.stringify({
                              userNameee: userDetails.userName,
                              useremail : userDetails.userEmail
                            })
                          );
                          
                          userDiv.textContent = userDetails.userName;
                    }
                })
                .catch((error) => {
                    console.error('Error fetching user details:', error);
                });

            logoutButton.addEventListener("click", () => {
                if(confirm("Are you want to logout")){
                    signOut(auth).then(() => {
                        localStorage.removeItem("role")
                        userDiv.textContent = ""; // Clear the username div
                        loginButton.style.display = "block";
                        appendloginbtn.style.display = "block"
                        updateUIOnLogout();
                    }).catch((error) => {
                      alert("Logout error: ", error);
                    });
                  }
            });
            console.log(userDiv)
        } else {
            loginButton.style.display = "block";
        }
    });


function updateUIOnLogout() {
   alert("You have successfully logged out.")
    window.location.reload();
}
    
}
const userdet = JSON.parse(localStorage.getItem("user")) ;
if (!userdet || !userdet.useremail) {
    console.error("Error: User or useremail is not defined in localStorage.");// Exit the function to avoid further errors
}

let issueStatusinFB = "";
let email = userdet.useremail;
async function checkIssueStatus() {
    email = email.replace(/[\.\#\$\[\]]/g, "_");

    const issuesRef = ref(getDatabase());
    const issueSubRef = child(issuesRef, `users/usermessage/${email}/issuseOpened`);
    
    try {
        const submitData = await get(issueSubRef);

        if (submitData.exists()) {
            issueStatusinFB = submitData.val().issueStatus;
            console.log("Issue Status:", issueStatusinFB);
            // localStorage.setItem("issuesStatus" , issueStatusinFB )
        } else {
            console.log("No issue status available");
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

const issuesPageButton = document.getElementById("issuespage");
    issuesPageButton.addEventListener("click", async() => {
        await checkIssueStatus()
        const user = auth.currentUser;
        // const checkForIssuesSubmit = JSON.parse(localStorage.getItem("issuesSubmit"))
        if(user && issueStatusinFB == "Submit"){
            window.location.href = "/assets/pages/usercomment.html"
        }
        else if(user && issueStatusinFB == "" ){
        window.location.href = "/assets/pages/report.html";
        }else{
            alertMessage.style.background = "red"
            alertMessage.textContent = "Please Login / Signup to access this page."
            alertMessage.classList.add('show')
            setTimeout(() => {
                alertMessage.classList.remove('show');
        
            }, 3000); 
        }
}); 



const checkForlogin  = JSON.parse(localStorage.getItem("role"))
console.log(checkForlogin)
if (checkForlogin && checkForlogin.roleName) {
onAuthStateChanged(auth, (user) => {
    const checkForlogin  = JSON.parse(localStorage.getItem("role"))
    if (user && checkForlogin.roleName === "user" ) {
       displayLoggedInUI();
    } 
    else if(checkForlogin.roleName === "lawyer"){
       window.location.href = "/assets/pages/lawyerHome.html"
    }
     else  {
        loginBtn.style.display = "block";
    }
});
} else {
    console.error('No role found in localStorage.');
    loginBtn.style.display = "block"; 
}



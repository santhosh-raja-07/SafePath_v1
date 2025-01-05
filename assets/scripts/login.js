import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, updateProfile, signOut , onAuthStateChanged} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getUsername} from "./signup.js";
import {firebaseConfig } from "./config.js"
import { getDatabase, ref, set, get, child ,  update , remove} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase()
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
const favicon = document.querySelector(".favicon")

/* <button id="login-button">Login</button> */
const appendloginbtn = document.querySelector(".appendloginbtn")
let em = ""
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
            //role set in firebase
            localStorage.setItem("userEmail", JSON.stringify({ clientEmail: loginEmail.value.trim() }));
           em =  loginEmail.value.trim()
           em = em.replace(/[\.\#\$\[\]]/g, "_")
            const roleRef = ref(database , `role/${em}`) 
            set(roleRef , {roleName : "user"})

            favicon.style.cursor = "pointer"
            favicon.disabled = false

            alertMessage.style.background = "#4CAF50"
                alertMessage.textContent = "Login succesfully"
                alertMessage.classList.add('show')
                setTimeout(() => {
                    alertMessage.classList.remove('show');
                }, 2000); 
                window.location.reload()
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

                        // const userRef = ref(database , "userdetails") 
                        // set(userRef , {
                        //     userName : userDetails.userName,
                        //     useremail : userDetails.userEmail
                        // })
                        localStorage.setItem("userEmail", JSON.stringify({ clientEmail: userDetails.userEmail }));
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
                        const roleRef = ref(database, `role/${em}`);
                        remove(roleRef);
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
    favicon.style.cursor = "not-allowed"
    favicon.disabled = true
   alert("You have successfully logged out.")
    window.location.reload();
}
    
}
const userdet = JSON.parse(localStorage.getItem("userEmail")) ;
if (!userdet || !userdet.clientEmail) {
    console.log("Error: User or useremail is not defined in localStorage.");// Exit the function to avoid further errors
}

let issueStatusinFB = "";
let email = userdet.clientEmail;
console.log(email)
async function checkIssueStatus() {
    if(!email){
        console.log("email not found")
    }
    else{
    email = email.replace(/[\.\#\$\[\]]/g, "_");
    }
    
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
console.log(issueStatusinFB)


const issuesPageButton = document.getElementById("issuespage");
    issuesPageButton.addEventListener("click", async() => {
        await checkIssueStatus()
        const user = auth.currentUser;

        console.log(issueStatusinFB)

        // const checkForIssuesSubmit = JSON.parse(localStorage.getItem("issuesSubmit"))
        if(user && issueStatusinFB == "Submit"){
            window.location.href = "/assets/pages/usercomment.html"
        }
 
        else if(user && issueStatusinFB == "Closed" || issueStatusinFB == "" ){
        window.location.href = "/assets/pages/report.html";
        }
        else if(user && issueStatusinFB == "Closed"){
            window.location.href = "/assets/pages/report.html";
        }
        else {
            alertMessage.style.background = "red"
            alertMessage.textContent = "Please Login / Signup to access this page."
            alertMessage.classList.add('show')
            setTimeout(() => {
                alertMessage.classList.remove('show')
            }, 3000); 
        }
}); 


const userEm = JSON.parse(localStorage.getItem("userEmail"));
em = userEm.clientEmail;

// Replace invalid characters for Firebase keys
if(!em){
    console.log("email not found")
}
else{
em = em.replace(/[\.\#\$\[\]]/g, "_");
}
console.log("Formatted em value:", em);

async function getRoleName() {
    try {
        const roleRef = ref(database, `role/${em}`);
        const snapshot = await get(roleRef);

        if (snapshot.exists()) {
            const roleData = snapshot.val();
            console.log("Role Data:", roleData);
            return roleData.roleName; 
        } else {
            console.log("Role Data is null. No data exists at this reference.");
            return null; 
        }
    } catch (error) {
        console.error("Error fetching role data:", error);
        return null; 
    }
}

let checkRole = "";

getRoleName()
    .then((x) => {
        checkRole = x;
        console.log("Check Role:", checkRole);

        if (checkRole) {
            onAuthStateChanged(auth, (user) => {
                if (user && checkRole === "user") {
                    favicon.style.cursor = "pointer"
                    favicon.disabled = false
                    displayLoggedInUI();
                } else if (checkRole === "lawyer") {
                    window.location.href = "/assets/pages/lawyerHome.html";
                } else {
                    loginBtn.style.display = "block";
                    favicon.style.cursor = "not-allowed"
                    favicon.disabled = true
                }
            });
        } else {
            console.log('No role found in database.');
            loginBtn.style.display = "block";
            favicon.style.cursor = "not-allowed"
            favicon.disabled = true
        }
    })
    .catch((error) => {
        console.error("Error fetching role:", error);
        loginBtn.style.display = "block";
        favicon.style.cursor = "not-allowed"
        favicon.disabled = true
    });

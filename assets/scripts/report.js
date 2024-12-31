import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {firebaseConfig } from "./config.js"
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import {getAuth , signOut , onAuthStateChanged} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getDatabase, ref, set, get, child ,  update } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const database = getDatabase();


document.addEventListener("DOMContentLoaded", () => {

  const usernameDisplay = document.getElementById("username");
  const errorPopup = document.getElementById("error-popup");
  const closePopupButton = document.getElementById("close-popup");
  const submitButton = document.getElementById("submit-btn");

  // Load user data
  const userData = JSON.parse(localStorage.getItem("user")) || { userNameee: "Guest" };
  usernameDisplay.textContent = userData.userNameee;

window.history.forward()
function PreventBack(){
  window.history.forward()
}
  // Event listener for submit button
  submitButton.addEventListener("click", async () => {
    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    const category = document.getElementById("category").value.trim();
    const ageCategory = document.getElementById("ageCategory").value.trim();

    if (!title || !description || !category || !ageCategory) {
      showErrorPopup("Please fill in all required fields!");
    } else {
      console.log("Issue submitted:", { title, description, category, ageCategory });

      try {
        const user = auth.currentUser;
        if (user) {
          const userIssuesRef = collection(db, "userIssues");
          const issuesObj = {
            userId: user.uid,  
            Name: userData.userNameee, 
            email: user.email,
            issuesTitle: title,
            issuesDescription: description,
            categoryOfIssues: category,
            ageCategory: ageCategory,
            timestamp: new Date().toISOString(),
          };
  
          await addDoc(userIssuesRef, issuesObj); 
          showErrorPopup("Issue submitted successfully!");
          console.log("Issue successfully submitted!");

          // set issuestatus in firebase
          let email = user.email;
          email = email.replace(/[\.\#\$\[\]]/g, "_");
             
          const userRef = ref(database, `users/usermessage/${email}/issuseOpened`);
          const submitData = {
                issueStatus : "Submit"
          };
          await set(userRef, submitData);
          console.log("Data has been written successfully!");

        } else {
          showErrorPopup("User is not authenticated.");
        }
      } catch (error) {
        console.error("Error storing details:", error);
      }
    }
  });



    const logoutButton = document.querySelector("#loginout"); 

    onAuthStateChanged(auth, (user) => {
        if (user) {
            const userDiv = document.querySelector(".username");
            userDiv.textContent = userData.userNameee
            userDiv.style.color = "rgb(9, 98, 9)";
            logoutButton.textContent = "Logout";

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

  function showErrorPopup(message) {
    document.getElementById("popup-message").textContent = message;
    errorPopup.classList.remove("hidden");
    setTimeout(() => {
      window.location.href= "/assets/pages/usercomment.html";
     PreventBack();
  }, 3000);
  }

  // Close popup
  closePopupButton.addEventListener("click", () => {
    errorPopup.classList.add("hidden");
  });

  // Navigation functionality
  document.getElementById("home-page").addEventListener("click", () => {
    window.location.href = "/index.html";
  });
  console.log(userData)
});

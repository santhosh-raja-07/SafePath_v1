import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {firebaseConfig } from "../../config.js"
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


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
  submitButton.addEventListener("click", () => {
    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    const category = document.getElementById("category").value.trim();
    const ageCategory = document.getElementById("ageCategory").value.trim();

    if (!title || !description || !category  || !ageCategory) {
      showErrorPopup("Please fill in all required fields!");
    } else {
      console.log("Issue submitted:", { title, description, category, ageCategory });
      const userIssuesRef = collection(db, "userIssues" );
      const issuesObj = {
        Name : userData.userNameee,
        issuesTitle: title,
        issuesDescription: description,
        categoryOfIssues: category,
        ageCategory :ageCategory,
        timestamp: new Date().toISOString(),
      }
      addDoc(userIssuesRef, issuesObj)
      showErrorPopup("Issue submitted successfully!")
    .then(() => {
      console.log("Issue successfully submitted!");
    })
    .catch((error) => {
      console.error("Error storing details:", error);
      alert("An error occurred while submitting the issue.");
    });
    }
  });


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
});

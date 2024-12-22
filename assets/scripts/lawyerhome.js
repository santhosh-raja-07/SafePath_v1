import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { firebaseConfig } from "./config.js";
import { 
    getFirestore, 
    collection, 
    getDocs 
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut  } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getUsername } from "./forAthu.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); 
const db = getFirestore(app);
const userIssues = [];


async function fetchUserIssues() {
    try {
        const userIssuesCollectionRef = collection(db, "userIssues");
        const userIssuesSnapshot = await getDocs(userIssuesCollectionRef);

        userIssuesSnapshot.forEach((doc) => {
            const issueData = doc.data();
            userIssues.push(issueData);
        });

        console.log("Fetched User Issues:", userIssues);

        // Update the DOM after fetching data
        displayUserIssues();
    } catch (error) {
        console.error("Error fetching user issues:", error);
    }
}

 function displayUserIssues() {
    const mainDiv = document.getElementById("main-div");

    userIssues.forEach((x, index) => {
        const div1 = document.createElement("div");
        div1.classList.add("details");

        div1.innerHTML = `
            <div>
                <i class="fa-solid fa-circle-user"></i>
                <h5>${x.Name}</h5>
            </div>
            <h4>${x.issuesTitle}</h4>
            <span class="toggle-view" data-index="${index}">Quick view <i class="fa-solid fa-angle-right arrow" id="arrow-${index}"></i></span>`;

        const div2 = document.createElement("div");
        div2.classList.add("moredetails", "hidden");
        div2.id = `details-${index}`;

        div2.innerHTML = `
            <div>
                <h4>Status</h4>
                <span>Waiting for lawyer</span>
            </div>
            <div>
                <h4>Category</h4>
                <span>${x.categoryOfIssues}</span>
            </div>
            <div>
                <h4>Age Category</h4>
                <span>${x.ageCategory}</span>
            </div>
            <div><button class="checkIssue">Open</button></div>`;

        mainDiv.appendChild(div1);
        mainDiv.appendChild(div2);

        div1.querySelector(".toggle-view").addEventListener("click", () => {
            const arrow = document.getElementById(`arrow-${index}`);
            const detailsDiv = document.getElementById(`details-${index}`);
            const isVisible = !detailsDiv.classList.contains("hidden");

            if (isVisible) {
                arrow.classList.remove("fa-angle-down");
                arrow.classList.add("fa-angle-right");
                detailsDiv.classList.add("hidden");
                
            } else {
                arrow.classList.remove("fa-angle-right");
                arrow.classList.add("fa-angle-down");
                detailsDiv.classList.remove("hidden");
            }
        });

        // if lawyer click open btn that lawyer go to userissue page
        const checkIssueButton = div2.querySelector(".checkIssue");
        checkIssueButton.addEventListener("click", () => {
            window.location.href = "/assets/pages/userissue.html";
        });

    });
    document.querySelector(".loading").style.display = "none";
}


function searchIssues() {
    const searchInput = document.querySelector(".search-input");
    const filter = searchInput.value.toUpperCase();
    const issueDivs = document.querySelectorAll(".details");
    let foundMatch = false;

    issueDivs.forEach(div => {
        const title = div.querySelector("h4").textContent.toUpperCase() || div.querySelector("h4").innerText.toUpperCase();
        if (title.includes(filter)) {
            div.style.display = ""; 
            foundMatch = true;
        } else {
            div.style.display = "none"; 
        }
    });

    const notFoundMessage = document.querySelector(".not-found-message");
    if (!foundMatch) {
        if (!notFoundMessage) {
            const messageDiv = document.createElement("div");
            messageDiv.classList.add("not-found-message");
            messageDiv.textContent = "No issues found matching your search.";
            document.getElementById("main-div").appendChild(messageDiv);
        }
    } else {
        if (notFoundMessage) {
            notFoundMessage.remove();
        }
    }

document.getElementById("clear").addEventListener("click" , ()=>{
    if(searchInput.value !== ""){
        searchInput.value = ""
        searchIssues()
    }
})

}

document.querySelector(".search-input").addEventListener("input", searchIssues);
fetchUserIssues();

const logoutButton = document.getElementById("loginout");
const userData = JSON.parse(localStorage.getItem('user'));
onAuthStateChanged(auth, async (user) => {
    if (user) {
        const email = user.email; 
        try {
            const lawyerDetails = await getUsername(email);
            if (lawyerDetails) {
                const userDiv1 = document.querySelector(".lawyername");
                const userDiv2 = document.getElementById("lawyerEm");
                const userDiv3 = document.getElementById("LawyerID");
                const userDiv4 = document.getElementById("lawyerCat");
                const userDiv5 = document.getElementById("lawyerExp");

                logoutButton.textContent = "Logout";

                userDiv1.textContent = lawyerDetails.lawyerName;
                userDiv2.textContent = lawyerDetails.lawyerEmail;
                userDiv3.textContent = lawyerDetails.id;
                userDiv4.textContent = lawyerDetails.lawCategory;
                userDiv5.textContent = lawyerDetails.experience;
            } else {
                console.log("No lawyer details found.");
            }
        } catch (error) {
            console.error("Error fetching lawyer details:", error);
        }
    } else {
        console.log("No user is signed in.");
    }

    logoutButton.addEventListener("click", () => {
        if (confirm("Are you sure you want to logout?")) {
            localStorage.removeItem("role");
            signOut(auth)
                .then(() => {
                    updateUIOnLogout();
                })
                .catch((error) => {
                    alert("Logout error: " + error.message);
                });
        }
    });
});


function updateUIOnLogout() {
    alert("You have successfully logged out.");
    window.location.href = "/index.html";
}
console.log(userData)


import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { firebaseConfig } from "./config.js";
import { getAuth, onAuthStateChanged, signOut  } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
// import { getFirestore, collection, addDoc , doc} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import { getUsername } from "./forAthu.js";
import { userIssues } from "./allissues.js";
import { getDatabase, ref, set, get, child ,  update } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";
// import {messageStored , msgDocRef} from "./messageStorage.js"
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); 
const db = getDatabase();



displayUserIssues();

 function displayUserIssues() {
    const mainDiv = document.getElementById("main-div");

    userIssues.forEach((x, index) => {
        const div1 = document.createElement("div");
        div1.classList.add("details");
        div1.id = `det-${index}`

        div1.innerHTML = `
            <div>
                <i class="fa-solid fa-circle-user"></i>
                <h5 id="user-${index}">${x.Name}</h5>
            </div>
            <h4 id = "issuesTit-${index}">${x.issuesTitle}</h4>
            <span class="toggle-view" data-index="${index}">Quick view <i class="fa-solid fa-angle-right arrow" id="arrow-${index}"></i></span>`;

        const div2 = document.createElement("div");
        div2.classList.add("moredetails", "hidden");
        div2.id = `details-${index}`;

        div2.innerHTML = `
            <div>
                <h4>Status</h4>
                <span id="status-${index}">Unassigned</span>
            </div>
            <div style="display: none;"  id="issuesDes-${index}">${x.issuesDescription}</div>
            <div style="display: none;"  id="clientemail-${index}">${x.email}</div>
            <div>
                <h4>Category</h4>
                <span id="issuesCat-${index}">${x.categoryOfIssues}</span>
            </div>
            <div>
                <h4>Age Category</h4>
                <span id="ageCat-${index}">${x.ageCategory}</span>
            </div>
            <div><button class="checkIssue" id="checkIssue-${index}">Open</button></div>`;

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


        const lawyerEmail = JSON.parse(localStorage.getItem("lawyerEmail"));

        // if lawyer click open btn that lawyer go to user page
const checkIssueButton = div2.querySelector(`#checkIssue-${index}`);
        
checkIssueButton.addEventListener("click", async () => {
    
    checkIssueButton.addEventListener("click", async () => {
        const clientName = div1.querySelector(`#user-${index}`);
        const clientIssue = div1.querySelector(`#issuesTit-${index}`);
        const clientIssueCat = div2.querySelector(`#issuesCat-${index}`);
        const clientAge = div2.querySelector(`#ageCat-${index}`);
        const issuesDes = div2.querySelector(`#issuesDes-${index}`);
        const clientEmail = div2.querySelector(`#clientemail-${index}`);
        const statusOfIssue = div2.querySelector(`#status-${index}`)
        statusOfIssue.textContent = "Assigned";
    
        localStorage.setItem("userIssue", JSON.stringify({
            clientName: clientName.textContent,
            clientIssue: clientIssue.textContent,
            clientIssueCat: clientIssueCat.textContent,
            clientAge: clientAge.textContent,
            issuesDes: issuesDes.textContent,
            clientEmail: clientEmail.textContent,
            lawyerEmail: lawyerEmail.lawyerEmail,
        }));
    
        try {
            let email = lawyerEmail.lawyerEmail;
            email = email.replace(/[\.\#\$\[\]]/g, "_");
    
            // Update issue status in Firebase
            const lawyerRef = ref(db, `users/lawyermessage/${email}/issuseOpened`);
            await set(lawyerRef, { issueStatus: "Submit" });
    
            console.log("Issue status set to Submit. Redirecting...");
            window.location.href = "/assets/pages/usercomment.html";
        } catch (error) {
            console.error("Error updating issue status:", error);
        }
    });
    
    
    try {
        let email = userDiv2.textContent;
        email = email.replace(/[\.\#\$\[\]]/g, "_");
    
        const userRef = ref(db, `users/lawyermessage/${email}`);
        const data = {
            msg1: "hii"
        };
        await set(userRef, data);
        console.log("Data has been written successfully!");
    
    } catch (error) {
        console.error("Error writing data to Firebase:", error);
    }

    try {
        const clientEM = JSON.parse(localStorage.getItem("userIssue"))
        console.log(clientEM)
        let email = clientEM.clientEmail;
        email = email.replace(/[\.\#\$\[\]]/g, "_");
    
        const userRef = ref(db, `users/usermessage/${email}`);
        const data = {
            msg1: "hii"
        };
        await set(userRef, data);
        console.log("Data has been written successfully!");
    
        window.location.href = "/assets/pages/usercomment.html";
    } catch (error) {
        console.error("Error writing data to Firebase:", error);
    }
   
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

let userDiv2 = ""
const logoutButton = document.getElementById("loginout");
// const userData = JSON.parse(localStorage.getItem('user'));
let issueStatusinFB = "";
async function checkIssueStatus(email) {

    email = email.replace(/[\.\#\$\[\]]/g, "_");

    const issuesRef = ref(getDatabase());
    const issueSubRef = child(issuesRef, `users/lawyermessage/${email}/issuseOpened`);
    try {
        const submitData = await get(issueSubRef);

        if (submitData.exists()) {
            issueStatusinFB = submitData.val().issueStatus;
            console.log("Issue Status in FB:", issueStatusinFB);
        } else {
            console.log("No issue status available");
        }
    } catch (error) {
        console.error("Error fetching data from Firebase:", error);
    }
}

// Fetch user details
onAuthStateChanged(auth, async (user) => {
    if (user) {
        const email = user.email;
        try {
            const lawyerDetails = await getUsername(email);
            if (lawyerDetails) {
                const userDiv1 = document.querySelector(".lawyername");
                userDiv2 = document.getElementById("lawyerEm");
                const userDiv3 = document.getElementById("LawyerID");
                const userDiv4 = document.getElementById("lawyerCat");
                const userDiv5 = document.getElementById("lawyerExp");

                logoutButton.textContent = "Logout";

                userDiv1.textContent = lawyerDetails.lawyerName;
                userDiv2.textContent = lawyerDetails.lawyerEmail;
                userDiv3.textContent = lawyerDetails.id;
                userDiv4.textContent = lawyerDetails.lawCategory;
                userDiv5.textContent = lawyerDetails.experience;

                localStorage.setItem("lawyerEmail", JSON.stringify({ 
                    lawyerEmail: userDiv2.textContent,
                    lawyerName : userDiv1.textContent,
                    lawyerId : userDiv3.textContent,
                    lawyerCat : userDiv4.textContent,
                    lawyerExperience : userDiv5.textContent
                }));

                await checkIssueStatus(userDiv2.textContent);
                if (issueStatusinFB === "Submit") {
                    window.location.href = "/assets/pages/usercomment.html";
                }

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


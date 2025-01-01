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

const lawyerDetAfterSUp = JSON.parse(localStorage.getItem("user"))

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

        const getuserEmailElement = div2.querySelector(`#clientemail-${index}`);
        const userEmail = getuserEmailElement?.textContent.trim();
        let lawyercheck = "";
let email = "";
let foundId = "";

if (userEmail) {
    const dbRef = ref(getDatabase());
    const getUserEmailRef = child(dbRef, "users/usermessage");

    get(getUserEmailRef)
        .then(async (snapshot) => {
            if (snapshot.exists()) {
                const userEm = snapshot.val();

                for (const key in userEm) {
                    const replacedKey = key.replace("_", ".");
                    email = replacedKey.replace(/[\.\#\$\[\]]/g, "_");  
                    
                    const emailPath = `users/usermessage/${email}/lawyerAssigned`;
                    console.log("Checking path:", emailPath);  

                    const getlawyerAssignRef = child(dbRef, emailPath);

                    try {
                        const getlawyerAssignSnapshot = await get(getlawyerAssignRef);

                        if (getlawyerAssignSnapshot.exists()) {
                            const lawyerAssignedData = getlawyerAssignSnapshot.val();
                            console.log("lawyerAssigned Data:", lawyerAssignedData);

                            // Access the nested lawyerAssigned field and check if it is "Assigned"
                            if (lawyerAssignedData && lawyerAssignedData.lawyerAssigned && lawyerAssignedData.lawyerAssigned === "Assigned") {
                                lawyercheck = "Assigned";
                            }
                        } else {
                            console.log("Snapshot does not exist for email:", email);
                        }

                        // Check condition after fetching the data
                        if (replacedKey === userEmail && lawyercheck === "Assigned") {
                            findIdByValue(userEmail);
                            break;  // Exit the loop once the condition is met
                        }

                    } catch (error) {
                        console.error("Error fetching lawyerAssigned data:", error);
                    }
                }
            } else {
                console.log("No user messages available.");
            }
        })
        .catch((error) => {
            console.error("Error fetching user messages:", error);
        });
} else {
    console.log("No user email found in the element.");
}

function findIdByValue(valueToFind) {
    const allDivs = div2.querySelectorAll("div");
    for (const div of allDivs) {
        if (div.textContent.trim() === valueToFind) {
            foundId = div.id;
            break;
        }
    }

    if (foundId) {
        const idIndex = foundId.split("-").pop();
        const foundBtn = div2.querySelector(`#checkIssue-${idIndex}`);
        if (foundBtn) {
            console.log(foundBtn);
            foundBtn.style.backgroundColor = "#7c7d7d";
            foundBtn.style.cursor = "not-allowed";
            foundBtn.disabled = true;
        }
    }
}

        


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
        const clientName = div1.querySelector(`#user-${index}`);
        const clientIssue = div1.querySelector(`#issuesTit-${index}`);
        const clientIssueCat = div2.querySelector(`#issuesCat-${index}`);
        const clientAge = div2.querySelector(`#ageCat-${index}`);
        const issuesDes = div2.querySelector(`#issuesDes-${index}`);
        const clientEmail = div2.querySelector(`#clientemail-${index}`);
        const statusOfIssue = div2.querySelector(`#status-${index}`)
        statusOfIssue.textContent = "Assigned";
        

        const lawyerEmailValue = lawyerEmail?.lawyerEmail || lawyerDetAfterSUp?.lawyerEmail;
        const userIssue = {
            clientName: clientName.textContent,
            clientIssue: clientIssue.textContent,
            clientIssueCat: clientIssueCat.textContent,
            clientAge: clientAge.textContent,
            issuesDes: issuesDes.textContent,
            clientEmail: clientEmail.textContent,
            lawyerEmail: lawyerEmailValue,
        };
        console.log("Saving userIssue to localStorage:", userIssue);
        localStorage.setItem("userIssue", JSON.stringify(userIssue));
        console.log("Stored userIssue in localStorage:", localStorage.getItem("userIssue"));

    
        try {
            let email = "";
            let email1 = null;
            let email2 = null;
        
            if (lawyerDetAfterSUp && lawyerDetAfterSUp.lawyerEmail) {
                email1 = lawyerDetAfterSUp.lawyerEmail;
            }
            if (lawyerEmail && lawyerEmail.lawyerEmail) {
                email2 = lawyerEmail.lawyerEmail;
            }
            if (email1 && email1 !== "") {
                email = email1.replace(/[\.\#\$\[\]]/g, "_");
            } else if (email2 && email2 !== "") {
                email = email2.replace(/[\.\#\$\[\]]/g, "_");
            }
        
            if (!email) {
                throw new Error("Email is invalid or undefined.");
            }
            const lawyerRef = ref(db, `users/lawyermessage/${email}/issuseOpened`);
            await set(lawyerRef, { issueStatus: "Submit" });
        
            console.log("Issue status set to Submit. Redirecting...");
        } catch (error) {
            console.error("Error updating issue status:", error);
        }
    
    
    try {
        let email = "";
            let email1 = null;
            let email2 = null;
        
            if (lawyerDetAfterSUp && lawyerDetAfterSUp.lawyerEmail) {
                email1 = lawyerDetAfterSUp.lawyerEmail;
            }
            if (userDiv2.textContent) {
                email2 = userDiv2.textContent;
            }
            if (email1 && email1 !== "") {
                email = email1.replace(/[\.\#\$\[\]]/g, "_");
            } else if (email2 && email2 !== "") {
                email = email2.replace(/[\.\#\$\[\]]/g, "_");
            }
    
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
        const clientEM = JSON.parse(localStorage.getItem("userIssue"));
        console.log("Stored userIssue in localStorage:", clientEM); // Debugging line
    
        if (!clientEM) {
            console.error("Error: No user issue found in localStorage.");
            return; // Exit if no user issue is found
        }
    
        console.log(clientEM);
    
        const email1 = clientEM.clientEmail;
        if (!email1) {
            console.error("Error: clientEmail is missing in the stored user issue.");
            return; // Exit if clientEmail is missing
        }
    
        const sanitizedEmail = email1.replace(/[\.\#\$\[\]]/g, "_");
    
        const userRef = ref(db, `users/usermessage/${sanitizedEmail}`);
        const data = {
            msg1: "hii"
        };
    
        await set(userRef, data);
        const userRefcence = ref(db, `users/usermessage/${sanitizedEmail}/issuseOpened`);
        const submitData = {
            issueStatus : "Submit"
        };
        await set(userRefcence, submitData);
        console.log("Data has been written successfully!");

        
    
        window.location.href = "/assets/pages/usercomment.html";
    } catch (error) {
        console.error("Error writing data to Firebase:", error);
    }
    
});


    });

    document.querySelector(".loading").style.display = "none";
}

document.getElementById("home-page").addEventListener("click", ()=>{
    alert("You are already on the home page")
})

document.getElementById("chart-page").addEventListener("click" , ()=>{
    window.location.href = "/assets/pages/chart.html"
})

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



const userDiv1 = document.querySelector(".lawyername");
 userDiv2 = document.getElementById("lawyerEm");
const userDiv3 = document.getElementById("LawyerID");
const userDiv4 = document.getElementById("lawyerCat");
const userDiv5 = document.getElementById("lawyerExp");

// Check if lawyer details exist in localStorage
if (lawyerDetAfterSUp && lawyerDetAfterSUp.lawyerName) {
    populateLawyerDetails(lawyerDetAfterSUp);
} else {
    console.log("No lawyer details found in localStorage or lawyerName is empty.");
}

// Monitor authentication state
onAuthStateChanged(auth, async (user) => {
    if (user) {
        const email = user.email;
        console.log("User is signed in:", email)
        try {
            const lawyerDetails = await getUsername(email);
            if (lawyerDetails) {
                populateLawyerDetails(lawyerDetails);

                await checkIssueStatus(lawyerDetails.lawyerEmail);
                if (issueStatusinFB === "Submit") {
                    window.location.href = "/assets/pages/usercomment.html";
                }
            } else {
                console.log("No lawyer details found for the user.");
            }
        } catch (error) {
            console.error("Error fetching lawyer details:", error);
        }
    } else {  
        console.log("No user is signed in.");
    }
});

// Function to populate lawyer details in the UI and localStorage
function populateLawyerDetails(details) {
    if (!details) {
        console.error("Cannot populate lawyer details: Details are null or undefined.");
        return;
    }

    userDiv1.textContent = details.lawyerName || "N/A";
    userDiv2.textContent = details.lawyerEmail || "N/A";
    userDiv3.textContent = details.lawyersId || details.id || "N/A";
    userDiv4.textContent = details.lawCategory || "N/A";
    userDiv5.textContent = details.experience || "N/A";
    userDiv1.style.color = "rgb(9, 98, 9)"
    logoutButton.textContent = "Logout"
    localStorage.setItem("lawyerEmail", JSON.stringify({
        lawyerEmail: details.lawyerEmail,
        lawyerName: details.lawyerName,
        lawyerId: details.lawyersId || details.id,
        lawyerCat: details.lawCategory,
        lawyerExperience: details.experience,
    }));

    console.log("Lawyer details populated in UI and localStorage.");
}

// Logout functionality
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

// Function to handle UI updates on logout
function updateUIOnLogout() {
    alert("You have successfully logged out.");
    window.location.href = "/index.html";
}



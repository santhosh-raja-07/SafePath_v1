import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { firebaseConfig } from "./config.js";
import { getAuth, onAuthStateChanged, signOut  } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
// import { getFirestore, collection, addDoc , doc} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import { getUsername } from "./forAthu.js";
import { userIssues } from "./allissues.js";
import { getDatabase, ref, set, get, child ,  update , remove} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";
// import {messageStored , msgDocRef} from "./messageStorage.js"
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); 
const db = getDatabase();

const lawyerDetAfterSUp = JSON.parse(localStorage.getItem("userEmail"))


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
                <span id="status-${index}" class="issueStatus">Unassigned</span>
            </div>
            <div style="display: none;"   id="issuesDes-${index}">${x.issuesDescription}</div>
            <div style="display: none;"  id="clientemail-${index}">${x.email}</div>
            <div>
                <h4>Category</h4>
                <span class="categoryOfIssues" id="issuesCat-${index}">${x.categoryOfIssues}</span>
            </div>
            <div>
                <h4>Age Category</h4>
                <span class="ageCategory" id="ageCat-${index}">${x.ageCategory}</span>
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
                let buttonDisabled = false; // Track if the button should be disabled

                for (const key in userEm) {
                    const replacedKey = key.replace("_", ".");
                    email = replacedKey.replace(/[\.\#\$\[\]]/g, "_");

                    const emailPath = `users/usermessage/${email}/lawyerAssigned`;

                    const getlawyerAssignRef = child(dbRef, emailPath);

                    try {
                        const getlawyerAssignSnapshot = await get(getlawyerAssignRef);

                        if (getlawyerAssignSnapshot.exists()) {
                            const lawyerAssignedData = getlawyerAssignSnapshot.val();

                            if (
                                lawyerAssignedData &&
                                lawyerAssignedData.lawyerAssigned &&
                                lawyerAssignedData.lawyerAssigned === "Assigned"
                            ) {
                                lawyercheck = "Assigned";
                            }
                        } else {
                            // Handle case where lawyerAssigned does not exist
                            lawyercheck = "Not Assigned";
                        }

                        if (replacedKey === userEmail && lawyercheck === "Assigned") {
                            findIdByValue(userEmail);
                            buttonDisabled = true; // Mark button as disabled
                            break; // Exit the loop once the condition is met
                        }

                    } catch (error) {
                        console.error("Error fetching lawyerAssigned data:", error);
                    }
                }

                // Handle the button state if no match is found or lawyerAssigned is missing
                if (!buttonDisabled) {
                    notFindValue(userEmail);
                }
            }
        })
        .catch((error) => {
            console.error("Error fetching user messages:", error);
        });
        const closedRef = ref(db , `closedIssues`)
        get(closedRef).then((x)=>{
            if(x.exists()){
                if(x.val().userEmail === userEmail){
                    const allDivs = div2.querySelectorAll("div");
                    for (const div of allDivs) {
                        if (div.textContent.trim() === userEmail) {
                            foundId = div.id;
                            break;
                        }
                    }
                    if (foundId) {
                        const idIndex = foundId.split("-").pop();
                        const foundBtn = div2.querySelector(`#checkIssue-${idIndex}`);
                        if (foundBtn) {
                            console.log(foundBtn);
                            foundBtn.style.backgroundColor = "#af2608";
                            foundBtn.textContent = "Closed"
                            foundBtn.style.cursor = "not-allowed";
                            foundBtn.disabled = true;
                            console.log("Button updated successfully:", foundBtn);
                        }
                    }
                }
            }
            else{
            console.log("closed issues not found")
            }
        })

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
        if (foundBtn && foundBtn.textContent != "Closed") {
            console.log(foundBtn);
            foundBtn.textContent = "Inprogress"
            foundBtn.style.backgroundColor = "#7c7d7d";
            foundBtn.style.cursor = "not-allowed";
            foundBtn.disabled = true;
        }
    }
}

function notFindValue(valueToFind) {
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
            foundBtn.style.backgroundColor = "rgb(9, 98, 9)";
            foundBtn.style.cursor = "pointer";
            foundBtn.disabled = false;
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
        
let clinetEmail = clientEmail.textContent
        const lawyerEmailValue = lawyerDetAfterSUp.clientEmail;
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

        let em = lawyerEmailValue
        em = em.replace(/[\.\#\$\[\]]/g, "_")
        const issueRef = ref(db , `OpendIssues/${em}/userIssue`)
        set (issueRef,{
            clientName: clientName.textContent,
            clientIssue: clientIssue.textContent,
            clientIssueCat: clientIssueCat.textContent,
            clientAge: clientAge.textContent,
            issuesDes: issuesDes.textContent,
            clientEmail: clientEmail.textContent,
            lawyerEmail: lawyerEmailValue,
            status : "Submit"
        })

        
        console.log("Stored userIssue in localStorage:", localStorage.getItem("userIssue"));
        console.log("Stored userIssue in Fb below the lawyeremail:", em);
    
        try {
            let email = "";
            let email1 = null;
            let email2 = null;
        
            if (clinetEmail) {
                email1 = clinetEmail;
            }
            if (lawyerEmail && lawyerEmail.lawyerEmail) {
                email2 = lawyerEmail.lawyerEmail;
            }
            if (email1 && email1 !== "") {
                email = email1.replace(/[\.\#\$\[\]]/g, "_");
            } else if (email2 && email2 !== "") {
                email2 = email2.replace(/[\.\#\$\[\]]/g, "_");
            }
        
            if (!email2) {
                throw new Error("Email is invalid or undefined.");
            }
            const lawyerRef = ref(db, `users/lawyermessage/${email2}/issuseOpened`);
            await set(lawyerRef, { issueStatus: "Submit" });
        
            console.log("Issue status set to Submit. Redirecting...");
        } catch (error) {
            console.error("Error updating issue status:", error);
        }
    
    
    try {
        
            let email1 = null;
            let email2 = null;
        
            if (clinetEmail) {
                email1 = clinetEmail;
            }
            if (userDiv2.textContent) {
                email2 = userDiv2.textContent;
            }
            if (email1 && email1 !== "") {
                email = email1.replace(/[\.\#\$\[\]]/g, "_");
            } else if (email2 && email2 !== "") {
                email2 = email2.replace(/[\.\#\$\[\]]/g, "_");
            }
    
        const userRef = ref(db, `users/lawyermessage/${email2}`);
        const data = {
            msg1: "hii"
        };
        await set(userRef, data);

        const userRefcence = ref(db, `users/usermessage/${email2}/issuseOpened`);
        const submitData = {
            issueStatus : "Submit"
        };
        await set(userRefcence, submitData);
        console.log("Data has been written successfully!");
    
    } catch (error) {
        console.error("Error writing data to Firebase:", error);
    }

    try {
        const clientEM = clinetEmail;

        console.log("Stored userIssue in localStorage:", clientEM); // Debugging line
    
        if (!clientEM) {
            console.error("Error: No user issue found in localStorage.");
            return; // Exit if no user issue is found
        }
    
        console.log(clientEM);
    
        const email1 = clientEM;
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

let valCount = 0;
function filter(){
    let filterItems = document.querySelectorAll(".filterItems");
    filterItems.forEach((e)=>{
        if(e.value != ""){
            valCount++
        }
    })

    if(valCount === 0){
        document.getElementById("error").textContent = "Select atleast one filter"
        document.getElementById("error").style.color = "red"
        document.getElementById("error").style.marginLeft = "3rem"
        return;
    }
    let filterArr= [];
    filterItems.forEach((element)=>{
        document.getElementById("error").textContent = ""
        if(element.value.trim() !== ""){
            filterArr.push({[element.id] : element.value})
        }
    })
    let cardArr = document.querySelectorAll(".moredetails");

    cardArr.forEach((element)=>{
        let count = 0;
        filterArr.forEach((e)=>{
           let key = Object.keys(e);
           let value = e[key[0]];
           let content = element.querySelector(`.${key[0]}`);
           if(content.textContent === value){
            count++
           }
        })
        console.log(count);
        
        if(count === filterArr.length){
            element.previousElementSibling.style.display = "block"
        }
        else{
            element.previousElementSibling.style.display = "none"
        }
    })

}

function cancelFilter(){
      if(valCount != 0){
        window.location.reload()
      }
}

document.getElementById("filter-btn").addEventListener("click" , filter)
document.getElementById("can-filter").addEventListener("click",cancelFilter)


const userDiv1 = document.querySelector(".lawyername");
 let userDiv2 = document.getElementById("lawyerEm");
const userDiv3 = document.getElementById("LawyerID");
const userDiv4 = document.getElementById("lawyerCat");
const userDiv5 = document.getElementById("lawyerExp");
const logoutButton = document.getElementById("loginout");
// const userData = JSON.parse(localStorage.getItem('user'));
let clientEmailInIssues = "";
async function checkIssueStatus(email) {

    email = email.replace(/[\.\#\$\[\]]/g, "_");
    const issuesRef = ref(getDatabase());
    const issueSubRef = child(issuesRef, `OpendIssues/${email}/userIssue`);
    try {
        const submitData = await get(issueSubRef);

        if (submitData.exists()) {
            const data = submitData.val();
            clientEmailInIssues = data.clientEmail || "";
            console.log("Issue Status in FB:", clientEmailInIssues);
            if (clientEmailInIssues && clientEmailInIssues !== "") {
                console.log("clientData stored in localStorage:", clientEmailInIssues);
                window.location.href = "/assets/pages/usercomment.html";
            } else {
                console.log("Client email is empty or invalid.");
            }
        } else {
            console.log("No issue status available.");
        }
    } catch (error) {
        console.error("Error fetching data from Firebase:", error);
    }
}

// Inside the onAuthStateChanged callback
onAuthStateChanged(auth, async (user) => {
    if (user) {
        const email = user.email;
        console.log("User is signed in:", email);
        try {
            const lawyerDetails = await getUsername(email);
            console.log("User is signed in:", lawyerDetails.lawyerEmail);
            if (lawyerDetails) {
                console.log(lawyerDetails.lawyerName)
                userDiv1.textContent = lawyerDetails.lawyerName || "N/A";
                userDiv2.textContent = lawyerDetails.lawyerEmail || "N/A";
                userDiv3.textContent = lawyerDetails.lawyersId || lawyerDetails.id || "N/A";
                userDiv4.textContent = lawyerDetails.lawCategory || "N/A";
                userDiv5.textContent = lawyerDetails.experience || "N/A";
                userDiv1.style.color = "rgb(9, 98, 9)"
                logoutButton.textContent = "Logout"
                localStorage.setItem("lawyerEmail", JSON.stringify({
                    lawyerEmail: lawyerDetails.lawyerEmail,
                    lawyerName: lawyerDetails.lawyerName,
                    lawyerId: lawyerDetails.lawyersId || lawyerDetails.id,
                    lawyerCat: lawyerDetails.lawCategory,
                    lawyerExperience: lawyerDetails.experience,
                }));

                const lawEm = JSON.parse(localStorage.getItem("lawyerEmail"));
                if (lawEm && lawEm.lawyerEmail) {
                    await checkIssueStatus(lawEm.lawyerEmail);
                } else {
                    console.log("No lawyer email found in localStorage.");
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


// if (lawyerDetAfterSUp && lawyerDetAfterSUp.lawyerName) {
//     populateLawyerDetails(lawyerDetAfterSUp);
// } else {
//     console.log("No lawyer details found in localStorage or lawyerName is empty.");
// }


// async function populateLawyerDetails(details) {
//     if (!details) {
//         console.error("Cannot populate lawyer details: Details are null or undefined.");
//         return;
//     }
//     console.log(details.lawyerName)
//     userDiv1.textContent = details.lawyerName || "N/A";
//     userDiv2.textContent = details.lawyerEmail || "N/A";
//     userDiv3.textContent = details.lawyersId || details.id || "N/A";
//     userDiv4.textContent = details.lawCategory || "N/A";
//     userDiv5.textContent = details.experience || "N/A";
//     userDiv1.style.color = "rgb(9, 98, 9)"
//     logoutButton.textContent = "Logout"
//     localStorage.setItem("lawyerEmail", JSON.stringify({
//         lawyerEmail: details.lawyerEmail,
//         lawyerName: details.lawyerName,
//         lawyerId: details.lawyersId || details.id,
//         lawyerCat: details.lawCategory,
//         lawyerExperience: details.experience,
//     }));

//     console.log("Lawyer details populated in UI and localStorage.");
// }

// Logout functionality
logoutButton.addEventListener("click", () => {
    if (confirm("Are you sure you want to logout?")) {
        let em = userDiv2.textContent 
        em = em.replace(/[\.\#\$\[\]]/g, "_")
        const roleRef = ref(db, `role/${em}`);
        remove(roleRef);
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



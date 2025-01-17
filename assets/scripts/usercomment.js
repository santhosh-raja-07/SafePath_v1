import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { firebaseConfig } from "./config.js";
import { getDocs, getFirestore, collection,  query, where } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getDatabase, ref,  get, child , set , remove ,update , push , onChildAdded , orderByChild } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const database = getDatabase();
const auth = getAuth(app);


const header = document.querySelector(".header");
const navbar = document.querySelector(".navbar");
const chatContainer = document.querySelector(".chat-container");

const userEm = JSON.parse(localStorage.getItem("userEmail"));
let em = userEm.clientEmail;
let checkRole = ""
console.log(userEm.clientEmail)
// Replace invalid characters for Firebase keys
em = em.replace(/[\.\#\$\[\]]/g, "_");
console.log("Formatted em value:", em);

async function getRoleName() {
    try {
        const roleRef = ref(database, `role/${em}`);
        const snapshot = await get(roleRef);

        if (snapshot.exists()) {
            const roleData = snapshot.val().roleName;
            console.log("Role Data:", roleData);
            return roleData; 
        } else {
            console.log("Role Data is null. No data exists at this reference.");
            return null; 
        }
    } catch (error) {
        console.error("Error fetching role data:", error);
        return null; 
    }
}
console.log(checkRole)
getRoleName().then((x)=>{
    checkRole = x
    console.log( "find the role  "+checkRole)

console.log(checkRole)

if (checkRole == "user") {
         
    header.innerHTML = `<nav class="side-navbar">
        <div id="home-page"><i class="fa-solid fa-circle-left"></i></div>
        <div type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight" id="profile-page"><i class="fa-solid fa-circle-user"></i></div>
        <div id="chart-page"><i class="fa-solid fa-chart-simple"></i></div>
        <div><i class="fa-solid fa-ticket"></i></div>
    </nav>
    <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
        <div class="offcanvas-header">
            <h5 class="offcanvas-title username" id="offcanvasRightLabel" style="font-weight: bolder;"></h5>
            <div class="loginout"><i class="fa-solid fa-right-from-bracket"></i></div>
            <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body">
            <h4>Issues Details</h4>
            <div class="sideBar-container">
                <div><h5>Status</h5><span id="status">Pending</span></div>
                <div><h5>Lawyer</h5><span id="Lawyer">Unassigned</span></div>
                <div><h5>Category</h5><span id="categoryOfIssues"></span></div>
                <div><h5>Priority</h5><span id="priority">Pending</span></div>
                <div><h5>Age Category</h5><span id="ageCategory"></span></div>
            </div>
        </div>
    </div>`;

    navbar.innerHTML = `<div class="sub-container">
        <h3>Your Issue</h3>
        <div class="subCon-sub">
            <div>
                <div>Title : <span id="issuesTitle">subject</span></div>
            </div>
            <div>
                <div>Description : <span id="issuesDescription">Describe what happened..</span></div>
            </div>
        </div>
    </div>`;

    chatContainer.innerHTML = `<div class="chat-messages">
        <div class="messageContainer">
        </div>
    </div>
    <form class="chat-input-form" id="chat-form" novalidate>
        <input type="text" id="message" placeholder="Type your message..." autocomplete="off" required>
        <button id="sendMsg">Send</button>
    </form>`;


    const logoutButton = document.querySelector(".loginout")
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            try {
                const userIssues = await getUsername(user.uid);
                if (userIssues) {
                    const userNameee = document.querySelector(".username");
                    const ageCategory = document.getElementById("ageCategory");
                    const categoryOfIssues = document.getElementById("categoryOfIssues");
                    const issuesDescription = document.getElementById("issuesDescription");
                    const issuesTitle = document.getElementById("issuesTitle");
                    

                    userNameee.textContent = userIssues.Name;
                    ageCategory.textContent = userIssues.ageCategory;
                    categoryOfIssues.textContent = userIssues.categoryOfIssues;
                    issuesDescription.textContent = userIssues.issuesDescription;
                    issuesTitle.textContent = userIssues.issuesTitle;
                    localStorage.setItem("userEmail", JSON.stringify({ clientEmail: userIssues.email }));
                    userNameee.style.color = "rgb(9, 98, 9)";
                    logoutButton.style.display = "block";
                } else {
                    console.log("No user issues found.");
                }
            } catch (error) {
                console.error("Error fetching user issues:", error);
            }
        } else {
            console.log("No user is signed in.");
        }

        logoutButton.addEventListener("click", () => {
            if (confirm("Are you sure you want to logout?")) {
                signOut(auth)
                .then(() => {
                    const roleRef = ref(database, "role");
                    remove(roleRef);
                    localStorage.removeItem("usermessageCount")
    
                    updateUIOnLogout();
                })
                .catch((error) => {
                    console.error("Logout error: ", error);
                    alert("Logout error occurred.");
                });
            }
        });
    });
    
    function updateUIOnLogout() {
        alert("You have successfully logged out.");
        localStorage.removeItem("usermessageCount");
        window.location.href = "/index.html";
    }
    
    document.getElementById("home-page").addEventListener("click", () => {
        window.location.href = "/index.html";
    });

    const setStatus = document.getElementById("status")
    const setPriority = document.getElementById("priority")
    const lawyerAssigned = document.getElementById("Lawyer");

 let lawEmail = ""
// function getMsg(){
//         fetchAllMessages()
// }
    async function fetchAllMessages() {
        const userEmail = JSON.parse(localStorage.getItem("userEmail"));
        let email = userEmail.clientEmail;
        email = email.replace(/[\.\#\$\[\]]/g, "_")
        const dbRef = ref(getDatabase());
        const userRef = child(dbRef, `users/usermessage/${email}`);
        
        const database1Ref = ref(getDatabase());
        const issueStatusRef = child(database1Ref, `users/usermessage/${email}/issuesStatus`); // Fixed path with correct slash
        const issueStatus = await get(issueStatusRef);
        if (issueStatus.exists()) {
            console.log("Issue Status Data:", issueStatus.val());
            if (setStatus && setStatus.textContent !== "") {
                setStatus.textContent = issueStatus.val().issuesStatus; // Assuming issueStatus.val() contains the plain text
            }
        } else {
            console.log("No issueStatus available");
        }
        
        const database2Ref = ref(getDatabase());
        const issuePriorityRef = child(database2Ref, `users/usermessage/${email}/issuePriority`); // Fixed path with correct slash
        const issuePriority = await get(issuePriorityRef);
        if (issuePriority.exists()) {
            console.log("Issue Priority Data:", issuePriority.val());
            if (setPriority && setPriority.textContent !== "") {
                setPriority.textContent = issuePriority.val().issuePriority; // Assuming issuePriority.val() contains the plain text
            }
        } else {
            console.log("No issuePriority available");
        }
        
        const database3Ref = ref(getDatabase());
        const lawyerAssignRef = child(database3Ref, `users/usermessage/${email}/lawyerAssigned`); // Fixed path with correct slash
        const lawyerAssign = await get(lawyerAssignRef);
        if (lawyerAssign.exists()) {
            console.log("Lawyer Assigned Data:", lawyerAssign.val());
            if (lawyerAssigned && lawyerAssigned.textContent !== "") {
                lawyerAssigned.textContent = lawyerAssign.val().lawyerAssigned; // Assuming lawyerAssign.val() contains the plain text
            }
        } else {
            console.log("No lawyerAssigned available");
        }
        
    }

       const useremail = JSON.parse(localStorage.getItem("userEmail"));
        let email = useremail.clientEmail;
        email = email.replace(/[\.\#\$\[\]]/g, "_");
        
        const lawyerEmailRef  = ref(database , `users/usermessage/${email}/lawyerAssigned`)
        get(lawyerEmailRef).then((x)=>{
            if(x.exists()){
                lawEmail = x.val().lawyerEmail
            }
            else{
                console.log("no lawyeremail found")
            }

        console.log(lawEmail)
       
    const sendMsgButton = document.getElementById("sendMsg");
    const messageInput = document.getElementById("message");
    let  userEmaill= useremail.clientEmail
    userEmaill = userEmaill.replace(/[\.\#\$\[\]]/g, "_");
    email = lawEmail.replace(/[\.\#\$\[\]]/g, "_")
    let emailArr = [email, userEmaill].sort().join("_")
   console.log(emailArr)
    const userRefec = ref(database, `chats/${emailArr}/usermessages`);
    const msgRef = ref(database , `chats/${emailArr}/Lawyermessages`);
    
    onChildAdded(msgRef , (msg)=>{
        const message = msg.val();
        const msgDiv = document.createElement("div");
        msgDiv.classList.add("yourmsg");
        msgDiv.textContent = `${message.text}`;
        document.querySelector(".messageContainer").append(msgDiv);
    })

    function updateButtonState() {
        if (lawyerAssigned.textContent === "Unassigned") {
            sendMsgButton.style.backgroundColor = "#7c7d7d";
            sendMsgButton.style.cursor = "not-allowed";
            sendMsgButton.disabled = true;
        } else {
            sendMsgButton.style.backgroundColor = "rgb(9, 98, 9)";
            sendMsgButton.style.cursor = "pointer"; 
            sendMsgButton.disabled = false;
        }
    }
    updateButtonState();
    
    sendMsgButton.addEventListener("click", (e) => {
        e.preventDefault();
        if (messageInput.value !== "") {
            const message = {
                text: messageInput.value,
                senderId: lawEmail,
                timestamp: Date.now(),
            };
            try {
                push(userRefec, message); 
                messageInput.value = ""; 
            } catch (error) {
                console.error("Error sending message:", error);
            }
        }
    });
    onChildAdded(userRefec, (snapshot) => {
        const message = snapshot.val();
        const msgDiv = document.createElement("div");
        msgDiv.classList.add("mymsg");
        msgDiv.textContent = `${message.text}`;
        document.querySelector(".messageContainer").append(msgDiv);
    });

    
    
})

        fetchAllMessages();

    document.getElementById("chart-page").addEventListener("click" , ()=>{
        window.location.href = "/assets/pages/chart.html"
    })

    document.querySelector(".loading").style.display = "none"

}
else if (checkRole == "lawyer") {
    console.log("hello")
    header.innerHTML = `<nav class="side-navbar">
            <div id="home-page"><i class="fa-solid fa-circle-left"></i></div>
            <!-- <div id="home-page"><i class="fa-solid fa-house"></i></div> -->
            <div type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight" id="profile-page"><i class="fa-solid fa-circle-user"></i></div>
            <div id="chart-page"><i class="fa-solid fa-chart-simple"></i></div>
            <div type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample"><i class="fa-solid fa-ticket"></i></div>
        </nav>
 <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
        <div class="offcanvas-header">
            <h5 class="offcanvas-title" id="offcanvasExampleLabel">Issues Details</h5>
            <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body">

            <div class="dropdown mt-3">
                <h5>Status</h5>
                <div>
                <select id="status"  class="form-select">
                    <option value="" selected>Set the status</option>
                    <option value="InProgress">In Progress</option>
                    <option value="Pending">Pending</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                    <option value="Rejected">Rejected</option>
                </select>
            </div>
            </div>

            <div class="dropdown mt-3">
                <h5>Priority</h5>
                <div>
                <select id="priority"  class="form-select">
                    <option value = ""  selected>Set the priority</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                </select>
            </div>
            </div>


            <div class="dropdown mt-3">
                <h5>Lawyer</h5>
                <div>
                <select id="selectLawyer" class="disabled-select  form-select">
                    <option id="Lawyer"></option>
                </select>
            </div>
            </div>

            <div class="dropdown mt-3">
                <h5>Category</h5>
                <div>
                <select id="selectCategoryOfIssues" class="disabled-select form-select">
                    <option id="categoryOfIssues"></option>
                </select>
            </div>
            </div> 
            
            <div class="dropdown mt-3">
                <h5>Age Category</h5>
                <div>
                <select id="selectAgeCategory" class="disabled-select form-select">
                    <option id="ageCategory"></option>
                </select>
            </div>
            </div> 
        </div>
    </div>
        <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
            <div class="offcanvas-header">
                <h5 class="offcanvas-title  lawyername" id="offcanvasRightLabel" style="font-weight: bolder;"></h5>
                <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div class="offcanvas-body">
                <h5  id="lawyerEm" ></h5>
                <h5  id="LawyerID" ></h5>
                <h5  id="lawyerCat" ></h5>
                <h5  id="lawyerExp" ></h5>
                <div class="logout"><button class="offcanvas-body" id="loginout"></button></div>
              </div>
        </div>`;

    navbar.innerHTML = ` <div class="sub-container">
                         <div class="sub-header">
                             <h3 id="clientName"></h3>
                             <button class="closeBtn"><i class="fa-solid fa-check" style="color: #080808;"></i>Close</button>
                         </div>
                         <div class="subCon-sub">
                             <div>
                                 <div>Title : <span id="issuesTitle">subject</span></div>
                             </div>
                             <div>
                                 <div>Description : <span id="issuesDescription">Describe what happen..</span></div>
                             </div>
                         </div>
                     </div>`;

    chatContainer.innerHTML = ` <div class="chat-messages">
        <div class="messageContainer">
        </div>
        </div>
        <form class="chat-input-form" id="chat-form" novalidate>
            <input type="text" id="message" placeholder="Type your message..." autocomplete="off" required>
            <button id="sendMsg">Send</button>
        </form>`;


        const issuesTitle = document.getElementById("issuesTitle");
        const issuesDescription = document.getElementById("issuesDescription");
        const clientName = document.getElementById("clientName");
        const categoryOfIssues = document.getElementById("categoryOfIssues");
        const lawyerAssigned = document.getElementById("Lawyer");
        const clientAge = document.getElementById("ageCategory");
    
    // get user issues details from localStorage
    // const userIssuesDetails = JSON.parse(localStorage.getItem("userIssue"));
    let em = userEm.clientEmail
    em = em.replace(/[\.\#\$\[\]]/g, "_");

    const issuesRef = ref(getDatabase());
    const issueSubRef = child(issuesRef, `OpendIssues/${em}/userIssue`);
    get(issueSubRef)
    .then((submitData) => {
        if (submitData.exists()) {
            issuesTitle.textContent = submitData.val().clientIssue;
            issuesDescription.textContent = submitData.val().issuesDes;
            clientName.innerHTML = `<i class="fa-solid fa-circle-user clinetProfile"></i> ${submitData.val().clientName}`;
            categoryOfIssues.textContent = submitData.val().clientIssueCat;
            clientAge.textContent = submitData.val().clientAge;
            lawyerAssigned.textContent = "Assigned";
            console.log("client name stored successfully in Fb :", submitData.val().clientName);
        } else {
            console.log("No userIssue available");
        }
    })
    .catch((error) => {
        console.error("Error fetching data from Firebase:", error);
    });

    // let issueStatus = ""
    // let issuePriority = ""
    const userEmail = JSON.parse(localStorage.getItem("userEmail"));
    // const lawyerEmail = JSON.parse(localStorage.getItem("lawyerEmail"));
    const setStatus = document.getElementById("status")
    const setPriority = document.getElementById("priority")
   let email= userEmail.clientEmail; 
   email = email.replace(/[\.\#\$\[\]]/g, "_");
   let usEmail = ""; 
// console.log(email)
(async () => {
    try {
        let email= userEmail.clientEmail; 
        email = email.replace(/[\.\#\$\[\]]/g, "_");
        console.log("Fetching user email...", email);
        const getemailRef = ref(database, `OpendIssues/${email}/userIssue`);
        const getuseremailData = await get(getemailRef);

        if (getuseremailData.exists()) {
            usEmail = getuseremailData.val().clientEmail; 
            console.log("User email retrieved successfully:", usEmail);
        } else {
            console.log("userIssue not found in database.");
        }
    } catch (error) {
        console.error("Error fetching userIssue data:", error);
    }
        
    console.log(usEmail)
   
    console.log(usEmail)


    async function issueStatusFun(issueStatus){
        // issueStatus set in firbase 
        const issuesStatusRef = ref(database, `users/lawyermessage/${email}/issuesStatus`);
        const issuesStatusData = { issuesStatus: issueStatus };
        await set(issuesStatusRef, issuesStatusData)

        usEmail = usEmail.replace(/[\.\#\$\[\]]/g, "_");
        // issueStatus set in firbase 
        const statusRef = ref(database, `users/usermessage/${usEmail}/issuesStatus`);
        const statusData = { issuesStatus: issueStatus };
        await set(statusRef, statusData)
    }
    async function issuePriorityFun(issuePriority){
        // issueStatus set in firbase
        const issuePriorityRef = ref(database, `users/lawyermessage/${email}/issuePriority`);
        const issuePriorityData = { issuePriority: issuePriority };
        await set(issuePriorityRef, issuePriorityData)
        

        usEmail = usEmail.replace(/[\.\#\$\[\]]/g, "_");
         // issueStatus set in firbase
         const priorityRef = ref(database, `users/usermessage/${usEmail}/issuePriority`);
         const priorityData = { issuePriority: issuePriority };
         await set(priorityRef , priorityData)

    }

    const selectLawyer = document.getElementById("selectLawyer")
    const selectCategoryOfIssues = document.getElementById("selectCategoryOfIssues")
    const selectAgeCategory = document.getElementById("selectAgeCategory")

    selectLawyer.disabled = true;
    selectCategoryOfIssues.disabled = true;
    selectAgeCategory.disabled = true;

    setStatus.addEventListener("change" , async (e)=>{
        if(setStatus.value !== ""){
            // issueStatus = setStatus.value
            setStatus.classList.add("disabled-select");
            setStatus.disabled = true;
            console.log("Selected Status:", setStatus.value)
            await issueStatusFun(setStatus.value)
        }
    })

    setPriority.addEventListener("change" , async (e)=>{
        if(setPriority.value !== ""){
            // issuePriority = setPriority.value
            setPriority.classList.add("disabled-select");
            setPriority.disabled = true;
            console.log("Selected Priority:", setPriority.value)
            await issuePriorityFun(setPriority.value)
        }
    })

    const logoutButton = document.querySelector(".logout");
    logoutButton.textContent = "Logout";
    logoutButton.style.color = "white";
    logoutButton.style.backgroundColor = "rgb(9, 98, 9)"
    logoutButton.style.cursor= "pointer"
    logoutButton.style.textAlign = "center"
    logoutButton.style.padding = "12px"
    const userDiv1 = document.querySelector(".lawyername");
    const userDiv2 = document.getElementById("lawyerEm");
    const userDiv3 = document.getElementById("LawyerID");
    const userDiv4 = document.getElementById("lawyerCat");
    const userDiv5 = document.getElementById("lawyerExp");
    const lawyerDetail = JSON.parse(localStorage.getItem("lawyerEmail"))
    userDiv1.textContent = lawyerDetail.lawyerName;
    userDiv1.style.color = "rgb(9, 98, 9)"
    userDiv2.textContent = lawyerDetail.lawyerEmail;
    userDiv3.textContent = lawyerDetail.lawyerId;
    userDiv4.textContent = lawyerDetail.lawyerCat;
    userDiv5.textContent = lawyerDetail.lawyerExperience;

    // Redirect to lawyerHome page
    document.getElementById("home-page").addEventListener("click", () => {
        alert("Solved the issues")
    });

    // Close issue and redirect
    document.querySelector(".closeBtn").addEventListener("click", () => {
        const modal = document.getElementById("customModal");
        modal.style.display = "block";
        document.getElementById("confirmYes").addEventListener("click", () => {
            localStorage.removeItem("userIssue");
            const lawyerEmail = JSON.parse(localStorage.getItem("lawyerEmail"));
            let email =lawyerEmail.lawyerEmail;
            console.log(email)
            email = email.replace(/[\.\#\$\[\]]/g, "_");
            const issuesRef = ref(database, `users/lawyermessage/${email}/issuseOpened`);
            remove(issuesRef)
            //closed the issues
            const removeRef = ref(database , `OpendIssues/${email}`);
            remove(removeRef)
            usEmail = usEmail.replace(/[\.\#\$\[\]]/g, "_")
            const deleteRef = ref(database , `users/usermessage/${usEmail}/issuseOpened`)
            update(deleteRef , {
                issueStatus : "Closed"
            })
            usEmail = usEmail.replace("_", ".")
            const closeissueRef = ref(database , `closedIssues`)
            update(closeissueRef , {
                userEmail : usEmail
            })
            .then(()=>{
                console.log("key and its value have been removed successfully.")
            })
            .catch((error)=>{
                console.log("error : " , error )
            })
            window.location.href = "/assets/pages/lawyerHome.html";
            modal.style.display = "none";
        });
        document.getElementById("confirmNo").addEventListener("click", () => {
            modal.style.display = "none";
        });
    });

    // const useremail = JSON.parse(localStorage.getItem('userIssue'));
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            try {
                const lawyerDetails = await getUsername(user.uid);
                if (lawyerDetails) {
                    const userDiv1 = document.querySelector(".lawyername");
                    // logoutButton.style.display = "block";
                    userDiv1.textContent = lawyerDetails.lawyerName;
                    localStorage.setItem("lawyerEmail", JSON.stringify({ 
                        lawyerEmail: lawyerDetails.lawyerEmail ,
                        lawyerName : lawyerDetails.lawyerName,
                        lawyerId : lawyerDetails.lawyersId,
                        lawyerCat : lawyerDetails.lawCategory,
                        lawyerExperience : lawyerDetails.experience
                    }));
                    localStorage.setItem("userEmail", JSON.stringify({ clientEmail: lawyerDetails.lawyerEmail }));
                }
            } catch (error) {
                console.error("Error fetching lawyer details:", error);
            }
        }

        logoutButton.addEventListener("click", () => {
            if (confirm("Are you sure you want to logout?")) {
                signOut(auth)
                .then(() => {
                    const roleRef = ref(database, "role");
                    remove(roleRef);
                    localStorage.removeItem("lawyermessageCount")

                    updateUIOnLogout();
                })
                .catch((error) => {
                    alert("Logout error: ", error);
                });
            }
        });
    });

    function updateUIOnLogout() {
        alert("You have successfully logged out.");
        localStorage.removeItem("lawyermessageCount")
        window.location.href = "/index.html";
    }

    // function getMsg(){
    //         fetchAllMessages()
    // }
    console.log(usEmail)

    async function fetchAllMessages() {
        const lawyerEmail = JSON.parse(localStorage.getItem("userEmail"));
        let email = lawyerEmail.clientEmail;
        email = email.replace(/[\.\#\$\[\]]/g, "_");
        
        const dbRef = ref(getDatabase());
        const userRef = child(dbRef, `users/lawyermessage/${email}`);
        
        const database1Ref = ref(getDatabase());
const issueStatusRef = child(database1Ref, `users/lawyermessage/${email}/issuesStatus`);
const issueStatus = await get(issueStatusRef);
if (issueStatus.exists()) {
    console.log("Issue Status Data:", issueStatus.val().issuesStatus);
    const statusValue = issueStatus.val().issuesStatus; // Get the value from Firebase
    const statusDropdown = document.getElementById("status");
    setStatus.classList.add("disabled-select");
    setStatus.disabled = true;
    if (statusDropdown) {
        statusDropdown.value = statusValue; // Set the value in the dropdown
        console.log(`Status set to: ${statusValue}`);
    } else {
        console.error("Status dropdown not found");
    }
} else {
    console.log("No issueStatus available");
}

const database2Ref = ref(getDatabase());
const issuePriorityRef = child(database2Ref, `users/lawyermessage/${email}/issuePriority`);
const issuePriority = await get(issuePriorityRef);
if (issuePriority.exists()) {
    setPriority.classList.add("disabled-select");
    setPriority.disabled = true;
    console.log("Issue Status Data:", issuePriority.val().issuePriority);
    const priorityValue = issuePriority.val().issuePriority; // Get the value from Firebase
    const priorityDropdown = document.getElementById("priority");
    if (priorityDropdown) {
        priorityDropdown.value = priorityValue; // Set the value in the dropdown
        console.log(`Priority set to: ${priorityValue}`);
    } else {
        console.error("Priority dropdown not found");
    }
} else {
    console.log("No issuePriority available");
}
        email = usEmail.replace(/[\.\#\$\[\]]/g, "_");
        const database3Ref = ref(getDatabase());
        const lawyerAssignRef = child(database3Ref, `users/lawyermessage/${email}/lawyerAssigned`);
        const lawyerAssign = await get(lawyerAssignRef);
        
        if (lawyerAssign.exists()) {
            const assignedLawyer = lawyerAssign.val(); // Extract the assigned lawyer object or value
            const lawyerAssignedName = assignedLawyer.lawyerAssigned || "No Lawyer Assigned"; // Access a specific property from the object
            if (lawyerAssigned.textContent !== "") {
                console.log(lawyerAssignedName)
                lawyerAssigned.textContent = lawyerAssignedName;
            }
            const lawyerAssignedRef = ref(database, `users/lawyermessage/${email}/lawyerAssigned`);
            await set(lawyerAssignedRef, { lawyerAssigned: lawyerAssignedName }); // Store the lawyer's assigned name
        } else {
            console.log("No lawyerAssigned available");
        }
        

       
        const userEmail = JSON.parse(localStorage.getItem("userEmail"));
         email = userEmail.clientEmail;
        
        if (email) {
            email = email.replace(/[\.\#\$\[\]]/g, "_"); // Sanitize email for Firebase path
        }
        (async () => {
            try {
                // Fetch user issue data
                const issuesRef = ref(database, `OpendIssues/${email}/userIssue`);
                const submitData = await get(issuesRef);
        
                if (submitData.exists()) {
                    email = submitData.val().clientEmail;
                    console.log("Client email retrieved successfully:", submitData.val().clientEmail);
                } else {
                    console.log("No userIssue available");
                }
                email = email.replace(/[\.\#\$\[\]]/g, "_")
        
                // Update issue status
                email = usEmail
                // console.log(email , "userEmail")
                email = email.replace(/[\.\#\$\[\]]/g, "_");

                // console.log(email , "userEmail")
                const assignedRef = ref(database, `users/usermessage/${email}/lawyerAssigned`);
                const assignedData = { 
                    lawyerAssigned: "Assigned",
                    lawyerEmail : userEmail.clientEmail
                }; 
                await set(assignedRef, assignedData);
                console.log("Lawyer assigned status updated successfully.");
            } catch (error) {
                console.error("Error handling Firebase data:", error);
            }
        })();
        
        
    }
    // Handle sending messages
    console.log(usEmail)
    const sendMsgButton = document.getElementById("sendMsg");
    const messageInput = document.getElementById("message");
    let email = usEmail;
    let lawEmail = userEm.clientEmail
    email = email.replace(/[\.\#\$\[\]]/g, "_");
    lawEmail = lawEmail.replace(/[\.\#\$\[\]]/g, "_")
    let emailArr = [email, lawEmail].sort().join("_")
   
    const userRef = ref(database, `chats/${emailArr}/Lawyermessages`);
    const msgRef = ref(database , `chats/${emailArr}/usermessages`)
    
    sendMsgButton.addEventListener("click", (e) => {
        e.preventDefault();
        if (messageInput.value !== "") {
            const message = {
                text: messageInput.value,
                senderId: lawEmail,
                timestamp: Date.now(),
            };
            try {
                push(userRef, message); 
                messageInput.value = ""; 
            } catch (error) {
                console.error("Error sending message:", error);
            }
        }
    });
    onChildAdded(userRef, (snapshot) => {
        const message = snapshot.val();
        const msgDiv = document.createElement("div");
        msgDiv.classList.add("mymsg");
        msgDiv.textContent = `${message.text}`;
        document.querySelector(".messageContainer").append(msgDiv);
    });
    onChildAdded(msgRef, (msg) => {
        const message = msg.val();
        const msgDiv = document.createElement("div");
        msgDiv.classList.add("yourmsg");
        msgDiv.textContent = `${message.text}`;
        document.querySelector(".messageContainer").append(msgDiv);
    });

    // window.setInterval(() => {
        fetchAllMessages();
//     }, 3000);
// //redirect to chart page
    document.querySelector(".loading").style.display = "none"
})();
    document.getElementById("chart-page").addEventListener("click" , ()=>{
    window.location.href = "/assets/pages/chart.html"
})
}
})


async function getUsername(uid) {
    try {
        const q = query(collection(db, "userIssues"), where("userId", "==", uid)); // Ensure userId is stored in userIssues collection
        const qsnapshot = await getDocs(q);

        if (!qsnapshot.empty) {
            const userDoc = qsnapshot.docs[0];
            const userData = userDoc.data();
            const userId = userDoc.id;

            return { ...userData, id: userId };  // Return user data and document ID
        } else {
            console.log("No user found with the provided UID.");
            return null;
        }
    } catch (error) {
        console.error("Error fetching user issues: ", error);
    }
}


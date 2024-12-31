import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { firebaseConfig } from "./config.js";
import { getDocs, getFirestore, collection,  query, where } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getDatabase, ref,  get, child , set , update } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const database = getDatabase();
const auth = getAuth(app);
const checkRole = JSON.parse(localStorage.getItem("role"));

const header = document.querySelector(".header");
const navbar = document.querySelector(".navbar");
const chatContainer = document.querySelector(".chat-container");

if (checkRole.roleName === "user") {
    header.innerHTML = `<nav class="side-navbar">
        <div id="home-page"><i class="fa-solid fa-circle-left"></i></div>
        <div type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight" id="profile-page"><i class="fa-solid fa-circle-user"></i></div>
        <div><i class="fa-solid fa-chart-simple"></i></div>
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
                <div><h5>Status</h5><span>Pending</span></div>
                <div><h5>Lawyer</h5><span>Unassigned</span></div>
                <div><h5>Category</h5><span id="categoryOfIssues"></span></div>
                <div><h5>Priority</h5><span>Pending</span></div>
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
        <div class="messagelawyer">
            <div class="msg">Hello, how can I assist you?</div>
        </div>
        <div class="messageuser">
            <div class="msg">I need help with a legal matter.</div>
            <div class="msg">Can you provide some guidance?</div>
        </div>
    </div>
    <form class="chat-input-form" id="chat-form" novalidate>
        <input type="text" id="message" placeholder="Type your message..." autocomplete="off" required>
        <button id="sendMsg">Send</button>
    </form>`;

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
                    localStorage.removeItem("role");
    
                    // Retrieving msgCount as a number
                    let msgCount = localStorage.getItem("usermessageCount");
                    if (msgCount) {
                        msgCount = Number(msgCount);
                    } else {
                        msgCount = 1; // Default value if not found
                    }
                    console.log(msgCount)
                    const userEmail = JSON.parse(localStorage.getItem("userEmail"));
                    let email = userEmail.clientEmail;
                    email = email.replace(/[\.\#\$\[\]]/g, "_");
    
                    const countRef = ref(database, `users/usermessage/${email}/messageCount`);
                    const countData = { msgCount: msgCount };
    
                    set(countRef, countData)
                        .then(() => {
                            console.log("Message count has been successfully updated in Firebase.");
                        })
                        .catch((error) => {
                            console.error("Error updating message count in Firebase:", error);
                        });
    
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

    fetchAllMessages()
    async function fetchAllMessages() {
        const userEmail = JSON.parse(localStorage.getItem("userEmail"));
        let email = userEmail.clientEmail;
        email = email.replace(/[\.\#\$\[\]]/g, "_");
        
        const dbRef = ref(getDatabase());
        const userRef = child(dbRef, `users/usermessage/${email}`);
        
        try {
            const msgSnapshot = await get(userRef);
            if (msgSnapshot.exists()) {
                let count = 1;
                while (msgSnapshot.val()[`msg${count}`]) {
                    const msg = msgSnapshot.val()[`msg${count}`];
                    
                    // Create a new div for each message
                    const msgDiv = document.createElement("div");
                    msgDiv.classList.add("msg");
                    msgDiv.textContent = msg; 
                    document.querySelector(".messageuser").append(msgDiv);
                    count++;
                }
            } else {
                console.log("No messages available");
            }
        } catch (error) {
            console.error("Error fetching messages: ", error);
        }

        const msgCountDbRef = ref(getDatabase());
        const msgCountUserRef = child(msgCountDbRef, `users/usermessage/${email}/messageCount`);
        const msgSnapshot = await get(msgCountUserRef);
        if (msgSnapshot.exists()) {
            localStorage.setItem("usermessageCount" , msgSnapshot.val().msgCount)
        } else {
            console.log("No messagescount available");
        }

        const lawyerEmail = JSON.parse(localStorage.getItem("userIssue"));
        email = lawyerEmail.lawyerEmail;
        email = email.replace(/[\.\#\$\[\]]/g, "_");
        
        const dbRefce = ref(getDatabase());
        const userRefce = child(dbRefce, `users/lawyermessage/${email}`);
        
        try {
            const msgSnapshot = await get(userRefce);
            if (msgSnapshot.exists()) {
                let count = 1;
                while (msgSnapshot.val()[`msg${count}`]) {
                    const msg = msgSnapshot.val()[`msg${count}`];
                    
                    // Create a new div for each message
                    const msgDiv = document.createElement("div");
                    msgDiv.classList.add("msg");
                    msgDiv.textContent = msg; 
                    document.querySelector(".messagelawyer").append(msgDiv);
                    count++;
                }
            } else {
                console.log("No messages available");
            }
        } catch (error) {
            console.error("Error fetching messages: ", error);
        }
    }

    
   
    document.getElementById("sendMsg").addEventListener("click", (e) => {
        e.preventDefault();
        const messageInput = document.getElementById("message");
        if (messageInput.value !== "") {
            sendMessage(messageInput.value);
        }
    });

    async function sendMessage(message) {
        const msgDiv = document.createElement("div");
        msgDiv.classList.add("msg");
        msgDiv.textContent = message;
        document.querySelector(".messageuser").append(msgDiv);
        document.getElementById("message").value = "";

        await msgStored(message);
    }

    async function msgStored(message) {
        const userEmail = JSON.parse(localStorage.getItem("userEmail"));
        let email = userEmail.clientEmail;
        email = email.replace(/[\.\#\$\[\]]/g, "_");
        const userRef = ref(database, `users/usermessage/${email}`);
        
        let count = localStorage.getItem("usermessageCount");
        if (count) {
            count = Number(count);
        } else {
            count = 1; 
        }
    
        const updateMessage = {
            [`msg${count}`]: message
        };
    
        // Update the message in Firebase
        try {
            await update(userRef, updateMessage);
            console.log("Data has been written successfully!");
            localStorage.setItem("usermessageCount", JSON.stringify(count + 1));
        } catch (error) {
            console.error("Error writing data: ", error);
        }
    }

}
else if (checkRole.roleName === "lawyer") {

    header.innerHTML = `<nav class="side-navbar">
            <div id="home-page"><i class="fa-solid fa-circle-left"></i></div>
            <!-- <div id="home-page"><i class="fa-solid fa-house"></i></div> -->
            <div type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight" id="profile-page"><i class="fa-solid fa-circle-user"></i></div>
            <div><i class="fa-solid fa-chart-simple"></i></div>
            <div type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight1" aria-controls="offcanvasRight"><i class="fa-solid fa-ticket"></i></div>
        </nav>
        <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasRight1" aria-labelledby="offcanvasRightLabel">
            <div class="offcanvas-header">
                <h5 class="offcanvas-title" id="offcanvasRightLabel" style="font-weight: bolder;"></h5>
                <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            
            <div class="offcanvas-body">
                <h4>Issues Details</h4>
                <div class="sideBar-container">
                    <div><h5>Status</h5><span id="status"></span></div>
                    <div><h5>Lawyer</h5><span id="lawyer"></span></div>
                    <div><h5>Category</h5><span id="categoryOfIssues"></span></div>
                    <div><h5>Priority</h5><span>Pending</span></div>
                    <div><h5>Age Category</h5><span id="ageCategory"></span></div>
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
            <div class="messageuser">
                <div class="msg">Hello, how can I assist you?</div>
            </div>
            <div class="messagelawyer">
                <div class="msg">I need help with a legal matter.</div>
                <div class="msg">Can you provide some guidance?</div>
            </div>
        </div>
        <form class="chat-input-form" id="chat-form" novalidate>
            <input type="text" id="message" placeholder="Type your message..." autocomplete="off" required>
            <button id="sendMsg">Send</button>
        </form>`;

    // Set user issues details from localStorage
    const userIssuesDetails = JSON.parse(localStorage.getItem("userIssue"));
    const issuesTitle = document.getElementById("issuesTitle");
    const issuesDescription = document.getElementById("issuesDescription");
    const clientName = document.getElementById("clientName");
    const categoryOfIssues = document.getElementById("categoryOfIssues");
    const lawyerAssigned = document.getElementById("lawyer");
    const clientAge = document.getElementById("ageCategory");

    issuesTitle.textContent = userIssuesDetails.clientIssue;
    issuesDescription.textContent = userIssuesDetails.issuesDes;
    clientName.innerHTML = `<i class="fa-solid fa-circle-user clinetProfile"></i> ${userIssuesDetails.clientName}`;
    categoryOfIssues.textContent = userIssuesDetails.clientIssueCat;
    clientAge.textContent = userIssuesDetails.clientAge;
    lawyerAssigned.textContent = "Assigned";

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
                    localStorage.setItem("lawyerEmail", JSON.stringify({ lawyerEmail: lawyerDetails.lawyerEmail }));
                }
            } catch (error) {
                console.error("Error fetching lawyer details:", error);
            }
        }

        logoutButton.addEventListener("click", () => {
            if (confirm("Are you sure you want to logout?")) {
                signOut(auth)
                .then(() => {
                    localStorage.removeItem("role");
                    let msgCount =JSON.parse (localStorage.getItem("lawyermessageCount"));
                    const lawyerEmail = JSON.parse(localStorage.getItem("lawyerEmail"));
                    let email = lawyerEmail.lawyerEmail;
                    email = email.replace(/[\.\#\$\[\]]/g, "_");

                    if (msgCount) {
                        msgCount = Number(msgCount);
                    } else {
                        msgCount = 1;
                    }
            
                    const countRef = ref(database, `users/lawyermessage/${email}/messageCount`);
                    const countData = {
                        msgCount: msgCount
                    };
            
                    set(countRef, countData)
                        .then(() => {
                            console.log("Message count has been successfully updated in Firebase.");
                        })
                        .catch((error) => {
                            console.error("Error updating message count in Firebase:", error);
                        });
            
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
    fetchAllMessages()
    async function fetchAllMessages() {
        const lawyerEmail = JSON.parse(localStorage.getItem("lawyerEmail"));
        let email = lawyerEmail.lawyerEmail;
        email = email.replace(/[\.\#\$\[\]]/g, "_");
        
        const dbRef = ref(getDatabase());
        const userRef = child(dbRef, `users/lawyermessage/${email}`);
        
        try {
            const msgSnapshot = await get(userRef);
            if (msgSnapshot.exists()) {
                let count = 1;
                while (msgSnapshot.val()[`msg${count}`]) {
                    const msg = msgSnapshot.val()[`msg${count}`];
                    
                    // Create a new div for each message
                    const msgDiv = document.createElement("div");
                    msgDiv.classList.add("msg");
                    msgDiv.textContent = msg; 
                    // I should use messagelawyer but i use messageuser due to css styling
                    document.querySelector(".messageuser").append(msgDiv);
                    count++;
                }
            } else {
                console.log("No messages available");
            }
        } catch (error) {
            console.error("Error fetching messages: ", error);
        }
        const msgCountDbRef = ref(getDatabase());
        const msgCountUserRef = child(msgCountDbRef, `users/lawyermessage/${email}/messageCount`);
        const msgSnapshot = await get(msgCountUserRef);
        if (msgSnapshot.exists()) {
            localStorage.setItem("lawyermessageCount" , msgSnapshot.val().msgCount)
        } else {
            console.log("No messagescount available");
        }

        const userEmail = JSON.parse(localStorage.getItem("userEmail"));
        email = userEmail.clientEmail;
        email = email.replace(/[\.\#\$\[\]]/g, "_");
        
        const dbRefce = ref(getDatabase());
        const userRefce = child(dbRefce, `users/usermessage/${email}`);
        
        try {
            const msgSnapshot = await get(userRefce);
            if (msgSnapshot.exists()) {
                let count = 1;
                while (msgSnapshot.val()[`msg${count}`]) {
                    const msg = msgSnapshot.val()[`msg${count}`];
                    
                    // Create a new div for each message
                    const msgDiv = document.createElement("div");
                    msgDiv.classList.add("msg");
                    msgDiv.textContent = msg; 
                    // I should use messageuser but i use messagelawyer due to css styling
                    document.querySelector(".messagelawyer").append(msgDiv);
                    count++;
                }
            } else {
                console.log("No messages available");
            }
        } catch (error) {
            console.error("Error fetching messages: ", error);
        }
    }
    

    // Handle sending messages
    const sendMsgButton = document.getElementById("sendMsg");
    const messageInput = document.getElementById("message");
    
    sendMsgButton.addEventListener("click", (e) => {
        e.preventDefault();
        if (messageInput.value !== "") {
            sendMessage(messageInput.value);
        }
    });
    
    function sendMessage(message) {
        const msgDiv = document.createElement("div");
        msgDiv.classList.add("msg");
        msgDiv.textContent = message;
        document.querySelector(".messageuser").append(msgDiv);
        messageInput.value = "";
    
        msgStored(message);
    }
    
    // Store message in Firestore
    async function msgStored(message) {
        const lawyerEmail = JSON.parse(localStorage.getItem("lawyerEmail"));
        let email = lawyerEmail.lawyerEmail;
        email = email.replace(/[\.\#\$\[\]]/g, "_");
        const userRef = ref(database, `users/lawyermessage/${email}`);
        
        let count = localStorage.getItem("lawyermessageCount");
        if (count) {
            count = Number(count);
        } else {
            count = 1; 
        }
    
        const updateMessage = {
            [`msg${count}`]: message
        };
    
        // Update the message in Firebase
        try {
            await update(userRef, updateMessage);
            console.log("Data has been written successfully!");
            localStorage.setItem("lawyermessageCount", JSON.stringify(count + 1));
        } catch (error) {
            console.error("Error writing data: ", error);
        }
    }
    
}


const userData = JSON.parse(localStorage.getItem("user")) || { userNameee: "Guest" };
const logoutButton = document.querySelector(".loginout");
// const userIssuesDetails = [];

console.log(userData);



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

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { firebaseConfig } from "./config.js";
import {getAuth , signOut , onAuthStateChanged} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getDatabase, ref, set, get, child ,  update , remove} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

const app = initializeApp(firebaseConfig);
const database = getDatabase();
const auth = getAuth(app);


const getiusseCountRef = ref(database , "allIssues")
get(getiusseCountRef).then((x)=>{
    console.log(x.val().issuesCount)
const bar = document.getElementById("barChart");
console.log(typeof Chart)
const barChart = new Chart(bar, {
    type: "bar",
    data: {
        labels: ["All Issues", "Closed Issues", "Opend Issues", "In Progress"],
        datasets: [{
            data: [x.val().issuesCount, x.val().closedIssues, x.val().openedIssues, x.val().ProgressIssues],
            backgroundColor: [
                'rgba(255, 128, 128, 0.5)',   // Lite Red for "All Issues"
                'rgba(128, 255, 128, 0.5)',  // Lite Green for "Closed Issues"
                'rgba(255, 255, 128, 0.5)', // Lite Yellow/Olive for "Opend Issues"
                'rgba(128, 128, 255, 0.5)'  //Lite Blue for "In Progress"
            ],
            borderColor: [
                'rgba(128, 0, 0, 1)',  // Matching Dark Red for "All Issues"
                'rgba(0, 128, 0, 1)',  // Matching Dark Green for "Closed Issues"
                'rgba(128, 128, 0, 1)', // Matching Dark Yellow/Olive for "Opend Issues"
                'rgba(0, 0, 128, 1)'   // Matching Dark Blue for "In Progress"
            ],
            borderWidth: 1
        }]
    },
    options :{
        plugins: {
            legend: {
                display: false 
            },
            title: {
                display: true, 
                text: "Users All Issues", 
                font: {
                    size: 18 
                }
            }
        }
    }
});
})

const userEm = JSON.parse(localStorage.getItem("userEmail"));
let em = userEm.clientEmail;
let checkRole = ""
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
document.getElementById("home-page").addEventListener("click" , ()=>{
    if (checkRole == "user"){
       window.location.href = "/index.html"
    }
    if (checkRole  == "lawyer"){
        window.location.href = "/assets/pages/lawyerHome.html"
     }
})


console.log(checkRole)
const logoutButton = document.querySelector("#loginout");
 onAuthStateChanged(auth, (user) => {
        if (user) {
            const userDiv = document.querySelector(".username");
            userDiv.textContent = em 
            userDiv.style.color = "rgb(9, 98, 9)";
            logoutButton.textContent = "Logout";

            logoutButton.addEventListener("click", () => {
                if(confirm("Are you want to logout")){
                    signOut(auth).then(() => {
                        if(checkRole === "user"){
                            localStorage.removeItem("usermessageCount")
                        }
                        else if(checkRole === "lawyer"){
                            localStorage.removeItem("lawyermessageCount")
                        }
                        else{
                            return;
                        }
                        const roleRef = ref(database, "role");
                        remove(roleRef);
                        userDiv.textContent = ""; // Clear the username div
                        updateUIOnLogout();
                    }).catch((error) => {
                      alert("Logout error: ", error);
                    });
                  }
            });
            console.log(userDiv)
        } 
    });
})

function updateUIOnLogout() {
   alert("You have successfully logged out.")
   window.location.href = "/index.html";
}




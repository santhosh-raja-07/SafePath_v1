import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { firebaseConfig } from "./config.js";
import { getDatabase, ref,  get} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";
import {getAuth , signOut , onAuthStateChanged} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
const app = initializeApp(firebaseConfig);
const database = getDatabase();
const auth = getAuth(app);

const bar = document.getElementById("barChart");
console.log(typeof Chart)
const barChart = new Chart(bar, {
    type: "bar",
    data: {
        labels: ["All Issues", "Solved Issues", "Unsolved Issues", "In Progress"],
        datasets: [{
            data: [50, 30, 20, 30],
            backgroundColor: [
                'rgba(128, 0, 0, 0.8)',   // Dark Red for "All Issues"
                'rgba(0, 128, 0, 0.8)',  // Dark Green for "Solved Issues"
                'rgba(128, 128, 0, 0.8)', // Dark Yellow/Olive for "Unsolved Issues"
                'rgba(0, 0, 128, 0.8)'  //Dark Blue for "In Progress"
            ],
            borderColor: [
                'rgba(128, 0, 0, 1)',  // Matching Dark Red for "All Issues"
                'rgba(0, 128, 0, 1)',  // Matching Dark Green for "Solved Issues"
                'rgba(128, 128, 0, 1)', // Matching Dark Yellow/Olive for "Unsolved Issues"
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
})

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
                        localStorage.removeItem("role")
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
  

function updateUIOnLogout() {
   alert("You have successfully logged out.")
   window.location.href = "/index.html";
}

// document.getElementById("pervious-page").addEventListener("click", () => {
//     window.location.href="../pages/report.html"
// });



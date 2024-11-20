// export function showUserName() {
//     const userName = JSON.parse(localStorage.getItem("user"));

//     if (!userName) {
//         console.error("No user data found in localStorage.");
//         return;
//     }

//     const nav = document.querySelector(".nav");
//     if (!nav) {
//         console.error("Navigation element with class '.nav' not found.");
//         return;
//     }

//     const div = document.createElement("div");
//     const h4 = document.createElement("h4");
//     h4.textContent = userName; // Assign text content
//     h4.style.color = "#0097b2"; // Style the text
//     div.appendChild(h4);
//     nav.appendChild(div);

//     console.log(userName); // Log the username
// }

fetch("https://newsdata.io/api/1/news?apikey=pub_597511738b540636f3a1c02c9587c14a3c6a2  ")
.then(data =>data.json())
.then(res => console.log(res))
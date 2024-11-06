
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, update, set } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyBGrcRVf1Kktffn_fYl_CtSvoCsHUK2eTg",
    authDomain: "safepath-87ebf.firebaseapp.com",
    projectId: "safepath-87ebf",
    storageBucket: "safepath-87ebf.firebasestorage.app",
    messagingSenderId: "904889745500",
    appId: "1:904889745500:web:c2404615bc6e86c8bea699",
    measurementId: "G-RYFJ9DQFER"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

async function setData() {
    try {
        // Parse JSON data
        // const jsonData = JSON.parse();

        // Define the path where you want to save the JSON data in Firebase
        const dataRef = ref(database, '/assets/data/law.json'); // Replace with your desired path

        // Use set to upload the JSON data
        await set(console.log(dataRef.json()));
    } catch (error) {
        console.error('Error uploading JSON:', error);
    }
};
setData();




// let laws = [];

// // Fetch JSON data
// async function fetchLaws() {
//     try {
//         const response = await fetch('/assets/data/law.json'); // Update this to your actual JSON file path
//         const data = await response.json();
//         laws = data.laws; // Store the array of laws
//     } catch (error) {
//         console.error('Error fetching laws:', error);
//     }
// }

// // Search function
// function searchLaws() {
//     const input = document.getElementById('searchInput').value.toLowerCase();
//     const resultDiv = document.getElementById('result');
    
//     // Clear previous results
//     resultDiv.innerHTML = '';

//     // Filter laws based on the search input
//     const filteredLaws = laws.filter(law => {
//         const lawName = law.name.toLowerCase();
//         const lawDescription = law.description.toLowerCase();
//         return lawName.includes(input) || lawDescription.includes(input);
//     });

//     // Display results
//     if (filteredLaws.length > 0) {
//         filteredLaws.forEach(law => {
//             const lawElement = document.createElement('div');
//             lawElement.classList.add('law-item');
//             lawElement.innerHTML = `<h3>${law.name} (${law.year})</h3><p>${law.description}</p>`;

//             // Display sections if they exist
//             if (law.sections && law.sections.length > 0) {
//                 const sectionList = document.createElement('ul');
//                 law.sections.forEach(section => {
//                     const sectionItem = document.createElement('li');
//                     sectionItem.innerHTML = `Section ${section.section}: ${section.description}`;
//                     sectionList.appendChild(sectionItem);
//                     sectionList.setAttribute("class","list");
//                 });
//                 lawElement.appendChild(sectionList);
//             }

//             resultDiv.appendChild(lawElement);
//         });
//     } else {
//         resultDiv.innerHTML = '<p>No results found.</p>';
//     }
// }

// // Call fetchLaws to get the data when the page loads
// window.onload = fetchLaws;

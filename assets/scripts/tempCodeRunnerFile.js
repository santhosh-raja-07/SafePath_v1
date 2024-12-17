import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { firebaseConfig } from "./config.js";
import { 
    getFirestore, 
    collection, 
    getDocs 
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const userIssues = [];

async function fetchUserIssues() {
    try {
        // Reference the "userIssues" collection
        const userIssuesCollectionRef = collection(db, "userIssues");

        // Fetch all documents in the "userIssues" collection
        const userIssuesSnapshot = await getDocs(userIssuesCollectionRef);
        userIssues.push(userIssuesSnapshot);

        // Log the result
        console.log("Fetched User Issues:", userIssues);
    } catch (error) {
        console.error("Error fetching user issues:", error);
    }
}
console.log(userIssues)
// Call the function to fetch data
fetchUserIssues();
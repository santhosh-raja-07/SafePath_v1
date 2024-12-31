import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { firebaseConfig } from "./config.js";
import { 
    getFirestore, 
    collection, 
    getDocs 
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export const userIssues = [];

    try {
        const userIssuesCollectionRef = collection(db, "userIssues");
        const userIssuesSnapshot = await getDocs(userIssuesCollectionRef);

        userIssuesSnapshot.forEach((doc) => {
            const issueData = doc.data();
            userIssues.push(issueData);
        });

        console.log("Fetched User Issues:", userIssues);

    } catch (error) {
        console.error("Error fetching user issues:", error);
    }

console.log(userIssues)
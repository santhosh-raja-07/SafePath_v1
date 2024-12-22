import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getFirestore, collection, getDocs, doc , updateDoc, addDoc ,query, where} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import {firebaseConfig } from "./config.js"

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export async function getUsername(email) {
    localStorage.setItem("role" , JSON.stringify({roleName : "lawyer"}))
    try {
        if (!email) {
            throw new Error("Invalid email: Email is undefined or null.");
        }
        const q = query(collection(db, "lawyerDetails"), where("lawyerEmail", "==", email));
        const qsnapshot = await getDocs(q);

        if (!qsnapshot.empty) {
            const userDoc = qsnapshot.docs[0];
            const userData = userDoc.data();
            const userId = userDoc.id;
           
            return { ...userData, id: userId };
        } else {
            console.log("No user found with the provided email.");
            return null;
        }
    } catch (error) {
        console.error("Error fetching user details: ", error);
        throw error;
    }
}

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore, collection, getDocs, doc , updateDoc, addDoc ,query, where} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import {firebaseConfig } from "./config.js"
import {getDatabase, ref, set, get, child ,  update } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js"

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const database = getDatabase()

export async function getUsername(email) {
    // Add role to Realtime Database (if required)
    try {
        if (!email) {
            throw new Error("Invalid email: Email is undefined or null.");
        }

        // Optional: Add role to Realtime Database
        const sanitizedEmail = email.replace(/[\.\#\$\[\]]/g, "_");
        const roleRef = ref(database, `role/${sanitizedEmail}`);
        await set(roleRef, { roleName: "lawyer" });

        // Firestore Query
        const q = query(collection(db, "lawyerDetails"), where("lawyerEmail", "==", email));
        const qsnapshot = await getDocs(q);

        if (!qsnapshot.empty) {
            const userDoc = qsnapshot.docs[0]; // Retrieve the first matching document
            const userData = userDoc.data();
            const userId = userDoc.id; // Firestore document ID
            return { ...userData, id: userId };
        } else {
            console.log("No user found with the provided email.");
            return null;
        }
    } catch (error) {
        console.error("Error fetching user details:", error);
        throw error; // Rethrow the error to the caller
    }
}

export function showUserName() {
    const userName = JSON.parse(localStorage.getItem("user"));

    if (!userName) {
        console.error("No user data found in localStorage.");
        return;
    }

    const nav = document.querySelector(".nav");
    if (!nav) {
        console.error("Navigation element with class '.nav' not found.");
        return;
    }
    let div = document.querySelector('.username');
    div.textContent=userName;
    div.style.display = "initial"
    console.log(userName); // Log the username

}



// fetch("https://newsdata.io/api/1/news?apikey=pub_597511738b540636f3a1c02c9587c14a3c6a2")
// .then(data =>data.json())
// .then(res => console.log(res))
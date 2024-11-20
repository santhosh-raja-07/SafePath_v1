
const anonymousbtn = document.getElementById("anonymous");
anonymousbtn.addEventListener("click", () => {
    document.querySelector(".anonymous-switch").style.display = "initial";
});

document.addEventListener('DOMContentLoaded', () => {
    const checkbox = document.getElementById('checkbox');
    function anonymousActivated() {
        setTimeout(()=>{
        if (checkbox.checked) {
            document.querySelector(".anonymous-switch").style.display = "none";
            alert("ANONYMOUS ACTIVATED");
        }
        },500)
        setTimeout(()=>{
        window.location.href = "/assets/pages/html-pages/report.html";
    },1000)
    }

    checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
            checkbox.style.backgroundColor = '#0097b2'; 
            checkbox.style.borderColor = '#0097b2';
            anonymousActivated(); 

        } else {
            checkbox.style.backgroundColor = 'white'; 
            checkbox.style.borderColor = 'white'; 
        }
    });
});


// import { showUserName } from "./report.js";
// const showFace = document.getElementById("showFace");
// showFace.addEventListener("click", () => {
//     showUserName();
//     window.location.href = "/assets/pages/html-pages/report.html";
// });


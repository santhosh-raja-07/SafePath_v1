
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
    }
    checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
            checkbox.style.backgroundColor = '#0097b2'; // Replace with desired color
            checkbox.style.borderColor = '#0097b2'; // Optional
            anonymousActivated(); // Call the function when activated
        } else {
            // Change the color when toggled off
            checkbox.style.backgroundColor = 'white'; // Replace with desired color
            checkbox.style.borderColor = 'black'; // Optional
        }
    });
});

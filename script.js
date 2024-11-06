const favicon=document.querySelector(".favicon");
const xmark1=document.getElementById("x-mark1");
const signup=document.getElementById("sign-up");
const xmark2=document.getElementById("x-mark2");

favicon.addEventListener("click" ,()=>{
    let login=document.querySelector(".login-page");
    let bodyPage=document.querySelector(".body");
    login.style.display = "initial";
    bodyPage.style.opacity="0.5";
})
xmark1.addEventListener("click",()=>{
    let login=document.querySelector(".login-page");
    let bodyPage=document.querySelector(".body");
    login.style.display = "none";
    bodyPage.style.opacity="1";
})
signup.addEventListener("click",()=>{
    let login=document.querySelector(".login-page");
    let sign=document.querySelector(".sign-up-page");
    let bodyPage=document.querySelector(".body");
    login.style.display = "none";
    sign.style.display = "initial";
    bodyPage.style.opacity="0.5";
})
xmark2.addEventListener("click",()=>{
    let sign=document.querySelector(".sign-up-page");
    let bodyPage=document.querySelector(".body");
    sign.style.display = "none";
    bodyPage.style.opacity="1";
})




  
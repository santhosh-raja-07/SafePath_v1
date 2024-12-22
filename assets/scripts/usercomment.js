const chatMessages = document.getElementById("chat-messages")
const userMsg = document.getElementById("message")
const sendMsg = document.getElementById("sendMsg")
const afterMsgSend = document.querySelector(".messageuser")

sendMsg.addEventListener("click" , (e)=>{
    e.preventDefault()
    sendMessage()
})

function sendMessage(){
    if(userMsg.value != ""){
        const msgDiv =  document.createElement("div")
        msgDiv.classList.add("msg")
        msgDiv.textContent = userMsg.value
        afterMsgSend.append(msgDiv)
        userMsg.value = ""
    }
}


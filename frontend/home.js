document.getElementById("addChat").addEventListener("click", function() {
    const popup = document.getElementById("newMessagePopUp");
    const overlay = document.getElementById("overlay");
    popup.style.display = "flex";
    popup.classList.add("show");
    popup.classList.remove("hide");
    overlay.style.display = "flex";
});

document.getElementById("closeNewMessage").addEventListener("click", function() {
    const popup = document.getElementById("newMessagePopUp");
    const overlay = document.getElementById("overlay")
    popup.classList.remove("show");
    popup.classList.add("hide");
    overlay.style.display = "none";        
});

document.getElementById("createMessageButton").addEventListener("click", function() {
    const popup = document.getElementById("newMessagePopUp");
    const overlay = document.getElementById("overlay");
    const name = document.getElementById("username");
    const containerBox = document.getElementById('messages');
    const containerCircle = document.getElementById('profile');
    const containerUsername = document.getElementById('hold_username');
    var chatExits = true;


    fetch("http://127.0.0.1:8000/users/userexists/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCSRFToken()
        },
        credentials: 'include',
        body: JSON.stringify({ username: `${name.value}`})
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log(chatExits);
            
            if (document.getElementById("messages").children.length == 0){
                chatExits = true;
            }
            else{
                for (i = 0; i < document.getElementById("messages").children.length; i++) {
                    if (`${name.value}` == document.getElementById("messages").children[i].textContent){
                        chatExits = false;
                    }
    
                }
            }
            if (chatExits){

                const newBox = document.createElement('div');
                const newCircle = document.createElement('div');
                const newUsername = document.createElement('div');


                const chatTitle = document.createElement("strong");
                chatTitle.textContent = data.username;

                const messageText = document.createElement("span");
                messageText.textContent = "Send a message to start the conversation!";
                messageText.style.fontWeight = "normal";
                messageText.style.fontSize = "15px";

                newBox.appendChild(chatTitle);
                newBox.appendChild(document.createElement("br"));
                newBox.appendChild(messageText);

                newCircle.textContent = `${data.username[0]}`;

                newUsername.value = `${name.value}`;

                containerBox.appendChild(newBox);
                containerCircle.appendChild(newCircle);
                containerUsername.appendChild(newUsername);

                console.log("this shit works");
            
                popup.classList.remove("show");
                popup.classList.add("hide");
                overlay.style.display = "none";
            
                const element = document.getElementById('sideBar');
                const height = element.offsetHeight;
            }
            
            console.log(`${data.message}`);
        }
        
    })
    .catch(error => console.error("Error:", error));
}
);

document.getElementById("newMessagePopUp").addEventListener("animationend", function(event) {
    const popup = document.getElementById("newMessagePopUp");
    if (event.animationName === "popup-shrink") { 
        popup.style.display = "none";             
    }
});

const sideBar = document.getElementById("sideBar");
const message = document.getElementById("message");
const messageBar = document.getElementById("messageBar");
const holdUser = document.getElementById("holdUser");
console.log(holdUser);

sideBar.addEventListener("click", (event) => {

    if (event.target && event.target.parentElement.id === "messages") {
        messageBar.textContent = `${event.target.children[0].textContent}`
        message.style.display = "flex";
        
        const messageIndex = Array.from(document.getElementById("messages").children).indexOf(event.target);
        const correspondingUsername = document.getElementById("hold_username").children[messageIndex]; 

        if (correspondingUsername) {
            console.log(correspondingUsername)
            const name = correspondingUsername.textContent;
            holdUser.textContent = name;
            console.log(holdUser);
        
        }

    } else if (event.target && event.target.parentElement.id === "profile") {
        const profileIndex = Array.from(document.getElementById("profile").children).indexOf(event.target); 
        const correspondingMessage = document.getElementById("messages").children[profileIndex].children[0]; 
        const correspondingUsername = document.getElementById("hold_username").children[profileIndex]; 
        
        if (correspondingMessage) {
            messageBar.textContent = `${correspondingMessage.textContent}`
            message.style.display = "flex";

            name = correspondingUsername.textContent;
            holdUser.textContent = name;
            console.log(holdUser);
        }
    }
});




document.getElementById("sendMessage").addEventListener("click", function(){
    event.preventDefault();
    const name = document.getElementById("holdUser").textContent;
    const messageInput = document.getElementById("messageInput");

    fetch("http://127.0.0.1:8000/users/sendmessage/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'X-Requested-With': 'XMLHttpRequest',
            "X-CSRFToken": getCSRFToken()
        },
        credentials: 'include',
        body: JSON.stringify({ username: name, text: `${messageInput.value}`})
    })

    .then(response => response.json())
    .then(data => {
        if(data.success) {
            console.log(name);
            console.log(messageInput.value);
            messageInput.value = "";
        } 
    });

});

function receiveRooms(){
    const containerBox = document.getElementById('messages');
    const containerCircle = document.getElementById('profile');
    const containerUsername = document.getElementById('hold_username');

    fetch("http://127.0.0.1:8000/users/returnrooms/", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            'X-Requested-With': 'XMLHttpRequest',
            "X-CSRFToken": getCSRFToken()
        },
        credentials: 'include',
    })
    .then(data => {
        return data.json();  
    })
    .then(data => {
        if(data.success) {
            console.log(data.chats);
            console.log(data.messages);

            for(let chat of data.chats){
                

                const newBox = document.createElement('div');
                const newCircle = document.createElement('div');
                const newUsername = document.createElement('div');

                const chatTitle = document.createElement("strong");
                chatTitle.textContent = chat;

                const messageText = document.createElement("span");
                messageText.textContent = data.messages?.[chat]?.[0] ?? "Send a message to start the conversation!";
                messageText.style.fontWeight = "normal";
                messageText.style.fontSize = "15px";

                newBox.appendChild(chatTitle);
                newBox.appendChild(document.createElement("br"));
                newBox.appendChild(messageText);

                newCircle.textContent = `${chat[0]}`;

                newUsername.textContent = data.username;

                containerBox.appendChild(newBox);
                containerCircle.appendChild(newCircle);
                containerUsername.appendChild(newUsername);
                console.log(containerUsername);
            }


        } 
    });
}
window.onload = function () {
    receiveRooms();
};



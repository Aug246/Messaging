import { useState, useRef, useEffect, use } from "react";
import { getCSRFToken } from "./auth";



function AddConversation() {
    const [username, setUsername] = useState("");
    const usernameInputRef = useRef(null);
    const overlayRef = useRef(null);
    const fieldRef = useRef(null);

    const newConverstion = () => {
        if (fieldRef.current && overlayRef.current) {
            fieldRef.current.style.display = "flex";
            fieldRef.current.classList.add("show");
            fieldRef.current.classList.remove("hide");
            overlayRef.current.style.display = "flex";
        }
    }

    const closeNewConversation = () => {
        if (fieldRef.current && overlayRef.current) {
            fieldRef.current.classList.remove("show");
            fieldRef.current.classList.add("hide");
            overlayRef.current.style.display = "none";

            fieldRef.current.addEventListener("animationend", function(event) {
                if (event.animationName === "popup-shrink") { 
                    fieldRef.current.style.display = "none";             
                }
            });
        }
    }

    const sendNewConversation = async () => {
        var conversationExists;
        
        try {
            const response = await fetch("http://127.0.0.1:8000/users/userexists/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCSRFToken()
                },
                credentials: 'include',
                body: JSON.stringify({ username: `${name.value}`})
            })
    
            try {
                const data = await response.json();

            } catch (jsonError) {
                
            }
        } catch (error) {
            console.error("Error:", error);
            
        }



    }
    return(
        <>
            <button className="create-conversation" onClick={newConverstion}>+</button>
            <div className="overlay" ref={overlayRef}></div>
            <div className="new-conversation-field" ref={fieldRef}>
                <button className="close-field" onClick={closeNewConversation}>×</button>
                <h2 className="new-message-text">New Message</h2>
                <p className="friend-text">Enter your friend's username</p>
                <div className="input-group">
                    <label htmlFor="username" className="login-label"> <b>USERNAME</b> </label>
                    <br/>
                    <input 
                        type="text" 
                        name="username" 
                        id="username-input"
                        ref={usernameInputRef}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <button className="new-conversation-button">Start Conversation</button>  
            </div>
        </>
    );
}

export default AddConversation
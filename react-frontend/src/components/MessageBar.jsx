import { useState, useRef, useEffect } from "react";
import { getCSRFToken } from "./auth";

function MessageBar(){

    const messageBarRef = useRef(null);
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState({});

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8000/users/returnrooms/", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        'X-Requested-With': 'XMLHttpRequest',
                        "X-CSRFToken": getCSRFToken()
                    },
                    credentials: 'include',
                });
    
                const data = await response.json();
    
                if (data.success) {
                    console.log(data.chats);
                    console.log(data.messages);

                    setConversations(prevConversations => [
                        ...prevConversations,
                        ...data.chats.map(chat => chat[0]),  // Extracting chat[0] from each tuple
                    ]);

                    setMessages(data.messages);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
    
        fetchConversations(); 
    
    }, []); 

    const previewText = (name) => {
        if  (name in messages){
            return messages[name][messages[name].length-1];
        }
        else {
            return "Send a Message to Start the Conversation!";
        }
    }
    
    return(
        <>
            <div className="message-bar" ref={messageBarRef}>
            {conversations.map((conv, index) => (
                <div key={index} className="conversation">
                    <div className="conversation-initial">{conv[0]}</div>
                    <h3 className="conversation-title">{conv}</h3>
                    <a className="conversation-text">{previewText()}</a>
                </div>
            ))}
            {/*
                <div id="messagemenuitems">
                    <div id="profile" className = 'messageBox'></div>
                    <div id="messages" className ='messageBox'></div>
                    <div id="hold_username" className = 'messageBox' style={{visibility: "hidden"}}></div>
                </div>
            */}
            </div>
        </>
    );
}

export default MessageBar
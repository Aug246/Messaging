import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { getCSRFToken } from "./auth";

function LoginField() {
    const navigate = useNavigate();

    // State for input values
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Refs for input fields and wrong message
    const usernameInputRef = useRef(null);
    const passwordInputRef = useRef(null);
    const firstnameInputRef = useRef(null);
    const lastnameInputRef = useRef(null);
    const wrongMessageRef = useRef(null);

    const register = async () => {

        try {
            setIsLoading(true);
            
            const csrfToken = getCSRFToken();
            console.log("CSRF Token:", csrfToken); 
            
            if (!csrfToken) {
                console.error("CSRF token not found in cookies");
                wrongMessageRef.current.style.visibility = "visible";
                wrongMessageRef.current.textContent = "Authentication error. Please refresh the page.";
                return;
            }
    
            const response = await fetch("http://127.0.0.1:8000/login/register/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCSRFToken()
                },
                credentials: 'include',
                body: JSON.stringify({ 
                    username: username, 
                    password: password,
                    first_name: firstname, 
                    last_name: lastname 
                })
            });
            try {
                const data = await response.json();
                
                if (data.success) {
                    // Hide error and reset styles
                    wrongMessageRef.current.style.visibility = "hidden";
                    usernameInputRef.current.style.backgroundColor = "#949ca9";
                    usernameInputRef.current.style.borderColor = "ffffff00";
                    navigate('/messages');
                } else {
                    // Show error and update styles
                    wrongMessageRef.current.style.visibility = "visible";
                    usernameInputRef.current.style.backgroundColor = "#f8d7da";
                    usernameInputRef.current.style.borderColor = "#fc0303";
                }
            } catch (jsonError) {
                console.error("Error parsing JSON:", jsonError);
                const textResponse = await response.text();
                console.error("Raw response:", textResponse);
                wrongMessageRef.current.style.visibility = "visible";
                wrongMessageRef.current.textContent = "Server error. Please try again.";
            }

        } catch (error) {
            console.error("Error:", error);
            wrongMessageRef.current.style.visibility = "visible";
            wrongMessageRef.current.textContent = "Login failed. Please try again.";
        } finally {
            setIsLoading(false);
        }
    }

    return(
        <div className="login-popup">
            <div className="input-group">
                <label htmlFor="name" className="login-label"> <b>First Name</b> </label>
                <br></br>
                <input 
                    type="text" 
                    name="name" 
                    id="firstname-input"
                    ref={firstnameInputRef}
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                />
            </div>

            <div className="input-group">
                <label htmlFor="lastname" className="login-label"> <b>Last Name</b> </label>
                <br></br>
                <input 
                    type="text" 
                    name="lastname" 
                    id="lastname-input"
                    ref={lastnameInputRef}
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                />
            </div>

            <div className="input-group">
                <label htmlFor="username" className="login-label"> <b>Username</b> </label>
                <br></br>
                <input
                    type="text"
                    name="username"
                    id="username-input"
                    ref={usernameInputRef}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>

            <div className="input-group">
                <label htmlFor="password" className="login-label"> <b>Password</b> </label>
                <br></br>
                <input
                    type="password"
                    name="password"
                    id="password-input"
                    ref={passwordInputRef}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <br></br>
                <button 
                    className="login-button" 
                    onClick={register}
                    disabled={isLoading}
                >
                    {isLoading ? "Making Account..." : "Register"}
                </button>
            </div>
            <b id="wrong-text" ref={wrongMessageRef} style={{visibility: "hidden"}}>Username is Taken*</b>

        </div>
    );
}  

export default LoginField
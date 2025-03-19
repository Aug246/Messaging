import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { getCSRFToken } from "./auth";

function LoginField() {
    const navigate = useNavigate();

    // State for input values
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Refs for input fields and wrong message
    const usernameInputRef = useRef(null);
    const passwordInputRef = useRef(null);
    const wrongMessageRef = useRef(null);

    useEffect(() => {
        fetch('http://127.0.0.1:8000/login/csrftoken/', {
          method: 'GET',
          credentials: 'include',
        }).then(() => {
          console.log("CSRF cookie should be set now");
          console.log("Cookies:", document.cookie);
        }).catch(error => {
          console.error("Error fetching CSRF token:", error);
        });
      }, []);

    const login = async () => {
        try {
            setIsLoading(true);
            
            // Get the CSRF token
            const csrfToken = getCSRFToken();
            console.log("CSRF Token:", csrfToken); // Check if token is found
            
            if (!csrfToken) {
                console.error("CSRF token not found in cookies");
                wrongMessageRef.current.style.visibility = "visible";
                wrongMessageRef.current.textContent = "Authentication error. Please refresh the page.";
                return;
            }
            
            const response = await fetch("http://127.0.0.1:8000/login/login/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrfToken
                },
                credentials: 'include',
                body: JSON.stringify({ username: username, password: password })
            });
            
            try {
                const data = await response.json();
                
                if (data.success) {
                    // Hide error and reset styles
                    wrongMessageRef.current.style.visibility = "hidden";
                    usernameInputRef.current.style.backgroundColor = "#949ca9";
                    passwordInputRef.current.style.backgroundColor = "#949ca9";
                    usernameInputRef.current.style.borderColor = "ffffff00";
                    passwordInputRef.current.style.borderColor = "ffffff00";
                    navigate('/messages');
                } else {
                    // Show error and update styles
                    wrongMessageRef.current.style.visibility = "visible";
                    wrongMessageRef.current.textContent = "Wrong Username or Password*";
                    usernameInputRef.current.style.backgroundColor = "#f8d7da";
                    passwordInputRef.current.style.backgroundColor = "#f8d7da";
                    usernameInputRef.current.style.borderColor = "#fc0303";
                    passwordInputRef.current.style.borderColor = "#fc0303";
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
    };

    return(
        <div className="login-popup">
            <h2 className="welcome-text">Welcome back!</h2>

            <div className="input-group">
                <label htmlFor="username" className="login-label"><b>Username</b></label>
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
                <label htmlFor="password" className="login-label"><b>Password</b></label>
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
                    onClick={login}
                    disabled={isLoading}
                >
                    {isLoading ? "Logging in..." : "Login"}
                </button>
            </div>

            <b id="wrong-text" ref={wrongMessageRef} style={{visibility: "hidden"}}>Wrong Username or Password*</b>
            <p className="newacc-link">New User? <Link to={"/register"}>Create account</Link></p>
        </div>
    );
}

export default LoginField;
function login() {
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const username = usernameInput.value;
    const password = passwordInput.value;


    fetch("http://127.0.0.1:8000/login/login/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCSRFToken()
        },
        credentials: 'include',
        body: JSON.stringify({ username: username, password: password })
    })
    .then(response => response.json())
    .then(data => {
        const wrong = document.getElementById("wrong");
        if (data.success) {
            wrong.style.visibility = "hidden";
            usernameInput.style.backgroundColor = "#949ca9";
            passwordInput.style.backgroundColor = "#949ca9";
            usernameInput.style.borderColor = "ffffff00";
            window.location.href = "home.html";
              
        }
        else{
            wrong.style.visibility = "visible";
            usernameInput.style.backgroundColor = "#f8d7da";
            passwordInput.style.backgroundColor = "#f8d7da";
            usernameInput.style.borderColor = "#fc0303";
            passwordInput.style.borderColor = "#fc0303";
        }
    })
    .catch(error => console.error("Error:", error));
}

function register() {
    const usernameInput = document.getElementById("username");
    const username = usernameInput.value;
    const password = document.getElementById("password").value;
    const firstName = document.getElementById("first-name").value;
    const lastName = document.getElementById("last-name").value;

    fetch("http://127.0.0.1:8000/login/register/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCSRFToken()
        },
        credentials: 'include',
        body: JSON.stringify({ 
            username: username, 
            password: password,
            first_name: firstName, 
            last_name: lastName 
        })
    })
    .then(response => response.json())
    .then(data => {
        const wrong = document.getElementById("wrong");
        if (data.success) {
            window.location.href = "login.html"; 
            wrong.style.visibility = "hidden";
            usernameInput.style.backgroundColor = "#949ca9";
            usernameInput.style.borderColor = "ffffff00";
        } else {
            wrong.style.visibility = "visible";
            usernameInput.style.backgroundColor = "#f8d7da";
            usernameInput.style.borderColor = "#fc0303";
        }
    })
    .catch(error => console.error("Error:", error));
}

function logout() {
    fetch("http://127.0.0.1:8000/login/logout/", {  
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCSRFToken()
        },
        credentials: 'include',
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === "Logged out successfully") {
            console.log('Logout successful');
            window.location.href = "login.html"; 
        }
    })
    .catch(error => {
        console.error('Error logging out:', error);
    });
}


function getCSRFToken() {
    const cookieValue = document.cookie.match('(^|;)\\s*csrftoken\\s*=\\s*([^;]+)');
    return cookieValue ? cookieValue.pop() : '';  
}
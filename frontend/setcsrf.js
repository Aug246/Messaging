function initializeCSRF() {
    console.log("Initializing CSRF token...");
    fetch("http://127.0.0.1:8000/login/health_check/", {  
        method: "GET",
        credentials: "include", 
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json(); 
    })
    .then(data => {
        console.log("CSRF token initialized successfully:", data);
    })
    .catch(error => console.error("Error initializing CSRF token:", error));
}

window.onload = function () {
    initializeCSRF();
};

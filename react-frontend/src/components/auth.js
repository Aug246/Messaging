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



export const getCSRFToken = () => {

    function getCookie(name) {
      let cookieValue = null;
      if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          // Does this cookie string begin with the name we want?
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
            console.log(cookieValue);
            console.log("lol");
            break;
          }
        }
      }
      return cookieValue;
    }
    return getCookie('csrftoken');
  };

export const ensureCSRFToken = async () => {
try {
    // Make a GET request to a Django endpoint to set the CSRF cookie
    const response = await fetch('http://127.0.0.1:8000/login/csrftoken', {
    method: 'GET',
    credentials: 'include', // Important: this tells fetch to include cookies
    });
    
    if (!response.ok) {
    throw new Error(`Failed to get CSRF token: ${response.status}`);
    }
    
    return true;
} catch (error) {
    console.error('Error getting CSRF token:', error);
    return false;
}
};
  
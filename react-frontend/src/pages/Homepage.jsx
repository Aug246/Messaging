import { useEffect, useState } from 'react';
import Homebar from '../components/Homebar';
import LoginField from '../components/LoginField';

function App() {

  const [csrftoken, setCsrfToken] = useState("");

  /*useEffect(() => {
    console.log("Initializing CSRF token...");

    fetch("http://127.0.0.1:8000/login/csrftoken/", { method: "GET", credentials: "include" })
      .then(response => response.json())
      .then(data => {
        console.log("CSRF Token received:", data.csrfToken);
        setCsrfToken(data.csrfToken);
      })
      .catch(error => console.error("CSRF error:", error));
  }, []);*/

  return (
    <>
      <Homebar/>
      <LoginField/>
    </>
  );
}

export default App;

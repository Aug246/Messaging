import { Link } from "react-router-dom" 


function Homebar() {
    return (
        <div className="topbar"> 
            <h1 className="topbar-text"><Link to={"/"}>COMMUNICATION</Link></h1>
        </div>
    );
}
export default Homebar
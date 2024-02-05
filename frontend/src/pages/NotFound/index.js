import "./notfound.css";
import {MdSearchOff} from "react-icons/md";
const NotFound = () => {
    document.title = "Page Not Found";
    return ( <div className="notfound-cover">
        <span className="notfound-icon">
        <MdSearchOff size={100} />
        </span>
        <h1>404 Page Not Found</h1>
    </div> );
}
 
export default NotFound;
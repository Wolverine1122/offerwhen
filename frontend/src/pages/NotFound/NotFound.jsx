import "./notfound.css";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="not-found-page">
      <div className="redirect-instructions">
        <h1>Ain't no way</h1>
        <h3>Page not found</h3>
        <button className="action-button">
          <Link to="/companies">Take me home</Link>
        </button>
      </div>
    </div>
  );
};

export default NotFound;

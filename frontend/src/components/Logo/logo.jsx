import { Link } from "react-router-dom";
import lockLogo from "../../icons/lock-logo.svg";
import "./logo.css";

const Logo = () => {
  return (
    <Link to="/companies" className="logo-container">
      <img src={lockLogo} alt="Locked in Logo" className="logo" />
    </Link>
  );
};

export default Logo;

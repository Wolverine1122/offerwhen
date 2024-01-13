import { Link } from 'react-router-dom';
import './logo.css';

const Logo = () => {
  return (
    <Link to="/" className="logo-container">
      <img src="./android-chrome-512x512.png" alt="Angry Unicorn Logo" className="logo" />
    </Link>
  );
}

export default Logo;
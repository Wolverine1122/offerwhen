import { Link } from 'react-router-dom';
import Logo from '../Logo/Logo';
import './footer.css'

const Footer = () => {
  return (
    <div className="footer">
      <div className="logo-brand">
        <Logo />
        <h3>OfferWhen</h3>
      </div>
      <div className="footer-links">
        <Link to="/about">About us</Link>
        <Link to="/contact">Contact us</Link>
        <Link to="/privacy">Privacy policy</Link>
      </div>
    </div>
  )
}

export default Footer;
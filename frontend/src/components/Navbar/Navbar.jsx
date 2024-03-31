import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from "../Logo/Logo";
import "./navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen((prevMenuOpen) => !prevMenuOpen);
  };

  const closeMenuOutsideClick = (e) => {
    if (menuOpen && !e.target.closest(".menu-icon")) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", closeMenuOutsideClick);

    return () => {
      document.removeEventListener("click", closeMenuOutsideClick);
    };
  }, [menuOpen]);

  return (
    <div className="navbar">
      <Logo className="logo" />
      <div
        className={`menu-icon ${menuOpen ? "open" : ""}`}
        onClick={toggleMenu}
      >
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>
      <div className="menu" style={{ display: menuOpen ? "grid" : "none" }}>
        <Link to="/companies" onClick={toggleMenu}>
          Home
        </Link>
        <Link to="/about" onClick={toggleMenu}>
          About
        </Link>
        <Link to="/discord-bot" onClick={toggleMenu}>
          Discord Bot
        </Link>
      </div>
    </div>
  );
};

export default Navbar;

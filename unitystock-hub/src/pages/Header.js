import React, { useState } from 'react';
import { Link, useMatch, useResolvedPath, useLocation ,useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHamburger } from "@fortawesome/free-solid-svg-icons";
import logo from "../images/logo-unitystockhub.png";
import { useAuth } from '../pages/auth/AuthContext'; 
import '../css/Header.css';

export default function Header() {
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth(); 
  const handleLogout = () => {
    setIsNavExpanded(false); // Toggle navigation expansion

    // Clear authentication data (e.g., from localStorage)
    localStorage.removeItem('authToken');

    logout(); // Update global state to reflect logout

    navigate('/Login'); // Redirect to the login page
  };
  // Determine if we're on the login or registration page
  const isLoginOrRegister = location.pathname === '/Login' || location.pathname === '/Registration' || location.pathname === '/Home';

  return (
    <header className="header">
      <div className="logo">
        <img src={logo} alt="UnityStock Hub Logo" />
      </div>
      {!isLoginOrRegister && (
        <div id="divHeader">
          <nav className="navigation">
            <button
              className="hamburger"
              onClick={() => {
                setIsNavExpanded(!isNavExpanded);
              }}>
              <FontAwesomeIcon icon={faHamburger} />
            </button>
            <div
              className={
                isNavExpanded ? "navigation-menu expanded" : "navigation-menu"
              }
            >
              <div className="navigation-menu">
                <ul>
                  <CustomLink to="/Division" onClick={() => {
                    setIsNavExpanded(!isNavExpanded);
                  }}>Division</CustomLink>
                  <CustomLink to="/Inventories" onClick={() => {
                    setIsNavExpanded(!isNavExpanded);
                  }}>Inventories</CustomLink>
                  <CustomLink to="/Profile" onClick={() => {
                    setIsNavExpanded(!isNavExpanded);
                  }}>Profile</CustomLink>
                    <CustomLink to="/Login" onClick={handleLogout}>Logout</CustomLink>
                </ul>
              </div>
            </div>
          </nav> 
        </div>
      )}
    </header>
  );
}

function CustomLink({ to, children, ...props }) {
  const resolvedPath = useResolvedPath(to)
  const isActive = useMatch({ path: resolvedPath.pathname, end: true })

  return (
    <li className={isActive ? "active" : ""}>
      <Link to={to} {...props}>
        {children}
      </Link>
    </li>
  )
}

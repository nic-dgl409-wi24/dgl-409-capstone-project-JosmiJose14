import React, { useState } from 'react';
import { Link, useMatch, useResolvedPath, useLocation, useNavigate } from "react-router-dom";
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
  const { user } = useAuth(); // Access global user data
  const handleLogout = () => {
    setIsNavExpanded(false); // Toggle navigation expansion
    // Clear authentication data (e.g., from localStorage)
    localStorage.removeItem('authToken');
    logout(); // Update global state to reflect logout
    navigate('/Login'); // Redirect to the login page
  };
  // Determine if we're on the login or registration page
  const isLoginOrRegister = location.pathname === '/Login' || location.pathname === '/Signup' || location.pathname === '/Home';
  const isRegister = location.pathname === '/Signup' || location.pathname === '/Home';
  const isLogin = location.pathname === '/Login';
  const shouldShowDepartmentsLink = user && user.RoleId !== 2;

  return (
    <header className="header">
      <div className="logo">
        {shouldShowDepartmentsLink ? (
          <Link to="/Division" className="logo">
            <img src={logo} alt="UnityStock Hub Logo" />
          </Link>
        ) : user && user.RoleId === 2 ? (
          <Link to="/Inventories" className="logo">
            <img src={logo} alt="UnityStock Hub Logo" />
          </Link>
        ) : (
          <Link to="/" className="logo">
            <img src={logo} alt="UnityStock Hub Logo" />
          </Link>
        )}
      </div>
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
                {!isLoginOrRegister && (
                  <>
                    {shouldShowDepartmentsLink && (
                      <CustomLink to="/Division" setIsNavExpanded={setIsNavExpanded}>Departments</CustomLink>
                    )}
                    <CustomLink to="/Inventories" setIsNavExpanded={setIsNavExpanded}>Inventories</CustomLink>
                    <CustomLink to="/Profile" setIsNavExpanded={setIsNavExpanded}>Profile</CustomLink>
                    <CustomLink to="/Login" onClick={handleLogout}>Logout</CustomLink>
                  </>
                )}
                {isRegister && (<>
                  <CustomLink to="/" label="Home" setIsNavExpanded={setIsNavExpanded} >Home</CustomLink>
                  <CustomLink to="/Login" label="Login" setIsNavExpanded={setIsNavExpanded} >Login</CustomLink>
                </>
                )}
                {isLogin && (<>
                  <CustomLink to="/" label="Home" setIsNavExpanded={setIsNavExpanded} >Home</CustomLink>
                  <CustomLink to="/Signup" label="Signup" setIsNavExpanded={setIsNavExpanded} >Get Started</CustomLink>
                </>
                )}
              </ul>
            </div>
          </div>
        </nav>
      </div>

    </header>
  );
}
function CustomLink({ to, children, setIsNavExpanded, ...rest }) {
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvedPath.pathname, end: true });

  const handleClick = () => {
    if (typeof setIsNavExpanded === 'function') {
      setIsNavExpanded(false);
    }
    if (rest.onClick) {
      rest.onClick();
    }
  };

  // Remove the setIsNavExpanded and any non-DOM attributes from the props spread to avoid React warnings
  const { label, ...linkProps } = rest;

  return (
    <li className={isActive ? "active" : ""}>
      {/* Spread the remaining props that are safe for the DOM element */}
      <Link to={to} {...linkProps} onClick={handleClick}>
        {children}
      </Link>
    </li>
  );
}

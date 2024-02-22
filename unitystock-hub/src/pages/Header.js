import React, { useState } from 'react';
import { Link, useMatch, useResolvedPath, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHamburger } from "@fortawesome/free-solid-svg-icons";
import logo from "../images/logo-unitystockhub.png";
import '../css/Header.css';

export default function Header() {
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  const location = useLocation();

  // Determine if we're on the login or registration page
  const isLoginOrRegister = location.pathname === '/Login' || location.pathname === '/Register' || location.pathname === '/Home';

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
                  <CustomLink to="/Logout" onClick={() => {
                    setIsNavExpanded(!isNavExpanded);
                  }}>Logout</CustomLink>
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

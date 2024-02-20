import React, { useState } from 'react';
import { Link, useMatch, useResolvedPath, useLocation } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHamburger } from "@fortawesome/free-solid-svg-icons";
import logo from "../images/logo-unitystockhub.png";
import '../css/Header.css'; // Make sure to create a Header.css file for stylings
export default function Header() {
  const location = useLocation();
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  return (
    <header className="header">
       <div className="logo">
        <img src={logo} alt="UnityStock Hub Logo" />
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
          <div
            className="navigation-menu">
            <ul>
              <CustomLink to="/Home" onClick={() => {
                setIsNavExpanded(!isNavExpanded);
              }}>Home</CustomLink>
              <CustomLink to="/Service" onClick={() => {
                setIsNavExpanded(!isNavExpanded);
              }}>Services</CustomLink>
              <CustomLink to="/Appointments" onClick={() => {
                setIsNavExpanded(!isNavExpanded);
              }}>Appointments</CustomLink>
            </ul>
          </div>
        </div>
      </nav> 
    </div>
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


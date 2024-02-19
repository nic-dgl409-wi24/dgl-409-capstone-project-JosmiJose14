import React from 'react';
import logo from "../images/logo-unitystockhub.png";
import '../css/Header.css'; // Make sure to create a Header.css file for stylings
const Header = () => {
  return (
    <header className="header">
      <div className="logo">       
        <img src={logo} alt="UnityStock Hub Logo" />
      </div>
      
    </header>
  );
};

export default Header;

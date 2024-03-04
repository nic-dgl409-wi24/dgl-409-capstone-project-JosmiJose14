import React from 'react';
import { FaInstagram, FaLinkedinIn, FaFacebookF } from 'react-icons/fa';
import '../css/Footer.css'; // Ensure the path is correct for your project structure

function Footer() {
  return (
    <footer className="footer">
      <div className="footerAboutUS">
        <div className="column">
          <h3 className="footerHeading">About UnityStock Hub</h3>
          <p>Empowering businesses through efficient inventory solutions.</p>
        </div>
        <div className="column">
          <h3 className="footerHeading">Connect With Us</h3>
          <div className="footerSub">
            <FaInstagram />
            <FaLinkedinIn />
            <FaFacebookF />
          </div>
        </div>
        <div className="column">
          <h3 className="footerHeading">Resources</h3>
          <p>User Manual</p>
          <p>FAQs</p>
        </div>
      </div>
      <div className="footer-bottom">
        <small>"This is a fictional website that was designed and coded as an educational exercise. It is not intended to be seen outside of the class environment. None of the content and images were approved by the business owner."</small>
      </div>
    </footer>
  );
}

export default Footer;

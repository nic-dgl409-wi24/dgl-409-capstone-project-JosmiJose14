import React from 'react';
import { FaInstagram, FaLinkedinIn, FaFacebookF } from 'react-icons/fa';
import '../css/Footer.css'; // Ensure the path is correct for your project structure

function Footer() {
  return (
    <footer className="footer">
    
      <div className="footerAboutUS">
        <div className="column">
          <h3 className="footerHeading">Unitystock Hub</h3>
          <div className="footerSub">
          <p>Streamlining Your Inventory, Simplifying Your Success!</p>
          </div>
        </div>
        <div className="column">
          <h3 className="footerHeading">Contact Us</h3>
          <div className="footerSub">
            <p><FaInstagram style={{ fontSize: '18px' }} /></p>
            <p><FaLinkedinIn style={{ fontSize: '18px' }} /></p>
            <p><FaFacebookF /></p>
          </div>
        </div>
        <div className="column">
          <h3 className="footerHeading">User Instructions</h3>
          <div className="footerSub">
          <p>User Manual</p>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
      <small><em>"This is a fictional website that was designed and coded as an educational exercise. It is not intended to be seen outside of the class environment. None of the content and images were approved by the business owner."</em></small>
      </div>
    </footer>
  );
}

export default Footer;

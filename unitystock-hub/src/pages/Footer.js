import React from 'react';
import { FaEnvelope, FaMobile, FaHome } from 'react-icons/fa';

function Footer() {
  return (
    <div id="divfooter">
      <div className="footerAboutUS">
        <div className="column">
          <h3 className="footerHeading">Services</h3>
          <div className="footerSub">
            <p>Hair Examination and Remedies</p>
            <p>Gender-free haircuts</p>
            <p>Hair Treatments</p>
            <p>Transform my feel</p>
          </div>
        </div>
        <div className="column">
          <h3 className="footerHeading">Contact Us</h3>
          <div className="footerSub">
            <p><FaEnvelope />&nbsp;hairwithflair@shaw.ca</p>
            <p><FaMobile style={{ fontSize: '18px' }} />&nbsp;250-992-1858</p>
            {/* <p><FaFax />&nbsp;250-992-1858</p> */}
            <p><FaHome />&nbsp;xyz abc Road, Courtney, BC</p>
            {/* <p><a href="" target="_blank"><FaFacebook /></a></p> */}
          </div>
        </div>
        <div className="column">
          <h3 className="footerHeading">Business Hours</h3>
          <div className="footerSub">
            <p>Tue-Sat: 10.00am - 5.00pm</p>
            <p>Sun & Mon: Closed</p>
          </div>
        </div>
      </div>
      <footer>
        <small><em>"This is a fictional website that was designed and coded as an educational exercise. It is not intended to be seen outside of the class environment. None of the content and images were approved by the business owner."</em></small>
      </footer>
    </div>
  );
}

export default Footer;
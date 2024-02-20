// LandingPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Home.css';  // Ensure you have a LandingPage.css file for styling
import { FaShieldAlt, FaUserFriends, FaBoxes }from 'react-icons/fa'; 
import customerImage from "../images/Renu.JPG";

const Home = () => {
  return (
    <div className="landing-page">
      <section className="hero-section">
       </section>
      
      <div className="home-page-content">
      <section className="welcome-section">
        <div className="welcome-text">
          <h2>Welcome to UnityStock</h2>
          <p>Welcome to UnityStock, your ultimate solution for streamlined inventory management! With our intuitive app, stay in control of your stock in real-time, across diverse industries. Simplify your operations and optimize efficiency with UnityStock today!</p>
        </div>
        <section className="testimonial-section">
      <div className="testimonial-container">
        <div className="testimonial-text">
          "UnityStock Hub transformed our inventory management, offering real-time insights and seamless data synchronization. It's intuitive, efficient, and an essential asset for our business."
        </div>
        <img src={customerImage} alt="Satisfied Customer" className="testimonial-image" />
      </div>
    </section>
      </section>

      <section className="features-section">
        <div className="feature">
          <FaShieldAlt className="feature-icon" />
          <h3>Security</h3>
          <p>User-Friendly Authentication</p>
        </div>
        <div className="feature">
          <FaUserFriends className="feature-icon" />
          <h3>Interface</h3>
          <p>User-Friendly Interface</p>
        </div>
        <div className="feature">
          <FaBoxes className="feature-icon" />
          <h3>Applicability</h3>
          <p>Cross-Industry Applicability</p>
        </div>
      </section>

      <section className="cta-section">   
       <Link to="/Registration" className="cta-button join-now">Join Now</Link>
        <button className="cta-button welcome-back">Welcome Back</button>
      </section>
    </div>
    </div>
  );
};

export default Home;

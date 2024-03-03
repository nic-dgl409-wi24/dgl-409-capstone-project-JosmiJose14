// LandingPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Home.css';  // Ensure you have a LandingPage.css file for styling
import { FaShieldAlt, FaUserFriends, FaBoxes } from 'react-icons/fa';
import customerImage from "../images/Renu.JPG";
import heroImage from "../images/Hero.jpg";
const Home = () => {
  return (
    <div className="landing-page">
       {/* Hero Section */}
       <section className="hero-section" style={{ backgroundImage: `url(${heroImage})` }}>
        <div className="hero-overlay">
          <h1>Effortless Inventory Management</h1>
          <p>Join UnityStock Hub today and take control of your inventory with ease.</p>
          <Link to="/Signup" className="btn hero-cta">Get Started</Link>
        </div>
      </section>
      <div className="home-page-content">
        {/* Welcome Section */}
        <section className="welcome-section">
          <h2 className="section-heading">Welcome to UnityStock Hub</h2>
          <div className="welcome-text">
            <p>Your ultimate solution for streamlined inventory management! With our intuitive app, stay in control of your stock in real-time, across diverse industries. Simplify your operations and optimize efficiency with UnityStock today!</p>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <h2 className="section-heading">Why Choose Us</h2>
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
   
        {/* Testimonial Section */}
        <section className="testimonial-section">
          
          <div className="testimonial-container">
          <h2 className="section-heading">Client Testimonials</h2>
            <blockquote className="testimonial-text">
              "UnityStock Hub transformed our inventory management, offering real-time insights and seamless data synchronization. It's intuitive, efficient, and an essential asset for our business."
            </blockquote>
            <img src={customerImage} alt="Satisfied Customer" className="testimonial-image" />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;

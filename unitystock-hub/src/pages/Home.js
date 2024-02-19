// LandingPage.js
import React from 'react';
import '../css/Home.css';  // Ensure you have a LandingPage.css file for styling
import { FaLock, FaUser, FaGlobe } from 'react-icons/fa'; // Icons for features

const Home = () => {
  return (
    <div className="landing-page">
      <section className="hero-section">
        {/* Hero image should be set as a background in CSS */}
        <div className="overlay-text">
          <h1>UnityStock Hub</h1>
          <p>Your inventory managed effortlessly.</p>
        </div>
      </section>
      
      <section className="welcome-section">
        <div className="welcome-text">
          <h2>Welcome to UnityStock</h2>
          <p>Your ultimate solution for streamlined inventory management! With our intuitive app, stay in control of your stock in real-time, across diverse industries. Simplify your operations and optimize efficiency with UnityStock today!</p>
        </div>
        <div className="testimonial">
          <blockquote>
            "UnityStock Hub transformed our inventory management, offering real-time insights and seamless data synchronization. It's intuitive, efficient, and an essential asset for our business."
          </blockquote>
          <div className="testimonial-author">
            <img src="path_to_author_image.jpg" alt="Satisfied Customer" />
            <p className="author-name">Jane Doe</p>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="feature">
          <FaLock />
          <h3>Security</h3>
          <p>User-Friendly Authentication</p>
        </div>
        <div className="feature">
          <FaUser />
          <h3>Interface</h3>
          <p>User-Friendly Interface</p>
        </div>
        <div className="feature">
          <FaGlobe />
          <h3>Applicability</h3>
          <p>Cross-Industry Applicability</p>
        </div>
      </section>

      <section className="cta-section">
        <button className="cta-button">Join Now</button>
        <button className="cta-button">Welcome Back</button>
      </section>
    </div>
  );
};

export default Home;

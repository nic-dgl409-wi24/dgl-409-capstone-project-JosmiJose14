import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Login.css'; // Ensure you have the CSS file for styling
import loginImage from "../images/login-image.png";
import config from '../common/config';
import { useAuth } from '../pages/auth/AuthContext'; 
import axios from 'axios';
const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth(); // Destructure the login function
    // The `useState` hook is used here to define `credentials` and `setCredentials`
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prevCredentials => ({
            ...prevCredentials,
            [name]: value
        }));
    };

// ...
const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${config.server.baseUrl}/login`, {
        email: credentials.email, // Ensure the field names match the backend expectations
        password: credentials.password
      });
      console.log(response.data);
         // Check if the login is successful
         debugger
         if (response.data.message === 'Login successful') {
            login(response.data.user); //
            navigate('/Division'); // Redirect on success
          } else {
            // Handle other responses
          }
    } catch (error) {
      console.error('Login error', error.response);
      // Handle errors here
    }
  };
  // ...
  

    return (
        <div className="login">
            <h2>Welcome Back</h2> {/* Heading for the form */}
            <div className="login-container">
                <div className="login-info">
                    <img
                        className="login-image"
                        src={loginImage} // Placeholder image path
                        alt="Login"
                    />
                </div>
                <div className="login-form">
                    <p>Please sign in to access your inventory management dashboard and streamline your business operations. Manage your inventory with ease and efficiency. Let's get started</p>
                    <form onSubmit={handleSubmit}>
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    type="email"
                    name="email"
                    value={credentials.email} // Bind input to state
                    placeholder="Email"
                    onChange={handleChange} // Set up change handler
                />
                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    type="password"
                    name="password"
                    value={credentials.password} // Bind input to state
                    placeholder="Password"
                    onChange={handleChange} // Set up change handler
                />

                <div className="divButton">
                    <button type="submit" className='btn btnLogin'>Login</button>
                </div>
            </form>
                </div>
            </div>
            <div className="join-container">
                <p>Don’t you have account?  </p>
                <button className="btn join-now-button">Join Now</button>
            </div>
            <div className="login-footer">
                <p>Welcome back to UnityStock Hub! Please sign in to access your inventory management dashboard and streamline your business operations. Manage your inventory with ease and efficiency. Let's get started</p>
            </div>
        </div>
    );
};

export default LoginPage;

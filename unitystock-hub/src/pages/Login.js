import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../css/Login.css';  //Ensure you have the CSS file for styling
import loginImage from "../images/login-image.png";
import config from '../common/config';
import { useAuth } from '../pages/auth/AuthContext';
import axios from 'axios';
const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth(); // Destructure the login function
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

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
        // Simple front-end validation for empty fields
        if (!credentials.email || !credentials.password) {
            setMessage('Please enter both email and password.');
            setIsError(true);
            return;
        }
        try {
            const response = await axios.post(`${config.server.baseUrl}/login`, {
                email: credentials.email, // Ensure the field names match the backend expectations
                password: credentials.password
            });
            if (response.data.message === 'Login successful') {
                login(response.data.user);
                navigate('/Division');
                setMessage('Login successful. Redirecting...');
                setIsError(false);
            } else {
                setMessage('Login failed. Please check your credentials.');
                setIsError(true);
            }
        } catch (error) {
            console.error('Login error', error.response);
            setMessage(error.response?.data?.message || 'An error occurred during login.');
            setIsError(true);
        }
    };
    return (
        <div className="login">
            <div className="login-page">
                <div className="left-panel">
                    <div className="content">
                        <h2 className='section-heading'>UnityStock Hub</h2>
                        <p>Keep your inventory organized and accessible. Log in to manage your stock efficiently.</p>
                        <div className="login-info">
                            <img className="login-image" src={loginImage} alt="Login" />
                        </div>
                    </div>
                </div>
                <div className="login-form">
                    <form onSubmit={handleSubmit} >
                        <h2 className='section-heading'>Welcome Back</h2> {/* Heading for the form */}
                        <div className={`message ${isError ? 'error-message' : 'success-message'}`}>{message}</div>
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={credentials.email}
                            placeholder="Email"
                            onChange={handleChange}
                        />
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={credentials.password}
                            placeholder="Password"
                            onChange={handleChange}
                        />
                        <div className="divButton">
                            <button type="submit" className="btn btnLogin">Login</button>
                        </div>
                    </form>
                </div>
            </div>
            <div className="join-container">
                <p>Don’t you have account?  </p>
                <Link to="/Signup" className="btn hero-cta">Get Started</Link>
            </div>
            <div className="login-footer">
                <p>Welcome back to UnityStock Hub! Please sign in to access your inventory management dashboard and streamline your business operations. Manage your inventory with ease and efficiency. Let's get started</p>
            </div>
        </div>
    );
};

export default LoginPage;

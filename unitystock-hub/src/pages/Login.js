import React, { useState } from 'react';
import '../css/Login.css'; // Ensure you have the CSS file for styling
import loginImage from "../images/login-image.png";
const LoginPage = () => {
    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prevCredentials => ({
            ...prevCredentials,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Login logic here
        console.log(credentials);
    };

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
                    <form>
                        <label htmlFor="email">Email</label>
                        <input type="email" placeholder="email" />
                        <label htmlFor="password">Password</label>
                        <input type="password" placeholder="Password" />

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

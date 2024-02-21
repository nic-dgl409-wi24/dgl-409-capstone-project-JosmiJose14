import React, { useState } from 'react';
import '../css/Login.css'; // Ensure you have the CSS file for styling

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
    <div className="login-container">
      <div className="login-header">
        {/* Add your graphics and images here */}
      </div>
      <form className="login-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={credentials.username}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={credentials.password}
          onChange={handleChange}
        />
        <button type="submit" className="login-button">Login</button>
        <button type="button" className="join-button">Join Now</button>
      </form>
      <div className="login-footer">
        <p>Welcome back to UnityStock Hub! Please sign in to access your inventory management dashboard and streamline your business operations. Manage your inventory with ease and efficiency. Let's get started</p>
      </div>
    </div>
  );
};

export default LoginPage;

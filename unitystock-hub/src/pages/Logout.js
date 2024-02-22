import React from 'react';
import { useAuth } from './auth/AuthContext'; // Import your AuthContext
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login page
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
};

export default LogoutButton;

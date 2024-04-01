import React, { createContext, useContext, useState, useEffect } from 'react';

// Context providing user data and functions to manipulate login state
const AuthContext = createContext({
  user: null, // Current user object
  login: () => {}, // Function to log the user in
  logout: () => {}, // Function to log the user out
});
// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

  // Effect to persist user state in local storage
  useEffect(() => {
    // Persisting user object in local storage
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = (user) => {
    // Assuming 'user' is the user object you get from your login API
    setUser(user);
    // Optionally, handle token setting or additional logic here
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user'); // Clear user from local storage on logout
    // Here you could also make an API call to inform the backend about the logout
    // Example: axios.post('/api/logout').then(() => setUser(null));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

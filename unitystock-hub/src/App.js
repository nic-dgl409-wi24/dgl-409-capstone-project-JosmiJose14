import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Header from './pages/Header';
import Footer from './pages/Footer';
import Home from './pages/Home';
import Registration from './pages/Registration';
import Login from './pages/Login';



function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/Home" replace />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/Registration" element={<Registration />} />
        <Route path="/Login" element={<Login />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;

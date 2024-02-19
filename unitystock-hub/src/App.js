import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Header from './pages/Header';
import Footer from './pages/Footer';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/Home" replace />} />
        <Route path="/Home" element={<Home />} />
        {/* Uncomment and create the following components when needed */}
        {/* <Route path="/Service" element={<Service />} />
        <Route path="/Appointments" element={<Appointments />} /> */}
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;

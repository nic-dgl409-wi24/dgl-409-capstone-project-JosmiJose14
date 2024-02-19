import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Header from './pages/Header';
import Footer from './pages/Footer';
import Landing from './pages/Landing';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/Landing" replace />} />
        <Route path="/Landing" element={<Landing />} />
        {/* Uncomment and create the following components when needed */}
        {/* <Route path="/Service" element={<Service />} />
        <Route path="/Appointments" element={<Appointments />} /> */}
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;

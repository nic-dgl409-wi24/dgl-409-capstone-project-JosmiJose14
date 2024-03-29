import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './pages/auth/AuthContext'; 
import Header from './pages/Header';
import Footer from './pages/Footer';
import Home from './pages/Home';
import Registration from './pages/Registration';
import Login from './pages/Login';
import Division from './pages/Division';
import AddDivision from './pages/AddDivision';
import SubDivision from './pages/SubDivision';
import AddSubDivision from './pages/AddSubDivision';
import Inventories from './pages/Inventory';
import AddInventories from './pages/AddInventory';
function App() {
  return (
    <AuthProvider>
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/Home" replace />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/Signup" element={<Registration />} />
        <Route path="/Profile" element={<Registration />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Division" element={<Division />} />        
        <Route path="/AddDivision/add" element={<AddDivision />} />
        <Route path="/AddDivision/edit/:id" element={<AddDivision />} />
        <Route path="/SubDivision/:divisionId" element={<SubDivision />} />
        <Route path="/AddSubDivision/add/:divisionId" element={<AddSubDivision />} />
        <Route path="/AddSubDivision/edit/:id" element={<AddSubDivision />} />
        <Route path="/Inventories" element={<Inventories />} />
        <Route path="/Inventories/:subId" element={<Inventories />} />
        <Route path="/AddInventories/add/" element={<AddInventories />} />
        <Route path="/AddInventories/add/:subId" element={<AddInventories />} />
        <Route path="/AddInventories/edit/:id" element={<AddInventories />} />
        <Route path="/AddInventories/edit/:subId/:id" element={<AddInventories />} />
     </Routes>
      <Footer />
    </Router>
    </AuthProvider>
  );
}

export default App;

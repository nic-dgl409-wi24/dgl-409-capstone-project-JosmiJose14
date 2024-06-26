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
import { Helmet } from 'react-helmet';
function App() {
  return (
    <div className="App">
    <Helmet>
      <script type="text/javascript">
        {`
        (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "lq03snmd2o");
        `}
      </script>
    </Helmet>
    <AuthProvider>
    <Router>
      <Header />
      <Routes>
        <Route path="/unitystockhub" element={<Navigate to="/unitystockhub/Home" replace />} />
        <Route path="/unitystockhub/Home" element={<Home />} />
        <Route path="/unitystockhub/Signup" element={<Registration />} />
        <Route path="/unitystockhub/Profile" element={<Registration />} />
        <Route path="/unitystockhub/Login" element={<Login />} />
        <Route path="/unitystockhub/Division" element={<Division />} />        
        <Route path="/unitystockhub/AddDivision/add" element={<AddDivision />} />
        <Route path="/unitystockhub/AddDivision/edit/:id" element={<AddDivision />} />
        <Route path="/unitystockhub/SubDivision/:divisionId" element={<SubDivision />} />
        <Route path="/unitystockhub/AddSubDivision/add/:divisionId" element={<AddSubDivision />} />
        <Route path="/unitystockhub/AddSubDivision/edit/:id" element={<AddSubDivision />} />
        <Route path="/unitystockhub/Inventories" element={<Inventories />} />
        <Route path="/unitystockhub/Inventories/:subId" element={<Inventories />} />
        <Route path="/unitystockhub/AddInventories/add/" element={<AddInventories />} />
        <Route path="/unitystockhub/AddInventories/add/:subId" element={<AddInventories />} />
        <Route path="/unitystockhub/AddInventories/edit/:id" element={<AddInventories />} />
        <Route path="/unitystockhub/AddInventories/edit/:subId/:id" element={<AddInventories />} />
     </Routes>
      <Footer />
    </Router>
    </AuthProvider>
    </div>
  );
  
}
// In your index.js or App.js
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.ready.then(registration => {
    registration.unregister();
  });
}

export default App;

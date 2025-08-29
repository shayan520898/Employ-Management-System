// src/components/NavbarPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const NavbarPage = () => {
  const navigate = useNavigate();

  return (
    <div >
      <h2>Employee Registered Successfully!</h2>
      <nav >
        <button className="btn" onClick={() => navigate('/')} style={{ marginLeft: '10px',color:'black'}}>Register Another Employee</button>
         
        <button className="btn" onClick={() => navigate('/admin-login')} style={{ marginLeft: '10px',color:'black'}} >
          Go to Dashboard
        </button>
      </nav>
    </div>
  );
};

export default NavbarPage;

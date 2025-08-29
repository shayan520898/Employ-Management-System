import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <div className="navbar">
     
      <button className="btn" onClick={() => navigate('/admin-login')} style={{ marginLeft: '10px',color:'black'}}>
        Go to Dashboard
      </button>
    </div>
  );
};

export default Navbar;

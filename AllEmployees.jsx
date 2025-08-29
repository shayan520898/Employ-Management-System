import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/style.css'; 

const AllEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/employee', {
        credentials: 'include',
      });
      const data = await res.json();
      setEmployees(data);
      setFilteredEmployees(data);
    };
    fetchData();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = employees.filter(emp =>
      emp.firstName?.toLowerCase().includes(value) ||
      emp.lastName?.toLowerCase().includes(value) ||
      emp._id?.toLowerCase().includes(value)
    );

    setFilteredEmployees(filtered);
  };

const handleLogout = async () => {
    try {
      const response = await fetch('http://172.16.3.174:5000/api/admin/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        alert('You have logged out.');
        navigate('/admin-login');
      } else {
        alert('Logout failed.');
      }
    } catch (error) {
      alert('Error logging out.');
    }
  };



  const handleDelete = async (id) => {
    await fetch(`/${id}`, { method: 'DELETE' });
    const updated = employees.filter(emp => emp._id !== id);
    setEmployees(updated);
    setFilteredEmployees(updated);
  };

  // No need to check isAuthenticated here; ProtectedRoute handles it

  return (
    <div className="container">
      <h2 className="heading">All Employees</h2>

      <input
        type="text"
        placeholder="🔍 Search by name or ID"
        value={searchTerm}
        onChange={handleSearch}
        className="search-input"
      />

      <button onClick={() => navigate('/')} className="btn btn-primary back-button">⬅ Back</button>
    
      {filteredEmployees.length > 0 ? (
        <div className="employee-grid">
          {filteredEmployees.map(emp => (
            <div key={emp._id} className="employee-card">
              <h3>{emp.firstName} {emp.lastName}</h3>
              <p>{emp.city}</p>
              <div className="button-group">
                <Link to={`/details/${emp._id}`} className="btn btn-primary">Details</Link>
                <Link to={`/edit/${emp._id}`} className="btn btn-secondary">Edit</Link>
                <Link to={`/view-private-details/${emp._id}`} className="btn btn-primary">Private</Link>
                <button onClick={() => handleDelete(emp._id)} className="btn btn-danger">Delete</button>
              </div>
            </div>))}
         
          
        </div>
      ) : (
        <p className="no-results">No employees found.</p>
      )}
         <div >
              <button onClick={(handleLogout)} className="Logout-btn">Logout</button>
            </div>
    </div>
  );
};


export default AllEmployees;


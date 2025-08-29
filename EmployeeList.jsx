import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);

  const fetchData = async () => {
    try {
      const res = await fetch('http://172.16.3.174:5000/api/employee');
      const data = await res.json();
      console.log('Fetched employees:', data);
      setEmployees(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching list:', err);
      setEmployees([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container">
      <h1>All Employees</h1>
      <p>Total: {employees.length}</p>

      {employees.length > 0 ? (
        <div className="employee-list">
          {employees.map(emp => (
            <div key={emp._id} className="employee-card">
              <h3>{emp.firstName} {emp.lastName}</h3>
              <p><strong>City:</strong> {emp.city}</p>
              <div className="button-group">
                <Link to={`/details/${emp._id}`} className="btn btn-primary">Details</Link>
                <Link to={`/edit/${emp._id}`} className="btn btn-secondary">Edit</Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No employees to display.</p>
      )}
    </div>
  );
};

export default EmployeeList;

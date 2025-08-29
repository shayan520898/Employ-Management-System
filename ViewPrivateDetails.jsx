import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ViewPrivateDetails = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://172.16.3.174:5000/api/employee/${id}`)
      .then(res => res.json())
      .then(data => setEmployee(data))
      .catch(err => console.error('Error fetching employee:', err));
  }, [id]);

  if (!employee) return <div>Loading...</div>;

  return (
    <div className="container">
      <h2>Private Employee Details</h2>
      <div><strong>Name:</strong> {employee.firstName} {employee.lastName}</div>
      <div><strong>Employee ID:</strong> {employee.employee?._id || employee._id}</div>
      <div><strong>Joining Date:</strong> {employee.joiningDate}</div>
      <div><strong>Salary:</strong> {employee.salary}</div>
      <div><strong>Private Notes:</strong> {employee.privateNotes || "None"}</div>

      <div style={{ marginTop: "20px" }}>
        <button onClick={() => navigate('/all-employees')} className="btn btn-primary">
          Back to Dashboard
        </button>
        <button
          onClick={() => navigate(`/private-details/${employee._id}`)}
          className="btn btn-secondary"
          style={{ marginLeft: '10px' }}
        >
          Edit Details
        </button>
      </div>
    </div>
  );
};

export default ViewPrivateDetails;

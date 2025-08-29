import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import NavbarPage from './NavbarPage';

const EmployeeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    fetch(`http://172.16.3.174:5000/api/employee/${id}`)
      .then((res) => res.json())
      .then((data) => setEmployee(data))
      .catch((err) => console.error('Failed to fetch employee:', err));
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        const res = await fetch(`http://172.16.3.174:5000/api/employee/${id}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          alert('Employee deleted successfully');
          navigate('/');
        } else {
          alert('Failed to delete employee');
        }
      } catch (error) {
        console.error('Delete error:', error);
        alert('Server error while deleting employee');
      }
    }
  };

  if (!employee) return <p>Loading...</p>;

  return (
    <div className="container">
      <NavbarPage />
      <h2>Employee Details</h2>
      <div className="details-box">

        <div className="row">
          <div className="form-group">
            <label>First Name</label>
            <p>{employee.firstName}</p>
          </div>
          <div className="form-group">
            <label>Middle Name</label>
            <p>{employee.middleName}</p>
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <p>{employee.lastName}</p>
          </div>
        </div>

        <div className="form-group">
          <label>Employee ID</label>
          <p>{employee._id}</p>
        </div>

        <div className="form-group">
          <label>Date of Birth</label>
          <p>{employee.birthMonth} {employee.birthDay}, {employee.birthYear}</p>
        </div>

        <div className="form-group">
          <label>Address</label>
          <p>{employee.address1}</p>
        </div>

        <div className="row">
          <div className="form-group">
            <label>City</label>
            <p>{employee.city}</p>
          </div>
          <div className="form-group">
            <label>State / Province</label>
            <p>{employee.state}</p>
          </div>
        </div>

        <div className="form-group">
          <label>Zip Code</label>
          <p>{employee.zip}</p>
        </div>

        {/* Department Info */}
        <div className="form-group">
          <label>Department</label>
          <p>
            {employee.departmentId
              ? employee.departmentId
              : employee.newDepartmentName
              ? `New - ${employee.newDepartmentName}`
              : 'Not specified'}
          </p>
        </div>

        {/* Roles Info */}
        {employee.roles && employee.roles.length > 0 && (
          <div className="form-group">
            <label>Assigned Roles</label>
            <ul>
              {employee.roles.map((role, index) => (
                <li key={index}>{role}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Uploaded Images */}
        {employee.images && employee.images.length > 0 && (
          <div className="form-group">
            <label>Uploaded Images</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {employee.images.map((img, index) => (
                <img
                  key={index}
                  src={`http://172.16.3.174:5000/uploads/${img}`}
                  alt={`employee-${index}`}
                  style={{
                    width: '150px',
                    height: 'auto',
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                  }}
                />
              ))}
            </div>
          </div>
        )}

        <div className="button-group">
          <button className="btn btn-primary" onClick={() => navigate(-1)}>⬅ Back</button>
          <Link to={`/edit/${employee._id}`} className="btn btn-secondary">✏️ Edit</Link>
          <button className="btn btn-danger" onClick={handleDelete}>🗑️ Delete</button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;

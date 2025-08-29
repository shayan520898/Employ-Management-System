import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const EmployeeForm = () => {
  const navigate = useNavigate();
  const [employee, setEmployee] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    birthMonth: '',
    birthDay: '',
    birthYear: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    departmentId: '',
    newDepartmentName: '',
    roles: [],
  });

  const [images, setImages] = useState([]); // For image files
  const [createNewDepartment, setCreateNewDepartment] = useState(false);
  // const [departments, setDepartments] = useState([]);
  const [availableRoles] = useState([
    'Manager',
    'Developer',
    'Designer',
    'HR',
    'Sales',
    'Intern',
  ]);

  const [departments] = useState([
  { id: 'eng', name: 'Engineering' },
   { id: 'app', name: 'App Development' },
  { id: 'Game', name: 'Game Development' },
  { id: 'web', name: 'Web Development' },
  { id: 'hr', name: 'Human Resources' },
  { id: 'sales', name: 'Sales' },
  { id: 'marketing', name: 'Marketing' },
  { id: 'it', name: 'IT Support' },
 
]);

 
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'roles') {
      const updatedRoles = checked
        ? [...(employee.roles || []), value]
        : (employee.roles || []).filter((role) => role !== value);
      setEmployee({ ...employee, roles: updatedRoles });
    } else {
      setEmployee({ ...employee, [name]: value });
    }
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files)); // Support multiple images
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    // Append employee fields
    for (const key in employee) {
      if (key === 'roles') {
        (employee.roles || []).forEach((role) => formData.append('roles', role));
      } else {
        formData.append(key, employee[key]);
      }
    }

    // Append image files
    images.forEach((file) => {
      formData.append('images', file); // Your backend should handle 'images' field
    });

    formData.append('createNewDepartment', createNewDepartment);

    try {
      const response = await fetch('http://172.16.3.174:5000/api/employee', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        navigate(`/details/${result.id}`);
      } else {
        alert('Failed to submit employee');
      }
    } catch (err) {
      console.error(err);
      alert('Error submitting data');
    }
  };

  return (
    <div className="container">
      <Navbar />
      <h1>Employee Application</h1>
      <p>Please complete the form below.</p>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* Name fields */}
        <div className="row">
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              value={employee.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Middle Name</label>
            <input
              type="text"
              name="middleName"
              value={employee.middleName}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={employee.lastName}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* DOB fields */}
        <div className="row">
          <div className="form-group">
            <label>Birth Month</label>
            <select name="birthMonth" value={employee.birthMonth} onChange={handleChange} required>
              <option value="">Select Month</option>
              {[
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December',
              ].map((month) => (
                <option key={month}>{month}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Birth Day</label>
            <select name="birthDay" value={employee.birthDay} onChange={handleChange} required>
              <option value="">Select Day</option>
              {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                <option key={day}>{day}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Birth Year</label>
            <select name="birthYear" value={employee.birthYear} onChange={handleChange} required>
              <option value="">Select Year</option>
              {Array.from({ length: 50 }, (_, i) => 2015 - i).map((year) => (
                <option key={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Address */}
        <div className="form-group">
          <label>Address</label>
          <input
            type="text"
            name="address1"
            value={employee.address1}
            onChange={handleChange}
            maxLength={100}
            required
          />
        </div>

        <div className="row">
          <div className="form-group">
            <label>City</label>
            <input
              type="text"
              name="city"
              value={employee.city}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>State / Province</label>
            <input
              type="text"
              name="state"
              value={employee.state}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Postal / Zip Code</label>
          <input
            type="text"
            name="zip"
            value={employee.zip}
            onChange={handleChange}
            required
          />
        </div>

        {/* Department Section */}
        {/* Department Section */}
<div className="form-group">
  <label>Department Mode</label>
  <select
    value={createNewDepartment ? 'new' : 'existing'}
    onChange={(e) => setCreateNewDepartment(e.target.value === 'new')}
    className="form-control"
  >
    <option value="existing">Select Existing Department</option>
    <option value="new">Create New Department</option>
  </select>
</div>

        {!createNewDepartment ? (
          <div className="form-group">
            <label>Select Department</label>
            <select
              name="departmentId"
              value={employee.departmentId || ''}
              onChange={handleChange}
              required
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <>
            <div className="form-group">
              <label>New Department Name</label>
              <input
                type="text"
                name="newDepartmentName"
                value={employee.newDepartmentName || ''}
                onChange={handleChange}
                required
              />
            </div>

           <div className="form-group">
  <label>Assign Role to New Department</label>
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginTop: '10px' }}>
    {availableRoles.map((role) => (
      <label
        key={role}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 12px',
          border: '1px solid #ccc',
          borderRadius: '5px',
          cursor: 'pointer',
          backgroundColor: employee.roles?.[0] === role ? '#0e091aff' : '#0e091aff',
        }}
      >
        <input
          type="radio"
          name="roles"
          value={role}
          checked={employee.roles?.[0] === role}
          onChange={(e) =>
            setEmployee({ ...employee, roles: [e.target.value] })
          }
        />
        {role}
      </label>
    ))}
  </div>
</div>

          </>
        )}

        {/* Image Upload Field */}
        <div className="form-group">
          <label>Upload Image(s)</label>
          <input
            type="file"
            name="images"
            accept="image/*"
            multiple
            onChange={handleImageChange}
          />
        </div>

        <div className="button-group">
          <button type="submit" className="btn btn-primary">🎮 Submit</button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;

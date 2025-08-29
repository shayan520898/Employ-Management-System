import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/style.css';

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [newImages, setNewImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [createNewDepartment, setCreateNewDepartment] = useState(false);

  const [availableRoles] = useState([
    'Manager',
    'Developer',
    'Designer',
    'HR',
    'Sales',
    'Intern',
  ]);

  const [departments] = useState([
    { id: 'Engineering', name: 'Engineering' },
    { id: 'App Development', name: 'App Development' },
    { id: 'Game Development', name: 'Game Development' },
    { id: 'Web Development', name: 'Web Development' },
    { id: 'HR', name: 'Human Resources' },
    { id: 'Sales', name: 'Sales' },
    { id: 'Marketing', name: 'Marketing' },
    { id: 'IT', name: 'IT Support' },
  ]);

  useEffect(() => {
    fetch(`/api/employee/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setEmployee(data);
        setExistingImages(data.images || []);
        setCreateNewDepartment(!!data.newDepartmentName);
      })
      .catch(() => alert('Error fetching employee data'));
  }, [id]);

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
    setNewImages(Array.from(e.target.files));
  };

  const removeExistingImage = (imgName) => {
    setExistingImages(existingImages.filter((img) => img !== imgName));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();

      for (let key in employee) {
        if (key === '_id' || key === 'images') continue;
        if (key === 'roles') {
          (employee.roles || []).forEach((role) => formData.append('roles', role));
        } else {
          formData.append(key, employee[key]);
        }
      }

      formData.append('createNewDepartment', createNewDepartment);

      existingImages.forEach((img) => {
        formData.append('existing_images', img);
      });

      newImages.forEach((file) => {
        formData.append('images', file);
      });

      const res = await fetch(`http://172.16.3.174:5000/api/employee/${id}`, {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        alert('Employee updated successfully');
        navigate('/all-employees');
      } else {
        const errData = await res.json();
        alert('Failed to update: ' + (errData.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Server error. Please check the backend.');
    }
  };

  if (!employee) return <p>Loading employee info...</p>;

  return (
    <div className="container">
      <h1>Edit Employee Info</h1>
      <form onSubmit={handleSubmit} className="employee-form" encType="multipart/form-data">

        {/* Name */}
        <div className="row">
          <div className="form-group">
            <label>First Name</label>
            <input name="firstName" value={employee.firstName || ''} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Middle Name</label>
            <input name="middleName" value={employee.middleName || ''} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input name="lastName" value={employee.lastName || ''} onChange={handleChange} required />
          </div>
        </div>

        {/* DOB */}
        <div className="row">
          <div className="form-group">
            <label>Birth Month</label>
            <select name="birthMonth" value={employee.birthMonth || ''} onChange={handleChange} required>
              <option value="">Month</option>
              {[
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
              ].map((month) => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Birth Day</label>
            <select name="birthDay" value={employee.birthDay || ''} onChange={handleChange} required>
              <option value="">Day</option>
              {[...Array(31)].map((_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Birth Year</label>
            <select name="birthYear" value={employee.birthYear || ''} onChange={handleChange} required>
              <option value="">Year</option>
              {Array.from({ length: 60 }, (_, i) => {
                const year = new Date().getFullYear() - i;
                return <option key={year} value={year}>{year}</option>;
              })}
            </select>
          </div>
        </div>

        {/* Address */}
        <div className="form-group">
          <label>Address</label>
          <input name="address1" value={employee.address1 || ''} onChange={handleChange} maxLength={100} required />
        </div>

        <div className="row">
          <div className="form-group">
            <label>City</label>
            <input name="city" value={employee.city || ''} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>State / Province</label>
            <input name="state" value={employee.state || ''} onChange={handleChange} required />
          </div>
        </div>

        <div className="form-group">
          <label>Postal / Zip Code</label>
          <input name="zip" value={employee.zip || ''} onChange={handleChange} required />
        </div>

        {/* Department Select/Create */}
        <div className="form-group">
          <label>Department Mode</label>
          <select
            value={createNewDepartment ? 'new' : 'existing'}
            onChange={(e) => setCreateNewDepartment(e.target.value === 'new')}
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

        {/* Image Section */}
        <div className="form-group">
          <label>Current Images</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {existingImages.map((img, idx) => (
              <div key={idx} style={{ position: 'relative' }}>
                <img
                  src={`http://172.16.3.174:5000/uploads/${img}`}
                  alt="Employee"
                  style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px' }}
                />
                <button
                  type="button"
                  onClick={() => removeExistingImage(img)}
                  style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    background: 'red',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    lineHeight: '20px',
                    textAlign: 'center',
                  }}
                  title="Remove image"
                >✕</button>
              </div>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Upload New Images (optional)</label>
          <input type="file" multiple onChange={handleImageChange} />
        </div>

        <div className="button-group">
          <button type="submit" className="btn btn-primary">Update</button>
        </div>
      </form>

      <button className="btn btn-primary" onClick={() => navigate(-1)}>⬅ Back</button>
    </div>
  );
};

export default EditEmployee;


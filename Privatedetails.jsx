import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Privatedetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`http://172.16.3.174:5000/api/employee/${id}`)
      .then(res => res.json())
      .then(data => setEmployee(data))
      .catch(err => console.error('Error fetching employee:', err));
  }, [id]);

  const handleChange = (e) => {
    setEmployee({ ...employee, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const formData = new FormData();

      for (const key in employee) {
        if (key === '_id') continue; // skip _id
        const value = employee[key];
        if (typeof value === 'string' || typeof value === 'number') {
          formData.append(key, value);
        }
        // If you had nested fields (like private_details[salary]), you'd handle them here
      }

      const res = await fetch(`http://172.16.3.174:5000/api/employee/${id}`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        alert('Changes saved!');
      } else {
        console.error('Server error:', data);
        alert('Failed to save: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('Fetch error:', err);
      alert('Network or server error');
    } finally {
      setSaving(false);
    }
  };

  if (!employee) return <div>Loading employee data...</div>;

  return (
    <div className="container">
      <h2>Employee Private Information</h2>

      <div className="form-group">
        <label>Employee ID</label>
        <p>{employee._id}</p>
      </div>

      <label className="row">Joining Date</label>
      <input
        name="joiningDate"
        type="date"
        value={employee.joiningDate || ''}
        onChange={handleChange}
        className="input"
      />

      <label className="row">Salary</label>
      <input
        name="salary"
        type="number"
        value={employee.salary || ''}
        onChange={handleChange}
        className="input"
      />

      <label className="row">Private Notes</label>
      <textarea
        name="privateNotes"
        value={employee.privateNotes || ''}
        onChange={handleChange}
        className="input"
      />

      <div style={{ marginTop: '20px' }}>
        <button onClick={handleSave} disabled={saving} className="btn btn-primary">
          {saving ? 'Saving...' : 'Save Changes'}
        </button>

        <button onClick={() => navigate(-1)} className="btn btn-secondary" style={{ marginLeft: '10px' }}>
          Back
        </button>
      </div>
    </div>
  );
};

export default Privatedetails;

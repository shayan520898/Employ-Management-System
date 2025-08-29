import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();

  const fetchEmployees = async () => {
    try {
      const res = await fetch('http://172.16.3.174:5000/api/employee');
      const data = await res.json();
      setEmployees(data);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteEmployee = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this employee?');
    if (!confirm) return;

    try {
      const res = await fetch(`http://172.16.3.174:5000/api/employee/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setEmployees(employees.filter((emp) => emp._id !== id));
      } else {
        alert('Failed to delete.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div className="dashboard-container">
      <h2>Admin Dashboard</h2>
      <table className="employee-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Employee ID</th>
            <th>Joining Date</th>
            <th>Salary</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp._id}>
              <td>{emp.firstName} {emp.lastName}</td>
              <td>{emp.employeeId}</td>
              <td>{emp.joiningDate}</td>
              <td>{emp.salary}</td>
              <td>
                <td>
  <button onClick={() => navigate(`/edit/${emp._id}`)}>Edit</button>
  <button onClick={() => deleteEmployee(emp._id)}>Delete</button>
  <button onClick={() => navigate(`/view-private-details/${emp._id}`)}>
  View Private
</button>

</td>

              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;

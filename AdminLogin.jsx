  import React, { useState } from 'react';
  import { useNavigate } from 'react-router-dom';

  const AdminLogin = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
      setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
      e.preventDefault();

      try {
        const response = await fetch('http://172.16.3.174:5000/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials),
          credentials: 'include',
        });

        if (response.ok) {
          navigate('/all-employees'); 
        } else {
          setError('Invalid username or password');
        }
      } catch (error) {
        setError('Error connecting to server');
      }
    };

    const togglePasswordVisibility = () => {
      setShowPassword((prev) => !prev);
    };

    return (
      <div className="admin">
      
    <button
          type="button"
          onClick={() => navigate('/')}
          className="back-btn"
          style={{ marginBottom: '1rem' }}
        >
          ← Back
        </button>
        <h2>Admin Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
            required
            className="input"
          />
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
              className="input"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="toggle"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          <button type="submit" className="login-btn">Login</button>
        
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    );
  };

  export default AdminLogin;

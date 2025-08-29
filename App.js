import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import EmployeeForm from './components/EmployeeForm';
import EmployeeList from './components/EmployeeList';
import EditEmployee from './components/EditEmployee';
import EmployeeDetails from './components/EmployeeDetails';
import AllEmployees from './components/AllEmployees';
import NavbarPage from './components/NavbarPage';
import AdminLogin from './components/AdminLogin';
import Privatedetails from './components/Privatedetails';
import ProtectedRoute from './ProtectedRoute';
import ViewPrivateDetails from './components/ViewPrivateDetails';

import './styles/style.css';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<EmployeeForm />} />
        <Route path="/list" element={<EmployeeList />} />
        <Route path="/edit/:id" element={<EditEmployee />} />
        <Route path="/details/:id" element={<EmployeeDetails />} />
        <Route path="/private-details/:id" element={<Privatedetails />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/NavbarPage" element={<NavbarPage />} />

        {/* Protected Routes */}
        <Route
          path="/all-employees"
          element={
            <ProtectedRoute>
              <AllEmployees />
            </ProtectedRoute>
          }
        />

        <Route
          path="/view-private-details/:id"
          element={
            <ProtectedRoute>
              <ViewPrivateDetails />
            </ProtectedRoute>
         } 
         /> 
      </Routes>
    </Router>
  );
};

export default App;

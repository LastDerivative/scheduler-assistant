import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import Register from './Register'; //Register component
import Login from './Login'; //Login component
import EmployeeDashboard from './pages/EmployeeDashboardToolpad';
import Home from './pages/Home';
import ManagerDashboard from './pages/ManagerDashboard';
import './App.css';

function App() {
  return (
    <Router>
       {/*Define all routes */}
        <Routes>
          <Route path="/" element={<Navigate to="/sign-in" />} />
          <Route path="/register" element={<Register />} />
          <Route path="/sign-in" element={<Login />} />
          {/* Route for Employee Dashboard with employee ID as a parameter */}
          <Route path="/dashboard/:employeeId" element={<EmployeeDashboard />} />

          {/* Route for Manager Dashboard. Need to add manager ID as a parameter */}
          <Route path="/dashboard/manager" element={<ManagerDashboard />} />
        </Routes>
    </Router>
  );
}

export default App;

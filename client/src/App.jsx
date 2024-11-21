import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import Register from './Register'; //Register component
import Login from './Login'; //Login component
import SignOut from './SignOut';
import EmployeeDashboard from './pages/EmployeeDashboardToolpad';
import ManagerDashboard from './pages/ManagerDashboard';
import MainBoard from './pages/ManagerDashboardComponents/MainBoard';
import Timesheet from './pages/ManagerDashboardComponents/Timesheet';
import './App.css';
import ProtectedRoute from './ProtectedRoute';

function App() {
  return (
    <Router>
       {/*Define all routes */}
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/sign-in" />} />
          <Route path="/register" element={<Register />} />
          <Route path="/sign-in" element={<Login />} />
          <Route path="/sign-out" element={<SignOut />} />
          {/* Route for Employee Dashboard with employee ID as a parameter */}
          <Route path="/dashboard/:employeeId" element={ 
            <ProtectedRoute>
              <EmployeeDashboard />
            </ProtectedRoute>} />
          {/* Route for Manager Dashboard. Need to add manager ID as a parameter */}
          <Route path="/dashboard/manager" element={<ManagerDashboard />} />
          <Route path="/mainboard" element={<MainBoard />} />
          <Route path="/timesheet" element={<Timesheet />} />

        </Routes>
    </Router>
  );
}

export default App;

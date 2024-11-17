import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import Register from './Register'; //Register component
import Login from './Login'; //Login component
import SignOut from './SignOut';
import EmployeeDashboard from './pages/EmployeeDashboardToolpad';
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
        </Routes>
    </Router>
  );
}

export default App;

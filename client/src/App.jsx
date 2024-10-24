import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import Register from './Register'; //Register component
import Login from './Login'; //Login component
import Home from './pages/Home';
import EmployeeDashboard from './pages/EmployeeDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import './App.css';

function App() {
  return (
    <Router>
       {/*Define all routes */}
        <Routes>
          {/*<Route
            path="/"
            element={
              <div className="title-card">
                <p>Welcome to your</p>
                <h1>Job Scheduler</h1>
              </div>
            }
          />*/}
          <Route path="/home" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          {/* Redirects to home by default */}
          <Route path="/" element={<Navigate to="/home" />} />
          {/* Route for Employee Dashboard with employee ID as a parameter */}
          <Route path="/dashboard/:employeeId" element={<EmployeeDashboard />} />
          {/* Only routes to one Manager Dashboard for now */}
          <Route path="/dashboard/manager" element={<ManagerDashboard />} />
        </Routes>
      
      {/*<div>
        <nav>
          {/* <Link to="/">Home</Link> | <Link to="/register">Sign Up</Link> | <Link to="/login">Login</Link>
        </nav>
      </div>*/}
    </Router>
  );
}

export default App;

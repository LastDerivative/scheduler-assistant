import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import Register from './Register'; //Register component
import Login from './Login'; //Login component
import Home from './pages/Home';
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
          <Route path="/" element={<Navigate to="/home" />} />
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

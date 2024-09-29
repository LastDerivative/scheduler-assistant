import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
        <div className="title-card"></div>
        <p>Welcome to your</p>
        <h1>Job Scheduler</h1>
      <nav>
        <Link to="/register">Sign Up</Link> | <Link to="/login">Login</Link>
      </nav>
    </div>
  );
};

export default Home;

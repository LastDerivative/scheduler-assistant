import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Register from './Register'; //Register component
import Login from './Login'; //Login component
import './App.css';

function App() {
  return (
    <Router>
        <Routes>
          <Route
            path="/"
            element={
              <div className="title-card">
                <p>Welcome to the</p>
                <h1>Job Scheduler</h1>
              </div>
            }
          />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      <div>
        <nav>
          <Link to="/">Home</Link> | <Link to="/register">Register</Link> | <Link to="/login">Login</Link>
        </nav>
      </div>
    </Router>
  );
}

export default App;

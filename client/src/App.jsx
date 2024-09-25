import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Register from './Register'; //Register component
import Login from './Login'; //Login component
import './App.css';

function App() {
  return (
    <Router>
      <div>
        <nav>
          <Link to="/">Home</Link> | <Link to="/register">Register</Link> | <Link to="/login">Login</Link>
        </nav>
        <Routes>
          <Route
            path="/"
            element={
              <div>
                <h1>Scheduler</h1>
              </div>
            }
          />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

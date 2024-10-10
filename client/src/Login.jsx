import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';


const Login = () => {//holds values for email and pw, initially empty
  //1. state variables and error handling
  //formData is set as a state variable to store vars for the login form fields -> email and pw
  //setFormData is a function to update the state as the user types -> state in this case is formData
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  //2. function to handle changes to form inputs
  //event handler called when an "onChange" event happens. e is the event object
  //will update formData, above.
  const handleChange = (e) => {
    setFormData({
      ...formData,//spread operator -> used to copy key-value pairs from formData to only update what is needed when user types. ie. if user types in email, it will not update pw
      [e.target.name]: e.target.value,//dynamically update the right name field
    });
  };

  //3. function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Send a POST request to authenticate the user
      const response = await fetch('/employees/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData), // Send formData as the request body
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Assuming the response includes employeeId and a token
        const { employeeId } = data;
  
        // Navigate to the employee dashboard using employeeId
        navigate(`/dashboard/${employeeId}`);
      } else {
        // If the login failed
        setError(data.message || 'Invalid email or password. Please try again.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('An unexpected error occurred. Please try again later.');
    }
  };

  return (

    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          {/* <label>Email:</label> */}
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          {/* <label>Email:</label> */}
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <nav>
          <Link to="/register">Sign Up</Link>
        </nav>
      </div>
    </div>
  );
};

export default Login;

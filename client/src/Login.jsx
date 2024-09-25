import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
    e.preventDefault();//prevents the refresh in HTML
    // Temp for future API
    alert('Login functionality will be added soon!');
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Login;

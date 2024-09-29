import React, { useState } from 'react'; //used for state
import { useNavigate } from 'react-router-dom'; //for navigation

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    department: '',
  });

  const [error, setError] = useState('');
  const navigate = useNavigate(); //hook for navigation

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

   //sends the registration data (formData) to the server via a POST request.
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/employees/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),//converts the form data object to JSON format
      });

      const result = await response.json();
      if (response.ok) {
        alert('Registration successful!');
        navigate('/login'); //redirect to login after successful registration
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to register, please try again later.');
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div>
          {/* <label>Email:</label> */}
          <input
            type="text"
            placeholder="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
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
        <div>
          {/* <label>Email:</label> */}
          <input
            type="text"
            placeholder="Phone Number"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
        </div>
        <div>
          {/* <label>Email:</label> */}
          <input
            type="text"
            placeholder="Department"
            name="department"
            value={formData.department}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Register</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Register;

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, TextField, Button, Typography } from '@mui/material';

const Login = () => {//holds values for email and pw, initially empty
  //1. state variables and error handling
  //formData is set as a state variable to store vars for the login form fields -> email and pw
  //setFormData is a function to update the state as the user types -> state in this case is formData
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '' 
  });

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
        const { employeeId, token, managerStatus } = data;
 
        // Store token and employeeId in localStorage
        localStorage.setItem('authToken', token);
        localStorage.setItem('employeeId', employeeId);

        // Check if user is a manager and navigate accordingly
        if (managerStatus) {
          navigate(`/dashboard/manager/${employeeId}`);
        } else {
          navigate(`/dashboard/${employeeId}`);
        }
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
    
    <Box 
      display="flex" 
      justifyContent="center" 
      alignItems="center" 
      minHeight="100vh"
      sx={{
        background: 'linear-gradient(to right, #86bcdb, #FFFFFF)',
      }}
    >
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        maxWidth="800px"
        width="100%"
        p={3}
        boxShadow={3}
        bgcolor="white"
        borderRadius="15px"
      >
        {/* Left section with form */}
        <Box width="40%" p={3}>
          <Typography 
            variant="h4" 
            gutterBottom
            sx={{
              
              color: '#3f51b5',  // Custom color for the title
              fontSize: '2.5rem', // Larger font size
              fontFamily: "'Roboto', sans-serif", // Custom font
              fontWeight: 'bold'
            }}
          >
            Welcome Back to
            <span style={{ fontSize: '2.5rem', color: '#9d5cc0', fontWeight: 'bold'}}> Scheduling</span>
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Please login to use the Scheduler
          </Typography>

          <Box 
            component="form" 
            onSubmit={handleSubmit} 
            sx={{ width: '100%' }}
          >
            <TextField
              label="Enter E-mail"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              required
              margin="dense"
              variant="outlined"
            />
            <TextField
              label="Enter Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              fullWidth
              required
              margin="dense"
              variant="outlined"
            />
            <Button 
              type="submit" 
              fullWidth
              
              sx={{ 
                mt: 1.5, 
                py: 1.5, 
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #3f51b5, #7C97D4)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #3645a0, #6e85c0)', // Slightly darker shade for hover effect
                },
                color: 'white' 
              }}
            >
              SIGN IN
            </Button>
          </Box>
          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}

          {/* Sign up prompt */}
          <Typography variant="body2" sx={{ mt: 1 }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ fontWeight: 'bold', color: '#3f51b5', textDecoration: 'none' }}>
              Sign Up
            </Link>
          </Typography>

        </Box>

        {/* Right section with illustration */}
        <Box width="50%" display={{ xs: 'none', sm: 'block' }}>
          <img
            src='/An.webp' // Path for public folder
            
            style={{ width: '100%', borderRadius: '10px' }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
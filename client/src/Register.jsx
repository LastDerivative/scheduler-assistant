import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, TextField, Button, Typography, Tabs, Tab } from '@mui/material';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    orgID: '',
    orgName: '',
    officeNumber: ''
  });
  const [error, setError] = useState('');
  const [role, setRole] = React.useState('Manager');
    // Handle role selection
    const handleRoleSelection = (event, newValue) => {
      setRole(newValue);
    };
  const navigate = useNavigate();

  // Handle input changes for the form
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  
// Send the registration data to the server
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const endpoint = role === 'Manager' ? '/employees/registerManager' : '/employees/register';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        alert('Registration successful!');
        navigate('/login');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to register, please try again later.');
    }
  };
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{ background: 'linear-gradient(to right, #86bcdb, #FFFFFF)' }}
    >
      <Box
        maxWidth="500px"
        width="100%"
        p={4}
        boxShadow={3}
        bgcolor="white"
        borderRadius="10px"
      >
        <Typography variant="h4" fontWeight="bold" color="#4a5cbc" align="center" gutterBottom>
          Register as {role}
        </Typography>

        {/* Role selection tabs */}
        <Tabs
          value={role}
          onChange={handleRoleSelection}
          variant="fullWidth"
          centered
         
          sx={{
            // Custom color for the indicator line
            '& .MuiTabs-indicator': {
              backgroundColor: '#4a5cbc', // Primary color for the active tab indicator
            },
          }}
          
        >
          <Tab 
          label="Manager" 
          value="Manager"
          sx={{
            color: 'gray', // Default color for inactive state
            '&.Mui-selected': {
              color: '#4a5cbc', // Color for active tab
              fontWeight: 'bold',
            },
            '&:focus': {
              outline: 'none', // Remove focus outline
            },
          }}

          />
          <Tab 
          label="Employee" 
          value="Employee" 
          sx={{
            color: 'gray', // Default color for inactive state
            '&.Mui-selected': {
              color: '#4a5cbc', // Color for active tab
              fontWeight: 'bold',
            },
            '&:focus': {
              outline: 'none', // Remove focus outline
            },
          }}
          />
        </Tabs>

        <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
          <TextField
            label="Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            required
            margin="dense"
            variant="outlined"
          />
          <TextField
            label="Email"
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
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
            required
            margin="dense"
            variant="outlined"
          />

          {/* Manager-specific fields */}
          {role === 'Manager' && (
            <>
              <TextField
                label="Organization Name"
                type="text"
                name="orgName"
                value={formData.orgName}
                onChange={handleChange}
                fullWidth
                margin="dense"
                variant="outlined"
              />
              <TextField
                label="Office Number"
                type="text"
                name="officeNumber"
                value={formData.officeNumber}
                onChange={handleChange}
                fullWidth
                margin="dense"
                variant="outlined"
              />
            </>
          )}

          {/* Employee-specific fields */}
          {role === 'Employee' && (
            <TextField
              label="Organization ID"
              type="text"
              name="orgID"
              value={formData.orgID}
              onChange={handleChange}
              fullWidth
              margin="dense"
              variant="outlined"
            />
          )}

          <Button 
            variant="contained" 
            fullWidth 
            sx={{ 
              mt: 3, 
              py: 1.5, 
              fontWeight: 'bold', 
              background: 'linear-gradient(45deg, #3f51b5, #7C97D4)', // Custom primary color
              color: 'white', 
              '&:hover': {
                background: 'linear-gradient(45deg, #3645a0, #6e85c0)', // Slightly darker shade for hover effect
              },
            }}
          >
            Register
          </Button>
        </form>
        
        {error && (
          <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>
            {error}
          </Typography>
        )}

        {/* Link to Login page */}
        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ fontWeight: 'bold', color: '#3f51b5', textDecoration: 'none' }}>
            Sign In
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Register;
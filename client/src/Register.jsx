import React, { useState } from 'react'; //used for state
import { useNavigate, Link } from 'react-router-dom'; //for navigation

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    department: '',
  });

  const [error, setError] = useState('');
  const [role, setRole] = useState(''); // State to store the selected role (Manager or Employee)
  const navigate = useNavigate(); //hook for navigation

  // Handle role selection
  const handleRoleSelection = (selectedRole) => {
    setRole(selectedRole);
  };

  // Handle input changes for the form
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Send the registration data (formData) to the server via a POST request.
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Temporary endpoint role for manager as manager registration is not done yet
      const endpoint = role === 'Manager' ? '/employees/registerManager' : '/employees/register'; // Dynamic endpoint based on role
      // Back end will need to create the org if not already created.
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // Converts the form data object to JSON format
      });

      const result = await response.json();
      if (response.ok) {
        alert('Registration successful!');
        navigate('/login'); // Redirect to login after successful registration
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

      {/* If no role selected, show role selection */}
      {!role ? (
        <div>
          <h3>Are you registering as a Manager or an Employee?</h3>
          <button onClick={() => handleRoleSelection('Manager')}>Manager</button>
          <button onClick={() => handleRoleSelection('Employee')}>Employee</button>
        </div>
      ) : (
        <div>
          {/* Render appropriate registration form based on role */}
          <h3>{role} Registration</h3>
          <form onSubmit={handleSubmit}>
            <div>
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
              <input
                type="password"
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>


            {/* Manager-specific fields */}
            {role === 'Manager' && (
              <div>
                <div>
                  <input
                    type="text"
                    placeholder="Organization Name"
                    name="orgName"
                    value={formData.orgName}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Office Number"
                    name="officeNumber"
                    value={formData.officeNumber || ''}
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}

            {/* Employee-specific fields */}
            {role === 'Employee' && (
              <div>
                <div>
                  <input
                    type="text"
                    placeholder="Phone Number"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}

            <button type="submit">Register</button>
          </form>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <div>
            <nav>
              <Link to="/home">Home</Link>
            </nav>
          </div>

        </div>
        
      )}
      
    </div>
  );
};

export default Register;

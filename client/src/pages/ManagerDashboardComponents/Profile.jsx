/**
 * 
 * Profile: This component displays an employee's basic profile information, including their name, email,
 * and organization ID.
 * 
 * Component Uses:
 * MUI's Box for layout and spacing
 * Typography for text styling
 * Paper for the card-like background
 * Divider for separating rows in the profile section
 * 
 */

import React from 'react';
import { Box, Typography, Paper, Divider } from '@mui/material';

const Profile = ({ employeeData }) => {
  return (
    <Box sx={{ maxWidth: '1000px', margin: '0 auto', padding: '0px' }}>
      {/* Header Section */}
      <Typography variant="h5" gutterBottom sx={{ fontSize: '2.5rem' }}>
        Manager Info
      </Typography>
      <Typography variant="body2" sx={{ mb: 2, fontSize: '1.25rem'}}>
        Please contact your Admin to update this information.
      </Typography>

      {/* Profile Information Card */}
      <Paper elevation={1} sx={{ borderRadius: '8px', padding: '16px' }}>
        {/* Profile Row - Name */}
        <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ py: 1 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            Name
          </Typography>
          <Typography variant="body1">{employeeData.name}</Typography>
        </Box>
        <Divider />

        {/* Profile Row - Email */}
        <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ py: 1 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            Email
          </Typography>
          <Typography variant="body1">{employeeData.email}</Typography>
        </Box>
        <Divider />

        {/* Profile Row - OrgID */}
        <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ py: 1 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            OrganizationID
          </Typography>
          <Typography variant="body1">{employeeData.orgID}</Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Profile;
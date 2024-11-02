/**
 * Requests: This component serves as the main dashboard for employee requests,
 * including both time-off and shift trading requests. It accepts an employeeID
 * to pass down to each specific request component, allowing them to fetch and display
 * data for the current employee.
 * 
 */

import React from 'react';
import { Box, Typography } from '@mui/material';
import TimeOff from './TimeOff'; // Component for managing time-off requests
import ShiftTrading from './ShiftTrading'; // Component for managing shift trading requests
import './RequestsStyles.css';

const Requests = ({ employeeID }) => {
  return (
    <Box className="requests-dashboard">
      {/* Dashboard title */}
      <Typography variant="h4" gutterBottom>Employee Requests Dashboard</Typography>

      {/* TimeOff and ShiftTrading components displayed side by side */}
      <Box display="flex" gap={4} className="requests-sections">
        {/* TimeOff component for managing and displaying time-off requests */}
        <TimeOff employeeID={employeeID} />
        
        {/* ShiftTrading component for managing and displaying shift trading requests */}
        <ShiftTrading employeeID={employeeID} />
      </Box>
    </Box>
  );
};

export default Requests;

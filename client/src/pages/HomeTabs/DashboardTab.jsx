/**
 * 
 * DashboardTab: Displays an overview of the upcoming week's schedule and team contact information.
 * "Week At a Glance" section shows shifts scheduled for the next 5 days.
 * "Team Contacts" section lists key contact information for team members.
 * 
 */

import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import './DashboardTab.css';

// Helper function to format dates as "Month Day, Year"
const formatDate = (date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Intl.DateTimeFormat('en-US', options).format(date);
};

const DashboardTab = ({ shifts, dashboardDates }) => {
  return (
    <Box className="dashboard-tab-container">
      {/* "Week At a Glance" section */}
      <Box className="week-glance" mb={4}>
        <Typography variant="h4" gutterBottom>Week At a Glance</Typography>
        <Typography variant="body1" mb={2}>
          Here’s an overview of your schedule for the next 5 days.
        </Typography>

        {/* Next 5 Days Calendar */}
        <Box className="calendar-container" display="flex" gap={2}>
          {dashboardDates.map((date) => (
            <Paper key={date} className="day-column" elevation={3} sx={{ padding: 2, textAlign: 'center', minWidth: '140px' }}>
              <Typography variant="subtitle1" className="calendar-date">{date}</Typography>
              
              {/* Display shifts for the current date */}
              {shifts
                .filter((shift) => formatDate(new Date(shift.startTime)) === date)
                .map((shift) => (
                  <Box key={shift._id} className="shift-card">
                    <Typography><strong>Shift:</strong> {shift.shiftName}</Typography>
                  </Box>
                ))}

              {/* Placeholder for no shifts */}
              {shifts.filter(shift => formatDate(new Date(shift.startTime)) === date).length === 0 && (
                <Typography variant="body2">No shifts scheduled</Typography>
              )}
            </Paper>
          ))}
        </Box>
      </Box>

      {/* "Team Contacts" section */}
      <Box className="team-contacts" mt={4}>
        <Typography variant="h4" gutterBottom>Team Contacts</Typography>
        <ul>
          <li><Typography >Joey Chestnut - j.chestnut@example.com</Typography></li>
          <li><Typography >Ray The Man - r.t.man@example.com</Typography></li>
        </ul>
      </Box>
    </Box>
  );
};

export default DashboardTab;

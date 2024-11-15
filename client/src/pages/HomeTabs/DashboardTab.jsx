import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import './DashboardTab.css';

const formatDate = (date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Intl.DateTimeFormat('en-US', options).format(date);
};

const today = formatDate(new Date());

const DashboardTab = ({ shifts, dashboardDates }) => {
  return (
    <Box className="dashboard-tab-container" sx={{ color: '#e0e0e0' }}> {/* Light text color */}
      {/* "Week At a Glance" section */}
      <Box className="week-glance" mb={4}>
        <Typography variant="h4" gutterBottom sx={{ color: '#ffffff' }}>Week At a Glance</Typography>
        <Typography variant="body1" mb={2} sx={{ color: '#b0b0b0' }}>
          Here's an overview of your schedule for the next 5 days.
        </Typography>

        {/* Next 5 Days Calendar */}
        <Box className="calendar-container" display="flex" gap={2}>
          {dashboardDates.map((date) => (
            <Paper
              key={date}
              className={`day-column ${date === today ? 'today' : ''}`}
              elevation={3}
              sx={{
                padding: 2,
                textAlign: 'center',
                minWidth: '140px',
                backgroundColor: date === today ? '#424242' : '#333333', // Dark background with highlight for today
                color: '#e0e0e0',
                border: date === today ? '2px solid #42a5f5' : '1px solid #555555',
              }}
            >
              <Typography variant="subtitle1" className="calendar-date">{date}</Typography>
              <Typography variant="subtitle2" >
                {shifts.filter(shift => formatDate(new Date(shift.startTime)) === date).length} Shifts Scheduled
              </Typography>

              {shifts
                .filter((shift) => formatDate(new Date(shift.startTime)) === date)
                .map((shift) => (
                  
                    <Box className="shift-card" sx={{
                      backgroundColor: '#616161', /* Dark gray for shift cards */
                      color: '#ffffff',
                      padding: '8px',
                      borderRadius: '4px',
                      marginTop: '8px',
                    }}>
                    <Typography><strong>Shift:</strong> {shift.shiftName}</Typography>
                    </Box>
                  
                ))}

              {/* Placeholder for no shifts */}
              {shifts.filter(shift => formatDate(new Date(shift.startTime)) === date).length === 0 && (
                <Typography variant="body2" sx={{ color: '#9e9e9e', fontStyle: 'italic' }}>
                  No shifts scheduled
                </Typography>
              )}
            </Paper>
          ))}
        </Box>
      </Box>

      {/* "Team Contacts" section */}
      <Box className="team-contacts" mt={4}>
        <Typography variant="h4" gutterBottom sx={{ color: '#ffffff' }}>Team Contacts</Typography>
        <ul>
          <Typography><a href="mailto:j.chestnut@example.com" style={{ color: '#90caf9' }}>Joey Chestnut</a></Typography>
          <Typography><a href="mailto:r.t.man@example.com" style={{ color: '#90caf9' }}>Ray The Man</a></Typography>
        </ul>
      </Box>
    </Box>
  );
};

export default DashboardTab;

/**
 * 
 * ScheduleTab: This component displays an interactive 2-week calendar of an employee's upcoming shifts.
 * Shows a two-week view of dates, highlighting those with scheduled shifts.
 * Allows the user to select a date to view detailed shift information for that day.
 * Highlights the selected date and lists relevant shift details, including shift name and time.
 * 
 */

import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import './ScheduleTab.css';

// Helper function to format dates as "Month Day, Year"
const formatDate = (date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Intl.DateTimeFormat('en-US', options).format(date);
};

const ScheduleTab = ({ shifts, scheduleDates, selectedDate, setSelectedDate }) => {
  return (
    <Box className="schedule-tab-container">
      {/* Header for the Schedule Tab */}
      <Typography variant="h4" fontSize="2rem">Your Two Week Schedule </Typography>
      <Typography variant="body1" fontSize="1.2rem" mb={2}>
        Here’s a 2-week calendar view of your upcoming shifts. Click on a date to view details.
      </Typography>

      {/* 2-Week Calendar Layout in a Grid */}
      <Box className="calendar-grid-2">
        {scheduleDates.map((date, index) => {
          // Check if the current date has a shift
          const hasShift = shifts.some(shift => formatDate(new Date(shift.startTime)) === date);

          return (
            <Paper
              key={index}
              elevation={3}
              className={`calendar-cell ${hasShift ? 'shift-day' : ''} ${selectedDate === date ? 'selected-day' : ''}`}
              onClick={() => setSelectedDate(date)} // Set selected date on click
            >
              <Typography className="calendar-date">{date}</Typography>
              {hasShift && (
                <Box className="shift-indicator">
                  {shifts
                    .filter(shift => formatDate(new Date(shift.startTime)) === date)
                    .map((shift) => (
                      <Typography fontSize=".85rem" key={shift._id}>{shift.shiftName} </Typography>
                    ))}
                </Box>
              )}
            </Paper>
          );
        })}
      </Box>

      {/* Display Shift Details when a date is selected */}
      {selectedDate && (
        <Box className="shift-details" mt={4}>
          <Typography variant="h5" gutterBottom>
            Shift Details for {selectedDate}
          </Typography>

          {/* Display details for shifts on the selected date */}
          {shifts
            .filter(shift => formatDate(new Date(shift.startTime)) === selectedDate)
            .map((shift) => (
              <Paper key={shift._id} className="shift-card" elevation={2}>
                <Typography>
                  <strong>Shift Name:</strong> {shift.shiftName}
                </Typography>

                <Typography>
                  <strong>Shift ID:</strong> {shift._id}
                </Typography>

                <Typography>
                  <strong>Time:</strong> {new Date(shift.startTime).toLocaleTimeString()} - {new Date(shift.endTime).toLocaleTimeString()}
                </Typography>
                {/*Below was working but back end update changed the way shifts are called. Used to come with Site information*/}
              {/*<Typography><strong>Location:</strong> {shift.siteID.siteName}</Typography>*/}
              </Paper>
            ))}

          {/* If no shifts are scheduled for the selected date, display a message */}
          {shifts.filter(shift => formatDate(new Date(shift.startTime)) === selectedDate).length === 0 && (
            <Typography>No shifts scheduled for this day.</Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default ScheduleTab;
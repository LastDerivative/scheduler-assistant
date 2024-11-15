// src/components/ScheduleTab.jsx
import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import dayjs from 'dayjs';

const ScheduleGrid = ({ shifts }) => {
  // Generate an array of hours for display in 12-hour format with AM/PM
  const hours = Array.from({ length: 24 }, (_, i) =>
    dayjs().hour(i).minute(0).format('h A')
  );

  // Generate an array of dates starting from today for the current two weeks (14 days)
  const today = dayjs();
  const dates = Array.from({ length: 14 }, (_, i) => today.add(i, 'day'));

  // State to hold the current time
  const [currentTime, setCurrentTime] = useState(dayjs());

  // Fixed height for the date row
  const dateRowHeight = 40; // Set a static height for the date row

  // State to manage selected shift for modal
  const [selectedShift, setSelectedShift] = useState(null);

  // Update the current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(dayjs());
    }, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  // Calculate the top offset for the current time line
  const currentHour = currentTime.hour();
  const currentMinute = currentTime.minute();
  const topOffset = dateRowHeight + currentHour * 50 + currentMinute * (50 / 60); // Adjust based on fixed date row height

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: `60px repeat(14, 1fr)`, // Date columns expand to fill remaining space
        gridTemplateRows: `${dateRowHeight}px repeat(24, 50px)`, // 50px per hour
        height: '100%', // Full height container
        width: '100%', // Full width container
        border: '1px solid #444', // Outer border for visibility
      }}
    >
      {/* Top-left empty cell */}
      <Box sx={{ gridColumn: '1', gridRow: '1', borderBottom: '1px solid #555' }} />

      {/* Date Row */}
      {dates.map((date, index) => (
        <Box
          key={`date-${index}`}
          sx={{
            gridColumn: `${index + 2}`, // Start from the second column
            gridRow: '1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4px', // Reduced padding for compactness
            borderBottom: '1px solid #555',
            borderRight: index < 13 ? '1px solid #555' : 'none', // No right border for the last date
            backgroundColor: '#1c1c1c',
            color: '#ffffff',
            fontSize: '0.8rem', // Smaller font for dates
          }}
        >
          <Typography variant="body2">{date.format('MMM D')}</Typography>
        </Box>
      ))}

      {/* Hour Labels with Half-Hour Dotted Line */}
      {hours.map((hour, index) => (
        <Box
          key={`hour-${index}`}
          sx={{
            gridColumn: '1',
            gridRow: `${index + 2}`, // Start from the second row
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            padding: '2px 8px', // Adjust padding to move text closer to the border
            height: '50px', // Fixed 50px height for each hour
            borderBottom: '1px solid #555', // Solid border for full hour
            backgroundColor: '#1c1c1c', // Background for hour labels
            color: '#ffffff',
            fontSize: '0.8rem', // Smaller font for hour labels
            position: 'relative', // Set position for half-hour dotted line
          }}
        >
          <Typography variant="body2">{hour}</Typography>
          {/* Half-hour dotted line in the hour label column */}
          <Box
            sx={{
              position: 'absolute',
              top: '50%', // Place at the half-hour mark
              left: '0',
              right: '0',
              height: '1px',
              borderTop: '1px dotted #555', // Dotted line for half-hour
            }}
          />
        </Box>
      ))}

      {/* Schedule Cells with Half-hour Dotted Line */}
      {dates.map((_, dateIndex) =>
        hours.map((_, hourIndex) => (
          <Box
            key={`cell-${dateIndex}-${hourIndex}`}
            sx={{
              gridColumn: `${dateIndex + 2}`, // Align with the correct date column
              gridRow: `${hourIndex + 2}`, // Align with the correct hour row
              borderBottom: '1px solid #555', // Border for each hour cell
              borderRight: dateIndex < 13 ? '1px solid #555' : 'none', // No right border for the last column
              backgroundColor: '#2c2c2c', // Background for the schedule cells
              minHeight: '50px', // Ensures a consistent height
              width: '100%', // Each cell takes full width of its column
              position: 'relative', // Set position for half-hour line
            }}
          >
            {/* Half-hour dotted line across each cell */}
            <Box
              sx={{
                position: 'absolute',
                top: '50%', // Place at the half-hour mark
                left: '0',
                right: '0',
                height: '1px',
                borderTop: '1px dotted #555', // Dotted line for half-hour
              }}
            />
          </Box>
        ))
      )}

      {/* Display Shifts */}
      {shifts.map((shift) => {
        const shiftStart = dayjs(shift.startTime);
        const shiftEnd = dayjs(shift.endTime);
        
        const shiftStartDateIndex = dates.findIndex(date => date.isSame(shiftStart, 'day'));
        const shiftEndDateIndex = dates.findIndex(date => date.isSame(shiftEnd, 'day'));

        const shiftStartHour = shiftStart.hour();
        const shiftDurationHours = shiftEnd.diff(shiftStart, 'hour', true); // Fractional hours

        if (shiftStartDateIndex === -1 && shiftEndDateIndex === -1) return null;

        const handleShiftClick = () => setSelectedShift(shift);

        return (
          <Paper
            key={shift._id}
            onClick={handleShiftClick} // Open modal on click
            sx={{
              gridColumn: `${shiftStartDateIndex + 2}`,
              gridRow: `${shiftStartHour + 2} / span ${Math.ceil(shiftDurationHours)}`,
              backgroundColor: '#0eb244',
              color: '#ffffff',
              padding: '8px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #555',
              cursor: 'pointer', // Show pointer cursor
              zIndex: 2, // Ensure it appears above the dotted line
            }}
          >
            <Typography variant="body2">{shift.shiftName}</Typography>
            <Typography variant="caption">
              {shiftStart.format('h:mm A')} - {shiftEnd.format('h:mm A')}
            </Typography>
          </Paper>
        );
      })}

      {/* Current Time Line */}
      <Box
        sx={{
          position: 'absolute',
          top: `${topOffset}px`, // Adjust based on fixed date row height
          left: '60px', // Start after the hour labels
          width: 'calc(100% - 60px)', // Span only the 14 date columns
          borderTop: '2px dotted blue',
          zIndex: 1,
        }}
      />

      {/* Shift Details Dialog */}
      <Dialog open={!!selectedShift} onClose={() => setSelectedShift(null)}>
        <DialogTitle>{selectedShift?.shiftName}</DialogTitle>
        <DialogContent>
          <Typography><strong>Start Time:</strong> {dayjs(selectedShift?.startTime).format('MMM D, h:mm A')}</Typography>
          <Typography><strong>End Time:</strong> {dayjs(selectedShift?.endTime).format('MMM D, h:mm A')}</Typography>
          <Typography><strong>Shift ID:</strong> {selectedShift?._id}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedShift(null)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ScheduleGrid;

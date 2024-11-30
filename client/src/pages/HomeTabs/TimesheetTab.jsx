/**
 * 
 * TimesheetTab: This component displays the hours worked by an employee over the past two weeks,
 * pulling in their shifts and calculating the total hours based on punchIn and punchOut times.
 * 
 * Groups shifts by date for a clearer daily breakdown.
 * Calculates the total hours worked, but only for shifts with both punchIn and punchOut times.
 * Displays a warning for any shifts with incomplete data i.e. missing punchIn or punchOut.
 * Uses Material-UI components for consistent styling and layout.
 * 
 */

import React, { useState, useEffect } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Alert } from '@mui/material';

// Function to format dates in "Month Day, Year" format
const formatDate = (date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Intl.DateTimeFormat('en-US', options).format(date);
};

// Function to calculate duration in hours between punchIn and punchOut
const calculateShiftDuration = (shift) => {
  if (shift.punchIn && shift.punchOut) {
    const start = new Date(shift.punchIn);
    const end = new Date(shift.punchOut);
    return (end - start) / (1000 * 60 * 60); // Convert ms to hours
  }
  return 0; // Return 0 if either punchIn or punchOut is missing
};

// Function to group shifts by date within the last two weeks
const groupShiftsByDate = (shifts) => {
  const groupedShifts = {}; // Object to hold grouped shifts by date
  const today = new Date();
  const twoWeeksAgo = new Date(today);
  // Need to figure out the UTC time thing
  twoWeeksAgo.setDate(today.getDate() - 14); // Set date to 2 weeks ago

  // Loop through each shift and group them by formatted date within the past two weeks
  shifts.forEach((shift) => {
    const shiftDate = formatDate(new Date(shift.startTime));
    if (new Date(shift.startTime) >= twoWeeksAgo && new Date(shift.startTime) <= today) {
      if (!groupedShifts[shiftDate]) {
        groupedShifts[shiftDate] = []; // Initialize array for new dates
      }
      groupedShifts[shiftDate].push(shift); // Add shift to corresponding date
    }
  });

  // Convert grouped object into an array, sorted by descending date
  const groupedEntries = Object.entries(groupedShifts);
  groupedEntries.sort((a, b) => new Date(b[0]) - new Date(a[0]));

  // Map each entry into an object with date and shifts for display
  return groupedEntries.map(([date, shifts]) => ({ date, shifts }));
};

const TimesheetTab = ({ shifts }) => {
  const [payPeriod, setPayPeriod] = useState([]); // State to store shifts grouped by date
  const [incompleteShifts, setIncompleteShifts] = useState([]); // State to track shifts missing punchIn or punchOut

  // Effect to group shifts and check for incomplete data on component mount or shifts update
  useEffect(() => {
    const twoWeekPeriod = groupShiftsByDate(shifts); // Group shifts for past two weeks
    setPayPeriod(twoWeekPeriod); // Store grouped shifts in state

    // Store shifts with missing punchIn or punchOut and have already passed
    const now = new Date();
    const incomplete = shifts.filter(
      shift =>
        (!shift.punchIn || !shift.punchOut) && new Date(shift.startTime) < now
    );
    setIncompleteShifts(incomplete);
  }, [shifts]);

  // Calculate total hours worked across all shifts in the pay period
  const totalHoursWorked = payPeriod.reduce((total, { shifts }) => {
    return total + shifts.reduce((sum, shift) => sum + calculateShiftDuration(shift), 0); // Sum up hours for each shift
  }, 0);

  return (
    <Box className="timesheet-tab" sx={{ maxWidth: '1000px', margin: '0 auto', padding: '0px' }}>
      <Typography variant="h4" gutterBottom fontSize="2rem">Timesheet for the Last Two Weeks</Typography>

      {/* Display a warning if there are any shifts missing punchIn or punchOut data */}
      {incompleteShifts.length > 0 && (
        <Alert severity="warning" sx={{ mb: 3, fontSize: '1.2rem' }}>
          Some shifts are missing punch-in or punch-out data.
        </Alert>
      )}

      {/* Show table of shifts if pay period contains data, otherwise display a message */}
      {payPeriod.length === 0 ? (
        <Typography fontSize="1.2rem">No hours worked during this pay period.</Typography>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Date</TableCell>
                  <TableCell sx={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Hours Worked</TableCell>
                  <TableCell sx={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payPeriod.map(({ date, shifts }) => {
                  // Calculate total hours worked for each date
                  const totalHours = shifts.reduce((sum, shift) => sum + calculateShiftDuration(shift), 0);

                  return (
                    <TableRow key={date}>
                      <TableCell sx={{ fontSize: '1rem', padding: '16px' }}>{date}</TableCell>
                      <TableCell sx={{ fontSize: '1rem', padding: '16px' }}>{totalHours.toFixed(2)} hours</TableCell>
                      <TableCell sx={{ fontSize: '1rem', padding: '16px' }}>
                        {/* Display "Incomplete" if any shift for the date is missing punch data */}
                        {shifts.some(shift => !shift.punchIn || !shift.punchOut)
                          ? <Typography color="error" sx={{ fontWeight: 'bold' }}>Incomplete</Typography>
                          : "Complete"}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          
          {/* Display total hours worked across all shifts in the pay period */}
          <Box mt={3}>
            <Typography variant="h6" sx={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
              Total Hours Worked: {totalHoursWorked.toFixed(2)} hours
            </Typography>
          </Box>
        </>
      )}
    </Box>
  );
};

export default TimesheetTab;
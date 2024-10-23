/**
 * Punches: This component handles employee clock-in and clock-out functionality by updating the `punchIn` and `punchOut` attributes 
 * on the backend, tracking the actual start and end times of an employee's shift. 
 * i.e: The component makes API calls to update the `punchIn` and `punchOut` values on the server when the employee punches in or out.
 * 
 * We considered two approaches to track an employee's clocked-in status:
 * 
 * Option 1: Track the employee's status using the `punchIn` and `punchOut` fields in the shift object.
 * Option 2: Add a separate "clocked status" attribute directly to the employee object.
 * 
 * We decided to go with Option 1 for these reasons:
 * 
 * 1. Avoiding Data Redundancy: Storing the clock-in status with the shift avoids keeping the same information in two places, which reduces the risk of data inconsistency.
 * 
 * 2. Future Extensibility: Storing clock-in and clock-out times within the shift makes it easier to calculate shift duration, overtime, and delays in the future, without requiring cross-referencing other data sources.
 * 
 * 3. Clear History: Each shift contains a complete record of when the employee clocked in and out, making it simple to track work history and analyze performance.
 * 
 * This approach allows the application to query the shift object to determine if the employee is currently clocked in or not (i.e., if `punchIn` is set and `punchOut` is still null, the employee is clocked in).
 * 
 */
import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Alert } from '@mui/material';
// For Back End Calls
import axios from 'axios';

const Punches = ({ shifts }) => {
    const [punchStatus, setPunchStatus] = useState(null);
    const [error, setError] = useState(null);
    const [todayShift, setTodayShift] = useState(null);
  
    useEffect(() => {
      // Get today's date and filter shifts for today
      const today = new Date();
      const filteredShifts = shifts.filter(shift => {
        const shiftDate = new Date(shift.startTime);
        return (
          shiftDate.getDate() === today.getDate() &&
          shiftDate.getMonth() === today.getMonth() &&
          shiftDate.getFullYear() === today.getFullYear()
        );
      });
  
      if (filteredShifts.length > 0) {
        setTodayShift(filteredShifts[0]); // Assuming only one shift per day per employee
        // Set initial punch status based on the existing punchIn or punchOut values
        if (filteredShifts[0].punchIn && !filteredShifts[0].punchOut) {
          setPunchStatus('Punched In');
        } else if (filteredShifts[0].punchOut) {
          setPunchStatus('Punched Out');
        }
      }
    }, [shifts]);
  
    const handlePunchIn = async () => {
      if (!todayShift) return;
      try {
        const response = await axios.post(`/shifts/${todayShift._id}/punch-in`);
        setPunchStatus('Punched In');
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Error during punch-in');
      }
    };
  
    const handlePunchOut = async () => {
      if (!todayShift) return;
      try {
        const response = await axios.post(`/shifts/${todayShift._id}/punch-out`);
        setPunchStatus('Punched Out');
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Error during punch-out');
      }
    };
  
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>Punches</Typography>
        <Typography variant="body1" gutterBottom>Manage your punches here.</Typography>
        
        {/* Shift Details for Today */}
        {todayShift ? (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6">Today's Shift Details</Typography>
            <Typography variant="body1">Shift Name: {todayShift.shiftName}</Typography>
            <Typography variant="body1">Start Time: {new Date(todayShift.startTime).toLocaleString()}</Typography>
            <Typography variant="body1">End Time: {new Date(todayShift.endTime).toLocaleString()}</Typography>
          </Box>
        ) : (
          <Typography variant="body1" sx={{ mb: 3 }}>No shifts scheduled for today.</Typography>
        )}
        
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handlePunchIn}
            disabled={!todayShift || punchStatus === 'Punched In'}
          >
            Punch In
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handlePunchOut}
            disabled={!todayShift || punchStatus === 'Punched Out' || punchStatus === null}
          >
            Punch Out
          </Button>
        </Box>
  
        {punchStatus && (
          <Typography variant="body1">Status: {punchStatus}</Typography>
        )}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
        )}
      </Box>
    );
  };
  
  export default Punches;
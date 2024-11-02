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

//TODO: Test overnight shifts
//TODO: Handle more than one shift at a time?
import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Alert, Chip } from '@mui/material';
import axios from 'axios';
import './PunchesStyles.css';

const Punches = ({ shifts }) => {
  const [punchStatus, setPunchStatus] = useState(null); // Tracks if the employee is punched in or punched out
  const [error, setError] = useState(null); // To display any error messages if something goes wrong
  const [todayShift, setTodayShift] = useState(null); // Keeps track of today's or current shift
  const [previousShiftUnpunchedOut, setPreviousShiftUnpunchedOut] = useState(false); // If the last shift wasn't properly punched out
  const [tooEarlyToPunchIn, setTooEarlyToPunchIn] = useState(false); // Prevents early punch-in attempts
  const [shiftAlreadyEnded, setShiftAlreadyEnded] = useState(false); // Checks if the current shift has already ended
  const [gracePeriodExpired, setGracePeriodExpired] = useState(false); // Handles if punch-out is attempted after grace period

  // Able to replace with a "fake time" for testing if needed
  const getCurrentTime = () => new Date();

  useEffect(() => {
    const currentTime = getCurrentTime(); // Get the current time for all our checks
    let lastShift;

    // Sort the shifts by start time to access recent shift
    const sortedShifts = shifts.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

    // Filter shifts that are either today or overnight i.e started yesterday and ending today
    const filteredShifts = sortedShifts.filter(shift => {
      const shiftStartTime = new Date(shift.startTime);
      const shiftEndTime = new Date(shift.endTime);
      
      // Check if shift ends today but started yesterday i.e overnight shifts
      return (
        (shiftStartTime.getDate() === currentTime.getDate() || shiftEndTime.getDate() === currentTime.getDate()) &&
        (shiftStartTime.getMonth() === currentTime.getMonth()) &&
        (shiftStartTime.getFullYear() === currentTime.getFullYear() || shiftEndTime.getFullYear() === currentTime.getFullYear())
      );
    });

    // Get the most recent shift (this might be from yesterday if overnight)
    if (sortedShifts.length > 0) {
      lastShift = sortedShifts[sortedShifts.length - 1]; // Grab the last shift
    }

    if (filteredShifts.length > 0) {
      const shift = filteredShifts[0]; // Grab the first shift (assuming one shift per day)
      setTodayShift(shift); // Set it as today's current shift

      const shiftStartTime = new Date(shift.startTime);
      const shiftEndTime = new Date(shift.endTime);
      const earlyPunchInWindowMs = 30 * 60 * 1000; // Allow punch in 30 minutes before shift starts
      const gracePeriodInMs = 60 * 60 * 1000; // Allow a 1 hour grace period after the shift ends to punch out

      // If they haven't punched out from the last shift, they can't punch in for a new one
      if (lastShift && lastShift.punchIn && !lastShift.punchOut && shift !== lastShift) {
        setPreviousShiftUnpunchedOut(true); // Flag that they need to punch out of the last shift first
      }

      // Prevent employees from punching in too early i.e more than 30 minutes before the shift starts
      if (currentTime < (shiftStartTime - earlyPunchInWindowMs)) {
        setTooEarlyToPunchIn(true); // Too early to punch in
      } else {
        setTooEarlyToPunchIn(false); // It's within the allowed punch-in time
      }

      // Check if they are trying to punch out after the grace period
      if (currentTime > shiftEndTime && (currentTime - shiftEndTime > gracePeriodInMs) && !shift.punchOut) {
        setGracePeriodExpired(true); // Grace period for punch-out has expired
      } else {
        setGracePeriodExpired(false); // Grace period is still valid
      }

      // If the current time is after the shift end and they haven't punched in yet, they missed it
      if (currentTime > shiftEndTime && !shift.punchIn) {
        setShiftAlreadyEnded(true); // They can't punch in anymore because the shift ended
      } else {
        setShiftAlreadyEnded(false); // The shift hasn't ended yet
      }

      // Set punch status: either "Punched In" or "Punched Out"
      if (shift.punchIn && !shift.punchOut) {
        setPunchStatus('Punched In');
      } else if (shift.punchOut) {
        setPunchStatus('Punched Out');
      }
    }
  }, [shifts]);

  // Punch In function
  const handlePunchIn = async () => {
    if (!todayShift || previousShiftUnpunchedOut || tooEarlyToPunchIn || shiftAlreadyEnded) return;
    try {
      await axios.post(`/shifts/${todayShift._id}/punch-in`); // Call the API to punch in
      setPunchStatus('Punched In');
      setTodayShift({ ...todayShift, punchIn: getCurrentTime() }); // Update the local state with punch-in time
      setError(null); // Reset any previous errors
    } catch (err) {
      setError(err.response?.data?.message || 'Error during punch-in'); // Catch errors
    }
  };

  // Punch Out function
  const handlePunchOut = async () => {
    if (!todayShift || gracePeriodExpired) return; // Don't allow punch-out if grace period expired
    try {
      await axios.post(`/shifts/${todayShift._id}/punch-out`); // Call the API to punch out
      setPunchStatus('Punched Out');
      setTodayShift({ ...todayShift, punchOut: getCurrentTime() }); // Update state with punch-out time
      setError(null); // Reset any errors
    } catch (err) {
      setError(err.response?.data?.message || 'Error during punch-out');
    }
  };

  return (
    <Box className="punches-container">
      <Typography variant="h4" >Punches</Typography>

      {punchStatus && (
        <Chip
          label={`Status: ${punchStatus}`}
          color={punchStatus === 'Punched In' ? 'primary' : 'secondary'}
          variant="outlined"
          className="status-chip"
        />
      )}

      {/* Display Shift Details for today */}
      {todayShift ? (
        <Box className="shift-details">
          <Typography variant="h6">Shift Details</Typography>
          <Typography variant="body1">Shift Name: {todayShift.shiftName}</Typography>
          <Typography variant="body1">Start Time: {new Date(todayShift.startTime).toLocaleString()}</Typography>
          <Typography variant="body1">End Time: {new Date(todayShift.endTime).toLocaleString()}</Typography>
          {/* Show message if the shift is complete */}
          {todayShift.punchIn && todayShift.punchOut && (
            <Alert severity="success" className="alert-message">Today's shift has been completed.</Alert>
          )}
        </Box>
      ) : (
        <Typography variant="body1" fontSize= "2rem" className="shift-details">No shifts scheduled for today.</Typography>
      )}

      {/* Punch in and Punch out buttons */}
      {todayShift && !todayShift.punchOut && (
        <Box className="button-container">
          {/* Punch In button: disabled if conditions are not met */}
          <Button
            variant="contained"
            color="primary"
            onClick={handlePunchIn}
            disabled={punchStatus === 'Punched In' || previousShiftUnpunchedOut || tooEarlyToPunchIn || shiftAlreadyEnded}
          >
            Punch In
          </Button>
          {/* Punch Out button: disabled if grace period expired */}
          <Button
            variant="contained"
            color="secondary"
            onClick={handlePunchOut}
            disabled={punchStatus === 'Punched Out' || punchStatus === null || gracePeriodExpired}
          >
            Punch Out
          </Button>
        </Box>
      )}

      {/* Warnings for different scenarios */}
      {previousShiftUnpunchedOut && (
        <Alert severity="warning" className="alert-message">
          You cannot punch in for today's shift until you punch out from your previous shift.
        </Alert>
      )}

      {tooEarlyToPunchIn && (
        <Alert severity="warning" className="alert-message">
          You cannot punch in yet. Please wait until closer to your shift start time.
        </Alert>
      )}

      {shiftAlreadyEnded && (
        <Alert severity="warning" className="alert-message">
          You cannot punch in as the shift has already ended.
        </Alert>
      )}

      {gracePeriodExpired && (
        <Alert severity="warning" className="alert-message">
          You cannot punch out as the grace period has expired. Please contact your supervisor.
        </Alert>
      )}

      {error && (
        <Alert severity="error" className="alert-message">{error}</Alert>
      )}
    </Box>
  );
};

export default Punches;
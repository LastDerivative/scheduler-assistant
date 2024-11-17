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
import axiosInstance from '../../axiosInstance';
import './PunchesStyles.css';

const Punches = ({ employeeId }) => {
  // State to track the punch-in or punch-out status
  const [punchStatus, setPunchStatus] = useState(null);

  // State to hold the current shift data for today
  const [todayShift, setTodayShift] = useState(null);

  // State for error messages
  const [error, setError] = useState(null);

  // Flags to enforce rules around punching in or out
  const [previousShiftUnpunchedOut, setPreviousShiftUnpunchedOut] = useState(false);
  const [tooEarlyToPunchIn, setTooEarlyToPunchIn] = useState(false);
  const [shiftAlreadyEnded, setShiftAlreadyEnded] = useState(false);
  const [gracePeriodExpired, setGracePeriodExpired] = useState(false);

  // Helper to get the current time
  const getCurrentTime = () => new Date();

  /**
   * Fetch the shifts for the specified employee from the backend.
   * This ensures we always have up-to-date data.
   */
  const fetchShifts = async () => {
    try {
        console.log('Fetching current shift...');
        const response = await axiosInstance.get(`/employees/${employeeId}/current-shift`);
        const shift = response.data;

        if (shift) {
            setTodayShift(shift);

            // Determine the punch-in/out status
            if (shift.punchIn && !shift.punchOut) {
                setPunchStatus('Punched In');
            } else if (shift.punchOut) {
                setPunchStatus('Punched Out');
            } else {
                setPunchStatus(null);
            }

            // Apply rules (e.g., grace period, early punch-in)
            enforceShiftRules(shift);
        } else {
            setTodayShift(null);
            setPunchStatus(null);
        }
    } catch (err) {
        console.error('Error fetching current shift:', err);
        setError('Failed to fetch current shift. Please try again.');
    }
};


  /**
   * Enforces rules for punching in and out based on the shift.
   * This includes preventing early punch-ins and handling expired grace periods.
   */
  const enforceShiftRules = (shift, lastShift) => {
    const currentTime = getCurrentTime();
    const shiftStartTime = new Date(shift.startTime);
    const shiftEndTime = new Date(shift.endTime);

    const earlyPunchInWindowMs = 30 * 60 * 1000; // 30 minutes before start time
    const gracePeriodInMs = 60 * 60 * 1000; // 1-hour grace period after shift ends

    // Prevent punching in too early
    setTooEarlyToPunchIn(currentTime < shiftStartTime - earlyPunchInWindowMs);

    // Block punch-ins if the shift has already ended
    setShiftAlreadyEnded(currentTime > shiftEndTime && !shift.punchIn);

    // Block punch-outs if the grace period has expired
    setGracePeriodExpired(currentTime > shiftEndTime && currentTime - shiftEndTime > gracePeriodInMs && !shift.punchOut);

    // Require punching out from the last shift before punching in for a new one
    setPreviousShiftUnpunchedOut(lastShift && lastShift.punchIn && !lastShift.punchOut && shift !== lastShift);
  };

  // Fetch shifts when the component mounts or the employeeId changes
  useEffect(() => {
    if (employeeId) {
      fetchShifts();
    }
  }, [employeeId]);

  /**
   * Punch in for the current shift.
   */
  const handlePunchIn = async () => {
    if (!todayShift || previousShiftUnpunchedOut || tooEarlyToPunchIn || shiftAlreadyEnded) return;
    try {
      await axiosInstance.post(`/shifts/${todayShift._id}/punch-in`);
      fetchShifts(); // Refetch data after punching in
    } catch (err) {
      setError(err.response?.data?.message || 'Error during punch-in');
    }
  };

  /**
   * Punch out for the current shift.
   */
  const handlePunchOut = async () => {
    if (!todayShift || gracePeriodExpired) return;
    try {
      await axiosInstance.post(`/shifts/${todayShift._id}/punch-out`);
      fetchShifts(); // Refetch data after punching out
    } catch (err) {
      setError(err.response?.data?.message || 'Error during punch-out');
    }
  };

  return (
    <Box className="punches-container">
      <Typography variant="h4">Punches</Typography>

      {punchStatus && (
        <Chip
          label={`Status: ${punchStatus}`}
          color={punchStatus === 'Punched In' ? 'primary' : 'secondary'}
          variant="outlined"
          className="status-chip"
        />
      )}

      {todayShift ? (
        <Box className="shift-details">
          <Typography variant="h6">Shift Details</Typography>
          <Typography variant="body1">Shift Name: {todayShift.shiftName}</Typography>
          <Typography variant="body1">Start Time: {new Date(todayShift.startTime).toLocaleString()}</Typography>
          <Typography variant="body1">End Time: {new Date(todayShift.endTime).toLocaleString()}</Typography>
          {todayShift.punchIn && todayShift.punchOut && (
            <Alert severity="success" className="alert-message">Today's shift has been completed.</Alert>
          )}
        </Box>
      ) : (
        <Typography variant="body1" fontSize="2rem" className="shift-details">No shifts scheduled for today.</Typography>
      )}

      {todayShift && !todayShift.punchOut && (
        <Box className="button-container">
          <Button
            variant="contained"
            color="primary"
            onClick={handlePunchIn}
            disabled={punchStatus === 'Punched In' || previousShiftUnpunchedOut || tooEarlyToPunchIn || shiftAlreadyEnded}
          >
            Punch In
          </Button>
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
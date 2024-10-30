/**
 * TimeOff: This component allows employees to submit a time-off request
 * by specifying start and end dates. The form submission sends the data to the backend 
 * and displays a success or error message based on the API response.
 * 
 */

import React, { useState, useEffect } from 'react';
import { Box, Button, Alert, Modal, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Typography } from '@mui/material';
// MUI date picker components for selecting start and end dates
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// Libraries for making API requests and working with dates
import axios from 'axios';
import dayjs from 'dayjs'; // Date library for formatting dates and handling date manipulation
import CloseIcon from '@mui/icons-material/Close';
import './RequestsStyles.css';

const TimeOff = ({ employeeID }) => {
  // State for tracking time-off requests, form input values, modal status, and messages
  const [requests, setRequests] = useState([]); // Stores existing time-off requests
  const [timeOffStart, setTimeOffStart] = useState(null); // Start date for new request
  const [timeOffEnd, setTimeOffEnd] = useState(null); // End date for new request
  const [modalOpen, setModalOpen] = useState(false); // Modal open/close state
  const [error, setError] = useState(null); // Error message to display
  const [successMessage, setSuccessMessage] = useState(""); // Success message after form submission

  // Load the employee's previous time-off requests when the component mounts or the employeeID changes
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(`/employees/${employeeID}/employeeRequests/timeOff`);
        setRequests(response.data); // Save fetched requests to state
      } catch (err) {
        setError("Failed to load existing time-off requests."); // Display error if data loading fails
      }
    };
    fetchRequests();
  }, [employeeID]);

  // Handle form submission for new time-off requests
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents default form submission behavior
    try {
      const response = await axios.post(`/employeeRequests/new`, {
        employeeID, // ID of the employee submitting the request
        requestType: "time-off", // Type of request
        timeOffStart: timeOffStart?.toISOString(), // Convert start date to ISO string
        timeOffEnd: timeOffEnd?.toISOString(), // Convert end date to ISO string
        submitDate: new Date(), // Current date as submission date
        status: "pending", // Default status for new requests
      });

      if (response.status === 201) {
        setSuccessMessage("Time-off request submitted successfully!"); // Success message
        setRequests([...requests, response.data]); // Add new request to existing requests
        handleCloseModal(); // Close modal after submission
      } else {
        setError("Failed to submit your time-off request."); // Display error if status is not 201
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred while submitting your request."); // Handle and display any errors
    }
  };

  // Functions to open and close the modal, resetting form values and messages on close
  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => {
    setModalOpen(false);
    setTimeOffStart(null);
    setTimeOffEnd(null);
    setError(null);
    setSuccessMessage("");
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box className="timeoff-section">
        <Typography variant="h5" gutterBottom>Time-Off Requests</Typography>

        {/* Display a table of existing time-off requests or a message if none exist */}
        {requests.length > 0 ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className='bold-header'>Start Date</TableCell>
                  <TableCell className='bold-header'>End Date</TableCell>
                  <TableCell className='bold-header'>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request._id}>
                    <TableCell>{dayjs(request.timeOffStart).format("MM/DD/YYYY")}</TableCell>
                    <TableCell>{dayjs(request.timeOffEnd).format("MM/DD/YYYY")}</TableCell>
                    <TableCell>{request.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography>No time-off requests yet.</Typography>
        )}

        {/* Button to open the form for a new time-off request */}
        <Button variant="contained" color="primary" onClick={handleOpenModal} style={{ marginTop: 16 }}>
          New Time-Off Request
        </Button>

        {/* Modal containing the form to submit a new time-off request */}
        <Modal open={modalOpen} onClose={handleCloseModal}>
          <Box className="modal-container">
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Submit New Time-Off Request</Typography>
              <IconButton onClick={handleCloseModal}>
                <CloseIcon />
              </IconButton>
            </Box>
            {/* Form fields for start and end dates with validation */}
            <Box component="form" onSubmit={handleSubmit}>
              <Box sx={{ mb: 2 }}> {/* Adds bottom margin to the Start Date picker */}
                <DatePicker
                  label="Start Date"
                  value={timeOffStart}
                  onChange={(newValue) => setTimeOffStart(newValue)} // Update start date
                  shouldDisableDate={(date) => date.isBefore(dayjs())} // Disable past dates
                  disablePast
                  slotProps={{
                    textField: {
                      required: true,
                      variant: "outlined",
                    },
                  }}
                />
                </Box>
              <DatePicker
                label="End Date"
                value={timeOffEnd}
                onChange={(newValue) => setTimeOffEnd(newValue)} // Update end date
                shouldDisableDate={(date) => date.isBefore(timeOffStart || dayjs())} // Ensure end date is after start date
                disablePast
                slotProps={{
                  textField: {
                    required: true,
                    variant: "outlined",
                  },
                }}
              />
              <Button variant="contained" color="primary" type="submit" style={{ marginTop: 16 }}>
                Submit Request
              </Button>
            </Box>
            {/* Display error message if present */}
            {error && <Alert severity="error">{error}</Alert>}
          </Box>
        </Modal>

        {/* Display success message if request submission succeeds */}
        {successMessage && <Alert severity="success">{successMessage}</Alert>}
      </Box>
    </LocalizationProvider>
  );
};

export default TimeOff;

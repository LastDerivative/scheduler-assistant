/**
 * ShiftTrading: This component allows employees to submit a shiftTrade request
 * by specifying shift to give up and the shift they want. The form submission sends the data to the backend 
 * and displays a success or error message based on the API response.
 * 
 */
import React, { useState, useEffect } from 'react';
import { Box, Button, Alert, Modal, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Typography, TextField } from '@mui/material';
import axios from 'axios';
import CloseIcon from '@mui/icons-material/Close';
import './RequestsStyles.css';

const ShiftTrading = ({ employeeID }) => {
  const [shiftTrades, setShiftTrades] = useState([]);
  const [shiftToTrade, setShiftToTrade] = useState('');
  const [desiredShift, setDesiredShift] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchShiftTrades = async () => {
      try {
        // Fetch shift trade requests
        const response = await axios.get(`/employees/${employeeID}/employeeRequests/shiftTrades`);
        const trades = response.data;

        // Fetch and add shift names for each shift in the trade data
        const updatedTrades = await Promise.all(
          trades.map(async (trade) => {
            // Fetch names for both shifts involved in the trade
            const shiftToTradeName = await fetchShiftName(trade.shiftToTradeID);
            const desiredShiftName = await fetchShiftName(trade.desiredShiftID);

            // Return a new object with the shift names included
            return {
              ...trade,
              shiftToTradeName,
              desiredShiftName,
            };
          })
        );

        // Update state with trades that include shift names
        setShiftTrades(updatedTrades);
      } catch (err) {
        setError("Failed to load existing shift trades.");
      }
    };

    fetchShiftTrades();
  }, [employeeID]);

  // Function to fetch the shift name by ID
  const fetchShiftName = async (shiftID) => {
    try {
      const response = await axios.get(`/shifts/${shiftID}`);
      return response.data.shiftName; // using shiftName field
    } catch (err) {
      console.error("Failed to fetch shift name:", err);
      return "Unknown Shift"; // Fallback if there's an error
    }
  };

  // Handle form submission for new shift trade requests
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/employeeRequests/new`, {
        employeeID,
        requestType: "shift-trade",
        shiftToTradeID: shiftToTrade,
        desiredShiftID: desiredShift,
        submitDate: new Date(),
        status: "pending",
      });

      if (response.status === 201) {
        setSuccessMessage("Shift trade request submitted successfully!");
        setShiftTrades([...shiftTrades, response.data]);
        handleCloseModal();
      } else {
        setError("Failed to submit your shift trade request.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred while submitting your request.");
    }
  };

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => {
    setModalOpen(false);
    setShiftToTrade('');
    setDesiredShift('');
    setError(null);
    setSuccessMessage("");
  };

  return (
    <Box className="shifttrading-section">
      <Typography variant="h5" gutterBottom>Shift Trading Requests</Typography>

      {shiftTrades.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className='bold-header'>Shift to Trade</TableCell>
                <TableCell className='bold-header'>Desired Shift</TableCell>
                <TableCell className='bold-header'>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {shiftTrades.map((trade) => (
                <TableRow key={trade._id}>
                  <TableCell>{trade.shiftToTradeName}</TableCell>
                  <TableCell>{trade.desiredShiftName}</TableCell>
                  <TableCell>{trade.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography>No shift trade requests yet.</Typography>
      )}

      <Button variant="contained" color="primary" onClick={handleOpenModal} style={{ marginTop: 16 }}>
        New Shift Trade Request
      </Button>

      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box className="modal-container">
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Submit New Shift Trade Request</Typography>
            <IconButton onClick={handleCloseModal}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="Shift to Trade"
              value={shiftToTrade}
              onChange={(e) => setShiftToTrade(e.target.value)}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Desired Shift"
              value={desiredShift}
              onChange={(e) => setDesiredShift(e.target.value)}
              fullWidth
              required
              margin="normal"
            />
            <Button variant="contained" color="primary" type="submit" style={{ marginTop: 16 }}>
              Submit Request
            </Button>
          </Box>
          {error && <Alert severity="error">{error}</Alert>}
        </Box>
      </Modal>

      {successMessage && <Alert severity="success">{successMessage}</Alert>}
    </Box>
  );
};

export default ShiftTrading;

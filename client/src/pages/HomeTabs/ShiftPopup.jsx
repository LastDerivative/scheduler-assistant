// src/components/ShiftPopup.js
import React from 'react';
import { Box, Typography, Paper, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const ShiftPopup = ({ shift, position, onClose }) => {
  return (
    <Paper
      sx={{
        position: 'absolute',
        top: position.top,
        left: position.left,
        zIndex: 1000,
        padding: 2,
        backgroundColor: '#424242',
        color: '#ffffff',
        minWidth: '200px',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">{shift.shiftName}</Typography>
        <IconButton size="small" onClick={onClose} sx={{ color: '#ffffff' }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Typography variant="body2">Time: {shift.startTime.format('h:mm A')} - {shift.endTime.format('h:mm A')}</Typography>
      <Typography variant="body2">Description: {shift.description || 'N/A'}</Typography>
    </Paper>
  );
};

export default ShiftPopup;

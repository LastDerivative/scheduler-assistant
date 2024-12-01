import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box'

// To make authenticated call
import axiosInstance from '../../axiosInstance';
import { Typography } from '@mui/material';

const Roster = ( {employeeData, organizationData} ) => {

  // Will use to get all shifts for the day by given org
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShifts = async () => {
        try {
            // Convert current date to Eastern Time (YYYY-MM-DD)
            const today = new Intl.DateTimeFormat('en-US', {
                timeZone: 'America/New_York',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            })
                .format(new Date())
                .split('/') // Split MM/DD/YYYY into parts
                .join('-'); // Join parts into ISO format
            
            console.log('Eastern Time Date:', today); // Debugging

            const response = await axiosInstance.get(`/shifts/org/${employeeData.orgID}/shifts`, {
                params: { date: today } // Send date in Eastern Time
            });

            // Store shifts in state
            setShifts(response.data);
        } catch (error) {
            console.error('Error fetching shifts:', error);
        } finally {
            setLoading(false);
        }
    };

    if (employeeData?.orgID) {
        fetchShifts();
    }
}, [employeeData]);

    return (
        <Box sx={{ maxWidth: '1000px', margin: '0 auto', padding: '0px' }}>
            <Typography  sx={{ fontSize: '23px' }}>Here are the employees that you manage within your organization:</Typography>
            <Typography sx={{ fontSize: '20px', mt: 0.5, mb: 0.5}}>{organizationData}</Typography>
            <TableContainer component={Paper} sx={{ mt: 1 }}>
            <Table sx={{ minWidth: 500 }} size="small" aria-label="a dense table">
                <TableHead>
                    <TableRow>
                        <TableCell>
                            <Typography sx={{ fontSize: '20px' }}>Name</Typography>
                        </TableCell>
                        <TableCell>
                            <Typography sx={{ fontSize: '20px' }}>Email</Typography>
                        </TableCell>
                        <TableCell>
                            <Typography sx={{ fontSize: '20px' }}>Employee ID</Typography>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {shifts.map((shift) => {
                        const employeeName = shift.employeeID ? shift.employeeID.name : 'Unassigned'; // Default for unassigned shifts
                        const employeeID = shift.employeeID ? shift.employeeID._id : 'no id';
                        const employeeEmail = shift.employeeID ? shift.employeeID.email : 'no email';
                        return (
                            <TableRow key={shift._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell component="th" scope="row">
                                    <Typography sx={{ fontSize: '18px' }}>{employeeName}</Typography>
                                </TableCell>
                                <TableCell>
                                <Typography sx={{ fontSize: '18px' }}>{employeeEmail}</Typography>
                                </TableCell>
                                <TableCell>
                                <Typography sx={{ fontSize: '18px' }}>{employeeID}</Typography>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    </Box>
    );
}

export default Roster;
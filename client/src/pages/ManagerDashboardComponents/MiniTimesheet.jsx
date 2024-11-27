import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

// To make authenticated call
import axiosInstance from '../../axiosInstance';



const MiniTimesheet = ({ employeeData }) => {

    // Will use to get all shifts for the day by given org
    const [shifts, setShifts] = useState([]);
    const [loading, setLoading] = useState(true);


    //console.log("Employee Data:", employeeData);// To test the passing of employeeData
    // Will need this to grab the org, and then pull shift data of every employee from that org
    // Could also do it by site, but meh

    useEffect(() => {
        const fetchShifts = async () => {
            try {
                const today = new Date().toISOString().split('T')[0]; // Current date (YYYY-MM-DD)
                
                const response = await axiosInstance.get(`/shifts/org/${employeeData.orgID}/shifts`, {
                    params: { date: today } // Send date
                });
                //console.log('Shifts for today:', response.data);
                setShifts(response.data); // Store shifts in state
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

    if (loading) {
        return <Typography>Loading shift data...</Typography>;
    }

    if (!shifts.length) {
        return <Typography>No shifts scheduled for today.</Typography>;
    }

    return (
        <TableContainer component={Paper} sx={{ mt: 1 }}>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell align="center">Start</TableCell>
                        <TableCell align="center">End</TableCell>
                        <TableCell align="center">Total (hrs)</TableCell>
                        <TableCell align="left">Location</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {shifts.map((shift) => {
                        const employeeName = shift.employeeID ? shift.employeeID.name : 'Unassigned'; // Default for unassigned shifts
                        const totalHours =
                            (new Date(shift.endTime) - new Date(shift.startTime)) / (1000 * 60 * 60); // Calculate duration
                        const siteName = shift.siteID ? shift.siteID.siteName : 'Unknown Location'; // Default for missing site

                        return (
                            <TableRow key={shift._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell component="th" scope="row">{employeeName}</TableCell>
                                <TableCell align="center">{new Date(shift.startTime).toLocaleTimeString()}</TableCell>
                                <TableCell align="center">{new Date(shift.endTime).toLocaleTimeString()}</TableCell>
                                <TableCell align="center">{totalHours.toFixed(2)}</TableCell>
                                <TableCell align="left">{siteName}</TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default MiniTimesheet;
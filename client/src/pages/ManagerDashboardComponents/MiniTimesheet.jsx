import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function createData(name, start, end, total, location) {
    return { name, start, end, total, location };
}

const rows = [
    createData('Luke', 800, 1630, 8, 'Corporate Office'),
];

const MiniTimesheet = () => {
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
                    {rows.map((row) => (
                        <TableRow
                            key={row.name}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                        <TableCell component="th" scope="row">{row.name}</TableCell>
                        <TableCell align="center">{row.start}</TableCell>
                        <TableCell align="center">{row.end}</TableCell>
                        <TableCell align="center">{row.total}</TableCell>
                        <TableCell align="left">{row.location}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default MiniTimesheet;
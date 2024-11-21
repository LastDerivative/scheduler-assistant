import * as React from 'react';
import { spacing, positions } from '@mui/system';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Button, Card, CardContent } from "@mui/material";
import Timesheet from './Timesheet.jsx';

const currDate = new Date().toLocaleDateString();
const currTime = new Date().toLocaleTimeString();

const widgets = [
    {
        title: 'forecast',
        value: '78 degrees',
    },
    {
        title: 'date',
        value: 'november 15th',
    },
    {
        title: 'headcount',
        value: 3,
    }
];

const MainBoard = () => {
    return (
        <>
            <Box sx={{
                py: 2,
                width: '100%',
                maxWidth: 1100,
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                gap: 4,
            }}>
                <Card variant="outlined">
                    <CardContent>
                        <Typography color="primary"
                                    level="title-lg"
                                    sx={{ fontSize: 20 }}
                                    >Date & Time</Typography>
                        <Typography level="body-md">{currDate}</Typography>
                        <Typography level="body-md">{currTime}</Typography>
                    </CardContent>
                </Card>

                <Card variant="outlined">
                    <CardContent>
                        <Typography color="primary"
                                    level="title-lg"
                                    sx={{ fontSize: 20 }}>Today&apos;s Staff Count</Typography>
                        <Button variant="contained" color="primary" size="sm">
                            5
                        </Button>
                    </CardContent>
                </Card>

                <Card variant="outlined">
                    <CardContent>
                        <Typography color="primary"
                                    level="title-lg"
                                    sx={{ fontSize: 20 }}>Pending Requests</Typography>
                        <Typography>Should display a preview for shift trade requests.</Typography>
                    </CardContent>
                </Card>

                <Card variant="outlined">
                    <CardContent>
                        <Typography color="primary"
                                    level="title-lg"
                                    sx={{ fontSize: 20 }}>
                            Miscellaneous
                        </Typography>
                        <Typography textColor="inherit">Extra card. Functionality TBD.</Typography>
                    </CardContent>
                </Card>
            </Box>
        </>
    );
}

export default MainBoard;
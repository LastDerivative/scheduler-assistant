import * as React from 'react';
import { Box, Container, Grid2, Stack, Typography } from '@mui/material';
import { Button, Card, CardContent } from "@mui/material";
import MonthlyCalendar from "./MonthlyCalendar";
import MiniTimesheet from './MiniTimesheet';
import LiveClock from './LiveClock';


const currDate = new Date().toLocaleDateString();
const currTime = new Date().toLocaleTimeString();

// Received employeeData from ManagerDashboard
const MainBoard = ({ employeeData }) => {
    return (
        <>
            <Box sx={{
                py: 2,
                width: '100%',
                maxWidth: 1000,
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                gap: 2,
            }}>
                <Card variant="outlined">
                    <CardContent>
                        <Typography color="primary"
                                    level="title-lg"
                                    sx={{ fontSize: 20 }}
                                    >Clock</Typography>
                        <LiveClock />
                    </CardContent>
                </Card>

                <Card variant="outlined">
                    <CardContent>
                        <Typography color="primary"
                                    level="title-lg"
                                    sx={{ fontSize: 20 }}>Today&apos;s Staff Count</Typography>
                        <Button variant="contained" color="primary" size="sm">
                            1
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

                <Card variant="outlined" sx={{ alignItems: 'center', fontSize: 20, width: 390, height: 340,  }}>
                    <CardContent>
                        <MonthlyCalendar />
                    </CardContent>
                </Card>

                <Card variant="outlined" sx={{ ml:8.5, width: 593 }}>
                <Typography color="primary"
                                    level="title-lg"
                                    sx={{ fontSize: 22, mt: 2 }}>Schedule Quickview</Typography>
                        <Typography>Should display employee name&apos;s and the hours they&apos;re working today</Typography>
                        <MiniTimesheet employeeData={employeeData}/>
                </Card>
            </Box>
        </>
    );
}

export default MainBoard;
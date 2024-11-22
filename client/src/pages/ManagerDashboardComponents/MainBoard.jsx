import * as React from 'react';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Button, Card, CardContent } from "@mui/material";
import MonthlyCalendar from "./MonthlyCalendar";

const currDate = new Date().toLocaleDateString();
const currTime = new Date().toLocaleTimeString();

const MainBoard = () => {
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
                        <Typography level="body-lg">{currTime}</Typography>
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

                <Card variant="outlined" sx={{ alignItems: 'center', fontSize: 20, width: 390, height: 340,  }}>
                    <CardContent>
                        <MonthlyCalendar />
                    </CardContent>
                </Card>

                <Card variant="outlined" sx={{ ml:8.5, width: 593 }}>
                <Typography color="primary"
                                    level="title-lg"
                                    sx={{ fontSize: 22, mt: 2 }}>Schedule Quickview</Typography>
                        <Typography>Should display employee name&apos;s and the hours they're working today</Typography>
                </Card>
            </Box>
        </>
    );
}

export default MainBoard;
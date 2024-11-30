import * as React from 'react';
import { Badge, Box, Container, Grid2, Stack, Typography } from '@mui/material';
import { Button, Card, CardContent } from "@mui/material";
import MailIcon from '@mui/icons-material/Mail';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import MonthlyCalendar from "./MonthlyCalendar";
import MiniTimesheet from './MiniTimesheet';
import LiveClock from './LiveClock';

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
                                    sx={{ fontSize: 20, mb: 2 }}>Today&apos;s Staff Count
                        </Typography>
                        <Badge badgeContent={3} color="primary">
                            <AssignmentIndIcon color="action" fontSize='large'/>
                        </Badge>
                    </CardContent>
                </Card>

                <Card variant="outlined">
                    <CardContent>
                        <Typography color="primary"
                                    level="title-lg"
                                    sx={{ fontSize: 20, mb: 2}}>Pending Requests</Typography>
                                    <Badge badgeContent={0} showZero color="primary">
                                        <MailIcon color="action" fontSize='large'/>
                                    </Badge>
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
                        <MiniTimesheet employeeData={employeeData}/>
                </Card>
            </Box>
        </>
    );
}

export default MainBoard;
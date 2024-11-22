import * as React from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import { createTheme } from '@mui/material/styles';
// ToolPad components
import { AppProvider, PageContainer, DashboardLayout } from '@toolpad/core';
import { useDemoRouter } from '@toolpad/core/internal';
// Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import PunchClockIcon from '@mui/icons-material/PunchClock';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PersonIcon from '@mui/icons-material/Person';
import GroupsIcon from '@mui/icons-material/Groups';
import LogoutIcon from '@mui/icons-material/Logout';
// Dashboard components
import ShiftCalendar from './ManagerDashboardComponents/ShiftCalendar';
import MainBoard from './ManagerDashboardComponents/MainBoard.jsx';
import Timesheet from "./ManagerDashboardComponents/Timesheet.jsx";

// All sidebar menu options
const NAVIGATION = [
    {
        kind: 'header',
        title: 'General'
    },
    {
        segment: 'dashboard',
        title: 'Dashboard',
        icon: <DashboardIcon />
    },
    {
        segment: 'profile',
        title: 'Profile',
        icon: <PersonIcon />
    },
    {
        kind: 'divider',
    },
    {
        kind: 'header',
        title: 'Employee Management',
    },
    {
        segment: 'schedule',
        title: 'Schedule',
        icon: <CalendarMonthIcon />,
    },
    {
        segment: 'timesheet',
        title: 'Timesheet',
        icon: <PunchClockIcon />
    },
    {
        segment: 'roster',
        title: 'Roster',
        icon: <GroupsIcon />
    },
    {
        kind: 'divider',
    },
    {
        title: 'Logout',
        kind: 'button',
        icon: <LogoutIcon />,
        
    }
    ];

// Dashboard color scheme
const demoTheme = createTheme({
    cssVariables: {
        colorSchemeSelector: 'data-toolpad-color-scheme'
    },
    colorSchemes: {light: true, dark: true},
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 600,
            lg: 1200,
            xl: 1536,
        },
    },
});

// Displays the content for each page depending on its filepath name
function PageContent({ pathname }) {
    return (
        <Box
            sx={{
                py: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
            }}>
            <Typography variant="h4">{pathname.toUpperCase().slice(1)}</Typography>
            {pathname === '/dashboard' && <MainBoard />}
            {pathname === '/schedule' && <ShiftCalendar />}
            {pathname === '/timesheet' && <Timesheet />}
        </Box>
    );
}

PageContent.propTypes = {
    pathname: PropTypes.string.isRequired,
};

// Renders the Dashboard view
function ManagerDashboard(props) {
    const { window } = props;

    const router = useDemoRouter('/dashboard');

    const demoWindow = window !== undefined ? window() : undefined;

    return (
        <AppProvider
            navigation={NAVIGATION}
            router={router}
            theme={demoTheme}
            window={demoWindow}
            branding={{
                title: 'Scheduler',
            }}>
            <DashboardLayout>
                <PageContent pathname={router.pathname} />
            </DashboardLayout>
        </AppProvider>
    );
}

ManagerDashboard.propTypes = {
    window: PropTypes.func,
};

export default ManagerDashboard;
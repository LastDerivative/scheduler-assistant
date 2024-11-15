import * as React from 'react';
import PropTypes from "prop-types";
import Box from '@mui/material/Box';
import { Button } from "@mui/material";
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { createTheme } from '@mui/material/styles';
import { AppProvider } from '@toolpad/core/AppProvider';
import { PageContainer } from '@toolpad/core/PageContainer';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { useDemoRouter } from '@toolpad/core/internal';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PunchClockIcon from '@mui/icons-material/PunchClock';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';

// Every sidebar menu option
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
        children: [
            {
                segment: 'weekly-schedule',
                title: 'Weekly Schedule',
            },
            {
                segment: 'monthly-schedule',
                title: 'Monthly Schedule',
            }
        ]
    },
    {
        segment: 'timesheet',
        title: 'Timesheet',
        icon: <PunchClockIcon />
    },
    {
        kind: 'divider',
    },
    {
        segment: 'logout',
        title: 'Logout',
        icon: <LogoutIcon />,
    },
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
            <Typography>Dashboard content for {pathname}</Typography>

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
        >
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
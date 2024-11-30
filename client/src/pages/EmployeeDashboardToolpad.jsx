import * as React from 'react';
import PropTypes from "prop-types";
import Box from '@mui/material/Box';
import { createTheme } from '@mui/material/styles';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PersonIcon from '@mui/icons-material/Person';
import PunchClockIcon from '@mui/icons-material/PunchClock';
import LogoutIcon from '@mui/icons-material/Logout';
import { useDemoRouter } from '@toolpad/core/internal';
import { useParams, useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';

import axiosInstance from '../axiosInstance';

// Import custom components
import Requests from './EmployeeDashboardComponents/Requests/Requests';
import Punches from './EmployeeDashboardComponents/Punches';
import Profile from './EmployeeDashboardComponents/Profile';
import TimesheetTab from './HomeTabs/TimesheetTab';
import ScheduleTab from './HomeTabs/ScheduleTab';
import DashboardTab from './HomeTabs/DashboardTab';
import SignOut from '../SignOut';

// Utility functions
const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Intl.DateTimeFormat('en-US', options).format(date);
};

const getNextFiveDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 5; i++) {
        const nextDate = new Date(today);
        nextDate.setDate(today.getDate() + i);
        dates.push(formatDate(nextDate));
    }
    return dates;
};

const getNextTwoWeeks = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
        const nextDate = new Date(today);
        nextDate.setDate(today.getDate() + i);
        dates.push(formatDate(nextDate));
    }
    return dates;
};

// Sidebar Navigation options
const NAVIGATION = [
    { kind: 'header', title: 'General'},
    { segment: 'dashboard', title: 'Dashboard', icon: <DashboardIcon />},
    { segment: 'profile', title: 'Profile', icon: <PersonIcon /> },
    { kind: 'divider' },
    { kind: 'header', title: 'Employee Functions'},
    { segment: 'schedule', title: 'Schedule', icon: <CalendarMonthIcon />,
        children: [
            
            { title: 'Schedule' },
            { segment: 'timesheet', title: 'Timesheet' },
            { segment: 'requests', title: 'Your Requests' }
        ]
     },
    { segment: 'punch', title: 'Clock In/Out', icon: <PunchClockIcon /> },
    { kind: 'divider' },
    { segment: 'sign-out', title: 'Logout', icon: <LogoutIcon />   },
];

// Define the custom theme
const demoTheme = createTheme({
    colorSchemes: { dark: true },
    breakpoints: { values: { xs: 0, sm: 600, md: 960, lg: 1280, xl: 1920 } },
});

// Displays the content for each page depending on its filepath name
function PageContent({ pathname, shifts, dashboardDates, scheduleDates, employeeData, employeeId }) {
    return (
        <Box
            sx={{
                py: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
            }}>
            {pathname === '/dashboard' && <DashboardTab shifts={shifts} dashboardDates={dashboardDates} />}
            {pathname === '/schedule' && <ScheduleTab shifts={shifts} scheduleDates={scheduleDates} />}
            {pathname === '/schedule/requests' && <Requests employeeID ={employeeId}/>}
            {pathname === '/schedule/timesheet' && <TimesheetTab shifts={shifts} />}
            {pathname === '/punch' && <Punches employeeId ={employeeId}/>}
            {pathname === '/profile' && <Profile employeeData={employeeData}/>}
            
            
        </Box>
    );
}

PageContent.propTypes = {
    pathname: PropTypes.string.isRequired,
    shifts: PropTypes.array.isRequired,
    dashboardDates: PropTypes.array.isRequired,
    scheduleDates: PropTypes.array.isRequired,
    employeeData: PropTypes.object,
    employeeId: PropTypes.string.isRequired,
};


// Main EmployeeDashboard component
function EmployeeDashboard(props) {
    const { window } = props;
    const { employeeId } = useParams();

    const demoWindow = window !== undefined ? window() : undefined
    const router = useDemoRouter('/dashboard');
    const navigate = useNavigate();
    
    
    const [employeeData, setEmployeeData] = React.useState(null);
    const [shifts, setShifts] = React.useState([]);
    const [dashboardDates, setDashboardDates] = React.useState(getNextFiveDates());
    const [scheduleDates, setScheduleDates] = React.useState(getNextTwoWeeks());
    

    // Fetch Shift Data
   React.useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch employee data
                const employeeResponse = await axiosInstance.get(`/employees/${employeeId}`);
                setEmployeeData(employeeResponse.data);

                // Fetch shift data
                const shiftsResponse = await axiosInstance.get(`/employees/${employeeId}/shifts`);
                setShifts(shiftsResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        if (employeeId) {
            fetchData();
        }
    }, [employeeId]);


    return (
        <AppProvider 
        navigation={NAVIGATION}
        router={router}
        theme={demoTheme}
        window={demoWindow}
        branding={{
            //logo: <img src="https://mui.com/static/logo.png" alt="MUI logo" />,
            title: 'Scheduler',
          }}>
            <DashboardLayout>
                {router.pathname === '/sign-out' ? (
                    <SignOut />
                ) : (
                    <PageContent
                        pathname={router.pathname}
                        shifts={shifts}
                        dashboardDates={dashboardDates}
                        scheduleDates={scheduleDates}
                        employeeData={employeeData}
                        employeeId={employeeId}
                    />
                )}
            </DashboardLayout>
        </AppProvider>
    );
}

EmployeeDashboard.propTypes = {
    window: PropTypes.func,
};

export default EmployeeDashboard;

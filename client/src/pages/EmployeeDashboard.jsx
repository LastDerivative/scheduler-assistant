import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './EmployeeDashboard.css';
// Components
import Requests from './EmployeeDashboardComponents/Requests/Requests';
import Punches from './EmployeeDashboardComponents/Punches';
import Profile from './EmployeeDashboardComponents/Profile';
import Sidebar from './EmployeeDashboardComponents/Sidebar';

import TimesheetTab from './HomeTabs/TimesheetTab';
import ScheduleTab from './HomeTabs/ScheduleTab';
import DashboardTab from './HomeTabs/DashboardTab';


// Format date as "Month Day, Year"
const formatDate = (date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Intl.DateTimeFormat('en-US', options).format(date);
};

// Calculate the next 5 dates from today
const getNextFiveDates = () => {
  const dates = [];
  const today = new Date(); // Get todays date

  for (let i = 0; i < 5; i++) {
    const nextDate = new Date(today); // Copy to nextDate
    nextDate.setDate(today.getDate() + i); // Now able to advance without changing "today"
    dates.push(formatDate(nextDate));
  }
  
  return dates;
};

// Calculate the next 14 dates from today
const getNextTwoWeeks = () => {
  const dates = [];
  const today = new Date(); // Get todays date

  for (let i = 0; i < 14; i++) {
    const nextDate = new Date(today); // Copy to nextDate
    nextDate.setDate(today.getDate() + i); // Now able to advance without changing "today"
    dates.push(formatDate(nextDate));
  }

  return dates;
};

const EmployeeDashboard = () => {
  // State to store employee data from backend
  const [employeeData, setEmployeeData] = useState(null);
  const [error, setError] = useState(null);

  // Get employeeId from the URL parameter
  const { employeeId } = useParams();

  // State to hold dates
  const [dashboardDates, setDashboardDates] = useState([]);
  const [scheduleDates, setScheduleDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null); // Track the selected date in the schedule tab

  // Log employeeId for testing
  useEffect(() => {
    console.log('Employee ID from URL:', employeeId);
  }, [employeeId]);

  // Fetch employee data when mounted or when employeeId changes
  // Could wrap in a try block
  useEffect(() => {
    const fetchEmployeeData = async () => {
      // Send a GET request to the backend to get employee data
      const response = await fetch(`/employees/${employeeId}`);// Defaults to Get
      const data = await response.json();

      if (response.ok) {
        setEmployeeData(data); // From above
      } else {
        setError(data.error || 'Failed to fetch employee data.');
      }
    };

    // Call the function to get employee data
    if (employeeId) {
      fetchEmployeeData();
    }
  }, []);

  // To hold shift data
  const [shifts, setShifts] = useState([]);
  // Fetch shifts data when component mounts or employeeId changes
  useEffect(() => {
    const fetchShifts = async () => {
      const response = await fetch(`/employees/${employeeId}/shifts`);
      const data = await response.json();

      if (response.ok) {
        setShifts(data);
      } else {
        setError(data.error || 'Failed to fetch shifts data.');
      }
    };

    if (employeeId) {
      fetchShifts();
    }
  }, [employeeId]);

  useEffect(() => {
    // Set the next 5 dates for the dashboard
    setDashboardDates(getNextFiveDates());

    // Set the next 14 dates for the schedule view
    setScheduleDates(getNextTwoWeeks());
  }, []);

  const [activeSidebarView, setActiveSidebarView] = useState('home'); // Default to home
  const [activeTab, setActiveTab] = useState('dashboard'); // Default tab view for home

  // Function to change the active sidebar view
  const handleSidebarClick = (view) => {
    setActiveSidebarView(view);
    if (view !== 'home') setActiveTab('dashboard'); // Reset tab view if not on home
  };

  // Function to change the active tab in the home section
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  // Navigation
  const navigate = useNavigate();

  // Add logout handler function
  const handleLogout = () => {
    //TODO: Clear Auth Token

    // Redirect the user to the login page
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <Sidebar
          activeSidebarView={activeSidebarView}
          onSidebarClick={handleSidebarClick}
          onLogout={handleLogout}
        />
      </div>

      <div className="main-content">
        {/* Render based on the active sidebar view */}
        {activeSidebarView === 'home' && (
          <div>
            {/* Top Tab Navigations for Home */}
            <div className="tab-navigation">
              <button
                className={activeTab === 'dashboard' ? 'active-tab' : ''}// Applies activeTab based on click
                onClick={() => handleTabClick('dashboard')}
              >
                Dashboard
              </button>
              <button
                className={activeTab === 'schedule' ? 'active-tab' : ''}
                onClick={() => handleTabClick('schedule')}
              >
                Schedule
              </button>
              <button
                className={activeTab === 'timesheet' ? 'active-tab' : ''}
                onClick={() => handleTabClick('timesheet')}
              >
                Timesheet
              </button>
            </div>

            {/* Render based on the active Tab */}
            <div className="tab-content">
              {activeTab === 'dashboard' && (<DashboardTab shifts={shifts} dashboardDates={dashboardDates} />)}
              {activeTab === 'schedule' && (<ScheduleTab shifts={shifts} scheduleDates={scheduleDates} selectedDate={selectedDate} setSelectedDate={setSelectedDate} />)}
              {activeTab === 'timesheet' && (<TimesheetTab shifts={shifts} />)}
            </div>
          </div>
        )}
        
        {/* Render Content for Other Sidebar Views */}
        {activeSidebarView === 'profile' && ( <Profile employeeData={employeeData}/>)} 

        {activeSidebarView === 'request' && ( <Requests employeeID={employeeId} shifts={shifts} /> )}

        {activeSidebarView === 'punch' && ( <Punches shifts={shifts} />   )}    
      </div>
    </div>
  );
};

export default EmployeeDashboard;

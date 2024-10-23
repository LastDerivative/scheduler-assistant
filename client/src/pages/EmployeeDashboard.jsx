import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './EmployeeDashboard.css';
// Components
import Requests from './EmployeeDashboardComponents/EmployeeDashRequests';
import Punches from './EmployeeDashboardComponents/Punches';



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

const DashboardTab = ({ shifts, dashboardDates }) => {
  return (
    <div className="dashboard-tab-container">
      <div className="week-glance">
        <h1>Week At a Glance</h1>
        <p>Here’s an overview of your schedule for the next 5 days.</p>

        {/* Next 5 Days */}
        <div className="calendar-container">
          {dashboardDates.map((date) => (
            <div key={date} className="day-column">
              <h3>{date}</h3>
              {/* Filter and display shifts for the current date */}
              {shifts.filter((shift) => formatDate(new Date(shift.startTime)) === date) // Get shifts matching on date
                .map((shift) => (// An array of shifts filtered by the condition -> shiftDate matches week dates
                  <div key={shift._id} className="shift-card">
                    <p><strong></strong> {shift.shiftName}</p>
                  </div>
                ))}
              {/* If no shifts are available for the current date*/}
              {shifts.filter((shift) => shift.date === date).length === 0 && (
                <p></p>// Blank for now
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="team-contacts">
        <h1>Team Contacts</h1>
        <p>Team members' contact information:</p>
        <ul>
          <li>Joey Chestnut - j.chestnut@example.com</li>
          <li>Ray The Man - r.t.man@example.com</li>
        </ul>
      </div>
    </div>
  );
};

const ScheduleTab = ({ shifts, scheduleDates, selectedDate, setSelectedDate }) => {
  return (
    <div className="schedule-tab-container">
      <h1>Your Schedule</h1>
      <p>Here’s a 2-week view of your upcoming shifts. Click on a date to view details.</p>

      {/* 2-Week Calendar Layout */}
      <div className="calendar-container-2">
        {scheduleDates.map((date, index) => {
          const hasShift = shifts.some(shift => formatDate(new Date(shift.startTime)) === date);

          return (
            <div
              key={index}
              className={`day-column-2 ${hasShift ? 'shift-day-2' : ''} ${selectedDate === date ? 'selected-day-2' : ''}`}
              onClick={() => setSelectedDate(date)} // Set selected date on click
            >
              <h3>{date}</h3>
              {hasShift && <div className="shift-indicator-2">
                {shifts.filter(shift => formatDate(new Date(shift.startTime)) === date).map((shift) => (
                  <div key={shift._id}>
                    <p>{shift.siteID.siteName}</p>
                  </div>
                ))}
              </div>}
            </div>
          );
        })}
      </div>

      {/* Display Shift Details when a date is selected */}
      {selectedDate && (
        <div className="shift-details-2">
          <h2>Shift Details for {selectedDate}</h2>
          {shifts
            .filter(shift => formatDate(new Date(shift.startTime)) === selectedDate)
            .map((shift) => (
              <div key={shift._id} className="shift-card-2">
                <p><strong>Shift:</strong> {shift.shiftName}</p>
                <p><strong>Time:</strong> {new Date(shift.startTime).toLocaleTimeString()} - {new Date(shift.endTime).toLocaleTimeString()}</p>
                <p><strong>Location:</strong> {shift.siteID.siteName}</p>
              </div>
            ))}
          {shifts.filter(shift => formatDate(new Date(shift.startTime)) === selectedDate).length === 0 && <p>No shifts scheduled for this day.</p>}
        </div>
      )}
    </div>
  );
};


const TimesheetTab = ({ shifts }) => {
  const [payPeriod, setPayPeriod] = useState([]);

  useEffect(() => {
    // Group shifts by date for a two-week pay period
    const twoWeekPeriod = groupShiftsByDate(shifts);
    setPayPeriod(twoWeekPeriod);
  }, [shifts]);

  // Function to group shifts by date for the last two weeks
  const groupShiftsByDate = (shifts) => {
    const groupedShifts = {};
    const today = new Date();
    const twoWeeksAgo = new Date(today);
    twoWeeksAgo.setDate(today.getDate() - 13);
  
    shifts.forEach((shift) => {
      const shiftDate = formatDate(new Date(shift.startTime));
      if (new Date(shift.startTime) >= twoWeeksAgo && new Date(shift.startTime) <= today) {
        if (!groupedShifts[shiftDate]) {
          groupedShifts[shiftDate] = [];
        }
        groupedShifts[shiftDate].push(shift);
      }
    });
  
    // Convert groupedShifts into an array of [date, shifts] pairs
    const groupedEntries = Object.entries(groupedShifts);

    // Sort the entries by descending date using a callback
    groupedEntries.sort( (a, b) => new Date(b[0]) - new Date(a[0]) ); // Calculate difference in dates
    // If b is "greater" i.e it is later in time, the callback is positive.
    // Thus will place b before a
    // If negative, then a is greater and will be placed before b

    // Map the sorted entries to be displayed -> date , shifts
    const sortedGroupedShifts = groupedEntries.map(([date, shifts]) => ({ date, shifts }));

    return sortedGroupedShifts;
  };

 
  /* 
  Reduce syntax:
  array.reduce((accumulatesResultOverIterations, currentValue) => {
    // Logic
  }, initialValue);
  */

  // Where payPeriod is an array containing each date and shift
  const totalHoursWorked = payPeriod.reduce((total, { shifts }) => {// Using destructuring on shifts
    // Would have to do const shifts = current.shifts; if not using destructuring
    return total + shifts.reduce((sum, shift) => {
      const start = new Date(shift.startTime);
      const end = new Date(shift.endTime);
      return sum + (end - start) / (1000 * 60 * 60);
    }, 0);

  }, 0);

  return (
    <div className="timesheet-tab">
      <h2>Timesheet for the Last Two Weeks</h2>
      {payPeriod.length === 0 ? (
        <p>No hours worked during this pay period.</p>
      ) : (
        <>
          <table className="timesheet-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Hours Worked</th>
              </tr>
            </thead>
            <tbody>
              {payPeriod.map(({ date, shifts }) => {
                const totalHours = shifts.reduce((sum, shift) => {
                  const start = new Date(shift.startTime);
                  const end = new Date(shift.endTime);
                  return sum + (end - start) / (1000 * 60 * 60);
                }, 0);
                return (
                  <tr key={date}>
                    <td>{date}</td>
                    <td>{totalHours.toFixed(2)} hours</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
            <div className="total-hours">
                <h3>Total Hours Worked: {totalHoursWorked.toFixed(2)} hours</h3>
              </div>
        </>
      )}
    </div>
  );
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
    navigate('/home');
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <ul>
          <li onClick={() => handleSidebarClick('home')}>Home</li>
          <li onClick={() => handleSidebarClick('profile')}>Profile</li>
          <li onClick={() => handleSidebarClick('request')}>Request</li>
          <li onClick={() => handleSidebarClick('punch')}>ClockIn/Out</li>
          <li onClick={handleLogout}>Logout</li>
        </ul>
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
        {activeSidebarView === 'profile' && (
          <div>
            <h1>Your Profile Information</h1>
            <p>Name: {employeeData.name}</p>
            <p>Email: {employeeData.email}</p>
            <p>Phone Number: {employeeData.phoneNumber}</p>
          </div>
        )} 

        {activeSidebarView === 'request' && ( <Requests shifts={shifts} /> )}

        {activeSidebarView === 'punch' && ( <Punches shifts={shifts} />   )}    
      </div>
    </div>
  );
};

export default EmployeeDashboard;

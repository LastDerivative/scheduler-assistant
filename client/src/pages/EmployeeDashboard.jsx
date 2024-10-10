import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './EmployeeDashboard.css';


// Format date as "Month Day, Year"
const formatDate = (date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Intl.DateTimeFormat('en-US', options).format(date);
};

// Calculate the next 5 dates from today
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

// Calculate the next 14 dates from today
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

const EmployeeDashboard = () => {
  // Use state to store employee and shift data
  /*const [employeeData, setEmployeeData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    department: 'Engineering',
    phoneNumber: '123-456-7890',
  });*/

  // State to store employee data from backend
  const [employeeData, setEmployeeData] = useState(null);
  const [error, setError] = useState(null);

  // Get employeeId from the URL parameter
  const { employeeId } = useParams();

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


  // State to hold dummy data
  const [shifts, setShifts] = useState([
    { _id: '1', date: 'October 7, 2024', startTime: '9:00 AM', endTime: '5:00 PM', location: 'Office', role: 'Developer' },
    { _id: '2', date: 'October 9, 2024', startTime: '10:00 AM', endTime: '6:00 PM', location: 'Remote', role: 'Designer' },
    { _id: '3', date: 'October 11, 2024', startTime: '8:00 AM', endTime: '4:00 PM', location: 'Office', role: 'Manager' },
  ]);


  // State to hold dates
  const [dashboardDates, setDashboardDates] = useState([]);
  const [scheduleDates, setScheduleDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null); // Track the selected date in the schedule tab


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

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <ul>
          <li onClick={() => handleSidebarClick('home')}>Home</li>
          <li onClick={() => handleSidebarClick('profile')}>Profile</li>
          <li onClick={() => handleSidebarClick('settings')}>Settings</li>
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
              {activeTab === 'dashboard' && (
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
                          {shifts.filter((shift) => shift.date === date) // Get shifts matching on date
                            .map((shift) => (
                              <div key={shift._id} className="shift-card">
                                <p><strong>Location:</strong> {shift.location}</p>
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
              )}
              {activeTab === 'schedule' && (
                <div className="schedule-tab-container">
                  <h1>Your Schedule</h1>
                  <p>Here’s a 2-week view of your upcoming shifts. Click on a date to view details.</p>

                  {/* 2-Week Calendar Layout */}
                  <div className="calendar-container-2">
                    {scheduleDates.map((date, index) => {
                      const hasShift = shifts.some(shift => shift.date === date);

                      return (
                        <div
                          key={index}
                          className={`day-column-2 ${hasShift ? 'shift-day-2' : ''} ${selectedDate === date ? 'selected-day-2' : ''}`}
                          onClick={() => setSelectedDate(date)} // Set selected date on click
                        >
                          <h3>{date}</h3>
                          {hasShift && <div className="shift-indicator-2">
                            {shifts.filter(shift => shift.date === date).map((shift) => (
                          <div key={shift._id}>
                            <p><strong>Location:</strong> {shift.location}</p>
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
                        .filter(shift => shift.date === selectedDate)
                        .map((shift) => (
                          <div key={shift._id} className="shift-card-2">
                            <p><strong>Time:</strong> {shift.startTime} - {shift.endTime}</p>
                            <p><strong>Location:</strong> {shift.location}</p>
                            <p><strong>Role:</strong> {shift.role}</p>
                          </div>
                        ))}
                      {shifts.filter(shift => shift.date === selectedDate).length === 0 && <p>No shifts scheduled for this day.</p>}
                    </div>
                  )}
                </div>
              )}
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

        {activeSidebarView === 'settings' && (
          <div>
            <h1>Settings</h1>
            <p>Manage your settings and preferences here.</p>
          </div>
        )}
      </div>
    </div>
  );
};


export default EmployeeDashboard;

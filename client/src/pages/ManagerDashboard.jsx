import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ManagerDashboard.css';
import MonthlyCalendar from '../components/MonthlyCalendar.jsx';
import Timesheet from "../components/Timesheet.jsx";

// Displays how many employees will be working on a given day
const getHeadCount = () => {
    const [count, setCount] = useState(0);
    return count;
}


const DashboardTab = () => {
    return (
        <div className="dashboard-tab-container">

        </div>
    );
};


const ScheduleTab = () => {
    return (
        <div className="schedule-tab-container">
            <MonthlyCalendar />
        </div>
    );
};

const TimesheetTab = () => {
    return (
        <div className="timesheet-tab">
            <Timesheet />
        </div>
    );
};

const ManagerDashboard = () => {
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
                            {activeTab === 'dashboard' && (<DashboardTab />)}
                            {activeTab === 'schedule' && (<ScheduleTab />)}
                            {activeTab === 'timesheet' && (<TimesheetTab />)}
                        </div>
                    </div>
                )}

                {/* Render Content for Other Sidebar Views */}
                {activeSidebarView === 'profile' && (
                    <div>
                        <h1>Your Profile Information</h1>

                        <div className="profile-content">
                            <img src="../profile-pic-100.png" alt="Avatar" className="avatar" />
                            <p>Name: John Smith</p>
                            <p>Email: john.smith@business.com</p>
                            <p>Phone Number: 1.800.324.6789</p>
                        </div>
                    </div>
                )}

                {activeSidebarView === 'request' && ( <Requests shifts={shifts} /> )}

            </div>
        </div>
    );
};

export default ManagerDashboard;
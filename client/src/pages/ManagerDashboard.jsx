import React from 'react';
import { Link } from 'react-router-dom';
import './ManagerDashboard.css';
import '../components/Calendar.jsx';
import Calendar from "../components/Calendar.jsx";
import MonthlyCalendar from "../components/MonthlyCalendar.jsx";

// Dashboard
const DashboardTab = () => {
    return (
        <div>Dashboard</div>
    )
};

// Schedule
const ScheduleTab = () => {
    return (
        <div>Schedule</div>
    )
};

// Timesheet
const TimesheetTab = () => {
    return (
        <div>Timesheet</div>
    )
};

const ManagerDashboard = () => {
    return (
        <>
            <div className="sidebar">
                <ul>
                    <li>
                        <img src="../public/manager-color-96.png"/>
                    </li>
                    <li>Home</li>
                    <li>Requests</li>
                    <li>Contact</li>
                </ul>
            </div>
            <div className="main-content">
                <div>Manager</div>
                <div className="tab-navigation">
                    <button>Dashboard</button>
                    <button>Schedule</button>
                    <button>Timesheet</button>
                </div>

                <div className="dashboard-tab-container">
                    <p>Calendar for today...</p>
                </div>
                <div className="schedule-tab-container">
                    <MonthlyCalendar />
                </div>
            </div>
        </>
    )
};

export default ManagerDashboard;
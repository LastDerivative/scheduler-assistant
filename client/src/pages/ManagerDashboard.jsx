import React, {useState} from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import './ManagerDashboard.css';
import '../components/Calendar.jsx';
import Calendar from "../components/Calendar.jsx";
import MonthlyCalendar from "../components/MonthlyCalendar.jsx";

// Switching between dashboard tabs
const [activeTab, setActiveTab] = useState('dashboard');
const handleTabClick = (tab) => {
    setActiveTab(tab);
};

// Dashboard
const DashboardTab = () => {
    return (
        <div>Dashboard</div>
    );
};

// Schedule
const ScheduleTab = () => {
    return (
        <div>Schedule</div>
    );
};

// Timesheet
const TimesheetTab = () => {
    return (
        <div>Timesheet</div>
    );
};

const ManagerDashboard = () => {
  // Switching between the active sidebar views
  const [activeSidebarView, setActiveSidebarView] = useState('home');
  const handleSidebarClick = (view) => {
    setActiveSidebarView(view);
    if (view !== 'home') setActiveTab('dashboard'); // Reset tab view if not on home
  };


    // Switching between dashboard tabs
    const [activeTab, setActiveTab] = useState('dashboard');
    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };
    const navigate = useNavigate();

    return (
        <>
            <div className="sidebar">
                <ul>
                    <li>
                        <img src="../public/manager-color-96.png"/>
                    </li>
                    <li onClick={() => handleSidebarClick('home')}>Home</li>
                    <li>Requests</li>
                    <li>Contact</li>
                </ul>
            </div>

            <div className="main-content">
                <div>Manager</div>

                <div className="tab-navigation">
                    <button className={activeTab === 'dashboard' ? 'active-tab' : ''}
                            onClick={() => handleTabClick('dashboard')}>Dashboard</button>
                    <button className={activeTab === 'schedule' ? 'active-tab' : ''}
                            onClick={() => handleTabClick('schedule')}>Schedule</button>
                    <button className={activeTab === 'timesheet' ? 'active-tab' : ''}
                            onClick={() => handleTabClick('timesheet')}>Timesheet</button>
                </div>

                <div className="active-tab">
                    {activeTab === 'dashboard' && (<DashboardTab />)}
                    {activeTab === 'schedule' && (<ScheduleTab />)}
                    {activeTab === 'timesheet' && (<TimesheetTab />)}
                </div>

                <div className="dashboard-tab-container">
                    <p>Dashboard tab</p>
                </div>
                <div className="schedule-tab-container">
                    <MonthlyCalendar />
                </div>
                <div className="timesheet-tab-container">
                    <p>Timesheet tab</p>
                </div>
            </div>
        </>
    )
};

export default ManagerDashboard;
// You shall not pass!
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';




const isTokenValid = (token) => {
    try {
        const decoded = jwtDecode(token);

        const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
        return decoded.exp > currentTime; // Check if token is expired
    } catch (err) {
        console.error('Token validation error:', err);
        return false; // Token is invalid
    }
};

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('authToken'); // Retrieve the token
    const location = useLocation(); // Get the current route
    const decoded = token ? jwtDecode(token) : null; // Decode token to get user data

    if (!token || !isTokenValid(token)) {
        return <Navigate to="/sign-in" replace />; // Redirect to login if not authenticated
    }

    // Extract the employee ID from the URL
    const pathParts = location.pathname.split('/'); // e.g., "/dashboard/:id" or "/dashboard/manager/:id"
    const employeeIdInURL = pathParts[pathParts.length - 1]; // Employee ID is always the last part of the path

    // Ensure the logged-in user is only accessing their own dashboard
    if (decoded.id !== employeeIdInURL) {
        console.warn('Unauthorized access attempt detected.');
        return <Navigate to="/sign-in" replace />;
    }

    return children; // Render the protected component if authenticated
};

export default ProtectedRoute;

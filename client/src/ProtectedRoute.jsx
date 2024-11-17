// You shall not pass!
import React from 'react';
import { Navigate } from 'react-router-dom';
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

    if (!token || !isTokenValid(token)) {
        return <Navigate to="/sign-in" replace />; // Redirect to login if not authenticated
    }

    return children; // Render the protected component if authenticated
};

export default ProtectedRoute;

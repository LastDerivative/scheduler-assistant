import React from 'react';
import { useNavigate } from 'react-router-dom';

function SignOut() {
    const navigate = useNavigate();

    React.useEffect(() => {
        // Clear Auth Token and EmployeeID
        localStorage.removeItem('authToken');
        localStorage.removeItem('employeeId');

        // Redirect to the login page
        navigate('/sign-in');
    }, [navigate]);

    return null; // Component doesn't need to render anything
}

export default SignOut;

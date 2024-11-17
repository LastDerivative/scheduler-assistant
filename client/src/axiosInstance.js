import axios from 'axios';

// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: 'http://localhost:5173',
});

// Add a request interceptor to include the token in all requests
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken'); // Retrieve token from localStorage
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`; // Add token to headers
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle errors globally
axiosInstance.interceptors.response.use(
    (response) => response, // If the response is successful, return it
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            // Redirect to login if unauthorized
            console.error('Unauthorized: Redirecting to login');
            window.location.href = '/sign-in';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;

import axios from 'axios';

const apiClient = axios.create({
    baseURL: '[http://127.0.0.1:8000/api](http://127.0.0.1:8000/api)',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Attach Token
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response Interceptor: Unwrap Responses & Format Errors
apiClient.interceptors.response.use(
    (response) => {
        if (response.data.success) {
            return response.data.data;
        }
        return response.data;
    },
    (error) => {
        let message = "An unexpected error occurred";
        
        // Check if the backend sent a structured error
        if (error.response?.data?.error) {
            const errData = error.response.data.error;
            
            if (typeof errData === 'string') {
                message = errData;
            } else if (typeof errData === 'object') {
                // Flatten Django's {"field": ["error"]} format into a single string
                // Example: "email: Enter a valid email address."
                const messages = Object.entries(errData).map(([key, val]) => {
                    const valStr = Array.isArray(val) ? val.join(' ') : String(val);
                    return `${key}: ${valStr}`;
                });
                message = messages.join(' | ');
            }
        }
        
        // Reject with the formatted string so the Component can just display it
        return Promise.reject(message);
    }
);

export default apiClient;

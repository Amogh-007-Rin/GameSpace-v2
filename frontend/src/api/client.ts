import axios from 'axios';

const apiClient = axios.create({
    // FIXED: Removed Markdown brackets []() from the string
    baseURL: 'http://127.0.0.1:8000/api',
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
        // Handle 401 Unauthorized (Invalid Token)
        if (error.response && error.response.status === 401) {
            // Only redirect if we actually had a token (to avoid loops if public endpoints return 401 for some reason)
            if (localStorage.getItem('access_token')) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('user_data');
                window.location.href = '/login';
            }
            return Promise.reject("Session expired. Please login again.");
        }

        let message = "An unexpected error occurred";
        
        // Check if the backend sent a structured error
        if (error.response?.data?.error) {
            const errData = error.response.data.error;
            
            if (typeof errData === 'string') {
                message = errData;
            } else if (typeof errData === 'object') {
                const messages = Object.entries(errData).map(([key, val]) => {
                    const valStr = Array.isArray(val) ? val.join(' ') : String(val);
                    return `${key}: ${valStr}`;
                });
                message = messages.join(' | ');
            }
        }
        
        return Promise.reject(message);
    }
);

export default apiClient;
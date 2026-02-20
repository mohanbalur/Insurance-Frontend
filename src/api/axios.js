import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1';

const axiosInstance = axios.create({
    baseURL: API_URL,
});

// Request Interceptor: Attach Bearer Token
axiosInstance.interceptors.request.use(
    (config) => {
        // Let browser/Axios set multipart boundaries for file uploads.
        if (typeof FormData !== 'undefined' && config.data instanceof FormData && config.headers) {
            delete config.headers['Content-Type'];
        }

        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Handle Token Refresh
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 and not already retrying
        if (error.response?.status === 401 && !originalRequest._retry) {
            console.log('401 detected, attempting token refresh...');
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (!refreshToken) {
                    console.log('No refresh token found, logging out...');
                    throw new Error('No refresh token available');
                }

                const response = await axios.post(`${API_URL}/auth/refresh`, {
                    refreshToken,
                });

                const { accessToken, refreshToken: newRefreshToken } = response.data.data;
                console.log('Token refreshed successfully');

                localStorage.setItem('accessToken', accessToken);
                if (newRefreshToken) {
                    localStorage.setItem('refreshToken', newRefreshToken);
                }

                // Update auth header and retry original request
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                console.error('Refresh failed or no token, perform logout', refreshError.message);
                // Refresh failed: Logout
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('user');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;

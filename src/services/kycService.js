import axiosInstance from '../api/axios';

const API_URL = '/users/kyc';

// Get current KYC status
export const getKYCStatus = async () => {
    const response = await axiosInstance.get(`${API_URL}/status`);
    return response.data;
};

// Submit KYC documents and data
export const submitKYC = async (formData) => {
    const response = await axiosInstance.post(`${API_URL}/submit`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

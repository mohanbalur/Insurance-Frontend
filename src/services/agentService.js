import axiosInstance from '../api/axios';

const agentService = {
    getDashboard: async () => {
        const response = await axiosInstance.get('/agents/dashboard');
        return response.data;
    }
};

export default agentService;

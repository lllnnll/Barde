import api from './api';

export const spotifyService = {
    getAuthUrl: async () => {
        const response = await api.get('/spotify/login');
        return response.data.url;
    },

    getStatus: async () => {
        const response = await api.get('/spotify/status');
        return response.data;
    }
};

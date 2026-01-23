import api from './api';

export const authService = {
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    return user;
  },

  async register(email, password, name) {
    const response = await api.post('/auth/register', { email, password, name });
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    return user;
  },

  async logout() {
    localStorage.removeItem('token');
  },

  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  },
};

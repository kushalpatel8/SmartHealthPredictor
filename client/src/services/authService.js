const API_URL = 'http://localhost:8000/api/auth';

export const authService = {
    login: async (email, password) => {
        // Placeholder for real fetch
        return { token: 'fake-jwt-token', user: { id: 1, email } };
    },
    
    register: async (userData) => {
        // Placeholder
        return { success: true };
    },

    logout: () => {
        localStorage.removeItem('token');
    }
};

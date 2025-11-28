import { db } from './mockDB.js';

const TOKEN_KEY = '24frames_token';
const USER_KEY = '24frames_user';

export const authService = {
    async login(username, password) {
        try {
            const { user, token } = await db.login(username, password);
            localStorage.setItem(TOKEN_KEY, token);
            localStorage.setItem(USER_KEY, JSON.stringify(user));
            return user;
        } catch (error) {
            throw error;
        }
    },

    async signup(username, password) {
        try {
            const user = await db.signup(username, password);
            // Auto-login after signup
            return this.login(username, password);
        } catch (error) {
            throw error;
        }
    },

    logout() {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        window.location.reload(); // Simple way to reset state
    },

    getCurrentUser() {
        const userStr = localStorage.getItem(USER_KEY);
        return userStr ? JSON.parse(userStr) : null;
    },

    isAuthenticated() {
        return !!localStorage.getItem(TOKEN_KEY);
    }
};

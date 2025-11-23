// Mock Database Service
// Simulates async database operations with a delay

const DELAY_MS = 500;

// Initial Mock Data
const INITIAL_DATA = {
    users: [
        { id: 'user_1', name: 'Demo User', email: 'demo@24frames.com' }
    ],
    reviews: {
        // movieId: [reviews]
    },
    watchlist: {
        // userId: [movieIds]
        'user_1': []
    }
};

// Load from localStorage or initialize
function loadDB() {
    const stored = localStorage.getItem('24frames_db');
    return stored ? JSON.parse(stored) : INITIAL_DATA;
}

function saveDB(data) {
    localStorage.setItem('24frames_db', JSON.stringify(data));
}

// Helper to simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const db = {
    // User Operations
    async getUser(userId) {
        await delay(DELAY_MS);
        const data = loadDB();
        return data.users.find(u => u.id === userId);
    },

    // Watchlist Operations
    async addToWatchlist(userId, movie) {
        await delay(DELAY_MS);
        const data = loadDB();
        if (!data.watchlist[userId]) data.watchlist[userId] = [];

        if (!data.watchlist[userId].find(m => m.id === movie.id)) {
            data.watchlist[userId].push(movie);
            saveDB(data);
            return true;
        }
        return false;
    },

    async getWatchlist(userId) {
        await delay(DELAY_MS);
        const data = loadDB();
        return data.watchlist[userId] || [];
    },

    async removeFromWatchlist(userId, movieId) {
        await delay(DELAY_MS);
        const data = loadDB();
        if (data.watchlist[userId]) {
            data.watchlist[userId] = data.watchlist[userId].filter(m => m.id != movieId);
            saveDB(data);
            return true;
        }
        return false;
    },

    // Review Operations
    async addReview(movieId, review) {
        await delay(DELAY_MS);
        const data = loadDB();
        if (!data.reviews[movieId]) data.reviews[movieId] = [];

        const newReview = {
            id: Date.now(),
            ...review,
            date: new Date().toLocaleDateString()
        };

        data.reviews[movieId].push(newReview);
        saveDB(data);
        return newReview;
    },

    async getReviews(movieId) {
        await delay(DELAY_MS);
        const data = loadDB();
        return data.reviews[movieId] || [];
    }
};

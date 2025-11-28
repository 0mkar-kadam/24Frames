// Mock Database Service
// Simulates async database operations with a delay

const DELAY_MS = 500;

// Centralized data store, loaded from localStorage on initialization
const data = {
    users: JSON.parse(localStorage.getItem('24frames_users')) || [
        { id: 'user_1', username: 'demo', password: 'password', joinedDate: new Date().toISOString(), directorDNA: { Nolan: 10, Tarantino: 10 } }
    ],
    watchlist: JSON.parse(localStorage.getItem('24frames_watchlist')) || {}, // Key: userId, Value: Array of movies
    reviews: JSON.parse(localStorage.getItem('24frames_reviews')) || {} // Key: movieId, Value: Array of reviews
};

// Helper to save to local storage
function saveDB() {
    localStorage.setItem('24frames_users', JSON.stringify(data.users));
    localStorage.setItem('24frames_watchlist', JSON.stringify(data.watchlist));
    localStorage.setItem('24frames_reviews', JSON.stringify(data.reviews));
}

// Helper to simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const db = {
    // --- Auth ---
    async signup(username, password) {
        await delay(DELAY_MS);
        const existingUser = data.users.find(u => u.username === username);
        if (existingUser) {
            throw new Error('Username already taken.');
        }

        const newUser = {
            id: 'user_' + Date.now(),
            username,
            password, // In a real app, hash this!
            joinedDate: new Date().toISOString(),
            directorDNA: { Nolan: 10, Tarantino: 10 } // Default DNA
        };

        data.users.push(newUser);
        saveDB();

        // Return user without password
        const { password: _, ...userWithoutPassword } = newUser;
        return userWithoutPassword;
    },

    async login(username, password) {
        await delay(DELAY_MS);
        const user = data.users.find(u => u.username === username && u.password === password);
        if (!user) {
            throw new Error('Invalid credentials.');
        }

        const { password: _, ...userWithoutPassword } = user;
        return {
            user: userWithoutPassword,
            token: 'mock_jwt_' + Date.now() // Simulate a token
        };
    },

    async getUser(userId) {
        await delay(DELAY_MS);
        const user = data.users.find(u => u.id === userId);
        return user ? { ...user, password: undefined } : null;
    },

    // --- Watchlist ---
    async addToWatchlist(userId, movie) {
        await delay(DELAY_MS);
        if (!data.watchlist[userId]) {
            data.watchlist[userId] = [];
        }

        // Check if already in watchlist
        if (!data.watchlist[userId].find(m => m.id === movie.id)) {
            data.watchlist[userId].push(movie);
            saveDB();
        }
        return true;
    },

    async getWatchlist(userId) {
        await delay(DELAY_MS);
        return data.watchlist[userId] || [];
    },

    async removeFromWatchlist(userId, movieId) {
        await delay(DELAY_MS);
        if (data.watchlist[userId]) {
            data.watchlist[userId] = data.watchlist[userId].filter(m => m.id !== movieId);
            saveDB();
        }
        return true;
    },

    // --- Reviews ---
    async addReview(movieId, review) {
        await delay(DELAY_MS);
        if (!data.reviews[movieId]) {
            data.reviews[movieId] = [];
        }

        const newReview = {
            id: 'review_' + Date.now(),
            ...review,
            date: new Date().toISOString()
        };

        data.reviews[movieId].unshift(newReview); // Add to top
        saveDB();
        return newReview;
    },

    async getReviews(movieId) {
        await delay(DELAY_MS);
        return data.reviews[movieId] || [];
    }
};

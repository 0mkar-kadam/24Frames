import { db } from './mockDB.js';

// We'll use a hardcoded user ID for this demo
const CURRENT_USER_ID = 'user_1';

export async function addToWatchlist(movie) {
    return await db.addToWatchlist(CURRENT_USER_ID, movie);
}

export async function removeFromWatchlist(movieId) {
    return await db.removeFromWatchlist(CURRENT_USER_ID, movieId);
}

export async function getWatchlist() {
    return await db.getWatchlist(CURRENT_USER_ID);
}

export async function isInWatchlist(movieId) {
    const list = await getWatchlist();
    return list.some(m => m.id == movieId);
}

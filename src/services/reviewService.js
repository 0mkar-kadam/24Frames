import { db } from './mockDB.js';

export async function getReviews(movieId) {
    return await db.getReviews(movieId);
}

export async function addReview(movieId, review) {
    return await db.addReview(movieId, review);
}

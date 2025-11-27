import { fetchMoviesByGenre } from './tmdb.js';

// Simple keyword mapping to simulate "AI" understanding
// In a real app, this would call an LLM API (OpenAI/Gemini)
const KEYWORD_MAP = {
    'sad': [18, 10749], // Drama, Romance
    'cry': [18, 10749],
    'depressed': [18],
    'happy': [35, 12], // Comedy, Adventure
    'laugh': [35],
    'funny': [35],
    'excited': [28, 878], // Action, Sci-Fi
    'action': [28],
    'thrill': [53, 27], // Thriller, Horror
    'scary': [27],
    'fear': [27],
    'love': [10749],
    'romance': [10749],
    'learn': [99], // Documentary
    'fact': [99],
    'music': [10402],
    'dance': [10402],
    'family': [10751],
    'kid': [10751],
    'animation': [16]
};

export async function analyzeMoodAndFetchMovies(text) {
    const lowerText = text.toLowerCase();
    let matchedGenres = new Set();
    let detectedMood = 'neutral';

    // 1. Check for keywords
    for (const [key, genres] of Object.entries(KEYWORD_MAP)) {
        if (lowerText.includes(key)) {
            genres.forEach(g => matchedGenres.add(g));

            // Map keyword to mood state for background
            if (['sad', 'cry', 'depressed', 'lonely'].some(k => key.includes(k))) detectedMood = 'sad';
            else if (['happy', 'laugh', 'funny', 'joy'].some(k => key.includes(k))) detectedMood = 'happy';
            else if (['excited', 'action', 'thrill', 'fast'].some(k => key.includes(k))) detectedMood = 'excited';
            else if (['angry', 'mad', 'furious'].some(k => key.includes(k))) detectedMood = 'angry';
            else if (['relax', 'chill', 'calm', 'peace'].some(k => key.includes(k))) detectedMood = 'relaxed';
            else if (['scary', 'fear', 'horror'].some(k => key.includes(k))) detectedMood = 'scared';
            else if (['love', 'romance', 'date'].some(k => key.includes(k))) detectedMood = 'romantic';
            else if (['learn', 'fact', 'think'].some(k => key.includes(k))) detectedMood = 'thoughtful';
        }
    }

    // 2. Fallback or "AI" logic
    if (matchedGenres.size === 0) {
        // If no keywords found, maybe just return a random popular genre or a default
        // For this demo, let's default to "Drama" (18) if input is vague, or return null
        console.log('AI: No direct keywords found. Defaulting to Drama.');
        matchedGenres.add(18);
        detectedMood = 'neutral';
    }

    // 3. Fetch movies for the identified genres
    // We'll pick the first matched genre to keep it simple for the API call
    const genreId = Array.from(matchedGenres)[0];
    const movies = await fetchMoviesByGenre(genreId);

    return { movies, mood: detectedMood };
}

// Stub for future LLM integration
export async function callLLM(prompt) {
    console.log('Calling LLM with prompt:', prompt);
    // TODO: Implement actual API call to OpenAI/Gemini
    // Return format: { genres: [id1, id2], mood: 'happy', reasoning: '...' }
    return null;
}

const API_KEY = import.meta.env.VITE_TMDB_API_KEY || 'YOUR_TMDB_API_KEY';
const BASE_URL = 'https://api.themoviedb.org/3';

export async function fetchMoviesByGenre(genreId, page = 1) {
    // Mock response for now if no key
    if (API_KEY === 'YOUR_TMDB_API_KEY') {
        console.warn('No API Key provided. Returning mock data.');
        return [];
    }
    try {
        const response = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&sort_by=popularity.desc&page=${page}`);
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('Error fetching movies:', error);
        console.log('API Key Status:', API_KEY === 'YOUR_TMDB_API_KEY' ? 'Placeholder' : 'Set');
        return [];
    }
}

export async function searchMovies(query) {
    if (API_KEY === 'YOUR_TMDB_API_KEY') {
        console.warn('No API Key provided. Returning mock data.');
        return [];
    }
    try {
        const response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&include_adult=false`);
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('Error searching movies:', error);
        return [];
    }
}

export async function fetchRandomMovie() {
    if (API_KEY === 'YOUR_TMDB_API_KEY') {
        console.warn('No API Key provided. Returning mock data.');
        return null;
    }
    try {
        // Get a random page (1-500 is usually safe for popular)
        const randomPage = Math.floor(Math.random() * 50) + 1;
        const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=${randomPage}`);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            const randomIndex = Math.floor(Math.random() * data.results.length);
            return data.results[randomIndex];
        }
        return null;
    } catch (error) {
        console.error('Error fetching random movie:', error);
        return null;
    }
}

export async function fetchMovieDetails(movieId) {
    if (API_KEY === 'YOUR_TMDB_API_KEY') return null;

    try {
        const response = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=credits,videos,external_ids`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching movie details:', error);
        return null;
    }
}

export async function fetchWatchProviders(movieId) {
    if (API_KEY === 'YOUR_TMDB_API_KEY') return null;

    try {
        const response = await fetch(`${BASE_URL}/movie/${movieId}/watch/providers?api_key=${API_KEY}`);
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('Error fetching watch providers:', error);
        return null;
    }
}

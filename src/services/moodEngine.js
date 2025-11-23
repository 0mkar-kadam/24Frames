export const MOOD_GENRE_MAP = {
    'happy': [35, 12], // Comedy, Adventure
    'sad': [18, 10749], // Drama, Romance
    'excited': [28, 878], // Action, Sci-Fi
    'angry': [80, 53], // Crime, Thriller
    'relaxed': [99, 10402], // Documentary, Music
    'scared': [27, 9648], // Horror, Mystery
    'romantic': [10749, 35], // Romance, Comedy
    'thoughtful': [18, 99] // Drama, Documentary
};

export function getGenresForMood(moodId) {
    return MOOD_GENRE_MAP[moodId] || [];
}

export const GENRES = {
    28: "Action",
    12: "Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
    14: "Fantasy",
    36: "History",
    27: "Horror",
    10402: "Music",
    9648: "Mystery",
    10749: "Romance",
    878: "Science Fiction",
    10770: "TV Movie",
    53: "Thriller",
    10752: "War",
    37: "Western"
};

export function getGenreName(id) {
    return GENRES[id] || "Unknown";
}

export function getGenresList(ids) {
    if (!ids || !ids.length) return "";
    return ids.map(id => GENRES[id]).filter(Boolean).slice(0, 2).join(" | ");
}

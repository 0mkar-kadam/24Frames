export function MovieCard(movie) {
  const posterPath = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Poster';

  return `
    <div class="movie-card" data-id="${movie.id}">
      <div class="card-overlay">
        <button class="watchlist-btn-mini" data-id="${movie.id}" title="Add to Watchlist">❤️</button>
      </div>
      <img src="${posterPath}" alt="${movie.title}" loading="lazy">
      <div class="movie-info">
        <h3>${movie.title}</h3>
        <span class="rating">⭐ ${movie.vote_average.toFixed(1)}</span>
      </div>
    </div>
  `;
}

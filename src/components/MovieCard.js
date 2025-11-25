export function MovieCard(movie) {
  const posterPath = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Poster';

  return `
    <div class="movie-card" data-id="${movie.id}">
      <img src="${posterPath}" alt="${movie.title}" loading="lazy">
      <div class="movie-info">
        <h3>${movie.title.toUpperCase()}</h3>
        <span class="rating">${movie.vote_average.toFixed(1)} / 10</span>
      </div>
    </div>
  `;
}

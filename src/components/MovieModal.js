export function MovieModal(movie, reviews = []) {
  const posterPath = movie.poster_path
    ? `https://image.tmdb.org/t/p/w780${movie.poster_path}`
    : 'https://via.placeholder.com/780x1170?text=No+Poster';

  const genres = movie.genres ? movie.genres.map(g => g.name).join(', ') : 'Unknown';
  const director = movie.credits?.crew.find(c => c.job === 'Director')?.name || 'Unknown';
  const cast = movie.credits?.cast.slice(0, 5).map(c => c.name).join(', ') || 'Unknown';
  const trailer = movie.videos?.results.find(v => v.type === 'Trailer')?.key;

  const reviewsHtml = reviews.length > 0
    ? reviews.map(r => `
        <div class="review-item">
          <div class="review-header">
            <span class="review-rating">⭐ ${r.rating}/10</span>
            <span class="review-date">${r.date}</span>
          </div>
          <p class="review-text">${r.text}</p>
        </div>
      `).join('')
    : '<p class="no-reviews">No reviews yet. Be the first!</p>';

  return `
    <div id="movie-modal" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-background" style="background-image: url('https://image.tmdb.org/t/p/w1280${movie.backdrop_path || movie.poster_path}')"></div>
        <button class="close-modal">&times;</button>
        
        <div class="modal-header" style="background-image: linear-gradient(to bottom, rgba(0,0,0,0.1), #0a0a0a), url('https://image.tmdb.org/t/p/original${movie.backdrop_path || movie.poster_path}')">
          <div class="modal-title-content">
            <h2>${movie.title} <span class="year">(${new Date(movie.release_date).getFullYear()})</span></h2>
            <div class="modal-ratings">
              <span class="rating">TMDB: ${movie.vote_average.toFixed(1)}</span>
              <span class="genres">${genres}</span>
            </div>
          </div>
        </div>

        <div class="modal-body">
          <div class="modal-info">
            <p class="tagline">${movie.tagline || ''}</p>
            <p class="overview">${movie.overview}</p>
            
            <div class="credits">
              <p><strong>Director:</strong> ${director}</p>
              <p><strong>Cast:</strong> ${cast}</p>
            </div>

            <div class="modal-actions">
              <button class="add-to-watchlist-btn" data-id="${movie.id}">
                Add to Watchlist
              </button>
              ${movie.imdb_id ? `<a href="https://www.imdb.com/title/${movie.imdb_id}" target="_blank" class="imdb-link">View on IMDb</a>` : ''}
            </div>

            ${trailer ? `
              <div class="trailer-container">
                <h3>Trailer</h3>
                <iframe src="https://www.youtube.com/embed/${trailer}" frameborder="0" allowfullscreen></iframe>
              </div>
            ` : ''}

            <div class="reviews-section">
              <h3>User Reviews</h3>
              <div class="reviews-list">
                ${reviewsHtml}
              </div>
              
              <form id="review-form" data-id="${movie.id}">
                <h4>Write a Review</h4>
                <div class="rating-input">
                  <label>Rating:</label>
                  <select id="review-rating" required>
                    <option value="10">10 - Absolute Cinema</option>
                    <option value="9">9 - Royale with Cheese</option>
                    <option value="8">8 - Shiny and Chrome</option>
                    <option value="7">7 - Groovy</option>
                    <option value="6">6 - Life Finds a Way</option>
                    <option value="5">5 - Perfectly Balanced</option>
                    <option value="4">4 - Glitch in the Matrix</option>
                    <option value="3">3 - It's a Trap!</option>
                    <option value="2">2 - Not My Tempo</option>
                    <option value="1">1 - Not The Bees!</option>
                  </select>
                </div>
                <textarea id="review-text" placeholder="Share your thoughts..." required></textarea>
                <button type="submit" class="submit-review-btn">Submit Review</button>
              </form>
            </div>

          </div>
        </div>
      </div>
    </div>
  `;
}

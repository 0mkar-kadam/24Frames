import './style.css';
import { Navbar } from './components/Navbar.js';
import { MoodSelector } from './components/MoodSelector.js';
import { MatrixCanvas, initMatrixEffect } from './components/MatrixCanvas.js';
import { Randomizer } from './components/Randomizer.js';
import { MovieCard } from './components/MovieCard.js';
import { MovieModal } from './components/MovieModal.js';
import { fetchMoviesByGenre, fetchRandomMovie, fetchMovieDetails, searchMovies } from './services/tmdb.js';
import { getGenresForMood } from './services/moodEngine.js';
import { analyzeMoodAndFetchMovies } from './services/aiService.js';
import { addToWatchlist, getWatchlist } from './services/watchlistService.js';
import { getReviews, addReview } from './services/reviewService.js';

document.querySelector('#app').innerHTML = `
  ${Navbar()}
  <main>
    ${MoodSelector()}
    ${Randomizer()}
    ${MatrixCanvas()}
    <div id="movie-results" class="movie-grid"></div>
  </main>
`;

// Initialize effects
initMatrixEffect();

// Event Listeners
const resultsContainer = document.getElementById('movie-results');

// Randomizer Listener
document.getElementById('randomizer-btn').addEventListener('click', async () => {
  resultsContainer.innerHTML = '<div class="loading">Rolling the dice... 🎲</div>';
  const movie = await fetchRandomMovie();

  if (movie) {
    resultsContainer.innerHTML = MovieCard(movie);
  } else {
    resultsContainer.innerHTML = '<div class="error">Could not find a random movie. Try again!</div>';
  }
});

// AI Mood Input Listener
const moodInput = document.getElementById('mood-text-input');
const moodSubmitBtn = document.getElementById('mood-submit-btn');

async function handleAIRequest() {
  const text = moodInput.value.trim();
  if (!text) return;

  resultsContainer.innerHTML = '<div class="loading">AI is analyzing your mood... 🤖</div>';

  const movies = await analyzeMoodAndFetchMovies(text);

  if (movies && movies.length > 0) {
    resultsContainer.innerHTML = movies.map(movie => MovieCard(movie)).join('');
  } else {
    resultsContainer.innerHTML = '<div class="error">AI couldn\'t understand that. Try "I want to laugh" or "scary movies".</div>';
  }
}

moodSubmitBtn.addEventListener('click', handleAIRequest);
moodInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') handleAIRequest();
});

// Movie Card Click Listener (Event Delegation)
resultsContainer.addEventListener('click', async (e) => {
  // Handle Watchlist Button Click
  if (e.target.classList.contains('watchlist-btn-mini')) {
    e.stopPropagation(); // Prevent modal opening
    const card = e.target.closest('.movie-card');
    const movieId = card.dataset.id;

    const movie = await fetchMovieDetails(movieId);
    if (movie) {
      if (await addToWatchlist(movie)) {
        alert('Added to Watchlist! ❤️');
      } else {
        alert('Already in Watchlist!');
      }
    }
    return;
  }

  const card = e.target.closest('.movie-card');
  if (card) {
    const movieId = card.dataset.id;
    // Show loading or just fetch
    const movieDetails = await fetchMovieDetails(movieId);

    if (movieDetails) {
      const reviews = await getReviews(movieId);
      const modalHtml = MovieModal(movieDetails, reviews);
      document.body.insertAdjacentHTML('beforeend', modalHtml);

      // Modal Watchlist Button Logic
      const modalBtn = document.querySelector('.add-to-watchlist-btn');
      if (modalBtn) {
        modalBtn.addEventListener('click', async () => {
          if (await addToWatchlist(movieDetails)) {
            modalBtn.textContent = 'Added! ❤️';
            modalBtn.disabled = true;
          } else {
            alert('Already in Watchlist!');
          }
        });
      }

      // Review Form Logic
      const reviewForm = document.getElementById('review-form');
      if (reviewForm) {
        reviewForm.addEventListener('submit', async (e) => {
          e.preventDefault();
          const rating = document.getElementById('review-rating').value;
          const text = document.getElementById('review-text').value;

          await addReview(movieId, { rating, text });

          // Refresh modal to show new review (simple way: remove and re-open, or just append)
          // For simplicity, we'll just reload the page or alert and close. 
          // Better: Re-render the reviews list.
          alert('Review submitted! 📝');
          document.querySelector('.close-modal').click(); // Close modal to refresh state next time
        });
      }

    } else {
      alert('Could not fetch movie details. Check API Key.');
    }
  }
});

// Navbar Listeners
document.getElementById('nav-watchlist').addEventListener('click', async (e) => {
  e.preventDefault();
  const watchlist = await getWatchlist();

  // Hide other sections
  document.querySelector('.mood-selector').style.display = 'none';
  document.querySelector('.randomizer-container').style.display = 'none';
  document.getElementById('matrix-container').style.display = 'none';
  document.querySelector('.mood-input-container').style.display = 'none';

  if (watchlist.length === 0) {
    resultsContainer.innerHTML = '<div class="error">Your watchlist is empty. Go add some movies! 🍿</div>';
  } else {
    resultsContainer.innerHTML = watchlist.map(movie => MovieCard(movie)).join('');
  }
});

// Search Listener
const searchInput = document.getElementById('search-bar');
searchInput.addEventListener('keypress', async (e) => {
  if (e.key === 'Enter') {
    const query = searchInput.value.trim();
    if (!query) return;

    // Hide other sections
    document.querySelector('.mood-selector').style.display = 'none';
    document.querySelector('.randomizer-container').style.display = 'none';
    document.getElementById('matrix-container').style.display = 'none';
    document.querySelector('.mood-input-container').style.display = 'none';

    resultsContainer.innerHTML = '<div class="loading">Searching for movies... 🔍</div>';

    const movies = await searchMovies(query);

    if (movies && movies.length > 0) {
      resultsContainer.innerHTML = movies.map(movie => MovieCard(movie)).join('');
    } else {
      resultsContainer.innerHTML = '<div class="error">No movies found matching your search.</div>';
    }
  }
});

document.getElementById('nav-home').addEventListener('click', (e) => {
  e.preventDefault();
  // Show sections
  document.querySelector('.mood-selector').style.display = 'block';
  document.querySelector('.randomizer-container').style.display = 'flex';
  document.getElementById('matrix-container').style.display = 'block';
  document.querySelector('.mood-input-container').style.display = 'flex';
  resultsContainer.innerHTML = ''; // Clear results
});

document.querySelectorAll('.mood-btn').forEach(btn => {
  btn.addEventListener('click', async (e) => {
    const mood = e.currentTarget.dataset.mood;
    console.log('Mood selected:', mood);

    // Visual feedback
    document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('active'));
    e.currentTarget.classList.add('active');

    // Clear previous results
    resultsContainer.innerHTML = '<div class="loading">Finding the perfect movies...</div>';

    // Get genres
    const genreIds = getGenresForMood(mood);
    if (genreIds.length === 0) {
      resultsContainer.innerHTML = '<div class="error">Mood not found. Try another!</div>';
      return;
    }

    // Fetch movies (using first genre for now, or mix)
    // We'll fetch for the first mapped genre
    const movies = await fetchMoviesByGenre(genreIds[0]);

    if (movies && movies.length > 0) {
      resultsContainer.innerHTML = movies.map(movie => MovieCard(movie)).join('');
    } else {
      resultsContainer.innerHTML = '<div class="error">No movies found. Check API Key or try again.</div>';
    }
  });
});

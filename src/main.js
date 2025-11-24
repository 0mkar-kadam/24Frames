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
import { addReview, getReviews } from './services/reviewService.js';

// --- State Management ---
const state = {
  currentView: 'home', // 'home' or 'matrix'
  movies: [],
  watchlist: []
};

// --- Initialization ---
document.querySelector('#navbar-container').innerHTML = Navbar();
document.querySelector('#mood-selector-container').innerHTML = MoodSelector();
document.querySelector('#matrix-container-wrapper').innerHTML = MatrixCanvas();
document.querySelector('#randomizer-wrapper').innerHTML = Randomizer();

// --- DOM Elements ---
const homeView = document.getElementById('home-view');
const matrixView = document.getElementById('matrix-view');
const searchResultsContainer = document.getElementById('search-results-container');
const movieModalContainer = document.getElementById('movie-modal-container');
const searchBar = document.getElementById('search-bar');

// --- Navigation Logic ---
// --- Navigation Logic ---
function switchView(viewName, pushState = true) {
  console.log(`switchView called: ${viewName}, pushState: ${pushState}`);
  state.currentView = viewName;

  // Close any open modals
  movieModalContainer.innerHTML = '';

  // Update UI
  if (viewName === 'home') {
    homeView.style.display = 'block';
    matrixView.style.display = 'none';
  } else if (viewName === 'matrix') {
    homeView.style.display = 'none';
    matrixView.style.display = 'block';
    initMatrixEffect();
  }

  // Update URL History
  if (pushState) {
    const url = new URL(window.location);
    url.searchParams.set('view', viewName);
    window.history.pushState({ view: viewName }, '', url);
    console.log(`Pushed state: ${viewName}, URL: ${url.toString()}`);
  }
}

// Handle Browser Back/Forward - MOVED TO closeModal section with error handling

// Initial Load
const initialParams = new URLSearchParams(window.location.search);
const initialView = initialParams.get('view') || 'home';

// Set initial state so we have something to go back to
const initialUrl = new URL(window.location);
initialUrl.searchParams.set('view', initialView);
window.history.replaceState({ view: initialView }, '', initialUrl);

switchView(initialView, false);

document.getElementById('nav-home').addEventListener('click', (e) => {
  e.preventDefault();
  switchView('home');
});

document.getElementById('nav-matrix').addEventListener('click', (e) => {
  e.preventDefault();
  switchView('matrix');
});

document.getElementById('nav-watchlist').addEventListener('click', async (e) => {
  e.preventDefault();
  switchView('home'); // Watchlist is shown in the grid area
  const watchlist = await getWatchlist();
  displayMovies(watchlist);
});

// --- Event Listeners ---

// 1. Search
if (searchBar) {
  searchBar.addEventListener('keypress', async (e) => {
    if (e.key === 'Enter') {
      const query = e.target.value;
      if (query) {
        switchView('home');
        searchResultsContainer.innerHTML = '<div class="loading">Searching...</div>';
        const movies = await searchMovies(query);
        displayMovies(movies);
      }
    }
  });
}

// 2. Mood Selection
document.querySelectorAll('.mood-btn').forEach(btn => {
  btn.addEventListener('click', async () => {
    // UI Update
    document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const mood = btn.dataset.mood;
    const genres = getGenresForMood(mood);

    searchResultsContainer.innerHTML = '<div class="loading">Finding the perfect movies...</div>';

    // Fetch movies for the first genre in the list
    const movies = await fetchMoviesByGenre(genres[0]);
    displayMovies(movies);
  });
});

// 3. AI Mood Input
const moodSubmitBtn = document.getElementById('mood-submit-btn');
const moodInput = document.getElementById('mood-text-input');

if (moodSubmitBtn && moodInput) {
  moodSubmitBtn.addEventListener('click', async () => {
    const text = moodInput.value;
    if (!text) return;

    searchResultsContainer.innerHTML = '<div class="loading">Analyzing your mood...</div>';
    const movies = await analyzeMoodAndFetchMovies(text);
    displayMovies(movies);
  });
}

// 4. Randomizer (Now on Matrix Page)
const randomizerBtn = document.getElementById('randomizer-btn');
if (randomizerBtn) {
  randomizerBtn.addEventListener('click', async () => {
    const movie = await fetchRandomMovie();
    if (movie) {
      openModal(movie);
    } else {
      alert('Could not find a random movie. Try again!');
    }
  });
}

// --- Helper Functions ---

function displayMovies(movies) {
  searchResultsContainer.innerHTML = '';

  if (!movies || movies.length === 0) {
    searchResultsContainer.innerHTML = '<div class="error">No movies found matching your search.</div>';
    return;
  }

  movies.forEach(movie => {
    const cardHTML = MovieCard(movie);
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = cardHTML;
    const cardElement = tempDiv.firstElementChild;

    // Add click event to open modal
    cardElement.addEventListener('click', () => openModal(movie));

    searchResultsContainer.appendChild(cardElement);
  });
}

async function openModal(movie) {
  // Fetch full details (including videos/cast)
  const fullMovie = await fetchMovieDetails(movie.id);
  const movieToDisplay = fullMovie || movie;

  // Fetch reviews
  const reviews = await getReviews(movie.id);

  movieModalContainer.innerHTML = MovieModal(movieToDisplay, reviews);
  const modal = document.getElementById('movie-modal');
  const closeBtn = document.querySelector('.close-modal');
  const overlay = document.querySelector('.modal-overlay');
  const watchlistBtn = document.querySelector('.add-to-watchlist-btn');
  const reviewForm = document.getElementById('review-form');

  // Show modal - handled by appending to DOM
  // modal.style.display = 'flex'; // Flex to center

  // Update URL History for Modal
  const url = new URL(window.location);
  url.searchParams.set('movieId', movie.id);
  window.history.pushState({ view: state.currentView, movieId: movie.id, modal: true }, '', url);

  // Close Logic
  const closeModal = () => {
    console.log('closeModal called. Current state:', window.history.state);

    // 1. Visually close immediately to ensure UI response
    movieModalContainer.innerHTML = '';

    // 2. Handle History
    if (window.history.state?.modal) {
      console.log('History has modal state, calling back()');
      window.history.back();
    } else {
      console.log('No modal state in history, manual fallback');
      switchView(state.currentView, false);
      const url = new URL(window.location);
      url.searchParams.delete('movieId');
      window.history.replaceState({ view: state.currentView }, '', url);
    }
  };

  // Handle Browser Back/Forward with Error Handling
  window.addEventListener('popstate', (event) => {
    try {
      console.log('popstate event fired:', event.state);
      const view = event.state?.view || 'home';
      switchView(view, false);
    } catch (error) {
      console.error('Error in popstate:', error);
      // Fallback to home if error
      switchView('home', false);
    }
  });

  // Remove old event listeners to prevent duplicates if any (though innerHTML replacement handles this)
  // But we need to be careful not to attach multiple listeners if we re-use elements.
  // Since we replace innerHTML of movieModalContainer, the elements are new.

  closeBtn.addEventListener('click', (e) => {
    console.log('Close button clicked');
    e.stopPropagation(); // Prevent bubbling to overlay
    closeModal();
  });
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      console.log('Overlay clicked');
      closeModal();
    }
  });

  // Watchlist Logic
  watchlistBtn.addEventListener('click', async () => {
    watchlistBtn.disabled = true;
    watchlistBtn.textContent = 'Adding...';
    await addToWatchlist(movieToDisplay);
    watchlistBtn.textContent = 'Added to Watchlist';
    watchlistBtn.style.backgroundColor = '#46d369'; // Success green
  });

  // Review Logic
  if (reviewForm) {
    reviewForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const rating = document.getElementById('review-rating').value;
      const text = document.getElementById('review-text').value;

      await addReview(movie.id, { rating, text });

      // Refresh modal to show new review (simple reload of modal content)
      openModal(movie);
    });
  }
}

// Export openModal so it can be used by MatrixCanvas
window.openModal = openModal;
window.searchMovies = searchMovies; // Expose for MatrixCanvas if needed
window.displayMovies = displayMovies; // Expose for MatrixCanvas if needed

export function Navbar() {
  return `
    <nav class="navbar">
      <a href="#" class="logo-container" id="nav-logo-link">
        <div class="logo-icon">
        <div class="logo-icon">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- The Monolith -->
            <rect x="8" y="2" width="8" height="20" rx="1" fill="currentColor"/>
            <!-- The Light Beam -->
            <path d="M16 4L22 22" stroke="#e50914" stroke-width="1" stroke-opacity="0.8" class="light-beam"/>
            <path d="M8 4L2 22" stroke="#e50914" stroke-width="1" stroke-opacity="0.8" class="light-beam"/>
          </svg>
        </div>
        </div>
        <div class="logo-text">
          <span class="logo-number">24</span><span class="logo-word">FRAMES</span>
        </div>
      </a>
      <div class="nav-links">
        <a href="#" id="nav-home">Home</a>
        <a href="#" id="nav-matrix">Matrix</a>
        <a href="#" id="nav-watchlist">Watchlist</a>
        <input type="text" placeholder="Search movies..." id="search-bar">
      </div>
    </nav>
  `;
}

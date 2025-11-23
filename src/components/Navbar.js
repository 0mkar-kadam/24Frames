export function Navbar() {
  return `
    <nav class="navbar">
      <div class="logo">24Frames</div>
      <div class="nav-links">
        <a href="#" id="nav-home">Home</a>
        <a href="#" id="nav-watchlist">Watchlist</a>
        <input type="text" placeholder="Search movies..." id="search-bar">
      </div>
    </nav>
  `;
}

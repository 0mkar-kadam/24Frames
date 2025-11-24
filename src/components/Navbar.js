export function Navbar() {
  return `
    <nav class="navbar">
      <div class="logo">
        <img src="/logo_24frames.png" alt="24Frames" style="height: 50px;">
      </div>
      <div class="nav-links">
        <a href="#" id="nav-home">Home</a>
        <a href="#" id="nav-matrix">Matrix</a>
        <a href="#" id="nav-watchlist">Watchlist</a>
        <input type="text" placeholder="Search movies..." id="search-bar">
      </div>
    </nav>
  `;
}

export function MatrixCanvas() {
    return `
    <div id="matrix-container">
      <canvas id="matrix-canvas"></canvas>
      <div class="matrix-overlay" id="matrix-overlay">
        <h3>Hover to Decrypt a Movie</h3>
        <div id="matrix-movie-result"></div>
      </div>
    </div>
  `;
}

export function initMatrixEffect() {
    const canvas = document.getElementById('matrix-canvas');
    const overlay = document.getElementById('matrix-overlay');
    const movieResult = document.getElementById('matrix-movie-result');

    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = canvas.parentElement.offsetWidth;
    let height = canvas.height = 400;

    const movieTitles = [
        "The Matrix", "Inception", "Interstellar", "The Dark Knight",
        "Pulp Fiction", "Fight Club", "Forrest Gump", "Gladiator",
        "The Godfather", "Star Wars", "Avengers", "Titanic",
        "Jurassic Park", "Avatar", "The Lion King", "Rocky",
        "Alien", "Terminator", "Back to the Future", "The Shining"
    ];

    const columns = Math.floor(width / 20);
    const drops = [];
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*";

    for (let i = 0; i < columns; i++) {
        drops[i] = 1;
    }

    let animationId;
    let hovered = false;

    function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = '#0F0';
        ctx.font = '15px monospace';

        for (let i = 0; i < drops.length; i++) {
            const text = chars.charAt(Math.floor(Math.random() * chars.length));
            ctx.fillText(text, i * 20, drops[i] * 20);

            if (drops[i] * 20 > height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }

        if (!hovered) {
            animationId = requestAnimationFrame(draw);
        }
    }

    draw();

    // Resize handler
    window.addEventListener('resize', () => {
        width = canvas.width = canvas.parentElement.offsetWidth;
        // Reset drops
        drops.length = 0;
        const newCols = Math.floor(width / 20);
        for (let i = 0; i < newCols; i++) drops[i] = 1;
    });

    // Hover Interaction
    const container = document.getElementById('matrix-container');

    container.addEventListener('mouseenter', () => {
        hovered = true;
        cancelAnimationFrame(animationId);
        // Pick a random movie
        const randomMovie = movieTitles[Math.floor(Math.random() * movieTitles.length)];

        // Glitch effect or freeze
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = '#00FF00';
        ctx.font = 'bold 30px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(randomMovie.toUpperCase(), width / 2, height / 2);

        overlay.querySelector('h3').style.display = 'none';
        movieResult.textContent = `Selected: ${randomMovie}`;
        movieResult.style.color = '#00FF00';
        movieResult.style.fontSize = '1.5rem';
    });

    container.addEventListener('mouseleave', () => {
        hovered = false;
        overlay.querySelector('h3').style.display = 'block';
        movieResult.textContent = '';
        draw();
    });
}

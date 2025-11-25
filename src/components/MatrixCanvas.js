export function MatrixCanvas() {
    return `
    <div id="matrix-container">
      <canvas id="matrix-canvas"></canvas>
      <div class="matrix-overlay" id="matrix-overlay">
        <h3>Hover to Decrypt // Click to Breach</h3>
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
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const movieTitles = [
        "The Matrix", "Inception", "Interstellar", "The Dark Knight",
        "Pulp Fiction", "Fight Club", "Forrest Gump", "Gladiator",
        "The Godfather", "Star Wars", "Avengers", "Titanic",
        "Jurassic Park", "Avatar", "The Lion King", "Rocky",
        "Alien", "Terminator", "Back to the Future", "The Shining",
        "Blade Runner", "Cyberpunk", "Tron", "Akira"
    ];

    const quotes = [
        "Wake Up", "Follow the White Rabbit", "There is no Spoon",
        "Free Your Mind", "He is the One", "I Know Kung Fu"
    ];

    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*";
    const fontSize = 16;
    const columns = Math.ceil(width / fontSize);

    // Particle System
    const drops = [];
    for (let i = 0; i < columns; i++) {
        drops[i] = {
            x: i * fontSize,
            y: Math.random() * -1000, // Stagger start
            speed: 1 + Math.random() * 3,
            text: chars.charAt(Math.floor(Math.random() * chars.length)),
            isQuote: false,
            quoteText: ""
        };
    }

    let mouse = { x: -1000, y: -1000 };
    let animationId;
    let isGlitching = false;

    // Mouse Interaction
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    function draw() {
        // Semi-transparent black for trail effect
        ctx.fillStyle = isGlitching ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, width, height);

        ctx.font = `${fontSize}px monospace`;

        for (let i = 0; i < drops.length; i++) {
            const drop = drops[i];

            // Physics: Repulsion from mouse (Bullet Dodge)
            const dx = drop.x - mouse.x;
            const dy = drop.y - mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const repulsionRadius = 150;

            let renderX = drop.x;
            let renderY = drop.y;

            if (distance < repulsionRadius) {
                const angle = Math.atan2(dy, dx);
                const force = (repulsionRadius - distance) / repulsionRadius;
                const push = force * 50; // Push strength
                renderX += Math.cos(angle) * push;
                renderY += Math.sin(angle) * push;
            }

            // Text Selection
            let text = drop.text;

            // Subliminal Quotes
            if (Math.random() > 0.999 && !drop.isQuote) {
                drop.isQuote = true;
                drop.quoteText = quotes[Math.floor(Math.random() * quotes.length)];
            }

            if (drop.isQuote) {
                ctx.fillStyle = '#FFF'; // White for quotes
                text = drop.quoteText;
            } else {
                ctx.fillStyle = '#0F0'; // Green for normal code
                // Randomly change character
                if (Math.random() > 0.95) {
                    drop.text = chars.charAt(Math.floor(Math.random() * chars.length));
                }
                text = drop.text;
            }

            // Glitch Effect Color Override
            if (isGlitching) {
                ctx.fillStyle = Math.random() > 0.5 ? '#FF0000' : '#FFFFFF';
            }

            ctx.fillText(text, renderX, renderY);

            // Reset logic
            if (drop.y > height && Math.random() > 0.975) {
                drop.y = -fontSize;
                drop.isQuote = false;
            }

            // Move drop
            drop.y += drop.speed;
        }

        animationId = requestAnimationFrame(draw);
    }

    draw();

    // Resize handler
    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    // Click to Reveal Logic
    const container = document.getElementById('matrix-container');
    container.addEventListener('click', async () => {
        if (isGlitching) return; // Prevent double click

        isGlitching = true;

        // 1. Trigger System Failure Visuals
        overlay.querySelector('h3').textContent = "SYSTEM FAILURE...";
        overlay.querySelector('h3').classList.add('glitch-active');

        // 2. Select Movie
        const randomMovie = movieTitles[Math.floor(Math.random() * movieTitles.length)];

        // 3. Delay for dramatic effect
        setTimeout(async () => {
            cancelAnimationFrame(animationId);

            // Clear canvas with glitch
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, width, height);

            // Show Result
            overlay.querySelector('h3').style.display = 'none';
            movieResult.textContent = randomMovie.toUpperCase();
            movieResult.style.opacity = '1';
            movieResult.classList.add('glitch-active');

            // 4. Navigate after short delay
            setTimeout(async () => {
                if (window.searchMovies && window.displayMovies) {
                    document.getElementById('nav-home').click();
                    const searchContainer = document.getElementById('search-results-container');
                    searchContainer.innerHTML = `<div class="loading">BREACH SUCCESSFUL.<br>ACCESSING: ${randomMovie}...</div>`;

                    const movies = await window.searchMovies(randomMovie);
                    window.displayMovies(movies);
                }
            }, 2000);
        }, 1500);
    });
}

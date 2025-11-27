import { fetchMoviesByGenre } from '../services/tmdb.js';
import { getGenresList } from '../services/genres.js';

export function MatrixCanvas() {
    return `
    <div id="matrix-container" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 1; background: black; overflow: hidden;">
      <canvas id="matrix-canvas" style="display: block;"></canvas>
      
      <!-- Smooth Tooltip with Fade/Float Animation -->
      <div id="matrix-tooltip" style="
          position: fixed; 
          pointer-events: none; 
          opacity: 0; 
          transform: translateY(10px);
          transition: opacity 0.3s ease-out, transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
          z-index: 1000; 
          background: rgba(0, 15, 0, 0.92); 
          border: 1px solid #00ff88; 
          padding: 12px; 
          border-radius: 6px; 
          color: #00ff88; 
          font-family: monospace; 
          max-width: 240px; 
          box-shadow: 0 0 20px rgba(0, 255, 136, 0.15);
          backdrop-filter: blur(4px);
      ">
        <img id="tooltip-poster" src="" style="width: 100%; display: block; margin-bottom: 8px; border: 1px solid #004400; border-radius: 2px;">
        <div id="tooltip-title" style="font-weight: bold; text-transform: uppercase; font-size: 1.1em; margin-bottom: 4px; text-shadow: 0 0 5px rgba(0, 255, 136, 0.5); line-height: 1.2;"></div>
        <div id="tooltip-genre" style="font-size: 0.85em; color: #aaffcc; margin-bottom: 4px; font-style: italic;"></div>
        <div id="tooltip-year" style="font-size: 0.8em; color: #00cc66;"></div>
      </div>

      <div id="matrix-exit" style="position: fixed; bottom: 20px; right: 20px; color: #00ff88; font-family: monospace; font-size: 1.2rem; cursor: pointer; z-index: 1001; text-shadow: 0 0 5px #00ff88; padding: 10px; border: 1px solid transparent; transition: all 0.3s;">
        > WAKE_UP.exe<span class="blink">_</span>
      </div>
    </div>
  `;
}

export async function initMatrixEffect() {
    const canvas = document.getElementById('matrix-canvas');
    const tooltip = document.getElementById('matrix-tooltip');
    const tooltipTitle = document.getElementById('tooltip-title');
    const tooltipPoster = document.getElementById('tooltip-poster');
    const tooltipYear = document.getElementById('tooltip-year');
    const tooltipGenre = document.getElementById('tooltip-genre');
    const exitBtn = document.getElementById('matrix-exit');

    if (!canvas) return;

    // --- RESET STATE ---
    if (window.matrixAnimationId) {
        cancelAnimationFrame(window.matrixAnimationId);
    }

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    // --- DATA FETCHING ---
    let matrixMovies = [];
    try {
        const promises = [];
        for (let page = 1; page <= 3; page++) {
            promises.push(fetchMoviesByGenre(28, page)); // Action
            promises.push(fetchMoviesByGenre(878, page)); // Sci-Fi
            promises.push(fetchMoviesByGenre(53, page)); // Thriller
        }
        const results = await Promise.all(promises);
        matrixMovies = results.flat().filter(m => m).sort(() => 0.5 - Math.random());
        matrixMovies = Array.from(new Map(matrixMovies.map(m => [m.id, m])).values());
        console.log(`Matrix loaded with ${matrixMovies.length} unique movies.`);
    } catch (e) {
        console.error("Matrix: Failed to fetch movies", e);
        matrixMovies = [{ title: "The Matrix", release_date: "1999", poster_path: null, genre_ids: [878, 28] }];
    }

    // --- CONFIGURATION ---
    const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
    const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nums = '0123456789';
    const chars = katakana + latin + nums;

    // Layer Config
    const layers = [
        { scale: 0.75, opacity: 0.2, speedMod: 0.8, zIndex: 0 }, // Background
        { scale: 1.0, opacity: 1.0, speedMod: 1.5, zIndex: 1 }   // Foreground
    ];

    const fontSizeBase = 16;
    let globalSpeedMultiplier = 1.0;

    // --- PARTICLE SYSTEM ---
    const drops = [];

    // Initialize drops
    layers.forEach(layer => {
        const fontSize = fontSizeBase * layer.scale;
        const columns = Math.ceil(width / fontSize);

        for (let i = 0; i < columns; i++) {
            drops.push({
                x: i * fontSize,
                y: Math.random() * -1000,
                baseSpeed: (3 + Math.random() * 5) * layer.speedMod,
                speed: 0,
                acceleration: 0.05 * layer.speedMod, // Gravity
                text: chars.charAt(Math.floor(Math.random() * chars.length)),
                movie: matrixMovies[Math.floor(Math.random() * matrixMovies.length)],
                glow: 0,
                opacityPhase: Math.random() * Math.PI * 2, // Breathing
                layer: layer,
                fontSize: fontSize
            });
        }
    });

    let mouse = { x: -1000, y: -1000 };
    let lastHoveredDrop = null;
    let tooltipTimeout = null;

    // --- INTERACTION HANDLERS ---
    const handleMove = (x, y) => {
        mouse.x = x;
        mouse.y = y;
        tooltip.style.left = `${x}px`;
        tooltip.style.top = `${y}px`;
    };

    const handleMouseMove = (e) => handleMove(e.clientX, e.clientY);

    // Mobile Support: Touch Events
    const handleTouchMove = (e) => {
        if (e.touches.length > 0) {
            const touch = e.touches[0];
            handleMove(touch.clientX, touch.clientY);
            e.preventDefault(); // Prevent scrolling while interacting with Matrix
        }
    };

    const handleWheel = (e) => {
        const delta = e.deltaY * 0.002;
        globalSpeedMultiplier += delta;
        if (globalSpeedMultiplier < 0.2) globalSpeedMultiplier = 0.2;
        if (globalSpeedMultiplier > 10.0) globalSpeedMultiplier = 10.0;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('wheel', handleWheel, { passive: true });

    // --- RENDER LOOP ---
    function draw() {
        // Clear with fade effect
        ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
        ctx.fillRect(0, 0, width, height);

        const time = Date.now() * 0.002;

        for (let i = 0; i < drops.length; i++) {
            const drop = drops[i];

            // --- INTERACTION & RIPPLE ---
            if (drop.layer.zIndex === 1) {
                const distX = Math.abs(drop.x - mouse.x);
                const distY = Math.abs(drop.y - mouse.y);

                if (distX < drop.fontSize) {
                    drop.glow = 1.0;
                    lastHoveredDrop = drop;

                    // Ripple: Propagate to neighbors
                    if (i > 0 && drops[i - 1].layer.zIndex === 1) drops[i - 1].glow = Math.max(drops[i - 1].glow, 0.5);
                    if (i < drops.length - 1 && drops[i + 1].layer.zIndex === 1) drops[i + 1].glow = Math.max(drops[i + 1].glow, 0.5);
                }
            }

            // --- PHYSICS (Gravity) ---
            let currentSpeed = (drop.baseSpeed + (drop.y > 0 ? drop.y * 0.002 : 0)) * globalSpeedMultiplier;

            if (drop.glow > 0.1) {
                currentSpeed *= 0.1; // Slow-mo
            }
            drop.y += currentSpeed;

            // Decay glow
            if (drop.glow > 0) drop.glow -= 0.05;
            if (drop.glow < 0) drop.glow = 0;

            // --- VISUALS (Opacity Cycling) ---
            const breathing = Math.sin(time + drop.opacityPhase) * 0.2;
            let alpha = drop.layer.opacity + breathing;
            if (alpha < 0.1) alpha = 0.1;
            if (alpha > 1) alpha = 1;

            ctx.font = `${drop.fontSize}px monospace`;

            if (drop.glow > 0.5) {
                ctx.fillStyle = '#FFF';
                ctx.shadowBlur = 10;
                ctx.shadowColor = '#00FF00';
            } else {
                ctx.fillStyle = `rgba(0, 255, 70, ${alpha})`;
                ctx.shadowBlur = 0;
            }

            if (Math.random() > 0.92) {
                drop.text = chars.charAt(Math.floor(Math.random() * chars.length));
            }
            ctx.fillText(drop.text, drop.x, drop.y);

            // Reset
            if (drop.y > height) {
                drop.y = -drop.fontSize * (1 + Math.random() * 5);
                drop.movie = matrixMovies[Math.floor(Math.random() * matrixMovies.length)];
                drop.glow = 0;
                drop.baseSpeed = (3 + Math.random() * 5) * drop.layer.speedMod;
            }
        }

        // Tooltip Logic
        if (lastHoveredDrop && lastHoveredDrop.glow > 0.1 && lastHoveredDrop.movie) {
            if (tooltipTimeout) clearTimeout(tooltipTimeout);

            tooltip.style.opacity = '1';
            tooltip.style.transform = 'translate(20px, 20px)';

            if (tooltipTitle.textContent !== lastHoveredDrop.movie.title) {
                tooltipTitle.textContent = lastHoveredDrop.movie.title;
                tooltipYear.textContent = lastHoveredDrop.movie.release_date ? lastHoveredDrop.movie.release_date.split('-')[0] : '';
                tooltipGenre.textContent = getGenresList(lastHoveredDrop.movie.genre_ids);

                if (lastHoveredDrop.movie.poster_path) {
                    tooltipPoster.style.display = 'block';
                    tooltipPoster.src = `https://image.tmdb.org/t/p/w200${lastHoveredDrop.movie.poster_path}`;
                } else {
                    tooltipPoster.style.display = 'none';
                }
            }
        } else {
            if (!tooltipTimeout && tooltip.style.opacity === '1') {
                tooltipTimeout = setTimeout(() => {
                    tooltip.style.opacity = '0';
                    tooltip.style.transform = 'translate(20px, 30px)';
                }, 150);
            }
        }

        window.matrixAnimationId = requestAnimationFrame(draw);
    }

    draw();

    // Resize handler
    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    // Click Logic (Movie)
    const container = document.getElementById('matrix-container');
    if (container._clickHandler) container.removeEventListener('click', container._clickHandler);

    const clickHandler = (e) => {
        if (e.target.closest('#matrix-exit')) return;

        // Use lastHoveredDrop if available (for better click accuracy during movement)
        const targetDrop = lastHoveredDrop || drops.find(d => d.glow > 0.8 && d.layer.zIndex === 1);

        if (targetDrop && targetDrop.movie && window.openModal) {
            window.openModal(targetDrop.movie);
        }
    };

    container._clickHandler = clickHandler;
    container.addEventListener('click', clickHandler);

    // Exit Logic
    if (exitBtn) {
        exitBtn.addEventListener('mouseover', () => {
            exitBtn.style.background = '#00ff88';
            exitBtn.style.color = '#000';
        });
        exitBtn.addEventListener('mouseout', () => {
            exitBtn.style.background = 'transparent';
            exitBtn.style.color = '#00ff88';
        });
        exitBtn.addEventListener('click', () => {
            // System Shutdown Effect
            cancelAnimationFrame(window.matrixAnimationId);
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, width, height);

            // Create a temporary overlay for the shutdown message
            const shutdownMsg = document.createElement('div');
            shutdownMsg.innerHTML = '<h3 style="color: #00ff88; font-family: monospace; text-align: center; margin-top: 40vh;">SYSTEM SHUTDOWN...</h3>';
            container.appendChild(shutdownMsg);

            setTimeout(() => {
                document.getElementById('nav-home').click();
            }, 1000);
        });
    }
}

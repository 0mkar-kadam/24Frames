
export class MoodBackground {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`MoodBackground: Container #${containerId} not found.`);
            return;
        }

        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.container.appendChild(this.canvas);

        this.particles = [];
        this.animationId = null;
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        // Default State (Neutral)
        this.state = {
            color: '255, 255, 255', // RGB
            speed: 0.5,
            count: 50,
            size: 2,
            chaos: 0, // 0 to 1
            direction: 'float', // float, rain, rise, chaotic
            connectionDistance: 150,
            mouseInteraction: 'repel'
        };

        this.mouse = { x: null, y: null, radius: 150 };
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        });
        window.addEventListener('mouseout', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });

        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.initParticles();
        this.animate();
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    setMood(mood) {
        console.log(`MoodBackground: Switching to ${mood}`);

        switch (mood) {
            case 'happy': // Euphoric
                this.targetState = {
                    color: '255, 223, 0',
                    speed: 2,
                    count: 80,
                    size: 4,
                    chaos: 0.2,
                    direction: 'rise',
                    connectionDistance: 100,
                    mouseInteraction: 'attract',
                    shape: 'circle'
                };
                break;
            case 'sad': // Melancholic
                this.targetState = {
                    color: '100, 149, 237',
                    speed: 1.5,
                    count: 100,
                    size: 2,
                    chaos: 0,
                    direction: 'rain',
                    connectionDistance: 50,
                    mouseInteraction: 'repel',
                    shape: 'circle'
                };
                break;
            case 'excited': // Electric
                this.targetState = {
                    color: '255, 0, 255',
                    speed: 4,
                    count: 120,
                    size: 3,
                    chaos: 0.8,
                    direction: 'chaotic',
                    connectionDistance: 120,
                    mouseInteraction: 'explode',
                    shape: 'star' // Star shape
                };
                break;
            case 'angry': // Volatile
                this.targetState = {
                    color: '255, 69, 0',
                    speed: 3,
                    count: 150,
                    size: 2,
                    chaos: 1,
                    direction: 'chaotic',
                    connectionDistance: 80,
                    mouseInteraction: 'repel',
                    shape: 'circle'
                };
                break;
            case 'relaxed': // Serene
                this.targetState = {
                    color: '0, 255, 127',
                    speed: 0.5,
                    count: 60,
                    size: 3,
                    chaos: 0,
                    direction: 'float',
                    connectionDistance: 200,
                    mouseInteraction: 'slow',
                    shape: 'circle'
                };
                break;
            case 'scared': // Terrified
                this.targetState = {
                    color: '148, 0, 211',
                    speed: 0.2,
                    count: 40,
                    size: 5,
                    chaos: 0.1,
                    direction: 'float',
                    connectionDistance: 0,
                    mouseInteraction: 'flee',
                    shape: 'circle'
                };
                break;
            case 'romantic': // Passionate
                this.targetState = {
                    color: '255, 105, 180',
                    speed: 1,
                    count: 70,
                    size: 4, // Slightly larger for hearts
                    chaos: 0.1,
                    direction: 'rise',
                    connectionDistance: 150,
                    mouseInteraction: 'attract',
                    shape: 'heart' // Heart shape
                };
                break;
            case 'thoughtful': // Introspective
                this.targetState = {
                    color: '0, 255, 255',
                    speed: 0.8,
                    count: 50,
                    size: 2,
                    chaos: 0,
                    direction: 'float',
                    connectionDistance: 250,
                    mouseInteraction: 'connect',
                    shape: 'circle'
                };
                break;
            default: // Neutral
                this.targetState = {
                    color: '255, 255, 255',
                    speed: 0.5,
                    count: 50,
                    size: 2,
                    chaos: 0,
                    direction: 'float',
                    connectionDistance: 150,
                    mouseInteraction: 'repel',
                    shape: 'circle'
                };
        }

        this.state = { ...this.targetState };
        this.initParticles();
    }

    initParticles() {
        this.particles = [];
        for (let i = 0; i < this.state.count; i++) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                vx: (Math.random() - 0.5) * this.state.speed,
                vy: (Math.random() - 0.5) * this.state.speed,
                size: Math.random() * this.state.size + 1
            });
        }
    }

    update() {
        for (let p of this.particles) {
            // Mouse Interaction
            if (this.mouse.x != null) {
                let dx = this.mouse.x - p.x;
                let dy = this.mouse.y - p.y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.mouse.radius) {
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const force = (this.mouse.radius - distance) / this.mouse.radius;
                    const directionX = forceDirectionX * force * this.state.speed * 5;
                    const directionY = forceDirectionY * force * this.state.speed * 5;

                    if (this.state.mouseInteraction === 'repel' || this.state.mouseInteraction === 'flee') {
                        p.x -= directionX;
                        p.y -= directionY;
                    } else if (this.state.mouseInteraction === 'attract') {
                        p.x += directionX;
                        p.y += directionY;
                    } else if (this.state.mouseInteraction === 'explode') {
                        p.x -= directionX * 2;
                        p.y -= directionY * 2;
                    }
                }
            }

            // Movement logic based on direction
            if (this.state.direction === 'rain') {
                p.y += this.state.speed;
                p.x += (Math.random() - 0.5) * 0.5; // Slight jitter
                if (p.y > this.height) p.y = 0;
            } else if (this.state.direction === 'rise') {
                p.y -= this.state.speed;
                p.x += (Math.random() - 0.5) * 0.5;
                if (p.y < 0) p.y = this.height;
            } else if (this.state.direction === 'chaotic') {
                p.x += (Math.random() - 0.5) * this.state.speed * 2;
                p.y += (Math.random() - 0.5) * this.state.speed * 2;
            } else { // float
                p.x += p.vx;
                p.y += p.vy;
            }

            // Boundaries for non-wrapping modes
            if (this.state.direction !== 'rain' && this.state.direction !== 'rise') {
                if (p.x < 0 || p.x > this.width) p.vx *= -1;
                if (p.y < 0 || p.y > this.height) p.vy *= -1;
            }

            // Wrap X for rain/rise
            if (p.x < 0) p.x = this.width;
            if (p.x > this.width) p.x = 0;
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Draw connections
        if (this.state.connectionDistance > 0) {
            this.ctx.strokeStyle = `rgba(${this.state.color}, 0.15)`;
            this.ctx.lineWidth = 1;

            for (let i = 0; i < this.particles.length; i++) {
                for (let j = i + 1; j < this.particles.length; j++) {
                    const dx = this.particles[i].x - this.particles[j].x;
                    const dy = this.particles[i].y - this.particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < this.state.connectionDistance) {
                        this.ctx.beginPath();
                        this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                        this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                        this.ctx.stroke();
                    }
                }
            }
        }

        // Draw particles
        this.ctx.fillStyle = `rgba(${this.state.color}, 0.8)`;

        for (let p of this.particles) {
            this.ctx.beginPath();

            if (this.state.shape === 'heart') {
                // Draw Heart
                const size = p.size * 2;
                this.ctx.moveTo(p.x, p.y + size / 4);
                this.ctx.bezierCurveTo(p.x, p.y, p.x - size / 2, p.y - size / 2, p.x - size / 2, p.y + size / 4);
                this.ctx.bezierCurveTo(p.x - size / 2, p.y + size / 2, p.x, p.y + size * 0.8, p.x, p.y + size);
                this.ctx.bezierCurveTo(p.x, p.y + size * 0.8, p.x + size / 2, p.y + size / 2, p.x + size / 2, p.y + size / 4);
                this.ctx.bezierCurveTo(p.x + size / 2, p.y - size / 2, p.x, p.y, p.x, p.y + size / 4);
            } else if (this.state.shape === 'star') {
                // Draw Star
                const spikes = 5;
                const outerRadius = p.size * 2;
                const innerRadius = p.size;
                let rot = Math.PI / 2 * 3;
                let x = p.x;
                let y = p.y;
                let step = Math.PI / spikes;

                this.ctx.moveTo(p.x, p.y - outerRadius);
                for (let i = 0; i < spikes; i++) {
                    x = p.x + Math.cos(rot) * outerRadius;
                    y = p.y + Math.sin(rot) * outerRadius;
                    this.ctx.lineTo(x, y);
                    rot += step;

                    x = p.x + Math.cos(rot) * innerRadius;
                    y = p.y + Math.sin(rot) * innerRadius;
                    this.ctx.lineTo(x, y);
                    rot += step;
                }
                this.ctx.lineTo(p.x, p.y - outerRadius);
            } else {
                // Default Circle
                this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            }

            this.ctx.fill();
        }
    }

    animate() {
        this.update();
        this.draw();
        this.animationId = requestAnimationFrame(() => this.animate());
    }
}

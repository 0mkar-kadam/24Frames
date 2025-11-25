export const EasterEggService = {
    init() {
        this.logConsoleGreetings();
        this.initKonamiCode();
        this.rotateSearchPlaceholder();
    },

    logConsoleGreetings() {
        const quotes = [
            "I'm in. (Hacker Voice)",
            "Rahul, naam toh suna hoga?",
            "May the Force be with you.",
            "You talkin' to me?",
            "Frankly, my dear, I don't give a damn.",
            "Why so serious?",
            "Picture abhi baaki hai mere dost!",
            "Hasta la vista, baby.",
            "Keep your friends close, but your enemies closer.",
            "Bade bade deshon mein aisi chhoti chhoti baatein hoti rehti hai."
        ];
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        console.log(`%c🎬 ${randomQuote}`, "color: #e50914; font-size: 16px; font-weight: bold; background: #000; padding: 10px; border-radius: 5px;");
    },

    initKonamiCode() {
        const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
        let cursor = 0;

        document.addEventListener('keydown', (e) => {
            if (e.key === konamiCode[cursor]) {
                cursor++;
                if (cursor === konamiCode.length) {
                    this.triggerSRKMode();
                    cursor = 0;
                }
            } else {
                cursor = 0;
            }
        });
    },

    triggerSRKMode() {
        alert("👑 KING KHAN MODE ACTIVATED 👑");
        document.body.style.transition = "all 2s ease";
        document.body.style.filter = "sepia(0.5) hue-rotate(-30deg) saturate(1.5)"; // Bollywood Warmth

        // Add SRK signature pose overlay
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.pointerEvents = 'none';
        overlay.style.zIndex = '99999';
        overlay.style.background = 'url("https://media.giphy.com/media/xUySTsFw4qqxVDaSfm/giphy.gif") no-repeat center bottom';
        overlay.style.backgroundSize = 'contain';
        overlay.style.opacity = '0';
        overlay.style.transition = 'opacity 1s ease';

        document.body.appendChild(overlay);

        // Fade in
        setTimeout(() => overlay.style.opacity = '0.8', 100);

        // Play audio if possible (browser policy might block)
        console.log("Palat... Palat... Palat...");

        // Fade out after 5 seconds
        setTimeout(() => {
            overlay.style.opacity = '0';
            setTimeout(() => overlay.remove(), 1000);
            document.body.style.filter = "none";
        }, 5000);
    },

    getRandomLoadingMessage() {
        const messages = [
            "Loading... (Buffering is the mind-killer)",
            "Hold on to your butts...",
            "Connecting to the Matrix...",
            "Finding Nemo...",
            "Opening the pod bay doors...",
            "Mere paas Maa hai... aur data bhi...",
            "Great Scott! Loading...",
            "Just keep swimming...",
            "Loading... Why is the rum gone?",
            "On my way! (Run Forrest Run)"
        ];
        return messages[Math.floor(Math.random() * messages.length)];
    },

    rotateSearchPlaceholder() {
        const placeholders = [
            "Search for 'The Godfather'...",
            "Try 'Dilwale Dulhania Le Jayenge'...",
            "Looking for 'Inception'?",
            "Type 'Sholay' for a classic...",
            "Find 'Parasite'...",
            "Search 'Pulp Fiction'...",
            "Try '3 Idiots'...",
            "Looking for 'Spirited Away'?"
        ];

        const input = document.getElementById('search-bar');
        if (!input) return;

        let i = 0;
        setInterval(() => {
            input.setAttribute('placeholder', placeholders[i]);
            i = (i + 1) % placeholders.length;
        }, 3000);
    }
};

export function MoodSelector() {
    const moods = [
        { id: 'happy', label: 'Happy', emoji: '😊' },
        { id: 'sad', label: 'Sad', emoji: '😢' },
        { id: 'excited', label: 'Excited', emoji: '🤩' },
        { id: 'angry', label: 'Angry', emoji: '😠' },
        { id: 'relaxed', label: 'Relaxed', emoji: '😌' },
        { id: 'scared', label: 'Scared', emoji: '😱' },
        { id: 'romantic', label: 'Romantic', emoji: '🥰' },
        { id: 'thoughtful', label: 'Thoughtful', emoji: '🤔' }
    ];

    return `
    <div class="mood-selector">
      <h2>How are you feeling today?</h2>
      <div class="mood-grid">
        ${moods.map(mood => `
          <button class="mood-btn" data-mood="${mood.id}">
            <span class="mood-emoji">${mood.emoji}</span>
            <span class="mood-label">${mood.label}</span>
          </button>
        `).join('')}
      </div>
      <div class="mood-input-container">
        <input type="text" id="mood-text-input" placeholder="Or describe your mood...">
        <button id="mood-submit-btn">Find Movies</button>
      </div>
    </div>
  `;
}

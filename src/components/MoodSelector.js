export function MoodSelector() {
  const moods = [
    { id: 'happy', label: 'EUPHORIC' },
    { id: 'sad', label: 'MELANCHOLIC' },
    { id: 'excited', label: 'ELECTRIC' },
    { id: 'angry', label: 'VOLATILE' },
    { id: 'relaxed', label: 'SERENE' },
    { id: 'scared', label: 'TERRIFIED' },
    { id: 'romantic', label: 'PASSIONATE' },
    { id: 'thoughtful', label: 'INTROSPECTIVE' }
  ];

  return `
    <div class="mood-selector">
      <h2>Select Your State of Mind</h2>
      <div class="mood-list">
        ${moods.map(mood => `
          <div class="mood-item mood-btn" data-mood="${mood.id}" data-label="${mood.label}">
            ${mood.label}
          </div>
        `).join('')}
      </div>
      
      <div class="mood-input-container">
        <input type="text" id="mood-text-input" placeholder="How do you feel?">
        <button id="mood-submit-btn">Match Vibe</button>
      </div>
    </div>
  `;
}

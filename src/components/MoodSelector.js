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
      
      <div class="mood-input-container" style="margin-top: 4rem; border-top: 1px solid #333; padding-top: 2rem;">
        <input type="text" id="mood-text-input" placeholder="OR TYPE YOUR FEELING..." style="background: transparent; border: none; border-bottom: 2px solid #333; border-radius: 0; width: 100%; font-size: 2rem; font-family: var(--font-heading); text-transform: uppercase;">
        <button id="mood-submit-btn" style="margin-top: 1rem; width: 100%; border-radius: 0;">ANALYZE</button>
      </div>
    </div>
  `;
}

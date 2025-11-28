import { authService } from '../services/authService.js';

export function Auth() {
    return `
    <div class="auth-container">
      <div class="spotlight"></div>
      <div class="auth-box">
        <h2 class="auth-title" id="auth-title">IDENTIFY YOURSELF</h2>
        
        <form id="auth-form">
          <div class="input-group">
            <label for="username">CODENAME</label>
            <input type="text" id="username" required autocomplete="off" placeholder="Enter your alias...">
          </div>
          
          <div class="input-group">
            <label for="password">PASSPHRASE</label>
            <input type="password" id="password" required placeholder="Don't forget it...">
            <div class="tooltip" id="password-tooltip">Why so serious?</div>
          </div>

          <button type="submit" class="auth-btn" id="auth-submit-btn">ACCESS MAINFRAME</button>
        </form>

        <div class="auth-switch">
          <span id="auth-switch-text">New to the system?</span>
          <a href="#" id="auth-switch-btn">INITIATE PROTOCOL</a>
        </div>

        <div id="auth-feedback" class="auth-feedback"></div>
      </div>
    </div>
  `;
}

export function initAuthLogic(onSuccess) {
    const form = document.getElementById('auth-form');
    const title = document.getElementById('auth-title');
    const submitBtn = document.getElementById('auth-submit-btn');
    const switchBtn = document.getElementById('auth-switch-btn');
    const switchText = document.getElementById('auth-switch-text');
    const feedback = document.getElementById('auth-feedback');
    const passwordInput = document.getElementById('password');
    const tooltip = document.getElementById('password-tooltip');

    let isLogin = true;

    // Cinematic: Password Focus Interaction
    passwordInput.addEventListener('focus', () => {
        tooltip.style.opacity = '1';
        tooltip.style.transform = 'translateY(-10px) scale(1)';
    });

    passwordInput.addEventListener('blur', () => {
        tooltip.style.opacity = '0';
        tooltip.style.transform = 'translateY(0) scale(0.8)';
    });

    // Switch Mode
    switchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        isLogin = !isLogin;

        // Animate transition
        form.style.opacity = '0';
        setTimeout(() => {
            if (isLogin) {
                title.textContent = 'IDENTIFY YOURSELF';
                submitBtn.textContent = 'ACCESS MAINFRAME';
                switchText.textContent = 'New to the system?';
                switchBtn.textContent = 'INITIATE PROTOCOL';
            } else {
                title.textContent = 'NEW RECRUIT';
                submitBtn.textContent = 'JOIN THE RESISTANCE';
                switchText.textContent = 'Already an agent?';
                switchBtn.textContent = 'IDENTIFY';
            }
            form.style.opacity = '1';
            feedback.textContent = '';
            feedback.className = 'auth-feedback';
        }, 300);
    });

    // Submit Handler
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = form.username.value;
        const password = form.password.value;

        // Loading State
        submitBtn.disabled = true;
        submitBtn.textContent = 'DECRYPTING...';
        feedback.textContent = '';
        feedback.className = 'auth-feedback';

        try {
            if (isLogin) {
                await authService.login(username, password);
            } else {
                await authService.signup(username, password);
            }

            // Success Animation
            feedback.textContent = 'ACCESS GRANTED';
            feedback.classList.add('success');
            document.querySelector('.auth-box').style.borderColor = '#46d369';

            setTimeout(() => {
                onSuccess();
            }, 1000);

        } catch (error) {
            // Error Animation (SRK Eyebrow / Shake)
            submitBtn.disabled = false;
            submitBtn.textContent = isLogin ? 'ACCESS MAINFRAME' : 'JOIN THE RESISTANCE';

            feedback.textContent = error.message || 'ACCESS DENIED';
            feedback.classList.add('error');

            const box = document.querySelector('.auth-box');
            box.classList.add('shake');
            setTimeout(() => box.classList.remove('shake'), 500);
        }
    });
}

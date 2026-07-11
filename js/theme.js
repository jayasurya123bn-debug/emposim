document.addEventListener('DOMContentLoaded', () => {
    // Inject Theme Toggle into Banner
    const banner = document.querySelector('.gtec-banner');
    if (banner) {
        const toggleContainer = document.createElement('div');
        toggleContainer.className = 'toggle-wrapper';
        toggleContainer.style.cssText = 'position: absolute; right: 1.5rem; z-index: 1200;';
        
        toggleContainer.innerHTML = 
            <span class="toggle-label" style="color: #ffe88a; font-size: 1.2rem;" title="Light Mode">☀️</span>
            <input type="checkbox" class="toggle" id="theme-toggle" title="Toggle Dark/Light Mode">
            <span class="toggle-label" style="color: #ffe88a; font-size: 1.2rem;" title="Dark Mode">🌙</span>
        ;
        banner.appendChild(toggleContainer);

        const themeToggle = document.getElementById('theme-toggle');
        
        // Default is dark mode. If localStorage has 'light', switch to light.
        const currentTheme = localStorage.getItem('emposim-theme');
        if (currentTheme === 'light') {
            document.body.classList.add('light-mode');
            themeToggle.checked = false; // Let's say checked = Dark Mode, unchecked = Light Mode.
        } else {
            themeToggle.checked = true; // Dark mode is default
        }

        themeToggle.addEventListener('change', (e) => {
            if (e.target.checked) {
                document.body.classList.remove('light-mode');
                localStorage.setItem('emposim-theme', 'dark');
            } else {
                document.body.classList.add('light-mode');
                localStorage.setItem('emposim-theme', 'light');
            }
        });
    }
});

/**
 * ============================================================
 * EMPOSIM — Landing Page Verification Script
 * ============================================================
 * 
 * Simulates a "Performance Security Verification" check with:
 * - Animated progress bar (0% → 100%)
 * - Status messages cycling at each phase
 * - Checkmark items appearing sequentially
 * - Auto-redirect to register.html after completion
 * 
 * Total duration: ~4 seconds
 * ============================================================
 */

document.addEventListener('DOMContentLoaded', function () {

    // ---- DOM Elements ----
    const progressBar = document.getElementById('progress-bar');
    const statusText  = document.getElementById('status-text');
    const percentText = document.getElementById('percent-text');

    // ---- Configuration ----
    const TOTAL_DURATION = 4000;   // Total animation time in ms
    const UPDATE_INTERVAL = 50;    // How often we update the progress bar
    const REDIRECT_URL = 'register.html';

    // Status messages shown at different progress percentages
    const statusMessages = [
        { at: 0,   text: 'Initializing secure connection...' },
        { at: 25,  text: 'Verifying system integrity...' },
        { at: 50,  text: 'Authenticating credentials...' },
        { at: 75,  text: 'Loading event portal...' },
        { at: 100, text: 'Verification complete!' }
    ];

    // Checkmark items to reveal at specific percentages
    const checkItems = [
        { at: 25,  id: 'check-1' },
        { at: 50,  id: 'check-2' },
        { at: 75,  id: 'check-3' },
        { at: 100, id: 'check-4' }
    ];

    // ---- Animation State ----
    let currentProgress = 0;
    const increment = 100 / (TOTAL_DURATION / UPDATE_INTERVAL);

    // ---- Progress Animation Loop ----
    const interval = setInterval(function () {
        currentProgress += increment;

        // Clamp to 100
        if (currentProgress >= 100) {
            currentProgress = 100;
            clearInterval(interval);

            // Redirect after a short delay
            setTimeout(function () {
                window.location.href = REDIRECT_URL;
            }, 800);
        }

        const rounded = Math.round(currentProgress);

        // Update progress bar width
        progressBar.style.width = rounded + '%';
        percentText.textContent = rounded + '%';

        // Update status message based on progress
        for (let i = statusMessages.length - 1; i >= 0; i--) {
            if (rounded >= statusMessages[i].at) {
                statusText.textContent = statusMessages[i].text;
                break;
            }
        }

        // Reveal checkmark items
        checkItems.forEach(function (item) {
            const el = document.getElementById(item.id);
            if (rounded >= item.at) {
                el.classList.add('visible', 'completed');
            } else if (rounded >= item.at - 20) {
                // Show as "active" (in-progress) just before completion
                el.classList.add('visible', 'active');
            }
        });

    }, UPDATE_INTERVAL);
});

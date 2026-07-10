/**
 * ============================================================
 * EMPOSIM — Verification Mid-Step Script
 * ============================================================
 * 
 * A simple auto-redirect script.
 * Waits 2 seconds, then redirects the user to the upload page
 * (payment screenshot upload).
 * ============================================================
 */

document.addEventListener('DOMContentLoaded', function () {
    // Auto-redirect after 2 seconds
    setTimeout(function () {
        if (sessionStorage.getItem('payment_mode') === 'offline') {
            window.location.href = 'status.html';
        } else {
            window.location.href = 'upload.html';
        }
    }, 2000);
});

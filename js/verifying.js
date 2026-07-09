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
    // Auto-redirect to upload page after 2 seconds
    setTimeout(function () {
        window.location.href = 'upload.html';
    }, 2000);
});

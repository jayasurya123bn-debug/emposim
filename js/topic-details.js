/**
 * ============================================================
 * EMPOSIM — Topic Details / Confirmation Script
 * ============================================================
 * 
 * Reads the selected event from sessionStorage (set by select-topic.js)
 * and populates the confirmation page with event details.
 * 
 * Also handles the Online/Offline toggle (display only) and
 * saves the payment mode before redirecting to payment.html.
 * ============================================================
 */

document.addEventListener('DOMContentLoaded', function () {
    // ---- Auth Check ----
    if (!sessionStorage.getItem('student_id')) {
        window.location.href = 'register.html';
        return;
    }

    // ---- Read selected event from sessionStorage ----
    var eventName  = sessionStorage.getItem('selected_event_name')  || 'Not Selected';
    var eventVenue = sessionStorage.getItem('selected_event_venue') || 'TBD';
    var eventFee   = sessionStorage.getItem('selected_event_fee')   || '0';

    // ---- Populate detail rows ----
    document.getElementById('detail-topic').textContent = eventName;
    document.getElementById('detail-fee').textContent   = '₹' + parseFloat(eventFee).toFixed(0);
    document.getElementById('detail-venue').textContent  = eventVenue;

    // ---- Toggle Switch Logic (Removed) ----
    // Toggle UI has been replaced by separate buttons

    // ---- If no event selected, redirect back ----
    if (!sessionStorage.getItem('selected_event_name')) {
        window.location.href = 'select-topic.html';
    }
});

/**
 * Proceed to payment page
 * Saves payment mode to sessionStorage
 */
function proceedToPayment(mode) {
    sessionStorage.setItem('payment_mode', mode || 'online');
    window.location.href = 'payment.html';
}

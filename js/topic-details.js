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

    // ---- Read selected event from sessionStorage ----
    var eventName  = sessionStorage.getItem('selected_event_name')  || 'Not Selected';
    var eventVenue = sessionStorage.getItem('selected_event_venue') || 'TBD';
    var eventFee   = sessionStorage.getItem('selected_event_fee')   || '0';

    // ---- Populate detail rows ----
    document.getElementById('detail-topic').textContent = eventName;
    document.getElementById('detail-fee').textContent   = '₹' + parseFloat(eventFee).toFixed(0);
    document.getElementById('detail-venue').textContent  = eventVenue;

    // ---- Toggle Switch Logic ----
    var toggle      = document.getElementById('mode-toggle');
    var labelOnline = document.getElementById('label-online');
    var labelOffline = document.getElementById('label-offline');

    function updateToggleLabels() {
        if (toggle.checked) {
            labelOnline.classList.add('active');
            labelOffline.classList.remove('active');
        } else {
            labelOffline.classList.add('active');
            labelOnline.classList.remove('active');
        }
    }

    toggle.addEventListener('change', updateToggleLabels);
    updateToggleLabels(); // Set initial state

    // ---- If no event selected, redirect back ----
    if (!sessionStorage.getItem('selected_event_name')) {
        window.location.href = 'select-topic.html';
    }
});

/**
 * Proceed to payment page
 * Saves payment mode to sessionStorage
 */
function proceedToPayment() {
    var toggle = document.getElementById('mode-toggle');
    var paymentMode = toggle.checked ? 'online' : 'offline';

    sessionStorage.setItem('payment_mode', paymentMode);
    window.location.href = 'payment.html';
}

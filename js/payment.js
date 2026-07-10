/**
 * ============================================================
 * EMPOSIM — Payment Page Script
 * ============================================================
 * 
 * Handles:
 * 1. Populating payment summary from sessionStorage
 * 2. Generating QR code with dynamic amount
 * 3. 5-minute countdown timer
 * 4. Disabling "Proceed" button on timeout
 * 5. Saving topic selection to backend on proceed
 * ============================================================
 */

document.addEventListener('DOMContentLoaded', function () {

    // ---- DOM Elements ----
    var minutesEl      = document.getElementById('timer-minutes');
    var secondsEl      = document.getElementById('timer-seconds');
    var countdownEl    = document.getElementById('countdown');
    var proceedBtn     = document.getElementById('proceed-btn');
    var timeoutMsg     = document.getElementById('timeout-message');
    var qrCode         = document.getElementById('qr-code');

    // ---- Read event details from sessionStorage ----
    var eventName   = sessionStorage.getItem('selected_event_name')  || 'Not Selected';
    var eventVenue  = sessionStorage.getItem('selected_event_venue') || 'TBD';
    var eventFee    = sessionStorage.getItem('selected_event_fee')   || '100';
    var paymentMode = sessionStorage.getItem('payment_mode')         || 'online';

    // ---- Populate summary ----
    document.getElementById('pay-event').textContent = eventName;
    document.getElementById('pay-venue').textContent  = eventVenue;
    document.getElementById('pay-mode').textContent   = paymentMode.charAt(0).toUpperCase() + paymentMode.slice(1);
    document.getElementById('pay-total').textContent   = '₹' + parseFloat(eventFee).toFixed(0);

    if (paymentMode === 'offline') {
        document.getElementById('payment-instruction').textContent = 'Please pay the cash at the venue counter on the event day.';
        document.getElementById('qr-section').style.display = 'none';
        proceedBtn.textContent = '✅ I Will Pay at the Venue — Proceed';
    } else {
        // ---- Generate QR with dynamic amount ----
        var upiString = 'upi://pay?pa=gtec@upi&pn=GTEC%20Emposim&am=' + parseFloat(eventFee).toFixed(2);
        qrCode.src = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + encodeURIComponent(upiString);
    }

    // ---- Countdown Timer (5 minutes = 300 seconds) ----
    var totalSeconds = 5 * 60; // 300 seconds
    var timerExpired = false;

    var timerInterval = setInterval(function () {
        totalSeconds--;

        if (totalSeconds <= 0) {
            totalSeconds = 0;
            timerExpired = true;
            clearInterval(timerInterval);
            onTimerExpired();
        }

        // Calculate minutes and seconds
        var mins = Math.floor(totalSeconds / 60);
        var secs = totalSeconds % 60;

        // Update display with zero-padding
        minutesEl.textContent = mins < 10 ? '0' + mins : mins;
        secondsEl.textContent = secs < 10 ? '0' + secs : secs;

        // Add warning class when under 1 minute
        if (totalSeconds <= 60 && totalSeconds > 0) {
            countdownEl.classList.add('warning');
            countdownEl.classList.remove('expired');
        }

    }, 1000);

    /**
     * Called when the countdown timer reaches zero
     * Disables the proceed button and shows timeout message
     */
    function onTimerExpired() {
        countdownEl.classList.remove('warning');
        countdownEl.classList.add('expired');
        minutesEl.textContent = '00';
        secondsEl.textContent = '00';

        // Disable proceed button
        proceedBtn.disabled = true;
        proceedBtn.textContent = '⏰ Session Expired';

        // Show timeout message
        timeoutMsg.classList.add('visible');
    }

    // ---- Make handleProceed globally accessible ----
    window.handleProceed = function () {
        if (timerExpired) return;

        // Show loading state
        proceedBtn.classList.add('btn--loading');
        proceedBtn.disabled = true;

        // Save topic selection to backend
        var studentId = sessionStorage.getItem('student_id');

        if (studentId) {
            fetch('/api/select-topic', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    student_id:   parseInt(studentId),
                    event_topic:  eventName,
                    entry_fee:    parseFloat(eventFee),
                    payment_mode: paymentMode
                })
            })
            .then(function (res) { return res.json(); })
            .then(function (data) {
                // Redirect regardless (data might not save if backend is down)
                window.location.href = 'verifying.html';
            })
            .catch(function () {
                // Still redirect even if backend call fails
                window.location.href = 'verifying.html';
            });
        } else {
            // No student_id (backend might be unavailable) — redirect anyway
            window.location.href = 'verifying.html';
        }
    };
});

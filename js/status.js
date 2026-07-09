/**
 * ============================================================
 * EMPOSIM — Status Check Script
 * ============================================================
 * 
 * Allows students to check their registration & approval status
 * by entering their email or registration ID.
 * 
 * Shows: status badge, registration details, and timeline.
 * ============================================================
 */

document.addEventListener('DOMContentLoaded', function () {

    var form       = document.getElementById('status-form');
    var checkBtn   = document.getElementById('check-btn');
    var alertArea  = document.getElementById('alert-area');
    var resultArea = document.getElementById('status-result');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        alertArea.innerHTML = '';
        resultArea.classList.remove('visible');

        var input = document.getElementById('status-email').value.trim();

        if (!input) {
            showAlert('Please enter your email or registration ID.', 'error');
            return;
        }

        // Check if input is an ID like #EMP0001 → extract number
        var studentId = null;
        var email = null;

        if (input.startsWith('#EMP') || input.startsWith('#emp')) {
            studentId = parseInt(input.replace(/[^0-9]/g, ''));
        } else {
            email = input;
        }

        checkBtn.classList.add('btn--loading');
        checkBtn.disabled = true;

        var queryParam = email ? 'email=' + encodeURIComponent(email) : 'id=' + studentId;

        fetch('/api/check-status?' + queryParam)
            .then(function (res) { return res.json(); })
            .then(function (data) {
                checkBtn.classList.remove('btn--loading');
                checkBtn.disabled = false;

                if (data.success) {
                    displayResult(data.student);
                } else {
                    showAlert(data.message || 'No registration found.', 'error');
                }
            })
            .catch(function () {
                checkBtn.classList.remove('btn--loading');
                checkBtn.disabled = false;
                showAlert('Server unavailable. Please ensure XAMPP is running.', 'error');
            });
    });

    function displayResult(student) {
        // Name and email
        document.getElementById('result-name').textContent = student.student_name;
        document.getElementById('result-email').textContent = 'Registration #EMP' + String(student.id).padStart(4, '0');

        // Status badge
        var badge = document.getElementById('result-badge');
        var status = student.status || 'pending';
        badge.className = 'status-big-badge status-big-badge--' + status;

        var statusIcons = { pending: '⏳', approved: '✅', rejected: '❌' };
        var statusLabels = { pending: 'Pending Review', approved: 'Approved', rejected: 'Rejected' };
        badge.textContent = (statusIcons[status] || '') + ' ' + (statusLabels[status] || status);

        // Details
        document.getElementById('detail-email').textContent = student.email || '—';
        document.getElementById('detail-phone').textContent = student.phone || '—';
        document.getElementById('detail-college').textContent = student.college || '—';
        document.getElementById('detail-event').textContent = student.event_topic || 'Not selected';
        document.getElementById('detail-fee').textContent = student.entry_fee ? '₹' + parseFloat(student.entry_fee).toFixed(0) : '—';
        document.getElementById('detail-mode').textContent = student.payment_mode ? student.payment_mode.charAt(0).toUpperCase() + student.payment_mode.slice(1) : '—';
        document.getElementById('detail-screenshot').textContent = student.payment_screenshot ? 'Uploaded ✅' : 'Not uploaded';

        // Timeline
        var timeline = document.getElementById('timeline');
        var steps = [
            { title: 'Registered', done: true, time: student.created_at || '' },
            { title: 'Event Selected', done: !!student.event_topic, time: '' },
            { title: 'Payment Screenshot Uploaded', done: !!student.payment_screenshot, time: '' },
            { title: 'Admin Review', done: status !== 'pending', time: status === 'approved' ? 'Approved ✅' : status === 'rejected' ? 'Rejected ❌' : 'Waiting...' }
        ];

        timeline.innerHTML = steps.map(function (step, i) {
            var cls = step.done ? 'done' : (i > 0 && steps[i - 1].done && !step.done ? 'current' : '');
            return '<div class="timeline-item ' + cls + '">' +
                '<div class="timeline-item__title">' + step.title + '</div>' +
                '<div class="timeline-item__time">' + step.time + '</div>' +
            '</div>';
        }).join('');

        resultArea.classList.add('visible');

        // Scroll to result
        resultArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function showAlert(message, type) {
        alertArea.innerHTML = '<div class="alert alert--' + type + '">⚠️ ' + message + '</div>';
        setTimeout(function () { alertArea.innerHTML = ''; }, 5000);
    }
});

/**
 * ============================================================
 * EMPOSIM — Student Login Script
 * ============================================================
 * 
 * Handles:
 * 1. Email/Phone tab switching
 * 2. Form validation
 * 3. Login via fetch() to php/login_student.php
 * 4. On success → redirect to events.html
 * ============================================================
 */

document.addEventListener('DOMContentLoaded', function () {

    var form       = document.getElementById('login-form');
    var loginBtn   = document.getElementById('login-btn');
    var alertArea  = document.getElementById('alert-area');
    var activeTab  = 'email'; // 'email' or 'phone'

    // ---- Tab Switching ----
    window.switchTab = function (tab) {
        activeTab = tab;

        // Update tab buttons
        document.getElementById('tab-email').classList.toggle('active', tab === 'email');
        document.getElementById('tab-phone').classList.toggle('active', tab === 'phone');

        // Show/hide fields
        document.getElementById('field-email').style.display = tab === 'email' ? 'block' : 'none';
        document.getElementById('field-phone').style.display = tab === 'phone' ? 'block' : 'none';

        // Clear errors
        hideAllErrors();
    };

    function showAlert(message, type) {
        alertArea.innerHTML = '<div class="alert alert--' + type + '">' +
            (type === 'error' ? '⚠️ ' : '✅ ') + message + '</div>';
        setTimeout(function () { alertArea.innerHTML = ''; }, 5000);
    }

    function toggleError(id, show) {
        var el = document.getElementById(id);
        if (el) el.classList.toggle('visible', show);
    }

    function hideAllErrors() {
        toggleError('error-email', false);
        toggleError('error-phone', false);
        toggleError('error-password', false);
    }

    // ---- Form Submission ----
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        hideAllErrors();
        alertArea.innerHTML = '';

        var password = document.getElementById('login-password').value;
        var identifier = '';
        var valid = true;

        // Validate based on active tab
        if (activeTab === 'email') {
            identifier = document.getElementById('login-email').value.trim();
            var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(identifier)) {
                toggleError('error-email', true);
                valid = false;
            }
        } else {
            identifier = document.getElementById('login-phone').value.trim();
            var phoneRegex = /^[0-9]{10}$/;
            if (!phoneRegex.test(identifier)) {
                toggleError('error-phone', true);
                valid = false;
            }
        }

        if (!password) {
            toggleError('error-password', true);
            valid = false;
        }

        if (!valid) {
            showAlert('Please fix the errors below.', 'error');
            return;
        }

        // Show loading
        loginBtn.classList.add('btn--loading');
        loginBtn.disabled = true;

        // Send to backend
        fetch('php/login_student.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                identifier: identifier,
                login_type: activeTab,
                password: password
            })
        })
        .then(function (res) { return res.json(); })
        .then(function (data) {
            loginBtn.classList.remove('btn--loading');
            loginBtn.disabled = false;

            if (data.success) {
                // Store student info
                sessionStorage.setItem('student_id', data.student_id);
                sessionStorage.setItem('student_name', data.student_name);
                sessionStorage.setItem('student_email', data.email);

                showAlert('Login successful! Redirecting...', 'success');
                setTimeout(function () {
                    window.location.href = 'events.html';
                }, 800);
            } else {
                showAlert(data.message || 'Invalid credentials.', 'error');
            }
        })
        .catch(function (err) {
            loginBtn.classList.remove('btn--loading');
            loginBtn.disabled = false;
            showAlert('Server unavailable. Please ensure XAMPP is running.', 'error');
            console.error('Login error:', err);
        });
    });
});

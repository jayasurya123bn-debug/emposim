/**
 * ============================================================
 * EMPOSIM — Admin Login Script
 * ============================================================
 * 
 * Handles admin login form submission.
 * Sends credentials to php/login.php for validation.
 * On success, redirects to dashboard.html.
 * 
 * Default credentials: admin / admin123
 * ============================================================
 */

document.addEventListener('DOMContentLoaded', function () {

    var form      = document.getElementById('login-form');
    var loginBtn  = document.getElementById('login-btn');
    var alertArea = document.getElementById('alert-area');

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        var username = document.getElementById('username').value.trim();
        var password = document.getElementById('password').value;

        if (!username || !password) {
            showAlert('Please enter both username and password.', 'error');
            return;
        }

        // Show loading
        loginBtn.disabled = true;
        loginBtn.textContent = 'Signing in...';

        // Send to backend
        fetch('/api/admin-login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: username, password: password })
        })
        .then(function (res) { return res.json(); })
        .then(function (data) {
            if (data.success) {
                sessionStorage.setItem('admin_logged_in', 'true');
                window.location.href = 'dashboard.html';
            } else {
                showAlert(data.message || 'Invalid credentials.', 'error');
                loginBtn.disabled = false;
                loginBtn.textContent = 'Sign In →';
            }
        })
        .catch(function () {
            // Fallback: check hardcoded credentials client-side
            // (for demo when PHP backend is not running)
            if (username === 'admin' && password === 'admin123') {
                sessionStorage.setItem('admin_logged_in', 'true');
                window.location.href = 'dashboard.html';
            } else {
                showAlert('Invalid credentials. Try admin / admin123', 'error');
                loginBtn.disabled = false;
                loginBtn.textContent = 'Sign In →';
            }
        });
    });

    function showAlert(message, type) {
        alertArea.innerHTML = '<div class="alert alert--' + type + '">⚠️ ' + message + '</div>';
        setTimeout(function () { alertArea.innerHTML = ''; }, 4000);
    }
});

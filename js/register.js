/**
 * ============================================================
 * EMPOSIM — Registration Form Script
 * ============================================================
 * 
 * Handles client-side validation and form submission.
 * - Validates: name, email (regex), password (min 6), phone (10 digits),
 *   college, year, department
 * - Sends data via fetch() POST to php/register.php
 * - On success: stores student_id in sessionStorage, redirects to events.html
 * ============================================================
 */

document.addEventListener('DOMContentLoaded', function () {

    const form      = document.getElementById('register-form');
    const submitBtn = document.getElementById('submit-btn');
    const alertArea = document.getElementById('alert-area');

    // ---- Validation Patterns ----
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    /**
     * Show an alert message above the form
     * @param {string} message - Alert text
     * @param {string} type - 'success', 'error', 'warning', 'info'
     */
    function showAlert(message, type) {
        alertArea.innerHTML = '<div class="alert alert--' + type + '">' +
            (type === 'error' ? '⚠️ ' : type === 'success' ? '✅ ' : 'ℹ️ ') +
            message + '</div>';
        
        // Auto-hide after 5 seconds
        setTimeout(function () {
            alertArea.innerHTML = '';
        }, 5000);
    }

    /**
     * Show/hide individual field error
     * @param {string} fieldId - Error element ID
     * @param {boolean} show - Whether to show the error
     */
    function toggleError(fieldId, show) {
        var el = document.getElementById(fieldId);
        if (el) {
            el.classList.toggle('visible', show);
        }
    }

    /**
     * Validate all form fields
     * @returns {boolean} True if all fields are valid
     */
    function validateForm() {
        var isValid = true;

        // Full Name
        var name = document.getElementById('student_name').value.trim();
        if (name.length < 2) {
            toggleError('error-name', true);
            isValid = false;
        } else {
            toggleError('error-name', false);
        }

        // Email
        var email = document.getElementById('email').value.trim();
        if (!emailRegex.test(email)) {
            toggleError('error-email', true);
            isValid = false;
        } else {
            toggleError('error-email', false);
        }

        // Password
        var password = document.getElementById('password').value;
        if (password.length < 6) {
            toggleError('error-password', true);
            isValid = false;
        } else {
            toggleError('error-password', false);
        }

        // Phone
        var phone = document.getElementById('phone').value.trim();
        if (!phoneRegex.test(phone)) {
            toggleError('error-phone', true);
            isValid = false;
        } else {
            toggleError('error-phone', false);
        }

        // College
        var college = document.getElementById('college').value.trim();
        if (college.length < 2) {
            toggleError('error-college', true);
            isValid = false;
        } else {
            toggleError('error-college', false);
        }

        // Year
        var year = document.getElementById('year').value;
        if (!year) {
            toggleError('error-year', true);
            isValid = false;
        } else {
            toggleError('error-year', false);
        }

        // Department
        var department = document.getElementById('department').value;
        if (!department) {
            toggleError('error-department', true);
            isValid = false;
        } else {
            toggleError('error-department', false);
        }

        return isValid;
    }

    // ---- Form Submission ----
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Clear previous alerts
        alertArea.innerHTML = '';

        // Validate
        if (!validateForm()) {
            showAlert('Please fix the errors below.', 'error');
            return;
        }

        // Collect form data
        var formData = {
            student_name: document.getElementById('student_name').value.trim(),
            email:        document.getElementById('email').value.trim(),
            password:     document.getElementById('password').value,
            phone:        document.getElementById('phone').value.trim(),
            college:      document.getElementById('college').value.trim(),
            year:         document.getElementById('year').value,
            department:   document.getElementById('department').value
        };

        // Show loading state
        submitBtn.classList.add('btn--loading');
        submitBtn.disabled = true;

        // Send to Vercel API backend
        fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })
        .then(function (response) { return response.json(); })
        .then(function (data) {
            submitBtn.classList.remove('btn--loading');
            submitBtn.disabled = false;

            if (data.success) {
                // Store student ID for subsequent pages
                sessionStorage.setItem('student_id', data.student_id);
                sessionStorage.setItem('student_name', formData.student_name);
                sessionStorage.setItem('student_email', formData.email);

                showAlert('Registration successful! Redirecting...', 'success');

                // Redirect to events page
                setTimeout(function () {
                    window.location.href = 'events.html';
                }, 1000);
            } else {
                showAlert(data.message || 'Registration failed. Please try again.', 'error');
            }
        })
        .catch(function (error) {
            submitBtn.classList.remove('btn--loading');
            submitBtn.disabled = false;
            showAlert('Network error. Please check your connection and try again.', 'error');
            console.error('Registration error:', error);
        });
    });

    // ---- Real-time validation on blur ----
    document.getElementById('email').addEventListener('blur', function () {
        toggleError('error-email', this.value.trim() && !emailRegex.test(this.value.trim()));
    });

    document.getElementById('phone').addEventListener('blur', function () {
        toggleError('error-phone', this.value.trim() && !phoneRegex.test(this.value.trim()));
    });

    document.getElementById('password').addEventListener('blur', function () {
        toggleError('error-password', this.value && this.value.length < 6);
    });
});

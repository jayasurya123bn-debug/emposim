/**
 * ============================================================
 * EMPOSIM — Forgot Password Script
 * ============================================================
 * 
 * Multi-step flow:
 * Step 1: Enter email → sends verification code
 * Step 2: Enter 6-digit OTP code → verify code
 * Step 3: Set new password → reset password
 * Step 4: Success message
 * 
 * NOTE: Since this is a college project without SMTP,
 * the verification code is displayed on screen for demo.
 * In production, you'd use PHPMailer to send via email.
 * ============================================================
 */

document.addEventListener('DOMContentLoaded', function () {

    var resetEmail = '';
    var verificationCode = '';

    // ---- STEP 1: Send Verification Code ----
    document.getElementById('email-form').addEventListener('submit', function (e) {
        e.preventDefault();

        var email = document.getElementById('reset-email').value.trim();
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            showAlert('alert-area-1', 'Please enter a valid email address.', 'error');
            return;
        }

        var btn = document.getElementById('send-code-btn');
        btn.classList.add('btn--loading');
        btn.disabled = true;

        fetch('php/forgot_password.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email })
        })
        .then(function (res) { return res.json(); })
        .then(function (data) {
            btn.classList.remove('btn--loading');
            btn.disabled = false;

            if (data.success) {
                resetEmail = email;
                verificationCode = data.code || ''; // Demo: code returned in response

                document.getElementById('display-email').textContent = email;
                document.getElementById('demo-code-value').textContent = verificationCode;

                switchStep('step-verify');
                startResendTimer();

                // Focus first OTP input
                document.querySelector('.otp-input[data-index="0"]').focus();
            } else {
                showAlert('alert-area-1', data.message || 'Failed to send code.', 'error');
            }
        })
        .catch(function () {
            btn.classList.remove('btn--loading');
            btn.disabled = false;
            showAlert('alert-area-1', 'Server unavailable. Please ensure XAMPP is running.', 'error');
        });
    });

    // ---- OTP Input Auto-Focus Logic ----
    var otpInputs = document.querySelectorAll('.otp-input');

    otpInputs.forEach(function (input, index) {
        input.addEventListener('input', function () {
            // Only allow digits
            this.value = this.value.replace(/[^0-9]/g, '');

            if (this.value && index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
            }

            // Add filled class
            this.classList.toggle('filled', this.value !== '');

            // Check if all filled
            var allFilled = Array.from(otpInputs).every(function (inp) {
                return inp.value !== '';
            });
            document.getElementById('verify-code-btn').disabled = !allFilled;
        });

        input.addEventListener('keydown', function (e) {
            // Backspace: go to previous input
            if (e.key === 'Backspace' && !this.value && index > 0) {
                otpInputs[index - 1].focus();
            }
        });

        // Allow paste
        input.addEventListener('paste', function (e) {
            e.preventDefault();
            var pasted = (e.clipboardData || window.clipboardData).getData('text').replace(/[^0-9]/g, '');
            for (var i = 0; i < Math.min(pasted.length, otpInputs.length); i++) {
                otpInputs[i].value = pasted[i];
                otpInputs[i].classList.add('filled');
            }
            if (pasted.length >= otpInputs.length) {
                document.getElementById('verify-code-btn').disabled = false;
                otpInputs[otpInputs.length - 1].focus();
            }
        });
    });

    // ---- STEP 2: Verify Code ----
    window.verifyCode = function () {
        var enteredCode = Array.from(otpInputs).map(function (inp) {
            return inp.value;
        }).join('');

        if (enteredCode.length !== 6) {
            showAlert('alert-area-2', 'Please enter the complete 6-digit code.', 'error');
            return;
        }

        var btn = document.getElementById('verify-code-btn');
        btn.classList.add('btn--loading');
        btn.disabled = true;

        fetch('php/verify_code.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: resetEmail, code: enteredCode })
        })
        .then(function (res) { return res.json(); })
        .then(function (data) {
            btn.classList.remove('btn--loading');

            if (data.success) {
                switchStep('step-reset');
            } else {
                btn.disabled = false;
                showAlert('alert-area-2', data.message || 'Invalid code.', 'error');
                // Clear inputs
                otpInputs.forEach(function (inp) {
                    inp.value = '';
                    inp.classList.remove('filled');
                });
                otpInputs[0].focus();
            }
        })
        .catch(function () {
            btn.classList.remove('btn--loading');
            btn.disabled = false;
            showAlert('alert-area-2', 'Server error. Please try again.', 'error');
        });
    };

    // ---- STEP 3: Reset Password ----
    document.getElementById('reset-form').addEventListener('submit', function (e) {
        e.preventDefault();

        var newPass    = document.getElementById('new-password').value;
        var confirmPass = document.getElementById('confirm-password').value;

        if (newPass.length < 6) {
            showAlert('alert-area-3', 'Password must be at least 6 characters.', 'error');
            return;
        }

        if (newPass !== confirmPass) {
            showAlert('alert-area-3', 'Passwords do not match.', 'error');
            return;
        }

        var btn = document.getElementById('reset-btn');
        btn.classList.add('btn--loading');
        btn.disabled = true;

        fetch('php/reset_password.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: resetEmail, password: newPass })
        })
        .then(function (res) { return res.json(); })
        .then(function (data) {
            btn.classList.remove('btn--loading');

            if (data.success) {
                switchStep('step-success');
            } else {
                btn.disabled = false;
                showAlert('alert-area-3', data.message || 'Reset failed.', 'error');
            }
        })
        .catch(function () {
            btn.classList.remove('btn--loading');
            btn.disabled = false;
            showAlert('alert-area-3', 'Server error. Please try again.', 'error');
        });
    });

    // ---- Resend Timer ----
    var resendSeconds = 30;
    var resendInterval;

    function startResendTimer() {
        resendSeconds = 30;
        var timerEl = document.getElementById('resend-timer');
        var linkEl  = document.getElementById('resend-link');
        linkEl.classList.add('disabled');

        clearInterval(resendInterval);
        resendInterval = setInterval(function () {
            resendSeconds--;
            timerEl.textContent = resendSeconds;

            if (resendSeconds <= 0) {
                clearInterval(resendInterval);
                linkEl.classList.remove('disabled');
                linkEl.innerHTML = 'Resend Code';
            }
        }, 1000);
    }

    window.resendCode = function () {
        document.getElementById('email-form').dispatchEvent(new Event('submit'));
    };

    // ---- Helpers ----
    function switchStep(stepId) {
        document.querySelectorAll('.step-panel').forEach(function (el) {
            el.classList.remove('active');
        });
        document.getElementById(stepId).classList.add('active');
    }

    function showAlert(areaId, message, type) {
        var area = document.getElementById(areaId);
        area.innerHTML = '<div class="alert alert--' + type + '">' +
            (type === 'error' ? '⚠️ ' : '✅ ') + message + '</div>';
        setTimeout(function () { area.innerHTML = ''; }, 5000);
    }
});

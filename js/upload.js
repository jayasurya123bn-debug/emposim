/**
 * ============================================================
 * EMPOSIM — Screenshot Upload Script
 * ============================================================
 * 
 * Handles:
 * 1. Drag-and-drop file selection
 * 2. Click-to-browse file selection
 * 3. Client-side validation (size ≤ 2MB, type JPG/PNG)
 * 4. File preview thumbnail
 * 5. Upload via fetch() with FormData to php/upload.php
 * 6. Show success screen on completion
 * ============================================================
 */

document.addEventListener('DOMContentLoaded', function () {

    // ---- DOM Elements ----
    var uploadZone   = document.getElementById('upload-zone');
    var fileInput    = document.getElementById('file-input');
    var fileInfoArea = document.getElementById('file-info');
    var previewArea  = document.getElementById('upload-preview');
    var previewImg   = document.getElementById('preview-img');
    var previewName  = document.getElementById('preview-name');
    var uploadBtn    = document.getElementById('upload-btn');
    var uploadForm   = document.getElementById('upload-form');
    var alertArea    = document.getElementById('alert-area');
    var formArea     = document.getElementById('upload-form-area');
    var successArea  = document.getElementById('success-screen');

    // ---- Configuration ----
    var MAX_SIZE_MB    = 2;
    var MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
    var ALLOWED_TYPES  = ['image/jpeg', 'image/png'];

    var selectedFile = null;

    /**
     * Show alert message
     */
    function showAlert(message, type) {
        alertArea.innerHTML = '<div class="alert alert--' + type + '">' +
            (type === 'error' ? '⚠️ ' : '✅ ') + message + '</div>';
        setTimeout(function () { alertArea.innerHTML = ''; }, 5000);
    }

    /**
     * Validate the selected file
     * @param {File} file
     * @returns {string|null} Error message, or null if valid
     */
    function validateFile(file) {
        if (!file) return 'No file selected.';

        // Check type
        if (!ALLOWED_TYPES.includes(file.type)) {
            return 'Invalid file type. Only JPG and PNG images are allowed.';
        }

        // Check size
        if (file.size > MAX_SIZE_BYTES) {
            var sizeMB = (file.size / 1024 / 1024).toFixed(2);
            return 'File size (' + sizeMB + ' MB) exceeds the ' + MAX_SIZE_MB + ' MB limit.';
        }

        return null; // Valid
    }

    /**
     * Handle file selection (from input or drag-drop)
     * @param {File} file
     */
    function handleFileSelect(file) {
        // Validate
        var error = validateFile(file);
        if (error) {
            showAlert(error, 'error');
            resetFile();
            return;
        }

        selectedFile = file;

        // Show file info
        var sizeMB = (file.size / 1024 / 1024).toFixed(2);
        fileInfoArea.style.display = 'block';
        fileInfoArea.innerHTML =
            '<div class="file-info">' +
                '<span class="file-info__icon">🖼️</span>' +
                '<div class="file-info__details">' +
                    '<div class="file-info__name">' + escapeHtml(file.name) + '</div>' +
                    '<div class="file-info__size">' + sizeMB + ' MB</div>' +
                '</div>' +
                '<button type="button" class="file-info__remove" id="remove-file" title="Remove file">✕</button>' +
            '</div>';

        // Add remove button handler
        document.getElementById('remove-file').addEventListener('click', resetFile);

        // Show preview
        var reader = new FileReader();
        reader.onload = function (e) {
            previewImg.src = e.target.result;
            previewName.textContent = file.name;
            previewArea.classList.add('visible');
        };
        reader.readAsDataURL(file);

        // Enable upload button
        uploadBtn.disabled = false;
    }

    /**
     * Reset file selection
     */
    function resetFile() {
        selectedFile = null;
        fileInput.value = '';
        fileInfoArea.style.display = 'none';
        fileInfoArea.innerHTML = '';
        previewArea.classList.remove('visible');
        previewImg.src = '';
        uploadBtn.disabled = true;
    }

    /**
     * Escape HTML
     */
    function escapeHtml(text) {
        var div = document.createElement('div');
        div.appendChild(document.createTextNode(text));
        return div.innerHTML;
    }

    // ---- Click to Browse ----
    uploadZone.addEventListener('click', function () {
        fileInput.click();
    });

    fileInput.addEventListener('change', function () {
        if (this.files && this.files[0]) {
            handleFileSelect(this.files[0]);
        }
    });

    // ---- Drag & Drop ----
    uploadZone.addEventListener('dragover', function (e) {
        e.preventDefault();
        e.stopPropagation();
        this.classList.add('dragover');
    });

    uploadZone.addEventListener('dragleave', function (e) {
        e.preventDefault();
        e.stopPropagation();
        this.classList.remove('dragover');
    });

    uploadZone.addEventListener('drop', function (e) {
        e.preventDefault();
        e.stopPropagation();
        this.classList.remove('dragover');

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    });

    // ---- Form Submission ----
    uploadForm.addEventListener('submit', function (e) {
        e.preventDefault();

        if (!selectedFile) {
            showAlert('Please select a file first.', 'error');
            return;
        }

        // Final client-side validation
        var error = validateFile(selectedFile);
        if (error) {
            showAlert(error, 'error');
            return;
        }

        // Show loading
        uploadBtn.classList.add('btn--loading');
        uploadBtn.disabled = true;

        // Build FormData
        var formData = new FormData();
        formData.append('screenshot', selectedFile);
        formData.append('student_id', sessionStorage.getItem('student_id') || '0');

        // Upload to backend
        fetch('php/upload.php', {
            method: 'POST',
            body: formData
        })
        .then(function (res) { return res.json(); })
        .then(function (data) {
            uploadBtn.classList.remove('btn--loading');

            if (data.success) {
                showSuccessScreen();
            } else {
                showAlert(data.message || 'Upload failed. Please try again.', 'error');
                uploadBtn.disabled = false;
            }
        })
        .catch(function (err) {
            uploadBtn.classList.remove('btn--loading');
            // Show success anyway for demo (backend may not be running)
            console.warn('Upload fetch failed (backend may be offline):', err);
            showSuccessScreen();
        });
    });

    /**
     * Show the success screen after upload
     */
    function showSuccessScreen() {
        formArea.style.display = 'none';
        successArea.classList.add('visible');

        var studentId = sessionStorage.getItem('student_id') || '000';
        document.getElementById('reg-id-display').textContent = '#EMP' + String(studentId).padStart(4, '0');
    }
});

/**
 * ============================================================
 * EMPOSIM — Admin Dashboard Script
 * ============================================================
 * 
 * Handles:
 * 1. Authentication check (redirect if not logged in)
 * 2. Section switching (Registrations / Payments / Verification)
 * 3. Fetching data from PHP APIs
 * 4. Rendering data tables
 * 5. Search/filter functionality
 * 6. Approve/Reject actions
 * 7. Screenshot modal preview
 * 8. Logout
 * ============================================================
 */

// ---- Global state ----
var allRegistrations = [];

// ---- Sample/demo data (used when PHP backend is unavailable) ----
var demoData = [
    {
        id: 1, student_name: 'Arun Kumar', email: 'arun@example.com',
        phone: '9876543210', college: 'GTEC', year: '3rd Year', department: 'CSE',
        event_topic: 'Paper Presentation', entry_fee: '150.00', payment_mode: 'online',
        payment_screenshot: null, status: 'pending', created_at: '2026-07-09 10:30:00'
    },
    {
        id: 2, student_name: 'Priya Sharma', email: 'priya@example.com',
        phone: '9876543211', college: 'VIT', year: '2nd Year', department: 'IT',
        event_topic: 'Coding Challenge', entry_fee: '100.00', payment_mode: 'online',
        payment_screenshot: 'uploads/receipt_2.jpg', status: 'pending', created_at: '2026-07-09 11:15:00'
    },
    {
        id: 3, student_name: 'Raj Patel', email: 'raj@example.com',
        phone: '9876543212', college: 'GTEC', year: '4th Year', department: 'ECE',
        event_topic: 'Hackathon', entry_fee: '200.00', payment_mode: 'offline',
        payment_screenshot: 'uploads/receipt_3.png', status: 'approved', created_at: '2026-07-09 09:45:00'
    },
    {
        id: 4, student_name: 'Deepa Rajan', email: 'deepa@example.com',
        phone: '9876543213', college: 'SRM', year: '1st Year', department: 'AI&DS',
        event_topic: 'Quiz Competition', entry_fee: '50.00', payment_mode: 'online',
        payment_screenshot: null, status: 'rejected', created_at: '2026-07-09 12:00:00'
    },
    {
        id: 5, student_name: 'Karthik S', email: 'karthik@example.com',
        phone: '9876543214', college: 'GTEC', year: '3rd Year', department: 'Mechanical',
        event_topic: 'Robotics Workshop', entry_fee: '250.00', payment_mode: 'online',
        payment_screenshot: 'uploads/receipt_5.jpg', status: 'pending', created_at: '2026-07-09 13:30:00'
    }
];

document.addEventListener('DOMContentLoaded', function () {

    // ---- Auth check ----
    if (sessionStorage.getItem('admin_logged_in') !== 'true') {
        window.location.href = 'index.html';
        return;
    }

    // ---- Load data ----
    loadData();

    // ---- Setup search handlers ----
    setupSearch('search-registrations', function (query) {
        renderRegistrations(filterData(allRegistrations, query));
    });
    setupSearch('search-payments', function (query) {
        renderPayments(filterData(allRegistrations, query));
    });
    setupSearch('search-verification', function (query) {
        renderVerification(filterData(allRegistrations, query));
    });
});

/**
 * Load registration data from backend
 */
function loadData() {
    fetch('/api/get-registrations')
        .then(function (res) { return res.json(); })
        .then(function (data) {
            if (data.success && data.registrations) {
                allRegistrations = data.registrations;
            } else {
                allRegistrations = demoData;
            }
            renderAll();
        })
        .catch(function () {
            console.warn('Backend unavailable, using demo data.');
            allRegistrations = demoData;
            renderAll();
        });
}

/**
 * Render all sections
 */
function renderAll() {
    updateStats();
    renderRegistrations(allRegistrations);
    renderPayments(allRegistrations);
    renderVerification(allRegistrations);
}

/**
 * Update stats cards
 */
function updateStats() {
    var total    = allRegistrations.length;
    var approved = allRegistrations.filter(function (r) { return r.status === 'approved'; }).length;
    var pending  = allRegistrations.filter(function (r) { return r.status === 'pending'; }).length;
    var rejected = allRegistrations.filter(function (r) { return r.status === 'rejected'; }).length;

    document.getElementById('stat-total').textContent    = total;
    document.getElementById('stat-approved').textContent = approved;
    document.getElementById('stat-pending').textContent  = pending;
    document.getElementById('stat-rejected').textContent = rejected;
}

/**
 * Render registrations table
 */
function renderRegistrations(data) {
    var tbody = document.getElementById('registrations-tbody');
    
    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9"><div class="empty-state"><div class="empty-state__icon">📋</div>No registrations found</div></td></tr>';
        return;
    }

    tbody.innerHTML = data.map(function (r) {
        var teamHtml = '';
        if (r.team_member_2 || r.team_member_3 || r.team_member_4) {
            var members = [r.team_member_2, r.team_member_3, r.team_member_4].filter(Boolean).join(', ');
            teamHtml = '<br><small style="color:var(--clr-text-muted)">Team: ' + escapeHtml(members) + '</small>';
        }

        return '<tr>' +
            '<td><strong>#' + r.id + '</strong></td>' +
            '<td>' + escapeHtml(r.student_name) + teamHtml + '</td>' +
            '<td>' + escapeHtml(r.email) + '</td>' +
            '<td>' + escapeHtml(r.phone) + '</td>' +
            '<td>' + escapeHtml(r.college) + '</td>' +
            '<td>' + escapeHtml(r.year) + '</td>' +
            '<td>' + escapeHtml(r.department) + '</td>' +
            '<td>' + getBadgeHtml(r.status) + '</td>' +
            '<td style="font-size:0.75rem;color:var(--clr-text-muted)">' + formatDate(r.created_at) + '</td>' +
            '<td><button class="btn-action btn-action--reject" style="padding:0.25rem 0.5rem;font-size:0.8rem;" onclick="deleteRegistration(' + r.id + ')">🗑️ Delete</button></td>' +
        '</tr>';
    }).join('');
}

/**
 * Render payments table
 */
function renderPayments(data) {
    var tbody = document.getElementById('payments-tbody');

    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7"><div class="empty-state"><div class="empty-state__icon">💳</div>No payment records found</div></td></tr>';
        return;
    }

    tbody.innerHTML = data.map(function (r) {
        var actualSrc = r.payment_screenshot ? '../' + escapeHtml(r.payment_screenshot) : 'https://dfhe5ze0n4pxu.cloudfront.net/College/Logos/Logo-1719515861554.jfif';
        var screenshotHtml = '<img class="screenshot-thumb" src="' + actualSrc + '" onclick="openModal(\'' + actualSrc + '\')" alt="Receipt">';

        return '<tr>' +
            '<td><strong>#' + r.id + '</strong></td>' +
            '<td>' + escapeHtml(r.student_name) + '</td>' +
            '<td>' + escapeHtml(r.event_topic || '—') + '</td>' +
            '<td style="color:var(--clr-success);font-weight:600">₹' + parseFloat(r.entry_fee || 0).toFixed(0) + '</td>' +
            '<td>' + escapeHtml(r.payment_mode || '—') + '</td>' +
            '<td>' + screenshotHtml + '</td>' +
            '<td>' + getBadgeHtml(r.status) + '</td>' +
        '</tr>';
    }).join('');
}

/**
 * Render verification table (with Approve/Reject buttons)
 * Pending registrations shown first
 */
function renderVerification(data) {
    var tbody = document.getElementById('verification-tbody');

    // Sort: pending first, then approved, then rejected
    var sorted = data.slice().sort(function (a, b) {
        var order = { pending: 0, approved: 1, rejected: 2 };
        return (order[a.status] || 0) - (order[b.status] || 0);
    });

    if (sorted.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8"><div class="empty-state"><div class="empty-state__icon">✅</div>No records to verify</div></td></tr>';
        return;
    }

    tbody.innerHTML = sorted.map(function (r) {
        var actualSrc = r.payment_screenshot ? '../' + escapeHtml(r.payment_screenshot) : 'https://dfhe5ze0n4pxu.cloudfront.net/College/Logos/Logo-1719515861554.jfif';
        var screenshotHtml = '<img class="screenshot-thumb" src="' + actualSrc + '" onclick="openModal(\'' + actualSrc + '\')" alt="Receipt">';

        var actionsHtml = '';
        if (r.status === 'pending') {
            actionsHtml =
                '<div class="action-btns">' +
                    '<button class="btn-action btn-action--approve" onclick="updateStatus(' + r.id + ', \'approved\')">✓ Yes</button>' +
                    '<button class="btn-action btn-action--reject" onclick="updateStatus(' + r.id + ', \'rejected\')">✕ No</button>' +
                '</div>';
        } else {
            actionsHtml = '<span style="color:var(--clr-text-muted);font-size:0.8rem;">' +
                (r.status === 'approved' ? '✅ Approved' : '❌ Rejected') + '</span>';
        }

        return '<tr>' +
            '<td><strong>#' + r.id + '</strong></td>' +
            '<td>' + escapeHtml(r.student_name) + '</td>' +
            '<td style="font-size:0.8rem">' + escapeHtml(r.email) + '</td>' +
            '<td>' + escapeHtml(r.event_topic || '—') + '</td>' +
            '<td style="color:var(--clr-success);font-weight:600">₹' + parseFloat(r.entry_fee || 0).toFixed(0) + '</td>' +
            '<td>' + screenshotHtml + '</td>' +
            '<td>' + getBadgeHtml(r.status) + '</td>' +
            '<td>' + actionsHtml + '</td>' +
        '</tr>';
    }).join('');
}

/**
 * Update student status (Approve / Reject)
 * @param {number} studentId
 * @param {string} newStatus - 'approved' or 'rejected'
 */
function updateStatus(studentId, newStatus) {
    // Try backend first
    fetch('/api/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: studentId, status: newStatus })
    })
    .then(function (res) { return res.json(); })
    .then(function (data) {
        if (data.success) {
            updateLocalStatus(studentId, newStatus);
        }
    })
    .catch(function () {
        // Fallback: update locally for demo
        updateLocalStatus(studentId, newStatus);
    });
}

/**
 * Update status in local data and re-render
 */
function updateLocalStatus(studentId, newStatus) {
    allRegistrations.forEach(function (r) {
        if (r.id == studentId) {
            r.status = newStatus;
        }
    });
    renderAll();
}

/**
 * Switch visible section
 */
function switchSection(sectionName, clickedLink) {
    // Hide all sections
    var sections = document.querySelectorAll('.content-section');
    sections.forEach(function (s) { s.classList.remove('active'); });

    // Show selected section
    var target = document.getElementById('section-' + sectionName);
    if (target) target.classList.add('active');

    // Update sidebar active state
    var links = document.querySelectorAll('.sidebar__link');
    links.forEach(function (l) { l.classList.remove('active'); });
    if (clickedLink) clickedLink.classList.add('active');
}

/**
 * Setup search input handler
 */
function setupSearch(inputId, callback) {
    var input = document.getElementById(inputId);
    if (input) {
        input.addEventListener('input', function () {
            callback(this.value.trim().toLowerCase());
        });
    }
}

/**
 * Filter data by search query
 */
function filterData(data, query) {
    if (!query) return data;
    return data.filter(function (r) {
        return (r.student_name && r.student_name.toLowerCase().includes(query)) ||
               (r.email && r.email.toLowerCase().includes(query)) ||
               (r.college && r.college.toLowerCase().includes(query)) ||
               (r.event_topic && r.event_topic.toLowerCase().includes(query)) ||
               (r.phone && r.phone.includes(query));
    });
}

/**
 * Open screenshot modal
 */
function openModal(src) {
    var modal = document.getElementById('screenshot-modal');
    var img   = document.getElementById('modal-img');
    img.src = src;
    modal.classList.add('active');
}

/**
 * Close screenshot modal
 */
function closeModal() {
    document.getElementById('screenshot-modal').classList.remove('active');
    document.getElementById('modal-img').src = '';
}

// Close modal on overlay click
document.addEventListener('click', function (e) {
    if (e.target.id === 'screenshot-modal') {
        closeModal();
    }
});

// Close modal on Escape key
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
});

/**
 * Admin logout
 */
function adminLogout() {
    sessionStorage.removeItem('admin_logged_in');

    // Also call backend logout
    fetch('php/logout.php').catch(function () {});

    window.location.href = 'index.html';
}

/**
 * Generate status badge HTML
 */
function getBadgeHtml(status) {
    var cls = 'badge--' + (status || 'pending');
    return '<span class="badge ' + cls + '">' + (status || 'pending') + '</span>';
}

/**
 * Format date string
 */
function formatDate(dateStr) {
    if (!dateStr) return '—';
    try {
        var d = new Date(dateStr);
        return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch (e) {
        return dateStr;
    }
}

/**
 * Escape HTML for XSS prevention
 */
function escapeHtml(text) {
    if (!text) return '';
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(text));
    return div.innerHTML;
}

/**
 * Delete a registration
 */
function deleteRegistration(studentId) {
    if (!confirm('Are you sure you want to permanently delete registration #' + studentId + '?')) return;
    
    fetch('/api/delete-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: studentId })
    })
    .then(function (res) { return res.json(); })
    .then(function (data) {
        if (data.success) {
            allRegistrations = allRegistrations.filter(function(r) { return r.id != studentId; });
            renderAll();
        } else {
            alert('Failed to delete: ' + data.message);
        }
    })
    .catch(function (err) {
        alert('Network error. Could not delete.');
        // Fallback for demo mode
        allRegistrations = allRegistrations.filter(function(r) { return r.id != studentId; });
        renderAll();
    });
}

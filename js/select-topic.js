/**
 * ============================================================
 * EMPOSIM — Topic Selection Script
 * ============================================================
 * 
 * Loads events from sessionStorage (set by events.js) and renders
 * them as styled radio button options.
 * 
 * On selection + submit, saves the chosen event to sessionStorage
 * and redirects to topic-details.html.
 * ============================================================
 */

document.addEventListener('DOMContentLoaded', function () {
    // ---- Auth Check ----
    if (!sessionStorage.getItem('student_id')) {
        window.location.href = 'register.html';
        return;
    }

    var topicsList = document.getElementById('topics-list');
    var form       = document.getElementById('topic-form');
    var alertArea  = document.getElementById('alert-area');

    // ---- Icons for events ----
    var eventIcons = ['📄', '💻', '🌐', '🤖', '🧠', '⚡'];

    // ---- Fallback events (same as events.js) ----
    var fallbackEvents = [
        { id: 1, event_name: 'Paper Presentation', venue: 'Seminar Hall A', entry_fee: '150.00' },
        { id: 2, event_name: 'Coding Challenge', venue: 'Computer Lab 1', entry_fee: '100.00' },
        { id: 3, event_name: 'Web Design', venue: 'Computer Lab 2', entry_fee: '100.00' },
        { id: 4, event_name: 'Robotics Workshop', venue: 'Robotics Lab', entry_fee: '250.00' },
        { id: 5, event_name: 'Quiz Competition', venue: 'Auditorium', entry_fee: '50.00' },
        { id: 6, event_name: 'Hackathon', venue: 'Main Hall', entry_fee: '200.00' }
    ];

    // ---- Load events ----
    var events;
    try {
        events = JSON.parse(sessionStorage.getItem('events')) || fallbackEvents;
    } catch (e) {
        events = fallbackEvents;
    }

    /**
     * Render radio button options for each event
     */
    function renderTopics() {
        topicsList.innerHTML = '';

        events.forEach(function (event, index) {
            var icon = eventIcons[index % eventIcons.length];
            var id = 'topic-' + event.id;

            var label = document.createElement('label');
            label.className = 'topic-option';
            label.setAttribute('for', id);

            label.innerHTML =
                '<input type="radio" name="selected_topic" id="' + id + '" ' +
                    'value="' + event.id + '" ' +
                    'data-name="' + escapeAttr(event.event_name) + '" ' +
                    'data-venue="' + escapeAttr(event.venue) + '" ' +
                    'data-fee="' + event.entry_fee + '">' +
                '<span class="topic-option__radio"></span>' +
                '<div class="topic-option__info">' +
                    '<div class="topic-option__name">' + icon + ' ' + escapeHtml(event.event_name) + '</div>' +
                    '<div class="topic-option__meta">' +
                        '<span>📍 ' + escapeHtml(event.venue) + '</span>' +
                    '</div>' +
                '</div>' +
                '<div class="topic-option__fee">₹' + parseFloat(event.entry_fee).toFixed(0) + '</div>';

            topicsList.appendChild(label);
        });
    }

    function escapeHtml(text) {
        var div = document.createElement('div');
        div.appendChild(document.createTextNode(text));
        return div.innerHTML;
    }

    function escapeAttr(text) {
        return text.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    // ---- Form Submission ----
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        var selected = document.querySelector('input[name="selected_topic"]:checked');

        if (!selected) {
            alertArea.innerHTML = '<div class="alert alert--error">⚠️ Please select an event before continuing.</div>';
            return;
        }

        // Store selection in sessionStorage
        sessionStorage.setItem('selected_event_id', selected.value);
        sessionStorage.setItem('selected_event_name', selected.dataset.name);
        sessionStorage.setItem('selected_event_venue', selected.dataset.venue);
        sessionStorage.setItem('selected_event_fee', selected.dataset.fee);

        // Redirect to confirmation page
        window.location.href = 'topic-details.html';
    });

    // ---- Initialize ----
    renderTopics();
});

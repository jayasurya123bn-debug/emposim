/**
 * ============================================================
 * EMPOSIM — Events Page Script
 * ============================================================
 * 
 * Fetches events from the PHP backend (or uses hardcoded fallback)
 * and dynamically renders event cards in the grid.
 * 
 * Each card shows: icon, event name, description, venue badge, fee.
 * ============================================================
 */

document.addEventListener('DOMContentLoaded', function () {

    var eventsGrid = document.getElementById('events-grid');

    // ---- Icons for each event (mapped by index) ----
    var eventIcons = ['📄', '💻', '🌐', '🤖', '🧠', '⚡'];

    // ---- Fallback events (used if PHP backend is unavailable) ----
    var fallbackEvents = [
        {
            id: 1,
            event_name: 'Paper Presentation',
            description: 'Present your research paper on emerging technologies. Topics include AI, IoT, Blockchain, and Cloud Computing. Best paper wins a cash prize!',
            venue: 'Seminar Hall A',
            entry_fee: '150.00'
        },
        {
            id: 2,
            event_name: 'Coding Challenge',
            description: 'A competitive coding contest with algorithmic problems of varying difficulty. Test your DSA skills against the best coders across colleges.',
            venue: 'Computer Lab 1',
            entry_fee: '100.00'
        },
        {
            id: 3,
            event_name: 'Web Design',
            description: 'Design and develop a responsive website on a given theme within the time limit. Showcase your creativity with HTML, CSS, and JavaScript.',
            venue: 'Computer Lab 2',
            entry_fee: '100.00'
        },
        {
            id: 4,
            event_name: 'Robotics Workshop',
            description: 'Hands-on workshop on building and programming Arduino-based robots. Learn sensor integration, motor control, and autonomous navigation.',
            venue: 'Robotics Lab',
            entry_fee: '250.00'
        },
        {
            id: 5,
            event_name: 'Quiz Competition',
            description: 'A fast-paced technical and general knowledge quiz. Rounds include rapid fire, buzzer, and multimedia questions.',
            venue: 'Auditorium',
            entry_fee: '50.00'
        },
        {
            id: 6,
            event_name: 'Hackathon',
            description: 'A 12-hour hackathon to build innovative solutions for real-world problems. Form a team of 2–4 and bring your laptop ready to code!',
            venue: 'Main Hall',
            entry_fee: '200.00'
        }
    ];

    /**
     * Render event cards into the grid
     * @param {Array} events - Array of event objects
     */
    function renderEvents(events) {
        eventsGrid.innerHTML = '';

        events.forEach(function (event, index) {
            var icon = eventIcons[index % eventIcons.length];

            var card = document.createElement('div');
            card.className = 'event-card slide-up';
            card.style.animationDelay = (index * 0.1) + 's';

            card.innerHTML =
                '<div class="event-card__icon">' + icon + '</div>' +
                '<h3 class="event-card__title">' + escapeHtml(event.event_name) + '</h3>' +
                '<p class="event-card__desc">' + escapeHtml(event.description) + '</p>' +
                '<div class="event-card__venue">📍 ' + escapeHtml(event.venue) + '</div>' +
                '<div class="event-card__fee">₹' + parseFloat(event.entry_fee).toFixed(0) + '</div>';

            eventsGrid.appendChild(card);
        });
    }

    /**
     * Escape HTML to prevent XSS
     * @param {string} text 
     * @returns {string}
     */
    function escapeHtml(text) {
        var div = document.createElement('div');
        div.appendChild(document.createTextNode(text));
        return div.innerHTML;
    }

    // ---- Fetch events from backend (with fallback) ----
    fetch('php/get_events.php')
        .then(function (response) { return response.json(); })
        .then(function (data) {
            if (data.success && data.events.length > 0) {
                renderEvents(data.events);
                // Store events for use on other pages
                sessionStorage.setItem('events', JSON.stringify(data.events));
            } else {
                renderEvents(fallbackEvents);
                sessionStorage.setItem('events', JSON.stringify(fallbackEvents));
            }
        })
        .catch(function () {
            // Backend unavailable — use hardcoded fallback
            console.warn('Backend unavailable, using fallback events.');
            renderEvents(fallbackEvents);
            sessionStorage.setItem('events', JSON.stringify(fallbackEvents));
        });
});

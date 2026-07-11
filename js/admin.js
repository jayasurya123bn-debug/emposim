// js/admin.js
document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('table-body');
    const searchInput = document.getElementById('search-input');
    const filterTopic = document.getElementById('filter-topic');
    const filterStatus = document.getElementById('filter-status');
    const exportPdfBtn = document.getElementById('export-pdf-btn');
    const exportDocBtn = document.getElementById('export-doc-btn');
    
    const modal = document.getElementById('update-modal');
    const closeModal = document.getElementById('close-modal');
    const updateForm = document.getElementById('update-form');
    const receiptAnchor = document.getElementById('receipt-anchor');

    // Python Backend Endpoint URL
    const API_BASE_URL = 'http://localhost:8000/api';
    let registrations = [];

    // Fetch data
    async function fetchRegistrations() {
        try {
            // Note: Replace with actual backend fetch
            // const res = await fetch(\/registrations);
            // registrations = await res.json();
            
            // Mock Data for demonstration
            registrations = [
                { id: 1, name: 'Arjun Kumar', email: 'arjun@example.com', phone: '9876543210', college: 'GTEC', event: 'Hackathon', status: 'pending', screenshot: 'uploads/demo1.jpg' },
                { id: 2, name: 'Sneha Reddy', email: 'sneha@example.com', phone: '9876543211', college: 'VIT', event: 'Web Design', status: 'approved', screenshot: 'uploads/demo2.jpg' },
                { id: 3, name: 'Rahul Sharma', email: 'rahul@example.com', phone: '9876543212', college: 'SRM', event: 'Robotics Workshop', status: 'rejected', screenshot: 'uploads/demo3.jpg' }
            ];
            renderTable();
        } catch (error) {
            console.error('Error fetching registrations:', error);
        }
    }

    function renderTable() {
        tableBody.innerHTML = '';
        const searchTerms = searchInput.value.toLowerCase();
        const topic = filterTopic.value;
        const status = filterStatus.value;

        const filtered = registrations.filter(r => {
            const matchesSearch = r.name.toLowerCase().includes(searchTerms) || r.email.toLowerCase().includes(searchTerms) || String(r.id).includes(searchTerms);
            const matchesTopic = topic ? r.event === topic : true;
            const matchesStatus = status ? r.status === status : true;
            return matchesSearch && matchesTopic && matchesStatus;
        });

        filtered.forEach(r => {
            const tr = document.createElement('tr');
            const badgeClass = r.status === 'approved' ? 'badge--approved' : (r.status === 'rejected' ? 'badge--rejected' : 'badge--pending');
            
            tr.innerHTML = 
                <td>#EMP\</td>
                <td>\</td>
                <td>\</td>
                <td>\</td>
                <td>\</td>
                <td>\</td>
                <td><span class="badge \">\</span></td>
                <td><button class="btn btn--outline" style="padding: 0.3rem 0.8rem; font-size:0.75rem;" onclick="openModal(\)">Edit</button></td>
            ;
            tableBody.appendChild(tr);
        });
    }

    searchInput.addEventListener('input', renderTable);
    filterTopic.addEventListener('change', renderTable);
    filterStatus.addEventListener('change', renderTable);

    // Modal Logic
    window.openModal = function(id) {
        const student = registrations.find(r => r.id === id);
        if (!student) return;
        
        document.getElementById('modal-id').value = student.id;
        document.getElementById('modal-name').value = student.name;
        document.getElementById('modal-email').value = student.email;
        document.getElementById('modal-phone').value = student.phone;
        document.getElementById('modal-college').value = student.college;
        document.getElementById('modal-status').value = student.status;
        
        if (student.screenshot) {
            receiptAnchor.href = student.screenshot;
            receiptAnchor.textContent = 'View Uploaded Screenshot';
        } else {
            receiptAnchor.removeAttribute('href');
            receiptAnchor.textContent = 'No receipt uploaded';
        }

        modal.classList.add('active');
    };

    closeModal.addEventListener('click', () => modal.classList.remove('active'));
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
    });

    updateForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('modal-id').value;
        const payload = {
            name: document.getElementById('modal-name').value,
            email: document.getElementById('modal-email').value,
            phone: document.getElementById('modal-phone').value,
            college: document.getElementById('modal-college').value,
            status: document.getElementById('modal-status').value
        };

        const btn = updateForm.querySelector('button[type="submit"]');
        const origText = btn.textContent;
        btn.classList.add('btn--loading');

        try {
            // Actual API Call:
            /*
            const res = await fetch(\/registrations/\, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (res.ok) { ... }
            */

            // Mock update
            setTimeout(() => {
                const index = registrations.findIndex(r => r.id == id);
                if (index > -1) {
                    registrations[index] = { ...registrations[index], ...payload };
                    renderTable();
                }
                btn.classList.remove('btn--loading');
                btn.textContent = origText;
                modal.classList.remove('active');
                alert('Record updated successfully!');
            }, 800);
        } catch (error) {
            console.error('Update failed', error);
            btn.classList.remove('btn--loading');
        }
    });

    // Exports
    exportPdfBtn.addEventListener('click', () => {
        window.open(\/export/pdf, '_blank');
    });

    exportDocBtn.addEventListener('click', () => {
        window.open(\/export/docx, '_blank');
    });

    fetchRegistrations();
});

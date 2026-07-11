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

    // PHP Backend Endpoint URL
    const API_BASE_URL = 'admin/php';
    let registrations = [];

    // Fetch data
    async function fetchRegistrations() {
        try {
            // Call the actual PHP backend
            const res = await fetch(\/get_registrations.php);
            const data = await res.json();
            
            if (data.success && data.registrations) {
                registrations = data.registrations;
                renderTable();
            } else {
                console.error('Failed to load registrations:', data.message);
                tableBody.innerHTML = '<tr><td colspan="8" style="text-align:center;">Failed to load registrations</td></tr>';
            }
        } catch (error) {
            console.error('Error fetching registrations:', error);
            tableBody.innerHTML = '<tr><td colspan="8" style="text-align:center;">Error fetching registrations</td></tr>';
        }
    }

    function renderTable() {
        tableBody.innerHTML = '';
        const searchTerms = searchInput.value.toLowerCase();
        const topic = filterTopic.value;
        const status = filterStatus.value;

        const filtered = registrations.filter(r => {
            const matchesSearch = 
                (r.student_name && r.student_name.toLowerCase().includes(searchTerms)) || 
                (r.email && r.email.toLowerCase().includes(searchTerms)) || 
                String(r.id).includes(searchTerms);
            const matchesTopic = topic ? r.event_topic === topic : true;
            const matchesStatus = status ? r.status === status : true;
            return matchesSearch && matchesTopic && matchesStatus;
        });

        if (filtered.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="8" style="text-align:center;">No records found.</td></tr>';
            return;
        }

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
                <td><button type="button" class="btn btn--outline" style="padding: 0.3rem 0.8rem; font-size:0.75rem;" onclick="openModal(\)">Edit</button></td>
            ;
            tableBody.appendChild(tr);
        });
    }

    searchInput.addEventListener('input', renderTable);
    filterTopic.addEventListener('change', renderTable);
    filterStatus.addEventListener('change', renderTable);

    // Modal Logic
    window.openModal = function(id) {
        const student = registrations.find(r => r.id == id);
        if (!student) return;
        
        document.getElementById('modal-id').value = student.id;
        document.getElementById('modal-name').value = student.student_name || '';
        document.getElementById('modal-email').value = student.email || '';
        document.getElementById('modal-phone').value = student.phone || '';
        document.getElementById('modal-college').value = student.college || '';
        document.getElementById('modal-status').value = student.status || 'pending';
        
        // Note: The existing PHP update script ONLY updates status.
        // We make other fields readonly so the admin knows they can't be changed here.
        document.getElementById('modal-name').readOnly = true;
        document.getElementById('modal-email').readOnly = true;
        document.getElementById('modal-phone').readOnly = true;
        document.getElementById('modal-college').readOnly = true;

        if (student.payment_screenshot) {
            // Assuming the screenshot is an absolute URL or relative path
            const screenshotPath = student.payment_screenshot;
            receiptAnchor.href = screenshotPath.startsWith('http') ? screenshotPath : uploads/\;
            receiptAnchor.textContent = 'View Uploaded Screenshot';
            receiptAnchor.style.pointerEvents = 'auto';
            receiptAnchor.style.opacity = '1';
        } else {
            receiptAnchor.removeAttribute('href');
            receiptAnchor.textContent = 'No receipt uploaded';
            receiptAnchor.style.pointerEvents = 'none';
            receiptAnchor.style.opacity = '0.5';
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
        const newStatus = document.getElementById('modal-status').value;

        // update_status.php expects POST with JSON { student_id: int, status: 'approved'|'rejected' }
        const payload = {
            student_id: parseInt(id, 10),
            status: newStatus
        };

        const btn = updateForm.querySelector('button[type="submit"]');
        const origText = btn.textContent;
        btn.classList.add('btn--loading');

        try {
            const res = await fetch(\/update_status.php, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            
            if (data.success) {
                // Update local array
                const index = registrations.findIndex(r => r.id == id);
                if (index > -1) {
                    registrations[index].status = newStatus;
                    renderTable();
                }
                modal.classList.remove('active');
                alert(data.message || 'Record updated successfully!');
            } else {
                alert('Update failed: ' + (data.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('Update failed', error);
            alert('Update failed: Network error.');
        } finally {
            btn.classList.remove('btn--loading');
            btn.textContent = origText;
        }
    });

    // Exports (still pointing to Python API if you choose to run it)
    exportPdfBtn.addEventListener('click', () => {
        window.open(http://localhost:8000/api/export/pdf, '_blank');
    });

    exportDocBtn.addEventListener('click', () => {
        window.open(http://localhost:8000/api/export/docx, '_blank');
    });

    fetchRegistrations();
});

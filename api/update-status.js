// ============================================================
// EMPOSIM — Update Registration Status (Admin API)
// ============================================================
import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Method not allowed.' });

    try {
        const student_id = parseInt(req.body.student_id || '0');
        const status = req.body.status || '';

        if (student_id <= 0) return res.status(400).json({ success: false, message: 'Invalid student ID.' });
        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status. Must be "approved" or "rejected".' });
        }

        const result = await sql`
            UPDATE registrations SET status = ${status} WHERE id = ${student_id}
        `;

        if (result.rowCount > 0) {
            return res.status(200).json({ success: true, message: `Student #${student_id} has been ${status}.` });
        } else {
            return res.status(404).json({ success: false, message: 'Student record not found.' });
        }
    } catch (err) {
        console.error('Update status error:', err);
        return res.status(500).json({ success: false, message: 'Failed to update status.' });
    }
}

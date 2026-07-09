// ============================================================
// EMPOSIM — Check Registration Status API (Vercel Serverless)
// ============================================================
const { sql } = require('@vercel/postgres');

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        const email = (req.query.email || '').trim().toLowerCase();
        const id = parseInt(req.query.id || '0');

        if (!email && id <= 0) {
            return res.status(400).json({ success: false, message: 'Please provide an email address or registration ID.' });
        }

        let result;
        if (id > 0) {
            result = await sql`
                SELECT id, student_name, email, phone, college, year, department,
                       event_topic, entry_fee, payment_mode, status, created_at
                FROM registrations WHERE id = ${id} LIMIT 1
            `;
        } else {
            result = await sql`
                SELECT id, student_name, email, phone, college, year, department,
                       event_topic, entry_fee, payment_mode, status, created_at
                FROM registrations WHERE email = ${email} LIMIT 1
            `;
        }

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'No registration found. Please check your email or ID.' });
        }

        return res.status(200).json({ success: true, student: result.rows[0] });

    } catch (err) {
        console.error('Status check error:', err);
        return res.status(500).json({ success: false, message: 'Failed to check status.' });
    }
}

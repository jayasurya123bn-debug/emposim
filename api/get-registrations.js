// ============================================================
// EMPOSIM — Get All Registrations (Admin API)
// ============================================================
const { sql } = require('@vercel/postgres');

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        const result = await sql`
            SELECT id, student_name, email, phone, college, year, department,
                   event_topic, entry_fee, payment_mode, payment_screenshot, status, created_at
            FROM registrations
            ORDER BY
                CASE status WHEN 'pending' THEN 1 WHEN 'approved' THEN 2 WHEN 'rejected' THEN 3 END,
                created_at DESC
        `;

        return res.status(200).json({
            success: true,
            registrations: result.rows,
            count: result.rows.length
        });
    } catch (err) {
        console.error('Get registrations error:', err);
        return res.status(500).json({ success: false, message: 'Failed to fetch registrations.' });
    }
}

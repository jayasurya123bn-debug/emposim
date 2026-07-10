const { sql } = require('@vercel/postgres');

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }

    try {
        const { student_id } = req.body;

        if (!student_id) {
            return res.status(400).json({ success: false, message: 'Student ID is required' });
        }

        // Execute delete
        await sql`DELETE FROM registrations WHERE id = ${student_id}`;

        return res.status(200).json({ success: true, message: 'Deleted successfully' });
    } catch (error) {
        console.error('Delete error:', error);
        return res.status(500).json({ success: false, message: 'Database error' });
    }
};

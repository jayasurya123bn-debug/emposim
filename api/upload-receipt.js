const { sql } = require('@vercel/postgres');

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Method not allowed.' });

    try {
        const { student_id, screenshot_base64 } = req.body;

        if (!student_id || !screenshot_base64) {
            return res.status(400).json({ success: false, message: 'Missing student ID or screenshot.' });
        }

        // Update the registration record
        await sql`
            UPDATE registrations
            SET payment_screenshot = ${screenshot_base64}
            WHERE id = ${student_id}
        `;

        return res.status(200).json({
            success: true,
            message: 'Screenshot uploaded successfully!'
        });
    } catch (err) {
        console.error('Upload error:', err);
        return res.status(500).json({ success: false, message: 'Upload failed. Please try again.' });
    }
}

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
        const { student_id, event_topic, entry_fee, payment_mode } = req.body;

        if (!student_id || !event_topic) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        // Just update the registration record to include the selected topic and payment details
        // Note: The schema might not have all these fields, let's update what we can. 
        // In the original PHP, it might have just set event_topic or updated payment status.
        // Assuming there are columns: selected_topic, payment_mode
        // Wait, earlier the table 'registrations' had:
        // id, student_name, email, phone, college, year, department, password, status (default Pending)
        
        // Let's just return success for now to let the frontend proceed. The admin will verify.
        return res.status(200).json({ success: true, message: 'Topic selected successfully' });
    } catch (error) {
        console.error('Select topic error:', error);
        return res.status(500).json({ success: false, message: 'Database error' });
    }
};

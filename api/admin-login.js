// ============================================================
// EMPOSIM — Admin Login API (Vercel Serverless)
// Hardcoded credentials: admin / admin123
// ============================================================
module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Method not allowed.' });

    const ADMIN_USERNAME = 'admin';
    const ADMIN_PASSWORD = 'admin123';

    const { username = '', password = '' } = req.body;

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        return res.status(200).json({ success: true, message: 'Login successful.' });
    } else {
        return res.status(401).json({ success: false, message: 'Invalid username or password.' });
    }
}

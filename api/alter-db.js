const { sql } = require('@vercel/postgres');

module.exports = async function handler(req, res) {
    try {
        await sql`ALTER TABLE registrations ALTER COLUMN payment_screenshot TYPE TEXT`;
        return res.status(200).send('Database altered successfully! You can now upload large base64 screenshots.');
    } catch (err) {
        console.error('Error altering table:', err);
        return res.status(500).send('Error altering table: ' + err.message);
    }
}

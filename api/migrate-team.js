const { sql } = require('@vercel/postgres');

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    try {
        await sql`ALTER TABLE registrations ADD COLUMN IF NOT EXISTS team_member_2 VARCHAR(100) DEFAULT NULL`;
        await sql`ALTER TABLE registrations ADD COLUMN IF NOT EXISTS team_member_3 VARCHAR(100) DEFAULT NULL`;
        await sql`ALTER TABLE registrations ADD COLUMN IF NOT EXISTS team_member_4 VARCHAR(100) DEFAULT NULL`;
        
        return res.status(200).json({ success: true, message: 'Migration successful' });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

// ============================================================
// EMPOSIM — Get Events API (Vercel Serverless)
// ============================================================
import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        const result = await sql`
            SELECT id, event_name, description, venue, entry_fee
            FROM events ORDER BY id ASC
        `;
        return res.status(200).json({ success: true, events: result.rows });
    } catch (err) {
        console.error('Get events error:', err);
        return res.status(500).json({ success: false, message: 'Failed to fetch events.' });
    }
}

// ============================================================
// EMPOSIM — Student Login API (Vercel Serverless)
// ============================================================
import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Method not allowed.' });

    try {
        const { identifier = '', login_type = 'email', password = '' } = req.body;

        if (!identifier.trim()) return res.status(400).json({ success: false, message: 'Email or phone number is required.' });
        if (!password) return res.status(400).json({ success: false, message: 'Password is required.' });

        // ---- Find student ----
        let result;
        if (login_type === 'phone') {
            result = await sql`SELECT id, student_name, email, password FROM registrations WHERE phone = ${identifier.trim()} LIMIT 1`;
        } else {
            result = await sql`SELECT id, student_name, email, password FROM registrations WHERE email = ${identifier.toLowerCase().trim()} LIMIT 1`;
        }

        if (result.rows.length === 0) {
            return res.status(401).json({ success: false, message: `No account found with this ${login_type}.` });
        }

        const student = result.rows[0];

        // ---- Verify password ----
        const match = await bcrypt.compare(password, student.password);
        if (!match) {
            return res.status(401).json({ success: false, message: 'Incorrect password. Please try again.' });
        }

        return res.status(200).json({
            success: true,
            message: 'Login successful!',
            student_id: student.id,
            student_name: student.student_name,
            email: student.email
        });

    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ success: false, message: 'Login failed. Please try again.' });
    }
}

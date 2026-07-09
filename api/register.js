// ============================================================
// EMPOSIM — Student Registration API (Vercel Serverless)
// ============================================================
import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Method not allowed.' });

    try {
        const {
            student_name = '',
            email = '',
            password = '',
            phone = '',
            college = '',
            year = '',
            department = ''
        } = req.body;

        // ---- Validate ----
        const errors = [];
        if (!student_name.trim()) errors.push('Full Name is required.');
        if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('A valid email is required.');
        if (!password || password.length < 6) errors.push('Password must be at least 6 characters.');
        if (!phone || !/^[0-9]{10}$/.test(phone)) errors.push('A valid 10-digit phone number is required.');
        if (!college.trim()) errors.push('College name is required.');
        if (!year.trim()) errors.push('Year is required.');
        if (!department.trim()) errors.push('Department is required.');

        if (errors.length > 0) return res.status(400).json({ success: false, message: errors.join(' ') });

        // ---- Check if email exists ----
        const existing = await sql`SELECT id FROM registrations WHERE email = ${email.toLowerCase().trim()} LIMIT 1`;
        if (existing.rows.length > 0) {
            return res.status(409).json({ success: false, message: 'This email is already registered.' });
        }

        // ---- Hash password ----
        const hashed = await bcrypt.hash(password, 10);

        // ---- Insert into DB ----
        const result = await sql`
            INSERT INTO registrations (student_name, email, password, phone, college, year, department)
            VALUES (${student_name.trim()}, ${email.toLowerCase().trim()}, ${hashed}, ${phone.trim()}, ${college.trim()}, ${year.trim()}, ${department.trim()})
            RETURNING id
        `;

        return res.status(200).json({
            success: true,
            message: 'Registration successful!',
            student_id: result.rows[0].id
        });

    } catch (err) {
        console.error('Register error:', err);
        return res.status(500).json({ success: false, message: 'Registration failed. Please try again.' });
    }
}

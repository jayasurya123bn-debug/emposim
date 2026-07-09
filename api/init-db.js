// ============================================================
// EMPOSIM — Database Initialization (One-time setup)
// Visit: /api/init-db once to create tables and seed events
// ============================================================
const { sql } = require('@vercel/postgres');

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');

    try {
        // Create events table
        await sql`
            CREATE TABLE IF NOT EXISTS events (
                id SERIAL PRIMARY KEY,
                event_name VARCHAR(150) NOT NULL,
                description TEXT,
                venue VARCHAR(200),
                entry_fee DECIMAL(10,2) DEFAULT 0.00,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

        // Create registrations table
        await sql`
            CREATE TABLE IF NOT EXISTS registrations (
                id SERIAL PRIMARY KEY,
                student_name VARCHAR(100) NOT NULL,
                email VARCHAR(150) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                phone VARCHAR(15) NOT NULL,
                college VARCHAR(200) NOT NULL,
                year VARCHAR(20) NOT NULL,
                department VARCHAR(100) NOT NULL,
                event_topic VARCHAR(150) DEFAULT NULL,
                entry_fee DECIMAL(10,2) DEFAULT 0.00,
                payment_mode VARCHAR(20) DEFAULT 'online',
                payment_screenshot VARCHAR(255) DEFAULT NULL,
                status VARCHAR(20) DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

        // Seed events (only if empty)
        const existing = await sql`SELECT COUNT(*) as count FROM events`;
        if (parseInt(existing.rows[0].count) === 0) {
            await sql`
                INSERT INTO events (event_name, description, venue, entry_fee) VALUES
                ('Paper Presentation', 'Present your research paper on emerging technologies. Topics include AI, IoT, Blockchain, and Cloud Computing.', 'Seminar Hall A', 150.00),
                ('Coding Challenge', 'A competitive coding contest with algorithmic problems of varying difficulty. Test your DSA skills.', 'Computer Lab 1', 100.00),
                ('Web Design', 'Design and develop a responsive website on a given theme within the time limit.', 'Computer Lab 2', 100.00),
                ('Robotics Workshop', 'Hands-on workshop on building and programming Arduino-based robots.', 'Robotics Lab', 250.00),
                ('Quiz Competition', 'A fast-paced technical and general knowledge quiz. Rapid fire, buzzer, and multimedia rounds.', 'Auditorium', 50.00),
                ('Hackathon', 'A 12-hour hackathon to build innovative solutions for real-world problems.', 'Main Hall', 200.00)
            `;
        }

        return res.status(200).json({
            success: true,
            message: 'Database initialized successfully! Tables created and events seeded.'
        });

    } catch (err) {
        console.error('DB init error:', err);
        return res.status(500).json({ success: false, message: err.message });
    }
}

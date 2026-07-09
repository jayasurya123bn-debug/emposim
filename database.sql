-- ============================================================
-- EMPOSIM — Database Setup for XAMPP (phpMyAdmin)
-- ============================================================
-- 
-- HOW TO USE:
-- 1. Open XAMPP Control Panel → Start Apache & MySQL
-- 2. Go to http://localhost/phpmyadmin
-- 3. Click "SQL" tab at the top
-- 4. Paste this entire code and click "Go"
-- 
-- This will create the database, tables, and sample events.
-- ============================================================

-- ---- Create Database ----
CREATE DATABASE IF NOT EXISTS emposim
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

-- ---- Select the Database ----
USE emposim;

-- ============================================================
-- TABLE 1: events
-- Stores all symposium events with name, description, venue, fee
-- ============================================================
CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_name VARCHAR(150) NOT NULL,
    description TEXT,
    venue VARCHAR(200),
    entry_fee DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE 2: registrations
-- Stores student registration data, event selection, payment info
-- ============================================================
CREATE TABLE IF NOT EXISTS registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    college VARCHAR(200) NOT NULL,
    year VARCHAR(20) NOT NULL,
    department VARCHAR(100) NOT NULL,
    event_topic VARCHAR(150) DEFAULT NULL,
    entry_fee DECIMAL(10,2) DEFAULT 0.00,
    payment_mode ENUM('online','offline') DEFAULT 'online',
    payment_screenshot VARCHAR(255) DEFAULT NULL,
    status ENUM('pending','approved','rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- SEED DATA: 6 Sample Symposium Events
-- ============================================================
INSERT INTO events (event_name, description, venue, entry_fee) VALUES
(
    'Paper Presentation',
    'Present your research paper on emerging technologies. Topics include AI, IoT, Blockchain, and Cloud Computing. Best paper wins a cash prize!',
    'Seminar Hall A',
    150.00
),
(
    'Coding Challenge',
    'A competitive coding contest with algorithmic problems of varying difficulty. Test your DSA skills against the best coders across colleges.',
    'Computer Lab 1',
    100.00
),
(
    'Web Design',
    'Design and develop a responsive website on a given theme within the time limit. Showcase your creativity with HTML, CSS, and JavaScript.',
    'Computer Lab 2',
    100.00
),
(
    'Robotics Workshop',
    'Hands-on workshop on building and programming Arduino-based robots. Learn sensor integration, motor control, and autonomous navigation.',
    'Robotics Lab',
    250.00
),
(
    'Quiz Competition',
    'A fast-paced technical and general knowledge quiz. Rounds include rapid fire, buzzer, and multimedia questions.',
    'Auditorium',
    50.00
),
(
    'Hackathon',
    'A 12-hour hackathon to build innovative solutions for real-world problems. Form a team of 2-4 and bring your laptop ready to code!',
    'Main Hall',
    200.00
);

-- ============================================================
-- VERIFICATION: Check if everything was created successfully
-- ============================================================
SELECT 'Database and tables created successfully!' AS Status;
SELECT COUNT(*) AS total_events FROM events;

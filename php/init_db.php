<?php
/**
 * ============================================================
 * EMPOSIM — Database Initialization
 * ============================================================
 * 
 * Run this script ONCE to create the database tables and 
 * seed sample events.
 * 
 * Usage: php init_db.php
 *   OR   Visit http://localhost/emposim/php/init_db.php
 * ============================================================
 */

// ---- First, create the database if it doesn't exist ----
try {
    $pdo_temp = new PDO(
        "mysql:host=localhost;charset=utf8mb4",
        'root', '',
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
    $pdo_temp->exec("CREATE DATABASE IF NOT EXISTS emposim CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    echo "✅ Database 'emposim' created (or already exists).\n<br>";
} catch (PDOException $e) {
    die("❌ Could not create database: " . $e->getMessage());
}

// ---- Now connect to the database ----
require_once __DIR__ . '/db.php';

// ---- Create 'events' table ----
$pdo->exec("
    CREATE TABLE IF NOT EXISTS events (
        id INT AUTO_INCREMENT PRIMARY KEY,
        event_name VARCHAR(150) NOT NULL,
        description TEXT,
        venue VARCHAR(200),
        entry_fee DECIMAL(10,2) DEFAULT 0.00,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
");
echo "✅ Table 'events' created.\n<br>";

// ---- Create 'registrations' table ----
$pdo->exec("
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
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
");
echo "✅ Table 'registrations' created.\n<br>";

// ---- Seed sample events (only if table is empty) ----
$count = $pdo->query("SELECT COUNT(*) FROM events")->fetchColumn();

if ($count == 0) {
    $events = [
        [
            'event_name'  => 'Paper Presentation',
            'description' => 'Present your research paper on emerging technologies. Topics include AI, IoT, Blockchain, and Cloud Computing. Best paper wins a cash prize!',
            'venue'       => 'Seminar Hall A',
            'entry_fee'   => 150.00
        ],
        [
            'event_name'  => 'Coding Challenge',
            'description' => 'A competitive coding contest with algorithmic problems of varying difficulty. Test your DSA skills against the best coders across colleges.',
            'venue'       => 'Computer Lab 1',
            'entry_fee'   => 100.00
        ],
        [
            'event_name'  => 'Web Design',
            'description' => 'Design and develop a responsive website on a given theme within the time limit. Showcase your creativity with HTML, CSS, and JavaScript.',
            'venue'       => 'Computer Lab 2',
            'entry_fee'   => 100.00
        ],
        [
            'event_name'  => 'Robotics Workshop',
            'description' => 'Hands-on workshop on building and programming Arduino-based robots. Learn sensor integration, motor control, and autonomous navigation.',
            'venue'       => 'Robotics Lab',
            'entry_fee'   => 250.00
        ],
        [
            'event_name'  => 'Quiz Competition',
            'description' => 'A fast-paced technical and general knowledge quiz. Rounds include rapid fire, buzzer, and multimedia questions.',
            'venue'       => 'Auditorium',
            'entry_fee'   => 50.00
        ],
        [
            'event_name'  => 'Hackathon',
            'description' => 'A 12-hour hackathon to build innovative solutions for real-world problems. Form a team of 2–4 and bring your laptop ready to code!',
            'venue'       => 'Main Hall',
            'entry_fee'   => 200.00
        ]
    ];

    $stmt = $pdo->prepare("
        INSERT INTO events (event_name, description, venue, entry_fee) 
        VALUES (:event_name, :description, :venue, :entry_fee)
    ");

    foreach ($events as $event) {
        $stmt->execute($event);
    }
    
    echo "✅ Seeded " . count($events) . " sample events.\n<br>";
} else {
    echo "ℹ️ Events table already has data. Skipping seed.\n<br>";
}

echo "\n<br>🎉 <strong>Database initialization complete!</strong> You can now use the Emposim portal.";

<?php
/**
 * ============================================================
 * EMPOSIM — Database Connection
 * ============================================================
 * 
 * Establishes a PDO connection to the MySQL database.
 * Update the constants below to match your local setup.
 * 
 * Usage: require_once 'db.php';
 *        Then use the $pdo variable for queries.
 * ============================================================
 */

// ---- Database Configuration ----
// Change these values to match your MySQL setup (e.g., XAMPP defaults)
define('DB_HOST', 'localhost');
define('DB_NAME', 'emposim');
define('DB_USER', 'root');       // Default XAMPP/WAMP user
define('DB_PASS', '');           // Default XAMPP/WAMP password (empty)
define('DB_CHARSET', 'utf8mb4');

// ---- Establish PDO Connection ----
try {
    $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
    
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,    // Throw exceptions on errors
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,          // Return associative arrays
        PDO::ATTR_EMULATE_PREPARES   => false,                      // Use native prepared statements
    ];
    
    $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
    
} catch (PDOException $e) {
    // In production, log this error instead of displaying it
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database connection failed. Please check your configuration.',
        'error'   => $e->getMessage()  // Remove this line in production
    ]);
    exit;
}

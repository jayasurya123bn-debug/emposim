<?php
/**
 * ============================================================
 * EMPOSIM — Admin Login Handler
 * ============================================================
 * 
 * Validates admin credentials.
 * 
 * HARDCODED CREDENTIALS (for demo/college project):
 *   Username: admin
 *   Password: admin123
 * 
 * In a real application, store hashed credentials in the database.
 * ============================================================
 */

session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

// ---- Hardcoded admin credentials ----
define('ADMIN_USERNAME', 'admin');
define('ADMIN_PASSWORD', 'admin123');

// ---- Read input ----
$data = json_decode(file_get_contents('php://input'), true);
if (!$data) $data = $_POST;

$username = trim($data['username'] ?? '');
$password = $data['password'] ?? '';

// ---- Validate ----
if ($username === ADMIN_USERNAME && $password === ADMIN_PASSWORD) {
    // Set session
    $_SESSION['admin_logged_in'] = true;
    $_SESSION['admin_user'] = $username;

    echo json_encode([
        'success' => true,
        'message' => 'Login successful.'
    ]);
} else {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'message' => 'Invalid username or password.'
    ]);
}

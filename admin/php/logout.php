<?php
/**
 * ============================================================
 * EMPOSIM — Admin Logout
 * ============================================================
 * 
 * Destroys the admin session and returns a JSON response.
 * ============================================================
 */

session_start();

// Destroy all session data
$_SESSION = [];
session_destroy();

header('Content-Type: application/json');
echo json_encode([
    'success' => true,
    'message' => 'Logged out successfully.'
]);

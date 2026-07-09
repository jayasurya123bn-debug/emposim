<?php
/**
 * ============================================================
 * EMPOSIM — Get All Registrations (Admin API)
 * ============================================================
 * 
 * Returns all student registrations from the database.
 * Used by the admin dashboard to display registration data.
 * ============================================================
 */

session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// ---- Check admin session ----
// Note: For stricter security, uncomment the block below
/*
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Unauthorized.']);
    exit;
}
*/

require_once __DIR__ . '/../../php/db.php';

try {
    $stmt = $pdo->query("
        SELECT id, student_name, email, phone, college, year, department,
               event_topic, entry_fee, payment_mode, payment_screenshot, 
               status, created_at
        FROM registrations 
        ORDER BY 
            FIELD(status, 'pending', 'approved', 'rejected'),
            created_at DESC
    ");
    
    $registrations = $stmt->fetchAll();

    echo json_encode([
        'success'       => true,
        'registrations' => $registrations,
        'count'         => count($registrations)
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to fetch registrations.',
        'error'   => $e->getMessage()
    ]);
}

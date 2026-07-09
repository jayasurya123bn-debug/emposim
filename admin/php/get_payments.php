<?php
/**
 * ============================================================
 * EMPOSIM — Get Payment Details (Admin API)
 * ============================================================
 * 
 * Returns payment-specific fields for all registrations.
 * Used by the admin Payments tab.
 * ============================================================
 */

session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once __DIR__ . '/../../php/db.php';

try {
    $stmt = $pdo->query("
        SELECT id, student_name, email, event_topic, entry_fee, 
               payment_mode, payment_screenshot, status, created_at
        FROM registrations 
        ORDER BY created_at DESC
    ");
    
    $payments = $stmt->fetchAll();

    echo json_encode([
        'success'  => true,
        'payments' => $payments,
        'count'    => count($payments)
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to fetch payment details.',
        'error'   => $e->getMessage()
    ]);
}

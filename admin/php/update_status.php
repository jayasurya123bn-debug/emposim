<?php
/**
 * ============================================================
 * EMPOSIM — Update Registration Status (Admin API)
 * ============================================================
 * 
 * Allows admin to approve or reject a student's registration.
 * 
 * Expects POST JSON: { student_id: int, status: 'approved'|'rejected' }
 * 
 * This is the core of the admin verification workflow:
 * - Approve → status changes to 'approved'
 * - Reject  → status changes to 'rejected'
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

require_once __DIR__ . '/../../php/db.php';

// ---- Read input ----
$data = json_decode(file_get_contents('php://input'), true);
if (!$data) $data = $_POST;

$student_id = (int) ($data['student_id'] ?? 0);
$status     = $data['status'] ?? '';

// ---- Validate ----
if ($student_id <= 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid student ID.']);
    exit;
}

$allowed_statuses = ['approved', 'rejected'];
if (!in_array($status, $allowed_statuses)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid status. Must be "approved" or "rejected".']);
    exit;
}

// ---- Update status in database ----
try {
    $stmt = $pdo->prepare("UPDATE registrations SET status = :status WHERE id = :id");
    $stmt->execute([
        'status' => $status,
        'id'     => $student_id
    ]);

    if ($stmt->rowCount() > 0) {
        echo json_encode([
            'success' => true,
            'message' => 'Student #' . $student_id . ' has been ' . $status . '.'
        ]);
    } else {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => 'Student record not found.'
        ]);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to update status.',
        'error'   => $e->getMessage()
    ]);
}

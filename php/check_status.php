<?php
/**
 * ============================================================
 * EMPOSIM — Check Registration Status (Student API)
 * ============================================================
 * 
 * Allows students to check their registration and approval status.
 * Lookup by email or registration ID.
 * 
 * GET params: ?email=xxx  OR  ?id=xxx
 * ============================================================
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once __DIR__ . '/db.php';

$email = filter_var(trim($_GET['email'] ?? ''), FILTER_SANITIZE_EMAIL);
$id    = (int) ($_GET['id'] ?? 0);

// ---- Validate ----
if (empty($email) && $id <= 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Please provide an email address or registration ID.']);
    exit;
}

try {
    if ($id > 0) {
        $stmt = $pdo->prepare("
            SELECT id, student_name, email, phone, college, year, department,
                   event_topic, entry_fee, payment_mode, payment_screenshot,
                   status, created_at
            FROM registrations WHERE id = :id LIMIT 1
        ");
        $stmt->execute(['id' => $id]);
    } else {
        $stmt = $pdo->prepare("
            SELECT id, student_name, email, phone, college, year, department,
                   event_topic, entry_fee, payment_mode, payment_screenshot,
                   status, created_at
            FROM registrations WHERE email = :email LIMIT 1
        ");
        $stmt->execute(['email' => $email]);
    }

    $student = $stmt->fetch();

    if (!$student) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'No registration found. Please check your email or ID.']);
        exit;
    }

    // Don't send password in response!
    echo json_encode([
        'success' => true,
        'student' => $student
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to check status.',
        'error'   => $e->getMessage()
    ]);
}

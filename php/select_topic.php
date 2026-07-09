<?php
/**
 * ============================================================
 * EMPOSIM — Topic Selection Handler
 * ============================================================
 * 
 * Updates a student's registration with their selected event,
 * entry fee, and payment mode (online/offline).
 * 
 * Expects POST JSON: { student_id, event_topic, entry_fee, payment_mode }
 * ============================================================
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

require_once __DIR__ . '/db.php';

// ---- Read input ----
$data = json_decode(file_get_contents('php://input'), true);
if (!$data) $data = $_POST;

$student_id   = (int) ($data['student_id'] ?? 0);
$event_topic  = htmlspecialchars(trim($data['event_topic'] ?? ''), ENT_QUOTES, 'UTF-8');
$entry_fee    = (float) ($data['entry_fee'] ?? 0);
$payment_mode = in_array($data['payment_mode'] ?? '', ['online', 'offline']) 
                ? $data['payment_mode'] 
                : 'online';

// ---- Validate ----
if ($student_id <= 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid student ID.']);
    exit;
}

if (empty($event_topic)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Please select an event topic.']);
    exit;
}

// ---- Update registration ----
try {
    $stmt = $pdo->prepare("
        UPDATE registrations 
        SET event_topic = :event_topic, 
            entry_fee = :entry_fee, 
            payment_mode = :payment_mode 
        WHERE id = :id
    ");

    $stmt->execute([
        'event_topic'  => $event_topic,
        'entry_fee'    => $entry_fee,
        'payment_mode' => $payment_mode,
        'id'           => $student_id
    ]);

    if ($stmt->rowCount() > 0) {
        echo json_encode([
            'success' => true,
            'message' => 'Topic selection saved successfully!'
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
        'message' => 'Failed to save selection.',
        'error'   => $e->getMessage()
    ]);
}

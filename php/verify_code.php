<?php
/**
 * ============================================================
 * EMPOSIM — Verify Code Handler
 * ============================================================
 * 
 * Validates the 6-digit verification code against the database.
 * Checks expiry time and marks code as used on success.
 * 
 * Expects POST JSON: { email, code }
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

$data = json_decode(file_get_contents('php://input'), true);
if (!$data) $data = $_POST;

$email = filter_var(trim($data['email'] ?? ''), FILTER_SANITIZE_EMAIL);
$code  = trim($data['code'] ?? '');

// ---- Validate input ----
if (empty($email) || empty($code) || strlen($code) !== 6) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid email or code.']);
    exit;
}

try {
    // ---- Find the code ----
    $stmt = $pdo->prepare("
        SELECT id, code, expires_at, used 
        FROM verification_codes 
        WHERE email = :email AND code = :code 
        ORDER BY created_at DESC 
        LIMIT 1
    ");
    $stmt->execute(['email' => $email, 'code' => $code]);
    $record = $stmt->fetch();

    if (!$record) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid verification code. Please try again.']);
        exit;
    }

    // ---- Check if already used ----
    if ($record['used']) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'This code has already been used.']);
        exit;
    }

    // ---- Check expiry ----
    if (strtotime($record['expires_at']) < time()) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Code has expired. Please request a new one.']);
        exit;
    }

    // ---- Mark as used ----
    $pdo->prepare("UPDATE verification_codes SET used = 1 WHERE id = :id")
        ->execute(['id' => $record['id']]);

    echo json_encode([
        'success' => true,
        'message' => 'Code verified successfully!'
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Verification failed.',
        'error'   => $e->getMessage()
    ]);
}

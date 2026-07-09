<?php
/**
 * ============================================================
 * EMPOSIM — Reset Password Handler
 * ============================================================
 * 
 * Updates the student's password after successful code verification.
 * Hashes the new password with bcrypt before storing.
 * 
 * Expects POST JSON: { email, password }
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

$email    = filter_var(trim($data['email'] ?? ''), FILTER_SANITIZE_EMAIL);
$password = $data['password'] ?? '';

// ---- Validate ----
if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid email.']);
    exit;
}

if (empty($password) || strlen($password) < 6) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Password must be at least 6 characters.']);
    exit;
}

try {
    // ---- Hash the new password ----
    $hashed = password_hash($password, PASSWORD_BCRYPT);

    // ---- Update password in database ----
    $stmt = $pdo->prepare("UPDATE registrations SET password = :password WHERE email = :email");
    $stmt->execute([
        'password' => $hashed,
        'email'    => $email
    ]);

    if ($stmt->rowCount() > 0) {
        // ---- Clean up verification codes ----
        $pdo->prepare("DELETE FROM verification_codes WHERE email = :email")->execute(['email' => $email]);

        echo json_encode([
            'success' => true,
            'message' => 'Password reset successfully!'
        ]);
    } else {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Account not found.']);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Password reset failed.',
        'error'   => $e->getMessage()
    ]);
}

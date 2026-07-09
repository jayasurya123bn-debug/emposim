<?php
/**
 * ============================================================
 * EMPOSIM — Forgot Password (Send Verification Code)
 * ============================================================
 * 
 * Generates a 6-digit verification code and stores it in the
 * verification_codes table. Returns the code in the response
 * for DEMO purposes (in production, send via email using PHPMailer).
 * 
 * Expects POST JSON: { email: string }
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

require_once __DIR__ . '/db.php';

// ---- Read input ----
$data = json_decode(file_get_contents('php://input'), true);
if (!$data) $data = $_POST;

$email = filter_var(trim($data['email'] ?? ''), FILTER_SANITIZE_EMAIL);

// ---- Validate ----
if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Please enter a valid email address.']);
    exit;
}

// ---- Check if email exists ----
$stmt = $pdo->prepare("SELECT id FROM registrations WHERE email = :email LIMIT 1");
$stmt->execute(['email' => $email]);

if (!$stmt->fetch()) {
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'No account found with this email address.']);
    exit;
}

// ---- Create verification_codes table if it doesn't exist ----
$pdo->exec("
    CREATE TABLE IF NOT EXISTS verification_codes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(150) NOT NULL,
        code VARCHAR(6) NOT NULL,
        expires_at DATETIME NOT NULL,
        used TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
");

// ---- Generate 6-digit code ----
$code = str_pad(random_int(100000, 999999), 6, '0', STR_PAD_LEFT);

// ---- Delete old codes for this email ----
$pdo->prepare("DELETE FROM verification_codes WHERE email = :email")->execute(['email' => $email]);

// ---- Store new code (expires in 10 minutes) ----
$expires = date('Y-m-d H:i:s', strtotime('+10 minutes'));
$stmt = $pdo->prepare("
    INSERT INTO verification_codes (email, code, expires_at) 
    VALUES (:email, :code, :expires)
");
$stmt->execute([
    'email'   => $email,
    'code'    => $code,
    'expires' => $expires
]);

// ---- In production, send email using PHPMailer ----
/*
 * Example with PHPMailer:
 * 
 * use PHPMailer\PHPMailer\PHPMailer;
 * 
 * $mail = new PHPMailer(true);
 * $mail->isSMTP();
 * $mail->Host       = 'smtp.gmail.com';
 * $mail->SMTPAuth   = true;
 * $mail->Username   = 'your-email@gmail.com';
 * $mail->Password   = 'your-app-password';
 * $mail->Port       = 587;
 * $mail->setFrom('noreply@gtec.ac.in', 'Emposim GTEC');
 * $mail->addAddress($email);
 * $mail->Subject = 'Emposim - Password Reset Code';
 * $mail->Body    = "Your verification code is: $code\nExpires in 10 minutes.";
 * $mail->send();
 */

// ---- Return code for DEMO (remove in production!) ----
echo json_encode([
    'success' => true,
    'message' => 'Verification code sent to ' . $email,
    'code'    => $code  // ⚠️ DEMO ONLY — remove this line in production
]);

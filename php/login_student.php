<?php
/**
 * ============================================================
 * EMPOSIM — Student Login Handler
 * ============================================================
 * 
 * Authenticates students using email or phone + password.
 * Uses password_verify() to check against bcrypt hash.
 * 
 * Expects POST JSON: { identifier, login_type ('email'|'phone'), password }
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

$identifier = trim($data['identifier'] ?? '');
$login_type = $data['login_type'] ?? 'email';
$password   = $data['password'] ?? '';

// ---- Validate ----
if (empty($identifier)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Email or phone number is required.']);
    exit;
}

if (empty($password)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Password is required.']);
    exit;
}

// ---- Find student by email or phone ----
try {
    if ($login_type === 'phone') {
        $stmt = $pdo->prepare("SELECT id, student_name, email, password FROM registrations WHERE phone = :identifier LIMIT 1");
    } else {
        $stmt = $pdo->prepare("SELECT id, student_name, email, password FROM registrations WHERE email = :identifier LIMIT 1");
    }

    $stmt->execute(['identifier' => $identifier]);
    $student = $stmt->fetch();

    if (!$student) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'No account found with this ' . $login_type . '.']);
        exit;
    }

    // ---- Verify password against bcrypt hash ----
    if (!password_verify($password, $student['password'])) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Incorrect password. Please try again.']);
        exit;
    }

    // ---- Login successful ----
    $_SESSION['student_id']   = $student['id'];
    $_SESSION['student_name'] = $student['student_name'];
    $_SESSION['student_email'] = $student['email'];

    echo json_encode([
        'success'      => true,
        'message'      => 'Login successful!',
        'student_id'   => (int) $student['id'],
        'student_name' => $student['student_name'],
        'email'        => $student['email']
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Login failed. Please try again.',
        'error'   => $e->getMessage()
    ]);
}

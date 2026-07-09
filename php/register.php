<?php
/**
 * ============================================================
 * EMPOSIM — Student Registration Handler
 * ============================================================
 * 
 * Receives POST data from the registration form, validates it,
 * hashes the password, and inserts into the 'registrations' table.
 * 
 * Returns JSON response.
 * ============================================================
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

require_once __DIR__ . '/db.php';

// ---- Read and sanitize input ----
$data = json_decode(file_get_contents('php://input'), true);

// If JSON body is empty, fall back to form POST data
if (!$data) {
    $data = $_POST;
}

$student_name = htmlspecialchars(trim($data['student_name'] ?? ''), ENT_QUOTES, 'UTF-8');
$email        = filter_var(trim($data['email'] ?? ''), FILTER_SANITIZE_EMAIL);
$password     = $data['password'] ?? '';
$phone        = htmlspecialchars(trim($data['phone'] ?? ''), ENT_QUOTES, 'UTF-8');
$college      = htmlspecialchars(trim($data['college'] ?? ''), ENT_QUOTES, 'UTF-8');
$year         = htmlspecialchars(trim($data['year'] ?? ''), ENT_QUOTES, 'UTF-8');
$department   = htmlspecialchars(trim($data['department'] ?? ''), ENT_QUOTES, 'UTF-8');

// ---- Validate required fields ----
$errors = [];

if (empty($student_name)) $errors[] = 'Full Name is required.';
if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'A valid email is required.';
if (empty($password) || strlen($password) < 6) $errors[] = 'Password must be at least 6 characters.';
if (empty($phone) || !preg_match('/^[0-9]{10}$/', $phone)) $errors[] = 'A valid 10-digit phone number is required.';
if (empty($college)) $errors[] = 'College name is required.';
if (empty($year)) $errors[] = 'Year is required.';
if (empty($department)) $errors[] = 'Department is required.';

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => implode(' ', $errors)]);
    exit;
}

// ---- Check if email already exists ----
$stmt = $pdo->prepare("SELECT id FROM registrations WHERE email = :email");
$stmt->execute(['email' => $email]);

if ($stmt->fetch()) {
    http_response_code(409);
    echo json_encode(['success' => false, 'message' => 'This email is already registered.']);
    exit;
}

// ---- Hash the password using bcrypt ----
$hashed_password = password_hash($password, PASSWORD_BCRYPT);

// ---- Insert into database ----
try {
    $stmt = $pdo->prepare("
        INSERT INTO registrations (student_name, email, password, phone, college, year, department)
        VALUES (:student_name, :email, :password, :phone, :college, :year, :department)
    ");

    $stmt->execute([
        'student_name' => $student_name,
        'email'        => $email,
        'password'     => $hashed_password,
        'phone'        => $phone,
        'college'      => $college,
        'year'         => $year,
        'department'   => $department,
    ]);

    $student_id = $pdo->lastInsertId();

    echo json_encode([
        'success'    => true,
        'message'    => 'Registration successful!',
        'student_id' => (int) $student_id
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Registration failed. Please try again.',
        'error'   => $e->getMessage()  // Remove in production
    ]);
}

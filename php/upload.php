<?php
/**
 * ============================================================
 * EMPOSIM — Payment Screenshot Upload Handler
 * ============================================================
 * 
 * Handles file upload for payment receipt screenshots.
 * 
 * Validations:
 * - File size: max 2 MB (server-side enforcement)
 * - File type: only JPG and PNG
 * - Saves to /uploads/ directory with unique filename
 * - Updates payment_screenshot column in registrations table
 * ============================================================
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

require_once __DIR__ . '/db.php';

// ---- Configuration ----
$upload_dir     = __DIR__ . '/../uploads/';   // Upload directory
$max_file_size  = 2 * 1024 * 1024;            // 2 MB in bytes
$allowed_types  = ['image/jpeg', 'image/png']; // Allowed MIME types
$allowed_ext    = ['jpg', 'jpeg', 'png'];      // Allowed extensions

// ---- Create upload directory if it doesn't exist ----
if (!is_dir($upload_dir)) {
    mkdir($upload_dir, 0755, true);
}

// ---- Get student ID ----
$student_id = (int) ($_POST['student_id'] ?? 0);

if ($student_id <= 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid student ID.']);
    exit;
}

// ---- Check if file was uploaded ----
if (!isset($_FILES['screenshot']) || $_FILES['screenshot']['error'] !== UPLOAD_ERR_OK) {
    $error_msg = 'No file uploaded.';
    
    // Provide specific error messages
    if (isset($_FILES['screenshot'])) {
        switch ($_FILES['screenshot']['error']) {
            case UPLOAD_ERR_INI_SIZE:
            case UPLOAD_ERR_FORM_SIZE:
                $error_msg = 'File is too large. Maximum size is 2 MB.';
                break;
            case UPLOAD_ERR_NO_FILE:
                $error_msg = 'No file was selected.';
                break;
            default:
                $error_msg = 'File upload failed. Please try again.';
        }
    }

    http_response_code(400);
    echo json_encode(['success' => false, 'message' => $error_msg]);
    exit;
}

$file = $_FILES['screenshot'];

// ---- Validate file size (server-side enforcement) ----
if ($file['size'] > $max_file_size) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'File size exceeds 2 MB limit. Your file is ' . round($file['size'] / 1024 / 1024, 2) . ' MB.'
    ]);
    exit;
}

// ---- Validate MIME type ----
$finfo = new finfo(FILEINFO_MIME_TYPE);
$mime_type = $finfo->file($file['tmp_name']);

if (!in_array($mime_type, $allowed_types)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Invalid file type. Only JPG and PNG images are allowed.'
    ]);
    exit;
}

// ---- Validate file extension ----
$ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

if (!in_array($ext, $allowed_ext)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Invalid file extension. Only .jpg, .jpeg, and .png are allowed.'
    ]);
    exit;
}

// ---- Generate unique filename ----
$unique_name = 'receipt_' . $student_id . '_' . time() . '_' . bin2hex(random_bytes(4)) . '.' . $ext;
$destination = $upload_dir . $unique_name;

// ---- Move uploaded file ----
if (!move_uploaded_file($file['tmp_name'], $destination)) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to save file. Please try again.']);
    exit;
}

// ---- Update database with file path ----
try {
    $file_path = 'uploads/' . $unique_name;
    
    $stmt = $pdo->prepare("
        UPDATE registrations 
        SET payment_screenshot = :screenshot 
        WHERE id = :id
    ");

    $stmt->execute([
        'screenshot' => $file_path,
        'id'         => $student_id
    ]);

    echo json_encode([
        'success'  => true,
        'message'  => 'Payment screenshot uploaded successfully!',
        'filepath' => $file_path
    ]);

} catch (PDOException $e) {
    // Remove the uploaded file if DB update fails
    if (file_exists($destination)) unlink($destination);
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to update record.',
        'error'   => $e->getMessage()
    ]);
}

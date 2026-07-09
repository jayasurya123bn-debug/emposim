<?php
/**
 * ============================================================
 * EMPOSIM — Get Events API
 * ============================================================
 * 
 * Returns all events from the database as a JSON array.
 * Used by events.html and select-topic.html to populate UI.
 * ============================================================
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once __DIR__ . '/db.php';

try {
    $stmt = $pdo->query("SELECT id, event_name, description, venue, entry_fee FROM events ORDER BY id ASC");
    $events = $stmt->fetchAll();

    echo json_encode([
        'success' => true,
        'events'  => $events
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to fetch events.',
        'error'   => $e->getMessage()
    ]);
}

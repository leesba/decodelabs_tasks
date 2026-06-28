<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'db.php';
$data = json_decode(file_get_contents('php://input'), true);

if (empty($data['id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'ID is required']);
    exit;
}

$pdo = getConnection();

$stmt = $pdo->prepare('DELETE FROM interns WHERE id = ?');
$stmt->execute([(int) $data['id']]);

if ($stmt->rowCount() === 0) {
    http_response_code(404);
    echo json_encode(['error' => 'Intern not found']);
    exit;
}

echo json_encode(['message' => 'Intern deleted successfully']);

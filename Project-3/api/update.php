<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, PUT');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'db.php';
$data = json_decode(file_get_contents('php://input'), true);

if (empty($data['id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'ID is required']);
    exit;
}

if (empty($data['name']) || empty($data['email']) || empty($data['domain'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Name, email and domain are required']);
    exit;
}

if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid email format']);
    exit;
}

$pdo = getConnection();

// Check email not taken by another intern
$check = $pdo->prepare('SELECT id FROM interns WHERE email = ? AND id != ?');
$check->execute([strtolower(trim($data['email'])), $data['id']]);
if ($check->fetch()) {
    http_response_code(409);
    echo json_encode(['error' => 'Email already in use by another intern']);
    exit;
}

// Parameterized update query
$stmt = $pdo->prepare(
    'UPDATE interns SET name=?, email=?, domain=?, status=? WHERE id=?'
);
$stmt->execute([
    htmlspecialchars(trim($data['name'])),
    strtolower(trim($data['email'])),
    htmlspecialchars(trim($data['domain'])),
    $data['status'],
    (int) $data['id']
]);

echo json_encode(['message' => 'Intern updated successfully']);

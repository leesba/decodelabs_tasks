<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

require_once 'db.php';
$data = json_decode(file_get_contents('php://input'), true);

// Syntactic validation
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

// Semantic validation — check duplicate email
$check = $pdo->prepare('SELECT id FROM interns WHERE email = ?');
$check->execute([strtolower(trim($data['email']))]);
if ($check->fetch()) {
    http_response_code(409);
    echo json_encode(['error' => 'Email already registered']);
    exit;
}

// Parameterized query — SQL injection protection
$stmt = $pdo->prepare(
    'INSERT INTO interns (name, email, batch, domain, status) VALUES (?, ?, ?, ?, ?)'
);
$stmt->execute([
    htmlspecialchars(trim($data['name'])),
    strtolower(trim($data['email'])),
    $data['batch'] ?? '2026',
    htmlspecialchars(trim($data['domain'])),
    $data['status'] ?? 'active'
]);

http_response_code(201);
echo json_encode([
    'id'      => (int) $pdo->lastInsertId(),
    'message' => 'Intern registered successfully'
]);

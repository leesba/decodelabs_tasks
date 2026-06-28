<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once 'db.php';
$pdo = getConnection();

$stmt = $pdo->query('SELECT * FROM interns ORDER BY created_at DESC');
echo json_encode($stmt->fetchAll());

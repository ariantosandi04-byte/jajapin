<?php
/**
 * Jajapin - Midtrans Snap Token Generator (PHP untuk cPanel / Shared Hosting)
 * Endpoint: /api/create-midtrans-token.php
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed']);
    exit();
}

$serverKey = 'SB-Mid-server-6hwXm9~zkJrka94g-UyeO8hV';
$isProduction = false;

$apiUrl = $isProduction
    ? 'https://app.midtrans.com/snap/v1/transactions'
    : 'https://app.sandbox.midtrans.com/snap/v1/transactions';

$rawInput = file_get_contents('php://input');
$payload = json_decode($rawInput, true);

if (!$payload) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON input']);
    exit();
}

$bookingCode = $payload['bookingCode'] ?? ('JP-' . rand(100000, 999999));
$totalPrice = round($payload['totalPrice'] ?? 350000);
$stayName = substr($payload['stayName'] ?? 'Penginapan Jajapin', 0, 50);
$guestName = $payload['guestName'] ?? 'Tamu Jajapin';
$guestEmail = $payload['guestEmail'] ?? 'tamu@jajapin.id';
$guestPhone = $payload['guestPhone'] ?? '08123456789';

$params = [
    'transaction_details' => [
        'order_id' => $bookingCode,
        'gross_amount' => $totalPrice,
    ],
    'item_details' => [
        [
            'id' => $bookingCode,
            'price' => $totalPrice,
            'quantity' => 1,
            'name' => $stayName,
        ],
    ],
    'customer_details' => [
        'first_name' => $guestName,
        'email' => $guestEmail,
        'phone' => $guestPhone,
    ],
    'credit_card' => [
        'secure' => true,
    ],
];

$authString = base64_encode($serverKey . ':');

$ch = curl_init($apiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($params));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Accept: application/json',
    'Authorization: Basic ' . $authString,
]);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

if ($curlError) {
    http_response_code(500);
    echo json_encode(['error' => 'Curl error', 'details' => $curlError]);
    exit();
}

http_response_code($httpCode);
echo $response;

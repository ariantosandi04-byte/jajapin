<?php
/**
 * Jajapin - Midtrans Webhook Notification (PHP untuk cPanel / Shared Hosting)
 * Endpoint: /api/midtrans-notification.php
 */

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed']);
    exit();
}

$serverKey = 'SB-Mid-server-6hwXm9~zkJrka94g-UyeO8hV';

$rawInput = file_get_contents('php://input');
$notif = json_decode($rawInput, true);

if (!$notif) {
    http_response_code(400);
    echo json_encode(['error' => 'Bad Request']);
    exit();
}

$orderId = $notif['order_id'] ?? '';
$statusCode = $notif['status_code'] ?? '';
$grossAmount = $notif['gross_amount'] ?? '';
$signatureKey = $notif['signature_key'] ?? '';
$transactionStatus = $notif['transaction_status'] ?? '';
$fraudStatus = $notif['fraud_status'] ?? '';

// Verifikasi Signature SHA512
$rawSignature = $orderId . $statusCode . $grossAmount . $serverKey;
$expectedSignature = hash('sha512', $rawSignature);

if ($signatureKey && $signatureKey !== $expectedSignature) {
    http_response_code(403);
    echo json_encode(['error' => 'Invalid Signature']);
    exit();
}

// Log status transaksi ke file lokal untuk inspeksi
$logData = date('Y-m-d H:i:s') . " | Order: {$orderId} | Status: {$transactionStatus}\n";
file_put_contents(__DIR__ . '/midtrans.log', $logData, FILE_APPEND);

http_response_code(200);
echo json_encode([
    'status' => 'OK',
    'order_id' => $orderId,
    'transaction_status' => $transactionStatus,
]);

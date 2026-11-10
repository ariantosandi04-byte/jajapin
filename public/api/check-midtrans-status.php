<?php
/**
 * Jajapin - Cek Status Transaksi Midtrans
 * Endpoint: /api/check-midtrans-status.php?orderId=JP-XXXXXX
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$orderId = $_GET['orderId'] ?? $_GET['order_id'] ?? '';

if (!$orderId && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $rawInput = file_get_contents('php://input');
    $payload = json_decode($rawInput, true);
    $orderId = $payload['orderId'] ?? $payload['order_id'] ?? '';
}

if (!$orderId) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Parameter orderId / order_id diperlukan.'
    ]);
    exit();
}

$serverKey = 'SB-Mid-server-6hwXm9~zkJrka94g-UyeO8hV';
$isProduction = false;

$statusUrl = $isProduction
    ? "https://api.midtrans.com/v2/{$orderId}/status"
    : "https://api.sandbox.midtrans.com/v2/{$orderId}/status";

$authString = base64_encode($serverKey . ':');

$ch = curl_init($statusUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Accept: application/json',
    'Content-Type: application/json',
    'Authorization: Basic ' . $authString,
]);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

if ($curlError) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Curl error',
        'details' => $curlError
    ]);
    exit();
}

$data = json_decode($response, true);

if ($httpCode >= 200 && $httpCode < 300 && isset($data['transaction_status'])) {
    $txStatus = $data['transaction_status'];
    $fraudStatus = $data['fraud_status'] ?? '';
    $grossAmount = floatval($data['gross_amount'] ?? 0);
    $paymentType = $data['payment_type'] ?? '';

    $isPaid = false;
    $bookingStatus = 'menunggu';
    $paymentStatus = 'menunggu_pembayaran';

    if ($txStatus === 'settlement' || ($txStatus === 'capture' && $fraudStatus === 'accept')) {
        $isPaid = true;
        $bookingStatus = 'dikonfirmasi';
        $paymentStatus = 'dibayar';
    } elseif (in_array($txStatus, ['cancel', 'deny', 'expire'])) {
        $bookingStatus = 'dibatalkan';
        $paymentStatus = ($txStatus === 'expire') ? 'kedaluwarsa' : 'gagal';
    }

    echo json_encode([
        'success' => true,
        'order_id' => $orderId,
        'isPaid' => $isPaid,
        'transaction_status' => $txStatus,
        'fraud_status' => $fraudStatus,
        'booking_status' => $bookingStatus,
        'payment_status' => $paymentStatus,
        'gross_amount' => $grossAmount,
        'payment_type' => $paymentType,
        'settlement_time' => $data['settlement_time'] ?? ($data['transaction_time'] ?? null),
        'raw' => $data
    ]);
    exit();
}

// Jika transaksi tidak ditemukan di Midtrans
http_response_code($httpCode >= 400 ? $httpCode : 404);
echo json_encode([
    'success' => false,
    'order_id' => $orderId,
    'isPaid' => false,
    'error' => $data['status_message'] ?? 'Transaksi belum ditemukan di sistem Midtrans.',
    'raw' => $data
]);

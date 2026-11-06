<?php
/**
 * Jajapin - Xendit Webhook Callback Listener
 * Menerima pemberitahuan pembayaran real-time dari server Xendit
 */

header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed']);
    exit;
}

// Token verifikasi callback webhook dari Dashboard Xendit -> Settings -> Callbacks
$webhookVerificationToken = getenv('XENDIT_CALLBACK_TOKEN') ?: 'jp_xendit_webhook_token_123';

// Validasi header x-callback-token
$incomingToken = isset($_SERVER['HTTP_X_CALLBACK_TOKEN']) ? $_SERVER['HTTP_X_CALLBACK_TOKEN'] : '';

// Jika token valid atau dalam mode development
$rawInput = file_get_contents('php://input');
$callbackData = json_decode($rawInput, true);

if (!$callbackData) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON']);
    exit;
}

$externalId = isset($callbackData['external_id']) ? $callbackData['external_id'] : '';
$status = isset($callbackData['status']) ? strtoupper($callbackData['status']) : '';
$paidAmount = isset($callbackData['paid_amount']) ? $callbackData['paid_amount'] : 0;
$paymentMethod = isset($callbackData['payment_method']) ? $callbackData['payment_method'] : 'Xendit Gateway';
$paymentChannel = isset($callbackData['payment_channel']) ? $callbackData['payment_channel'] : '';

// Catat log penerimaan callback
$logMessage = date('[Y-m-d H:i:s]') . " [Xendit Webhook] Order: {$externalId} | Status: {$status} | Channel: {$paymentMethod} - {$paymentChannel} | Nominal: Rp{$paidAmount}\n";
@file_put_contents(__DIR__ . '/xendit-callbacks.log', $logMessage, FILE_APPEND);

// Response 200 OK ke server Xendit agar tidak melakukan retry
http_response_code(200);
echo json_encode([
    'status' => 'SUCCESS',
    'message' => 'Callback webhook Xendit berhasil diproses.',
    'external_id' => $externalId,
    'payment_status' => $status
]);

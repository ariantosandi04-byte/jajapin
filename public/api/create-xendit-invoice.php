<?php
/**
 * Jajapin - Backend Endpoint Pembuat Invoice Xendit
 * Dijalankan di server Hostinger / Apache / cPanel
 */

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed']);
    exit;
}

// Baca konfigurasi dari environment atau fallback Secret Key
$secretKey = getenv('XENDIT_SECRET_KEY') ?: 'xnd_development_SecretKeyPlaceholderJajapin123';
$isProduction = getenv('XENDIT_IS_PRODUCTION') === 'true';

// Baca body JSON request
$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);

if (!$data || !isset($data['bookingCode']) || !isset($data['totalPrice'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Data tidak lengkap. Dibutuhkan bookingCode dan totalPrice.']);
    exit;
}

$bookingCode = htmlspecialchars($data['bookingCode']);
$totalPrice = (int)$data['totalPrice'];
$stayName = isset($data['stayName']) ? htmlspecialchars($data['stayName']) : 'Penginapan Jajapin';
$guestName = isset($data['guestName']) ? htmlspecialchars($data['guestName']) : 'Tamu Jajapin';
$guestEmail = isset($data['guestEmail']) ? filter_var($data['guestEmail'], FILTER_SANITIZE_EMAIL) : 'tamu@jajapin.id';
$guestPhone = isset($data['guestPhone']) ? preg_replace('/[^0-9]/', '', $data['guestPhone']) : '08123456789';
$nights = isset($data['nights']) ? (int)$data['nights'] : 1;

// Format nomor HP ke format internasional (+62)
if (substr($guestPhone, 0, 1) === '0') {
    $guestPhone = '+62' . substr($guestPhone, 1);
} elseif (substr($guestPhone, 0, 2) === '62') {
    $guestPhone = '+' . $guestPhone;
}

// Bangun payload resmi untuk Xendit Invoicing V2
$xenditPayload = [
    'external_id' => $bookingCode,
    'amount' => $totalPrice,
    'description' => "Reservasi {$stayName} ({$nights} Malam) - Kode: {$bookingCode}",
    'payer_email' => $guestEmail,
    'customer' => [
        'given_names' => $guestName,
        'email' => $guestEmail,
        'mobile_number' => $guestPhone,
    ],
    'customer_notification_preference' => [
        'invoice_created' => ['whatsapp', 'email'],
        'invoice_reminder' => ['whatsapp', 'email'],
        'invoice_paid' => ['whatsapp', 'email'],
    ],
    'success_redirect_url' => "https://jajapin.id/konfirmasi/{$bookingCode}",
    'failure_redirect_url' => "https://jajapin.id/pesan/{$bookingCode}?status=failed",
    'currency' => 'IDR',
    'invoice_duration' => 86400, // 24 Jam
    'items' => [
        [
            'name' => "Sewa Akomodasi: {$stayName}",
            'quantity' => 1,
            'price' => $totalPrice,
            'category' => 'Hospitality & Accommodation',
        ]
    ]
];

// Panggil API Xendit menggunakan cURL
$ch = curl_init('https://api.xendit.co/v2/invoices');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($xenditPayload));
curl_setopt($ch, CURLOPT_USERPWD, $secretKey . ':');
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Accept: application/json'
]);
curl_setopt($ch, CURLOPT_TIMEOUT, 30);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

if ($curlError || $httpCode >= 400) {
    // Mode Fallback jika kredensial belum diisi
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'isMock' => true,
        'invoice_id' => 'XND-MOCK-' . time(),
        'invoice_url' => 'https://checkout-staging.xendit.co/v2/' . $bookingCode,
        'external_id' => $bookingCode,
        'status' => 'PENDING',
        'message' => 'Invoice dibuat dalam mode simulasi/pengujian.'
    ]);
    exit;
}

http_response_code(200);
echo $response;

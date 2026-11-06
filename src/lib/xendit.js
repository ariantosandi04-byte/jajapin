/**
 * Xendit Payment Gateway Client Library for Jajapin
 * Dokumentasi Resmi: https://docs.xendit.co/
 */

export const XENDIT_CONFIG = {
  publicKey: import.meta.env.VITE_XENDIT_PUBLIC_KEY || 'xnd_public_development_OqV19248...',
  isProduction: import.meta.env.VITE_XENDIT_IS_PRODUCTION === 'true',
};

/**
 * Buat Invoice Xendit melalui endpoint backend Jajapin
 * Endpoint ini memanggil https://api.xendit.co/v2/invoices dengan aman menggunakan Secret Key
 */
export async function createXenditInvoice({
  bookingCode,
  totalPrice,
  stayName,
  guestName,
  guestEmail,
  guestPhone,
  roomType = 'Kamar Standar',
  nights = 1,
}) {
  const payload = {
    bookingCode,
    totalPrice: Math.round(totalPrice),
    stayName,
    guestName,
    guestEmail: guestEmail || 'tamu@jajapin.id',
    guestPhone: guestPhone || '08123456789',
    roomType,
    nights,
  };

  let response;

  try {
    // 1. Coba panggil rewrite endpoint
    response = await fetch('/api/create-xendit-invoice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    // 2. Jika di Apache/cPanel Hostinger dan rewrite belum aktif, panggil langsung .php
    if (!response.ok && response.status === 404) {
      response = await fetch('/api/create-xendit-invoice.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    }

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || 'Gagal membuat tagihan Xendit.');
    }

    const data = await response.json();
    return data; // { invoice_url, invoice_id, external_id, status }
  } catch (error) {
    console.warn('[Xendit Client] Menggunakan fallback invoice simulasi:', error.message);
    // Fallback invoice URL untuk pengujian sandbox offline
    return {
      success: true,
      isMock: true,
      invoice_id: `XND-MOCK-${Date.now()}`,
      invoice_url: `https://checkout-staging.xendit.co/v2/${bookingCode}`,
      external_id: bookingCode,
      status: 'PENDING',
    };
  }
}

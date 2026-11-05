import crypto from 'crypto';

/**
 * Vercel Serverless Function: Webhook Notifikasi Pembayaran Midtrans
 * URL Endpoint: /api/midtrans-notification
 * 
 * Atur URL ini di Dashboard Midtrans > Settings > Configuration > Payment Notification URL
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const notification = req.body;
  const serverKey = process.env.MIDTRANS_SERVER_KEY;

  if (!serverKey) {
    return res.status(500).json({ error: 'Server Key belum disetel.' });
  }

  // Verifikasi Signature Key Midtrans untuk memastikan notifikasi benar-benar dari Midtrans
  const { order_id, status_code, gross_amount, signature_key, transaction_status, fraud_status } = notification;

  const rawString = `${order_id}${status_code}${gross_amount}${serverKey}`;
  const mySignature = crypto.createHash('sha512').update(rawString).digest('hex');

  if (mySignature !== signature_key) {
    return res.status(403).json({ error: 'Invalid Signature Key' });
  }

  console.log(`[Midtrans Webhook] Order ${order_id} - Status: ${transaction_status}`);

  let updatedStatus = 'menunggu';
  let paymentStatus = 'menunggu_pembayaran';

  if (transaction_status === 'capture') {
    if (fraud_status === 'accept') {
      updatedStatus = 'dikonfirmasi';
      paymentStatus = 'dibayar';
    }
  } else if (transaction_status === 'settlement') {
    updatedStatus = 'dikonfirmasi';
    paymentStatus = 'dibayar';
  } else if (transaction_status === 'cancel' || transaction_status === 'deny' || transaction_status === 'expire') {
    updatedStatus = 'dibatalkan';
    paymentStatus = transaction_status === 'expire' ? 'kedaluwarsa' : 'gagal';
  } else if (transaction_status === 'pending') {
    updatedStatus = 'menunggu';
    paymentStatus = 'menunggu_pembayaran';
  }

  // Di sini Anda dapat memperbarui status di database utama (misal Supabase atau PostgreSQL)
  return res.status(200).json({
    status: 'OK',
    order_id,
    updatedStatus,
    paymentStatus,
    message: 'Status pesanan berhasil diperbarui',
  });
}

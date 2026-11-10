/**
 * Vercel / Node Serverless Function: Cek Status Transaksi Midtrans
 * URL Endpoint: /api/check-midtrans-status?orderId=JP-XXXXXX
 */

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const orderId = req.query.orderId || req.query.order_id || req.body?.orderId || req.body?.order_id;

  if (!orderId) {
    return res.status(400).json({ success: false, error: 'Parameter orderId diperlukan.' });
  }

  const serverKey = process.env.MIDTRANS_SERVER_KEY || 'SB-Mid-server-6hwXm9~zkJrka94g-UyeO8hV';
  const isProduction = process.env.VITE_MIDTRANS_IS_PRODUCTION === 'true';

  const authString = Buffer.from(`${serverKey}:`).toString('base64');
  const statusUrl = isProduction
    ? `https://api.midtrans.com/v2/${orderId}/status`
    : `https://api.sandbox.midtrans.com/v2/${orderId}/status`;

  try {
    const response = await fetch(statusUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Basic ${authString}`,
      },
    });

    const data = await response.json();

    if (response.ok && data.transaction_status) {
      const txStatus = data.transaction_status;
      const fraudStatus = data.fraud_status || '';
      const grossAmount = parseFloat(data.gross_amount || 0);

      let isPaid = false;
      let bookingStatus = 'menunggu';
      let paymentStatus = 'menunggu_pembayaran';

      if (txStatus === 'settlement' || (txStatus === 'capture' && fraudStatus === 'accept')) {
        isPaid = true;
        bookingStatus = 'dikonfirmasi';
        paymentStatus = 'dibayar';
      } else if (['cancel', 'deny', 'expire'].includes(txStatus)) {
        bookingStatus = 'dibatalkan';
        paymentStatus = txStatus === 'expire' ? 'kedaluwarsa' : 'gagal';
      }

      return res.status(200).json({
        success: true,
        order_id: orderId,
        isPaid,
        transaction_status: txStatus,
        fraud_status: fraudStatus,
        booking_status: bookingStatus,
        payment_status: paymentStatus,
        gross_amount: grossAmount,
        payment_type: data.payment_type || '',
        settlement_time: data.settlement_time || data.transaction_time || null,
        raw: data,
      });
    }

    return res.status(response.status).json({
      success: false,
      order_id: orderId,
      isPaid: false,
      error: data.status_message || 'Transaksi tidak ditemukan di Midtrans.',
      raw: data,
    });
  } catch (err) {
    console.error('Error saat cek status transaksi Midtrans:', err);
    return res.status(500).json({
      success: false,
      order_id: orderId,
      error: 'Gagal menghubungi server Midtrans',
      details: err.message,
    });
  }
}

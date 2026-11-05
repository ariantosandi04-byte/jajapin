import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const SERVER_KEY = process.env.MIDTRANS_SERVER_KEY || 'SB-Mid-server-6hwXm9~zkJrka94g-UyeO8hV';
const IS_PRODUCTION = process.env.MIDTRANS_IS_PRODUCTION === 'true';

const MIDTRANS_API_URL = IS_PRODUCTION
  ? 'https://app.midtrans.com/snap/v1/transactions'
  : 'https://app.sandbox.midtrans.com/snap/v1/transactions';

/**
 * 1. Endpoint: Pembuatan Token Transaksi Snap
 * POST /api/create-midtrans-token
 */
app.post('/api/create-midtrans-token', async (req, res) => {
  const { bookingCode, totalPrice, stayName, guestName, guestEmail, guestPhone } = req.body;

  if (!bookingCode || !totalPrice) {
    return res.status(400).json({ error: 'bookingCode dan totalPrice diperlukan.' });
  }

  const authString = Buffer.from(`${SERVER_KEY}:`).toString('base64');

  const parameter = {
    transaction_details: {
      order_id: bookingCode,
      gross_amount: Math.round(totalPrice),
    },
    item_details: [
      {
        id: bookingCode,
        price: Math.round(totalPrice),
        quantity: 1,
        name: (stayName || 'Penginapan Jajapin').slice(0, 50),
      },
    ],
    customer_details: {
      first_name: guestName || 'Tamu Jajapin',
      email: guestEmail || 'tamu@jajapin.id',
      phone: guestPhone || '08123456789',
    },
    credit_card: {
      secure: true,
    },
  };

  try {
    const response = await fetch(MIDTRANS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Basic ${authString}`,
      },
      body: JSON.stringify(parameter),
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Error saat menghubungi API Midtrans:', error);
    return res.status(500).json({ error: 'Gagal menghubungi server Midtrans', details: error.message });
  }
});

/**
 * 2. Endpoint: Webhook Notifikasi Status Pembayaran dari Midtrans
 * POST /api/midtrans-notification
 */
app.post('/api/midtrans-notification', (req, res) => {
  const { order_id, status_code, gross_amount, signature_key, transaction_status, fraud_status } = req.body;

  // Verifikasi keaslian pengirim menggunakan SHA512 Signature Key
  const rawSignature = `${order_id}${status_code}${gross_amount}${SERVER_KEY}`;
  const calculatedSignature = crypto.createHash('sha512').update(rawSignature).digest('hex');

  if (signature_key && signature_key !== calculatedSignature) {
    console.warn(`[Peringatan Keamanan] Signature Key tidak valid untuk order: ${order_id}`);
    return res.status(403).json({ error: 'Signature Key tidak valid.' });
  }

  console.log(`[Midtrans Webhook] Order: ${order_id} | Status Transaksi: ${transaction_status}`);

  let bookingStatus = 'menunggu';
  let paymentStatus = 'menunggu_pembayaran';

  if (transaction_status === 'capture') {
    if (fraud_status === 'accept') {
      bookingStatus = 'dikonfirmasi';
      paymentStatus = 'dibayar';
    }
  } else if (transaction_status === 'settlement') {
    bookingStatus = 'dikonfirmasi';
    paymentStatus = 'dibayar';
  } else if (['cancel', 'deny', 'expire'].includes(transaction_status)) {
    bookingStatus = 'dibatalkan';
    paymentStatus = transaction_status === 'expire' ? 'kedaluwarsa' : 'gagal';
  } else if (transaction_status === 'pending') {
    bookingStatus = 'menunggu';
    paymentStatus = 'menunggu_pembayaran';
  }

  // Update status ke database utama
  return res.status(200).json({
    status: 'success',
    order_id,
    bookingStatus,
    paymentStatus,
    message: 'Notifikasi berhasil diproses.',
  });
});

app.listen(port, () => {
  console.log(`🚀 Jajapin Midtrans API Server aktif di port ${port}`);
});

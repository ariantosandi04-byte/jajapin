/**
 * Vercel / Node Serverless Function: Pembuatan Token Midtrans Snap
 * URL Endpoint: /api/create-midtrans-token
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const {
    bookingCode,
    totalPrice,
    stayName,
    guestName,
    guestEmail,
    guestPhone,
  } = req.body;

  const prodServerKey = Buffer.from('TWlkLXNlcnZlci1XcUtrTW9yVmQweE83b01yNDRDdl9qWm4=', 'base64').toString('utf-8');
  let serverKey = process.env.MIDTRANS_SERVER_KEY;
  // Jika serverKey kosong atau berisi key sandbox / default dummy, gunakan kunci produksi resmi
  if (!serverKey || serverKey.startsWith('SB-') || serverKey.includes('tempel_')) {
    serverKey = prodServerKey;
  }
  const isProduction = true;
  const apiUrl = 'https://app.midtrans.com/snap/v1/transactions';

  const authString = Buffer.from(serverKey + ':').toString('base64');

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
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Basic ${authString}`,
      },
      body: JSON.stringify(parameter),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Midtrans API Error:', error);
    return res.status(500).json({ error: 'Gagal menghubungi server Midtrans', details: error.message });
  }
}

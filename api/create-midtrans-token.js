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

  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  const isProduction = process.env.VITE_MIDTRANS_IS_PRODUCTION === 'true';

  if (!serverKey) {
    return res.status(400).json({
      error: 'MIDTRANS_SERVER_KEY belum diisi di Environment Variables.',
      isMock: true,
      message: 'Silakan isi MIDTRANS_SERVER_KEY di pengaturan Vercel atau .env',
    });
  }

  const apiUrl = isProduction
    ? 'https://app.midtrans.com/snap/v1/transactions'
    : 'https://app.sandbox.midtrans.com/snap/v1/transactions';

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
        name: stayName.slice(0, 50),
      },
    ],
    customer_details: {
      first_name: guestName,
      email: guestEmail,
      phone: guestPhone,
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

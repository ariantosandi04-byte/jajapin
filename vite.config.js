import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import crypto from 'crypto';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  const serverKey = env.MIDTRANS_SERVER_KEY || 'SB-Mid-server-6hwXm9~zkJrka94g-UyeO8hV';
  const isProduction = env.MIDTRANS_IS_PRODUCTION === 'true';

  return {
    plugins: [
      react(),
      {
        name: 'midtrans-api-dev-server',
        configureServer(server) {
          // Middleware pembuat token transaksi Midtrans Snap
          server.middlewares.use('/api/create-midtrans-token', async (req, res) => {
            if (req.method !== 'POST') {
              res.statusCode = 405;
              res.end(JSON.stringify({ error: 'Method Not Allowed' }));
              return;
            }

            let body = '';
            req.on('data', (chunk) => {
              body += chunk;
            });

            req.on('end', async () => {
              try {
                const payload = JSON.parse(body || '{}');
                const apiUrl = isProduction
                  ? 'https://app.midtrans.com/snap/v1/transactions'
                  : 'https://app.sandbox.midtrans.com/snap/v1/transactions';

                const authString = Buffer.from(serverKey + ':').toString('base64');

                const parameter = {
                  transaction_details: {
                    order_id: payload.bookingCode || `JP-${Date.now()}`,
                    gross_amount: Math.round(payload.totalPrice || 350000),
                  },
                  item_details: [
                    {
                      id: payload.bookingCode || `JP-${Date.now()}`,
                      price: Math.round(payload.totalPrice || 350000),
                      quantity: 1,
                      name: (payload.stayName || 'Penginapan Jajapin').slice(0, 50),
                    },
                  ],
                  customer_details: {
                    first_name: payload.guestName || 'Tamu Jajapin',
                    email: payload.guestEmail || 'tamu@jajapin.id',
                    phone: payload.guestPhone || '08123456789',
                  },
                };

                const midtransRes = await fetch(apiUrl, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: `Basic ${authString}`,
                  },
                  body: JSON.stringify(parameter),
                });

                const data = await midtransRes.json();
                res.setHeader('Content-Type', 'application/json');
                res.statusCode = midtransRes.status;
                res.end(JSON.stringify(data));
              } catch (err) {
                console.error('[Midtrans Dev API Error]:', err);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Internal Server Error', details: err.message }));
              }
            });
          });

          // Middleware penerima webhook notifikasi Midtrans
          server.middlewares.use('/api/midtrans-notification', async (req, res) => {
            if (req.method !== 'POST') {
              res.statusCode = 405;
              res.end('Method Not Allowed');
              return;
            }

            let body = '';
            req.on('data', (chunk) => {
              body += chunk;
            });

            req.on('end', () => {
              try {
                const notif = JSON.parse(body || '{}');
                const { order_id, status_code, gross_amount, signature_key, transaction_status } = notif;

                // Verifikasi SHA512 Signature Key
                const rawSignature = `${order_id}${status_code}${gross_amount}${serverKey}`;
                const expectedSignature = crypto.createHash('sha512').update(rawSignature).digest('hex');

                if (signature_key && signature_key !== expectedSignature) {
                  res.statusCode = 403;
                  res.end(JSON.stringify({ error: 'Invalid Signature' }));
                  return;
                }

                console.log(`[Midtrans Webhook Received] Pesanan: ${order_id} | Status: ${transaction_status}`);

                res.setHeader('Content-Type', 'application/json');
                res.statusCode = 200;
                res.end(JSON.stringify({ status: 'OK', order_id, transaction_status }));
              } catch (e) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Bad Request' }));
              }
            });
          });
        },
      },
    ],
    server: {
      host: true,
      watch: {
        ignored: ['**/dist/**', '**/*.zip', '**/.git/**'],
      },
    },
    resolve: {
      alias: {
        '@': '/src',
      },
    },
  };
});

import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import crypto from 'crypto';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  const serverKey = env.MIDTRANS_SERVER_KEY || 'SB-Mid-server-6hwXm9~zkJrka94g-UyeO8hV';
  const isProduction = env.MIDTRANS_IS_PRODUCTION === 'true';
  const xenditSecretKey = env.XENDIT_SECRET_KEY || 'xnd_development_SecretKeyPlaceholderJajapin123';
  const xenditWebhookToken = env.XENDIT_WEBHOOK_VERIFICATION_TOKEN || 'jajapin_webhook_token_2026';

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

          // Middleware pembuat invoice Xendit Dev Server
          server.middlewares.use('/api/create-xendit-invoice', async (req, res) => {
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
                const bookingCode = payload.bookingCode || `JP-${Date.now()}`;
                const totalPrice = Math.round(payload.totalPrice || 250000);
                const stayName = payload.stayName || 'Penginapan Jajapin';

                // Jika secret key adalah placeholder atau offline, kirim response simulasi yang valid
                if (!xenditSecretKey || xenditSecretKey.includes('Placeholder')) {
                  res.setHeader('Content-Type', 'application/json');
                  res.statusCode = 200;
                  res.end(
                    JSON.stringify({
                      id: `inv_mock_${Date.now()}`,
                      external_id: bookingCode,
                      invoice_url: `https://checkout-staging.xendit.co/v2/${bookingCode}`,
                      status: 'PENDING',
                      amount: totalPrice,
                      description: `Reservasi ${stayName} - ${bookingCode}`,
                      isMock: true,
                    })
                  );
                  return;
                }

                // Call Xendit API resmi
                const authHeader = 'Basic ' + Buffer.from(xenditSecretKey + ':').toString('base64');
                const xenditPayload = {
                  external_id: bookingCode,
                  amount: totalPrice,
                  description: `Reservasi ${stayName} (${payload.nights || 1} Malam) - Kode: ${bookingCode}`,
                  payer_email: payload.guestEmail || 'tamu@jajapin.id',
                  customer: {
                    given_names: payload.guestName || 'Tamu Jajapin',
                    email: payload.guestEmail || 'tamu@jajapin.id',
                    mobile_number: payload.guestPhone || '+628123456789',
                  },
                  success_redirect_url: `http://localhost:5173/konfirmasi/${bookingCode}`,
                  failure_redirect_url: `http://localhost:5173/pesan/${bookingCode}?status=failed`,
                  currency: 'IDR',
                  invoice_duration: 86400,
                };

                const xres = await fetch('https://api.xendit.co/v2/invoices', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: authHeader,
                  },
                  body: JSON.stringify(xenditPayload),
                });

                const data = await xres.json();
                res.setHeader('Content-Type', 'application/json');
                res.statusCode = xres.status;
                res.end(JSON.stringify(data));
              } catch (err) {
                console.error('[Xendit Dev API Error]:', err);
                // Fallback graceful
                res.setHeader('Content-Type', 'application/json');
                res.statusCode = 200;
                res.end(
                  JSON.stringify({
                    id: `inv_fallback_${Date.now()}`,
                    external_id: 'JP-FALLBACK',
                    invoice_url: 'https://checkout-staging.xendit.co/v2/demo',
                    status: 'PENDING',
                    isMock: true,
                  })
                );
              }
            });
          });

          // Middleware Webhook Callback Xendit
          server.middlewares.use('/api/xendit-callback', async (req, res) => {
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
                const callbackData = JSON.parse(body || '{}');
                const callbackToken = req.headers['x-callback-token'];

                console.log(`[Xendit Webhook Received] ID: ${callbackData.id} | External ID: ${callbackData.external_id} | Status: ${callbackData.status}`);
                res.setHeader('Content-Type', 'application/json');
                res.statusCode = 200;
                res.end(JSON.stringify({ status: 'SUCCESS', id: callbackData.id }));
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

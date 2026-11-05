/**
 * Midtrans Snap SDK Helper untuk Jajapin
 */

const SNAP_SANDBOX_URL = 'https://app.sandbox.midtrans.com/snap/snap.js';
const SNAP_PRODUCTION_URL = 'https://app.midtrans.com/snap/snap.js';

export function getClientKey() {
  const envKey = import.meta.env.VITE_MIDTRANS_CLIENT_KEY;
  const localKey = localStorage.getItem('midtrans_client_key');
  if (localKey && localKey.trim()) return localKey.trim();
  if (envKey && envKey !== 'tempel_kode_SB-Mid-client_kamu_di_sini') return envKey.trim();
  return '';
}

/**
 * Memuat skrip Midtrans Snap secara dinamis ke halaman web
 */
export function loadMidtransSnap(clientKey, isProduction = false) {
  return new Promise((resolve, reject) => {
    const key = clientKey || getClientKey();

    // Hapus script lama jika ada perubahan key
    const existingScript = document.getElementById('midtrans-snap-script');
    if (existingScript) {
      if (existingScript.getAttribute('data-client-key') === key && window.snap) {
        resolve(window.snap);
        return;
      }
      existingScript.remove();
    }

    const scriptUrl = isProduction ? SNAP_PRODUCTION_URL : SNAP_SANDBOX_URL;
    const script = document.createElement('script');
    script.id = 'midtrans-snap-script';
    script.src = scriptUrl;
    script.setAttribute('data-client-key', key || 'SB-Mid-client-sample');
    script.async = true;

    script.onload = () => {
      resolve(window.snap);
    };

    script.onerror = (err) => {
      reject(err);
    };

    document.body.appendChild(script);
  });
}

/**
 * Membuka jendela pop-up pembayaran Midtrans Snap
 * @param {string} snapToken - Token transaksi dari server Midtrans
 * @param {object} callbacks - { onSuccess, onPending, onError, onClose }
 */
export function payWithSnap(snapToken, { onSuccess, onPending, onError, onClose }) {
  if (!window.snap || typeof window.snap.pay !== 'function') {
    console.warn('Midtrans Snap SDK belum siap.');
    if (onError) onError(new Error('Midtrans Snap tidak tersedia'));
    return;
  }

  window.snap.pay(snapToken, {
    onSuccess: function (result) {
      console.log('Pembayaran Sukses:', result);
      if (onSuccess) onSuccess(result);
    },
    onPending: function (result) {
      console.log('Menunggu Pembayaran:', result);
      if (onPending) onPending(result);
    },
    onError: function (result) {
      console.error('Pembayaran Gagal:', result);
      if (onError) onError(result);
    },
    onClose: function () {
      console.log('Jendela pop-up Snap ditutup pengguna.');
      if (onClose) onClose();
    },
  });
}

export const STATUS_LABELS = {
  menunggu: 'Menunggu',
  dikonfirmasi: 'Dikonfirmasi',
  selesai: 'Selesai',
  dibatalkan: 'Dibatalkan',
};

export const STATUS_COLORS = {
  menunggu: 'bg-yellow-100 text-yellow-800',
  dikonfirmasi: 'bg-green-100 text-green-800',
  selesai: 'bg-blue-100 text-blue-800',
  dibatalkan: 'bg-red-100 text-red-800',
};

export const PAYMENT_STATUS_LABELS = {
  belum_bayar: 'Belum Bayar',
  menunggu_pembayaran: 'Menunggu Pembayaran',
  dibayar: 'Dibayar',
  gagal: 'Gagal',
  kedaluwarsa: 'Kedaluwarsa',
};

export function getBookings(email) {
  const bookings = JSON.parse(localStorage.getItem('jajapin_bookings') || '[]');
  if (!email) return bookings;
  return bookings.filter(b => b.guest_email === email);
}

export function saveBooking(booking) {
  const bookings = JSON.parse(localStorage.getItem('jajapin_bookings') || '[]');
  bookings.push(booking);
  localStorage.setItem('jajapin_bookings', JSON.stringify(bookings));
  return booking;
}

export function getBookingByCode(code) {
  const bookings = JSON.parse(localStorage.getItem('jajapin_bookings') || '[]');
  return bookings.find(b => b.booking_code === code);
}

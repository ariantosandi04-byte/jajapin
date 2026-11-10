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
  dp: 'DP / Uang Muka',
  dibayar: 'Lunas / Dibayar',
  gagal: 'Gagal',
  kedaluwarsa: 'Kedaluwarsa',
};

export const PAYMENT_STATUS_COLORS = {
  belum_bayar: 'bg-rose-100 text-rose-800',
  menunggu_pembayaran: 'bg-amber-100 text-amber-800',
  dp: 'bg-yellow-100 text-yellow-800',
  dibayar: 'bg-emerald-100 text-emerald-800',
  gagal: 'bg-gray-100 text-gray-700',
  kedaluwarsa: 'bg-gray-100 text-gray-700',
};

export const CHANNEL_SOURCES = {
  direct_web: {
    id: 'direct_web',
    name: 'Website Jajapin',
    category: 'direct',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  },
  direct_walkin: {
    id: 'direct_walkin',
    name: 'Direct / Walk-In',
    category: 'direct',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  direct_whatsapp: {
    id: 'direct_whatsapp',
    name: 'WhatsApp / Chat',
    category: 'direct',
    badgeClass: 'bg-green-100 text-green-800 border-green-200',
  },
  direct_phone: {
    id: 'direct_phone',
    name: 'Telepon Resepsionis',
    category: 'direct',
    badgeClass: 'bg-teal-100 text-teal-800 border-teal-200',
  },
  ota_traveloka: {
    id: 'ota_traveloka',
    name: 'Traveloka',
    category: 'ota',
    badgeClass: 'bg-sky-100 text-sky-800 border-sky-300 font-semibold',
  },
  ota_tiket: {
    id: 'ota_tiket',
    name: 'Tiket.com',
    category: 'ota',
    badgeClass: 'bg-amber-100 text-amber-900 border-amber-300 font-semibold',
  },
  ota_booking: {
    id: 'ota_booking',
    name: 'Booking.com',
    category: 'ota',
    badgeClass: 'bg-indigo-100 text-indigo-900 border-indigo-300 font-semibold',
  },
  ota_agoda: {
    id: 'ota_agoda',
    name: 'Agoda',
    category: 'ota',
    badgeClass: 'bg-orange-100 text-orange-900 border-orange-300 font-semibold',
  },
  ota_airbnb: {
    id: 'ota_airbnb',
    name: 'Airbnb',
    category: 'ota',
    badgeClass: 'bg-rose-100 text-rose-900 border-rose-300 font-semibold',
  },
  corporate: {
    id: 'corporate',
    name: 'Corporate / B2B',
    category: 'other',
    badgeClass: 'bg-purple-100 text-purple-900 border-purple-200',
  },
};

export function getChannelInfo(sourceKey) {
  if (!sourceKey) return CHANNEL_SOURCES.direct_web;
  // Handle old string values
  if (sourceKey === 'pms' || sourceKey === 'walkin') return CHANNEL_SOURCES.direct_walkin;
  if (sourceKey === 'jajapin' || sourceKey === 'web') return CHANNEL_SOURCES.direct_web;
  return CHANNEL_SOURCES[sourceKey] || {
    id: sourceKey,
    name: sourceKey.toUpperCase(),
    category: 'other',
    badgeClass: 'bg-muted text-muted-foreground border-border',
  };
}

export function getBookings(email) {
  const bookings = JSON.parse(localStorage.getItem('jajapin_bookings') || '[]');
  if (!email) return bookings;
  return bookings.filter(b => b.guest_email === email);
}

export function saveBooking(booking) {
  const bookings = JSON.parse(localStorage.getItem('jajapin_bookings') || '[]');
  const existingIndex = bookings.findIndex(b => b.booking_code === booking.booking_code);

  if (existingIndex >= 0) {
    bookings[existingIndex] = { ...bookings[existingIndex], ...booking };
  } else {
    bookings.push(booking);
  }

  localStorage.setItem('jajapin_bookings', JSON.stringify(bookings));

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('jajapin_bookings_updated', {
      detail: { bookingCode: booking.booking_code, booking }
    }));
  }

  return existingIndex >= 0 ? bookings[existingIndex] : booking;
}

export function updateBooking(bookingCode, partialData) {
  const bookings = JSON.parse(localStorage.getItem('jajapin_bookings') || '[]');
  const index = bookings.findIndex(b => b.booking_code === bookingCode);
  if (index === -1) return null;

  bookings[index] = { ...bookings[index], ...partialData };
  localStorage.setItem('jajapin_bookings', JSON.stringify(bookings));

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('jajapin_bookings_updated', {
      detail: { bookingCode, booking: bookings[index] }
    }));
  }

  return bookings[index];
}

export function markBookingAsPaid(bookingCode, extra = {}) {
  const bookings = JSON.parse(localStorage.getItem('jajapin_bookings') || '[]');
  const index = bookings.findIndex(b => b.booking_code === bookingCode);
  if (index === -1) return null;

  const current = bookings[index];
  const totalPrice = current.total_price || 0;

  bookings[index] = {
    ...current,
    status: current.status === 'dibatalkan' ? current.status : 'dikonfirmasi',
    payment_status: 'dibayar',
    amount_paid: totalPrice,
    paid_at: extra.paid_at || new Date().toISOString(),
    payment_method: extra.payment_method || current.payment_method || 'midtrans_snap',
    ...extra,
  };

  localStorage.setItem('jajapin_bookings', JSON.stringify(bookings));

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('jajapin_bookings_updated', {
      detail: { bookingCode, booking: bookings[index] }
    }));
  }

  return bookings[index];
}

export function getBookingByCode(code) {
  const bookings = JSON.parse(localStorage.getItem('jajapin_bookings') || '[]');
  return bookings.find(b => b.booking_code === code);
}

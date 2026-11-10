import { useRef, useState, useEffect } from 'react';
import {
  X,
  Printer,
  Share2,
  CheckCircle2,
  Calendar,
  Building,
  User,
  Phone,
  Mail,
  CreditCard,
  Download,
  MessageCircle,
  ShieldCheck,
  FileText,
  RefreshCw,
  Check,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { formatIDR, formatDateLong, formatDate } from '../../lib/format';
import {
  PAYMENT_STATUS_LABELS,
  PAYMENT_STATUS_COLORS,
  getChannelInfo,
  markBookingAsPaid,
  getBookingByCode,
} from '../../lib/bookingStatus';
import { checkMidtransStatus } from '../../lib/midtrans';

export default function InvoiceModal({ isOpen, onClose, booking }) {
  if (!isOpen || !booking) return null;

  const invoiceRef = useRef(null);
  const [currentBooking, setCurrentBooking] = useState(booking);
  const [isChecking, setIsChecking] = useState(false);
  const [checkFeedback, setCheckFeedback] = useState(null);

  // Sinkronkan state lokal saat prop booking berubah
  useEffect(() => {
    if (booking?.booking_code) {
      const fresh = getBookingByCode(booking.booking_code);
      setCurrentBooking(fresh || booking);
    }
  }, [booking]);

  // Otomatis verifikasi status ke Midtrans saat modal dibuka jika status masih menunggu pembayaran
  useEffect(() => {
    let isMounted = true;
    if (
      isOpen &&
      currentBooking &&
      currentBooking.payment_status === 'menunggu_pembayaran'
    ) {
      setIsChecking(true);
      checkMidtransStatus(currentBooking.booking_code)
        .then((res) => {
          if (!isMounted) return;
          if (res.isPaid) {
            const updated = markBookingAsPaid(currentBooking.booking_code, {
              payment_method: res.payment_type || currentBooking.payment_method || 'midtrans_snap',
            });
            if (updated) setCurrentBooking(updated);
            setCheckFeedback({
              type: 'success',
              message: 'Pembayaran terverifikasi LUNAS otomatis dari Midtrans!',
            });
          }
        })
        .catch(() => {})
        .finally(() => {
          if (isMounted) setIsChecking(false);
        });
    }
    return () => {
      isMounted = false;
    };
  }, [isOpen, currentBooking?.booking_code]);

  const channelInfo = getChannelInfo(currentBooking.source);
  const invoiceNumber =
    currentBooking.invoice_number ||
    `INV/${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}/${currentBooking.booking_code}`;

  const roomCount = currentBooking.room_count || 1;
  const nights = currentBooking.nights || 1;
  const ratePerNight =
    currentBooking.price_per_night ||
    Math.round((currentBooking.total_price || 0) / (nights * roomCount));
  const subtotalRoom =
    currentBooking.subtotal_room || ratePerNight * nights * roomCount;
  const extraFee = currentBooking.extra_fee || 0;
  const discount = currentBooking.discount || 0;
  const totalPrice = currentBooking.total_price || subtotalRoom + extraFee - discount;

  const isPaid = currentBooking.payment_status === 'dibayar';
  const amountPaid = isPaid
    ? totalPrice
    : currentBooking.amount_paid !== undefined
    ? currentBooking.amount_paid
    : currentBooking.payment_status === 'dp'
    ? Math.round(totalPrice * 0.5)
    : 0;

  const balanceDue = isPaid ? 0 : Math.max(0, totalPrice - amountPaid);

  const handlePrint = () => {
    window.print();
  };

  const handleCheckMidtrans = async () => {
    setIsChecking(true);
    setCheckFeedback(null);
    try {
      const res = await checkMidtransStatus(currentBooking.booking_code);
      if (res.isPaid) {
        const updated = markBookingAsPaid(currentBooking.booking_code, {
          payment_method: res.payment_type || currentBooking.payment_method || 'midtrans_snap',
        });
        if (updated) setCurrentBooking(updated);
        setCheckFeedback({
          type: 'success',
          message: `Sukses! Pembayaran ${formatIDR(totalPrice)} telah terverifikasi LUNAS dari Midtrans (${res.transaction_status || 'settlement'}).`,
        });
      } else if (res.transaction_status === 'pending') {
        setCheckFeedback({
          type: 'info',
          message: 'Status di Midtrans masih PENDING (Menunggu transfer). Selesaikan pembayaran di simulator atau ATM, lalu klik tombol cek kembali.',
        });
      } else if (res.message) {
        setCheckFeedback({
          type: 'warning',
          message: res.message,
        });
      } else {
        setCheckFeedback({
          type: 'warning',
          message: `Status Midtrans saat ini: ${res.transaction_status || 'Belum ada transaksi'}.`,
        });
      }
    } catch (err) {
      setCheckFeedback({
        type: 'error',
        message: 'Gagal menghubungi server untuk verifikasi status Midtrans.',
      });
    } finally {
      setIsChecking(false);
    }
  };

  const handleMarkAsPaidManual = () => {
    const updated = markBookingAsPaid(currentBooking.booking_code, {
      payment_method: currentBooking.payment_method || 'Kasir / Resepsionis (Manual)',
    });
    if (updated) setCurrentBooking(updated);
    setCheckFeedback({
      type: 'success',
      message: 'Status invoice berhasil diubah menjadi LUNAS (Dikonfirmasi Resepsionis).',
    });
  };

  const handleShareWhatsApp = () => {
    const phone = (currentBooking.guest_phone || '').replace(/[^0-9]/g, '');
    const cleanPhone = phone.startsWith('0') ? '62' + phone.slice(1) : phone;

    const message =
      `*INVOICE RESERVASI JAJAPIN*\n` +
      `No. Invoice: ${invoiceNumber}\n` +
      `Kode Booking: ${currentBooking.booking_code}\n` +
      `--------------------------------\n` +
      `Tamu: ${currentBooking.guest_name}\n` +
      `Penginapan: ${currentBooking.property_name} (${currentBooking.property_city})\n` +
      `Tipe Kamar: ${currentBooking.room_type || 'Kamar Standar'} (${roomCount} Kamar) ${
        currentBooking.room_number ? `(No. ${currentBooking.room_number})` : ''
      }\n` +
      `Check-In: ${formatDate(currentBooking.check_in)}\n` +
      `Check-Out: ${formatDate(currentBooking.check_out)} (${nights} Malam)\n` +
      `--------------------------------\n` +
      `Total Tagihan: ${formatIDR(totalPrice)}\n` +
      `Status Bayar: ${
        isPaid ? 'LUNAS (DIBAYAR)' : PAYMENT_STATUS_LABELS[currentBooking.payment_status] || currentBooking.payment_status
      }\n` +
      `Telah Dibayar: ${formatIDR(amountPaid)}\n` +
      `Sisa Tagihan: ${formatIDR(balanceDue)}\n` +
      `--------------------------------\n` +
      `Terima kasih telah mempercayakan kenyamanan menginap Anda di Jajapin.`;

    const url = cleanPhone
      ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
      : `https://wa.me/?text=${encodeURIComponent(message)}`;

    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="bg-card w-full max-w-3xl rounded-3xl border border-border shadow-2xl overflow-hidden my-6 print:border-none print:shadow-none print:rounded-none print:m-0 print:w-full">
        {/* Top Control Bar (Hidden when printing) */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border bg-muted/30 print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            <span className="font-display font-semibold text-base text-foreground">
              Faktur Resmi & Invoice Reservasi
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={handleShareWhatsApp} className="text-xs">
              <MessageCircle className="w-3.5 h-3.5 mr-1.5 text-green-600" /> Kirim WhatsApp
            </Button>
            <Button size="sm" onClick={handlePrint} className="text-xs">
              <Printer className="w-3.5 h-3.5 mr-1.5" /> Cetak / PDF
            </Button>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sync & Action Bar for Receptionist & Customer */}
        <div className="bg-muted/50 border-b border-border px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-xs print:hidden">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">Status Verifikasi:</span>
            {isPaid ? (
              <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-300 font-bold">
                <Check className="w-3.5 h-3.5" /> LUNAS (PAID)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-rose-800 bg-rose-100 dark:bg-rose-950 dark:text-rose-300 px-2.5 py-0.5 rounded-full border border-rose-300 font-bold">
                BELUM LUNAS ({PAYMENT_STATUS_LABELS[currentBooking.payment_status] || currentBooking.payment_status})
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleCheckMidtrans}
              disabled={isChecking}
              className="text-xs h-8 bg-card border-border hover:bg-muted"
              title="Periksa transaksi ke server Midtrans"
            >
              {isChecking ? (
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin text-primary" />
              ) : (
                <RefreshCw className="w-3.5 h-3.5 mr-1.5 text-primary" />
              )}
              {isChecking ? 'Memeriksa Midtrans...' : 'Periksa Status Midtrans'}
            </Button>

            {!isPaid && (
              <Button
                size="sm"
                onClick={handleMarkAsPaidManual}
                className="text-xs h-8 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold"
                title="Tandai pembayaran telah diterima oleh resepsionis hotel"
              >
                <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                Tandai Lunas
              </Button>
            )}
          </div>
        </div>

        {/* Feedback Alert */}
        {checkFeedback && (
          <div
            className={`px-4 sm:px-6 py-2.5 text-xs flex items-center justify-between print:hidden ${
              checkFeedback.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-b border-emerald-200'
                : checkFeedback.type === 'info'
                ? 'bg-sky-50 text-sky-800 border-b border-sky-200'
                : 'bg-amber-50 text-amber-800 border-b border-amber-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {checkFeedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              )}
              <span>{checkFeedback.message}</span>
            </div>
            <button
              onClick={() => setCheckFeedback(null)}
              className="text-xs font-bold opacity-60 hover:opacity-100 ml-2"
            >
              ×
            </button>
          </div>
        )}

        {/* PRINTABLE INVOICE SHEET */}
        <div ref={invoiceRef} className="p-6 sm:p-10 font-body text-foreground space-y-6 bg-white">
          {/* Header Brand & Invoice Meta */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-gray-200 pb-6">
            <div>
              <div className="flex items-center gap-2.5">
                <img
                  src="/assets/logo-jajapin.jpg"
                  alt="Jajapin"
                  className="w-10 h-10 rounded-full object-cover border border-brand-forest/20 shadow-sm"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <div>
                  <h2 className="font-display font-bold text-2xl tracking-tight text-[#0a2f18]">
                    JAJAPIN
                  </h2>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-[#0a2f18]/80 font-bold">
                    Hotel & Accommodation PMS
                  </p>
                </div>
              </div>

              <div className="mt-3 text-xs text-gray-600 space-y-0.5">
                <p className="font-semibold text-gray-900">{currentBooking.property_name}</p>
                <p>{currentBooking.property_city}, Indonesia</p>
                <p>Website: jajapin.id | Resepsionis: +62 812-3456-7890</p>
              </div>
            </div>

            {/* Invoice Meta Box */}
            <div className="sm:text-right">
              <div className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 border">
                {isPaid ? (
                  <span className="text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-bold">
                    ✓ LUNAS (PAID)
                  </span>
                ) : currentBooking.payment_status === 'dp' ? (
                  <span className="text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                    ⚠ UANG MUKA / DP
                  </span>
                ) : (
                  <span className="text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                    BELUM DIBAYAR
                  </span>
                )}
              </div>

              <h1 className="font-mono text-sm sm:text-base font-bold text-gray-900">
                {invoiceNumber}
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                Tanggal Terbit: {formatDateLong(currentBooking.created_at || new Date().toISOString())}
              </p>
              <p className="text-xs text-gray-500">
                Kode Booking: <span className="font-mono font-semibold text-gray-800">{currentBooking.booking_code}</span>
              </p>
            </div>
          </div>

          {/* Guest & Reservation Source Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-xs space-y-1.5">
              <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">
                DITAGIHKAN KEPADA (TAMU):
              </p>
              <p className="font-semibold text-sm text-gray-900">{currentBooking.guest_name}</p>
              {currentBooking.guest_id_number && (
                <p className="text-gray-600">No. Identitas / KTP: {currentBooking.guest_id_number}</p>
              )}
              <p className="text-gray-600">No. Telepon: {currentBooking.guest_phone || '-'}</p>
              <p className="text-gray-600">Email: {currentBooking.guest_email || '-'}</p>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-xs space-y-1.5">
              <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">
                INFORMASI SALURAN & KAMAR:
              </p>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Sumber Reservasi:</span>
                <span
                  className={`px-2 py-0.5 rounded-lg border text-[11px] ${channelInfo.badgeClass}`}
                >
                  {channelInfo.name}
                </span>
              </div>
              {currentBooking.ota_booking_id && (
                <p className="text-sky-900 font-medium">
                  Ref OTA ID: <span className="font-mono font-bold">{currentBooking.ota_booking_id}</span>
                </p>
              )}
              <p className="text-gray-900 font-medium">
                Tipe: {currentBooking.room_type || 'Deluxe Room'}{' '}
                {currentBooking.room_number ? `(Unit ${currentBooking.room_number})` : ''}
              </p>
              <p className="text-gray-600">
                Jumlah Tamu: {currentBooking.guests || 2} Orang ({nights} Malam)
              </p>
            </div>
          </div>

          {/* Schedule Strip */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-[#0a2f18]/5 border border-[#0a2f18]/15 text-xs">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#0a2f18] font-bold block">
                CHECK-IN
              </span>
              <span className="font-semibold text-sm text-gray-900 block mt-0.5">
                {formatDateLong(currentBooking.check_in)}
              </span>
              <span className="text-[11px] text-gray-500">Mulai pukul 14:00 WIB</span>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#0a2f18] font-bold block">
                CHECK-OUT
              </span>
              <span className="font-semibold text-sm text-gray-900 block mt-0.5">
                {formatDateLong(currentBooking.check_out)}
              </span>
              <span className="text-[11px] text-gray-500">Maksimal pukul 12:00 WIB</span>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="border border-gray-200 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-100 text-[10px] uppercase tracking-wider text-gray-600 border-b border-gray-200">
                <tr>
                  <th className="py-2.5 px-4">Deskripsi Layanan</th>
                  <th className="py-2.5 px-4 text-center">Durasi / Qty</th>
                  <th className="py-2.5 px-4 text-right">Tarif Satuan</th>
                  <th className="py-2.5 px-4 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-800">
                <tr>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-gray-900">
                      Sewa Kamar — {currentBooking.room_type || 'Deluxe Room'} ({roomCount} Kamar)
                    </div>
                    <div className="text-[11px] text-gray-500">
                      Unit: {currentBooking.room_number ? `Kamar ${currentBooking.room_number}` : `${roomCount} Unit Kamar`} • Termasuk sarapan & fasilitas
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {roomCount > 1 ? `${roomCount} Kamar × ${nights} Malam` : `${nights} Malam`}
                  </td>
                  <td className="py-3 px-4 text-right">{formatIDR(ratePerNight)}/kamar</td>
                  <td className="py-3 px-4 text-right font-medium">{formatIDR(subtotalRoom)}</td>
                </tr>

                {extraFee > 0 && (
                  <tr>
                    <td className="py-2.5 px-4">
                      <div className="font-medium text-gray-900">Biaya Tambahan & Layanan</div>
                      <div className="text-[11px] text-gray-500">Extra bed / layanan tambahan</div>
                    </td>
                    <td className="py-2.5 px-4 text-center">1 Paket</td>
                    <td className="py-2.5 px-4 text-right">{formatIDR(extraFee)}</td>
                    <td className="py-2.5 px-4 text-right font-medium">{formatIDR(extraFee)}</td>
                  </tr>
                )}

                {discount > 0 && (
                  <tr className="text-emerald-700 bg-emerald-50/40">
                    <td className="py-2.5 px-4">
                      <div className="font-medium">Potongan Diskon Promosi</div>
                    </td>
                    <td className="py-2.5 px-4 text-center">-</td>
                    <td className="py-2.5 px-4 text-right">-{formatIDR(discount)}</td>
                    <td className="py-2.5 px-4 text-right font-semibold">-{formatIDR(discount)}</td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Calculations Breakdown */}
            <div className="p-4 bg-gray-50/70 border-t border-gray-200 space-y-2">
              <div className="flex justify-between text-xs text-gray-600">
                <span>Subtotal Tagihan:</span>
                <span className="font-medium text-gray-900">{formatIDR(subtotalRoom + extraFee)}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-600">
                <span>Pajak & Biaya Pelayanan (PB1/PPN):</span>
                <span className="text-emerald-700 font-medium">Sudah Termasuk (Nett)</span>
              </div>
              <div className="border-t border-gray-300 pt-2 flex justify-between text-sm font-bold text-gray-900">
                <span className="font-display text-base">TOTAL TAGIHAN:</span>
                <span className="font-display text-lg text-[#0a2f18]">{formatIDR(totalPrice)}</span>
              </div>

              <div className="flex justify-between text-xs text-gray-700 pt-1 border-t border-dashed border-gray-300">
                <span>Pembayaran Diterima ({currentBooking.payment_method || 'midtrans_snap'}):</span>
                <span className="font-bold text-emerald-700">{formatIDR(amountPaid)}</span>
              </div>

              {balanceDue > 0 ? (
                <div className="flex justify-between text-xs text-rose-700 font-bold bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                  <span>SISA PEMBAYARAN YANG HARUS DILUNASI:</span>
                  <span>{formatIDR(balanceDue)}</span>
                </div>
              ) : (
                <div className="text-right text-xs text-emerald-700 font-bold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                  ✓ Lunas Sepenuhnya ({formatIDR(totalPrice)}). Tidak ada sisa tagihan.
                </div>
              )}
            </div>
          </div>

          {/* Notes & Check-In Terms */}
          {currentBooking.notes && (
            <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200 text-xs text-amber-900 space-y-1">
              <span className="font-bold uppercase tracking-wider text-[10px]">Catatan Khusus:</span>
              <p>{currentBooking.notes}</p>
            </div>
          )}

          {/* Policy & Signatures */}
          <div className="pt-4 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-6 text-[11px] text-gray-500">
            <div>
              <p className="font-bold text-gray-800 uppercase tracking-wider text-[10px] mb-1">
                SYARAT & KETENTUAN MENGINAP:
              </p>
              <ul className="list-disc pl-4 space-y-0.5 text-gray-600">
                <li>Tunjukkan invoice digital ini atau KTP saat proses check-in di resepsionis.</li>
                <li>Dilarang merokok di dalam kamar bebas asap rokok (*Non-smoking room*).</li>
                <li>Kebijakan pembatalan atau perubahan tanggal mengikuti ketentuan properti.</li>
              </ul>
            </div>

            <div className="text-center sm:text-right flex flex-col justify-end items-center sm:items-end">
              <p className="text-gray-600 mb-12">Petugas / Resepsionis Hotel,</p>
              <div className="w-40 border-b border-gray-400 pb-1 text-center font-semibold text-gray-900">
                Jajapin PMS System
              </div>
              <p className="text-[10px] text-gray-400 mt-1">Dokumen Sah Terverifikasi Digital</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

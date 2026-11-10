import { useMemo, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Calendar,
  MapPin,
  Users,
  Phone,
  Mail,
  Clock,
  Download,
  Home,
  ListOrdered,
  FileText,
  BedDouble,
  DoorOpen,
  RefreshCw,
  Loader2,
  AlertCircle,
  AlertTriangle,
  ShieldCheck,
} from 'lucide-react';
import SiteHeader from '../components/site/SiteHeader';
import SiteFooter from '../components/site/SiteFooter';
import InvoiceModal from '../components/dashboard/InvoiceModal';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import {
  getBookingByCode,
  STATUS_LABELS,
  STATUS_COLORS,
  PAYMENT_STATUS_LABELS,
  markBookingAsPaid,
} from '../lib/bookingStatus';
import { formatIDR, formatDateLong } from '../lib/format';
import { checkMidtransStatus } from '../lib/midtrans';

export default function ConfirmationPage() {
  const { id } = useParams();
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [booking, setBooking] = useState(() => getBookingByCode(id));
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  // Sinkronisasi data saat local storage berubah atau event ditembakkan
  useEffect(() => {
    const refreshData = () => {
      const fresh = getBookingByCode(id);
      if (fresh) setBooking(fresh);
    };

    window.addEventListener('jajapin_bookings_updated', refreshData);
    window.addEventListener('storage', refreshData);
    return () => {
      window.removeEventListener('jajapin_bookings_updated', refreshData);
      window.removeEventListener('storage', refreshData);
    };
  }, [id]);

  // Otomatis cek status saat mount jika masih menunggu pembayaran
  useEffect(() => {
    let isMounted = true;
    if (booking && booking.payment_status === 'menunggu_pembayaran') {
      setIsCheckingPayment(true);
      checkMidtransStatus(booking.booking_code)
        .then((res) => {
          if (!isMounted) return;
          if (res.isPaid) {
            const updated = markBookingAsPaid(booking.booking_code, {
              payment_method: res.payment_type || booking.payment_method || 'midtrans_snap',
            });
            if (updated) setBooking(updated);
            setStatusMessage({
              type: 'success',
              text: 'Pembayaran Anda telah terkonfirmasi LUNAS dari Midtrans!',
            });
          }
        })
        .catch(() => {})
        .finally(() => {
          if (isMounted) setIsCheckingPayment(false);
        });
    }
    return () => {
      isMounted = false;
    };
  }, [id, booking?.payment_status]);

  const handleManualCheck = async () => {
    if (!booking) return;
    setIsCheckingPayment(true);
    setStatusMessage(null);
    try {
      const res = await checkMidtransStatus(booking.booking_code);
      if (res.isPaid) {
        const updated = markBookingAsPaid(booking.booking_code, {
          payment_method: res.payment_type || booking.payment_method || 'midtrans_snap',
        });
        if (updated) setBooking(updated);
        setStatusMessage({
          type: 'success',
          text: 'Alhamdulillah! Pembayaran telah terverifikasi LUNAS.',
        });
      } else if (res.transaction_status === 'pending') {
        setStatusMessage({
          type: 'info',
          text: 'Transaksi masih menunggu pembayaran di Midtrans. Jika sudah transfer di Simulator/ATM, tunggu beberapa detik lalu klik cek lagi.',
        });
      } else {
        setStatusMessage({
          type: 'warning',
          text: res.message || `Status Midtrans: ${res.transaction_status || 'Belum dibayar'}.`,
        });
      }
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: 'Gagal terhubung ke gateway pembayaran untuk verifikasi.',
      });
    } finally {
      setIsCheckingPayment(false);
    }
  };

  if (!booking) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="pt-32 pb-20 text-center px-4 max-w-md mx-auto">
          <h1 className="font-display text-2xl text-foreground mb-3">Booking Tidak Ditemukan</h1>
          <p className="font-body text-muted-foreground text-sm mb-6">
            Kode booking <span className="font-mono font-bold text-foreground">{id}</span> tidak terdaftar di sistem.
          </p>
          <div className="flex gap-3 justify-center">
            <Link to="/"><Button variant="outline">Beranda</Button></Link>
            <Link to="/stays"><Button>Cari Penginapan</Button></Link>
          </div>
        </div>
        <SiteFooter />
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const isPaid = booking.payment_status === 'dibayar';

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Status Indicator Icon */}
          <div
            className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
              isPaid
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
            }`}
          >
            {isPaid ? <CheckCircle2 className="w-9 h-9" /> : <Clock className="w-9 h-9" />}
          </div>

          <p
            className={`text-[11px] uppercase tracking-[0.24em] font-body font-bold mb-2 ${
              isPaid ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'
            }`}
          >
            {isPaid ? '✓ Pemesanan Terkonfirmasi & Kamar Ter-Lock 100%' : 'Menunggu Pembayaran · Kamar Belum Ter-Lock'}
          </p>
          <h1 className="font-display font-light text-3xl sm:text-4xl tracking-tight text-foreground mb-3">
            {isPaid ? `Selamat, ${booking.guest_name}!` : `Pemesanan Dicatat, ${booking.guest_name}`}
          </h1>
          <p className="font-body text-muted-foreground text-sm max-w-md mx-auto mb-6">
            {isPaid
              ? 'Pembayaran telah lunas diterima. Kamar Anda resmi terkunci (locked) dan siap dihuni saat check-in.'
              : 'Pemesanan Anda telah tersimpan. Mohon perhatikan catatan bahwa kamar belum dikonfirmasi / ter-lock sebelum ada pembayaran lunas.'}
          </p>

          {/* CATATAN PENTING: BOOKING BELUM DIKONFIRMASI / LOCK SEBELUM ADA PEMBAYARAN */}
          {!isPaid && (
            <div className="bg-amber-50/90 dark:bg-amber-950/40 border-2 border-amber-400 dark:border-amber-700 rounded-3xl p-5 sm:p-6 mb-8 text-left space-y-2.5 shadow-sm">
              <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-200 text-sm">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                <span>CATATAN PENTING: BOOKING BELUM DIKONFIRMASI / TER-LOCK</span>
              </div>
              <p className="text-xs text-amber-950 dark:text-amber-200 leading-relaxed font-medium">
                Kamar untuk reservasi <strong className="font-mono">{booking.booking_code}</strong> <strong className="underline">BELUM DIKONFIRMASI / TER-LOCK</strong> di sistem penginapan sebelum pembayaran diterima secara lunas.
              </p>
              <div className="p-3.5 rounded-2xl bg-amber-100/70 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-800 space-y-1.5 text-xs text-amber-900 dark:text-amber-200">
                <p>
                  • <strong>Untuk Metode Bayar di Tempat:</strong> Kamar belum terkunci secara pasti. Jika penginapan penuh, kamar sewaktu-waktu dapat dialihkan ke tamu lain yang membayar lunas lebih dahulu.
                </p>
                <p>
                  • <strong>Untuk Metode Midtrans:</strong> Segera selesaikan transfer bank atau scan QRIS Anda agar kamar langsung <strong>ter-lock 100%</strong> otomatis.
                </p>
              </div>
            </div>
          )}

          {/* Booking Code Card */}
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 mb-8 shadow-[0_18px_40px_-28px_rgba(18,20,22,0.35)]">
            <p className="text-xs uppercase tracking-[0.2em] font-body text-muted-foreground mb-2">
              Kode Booking Anda
            </p>
            <div className="inline-block bg-brand-forest-deep text-brand-lime font-display font-bold text-3xl sm:text-4xl px-8 py-3 rounded-2xl tracking-widest select-all mb-3">
              {booking.booking_code}
            </div>
            <p className="text-xs text-muted-foreground font-body">
              Simpan kode ini dan tunjukkan kepada petugas resepsionis saat check-in.
            </p>
          </div>

          {/* Detailed Summary Card */}
          <Card className="border-border text-left mb-8 overflow-hidden">
            <CardContent className="p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row gap-5 items-start">
                <img
                  src={booking.property_image}
                  alt={booking.property_name}
                  className="w-full sm:w-36 h-28 rounded-2xl object-cover shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h2 className="font-display font-semibold text-xl text-foreground">
                        {booking.property_name}
                      </h2>
                      <p className="text-xs text-muted-foreground font-body flex items-center gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5" /> {booking.property_city}
                      </p>
                    </div>
                    <Badge
                      className={
                        isPaid
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300 font-semibold'
                          : 'bg-amber-100 text-amber-900 border-amber-300 font-semibold'
                      }
                    >
                      {isPaid ? 'TER-LOCK (LUNAS)' : 'BELUM LOCK (MENUNGGU)'}
                    </Badge>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-4 text-xs font-body text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-primary" /> {booking.guest_email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-primary" /> {booking.guest_phone}
                    </span>
                  </div>
                </div>
              </div>

              <hr className="border-border" />

              {/* Room Type & Quantity Highlights */}
              <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-body">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <BedDouble className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-300 block">
                      Tipe Kamar Dipesan
                    </span>
                    <span className="font-semibold text-sm text-foreground">
                      {booking.room_type || 'Standard Room'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <div className="bg-card px-3 py-1.5 rounded-xl border border-border">
                    <span className="text-muted-foreground block text-[10px]">Jumlah Kamar</span>
                    <span className="font-bold text-foreground">{booking.room_count || 1} Unit Kamar</span>
                  </div>
                  <div className="bg-card px-3 py-1.5 rounded-xl border border-border text-right">
                    <span className="text-muted-foreground block text-[10px]">Tarif Satuan</span>
                    <span className="font-bold text-emerald-700">
                      {formatIDR(booking.price_per_night || booking.total_price / ((booking.room_count || 1) * (booking.nights || 1)))}/mlm
                    </span>
                  </div>
                </div>
              </div>

              {/* Dates & Guests Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-3.5 rounded-2xl bg-muted/40">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">Check-in</span>
                  <span className="font-body font-semibold text-sm text-foreground block">{booking.check_in}</span>
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5"><Clock className="w-3 h-3" /> Dari 14:00</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-muted/40">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">Check-out</span>
                  <span className="font-body font-semibold text-sm text-foreground block">{booking.check_out}</span>
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5"><Clock className="w-3 h-3" /> Sebelum 12:00</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-muted/40">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">Durasi</span>
                  <span className="font-body font-semibold text-sm text-foreground block">{booking.nights} Malam</span>
                  <span className="text-[11px] text-muted-foreground">Penginapan penuh</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-muted/40">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">Tamu</span>
                  <span className="font-body font-semibold text-sm text-foreground block">{booking.guests} Orang</span>
                  <span className="text-[11px] text-muted-foreground">Kapasitas sesuai</span>
                </div>
              </div>

              <hr className="border-border" />

              {/* Sync Payment Notification Banner */}
              {booking.payment_status !== 'dibayar' && (
                <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 text-left space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-semibold text-xs">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Sudah transfer di Simulator Midtrans atau ATM? Klik tombol untuk verifikasi instan:</span>
                    </div>
                    <Button
                      size="sm"
                      onClick={handleManualCheck}
                      disabled={isCheckingPayment}
                      className="text-xs h-8 bg-amber-600 hover:bg-amber-700 text-white shrink-0"
                    >
                      {isCheckingPayment ? (
                        <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                      ) : (
                        <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                      )}
                      {isCheckingPayment ? 'Memeriksa...' : 'Cek Status Pembayaran'}
                    </Button>
                  </div>
                  {statusMessage && (
                    <p className={`text-xs font-semibold ${statusMessage.type === 'success' ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-800 dark:text-amber-300'}`}>
                      {statusMessage.text}
                    </p>
                  )}
                </div>
              )}

              {/* Payment Status and Total */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <span className="text-xs text-muted-foreground font-body block mb-1">Status Pembayaran</span>
                  <div className="flex items-center gap-2">
                    <Badge variant={isPaid ? 'lime' : 'outline'}>
                      {isPaid ? 'Lunas / Terkunci (Locked)' : PAYMENT_STATUS_LABELS[booking.payment_status] || booking.payment_status}
                    </Badge>
                    <span className="text-xs text-muted-foreground font-body">Metode: {booking.payment_method?.toUpperCase()}</span>
                  </div>
                </div>
                <div className="sm:text-right">
                  <span className="text-xs text-muted-foreground font-body block mb-0.5">Total Biaya</span>
                  <span className="font-display font-bold text-2xl text-primary">{formatIDR(booking.total_price)}</span>
                </div>
              </div>

              {/* Check-in Instructions */}
              <div className="bg-brand-sand/50 rounded-2xl p-5 border border-brand-sand font-body text-sm space-y-2">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" /> Panduan Kedatangan & Ketentuan Reservasi:
                </h3>
                <ul className="text-muted-foreground text-xs space-y-1.5 list-disc pl-5">
                  <li>Tunjukkan bukti pesanan ini atau sebutkan kode booking <strong>{booking.booking_code}</strong> saat tiba di resepsionis.</li>
                  <li>
                    <strong>Catatan Status:</strong> {isPaid ? 'Kamar Anda telah resmi terkonfirmasi dan ter-lock 100%.' : 'Kamar belum ter-lock sampai ada pembayaran lunas. Harap hubungi properti untuk konfirmasi jam kedatangan.'}
                  </li>
                  <li>Siapkan kartu identitas (KTP/Paspor) yang masih berlaku untuk verifikasi resepsionis.</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="default" onClick={() => setShowInvoiceModal(true)}>
              <FileText className="w-4 h-4 mr-2" /> Lihat Invoice Resmi
            </Button>
            <Button variant="outline" onClick={handlePrint}>
              <Download className="w-4 h-4 mr-2" /> Cetak / Unduh Bukti
            </Button>
            <Link to="/bookings">
              <Button variant="secondary">
                <ListOrdered className="w-4 h-4 mr-2" /> Booking Saya
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline">
                <Home className="w-4 h-4 mr-2" /> Beranda
              </Button>
            </Link>
          </div>

          <InvoiceModal
            isOpen={showInvoiceModal}
            onClose={() => setShowInvoiceModal(false)}
            booking={booking}
          />
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}

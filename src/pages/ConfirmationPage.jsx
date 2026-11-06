import { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Calendar, MapPin, Users, Phone, Mail, Clock, Download, Home, ListOrdered, FileText } from 'lucide-react';
import SiteHeader from '../components/site/SiteHeader';
import SiteFooter from '../components/site/SiteFooter';
import InvoiceModal from '../components/dashboard/InvoiceModal';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { getBookingByCode, STATUS_LABELS, STATUS_COLORS, PAYMENT_STATUS_LABELS } from '../lib/bookingStatus';
import { formatIDR, formatDateLong } from '../lib/format';

export default function ConfirmationPage() {
  const { id } = useParams();
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const booking = useMemo(() => getBookingByCode(id), [id]);

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

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Success Banner */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <p className="text-[11px] uppercase tracking-[0.24em] font-body font-semibold text-primary mb-2">
            Pemesanan Terkonfirmasi
          </p>
          <h1 className="font-display font-light text-3xl sm:text-4xl tracking-tight text-foreground mb-3">
            Terima kasih, {booking.guest_name}!
          </h1>
          <p className="font-body text-muted-foreground text-sm max-w-md mx-auto mb-8">
            Pemesanan Anda telah berhasil dicatat. Konfirmasi dan bukti reservasi juga telah disiapkan untuk Anda.
          </p>

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
                    <Badge className={STATUS_COLORS[booking.status]}>
                      {STATUS_LABELS[booking.status]}
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

              {/* Payment Status and Total */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <span className="text-xs text-muted-foreground font-body block mb-1">Status Pembayaran</span>
                  <div className="flex items-center gap-2">
                    <Badge variant={booking.payment_status === 'dibayar' ? 'lime' : 'outline'}>
                      {PAYMENT_STATUS_LABELS[booking.payment_status] || booking.payment_status}
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
                  <Clock className="w-4 h-4 text-primary" /> Panduan Kedatangan & Check-in:
                </h3>
                <ul className="text-muted-foreground text-xs space-y-1.5 list-disc pl-5">
                  <li>Tunjukkan bukti pesanan ini atau sebutkan kode booking <strong>{booking.booking_code}</strong> saat tiba.</li>
                  <li>Siapkan kartu identitas (KTP/Paspor) yang masih berlaku untuk verifikasi resepsionis.</li>
                  <li>Apabila Anda berencana tiba di luar jam operasional check-in normal, harap hubungi pihak penginapan sebelumnya.</li>
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

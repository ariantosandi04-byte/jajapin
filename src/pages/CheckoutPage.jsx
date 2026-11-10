import { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Calendar,
  MapPin,
  Users,
  ArrowLeft,
  CreditCard,
  Sparkles,
  Key,
  CheckCircle2,
  ExternalLink,
  Zap,
  Check,
  BedDouble,
  DoorOpen,
  Plus,
  Minus,
  AlertTriangle,
} from 'lucide-react';
import SiteHeader from '../components/site/SiteHeader';
import SiteFooter from '../components/site/SiteFooter';
import PaymentPanel from '../components/stay/PaymentPanel';
import { Card, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../contexts/AuthContext';
import { stays } from '../data/stays';
import { formatIDR, calculateNights, generateBookingCode } from '../lib/format';
import { saveBooking } from '../lib/bookingStatus';
import { loadMidtransSnap, payWithSnap, getClientKey } from '../lib/midtrans';

export default function CheckoutPage() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const stay = useMemo(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('jajapin_properties') || '[]');
      const found = saved.find((s) => s.slug === slug);
      if (found) return found;
    } catch (e) {
      // fallback
    }
    return stays.find((s) => s.slug === slug);
  }, [slug]);

  const roomTypes = useMemo(() => {
    if (stay?.room_types && stay.room_types.length > 0) return stay.room_types;
    return [
      {
        id: 'standard',
        name: 'Kamar Standar',
        bed: `${stay?.beds || 1} Ranjang`,
        capacity: stay?.guests || 2,
        price: stay?.price || 150000,
        description: 'Kamar standar nyaman dengan fasilitas lengkap.',
      },
    ];
  }, [stay]);

  const queryRoomType = searchParams.get('roomType');
  const queryRoomsCount = Number(searchParams.get('rooms')) || 1;

  const [selectedRoomId, setSelectedRoomId] = useState(() => {
    if (queryRoomType && roomTypes.some((r) => r.id === queryRoomType)) {
      return queryRoomType;
    }
    return roomTypes[0]?.id || 'standard';
  });

  const [roomsCount, setRoomsCount] = useState(Math.max(1, Math.min(10, queryRoomsCount)));
  const [checkIn, setCheckIn] = useState(searchParams.get('checkIn') || '');
  const [checkOut, setCheckOut] = useState(searchParams.get('checkOut') || '');
  const [guests, setGuests] = useState(Number(searchParams.get('guests')) || 2);
  const [gateway, setGateway] = useState('midtrans');
  const [paymentMethod, setPaymentMethod] = useState('midtrans_snap');

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    notes: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [midtransLoaded, setMidtransLoaded] = useState(false);
  const [clientKeyInput, setClientKeyInput] = useState(getClientKey() || '');
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [mockSnapData, setMockSnapData] = useState(null);

  // Selected room object
  const selectedRoom = useMemo(() => {
    return roomTypes.find((r) => r.id === selectedRoomId) || roomTypes[0];
  }, [roomTypes, selectedRoomId]);

  // Initialize Midtrans Snap script (if needed)
  useEffect(() => {
    const key = getClientKey();
    const isProduction = import.meta.env.VITE_MIDTRANS_IS_PRODUCTION === 'true';
    if (key) {
      loadMidtransSnap(key, isProduction)
        .then(() => setMidtransLoaded(true))
        .catch(() => console.log('Midtrans Snap siap dengan mode fallback.'));
    }
  }, []);

  const handleSaveClientKey = () => {
    if (clientKeyInput.trim()) {
      localStorage.setItem('midtrans_client_key', clientKeyInput.trim());
      loadMidtransSnap(clientKeyInput.trim(), false)
        .then(() => {
          setMidtransLoaded(true);
          setShowKeyInput(false);
        })
        .catch(() => setError('Gagal memuat Snap dengan Client Key tersebut.'));
    }
  };

  // Default dates if missing
  useEffect(() => {
    if (!checkIn) {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dayAfter = new Date(today);
      dayAfter.setDate(dayAfter.getDate() + 3);
      setCheckIn(tomorrow.toISOString().split('T')[0]);
      setCheckOut(dayAfter.toISOString().split('T')[0]);
    }
  }, [checkIn]);

  if (!stay) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="pt-32 text-center px-4 max-w-md mx-auto">
          <h1 className="font-display text-2xl text-foreground mb-4">Penginapan tidak ditemukan</h1>
          <p className="font-body text-muted-foreground mb-6">Penginapan yang Anda tuju tidak tersedia.</p>
          <Link to="/stays">
            <Button variant="default">Kembali ke katalog</Button>
          </Link>
        </div>
        <SiteFooter />
      </div>
    );
  }

  const pricePerRoomNight = selectedRoom.price || stay.price;
  const nights = checkIn && checkOut ? calculateNights(checkIn, checkOut) : 1;
  const subtotalPerNight = pricePerRoomNight * roomsCount;
  const totalPrice = nights * subtotalPerNight;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) {
      setError('Harap lengkapi semua data tamu yang wajib diisi.');
      return;
    }

    setSubmitting(true);
    setError('');
    const bookingCode = generateBookingCode();

    const baseBooking = {
      booking_code: bookingCode,
      property_id: stay.id,
      property_name: stay.name,
      property_image: selectedRoom.image || stay.image,
      property_city: stay.city,
      guest_name: form.name,
      guest_email: form.email,
      guest_phone: form.phone,
      check_in: checkIn,
      check_out: checkOut,
      guests: guests,
      nights: nights,
      room_type: selectedRoom.name,
      room_type_id: selectedRoom.id,
      room_count: roomsCount,
      price_per_night: pricePerRoomNight,
      subtotal_per_night: subtotalPerNight,
      total_price: totalPrice,
      status: 'menunggu',
      payment_status: 'menunggu_pembayaran',
      payment_gateway: gateway,
      payment_method: paymentMethod,
      paid_at: null,
      notes: form.notes,
      source: 'jajapin',
      external_id: null,
      created_at: new Date().toISOString(),
    };

    // 1. JIKA BAYAR DI TEMPAT (CASH / RESEPSIONIS PROPERTI)
    if (gateway === 'hotel' || paymentMethod === 'hotel') {
      baseBooking.payment_status = 'menunggu_pembayaran';
      baseBooking.status = 'menunggu'; // TIDAK DIKONFIRMASI / BELUM LOCK SEBELUM ADA PEMBAYARAN!
      baseBooking.is_locked = false;
      const noteWarning = 'CATATAN PENTING: Booking belum dikonfirmasi / ter-lock sebelum ada pembayaran lunas.';
      baseBooking.notes = form.notes ? `${form.notes} [${noteWarning}]` : noteWarning;
      baseBooking.payment_method = 'Bayar di Tempat (di Properti)';
      saveBooking(baseBooking);
      setTimeout(() => navigate(`/konfirmasi/${bookingCode}`), 400);
      return;
    }

    // 2. JIKA GATEWAY MIDTRANS SNAP (ONLINE)
    try {
      let response = await fetch('/api/create-midtrans-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingCode,
          totalPrice,
          stayName: `${stay.name} (${roomsCount}x ${selectedRoom.name})`,
          guestName: form.name,
          guestEmail: form.email,
          guestPhone: form.phone,
        }),
      });

      if (!response.ok && response.status === 404) {
        response = await fetch('/api/create-midtrans-token.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bookingCode,
            totalPrice,
            stayName: `${stay.name} (${roomsCount}x ${selectedRoom.name})`,
            guestName: form.name,
            guestEmail: form.email,
            guestPhone: form.phone,
          }),
        });
      }

      const data = await response.json();

      if (response.ok && data.token) {
        if (window.snap && typeof window.snap.pay === 'function') {
          payWithSnap(data.token, {
            onSuccess: (result) => {
              baseBooking.status = 'dikonfirmasi'; // RESMI TERKONFIRMASI & TER-LOCK 100% KARENA SUDAH LUNAS!
              baseBooking.payment_status = 'dibayar';
              baseBooking.paid_at = new Date().toISOString();
              baseBooking.is_locked = true;
              baseBooking.midtrans_order_id = result.order_id || baseBooking.midtrans_order_id;
              saveBooking(baseBooking);
              navigate(`/konfirmasi/${bookingCode}`);
            },
            onPending: (result) => {
              baseBooking.status = 'menunggu'; // BELUM DIKONFIRMASI / BELUM LOCK KARENA MASIH MENUNGGU PEMBAYARAN!
              baseBooking.payment_status = 'menunggu_pembayaran';
              baseBooking.is_locked = false;
              baseBooking.midtrans_order_id = result?.order_id || baseBooking.midtrans_order_id;
              const noteWarning = 'CATATAN PENTING: Booking belum dikonfirmasi / ter-lock sebelum ada pembayaran lunas.';
              baseBooking.notes = form.notes ? `${form.notes} [${noteWarning}]` : noteWarning;
              saveBooking(baseBooking);
              navigate(`/konfirmasi/${bookingCode}`);
            },
            onError: () => {
              setError('Pembayaran dibatalkan atau terjadi kendala pada gateway Midtrans.');
              setSubmitting(false);
            },
            onClose: () => {
              setSubmitting(false);
            },
          });
          return;
        } else if (data.redirect_url) {
          saveBooking(baseBooking);
          window.location.href = data.redirect_url;
          return;
        }
      }
    } catch (err) {
      console.log('Kendala saat menghubungi endpoint Midtrans:', err);
    }

    setSubmitting(false);
    setMockSnapData({
      baseBooking,
      bookingCode,
      totalPrice,
    });
  };

  const handleCompleteMockPayment = () => {
    if (mockSnapData) {
      const { baseBooking, bookingCode } = mockSnapData;
      baseBooking.status = 'dikonfirmasi';
      baseBooking.payment_status = 'dibayar';
      baseBooking.paid_at = new Date().toISOString();
      baseBooking.is_locked = true;
      saveBooking(baseBooking);
      setMockSnapData(null);
      navigate(`/konfirmasi/${bookingCode}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to={`/stays/${stay.slug}`}
            className="inline-flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke detail penginapan
          </Link>

          <h1 className="font-display font-light text-3xl sm:text-4xl tracking-tight text-foreground mb-2">
            Konfirmasi & Pembayaran
          </h1>
          <p className="font-body text-muted-foreground text-sm mb-8">
            Periksa rincian tipe kamar, durasi, jumlah kamar, dan lengkapi data pemesan sebelum menyelesaikan transaksi.
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-2xl font-body text-sm mb-6">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Form, Room Selection & Payment */}
            <div className="lg:col-span-7 space-y-6">
              {/* CARD PILIHAN TIPE KAMAR & JUMLAH KAMAR */}
              <Card className="border-border">
                <CardContent className="p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border">
                    <div>
                      <h2 className="font-display font-semibold text-lg text-foreground flex items-center gap-2">
                        <BedDouble className="w-5 h-5 text-emerald-600" /> Tipe & Jumlah Kamar
                      </h2>
                      <p className="text-xs text-muted-foreground font-body">
                        Anda dapat mengubah tipe kamar atau memesan lebih dari satu unit
                      </p>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-body self-start sm:self-auto">
                      {roomsCount} Kamar Dipilih
                    </span>
                  </div>

                  {/* Pilihan Tipe Kamar */}
                  <div className="space-y-2.5">
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-muted-foreground font-body">
                      Pilih Tipe Kamar:
                    </label>
                    <div className="space-y-2">
                      {roomTypes.map((room) => {
                        const isSelected = room.id === selectedRoomId;
                        return (
                          <button
                            key={room.id}
                            type="button"
                            onClick={() => setSelectedRoomId(room.id)}
                            className={`w-full text-left p-3.5 rounded-2xl border transition-all text-xs font-body ${
                              isSelected
                                ? 'border-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/20 ring-1 ring-emerald-500'
                                : 'border-border bg-card hover:bg-muted/40'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-2.5">
                                <div
                                  className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                                    isSelected
                                      ? 'border-emerald-600 bg-emerald-600 text-white'
                                      : 'border-border'
                                  }`}
                                >
                                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                                </div>
                                <div>
                                  <span className="font-semibold text-foreground text-sm block">
                                    {room.name}
                                  </span>
                                  <span className="text-[11px] text-muted-foreground block mt-0.5">
                                    {room.bed} • Maks {room.capacity} orang
                                  </span>
                                </div>
                              </div>
                              <div className="text-right shrink-0">
                                <span className="font-display font-bold text-base text-emerald-700 dark:text-emerald-400">
                                  {formatIDR(room.price)}
                                </span>
                                <span className="text-[10px] text-muted-foreground block">/kamar/malam</span>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Counter Jumlah Kamar */}
                  <div className="pt-2 border-t border-border/60">
                    <div className="flex items-center justify-between p-3.5 rounded-2xl bg-muted/40 border border-border">
                      <div>
                        <span className="font-semibold text-foreground text-sm font-body block">
                          Jumlah Kamar Dipesan
                        </span>
                        <span className="text-xs text-muted-foreground font-body">
                          Kapasitas total:{' '}
                          <strong className="text-foreground">
                            {selectedRoom.capacity * roomsCount} tamu
                          </strong>
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setRoomsCount(Math.max(1, roomsCount - 1))}
                          disabled={roomsCount <= 1}
                          className="w-9 h-9 rounded-full border border-border bg-card flex items-center justify-center text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                          aria-label="Kurangi kamar"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-10 text-center font-display font-bold text-lg text-foreground">
                          {roomsCount}
                        </span>
                        <button
                          type="button"
                          onClick={() => setRoomsCount(Math.min(10, roomsCount + 1))}
                          disabled={roomsCount >= 10}
                          className="w-9 h-9 rounded-full border border-border bg-card flex items-center justify-center text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                          aria-label="Tambah kamar"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* FORM DATA TAMU */}
              <form onSubmit={handleSubmit} id="checkout-form">
                <Card className="border-border">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border">
                      <h2 className="font-display font-semibold text-lg text-foreground">
                        Data Tamu Utama (Pemesan)
                      </h2>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold self-start sm:self-auto">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                        Pesan Langsung Tanpa Wajib Buat Akun
                      </span>
                    </div>
                    <Input
                      label="Nama Lengkap"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                      placeholder="Sesuai kartu identitas (KTP/Paspor)"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="Alamat Email"
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        required
                        placeholder="contoh@domain.id"
                      />
                      <Input
                        label="Nomor WhatsApp / Telepon"
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        required
                        placeholder="0812xxxxxxxx"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-[0.2em] font-body font-semibold text-muted-foreground mb-2">
                        Catatan Khusus (Opsional)
                      </label>
                      <textarea
                        value={form.notes}
                        onChange={(e) => setForm({ ...form, notes: e.target.value })}
                        rows={3}
                        className="w-full rounded-2xl border border-border bg-card px-4 py-2.5 font-body text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary transition-all duration-300 resize-none"
                        placeholder="Permintaan kamar bersebelahan, perkiraan jam tiba, dll."
                      />
                    </div>
                  </CardContent>
                </Card>
              </form>

              {/* Status Banner Payment Gateway Terhubung */}
              {gateway === 'xendit' ? (
                <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 space-y-2 font-body text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-foreground font-semibold">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>
                        Xendit Invoicing V2:{' '}
                        <span className="text-emerald-700 dark:text-emerald-400">Siap & Terhubung</span>
                      </span>
                    </div>
                    <Badge variant="lime" className="text-[10px]">Merchant Terverifikasi</Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Endpoint: <code className="font-mono text-emerald-800 dark:text-emerald-300 font-semibold">/api/create-xendit-invoice.php</code> | Webhook Callback: <code className="font-mono text-emerald-800 dark:text-emerald-300">/api/xendit-callback.php</code>
                  </p>
                  <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-emerald-200/60 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-medium">
                      ✓ Syarat Kepatuhan ACC Lengkap
                    </span>
                    <Link to="/terms" className="hover:underline text-foreground">S&K</Link>
                    <span>•</span>
                    <Link to="/privacy" className="hover:underline text-foreground">Privasi</Link>
                    <span>•</span>
                    <Link to="/refund-policy" className="hover:underline text-foreground">Kebijakan Refund</Link>
                  </div>
                </div>
              ) : gateway === 'midtrans' ? (
                <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 space-y-3 font-body">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-foreground text-xs">
                      <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                      <span>Midtrans Gateway: <strong className="text-primary font-semibold">Sandbox Terhubung</strong></span>
                    </div>
                    <Badge variant="lime" className="text-[10px]">Merchant: G587072361</Badge>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-primary/10 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      {midtransLoaded ? (
                        <span className="text-green-700 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Pop-up Snap SDK Siap
                        </span>
                      ) : (
                        <span>Mode Redirect / Pop-up Midtrans</span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowKeyInput(!showKeyInput)}
                      className="text-primary hover:underline font-semibold flex items-center gap-1 text-[11px]"
                    >
                      <Key className="w-3 h-3" />
                      {getClientKey() ? 'Ubah Client Key' : 'Tempel Client Key Sandbox'}
                    </button>
                  </div>

                  {showKeyInput && (
                    <div className="pt-2 space-y-2 border-t border-primary/10">
                      <p className="text-[11px] text-muted-foreground">
                        Masukkan Client Key dari Dashboard Midtrans:
                      </p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={clientKeyInput}
                          onChange={(e) => setClientKeyInput(e.target.value)}
                          placeholder="SB-Mid-client-xxxxxxxx"
                          className="flex-1 h-9 px-3 rounded-xl border border-border bg-card text-xs font-mono"
                        />
                        <Button size="sm" onClick={handleSaveClientKey} type="button">
                          Terapkan
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : null}

              {/* Payment Methods Panel (Hanya Midtrans dan Bayar di Tempat) */}
              <PaymentPanel
                gateway={gateway}
                onGatewayChange={setGateway}
                selectedMethod={paymentMethod}
                onSelectMethod={setPaymentMethod}
              />

              <div className="space-y-3">
                <Button
                  type="submit"
                  form="checkout-form"
                  size="lg"
                  className={`w-full text-base font-semibold ${
                    gateway === 'midtrans'
                      ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                      : 'bg-amber-600 hover:bg-amber-700 text-white'
                  }`}
                  disabled={submitting}
                >
                  {submitting
                    ? 'Menghubungi Gateway Midtrans...'
                    : gateway === 'midtrans'
                    ? `Bayar Online via Midtrans (${roomsCount} Kamar) · ${formatIDR(totalPrice)}`
                    : `Lanjutkan Booking (Bayar di Tempat) · ${formatIDR(totalPrice)}`}
                </Button>

                {/* Status Lock Warning / Disclaimer */}
                {gateway === 'hotel' ? (
                  <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border-2 border-amber-400 dark:border-amber-700 text-amber-950 dark:text-amber-200 text-xs flex items-start gap-2.5">
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <span className="font-bold text-amber-900 dark:text-amber-100 block">
                        CATATAN PENTING: BOOKING BELUM DIKONFIRMASI / LOCK
                      </span>
                      <p className="leading-relaxed">
                        Pemesanan dengan metode Bayar di Tempat <strong>BELUM TERKONFIRMASI DAN BELUM MENGUNCI (LOCK) KAMAR</strong> sebelum ada pembayaran diterima oleh hotel. Kamar berisiko dialihkan kepada tamu lain yang membayar lunas lebih dahulu jika kuota kamar penuh.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">JAMINAN INSTAN: KAMAR LANGSUNG TER-LOCK 100%</span>
                      <span>Pembayaran via Midtrans otomatis mengunci kamar dan menerbitkan konfirmasi instan secara resmi.</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Compliance & Security Assurance */}
              <div className="space-y-2 text-center text-xs text-muted-foreground font-body">
                <div className="flex items-center justify-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Enkripsi 256-bit SSL, berlisensi resmi Bank Indonesia & OJK.</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Dengan melanjutkan pembayaran, Anda menyetujui{' '}
                  <Link to="/terms" className="text-foreground underline hover:text-primary">
                    Syarat & Ketentuan Layanan
                  </Link>
                  ,{' '}
                  <Link to="/privacy" className="text-foreground underline hover:text-primary">
                    Kebijakan Privasi
                  </Link>
                  , dan{' '}
                  <Link to="/refund-policy" className="text-foreground underline hover:text-primary">
                    Kebijakan Refund & Pembatalan
                  </Link>{' '}
                  Jajapin.
                </p>
              </div>
            </div>

            {/* Right Column: Order Summary with Room Type & Multi-room Calculation */}
            <div className="lg:col-span-5">
              <Card className="border-border sticky top-24 shadow-sm">
                <CardContent className="p-6 space-y-5">
                  <div className="flex gap-4">
                    <img
                      src={selectedRoom.image || stay.image}
                      alt={selectedRoom.name}
                      className="w-24 h-24 rounded-2xl object-cover shrink-0"
                    />
                    <div>
                      <Badge variant="lime" className="mb-1">{stay.type}</Badge>
                      <h3 className="font-display font-semibold text-base text-foreground leading-snug">
                        {stay.name}
                      </h3>
                      <p className="text-xs text-muted-foreground font-body flex items-center gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5" /> {stay.city}, {stay.province}
                      </p>
                    </div>
                  </div>

                  <hr className="border-border" />

                  <div className="space-y-3 font-body text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <BedDouble className="w-4 h-4 text-emerald-600" /> Tipe Kamar
                      </span>
                      <span className="font-semibold text-foreground text-right">
                        {selectedRoom.name}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <DoorOpen className="w-4 h-4 text-primary" /> Jumlah Kamar
                      </span>
                      <span className="font-semibold text-foreground">{roomsCount} Kamar</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-primary" /> Check-in
                      </span>
                      <span className="font-semibold text-foreground">{checkIn}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-accent" /> Check-out
                      </span>
                      <span className="font-semibold text-foreground">{checkOut}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-muted-foreground" /> Jumlah Tamu
                      </span>
                      <span className="font-semibold text-foreground">{guests} orang</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Durasi Menginap</span>
                      <span className="font-semibold text-foreground">{nights} malam</span>
                    </div>
                  </div>

                  <hr className="border-border" />

                  <div className="space-y-2 font-body text-sm">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Tarif per kamar</span>
                      <span>{formatIDR(pricePerRoomNight)} /mlm</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>
                        {roomsCount} kamar × {nights} malam
                      </span>
                      <span className="text-foreground">{formatIDR(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Biaya layanan pemesanan</span>
                      <span className="text-emerald-700 font-medium">Rp0 (Gratis)</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Pajak & Retribusi Daerah</span>
                      <span className="text-foreground font-medium">Sudah Termasuk</span>
                    </div>
                  </div>

                  <div className="border-t border-border pt-4 flex justify-between items-baseline">
                    <div>
                      <span className="font-display font-semibold text-lg text-foreground block">
                        Total Tagihan
                      </span>
                      <span className="text-[11px] text-muted-foreground font-body">
                        {roomsCount} Kamar, {nights} Malam
                      </span>
                    </div>
                    <span className="font-display font-bold text-2xl text-emerald-700 dark:text-emerald-400">
                      {formatIDR(totalPrice)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL SIMULASI MIDTRANS SNAP */}
      {mockSnapData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card w-full max-w-md rounded-3xl border border-border shadow-2xl overflow-hidden font-body">
            <div className="bg-brand-forest-deep p-6 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-brand-lime font-bold block">
                  Midtrans Payment Gateway
                </span>
                <h3 className="font-display font-semibold text-lg text-white">
                  Simulasi Pop-up Snap
                </h3>
              </div>
              <button
                onClick={() => setMockSnapData(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="flex justify-between items-baseline p-4 rounded-2xl bg-muted/40 border border-border">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">
                    Order ID
                  </span>
                  <span className="font-mono font-bold text-sm text-foreground">
                    {mockSnapData.bookingCode}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">
                    Total Tagihan
                  </span>
                  <span className="font-display font-bold text-lg text-primary">
                    {formatIDR(mockSnapData.totalPrice)}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <Button size="lg" className="w-full" onClick={() => handleCompleteMockPayment(false)}>
                  Bayar Sekarang (Simulasi Midtrans) →
                </Button>
                <Button variant="outline" size="sm" onClick={() => setMockSnapData(null)}>
                  Tutup
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <SiteFooter />
    </div>
  );
}

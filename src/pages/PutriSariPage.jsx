import { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ShieldCheck,
  MapPin,
  Star,
  Compass,
  Wind,
  BedDouble,
  Car,
  ChevronRight,
  CheckCircle2,
  Calendar,
  Users,
  CreditCard,
  MessageCircle,
  ExternalLink,
  Camera,
  X,
  Phone,
  Waves,
  Sparkles,
  Search,
  KeyRound,
  FileCheck,
  Clock,
  ArrowRight,
  Coffee,
  Tv,
  Wifi,
  ChevronLeft,
  Bath,
} from 'lucide-react';
import { stays } from '../data/stays';
import { reviews as allReviews } from '../data/reviews';
import { formatIDR, formatDate } from '../lib/format';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import SiteFooter from '../components/site/SiteFooter';

export default function PutriSariPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Ambil data properti Hotel Putri Sari (sinkron dengan perubahan dashboard / PMS)
  const stay = useMemo(() => {
    try {
      const savedProperties = JSON.parse(localStorage.getItem('jajapin_properties') || '[]');
      const fromStorage = savedProperties.find(
        (s) =>
          s.id === 1 ||
          s.slug === 'jajapin-hotel-putri-sari' ||
          s.name?.toLowerCase().includes('putri sari')
      );
      if (fromStorage) return fromStorage;
    } catch (e) {
      // fallback
    }
    return stays.find((s) => s.id === 1 || s.slug === 'jajapin-hotel-putri-sari') || stays[0];
  }, []);

  // Booking Widget State
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const [checkIn, setCheckIn] = useState(searchParams.get('checkIn') || todayStr);
  const [checkOut, setCheckOut] = useState(searchParams.get('checkOut') || tomorrowStr);
  const [selectedRoomId, setSelectedRoomId] = useState(stay.room_types?.[0]?.id || 'deluxe_king_hijau');
  const [roomsCount, setRoomsCount] = useState(1);
  const [guestsCount, setGuestsCount] = useState(2);

  // Gallery Modal
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  // E-Voucher Modal
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [voucherCodeInput, setVoucherCodeInput] = useState('');
  const [searchedBooking, setSearchedBooking] = useState(null);
  const [voucherError, setVoucherError] = useState('');

  // Hitung jumlah malam
  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 1;
    const diff = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
    return Math.max(1, diff || 1);
  }, [checkIn, checkOut]);

  const selectedRoom = useMemo(() => {
    return stay.room_types?.find((r) => r.id === selectedRoomId) || stay.room_types?.[0];
  }, [stay, selectedRoomId]);

  const totalPrice = useMemo(() => {
    const rate = selectedRoom?.price || stay.price;
    return rate * nights * roomsCount;
  }, [selectedRoom, stay, nights, roomsCount]);

  useEffect(() => {
    document.title = 'Hotel Putri Sari Pelabuhan Ratu - Depan Pantai Kumala | Jajapin';
    window.scrollTo(0, 0);
  }, []);

  // 6 Foto Galeri Lengkap
  const galleryPhotos = [
    {
      src: '/assets/putri-sari/cover.jpg',
      title: 'Foto Gerbang Depan Asli',
      caption: 'Papan nama kayu Hotel Putri Sari dan gerbang masuk berpagar hijau asri di Pelabuhan Ratu.',
    },
    {
      src: '/assets/putri-sari/3.jpg',
      title: 'Deluxe King Suite (Kasur Hijau)',
      caption: 'Kamar luas dengan kasur King Size bersprei hijau elegan, lemari pakaian 3 pintu, dan AC sejuk.',
    },
    {
      src: '/assets/putri-sari/2.jpg',
      title: 'Standard Room dengan Balkon & Arah Kiblat (Kasur Oranye)',
      caption: 'Kamar berpintu balkon dengan pemandangan pepohonan hijau rindang dan stiker arah kiblat di plafon.',
    },
    {
      src: '/assets/putri-sari/4.jpg',
      title: 'Double Bed Standard AC',
      caption: 'Tempat tidur ganda yang nyaman dan bersih berpendingin AC untuk 2 orang.',
    },
    {
      src: '/assets/putri-sari/1.jpg',
      title: 'Single Bed Standard & Kipas',
      caption: 'Kamar hemat yang higienis, tenang, dan cocok untuk pelancong santai maupun solo traveler.',
    },
    {
      src: '/assets/destinasi-bandung.png',
      title: 'Kawasan & Akses Pantai Kumala',
      caption: 'Suasana asri dan sejuk tepat di seberang Pantai Kumala, Pelabuhan Ratu.',
    },
  ];

  const handleBookNow = (roomId) => {
    const targetRoom = stay.room_types?.find((r) => r.id === roomId) || selectedRoom;
    const url = `/pesan/jajapin-hotel-putri-sari?roomType=${encodeURIComponent(
      targetRoom.name
    )}&rooms=${roomsCount}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guestsCount}`;
    navigate(url);
  };

  const handleCheckVoucher = (e) => {
    e.preventDefault();
    setVoucherError('');
    setSearchedBooking(null);

    const saved = JSON.parse(localStorage.getItem('jajapin_bookings') || '[]');
    const q = voucherCodeInput.trim().toUpperCase();

    const found = saved.find(
      (b) =>
        b.booking_code?.toUpperCase() === q ||
        b.guest_phone?.includes(q) ||
        b.invoice_number?.toUpperCase().includes(q)
    );

    if (found) {
      setSearchedBooking(found);
    } else {
      setVoucherError('Kode booking atau nomor kontak tidak ditemukan dalam sistem. Silakan periksa kembali atau hubungi resepsionis via WhatsApp.');
    }
  };

  const waReceptionNumber = '6281234567890';
  const waReceptionUrl = `https://wa.me/${waReceptionNumber}?text=${encodeURIComponent(
    'Halo Resepsionis Hotel Putri Sari Pelabuhan Ratu, saya ingin menanyakan ketersediaan kamar di depan Pantai Kumala.'
  )}`;

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-foreground font-body">
      {/* 1. TOP NAVBAR KHUSUS PUTRI SARI & JAJAPIN */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-border/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Logo Brand */}
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/assets/logo-jajapin.jpg"
              alt="Jajapin Logo"
              className="w-11 h-11 rounded-full object-cover border-2 border-emerald-600/30 shadow-xs"
            />
            <div>
              <span className="font-display font-bold text-xl tracking-tight text-emerald-950 block leading-tight">
                JAJAPIN
              </span>
              <span className="text-[10px] uppercase tracking-[0.24em] text-emerald-700 font-semibold block">
                Jalan Jalan Pesona Indonesia
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link
              to="/stays"
              className="text-muted-foreground hover:text-emerald-800 transition-colors"
            >
              Jelajah Penginapan
            </Link>
            <span className="flex items-center gap-1.5 text-emerald-800 font-bold bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200/80">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              Hotel Putri Sari (Unggulan)
            </span>
            <button
              onClick={() => setIsVoucherModalOpen(true)}
              className="text-muted-foreground hover:text-emerald-800 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <FileCheck className="w-4 h-4" />
              Cek E-Voucher
            </button>
            <a
              href={waReceptionUrl}
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground hover:text-emerald-800 transition-colors flex items-center gap-1"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              Bantuan WhatsApp
            </a>
          </nav>

          {/* Portal Mitra Button */}
          <div className="flex items-center gap-3">
            <Link to="/dashboard">
              <button className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 text-emerald-900 text-xs font-semibold transition-all">
                <KeyRound className="w-3.5 h-3.5 text-emerald-700" />
                <span>Portal Mitra</span>
                <span className="px-1.5 py-0.5 rounded-md bg-emerald-700 text-white text-[9px] font-bold">
                  Kunci Akses
                </span>
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* 2. NOTICE BAR PENGINAPAN PILIHAN UTAMA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/90 text-emerald-900 text-xs font-bold tracking-wider uppercase mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Penginapan Pilihan Utama Jajapin</span>
            </div>
            <h1 className="font-display font-bold text-3xl sm:text-4xl text-emerald-950 tracking-tight">
              Hotel Putri Sari
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground font-body flex items-center gap-1.5 mt-1">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-semibold text-emerald-900">
                Depan Pantai Kumala, Jl. Raya Cisolok, Pelabuhan Ratu, Jawa Barat
              </span>
              <span className="hidden sm:inline text-border">·</span>
              <span className="hidden sm:inline text-emerald-700 font-medium">
                Pelabuhan Ratu - Pantai Selatan
              </span>
            </p>
          </div>

          {/* Action Buttons Header */}
          <div className="flex items-center gap-3">
            <a
              href={waReceptionUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-emerald-600/40 bg-white hover:bg-emerald-50 text-emerald-800 text-xs sm:text-sm font-semibold transition-all shadow-xs"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>WhatsApp Resepsionis</span>
            </a>
            <button
              onClick={() => {
                document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-emerald-900 hover:bg-emerald-950 text-white text-xs sm:text-sm font-semibold transition-all shadow-md"
            >
              <span>Lihat Semua Detail</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. HERO GRID UTAMA (Sesuai Screenshot User) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* KOLOM KIRI (5 Kolom): CARD GERBANG ASLI & DESKRIPSI UTAMA */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-border shadow-xs overflow-hidden flex flex-col justify-between">
            <div>
              {/* Image Gerbang Depan Asli */}
              <div className="relative aspect-4/3 w-full overflow-hidden bg-muted">
                <img
                  src="/assets/putri-sari/cover.jpg"
                  alt="Hotel Putri Sari Gerbang Asli"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-emerald-900/90 text-white text-[11px] font-semibold tracking-wide flex items-center gap-1 backdrop-blur-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-lime" />
                  Mitra Terverifikasi JAJAPIN
                </span>
                <span className="absolute bottom-3 right-3 px-3 py-1 rounded-xl bg-black/70 text-white text-[10px] font-medium backdrop-blur-xs">
                  Foto Gerbang Depan Asli
                </span>
              </div>

              {/* Info & Rekomendasi */}
              <div className="p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                    Hotel Rekomendasi Wisata
                  </span>
                  <div className="flex items-center gap-1 text-amber-500 font-bold text-xs font-body">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="text-foreground">4.9</span>
                    <span className="text-muted-foreground font-normal">(128 ulasan)</span>
                  </div>
                </div>

                <p className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed font-body">
                  Hotel Putri Sari adalah pilihan penginapan favorit berstandar JAJAPIN yang menyajikan atmosfer
                  sejuk, tenang, dan keramahan khas Indonesia. Berada tepat di seberang Pantai Kumala, Pelabuhan
                  Ratu. Dilengkapi kamar bersih berpendingin AC, penunjuk arah kiblat di plafon kamar, balkon asri,
                  kasur empuk, serta area parkir mobil yang aman dan leluasa.
                </p>

                {/* 4 Keunggulan Berbentuk Grid 2x2 */}
                <div className="grid grid-cols-2 gap-2.5 pt-2">
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50/70 text-emerald-900 text-xs font-medium">
                    <Compass className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>Arah Kiblat Plafon</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50/70 text-emerald-900 text-xs font-medium">
                    <Wind className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>AC Dingin & Terawat</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50/70 text-emerald-900 text-xs font-medium">
                    <BedDouble className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>Kasur King & Queen</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50/70 text-emerald-900 text-xs font-medium">
                    <Car className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>Parkir Mobil Aman</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row: Tarif Mulai & Trigger Galeri */}
            <div className="p-5 sm:p-6 bg-muted/20 border-t border-border flex items-center justify-between">
              <div>
                <span className="text-[11px] text-muted-foreground block font-body">Mulai dari</span>
                <span className="font-display font-bold text-xl text-emerald-800">
                  {formatIDR(100000)}
                </span>
                <span className="text-[11px] text-muted-foreground"> /malam</span>
              </div>
              <button
                onClick={() => {
                  setActivePhotoIdx(0);
                  setIsGalleryOpen(true);
                }}
                className="text-xs font-bold text-emerald-800 hover:text-emerald-950 hover:underline flex items-center gap-1"
              >
                <Camera className="w-4 h-4 text-emerald-600" />
                <span>Buka Galeri Foto Lengkap (6)</span>
              </button>
            </div>
          </div>

          {/* KOLOM KANAN (7 Kolom): 2 TIPE KAMAR UNGGULAN SESUAI SCREENSHOT */}
          <div className="lg:col-span-7 space-y-4">
            {/* KAMAR 1: Deluxe King Suite (Kasur Hijau) */}
            <div className="bg-white rounded-3xl border border-border shadow-xs overflow-hidden transition-all hover:border-emerald-300">
              <div className="grid grid-cols-1 sm:grid-cols-12">
                {/* Foto Kamar */}
                <div className="sm:col-span-5 relative aspect-4/3 sm:aspect-auto h-full min-h-[200px] overflow-hidden bg-muted">
                  <img
                    src="/assets/putri-sari/3.jpg"
                    alt="Deluxe King Suite (Kasur Hijau)"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-lg bg-emerald-900/90 text-white text-[10px] font-bold tracking-wider uppercase">
                    Kamar Kasur Hijau
                  </span>
                </div>

                {/* Info & Tombol Pesan */}
                <div className="sm:col-span-7 p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-display font-bold text-base sm:text-lg text-foreground leading-snug">
                        Deluxe King Suite (Kasur Hijau)
                      </h3>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider shrink-0">
                        Paling Favorit
                      </span>
                    </div>

                    <p className="text-[11px] text-emerald-800 font-semibold mt-1 flex items-center gap-2">
                      <span>1 King Bed Ekstra Luas</span>
                      <span>·</span>
                      <span>2 Tamu</span>
                      <span>·</span>
                      <span>AC & Lemari</span>
                    </p>

                    <p className="text-xs text-muted-foreground mt-2 line-clamp-3 leading-relaxed">
                      Kamar luas dengan kasur King Size bersprei hijau elegan, dipan empuk berkepala kulit modern,
                      lemari pakaian geser 3 pintu motif kayu, AC dingin, dan meja rias lengkap.
                    </p>
                  </div>

                  <div className="pt-4 mt-3 border-t border-border flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-muted-foreground line-through block">
                        Rp 420.000
                      </span>
                      <div className="flex items-baseline gap-1">
                        <span className="font-display font-bold text-lg text-emerald-700">
                          {formatIDR(350000)}
                        </span>
                        <span className="text-[10px] text-muted-foreground">/malam</span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleBookNow('deluxe_king_hijau')}
                      className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-4 rounded-xl"
                    >
                      Pesan Kamar Ini
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* KAMAR 2: Standard Room dengan Balkon & Arah Kiblat (Kasur Oranye) */}
            <div className="bg-white rounded-3xl border border-border shadow-xs overflow-hidden transition-all hover:border-emerald-300">
              <div className="grid grid-cols-1 sm:grid-cols-12">
                {/* Foto Kamar */}
                <div className="sm:col-span-5 relative aspect-4/3 sm:aspect-auto h-full min-h-[200px] overflow-hidden bg-muted">
                  <img
                    src="/assets/putri-sari/2.jpg"
                    alt="Standard Room dengan Balkon & Arah Kiblat (Kasur Oranye)"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-lg bg-orange-800/90 text-white text-[10px] font-bold tracking-wider uppercase">
                    Kamar Kasur Oranye + Balkon
                  </span>
                  <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/70 text-white text-[9px] flex items-center gap-1">
                    <Compass className="w-3 h-3 text-brand-lime" />
                    Penunjuk Arah Kiblat
                  </span>
                </div>

                {/* Info & Tombol Pesan */}
                <div className="sm:col-span-7 p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-display font-bold text-base sm:text-lg text-foreground leading-snug">
                        Standard Room dengan Balkon & Arah Kiblat (Kasur Oranye)
                      </h3>
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold uppercase tracking-wider shrink-0">
                        Balkon Asri
                      </span>
                    </div>

                    <p className="text-[11px] text-emerald-800 font-semibold mt-1 flex items-center gap-2">
                      <span>1 Queen Bed + Balkon</span>
                      <span>·</span>
                      <span>Balkon Terbuka</span>
                      <span>·</span>
                      <span>Arah Kiblat Plafon</span>
                    </p>

                    <p className="text-xs text-muted-foreground mt-2 line-clamp-3 leading-relaxed">
                      Kamar sejuk dengan pintu balkon yang menghadap pepohonan hijau rindang, dipan podium modern
                      berwarna putih, stiker penunjuk arah kiblat di plafon, dan suasana tenang menenangkan.
                    </p>
                  </div>

                  <div className="pt-4 mt-3 border-t border-border flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-muted-foreground line-through block">
                        Rp 350.000
                      </span>
                      <div className="flex items-baseline gap-1">
                        <span className="font-display font-bold text-lg text-emerald-700">
                          {formatIDR(285000)}
                        </span>
                        <span className="text-[10px] text-muted-foreground">/malam</span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleBookNow('standard_balkon_oranye')}
                      className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-4 rounded-xl"
                    >
                      Pesan Kamar Ini
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FAST BOOKING ENGINE WIDGET */}
      <section id="booking-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-emerald-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-emerald-800/50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-emerald-800 pb-4">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-brand-lime">
                Fast Online Reservation
              </span>
              <h2 className="font-display font-bold text-xl sm:text-2xl text-white mt-0.5">
                Pesan Kamar Hotel Putri Sari Langsung (Jaminan Harga Terbaik)
              </h2>
            </div>
            <div className="text-xs text-emerald-200/80 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-brand-lime shrink-0" />
              <span>Konfirmasi Otomatis & Terkoneksi Pembayaran Xendit / QRIS</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Check-In */}
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-emerald-200 font-semibold mb-1.5">
                Tanggal Check-In
              </label>
              <Input
                type="date"
                value={checkIn}
                min={todayStr}
                onChange={(e) => setCheckIn(e.target.value)}
                className="bg-white text-foreground"
              />
            </div>

            {/* Check-Out */}
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-emerald-200 font-semibold mb-1.5">
                Tanggal Check-Out
              </label>
              <Input
                type="date"
                value={checkOut}
                min={checkIn || todayStr}
                onChange={(e) => setCheckOut(e.target.value)}
                className="bg-white text-foreground"
              />
            </div>

            {/* Pilihan Kamar */}
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-emerald-200 font-semibold mb-1.5">
                Tipe Kamar
              </label>
              <select
                value={selectedRoomId}
                onChange={(e) => setSelectedRoomId(e.target.value)}
                className="w-full h-11 rounded-2xl border border-border bg-white px-3 font-body text-xs text-foreground focus:ring-2 focus:ring-brand-lime font-medium"
              >
                {stay.room_types?.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} — {formatIDR(r.price)}
                  </option>
                ))}
              </select>
            </div>

            {/* Jumlah Kamar & Tamu */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-emerald-200 font-semibold mb-1.5">
                  Jumlah Kamar
                </label>
                <select
                  value={roomsCount}
                  onChange={(e) => setRoomsCount(Number(e.target.value))}
                  className="w-full h-11 rounded-2xl border border-border bg-white px-3 font-body text-xs text-foreground font-bold"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                    <option key={n} value={n}>
                      {n} Kamar
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-emerald-200 font-semibold mb-1.5">
                  Tamu
                </label>
                <select
                  value={guestsCount}
                  onChange={(e) => setGuestsCount(Number(e.target.value))}
                  className="w-full h-11 rounded-2xl border border-border bg-white px-3 font-body text-xs text-foreground font-bold"
                >
                  {[1, 2, 3, 4, 5, 6, 8, 10, 15].map((n) => (
                    <option key={n} value={n}>
                      {n} Org
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Action Button & Total */}
            <div className="flex flex-col justify-end">
              <Button
                onClick={() => handleBookNow(selectedRoomId)}
                className="w-full h-11 bg-brand-lime hover:bg-emerald-400 text-emerald-950 font-bold rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Lanjut Pesan ({formatIDR(totalPrice)})</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SEMUA PILIHAN TIPE KAMAR HOTEL PUTRI SARI */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6">
          <div>
            <span className="text-xs uppercase tracking-widest text-emerald-700 font-bold">
              Katalog Lengkap
            </span>
            <h2 className="font-display font-bold text-2xl text-emerald-950 mt-1">
              Semua Pilihan Tipe Kamar & Tarif Resmi
            </h2>
          </div>
          <p className="text-xs text-muted-foreground mt-2 sm:mt-0">
            Kapasitas mulai dari single solo hingga rombongan keluarga 4 tamu
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stay.room_types?.map((room) => (
            <div
              key={room.id}
              className="bg-white rounded-3xl border border-border shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="relative aspect-16/10 overflow-hidden bg-muted">
                  <img src={room.image} alt={room.name} className="w-full h-full object-cover" />
                  {room.badge && (
                    <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-emerald-900 text-white text-[10px] font-bold uppercase tracking-wider">
                      {room.badge}
                    </span>
                  )}
                  <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-black/60 text-white text-[10px]">
                    {room.capacity} Tamu
                  </span>
                </div>

                <div className="p-5 space-y-3">
                  <h3 className="font-display font-bold text-base text-foreground">{room.name}</h3>
                  <p className="text-xs text-emerald-800 font-semibold">{room.bed}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {room.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {room.amenities?.slice(0, 3).map((a, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-muted text-muted-foreground text-[10px] font-medium"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-5 bg-muted/20 border-t border-border flex items-center justify-between">
                <div>
                  {room.original_price && (
                    <span className="text-[10px] text-muted-foreground line-through block">
                      {formatIDR(room.original_price)}
                    </span>
                  )}
                  <span className="font-display font-bold text-base text-emerald-800">
                    {formatIDR(room.price)}
                  </span>
                  <span className="text-[10px] text-muted-foreground"> /malam</span>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleBookNow(room.id)}
                  className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl"
                >
                  Pilih Kamar
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. LOKASI STRATEGIS TEPAT DI DEPAN PANTAI KUMALA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-emerald-50 rounded-3xl p-6 sm:p-8 border border-emerald-200/80">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-200 text-emerald-900 text-xs font-bold tracking-wider uppercase">
                <Waves className="w-4 h-4 text-emerald-800" />
                Lokasi Emas Tepi Laut
              </span>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-emerald-950">
                Tepat di Depan Pantai Kumala, Pelabuhan Ratu
              </h2>
              <p className="text-xs sm:text-sm text-emerald-900 leading-relaxed font-body">
                Anda tidak perlu repot naik kendaraan untuk menikmati pemandangan laut. Cukup menyeberang jalan dari
                gerbang depan hotel, Anda sudah langsung berada di bibir Pantai Kumala dengan hamparan pasir dan
                deburan ombak khas pesisir selatan Sukabumi.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-white rounded-2xl border border-emerald-100 shadow-xs flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 shrink-0 font-bold text-xs">
                    0m
                  </div>
                  <div>
                    <span className="font-bold text-xs text-foreground block">Pantai Kumala</span>
                    <span className="text-[11px] text-muted-foreground">Tepat di seberang gerbang hotel</span>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-2xl border border-emerald-100 shadow-xs flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 shrink-0 font-bold text-xs">
                    5m
                  </div>
                  <div>
                    <span className="font-bold text-xs text-foreground block">Pantai Pelabuhan Ratu</span>
                    <span className="text-[11px] text-muted-foreground">5 menit berkendara</span>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-2xl border border-emerald-100 shadow-xs flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 shrink-0 font-bold text-xs">
                    8m
                  </div>
                  <div>
                    <span className="font-bold text-xs text-foreground block">Pantai Citepus</span>
                    <span className="text-[11px] text-muted-foreground">Spot sunset & wisata kuliner ikan</span>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-2xl border border-emerald-100 shadow-xs flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 shrink-0 font-bold text-xs">
                    25m
                  </div>
                  <div>
                    <span className="font-bold text-xs text-foreground block">Geopark Ciletuh UNESCO</span>
                    <span className="text-[11px] text-muted-foreground">Jalur wisata pesisir selatan</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-emerald-200/80 shadow-sm space-y-4 text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                <MapPin className="w-7 h-7" />
              </div>
              <h3 className="font-display font-bold text-lg text-emerald-950">Alamat Lengkap Hotel</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Jl. Raya Cisolok, Depan Pantai Kumala, Pelabuhan Ratu, Kabupaten Sukabumi, Jawa Barat 43364
              </p>
              <div className="pt-2">
                <a
                  href="https://maps.google.com/?q=Hotel+Putri+Sari+Pelabuhan+Ratu"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-all shadow-md"
                >
                  <Compass className="w-4 h-4" />
                  <span>Buka Petunjuk Arah di Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. LIGHTBOX GALERI FOTO LENGKAP (6 FOTO) */}
      {isGalleryOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <button
            onClick={() => setIsGalleryOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative max-w-4xl w-full flex flex-col items-center">
            {/* Foto Aktif */}
            <div className="relative w-full aspect-16/10 rounded-2xl overflow-hidden bg-black flex items-center justify-center shadow-2xl">
              <img
                src={galleryPhotos[activePhotoIdx].src}
                alt={galleryPhotos[activePhotoIdx].title}
                className="w-full h-full object-contain"
              />

              {/* Prev / Next Arrows */}
              <button
                onClick={() =>
                  setActivePhotoIdx((prev) => (prev > 0 ? prev - 1 : galleryPhotos.length - 1))
                }
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() =>
                  setActivePhotoIdx((prev) => (prev < galleryPhotos.length - 1 ? prev + 1 : 0))
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Keterangan Foto */}
            <div className="text-center mt-3 text-white">
              <span className="text-xs uppercase tracking-widest text-brand-lime font-bold">
                Foto {activePhotoIdx + 1} dari {galleryPhotos.length}
              </span>
              <h4 className="font-display font-bold text-lg">{galleryPhotos[activePhotoIdx].title}</h4>
              <p className="text-xs text-white/70 max-w-lg mx-auto mt-0.5">
                {galleryPhotos[activePhotoIdx].caption}
              </p>
            </div>

            {/* Thumbnail Strip */}
            <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
              {galleryPhotos.map((photo, idx) => (
                <button
                  key={idx}
                  onClick={() => setActivePhotoIdx(idx)}
                  className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    activePhotoIdx === idx ? 'border-brand-lime scale-105' : 'border-white/30 opacity-60'
                  }`}
                >
                  <img src={photo.src} alt={photo.title} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 8. MODAL CEK E-VOUCHER / INVOICE RESERVASI */}
      {isVoucherModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl border border-border shadow-2xl max-w-md w-full overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2 text-emerald-900">
                <FileCheck className="w-5 h-5 text-emerald-700" />
                <h3 className="font-display font-bold text-lg text-foreground">
                  Cek E-Voucher Hotel Putri Sari
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsVoucherModalOpen(false);
                  setSearchedBooking(null);
                  setVoucherError('');
                }}
                className="p-1 rounded-full hover:bg-muted text-muted-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCheckVoucher} className="space-y-3">
              <label className="block text-xs font-semibold text-muted-foreground">
                Masukkan Kode Booking (Contoh: JP-XXXXXX) atau Nomor HP:
              </label>
              <div className="flex gap-2">
                <Input
                  value={voucherCodeInput}
                  onChange={(e) => setVoucherCodeInput(e.target.value)}
                  placeholder="Contoh: JP-982103 atau 0812xxxx"
                  required
                />
                <Button type="submit" className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold shrink-0">
                  Periksa
                </Button>
              </div>
            </form>

            {voucherError && (
              <div className="p-3 rounded-2xl bg-red-50 text-red-700 text-xs border border-red-200">
                {voucherError}
              </div>
            )}

            {searchedBooking && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2 animate-in fade-in">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-emerald-900">Kode: {searchedBooking.booking_code}</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 text-[10px] font-bold uppercase">
                    {searchedBooking.payment_status === 'dibayar' ? 'Lunas ✅' : 'Dikonfirmasi'}
                  </span>
                </div>
                <div className="text-xs font-body text-emerald-950 space-y-1">
                  <p><strong>Nama Tamu:</strong> {searchedBooking.guest_name}</p>
                  <p><strong>Tipe Kamar:</strong> {searchedBooking.room_type} ({searchedBooking.room_count || 1} Kamar)</p>
                  <p><strong>Jadwal:</strong> {formatDate(searchedBooking.check_in)} s/d {formatDate(searchedBooking.check_out)}</p>
                  <p><strong>Total:</strong> {formatIDR(searchedBooking.total_price)}</p>
                </div>
                <div className="pt-2">
                  <Link
                    to={`/konfirmasi/${searchedBooking.booking_code}`}
                    className="block text-center py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-900"
                  >
                    Buka Faktur & E-Voucher Resmi
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 9. FLOATING WHATSAPP BUTTON RESEPSIONIS */}
      <a
        href={waReceptionUrl}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 rounded-full bg-[#25D366] text-white font-bold text-xs sm:text-sm shadow-2xl hover:scale-105 transition-transform"
      >
        <MessageCircle className="w-5 h-5 fill-white text-white" />
        <span className="hidden sm:inline">WhatsApp Resepsionis Putri Sari</span>
        <span className="sm:hidden">Resepsionis</span>
      </a>

      {/* FOOTER */}
      <SiteFooter />
    </div>
  );
}

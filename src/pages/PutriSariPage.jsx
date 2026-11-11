import { useState, useMemo, useEffect, useRef } from 'react';
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
  Check,
  Info,
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
  const [selectedRoomId, setSelectedRoomId] = useState(stay.room_types?.[0]?.id || 'deluxe');
  const [roomsCount, setRoomsCount] = useState(1);
  const [guestsCount, setGuestsCount] = useState(2);

  // Active section tab for mobile navigation
  const [activeTab, setActiveTab] = useState('kamar');

  // Gallery Modal
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  // E-Voucher Modal
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [voucherCodeInput, setVoucherCodeInput] = useState('');
  const [searchedBooking, setSearchedBooking] = useState(null);
  const [voucherError, setVoucherError] = useState('');

  // Mobile drawer menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      caption: 'Papan nama kayu Hotel Putri Sari dan gerbang masuk berpagar hijau di pinggir jalan raya pantai.',
    },
    {
      src: '/assets/putri-sari/3.jpg',
      title: 'Deluxe King Suite (Kasur Hijau)',
      caption: 'Kamar luas dengan kasur King Size bersprei hijau elegan, dipan kepala kulit, lemari 3 pintu, dan AC sejuk.',
    },
    {
      src: '/assets/putri-sari/2.jpg',
      title: 'Standard Room Balkon & Arah Kiblat (Kasur Oranye)',
      caption: 'Kamar berpintu balkon dengan pemandangan pepohonan rindang dan stiker arah kiblat di plafon.',
    },
    {
      src: '/assets/putri-sari/4.jpg',
      title: 'Double Bed Standard AC',
      caption: 'Tempat tidur ganda higienis berpendingin AC yang cocok untuk 2 orang tamu.',
    },
    {
      src: '/assets/putri-sari/1.jpg',
      title: 'Single Bed Standard',
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

  const waReceptionNumber = '628581415730';
  const waReceptionUrl = `https://wa.me/${waReceptionNumber}?text=${encodeURIComponent(
    'Halo Resepsionis Hotel Putri Sari Pelabuhan Ratu, saya ingin menanyakan ketersediaan kamar di depan Pantai Kumala.'
  )}`;

  const scrollToSection = (id, tabName) => {
    setActiveTab(tabName);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -120;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] text-stone-900 font-body antialiased pb-28 sm:pb-8">
      
      {/* 1. TOP NETWORK CONNECTOR BAR (Compact on mobile) */}
      <div className="bg-[#0b1f14] text-white text-[11px] py-2 px-3 sm:px-6 border-b border-emerald-900/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 truncate">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
            <span className="text-emerald-300 font-bold uppercase tracking-wider text-[10px] hidden xs:inline">
              Resmi:
            </span>
            <span className="font-mono text-emerald-200 text-xs">putrisari.jajapin.id</span>
            <span className="hidden md:inline text-white/60">• Jaringan JAJAPIN Pesona Indonesia</span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/"
              className="text-emerald-300 hover:text-white font-semibold inline-flex items-center gap-1 text-[11px] transition-colors"
            >
              ← <span className="hidden sm:inline">Beranda</span> jajapin.id
            </Link>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER NAVBAR */}
      <header className="bg-white/95 backdrop-blur-md border-b border-stone-200/80 sticky top-[33px] z-40 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
          
          {/* Logo & Hotel Title */}
          <div className="flex items-center gap-2.5">
            <Link to="/" className="flex items-center gap-2">
              <img
                src="/assets/logo-jajapin.jpg"
                alt="Jajapin"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border border-emerald-700/30 shrink-0"
              />
              <div className="leading-tight">
                <span className="font-display font-bold text-base sm:text-lg text-emerald-950 block">
                  Hotel Putri Sari
                </span>
                <span className="text-[9px] uppercase tracking-wider text-emerald-700 font-semibold block sm:hidden">
                  Pelabuhan Ratu
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-stone-600">
            <button
              onClick={() => scrollToSection('kamar-section', 'kamar')}
              className={`hover:text-emerald-800 transition-colors ${activeTab === 'kamar' ? 'text-emerald-800 font-bold' : ''}`}
            >
              Pilihan Kamar & Tarif
            </button>
            <button
              onClick={() => scrollToSection('galeri-section', 'foto')}
              className={`hover:text-emerald-800 transition-colors ${activeTab === 'foto' ? 'text-emerald-800 font-bold' : ''}`}
            >
              Foto Asli (6)
            </button>
            <button
              onClick={() => scrollToSection('lokasi-section', 'lokasi')}
              className={`hover:text-emerald-800 transition-colors ${activeTab === 'lokasi' ? 'text-emerald-800 font-bold' : ''}`}
            >
              Lokasi & Akses Pantai
            </button>
            <button
              onClick={() => scrollToSection('fasilitas-section', 'fasilitas')}
              className={`hover:text-emerald-800 transition-colors ${activeTab === 'fasilitas' ? 'text-emerald-800 font-bold' : ''}`}
            >
              Fasilitas & Layanan
            </button>
            <button
              onClick={() => setIsVoucherModalOpen(true)}
              className="text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200 transition-colors flex items-center gap-1.5"
            >
              <FileCheck className="w-3.5 h-3.5" />
              Cek E-Voucher
            </button>
          </nav>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2">
            <a
              href={waReceptionUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-700" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>

            <Link
              to="/dashboard"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-900 hover:bg-emerald-950 text-white text-xs font-semibold transition-colors shadow-2xs"
            >
              <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
              <span>HMS & Portal Mitra</span>
            </Link>

            <button
              onClick={() => setIsVoucherModalOpen(true)}
              className="sm:hidden p-2 text-stone-700 hover:text-emerald-800"
              title="Cek E-Voucher"
            >
              <FileCheck className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Sticky Segmented Control Bar */}
        <div className="lg:hidden border-t border-stone-200/60 bg-stone-50/80 backdrop-blur-xs overflow-x-auto no-scrollbar py-2 px-3 flex items-center gap-2 text-xs font-medium">
          <button
            onClick={() => scrollToSection('kamar-section', 'kamar')}
            className={`px-3 py-1.5 rounded-full shrink-0 transition-colors ${
              activeTab === 'kamar' ? 'bg-emerald-800 text-white font-bold' : 'bg-white text-stone-700 border border-stone-200'
            }`}
          >
            Pilihan Kamar
          </button>
          <button
            onClick={() => scrollToSection('galeri-section', 'foto')}
            className={`px-3 py-1.5 rounded-full shrink-0 transition-colors ${
              activeTab === 'foto' ? 'bg-emerald-800 text-white font-bold' : 'bg-white text-stone-700 border border-stone-200'
            }`}
          >
            Foto Asli (6)
          </button>
          <button
            onClick={() => scrollToSection('lokasi-section', 'lokasi')}
            className={`px-3 py-1.5 rounded-full shrink-0 transition-colors ${
              activeTab === 'lokasi' ? 'bg-emerald-800 text-white font-bold' : 'bg-white text-stone-700 border border-stone-200'
            }`}
          >
            Akses Pantai
          </button>
          <button
            onClick={() => scrollToSection('fasilitas-section', 'fasilitas')}
            className={`px-3 py-1.5 rounded-full shrink-0 transition-colors ${
              activeTab === 'fasilitas' ? 'bg-emerald-800 text-white font-bold' : 'bg-white text-stone-700 border border-stone-200'
            }`}
          >
            Fasilitas
          </button>
          <button
            onClick={() => scrollToSection('booking-section', 'booking')}
            className={`px-3 py-1.5 rounded-full shrink-0 transition-colors ${
              activeTab === 'booking' ? 'bg-emerald-800 text-white font-bold' : 'bg-white text-stone-700 border border-stone-200'
            }`}
          >
            Pesan Cepat
          </button>
        </div>
      </header>

      {/* 3. MOBILE HERO: SWIPEABLE / HORIZONTAL PHOTO STRIP + QUICK TITLE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
        
        {/* Mobile Title & Badge Card */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-stone-200/80 shadow-2xs mb-4">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                Listing Terverifikasi Jajapin
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] sm:text-xs font-semibold">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                Terhubung ke HMS
              </span>
            </div>

            <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="text-stone-900">4.9</span>
              <span className="text-stone-400 font-normal">(128 Ulasan Riil)</span>
            </div>
          </div>

          <h1 className="font-display font-light text-2xl sm:text-4xl text-stone-900 tracking-tight leading-tight">
            Hotel Putri Sari <span className="font-semibold text-emerald-800">Pelabuhan Ratu</span>
          </h1>

          <p className="text-xs sm:text-sm text-stone-600 font-body flex items-start gap-1.5 mt-1.5">
            <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>Jl. Raya Cisolok, Tepat di Depan Pantai Kumala, Pelabuhan Ratu, Sukabumi</span>
          </p>

          {/* Quick Pillars (Mobile Friendly Grid) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-3 border-t border-stone-100 text-xs text-stone-700">
            <div className="flex items-center gap-2 p-2 rounded-xl bg-stone-50">
              <Waves className="w-4 h-4 text-emerald-700 shrink-0" />
              <span className="truncate">0m ke Pantai Kumala</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-stone-50">
              <Compass className="w-4 h-4 text-emerald-700 shrink-0" />
              <span className="truncate">Arah Kiblat di Plafon</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-stone-50">
              <Wind className="w-4 h-4 text-emerald-700 shrink-0" />
              <span className="truncate">AC Dingin & Terawat</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-stone-50">
              <Car className="w-4 h-4 text-emerald-700 shrink-0" />
              <span className="truncate">Parkir Mobil Luas</span>
            </div>
          </div>
        </div>

        {/* PHOTO STRIP: Horizontal scroll on mobile, refined grid on desktop */}
        <div id="galeri-section" className="relative">
          <div className="flex gap-2.5 overflow-x-auto no-scrollbar snap-x snap-mandatory rounded-3xl pb-1">
            {galleryPhotos.map((photo, idx) => (
              <div
                key={photo.src}
                onClick={() => {
                  setActivePhotoIdx(idx);
                  setIsGalleryOpen(true);
                }}
                className="relative snap-center shrink-0 w-[82vw] sm:w-[48vw] lg:w-[32%] aspect-[4/3] rounded-3xl overflow-hidden bg-stone-900 border border-stone-200 cursor-pointer group shadow-2xs"
              >
                <img
                  src={photo.src}
                  alt={photo.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20" />
                
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-medium border border-white/20">
                  {idx === 0 ? 'Foto Gerbang Asli' : photo.title}
                </span>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <p className="text-xs font-semibold truncate">{photo.title}</p>
                  <p className="text-[10px] text-white/70 line-clamp-1">{photo.caption}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Gallery View All Button */}
          <div className="flex justify-between items-center mt-2 px-1">
            <span className="text-[11px] text-stone-500 font-body">
              Geser untuk melihat 6 foto asli hotel & kamar
            </span>
            <button
              onClick={() => {
                setActivePhotoIdx(0);
                setIsGalleryOpen(true);
              }}
              className="text-xs font-bold text-emerald-800 hover:underline inline-flex items-center gap-1"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Buka Galeri Foto (6)</span>
            </button>
          </div>
        </div>

      </section>

      {/* 4. SECTION PILIHAN KAMAR (MOBILE-FIRST CARDS) */}
      <section id="kamar-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-5 gap-2">
          <div>
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-widest block">
              PILIHAN KAMAR RESMI
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-semibold text-stone-900">
              Kamar Bersih, AC Dingin, Tanpa Wajib Buat Akun
            </h2>
          </div>
          <p className="text-xs text-stone-500">
            Semua kamar dilengkapi kasur empuk, AC dingin, dan penunjuk arah kiblat
          </p>
        </div>

        {/* List Kamar Berjejer Mobile-First */}
        <div className="space-y-4">
          
          {/* KAMAR 1: Deluxe Room */}
          <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs hover:border-emerald-300 transition-all">
            <div className="grid grid-cols-1 md:grid-cols-12 items-stretch">
              {/* Foto Kamar */}
              <div className="md:col-span-5 relative aspect-[4/3] md:aspect-auto overflow-hidden bg-stone-900">
                <img
                  src="/assets/putri-sari/3.jpg"
                  alt="Deluxe Room (King Size & Sofa)"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-emerald-900/90 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-xs">
                  Deluxe • Tersedia 5 Unit
                </span>
                <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded-md bg-black/60 text-white text-[10px]">
                  1 King Bed • 2 Tamu
                </span>
              </div>

              {/* Detail Kamar & Aksi */}
              <div className="md:col-span-7 p-5 sm:p-6 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-display font-bold text-lg sm:text-xl text-stone-900">
                        Deluxe Room (King Size & Sofa)
                      </h3>
                      <p className="text-xs text-emerald-800 font-semibold mt-0.5">
                        Ranjang King Size • AC Dingin • Water Heater • TV • Meja Rias • Lemari • Sofa
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold uppercase tracking-wider shrink-0">
                      5 Unit Kamar
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-stone-600 mt-2.5 leading-relaxed font-body">
                    Kamar Deluxe terluas dan terlengkap dengan kasur King Size empuk, penyejuk AC dingin, kamar mandi dengan water heater, TV, sofa santai, meja rias, serta lemari pakaian.
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {['AC Dingin', 'Water Heater', 'Ranjang King Size', 'TV', 'Meja Rias', 'Lemari', 'Sofa', 'Kamar Mandi Dalam', 'WiFi Gratis'].map((amen) => (
                      <span key={amen} className="inline-flex items-center gap-1 text-[11px] bg-stone-50 border border-stone-200/80 px-2.5 py-1 rounded-lg text-stone-700">
                        <Check className="w-3 h-3 text-emerald-700" />
                        {amen}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-stone-400 line-through block">Harga OTA: Rp 420.000</span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-bold text-stone-900">{formatIDR(350000)}</span>
                      <span className="text-xs text-stone-500 font-body">/ malam (Nett)</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => handleBookNow('deluxe')}
                      className="w-full sm:w-auto h-12 sm:h-11 px-6 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm shadow-sm"
                    >
                      Pesan Kamar Ini (Tanpa Akun)
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* KAMAR 2: Standard AC */}
          <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs hover:border-emerald-300 transition-all">
            <div className="grid grid-cols-1 md:grid-cols-12 items-stretch">
              {/* Foto Kamar */}
              <div className="md:col-span-5 relative aspect-[4/3] md:aspect-auto overflow-hidden bg-stone-900">
                <img
                  src="/assets/putri-sari/2.jpg"
                  alt="Standard AC (Queen Bed)"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-emerald-800/90 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-xs">
                  Standard AC • Tersedia 5 Unit
                </span>
                <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded-md bg-black/60 text-white text-[10px] flex items-center gap-1">
                  <Bath className="w-3 h-3 text-emerald-400" />
                  Toilet Duduk (Western)
                </span>
              </div>

              {/* Detail Kamar & Aksi */}
              <div className="md:col-span-7 p-5 sm:p-6 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-display font-bold text-lg sm:text-xl text-stone-900">
                        Standard AC
                      </h3>
                      <p className="text-xs text-emerald-800 font-semibold mt-0.5">
                        Ranjang Queen • Kamar Mandi Private Toilet Duduk (Western) • AC Dingin
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold uppercase tracking-wider shrink-0">
                      5 Unit Kamar
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-stone-600 mt-2.5 leading-relaxed font-body">
                    Kamar berpendingin AC sejuk dengan ranjang Queen Size yang nyaman, dilengkapi kamar mandi private dengan toilet duduk (western style) serta kebersihan terjaga.
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {['AC Dingin', 'Ranjang Queen', 'Kamar Mandi Private', 'Toilet Duduk (Western)', 'WiFi Cepat', 'Parkir Aman'].map((amen) => (
                      <span key={amen} className="inline-flex items-center gap-1 text-[11px] bg-stone-50 border border-stone-200/80 px-2.5 py-1 rounded-lg text-stone-700">
                        <Check className="w-3 h-3 text-emerald-700" />
                        {amen}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-stone-400 line-through block">Harga OTA: Rp 300.000</span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-bold text-stone-900">{formatIDR(250000)}</span>
                      <span className="text-xs text-stone-500 font-body">/ malam (Nett)</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => handleBookNow('standard_ac')}
                      className="w-full sm:w-auto h-12 sm:h-11 px-6 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm shadow-sm"
                    >
                      Pesan Kamar Ini (Tanpa Akun)
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* KAMAR 3: Fan Room / Kipas */}
          <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs hover:border-emerald-300 transition-all">
            <div className="grid grid-cols-1 md:grid-cols-12 items-stretch">
              <div className="md:col-span-5 relative aspect-[4/3] md:aspect-auto overflow-hidden bg-stone-900">
                <img
                  src="/assets/putri-sari/1.jpg"
                  alt="Fan Room / Kipas"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-stone-800/90 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-xs">
                  Fan Room • Tersedia 5 Unit
                </span>
                <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded-md bg-black/60 text-white text-[10px] flex items-center gap-1">
                  <Wind className="w-3 h-3 text-emerald-400" />
                  Kipas Angin & Toilet Jongkok
                </span>
              </div>
              <div className="md:col-span-7 p-5 sm:p-6 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-display font-bold text-lg sm:text-xl text-stone-900">
                        Fan Room / Kipas
                      </h3>
                      <p className="text-xs text-emerald-800 font-semibold mt-0.5">
                        Ranjang Queen • Kamar Mandi Private Indian • Toilet Jongkok • Kipas Angin
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold uppercase tracking-wider shrink-0">
                      5 Unit Kamar
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-600 mt-2.5 leading-relaxed font-body">
                    Pilihan hemat dengan ranjang Queen Size empuk, sirkulasi udara alami ditambah kipas angin, serta kamar mandi private bergaya Indian dengan toilet jongkok yang bersih.
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {['Kipas Angin (Fan)', 'Ranjang Queen Size', 'Kamar Mandi Private', 'Toilet Jongkok (Indian)', 'WiFi Cepat', 'Parkir Luas'].map((amen) => (
                      <span key={amen} className="inline-flex items-center gap-1 text-[11px] bg-stone-50 border border-stone-200/80 px-2.5 py-1 rounded-lg text-stone-700">
                        <Check className="w-3 h-3 text-emerald-700" />
                        {amen}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-stone-400 line-through block">Harga OTA: Rp 180.000</span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-bold text-stone-900">{formatIDR(150000)}</span>
                      <span className="text-xs text-stone-500 font-body">/ malam</span>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleBookNow('fan_room')}
                    className="w-full sm:w-auto h-12 sm:h-11 px-6 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm shadow-sm"
                  >
                    Pesan Kamar Ini
                  </Button>
                </div>
              </div>
            </div>
          </div>

        </div>

      </section>

      {/* 5. FAST BOOKING ENGINE (OPTIMIZED FOR TOUCH & MOBILE) */}
      <section id="booking-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-emerald-950 text-white p-5 sm:p-8 rounded-3xl shadow-xl border border-emerald-800/50">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 border-b border-emerald-800/80 pb-4">
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-emerald-400 block">
                Reservasi Mandiri Instan
              </span>
              <h2 className="font-display font-bold text-xl sm:text-2xl text-white mt-0.5">
                Pesan Langsung Tanpa Perlu Daftar Akun
              </h2>
            </div>
            <span className="text-xs text-emerald-300 font-body">
              ✓ E-voucher resmi langsung terbit setelah bayar
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
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
                className="bg-white text-stone-900 h-12 rounded-2xl text-sm"
              />
            </div>

            {/* Check-Out */}
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-emerald-200 font-semibold mb-1.5">
                Tanggal Check-Out ({nights} Malam)
              </label>
              <Input
                type="date"
                value={checkOut}
                min={checkIn || todayStr}
                onChange={(e) => setCheckOut(e.target.value)}
                className="bg-white text-stone-900 h-12 rounded-2xl text-sm"
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
                className="w-full h-12 rounded-2xl border border-stone-200 bg-white px-3 font-body text-xs text-stone-900 font-semibold focus:ring-2 focus:ring-emerald-400"
              >
                {stay.room_types?.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} — {formatIDR(r.price)}
                  </option>
                ))}
              </select>
            </div>

            {/* Tombol Lanjut */}
            <div className="flex flex-col justify-end">
              <Button
                onClick={() => handleBookNow(selectedRoomId)}
                className="w-full h-12 bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-bold rounded-2xl text-sm flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Lanjut Checkout ({formatIDR(totalPrice)})</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

          </div>

          <p className="text-[11px] text-emerald-300/80 mt-4 text-center sm:text-left">
            Didukung pembayaran digital resmi: QRIS (Semua Bank & E-Wallet), Virtual Account BCA/BRI/Mandiri, dan Transfer Bank.
          </p>

        </div>
      </section>

      {/* 6. LOKASI STRATEGIS & AKSES PANTAI KUMALA */}
      <section id="lokasi-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-3xl p-5 sm:p-8 border border-stone-200 shadow-2xs">
          
          <div className="max-w-3xl mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold tracking-wider uppercase mb-2">
              <Waves className="w-4 h-4 text-emerald-800" />
              Akses Tepi Laut Pelabuhan Ratu
            </span>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-stone-900">
              Lokasi Tepat di Seberang Pantai Kumala
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
              Tinggal melangkah keluar dari pagar hotel dan menyeberang jalan raya, Anda sudah langsung menginjakkan kaki di Pantai Kumala. Suara deburan ombak dan angin laut sejuk terasa langsung dari area hotel.
            </p>
          </div>

          {/* Grid Akses Dekat */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800 font-bold text-xs shrink-0">
                0m
              </div>
              <div>
                <span className="font-bold text-xs text-stone-900 block">Pantai Kumala</span>
                <span className="text-[11px] text-stone-500">Tepat di seberang gerbang</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800 font-bold text-xs shrink-0">
                5 mnt
              </div>
              <div>
                <span className="font-bold text-xs text-stone-900 block">Dermaga Pelabuhan Ratu</span>
                <span className="text-[11px] text-stone-500">Pusat lelang ikan segar</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800 font-bold text-xs shrink-0">
                8 mnt
              </div>
              <div>
                <span className="font-bold text-xs text-stone-900 block">Pantai Citepus</span>
                <span className="text-[11px] text-stone-500">Wisata kuliner & sunset</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800 font-bold text-xs shrink-0">
                25 mnt
              </div>
              <div>
                <span className="font-bold text-xs text-stone-900 block">Geopark Ciletuh</span>
                <span className="text-[11px] text-stone-500">Situs geopark UNESCO</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-emerald-950">Alamat Lengkap:</p>
              <p className="text-xs text-emerald-900">
                Jl. Raya Cisolok, Depan Pantai Kumala, Pelabuhan Ratu, Kabupaten Sukabumi, Jawa Barat 43364
              </p>
            </div>
            <a
              href="https://maps.google.com/?q=Hotel+Putri+Sari+Pelabuhan+Ratu"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold shrink-0 transition-colors shadow-2xs"
            >
              <Compass className="w-4 h-4" />
              <span>Buka Petunjuk Arah Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>
      </section>

      {/* 7. FASILITAS LENGKAP */}
      <section id="fasilitas-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-3xl p-5 sm:p-8 border border-stone-200 shadow-2xs space-y-6">
          <div>
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-widest block">
              KENYAMANAN MENGINAP
            </span>
            <h2 className="text-2xl font-display font-semibold text-stone-900">
              Fasilitas Terawat di Hotel Putri Sari
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-body text-stone-700">
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
              <Compass className="w-6 h-6 text-emerald-700" />
              <h4 className="font-bold text-stone-900 text-sm">Arah Kiblat Terpasang</h4>
              <p className="text-stone-500 text-[11px]">Setiap kamar memiliki stiker arah kiblat jelas di plafon kamar.</p>
            </div>
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
              <Wind className="w-6 h-6 text-emerald-700" />
              <h4 className="font-bold text-stone-900 text-sm">AC Dingin Terawat</h4>
              <p className="text-stone-500 text-[11px]">Pendingin ruangan dibersihkan rutin untuk udara sejuk dan segar.</p>
            </div>
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
              <Car className="w-6 h-6 text-emerald-700" />
              <h4 className="font-bold text-stone-900 text-sm">Parkir Mobil Aman</h4>
              <p className="text-stone-500 text-[11px]">Halaman dalam berpagar untuk kendaraan roda 4 maupun rombongan motor.</p>
            </div>
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
              <Clock className="w-6 h-6 text-emerald-700" />
              <h4 className="font-bold text-stone-900 text-sm">Resepsionis Siap Bantu</h4>
              <p className="text-stone-500 text-[11px]">Staf ramah siap membantu check-in dan kebutuhan menginap Anda.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. MOBILE FLOATING STICKY BOOKING BAR (Layoutmobile Rule: Never covers content, compact) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 shadow-xl px-4 py-3 sm:hidden">
        <div className="flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-stone-500 block">Tarif Mulai</span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-stone-900">{formatIDR(285000)}</span>
              <span className="text-[10px] text-stone-500">/malam</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={waReceptionUrl}
              target="_blank"
              rel="noreferrer"
              className="p-3 rounded-2xl bg-emerald-50 text-emerald-900 border border-emerald-300"
              title="Chat Resepsionis"
            >
              <MessageCircle className="w-5 h-5 text-emerald-700" />
            </a>

            <Button
              onClick={() => handleBookNow(selectedRoomId)}
              className="h-11 px-5 rounded-2xl bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
            >
              <span>Pesan Kamar</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* 9. LIGHTBOX GALERI FOTO LENGKAP (6 FOTO) */}
      {isGalleryOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-between p-4 backdrop-blur-md animate-in fade-in">
          
          {/* Top Bar Modal */}
          <div className="w-full max-w-4xl flex items-center justify-between text-white pb-3 border-b border-white/10">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400">
                Foto {activePhotoIdx + 1} dari {galleryPhotos.length}
              </span>
              <h4 className="font-semibold text-sm truncate max-w-[260px] sm:max-w-md">
                {galleryPhotos[activePhotoIdx].title}
              </h4>
            </div>

            <button
              onClick={() => setIsGalleryOpen(false)}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Tutup Galeri"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Active Image with Mobile Touch Friendly Navigation */}
          <div className="relative w-full max-w-4xl flex-1 flex items-center justify-center my-2">
            <img
              src={galleryPhotos[activePhotoIdx].src}
              alt={galleryPhotos[activePhotoIdx].title}
              className="max-h-[65vh] w-auto max-w-full object-contain rounded-2xl"
            />

            <button
              onClick={() =>
                setActivePhotoIdx((prev) => (prev > 0 ? prev - 1 : galleryPhotos.length - 1))
              }
              className="absolute left-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 text-white hover:bg-black/90 transition-all border border-white/20"
              aria-label="Foto Sebelumnya"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() =>
                setActivePhotoIdx((prev) => (prev < galleryPhotos.length - 1 ? prev + 1 : 0))
              }
              className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 text-white hover:bg-black/90 transition-all border border-white/20"
              aria-label="Foto Selanjutnya"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Bottom Thumbnails */}
          <div className="w-full max-w-4xl overflow-x-auto no-scrollbar py-2 flex items-center justify-center gap-2">
            {galleryPhotos.map((photo, idx) => (
              <button
                key={photo.src}
                onClick={() => setActivePhotoIdx(idx)}
                className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                  activePhotoIdx === idx ? 'border-emerald-400 scale-105' : 'border-white/20 opacity-50'
                }`}
              >
                <img src={photo.src} alt={photo.title} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

        </div>
      )}

      {/* 10. MODAL CEK E-VOUCHER (MOBILE FRIENDLY) */}
      {isVoucherModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl max-w-md w-full overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2 text-emerald-950">
                <FileCheck className="w-5 h-5 text-emerald-700" />
                <h3 className="font-display font-bold text-lg text-stone-900">
                  Cek E-Voucher Hotel Putri Sari
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsVoucherModalOpen(false);
                  setSearchedBooking(null);
                  setVoucherError('');
                }}
                className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCheckVoucher} className="space-y-3">
              <label className="block text-xs font-semibold text-stone-600">
                Masukkan Kode Booking (Contoh: JP-XXXXXX) atau Nomor WhatsApp:
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  value={voucherCodeInput}
                  onChange={(e) => setVoucherCodeInput(e.target.value)}
                  placeholder="Contoh: JP-982103 atau 0812xxxx"
                  className="h-11 rounded-xl text-sm"
                  required
                />
                <Button type="submit" className="h-11 bg-emerald-800 hover:bg-emerald-900 text-white font-bold shrink-0 rounded-xl">
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
                  <span className="font-bold text-emerald-950">Kode: {searchedBooking.booking_code}</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 text-[10px] font-bold uppercase">
                    {searchedBooking.payment_status === 'dibayar' ? 'Lunas ✓' : 'Dikonfirmasi'}
                  </span>
                </div>
                <div className="text-xs font-body text-stone-800 space-y-1">
                  <p><strong>Nama Tamu:</strong> {searchedBooking.guest_name}</p>
                  <p><strong>Tipe Kamar:</strong> {searchedBooking.room_type} ({searchedBooking.room_count || 1} Kamar)</p>
                  <p><strong>Jadwal:</strong> {formatDate(searchedBooking.check_in)} s/d {formatDate(searchedBooking.check_out)}</p>
                  <p><strong>Total:</strong> {formatIDR(searchedBooking.total_price)}</p>
                </div>
                <div className="pt-2">
                  <Link
                    to={`/konfirmasi/${searchedBooking.booking_code}`}
                    className="block text-center py-2.5 rounded-xl bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-900 transition-colors"
                  >
                    Buka Faktur & E-Voucher Lengkap
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FOOTER */}
      <SiteFooter />
    </div>
  );
}

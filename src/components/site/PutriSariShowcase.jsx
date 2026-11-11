import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Star,
  CheckCircle2,
  ExternalLink,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  Compass,
  Wind,
  BedDouble,
  Car,
  Camera,
  X,
  Phone,
  Sparkles,
  Check,
} from 'lucide-react';
import { formatIDR } from '../../lib/format';
import { stays } from '../../data/stays';

export default function PutriSariShowcase() {
  const [activePhotoIdx, setActivePhotoIdx] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState('deluxe');

  // Ambil data Hotel Putri Sari dari database stays
  const stay = stays.find((s) => s.id === 1 || s.slug === 'jajapin-hotel-putri-sari') || stays[0];

  const photos = [
    {
      src: '/assets/putri-sari/cover.jpg',
      label: 'Gerbang Depan Asli',
      caption: 'Papan nama kayu Hotel Putri Sari dan gerbang masuk berpagar hijau di pinggir jalan raya pantai.',
    },
    {
      src: '/assets/putri-sari/3.jpg',
      label: 'Deluxe King (Kasur Hijau)',
      caption: 'Kamar luas dengan kasur King Size bersprei hijau, AC dingin, dan lemari pakaian geser 3 pintu.',
    },
    {
      src: '/assets/putri-sari/2.jpg',
      label: 'Standard Balkon (Kasur Oranye)',
      caption: 'Kamar berpintu balkon menghadap pepohonan asri dengan stiker penunjuk arah kiblat di plafon.',
    },
    {
      src: '/assets/putri-sari/4.jpg',
      label: 'Double Bed Standard AC',
      caption: 'Tempat tidur ganda higienis berpendingin AC yang cocok untuk 2 orang tamu.',
    },
    {
      src: '/assets/putri-sari/1.jpg',
      label: 'Single Bed Standard',
      caption: 'Kamar tenang dan nyaman untuk solo traveler atau pelancong santai.',
    },
  ];

  const rooms = [
    {
      id: 'deluxe',
      name: 'Deluxe Room',
      image: '/assets/putri-sari/3.jpg',
      price: 350000,
      otaPrice: 420000,
      bed: '1 Ranjang King Size',
      capacity: '2 Tamu',
      badge: 'Fasilitas Terlengkap (5 Unit)',
      features: [
        'AC Dingin',
        'Water Heater',
        'Ranjang King Size',
        'TV & Sofa Santai',
        'Meja Rias & Lemari',
        'Kamar Mandi Dalam',
      ],
    },
    {
      id: 'standard_ac',
      name: 'Standard AC',
      image: '/assets/putri-sari/2.jpg',
      price: 250000,
      otaPrice: 300000,
      bed: '1 Ranjang Queen Size',
      capacity: '2 Tamu',
      badge: 'Standard AC Nyaman (5 Unit)',
      features: [
        'AC Dingin',
        'Ranjang Queen Size',
        'Kamar Mandi Private',
        'Toilet Duduk (Western)',
        'WiFi Cepat',
      ],
    },
    {
      id: 'fan_room',
      name: 'Fan Room / Kipas',
      image: '/assets/putri-sari/1.jpg',
      price: 150000,
      otaPrice: 180000,
      bed: '1 Ranjang Queen Size',
      capacity: '2 Tamu',
      badge: 'Paling Hemat & Asri (5 Unit)',
      features: [
        'Kipas Angin (Fan)',
        'Ranjang Queen Size',
        'Kamar Mandi Private (Indian Style)',
        'Toilet Jongkok',
        'WiFi Cepat',
      ],
    },
  ];

  const activeRoomData = rooms.find((r) => r.id === selectedRoom) || rooms[0];

  return (
    <section className="relative bg-gradient-to-b from-stone-50 via-white to-stone-100/60 py-20 lg:py-28 border-y border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Network Connector Banner: jajapin.id <-> putrisari.jajapin.id */}
        <div className="mb-10 p-4 sm:p-5 rounded-2xl bg-emerald-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg border border-emerald-800/40">
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <div>
              <p className="text-xs font-semibold tracking-wide text-emerald-300 uppercase">
                Properti Unggulan Jajapin Network
              </p>
              <h3 className="text-sm sm:text-base font-medium text-white">
                Terhubung Resmi dengan Subdomain{' '}
                <a
                  href="https://putrisari.jajapin.id"
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono underline text-emerald-300 hover:text-white"
                >
                  putrisari.jajapin.id
                </a>
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/putrisari"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold tracking-wide transition-colors inline-flex items-center gap-1.5 shadow-sm"
            >
              Buka Halaman Lengkap Putri Sari <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Section Header with Human Voice Copy */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-900 border border-emerald-200 text-xs font-semibold mb-4">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>Mitra Terverifikasi & Listing Nyata</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-light text-stone-900 tracking-tight leading-[1.15] mb-4">
            Hotel Putri Sari — Istirahat tenang di depan <span className="font-semibold text-emerald-800">Pantai Kumala</span> Pelabuhan Ratu.
          </h2>
          <p className="text-base sm:text-lg font-body text-stone-600 leading-relaxed">
            Posisinya pas di seberang Pantai Kumala, Jl. Raya Cisolok. Jalan kaki kurang dari semenit, kaki Anda sudah menyentuh pasir laut. Kamarnya bersih, kasurnya empuk, AC dingin, dan penunjuk arah kiblat terpasang rapi di plafon kamar.
          </p>
        </div>

        {/* Two-Column Editorial Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (5 Cols): Real Photo Card & Property Facts */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative group overflow-hidden rounded-3xl bg-stone-900 shadow-md border border-stone-200/80">
              <img
                src={photos[0].src}
                alt="Gerbang Depan Hotel Putri Sari"
                className="w-full aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-medium border border-white/20 inline-flex items-center gap-1.5">
                  <Camera className="w-3 h-3 text-emerald-400" />
                  Foto Gerbang Asli
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="flex items-center gap-1.5 text-amber-400 mb-1 text-sm font-semibold">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>4.9 / 5.0</span>
                  <span className="text-white/70 font-normal text-xs">(128 Ulasan Tamu Riil)</span>
                </div>
                <h4 className="text-lg font-display font-semibold text-white">
                  Hotel Putri Sari, Pelabuhan Ratu
                </h4>
                <p className="text-xs text-white/80 font-body flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Jl. Raya Cisolok, Depan Pantai Kumala, Sukabumi</span>
                </p>
              </div>
            </div>

            {/* Quick Photo Thumbnails */}
            <div>
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
                Foto Kamar & Fasilitas Riil (Klik untuk perbesar)
              </p>
              <div className="grid grid-cols-4 gap-2">
                {photos.slice(1, 5).map((p, idx) => (
                  <button
                    key={p.src}
                    type="button"
                    onClick={() => setActivePhotoIdx(idx + 1)}
                    className="relative rounded-xl overflow-hidden aspect-[4/3] border border-stone-200 hover:border-emerald-700 hover:ring-2 hover:ring-emerald-700/20 transition-all group"
                  >
                    <img src={p.src} alt={p.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <span className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                  </button>
                ))}
              </div>
            </div>

            {/* Practical Hospitality Highlights */}
            <div className="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-2xs space-y-3">
              <h5 className="text-xs font-semibold uppercase tracking-wider text-stone-800">
                Kenyamanan yang Dijamin di Sini
              </h5>
              <div className="grid grid-cols-2 gap-3 text-xs font-body text-stone-700">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Arah Kiblat di Plafon</span>
                </div>
                <div className="flex items-center gap-2">
                  <Wind className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>AC Dingin & Terawat</span>
                </div>
                <div className="flex items-center gap-2">
                  <BedDouble className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Kasur Springbed Empuk</span>
                </div>
                <div className="flex items-center gap-2">
                  <Car className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Parkir Mobil Dalam Pagar</span>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <span className="text-xs text-stone-500">Butuh info kamar mendadak?</span>
                <a
                  href="https://wa.me/628581415730?text=Halo%20Resepsionis%20Hotel%20Putri%20Sari,%20saya%20mau%20tanya%20ketersediaan%20kamar"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-950 underline"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-700" />
                  Chat Resepsionis
                </a>
              </div>
            </div>

          </div>

          {/* Right Column (7 Cols): Direct Room Selection & Instant Booking */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-stone-100 gap-2">
              <div>
                <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-widest">
                  Pesan Langsung Tanpa Wajib Buat Akun
                </span>
                <h3 className="text-xl sm:text-2xl font-display font-semibold text-stone-900">
                  Pilih Tipe Kamar Hotel Putri Sari
                </h3>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-[10px] text-stone-400 block line-through">Harga di OTA: Rp 350.000 - Rp 420.000</span>
                <span className="text-sm font-semibold text-emerald-700">Mulai {formatIDR(285000)} / malam</span>
              </div>
            </div>

            {/* Room Selector Toggle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {rooms.map((room) => {
                const isSelected = selectedRoom === room.id;
                return (
                  <button
                    key={room.id}
                    type="button"
                    onClick={() => setSelectedRoom(room.id)}
                    className={`text-left p-4 rounded-2xl border transition-all relative ${
                      isSelected
                        ? 'border-emerald-700 bg-emerald-50/50 ring-2 ring-emerald-700/15 shadow-2xs'
                        : 'border-stone-200 hover:border-stone-300 bg-stone-50/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        isSelected ? 'bg-emerald-700 text-white' : 'bg-stone-200 text-stone-700'
                      }`}>
                        {room.badge}
                      </span>
                      {isSelected && <Check className="w-4 h-4 text-emerald-700" />}
                    </div>

                    <h4 className="font-semibold text-stone-900 text-sm mb-1">{room.name}</h4>
                    <p className="text-xs text-stone-500 font-body mb-3">{room.bed} • {room.capacity}</p>

                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-stone-900">{formatIDR(room.price)}</span>
                      <span className="text-xs text-stone-400 line-through">{formatIDR(room.otaPrice)}</span>
                      <span className="text-[10px] text-stone-500">/ malam</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Room Details Preview */}
            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <img
                  src={activeRoomData.image}
                  alt={activeRoomData.name}
                  className="w-full sm:w-36 aspect-[4/3] rounded-xl object-cover border border-stone-200 shrink-0"
                />
                <div className="space-y-2 flex-1">
                  <h4 className="text-base font-semibold text-stone-900">{activeRoomData.name}</h4>
                  <p className="text-xs text-stone-600 font-body">
                    Pilihan ideal untuk Anda yang mengutamakan tidur nyenyak, kasur higienis, dan suasana yang tenang di Pelabuhan Ratu.
                  </p>
                  
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {activeRoomData.features.map((feat) => (
                      <span
                        key={feat}
                        className="inline-flex items-center gap-1 text-[11px] bg-white px-2.5 py-1 rounded-md border border-stone-200/90 text-stone-700 font-medium"
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Direct Instant Action Bar */}
              <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] text-stone-500 block">Total Tarif Resmi Langsung:</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-bold text-stone-900">{formatIDR(activeRoomData.price)}</span>
                    <span className="text-xs text-stone-500">/ malam (Nett, tanpa markup)</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <Link
                    to={`/pesan/jajapin-hotel-putri-sari?room=${activeRoomData.id}`}
                    className="px-6 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-sm tracking-wide transition-all shadow-sm text-center inline-flex items-center justify-center gap-2"
                  >
                    <span>Pesan Kamar Ini Sekarang</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

            </div>

            {/* Frictionless Guarantee Footer */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-[11px] text-stone-500 font-body">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Tanpa wajib login atau buat akun</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>E-voucher resmi langsung terbit</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Bayar aman: QRIS, VA, & Transfer</span>
              </div>
            </div>

          </div>

        </div>

        {/* Dedicated Subdomain Footer Strip */}
        <div className="mt-12 p-6 rounded-3xl bg-white border border-stone-200 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xs">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 text-emerald-700" />
            </div>
            <div>
              <h4 className="text-base font-semibold text-stone-900">
                Punya akses ke putrisari.jajapin.id?
              </h4>
              <p className="text-xs text-stone-600 font-body">
                Website mandiri Hotel Putri Sari terhubung langsung ke mesin booking dan sistem manajemen Jajapin. Ketersediaan kamar dan harga selalu terbarui secara real-time.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/putrisari"
              className="px-5 py-2.5 rounded-xl border border-stone-300 hover:border-stone-400 text-stone-800 text-xs font-semibold transition-colors"
            >
              Lihat Halaman Hotel
            </Link>
            <a
              href="https://putrisari.jajapin.id"
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold transition-colors inline-flex items-center gap-1.5"
            >
              Kunjungi putrisari.jajapin.id <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
            </a>
          </div>
        </div>

      </div>

      {/* Lightbox Photo Modal */}
      {activePhotoIdx !== null && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-4xl w-full bg-stone-950 rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-white/10 text-white">
              <div>
                <h4 className="font-semibold text-sm">{photos[activePhotoIdx].label}</h4>
                <p className="text-xs text-white/60">{photos[activePhotoIdx].caption}</p>
              </div>
              <button
                type="button"
                onClick={() => setActivePhotoIdx(null)}
                className="p-2 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 flex items-center justify-center">
              <img
                src={photos[activePhotoIdx].src}
                alt={photos[activePhotoIdx].label}
                className="max-h-[70vh] w-auto object-contain rounded-xl"
              />
            </div>
            <div className="p-4 border-t border-white/10 flex justify-between items-center text-xs text-white/60">
              <span>Foto {activePhotoIdx + 1} dari {photos.length}</span>
              <button
                type="button"
                onClick={() => setActivePhotoIdx(null)}
                className="text-emerald-400 hover:underline"
              >
                Tutup Galeri
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

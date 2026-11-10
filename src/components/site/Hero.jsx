import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { siteMedia } from '../../data/siteMedia';
import SearchBar from './SearchBar';

export default function Hero() {
  return (
    <section className="relative min-h-[92vh] lg:min-h-screen flex items-center">
      {/* Background image */}
      <div className="absolute inset-0">
        <img src={siteMedia.hero} alt="Pesona Indonesia" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-forest-deep/85 via-brand-forest/65 to-brand-forest-deep/95" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 w-full">
        <div className="max-w-3xl">
          {/* Neutral Brand Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-brand-lime text-xs font-semibold mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-brand-lime" />
            <span>Platform Resmi Booking Hotel & Penginapan Nusantara</span>
          </div>

          <p className="text-[10px] uppercase tracking-[0.28em] font-body font-semibold text-brand-lime/90 mb-3">
            Jalan Jalan Pesona Indonesia • jajapin.id
          </p>

          <h1 className="font-display font-light text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.1] mb-6">
            Menginap di jantung<br />pesona <em className="text-brand-lime italic">Indonesia.</em>
          </h1>

          <p className="font-body text-base sm:text-lg text-white/85 leading-relaxed max-w-2xl mb-8">
            Pesan kamar hotel, homestay, dan villa langsung ke pengelolanya tanpa perantara berbelit. Tarif jujur tanpa markup tersembunyi, dan bisa pesan langsung tanpa perlu registrasi akun.
          </p>

          {/* Key Facts */}
          <div className="flex flex-wrap items-center gap-6 sm:gap-10 mb-10 text-white/80 text-xs sm:text-sm font-body">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-lime" />
              <span>Harga Asli Pengelola</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-lime" />
              <span>Bisa Booking Tanpa Akun</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-lime" />
              <span>Konfirmasi Resepsionis Asli</span>
            </div>
          </div>
        </div>

        {/* Kolom Pencarian Netral */}
        <SearchBar />

        <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-6">
          <a
            href="#destinasi"
            className="text-xs sm:text-sm font-body text-white/80 hover:text-white transition-colors underline underline-offset-4"
          >
            Jelajahi destinasi populer →
          </a>
          <span className="text-white/30 hidden sm:inline">•</span>
          <Link
            to="/stays"
            className="text-xs sm:text-sm font-body text-brand-lime hover:text-white transition-colors underline underline-offset-4"
          >
            Lihat semua pilihan penginapan nusantara →
          </Link>
        </div>
      </div>
    </section>
  );
}

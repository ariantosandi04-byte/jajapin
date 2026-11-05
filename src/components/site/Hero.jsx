import { siteMedia } from '../../data/siteMedia';
import SearchBar from './SearchBar';

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] lg:min-h-screen flex items-center">
      {/* Background image */}
      <div className="absolute inset-0">
        <img src={siteMedia.hero} alt="Sawah Indonesia" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-forest-deep/80 via-brand-forest/60 to-brand-forest-deep/90" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 w-full">
        <div className="max-w-3xl">
          <p className="text-[10px] uppercase tracking-[0.28em] font-body font-semibold text-brand-lime mb-6">
            Jalan Jalan Pesona Indonesia
          </p>
          <h1 className="font-display font-light text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.1] mb-6">
            Menginap di jantung<br />pesona <em className="text-brand-lime italic">Indonesia.</em>
          </h1>
          <p className="font-body text-base sm:text-lg text-white/80 leading-relaxed max-w-xl mb-10">
            Hotel, villa, dan homestay pilihan dari Sabang sampai Merauke — dipesan langsung ke pengelolanya, dengan harga yang jujur.
          </p>

          {/* Stats */}
          <div className="flex gap-10 mb-12">
            <div>
              <span className="block font-display font-semibold text-2xl text-white">{siteMedia.stats.properties}</span>
              <span className="text-[10px] uppercase tracking-[0.2em] font-body text-white/50">Penginapan terkurasi</span>
            </div>
            <div>
              <span className="block font-display font-semibold text-2xl text-white">{siteMedia.stats.provinces}</span>
              <span className="text-[10px] uppercase tracking-[0.2em] font-body text-white/50">Provinsi</span>
            </div>
            <div>
              <span className="block font-display font-semibold text-2xl text-white">{siteMedia.stats.avgRating}</span>
              <span className="text-[10px] uppercase tracking-[0.2em] font-body text-white/50">Rata-rata ulasan</span>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <SearchBar />

        <a href="#destinasi" className="inline-block mt-6 text-sm font-body text-white/60 hover:text-white transition-colors underline underline-offset-4">
          Lihat destinasi populer ↓
        </a>
      </div>
    </section>
  );
}

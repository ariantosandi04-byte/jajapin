import { Link } from 'react-router-dom';
import { siteMedia } from '../../data/siteMedia';

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand-forest-deep text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src={siteMedia.logo} alt="Jajapin" className="w-10 h-10 rounded-full object-cover" />
              <div>
                <span className="font-display font-semibold text-lg">Jajapin</span>
                <span className="block text-[9px] uppercase tracking-[0.28em] text-white/60">Pesona Indonesia</span>
              </div>
            </div>
            <p className="text-sm text-white/60 font-body leading-relaxed max-w-xs">
              Platform pemesanan penginapan pilihan dari Sabang sampai Merauke — langsung ke pengelolanya, dengan harga yang jujur.
            </p>
          </div>

          {/* Jelajahi */}
          <div>
            <h4 className="text-[11px] uppercase tracking-[0.24em] font-body font-semibold text-white/40 mb-4">Jelajahi</h4>
            <nav className="flex flex-col gap-3">
              <Link to="/stays" className="text-sm font-body text-white/70 hover:text-white transition-colors">Semua penginapan</Link>
              <Link to="/bookings" className="text-sm font-body text-white/70 hover:text-white transition-colors">Booking saya</Link>
              <Link to="/#destinasi" className="text-sm font-body text-white/70 hover:text-white transition-colors">Destinasi populer</Link>
              <Link to="/#cara-kerja" className="text-sm font-body text-white/70 hover:text-white transition-colors">Cara booking</Link>
            </nav>
          </div>

          {/* Hubungi */}
          <div>
            <h4 className="text-[11px] uppercase tracking-[0.24em] font-body font-semibold text-white/40 mb-4">Hubungi Kami</h4>
            <div className="flex flex-col gap-3">
              <a href="mailto:halo@jajapin.id" className="text-sm font-body text-white/70 hover:text-white transition-colors">halo@jajapin.id</a>
              <p className="text-sm font-body text-white/70">Jakarta, Indonesia</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-xs text-white/40 font-body text-center">
            © {year} Jajapin — Jalan Jalan Pesona Indonesia. Hak cipta dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
}

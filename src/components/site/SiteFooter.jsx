import { Link } from 'react-router-dom';
import { siteMedia } from '../../data/siteMedia';
import { ShieldCheck, Phone, Mail, MapPin, CreditCard } from 'lucide-react';

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand-forest-deep text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img src={siteMedia.logo} alt="Jajapin" className="w-10 h-10 rounded-full object-cover" />
              <div>
                <span className="font-display font-semibold text-lg">Jajapin</span>
                <span className="block text-[9px] uppercase tracking-[0.28em] text-white/60">Pesona Indonesia</span>
              </div>
            </div>
            <p className="text-xs text-white/70 font-body leading-relaxed">
              Platform pemesanan hotel, homestay, villa, dan resort pilihan nusantara — langsung ke pengelolanya, dengan harga jujur tanpa markup tersembunyi.
            </p>
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2 text-[11px] text-white/60 font-body">
              <ShieldCheck className="w-4 h-4 text-brand-lime" />
              <span>Payment Gateway Berizin Resmi BI</span>
            </div>
          </div>

          {/* Jelajahi */}
          <div>
            <h4 className="text-[11px] uppercase tracking-[0.24em] font-body font-semibold text-white/40 mb-4">Jelajahi</h4>
            <nav className="flex flex-col gap-2.5">
              <Link to="/putrisari" className="text-xs font-body text-brand-lime hover:text-white font-semibold transition-colors flex items-center gap-1">
                ★ Hotel Putri Sari (Pelabuhan Ratu)
              </Link>
              <a href="https://putrisari.jajapin.id" target="_blank" rel="noreferrer" className="text-[11px] font-mono text-white/60 hover:text-white transition-colors">
                putrisari.jajapin.id ↗
              </a>
              <Link to="/stays" className="text-xs font-body text-white/70 hover:text-white transition-colors">Semua Penginapan</Link>
              <Link to="/bookings" className="text-xs font-body text-white/70 hover:text-white transition-colors">Booking Saya</Link>
              <Link to="/#destinasi" className="text-xs font-body text-white/70 hover:text-white transition-colors">Destinasi Populer</Link>
              <Link to="/#cara-kerja" className="text-xs font-body text-white/70 hover:text-white transition-colors">Cara Booking</Link>
            </nav>
          </div>

          {/* Legalitas & Kepatuhan */}
          <div>
            <h4 className="text-[11px] uppercase tracking-[0.24em] font-body font-semibold text-brand-lime mb-4">Kebijakan & Legal</h4>
            <nav className="flex flex-col gap-2.5">
              <Link to="/terms" className="text-xs font-body text-white/80 hover:text-white transition-colors">
                Syarat & Ketentuan Layanan
              </Link>
              <Link to="/privacy" className="text-xs font-body text-white/80 hover:text-white transition-colors">
                Kebijakan Privasi
              </Link>
              <Link to="/refund-policy" className="text-xs font-body text-white/80 hover:text-white transition-colors">
                Kebijakan Refund & Pembatalan
              </Link>
              <div className="pt-2 text-[11px] text-white/50 space-y-1">
                <p>Didukung Pembayaran Digital:</p>
                <p className="font-semibold text-white/70">Midtrans • QRIS • Virtual Account • Tunai</p>
              </div>
            </nav>
          </div>

          {/* Hubungi Kami */}
          <div>
            <h4 className="text-[11px] uppercase tracking-[0.24em] font-body font-semibold text-white/40 mb-4">Layanan Bantuan</h4>
            <div className="flex flex-col gap-2.5 text-xs font-body text-white/70">
              <a href="mailto:halo@jajapin.id" className="hover:text-white flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-brand-lime" /> halo@jajapin.id
              </a>
              <a href="https://wa.me/628581415730" target="_blank" rel="noreferrer" className="hover:text-white flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-brand-lime" /> +62 858-1415-730
              </a>
              <p className="flex items-start gap-2 pt-1">
                <MapPin className="w-3.5 h-3.5 text-brand-lime shrink-0 mt-0.5" />
                <span>PT Jalan Jalan Pesona Indonesia, Jakarta & Pelabuhan Ratu</span>
              </p>
              <p className="text-[10px] text-white/50 pt-1">
                Jam Operasional CS: 08:00 - 22:00 WIB
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/50 font-body">
          <p>© {year} Jajapin — PT Jalan Jalan Pesona Indonesia. Hak cipta dilindungi.</p>
          <div className="flex items-center gap-4">
            <Link to="/terms" className="hover:text-white">Ketentuan</Link>
            <span>•</span>
            <Link to="/privacy" className="hover:text-white">Privasi</Link>
            <span>•</span>
            <Link to="/refund-policy" className="hover:text-white">Refund</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

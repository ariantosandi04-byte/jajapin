import { Link } from 'react-router-dom';
import { destinations } from '../../data/destinations';
import { MapPin } from 'lucide-react';

export default function DestinationStrip() {
  return (
    <section id="destinasi" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] font-body font-semibold text-primary mb-2">
            Jaringan Properti Jajapin
          </p>
          <h2 className="font-display font-light text-3xl sm:text-4xl tracking-tight text-foreground">
            Destinasi Terverifikasi di Google & OTA
          </h2>
        </div>
        <Link
          to="/stays"
          className="text-xs font-body font-semibold text-primary hover:underline flex items-center gap-1"
        >
          Lihat Semua 15 Penginapan →
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {destinations.map((dest) => (
          <Link
            key={dest.name}
            to={`/stays?city=${encodeURIComponent(dest.slug)}`}
            className="group relative overflow-hidden rounded-3xl aspect-[4/5] bg-muted shadow-sm hover:shadow-md transition-all"
          >
            <img
              src={dest.image}
              alt={dest.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-600/90 text-white inline-block mb-1">
                {dest.propertyCount}
              </span>
              <h3 className="font-display font-semibold text-base sm:text-lg leading-tight text-white group-hover:text-brand-lime transition-colors">
                {dest.name}
              </h3>
              <p className="text-[11px] text-white/70 font-body flex items-center gap-0.5 mt-0.5">
                <MapPin className="w-3 h-3 text-brand-lime shrink-0" />
                <span className="truncate">{dest.province}</span>
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

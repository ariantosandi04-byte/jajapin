import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';

export default function NearbySearch() {
  const [area, setArea] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (area.trim()) navigate(`/stays?area=${encodeURIComponent(area)}`);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-brand-forest rounded-[2rem] p-8 lg:p-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="font-display font-light text-2xl sm:text-3xl text-white tracking-tight mb-2">Di sekitar Anda</h2>
          <p className="font-body text-white/60 text-sm mb-6">Masukkan lokasi tempat Anda berada</p>
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="Contoh: Canggu, Ubud, Jakarta Selatan"
                className="w-full h-11 pl-10 pr-4 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-lime/40"
                aria-label="Masukkan lokasi"
              />
            </div>
            <Button type="submit" variant="lime" className="shrink-0">Cari</Button>
          </form>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <h3 className="font-display font-semibold text-lg text-white mb-2">Punya penginapan?</h3>
          <p className="font-body text-sm text-white/60 mb-4">Gabung sebagai mitra Jajapin dan jangkau lebih banyak tamu.</p>
          <a href="mailto:halo@jajapin.id?subject=Gabung Jajapin">
            <Button variant="lime">
              Become a partner <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}

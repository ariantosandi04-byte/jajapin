import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import SiteHeader from '../components/site/SiteHeader';
import SiteFooter from '../components/site/SiteFooter';
import Hero from '../components/site/Hero';
import PutriSariShowcase from '../components/site/PutriSariShowcase';
import DestinationStrip from '../components/site/DestinationStrip';
import WhyJajapin from '../components/site/WhyJajapin';
import HowItWorks from '../components/site/HowItWorks';
import NearbySearch from '../components/site/NearbySearch';
import StayCard from '../components/site/StayCard';
import { Skeleton } from '../components/ui/Skeleton';
import { stays } from '../data/stays';

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const topStays = [...stays]
    .sort((a, b) => {
      if (a.is_jajapin_verified && !b.is_jajapin_verified) return -1;
      if (!a.is_jajapin_verified && b.is_jajapin_verified) return 1;
      return b.rating - a.rating;
    })
    .slice(0, 6);

  useEffect(() => {
    document.title = 'Jajapin - Platform Resmi Booking Hotel & Penginapan Murah Indonesia | jajapin.id';
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      
      {/* Hero dengan aksen natural dan tautan cepat Putri Sari */}
      <Hero />

      {/* Showcase Unggulan: Hotel Putri Sari (Terhubung dengan putrisari.jajapin.id) */}
      <PutriSariShowcase />

      {/* Jalur Destinasi Jajapin Network */}
      <DestinationStrip />

      {/* Pilihan Penginapan Lainnya di Jaringan Jajapin */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] font-body font-semibold text-emerald-800 mb-2">
              Jaringan Penginapan Nusantara
            </p>
            <h2 className="font-display font-light text-3xl sm:text-4xl tracking-tight text-foreground">
              Pilihan Penginapan Nyata di Seluruh Indonesia
            </h2>
          </div>
          <Link to="/stays" className="hidden sm:flex items-center gap-2 text-sm font-body font-semibold text-emerald-800 hover:text-emerald-950 transition-colors">
            Lihat semua {stays.length} penginapan <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topStays.map((stay) => (
              <StayCard key={stay.id} stay={stay} />
            ))}
          </div>
        )}

        <div className="mt-10 sm:hidden">
          <Link
            to="/stays"
            className="w-full py-3 rounded-xl border border-stone-300 text-stone-800 text-sm font-semibold flex items-center justify-center gap-2"
          >
            Lihat semua {stays.length} penginapan <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Nilai Utama & Transparansi Jajapin */}
      <WhyJajapin />

      {/* Alur Booking Simpel */}
      <HowItWorks />

      {/* Radar Lokasi Terdekat */}
      <NearbySearch />

      {/* Footer Lengkap Terhubung Legal & Subdomain */}
      <SiteFooter />
    </div>
  );
}

import SiteHeader from '../components/site/SiteHeader';
import SiteFooter from '../components/site/SiteFooter';
import Hero from '../components/site/Hero';
import DestinationStrip from '../components/site/DestinationStrip';
import WhyJajapin from '../components/site/WhyJajapin';
import HowItWorks from '../components/site/HowItWorks';
import NearbySearch from '../components/site/NearbySearch';
import StayCard from '../components/site/StayCard';
import { Skeleton } from '../components/ui/Skeleton';
import { stays } from '../data/stays';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const topStays = [...stays].sort((a, b) => b.rating - a.rating).slice(0, 3);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <Hero />
      <DestinationStrip />

      {/* Pilihan Minggu Ini */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-end justify-between mb-10">
          <h2 className="font-display font-light text-3xl sm:text-4xl tracking-tight text-foreground">
            Penginapan yang layak dikunjungi
          </h2>
          <Link to="/stays" className="hidden sm:flex items-center gap-2 text-sm font-body font-medium text-primary hover:underline">
            Semua penginapan <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1,2,3].map(i => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-[4/3] w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topStays.map(stay => (
              <StayCard key={stay.id} stay={stay} />
            ))}
          </div>
        )}
        <Link to="/stays" className="sm:hidden flex items-center justify-center gap-2 mt-8 text-sm font-body font-medium text-primary hover:underline">
          Semua penginapan <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      <WhyJajapin />
      <HowItWorks />
      <NearbySearch />
      <SiteFooter />
    </div>
  );
}

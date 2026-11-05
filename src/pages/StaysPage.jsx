import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X } from 'lucide-react';
import SiteHeader from '../components/site/SiteHeader';
import SiteFooter from '../components/site/SiteFooter';
import StayCard from '../components/site/StayCard';
import StayFilters from '../components/site/StayFilters';
import { Skeleton } from '../components/ui/Skeleton';
import { Button } from '../components/ui/Button';
import { stays } from '../data/stays';

export default function StaysPage() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(9);
  const [filters, setFilters] = useState({
    city: searchParams.get('city') || '',
    type: '',
    maxPrice: '',
    guests: searchParams.get('guests') || '',
    area: searchParams.get('area') || '',
  });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const city = searchParams.get('city');
    const area = searchParams.get('area');
    const guests = searchParams.get('guests');
    if (city || area || guests) {
      setFilters(prev => ({
        ...prev,
        city: city || prev.city,
        area: area || prev.area,
        guests: guests || prev.guests,
      }));
    }
  }, [searchParams]);

  const filtered = useMemo(() => {
    return stays.filter(s => {
      if (filters.city && s.city !== filters.city) return false;
      if (filters.type && s.type !== filters.type) return false;
      if (filters.maxPrice && s.price > Number(filters.maxPrice)) return false;
      if (filters.guests && s.guests < Number(filters.guests)) return false;
      if (filters.area) {
        const q = filters.area.toLowerCase();
        const searchable = `${s.name} ${s.city} ${s.province} ${s.address}`.toLowerCase();
        if (!searchable.includes(q)) return false;
      }
      return true;
    }).sort((a, b) => b.rating - a.rating);
  }, [filters]);

  const visible = filtered.slice(0, visibleCount);

  const resetFilters = () => {
    setFilters({ city: '', type: '', maxPrice: '', guests: '', area: '' });
    setVisibleCount(9);
  };

  const getTitle = () => {
    if (filters.area) return `Penginapan di sekitar "${filters.area}"`;
    if (filters.city) return `Menginap di ${filters.city}`;
    return 'Semua penginapan Jajapin';
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-[11px] uppercase tracking-[0.24em] font-body font-semibold text-muted-foreground mb-2">Katalog</p>
            <h1 className="font-display font-light text-3xl sm:text-4xl tracking-tight text-foreground">{getTitle()}</h1>
          </div>

          <div className="lg:hidden mb-4">
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
              <SlidersHorizontal className="w-4 h-4 mr-2" /> Filter
            </Button>
          </div>

          <div className="flex gap-8">
            {/* Sidebar filters */}
            <aside className={`${showFilters ? 'fixed inset-0 z-50 bg-card p-6 overflow-auto' : 'hidden'} lg:block lg:static lg:w-64 lg:shrink-0`}>
              {showFilters && (
                <div className="flex items-center justify-between mb-6 lg:hidden">
                  <h3 className="font-display font-semibold text-lg">Filter</h3>
                  <button onClick={() => setShowFilters(false)}><X className="w-5 h-5" /></button>
                </div>
              )}
              <StayFilters filters={filters} setFilters={setFilters} onReset={resetFilters} />
              {showFilters && (
                <Button className="w-full mt-4 lg:hidden" onClick={() => setShowFilters(false)}>Terapkan filter</Button>
              )}
            </aside>

            {/* Grid */}
            <div className="flex-1 min-w-0">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[1,2,3,4,5,6].map(i => (
                    <div key={i} className="space-y-3">
                      <Skeleton className="aspect-[4/3] w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-6 w-1/2" />
                    </div>
                  ))}
                </div>
              ) : visible.length > 0 ? (
                <>
                  <p className="text-sm text-muted-foreground font-body mb-4">{filtered.length} penginapan ditemukan</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {visible.map(stay => <StayCard key={stay.id} stay={stay} />)}
                  </div>
                  {visibleCount < filtered.length && (
                    <div className="text-center mt-10">
                      <Button variant="secondary" onClick={() => setVisibleCount(v => v + 9)}>Muat lebih banyak</Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-20">
                  <p className="font-display text-2xl text-foreground mb-2">Tidak ada penginapan yang cocok</p>
                  <p className="font-body text-muted-foreground mb-6">Coba ubah filter pencarian Anda.</p>
                  <Button variant="secondary" onClick={resetFilters}>Hapus semua filter</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}

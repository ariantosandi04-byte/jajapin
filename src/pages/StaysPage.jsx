import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, ShieldCheck, Sparkles, Building2 } from 'lucide-react';
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
  const [visibleCount, setVisibleCount] = useState(12);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'jajapin' | 'partner'
  const [filters, setFilters] = useState({
    city: searchParams.get('city') || '',
    type: '',
    maxPrice: '',
    guests: searchParams.get('guests') || '',
    area: searchParams.get('area') || '',
  });

  useEffect(() => {
    document.title = 'Pilihan Hotel & Penginapan Terbaik - Jajapin | jajapin.id';
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const city = searchParams.get('city');
    const area = searchParams.get('area');
    const guests = searchParams.get('guests');
    if (city || area || guests) {
      setFilters((prev) => ({
        ...prev,
        city: city || prev.city,
        area: area || prev.area,
        guests: guests || prev.guests,
      }));
    }
  }, [searchParams]);

  const filtered = useMemo(() => {
    return stays
      .filter((s) => {
        // Tab filtering
        if (activeTab === 'jajapin' && !s.is_jajapin_verified) return false;
        if (activeTab === 'partner' && s.is_jajapin_verified) return false;

        // Custom filters
        if (filters.city && s.city !== filters.city) return false;
        if (filters.type && s.type !== filters.type) return false;
        if (filters.maxPrice && s.price > Number(filters.maxPrice)) return false;
        if (filters.guests && s.guests < Number(filters.guests)) return false;
        if (filters.area) {
          const q = filters.area.toLowerCase();
          const searchable = `${s.name} ${s.city} ${s.province} ${s.address} ${s.type} ${s.tagline}`.toLowerCase();
          if (!searchable.includes(q)) return false;
        }
        return true;
      })
      .sort((a, b) => {
        // Prioritize official Jajapin properties first
        if (a.is_jajapin_verified && !b.is_jajapin_verified) return -1;
        if (!a.is_jajapin_verified && b.is_jajapin_verified) return 1;
        return b.rating - a.rating;
      });
  }, [filters, activeTab]);

  const visible = filtered.slice(0, visibleCount);

  const resetFilters = () => {
    setFilters({ city: '', type: '', maxPrice: '', guests: '', area: '' });
    setActiveTab('all');
    setVisibleCount(12);
  };

  const getTitle = () => {
    if (activeTab === 'jajapin') return 'Properti Resmi Jajapin Network';
    if (filters.area) return `Penginapan di sekitar "${filters.area}"`;
    if (filters.city) return `Menginap di ${filters.city}`;
    return 'Katalog Penginapan & Hotel Jajapin';
  };

  const jajapinCount = stays.filter((s) => s.is_jajapin_verified).length;
  const partnerCount = stays.filter((s) => !s.is_jajapin_verified).length;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Banner */}
          <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.24em] font-body font-semibold text-primary mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Akomodasi Terverifikasi Jajapin.id
              </p>
              <h1 className="font-display font-light text-3xl sm:text-4xl tracking-tight text-foreground">
                {getTitle()}
              </h1>
              <p className="text-sm font-body text-muted-foreground mt-2 max-w-2xl">
                Temukan hotel, guest house, homestay, dan glamping resmi kelolaan Jajapin yang terhubung langsung dengan Google dan platform OTA terkemuka.
              </p>
            </div>

            {/* Quick Category Selector */}
            <div className="flex items-center gap-1.5 p-1 bg-muted/60 rounded-2xl border border-border text-xs font-body shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`px-3.5 py-2 rounded-xl transition-all font-medium ${
                  activeTab === 'all'
                    ? 'bg-card text-foreground shadow-sm font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Semua ({stays.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('jajapin')}
                className={`px-3.5 py-2 rounded-xl transition-all font-medium flex items-center gap-1.5 ${
                  activeTab === 'jajapin'
                    ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                    : 'text-emerald-700 hover:text-emerald-800'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Jajapin Network ({jajapinCount})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('partner')}
                className={`px-3.5 py-2 rounded-xl transition-all font-medium ${
                  activeTab === 'partner'
                    ? 'bg-card text-foreground shadow-sm font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Mitra Pilihan ({partnerCount})
              </button>
            </div>
          </div>

          <div className="lg:hidden mb-4">
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
              <SlidersHorizontal className="w-4 h-4 mr-2" /> Filter Pencarian
            </Button>
          </div>

          <div className="flex gap-8">
            {/* Sidebar filters */}
            <aside
              className={`${
                showFilters ? 'fixed inset-0 z-50 bg-card p-6 overflow-auto' : 'hidden'
              } lg:block lg:static lg:w-64 lg:shrink-0`}
            >
              {showFilters && (
                <div className="flex items-center justify-between mb-6 lg:hidden">
                  <h3 className="font-display font-semibold text-lg">Filter</h3>
                  <button onClick={() => setShowFilters(false)}>
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
              <StayFilters filters={filters} setFilters={setFilters} onReset={resetFilters} />
              {showFilters && (
                <Button className="w-full mt-4 lg:hidden" onClick={() => setShowFilters(false)}>
                  Terapkan filter
                </Button>
              )}
            </aside>

            {/* Grid */}
            <div className="flex-1 min-w-0">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="space-y-3">
                      <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-6 w-1/2" />
                    </div>
                  ))}
                </div>
              ) : visible.length > 0 ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs text-muted-foreground font-body">
                      Menampilkan <strong className="text-foreground">{visible.length}</strong> dari{' '}
                      <strong className="text-foreground">{filtered.length}</strong> akomodasi
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {visible.map((stay) => (
                      <StayCard key={stay.id} stay={stay} />
                    ))}
                  </div>

                  {visibleCount < filtered.length && (
                    <div className="text-center mt-10">
                      <Button variant="secondary" onClick={() => setVisibleCount((v) => v + 6)}>
                        Muat Lebih Banyak Penginapan
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-20 bg-card rounded-3xl border border-border p-8">
                  <Building2 className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
                  <p className="font-display text-xl text-foreground mb-2">
                    Tidak ada penginapan yang cocok
                  </p>
                  <p className="font-body text-sm text-muted-foreground mb-6">
                    Coba sesuaikan kata kunci pencarian atau filter lokasi Anda.
                  </p>
                  <Button variant="secondary" onClick={resetFilters}>
                    Hapus Semua Filter
                  </Button>
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

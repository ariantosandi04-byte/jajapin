import { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import {
  Star,
  MapPin,
  Users,
  BedDouble,
  Bath,
  DoorOpen,
  Clock,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Check,
  Plus,
  Minus,
} from 'lucide-react';
import SiteHeader from '../components/site/SiteHeader';
import SiteFooter from '../components/site/SiteFooter';
import BookingWidget from '../components/stay/BookingWidget';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { stays } from '../data/stays';
import { reviews as allReviews } from '../data/reviews';
import { formatIDR, formatDate } from '../lib/format';

export default function StayDetailPage() {
  const { slug } = useParams();
  const stay = stays.find((s) => s.slug === slug);

  if (!stay) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="pt-32 text-center px-4">
          <h1 className="font-display text-3xl text-foreground mb-4">Penginapan ini tidak ditemukan</h1>
          <p className="font-body text-muted-foreground mb-6">Mungkin sudah dihapus atau alamat salah.</p>
          <Link to="/stays" className="font-body text-primary hover:underline">
            ← Kembali ke katalog
          </Link>
        </div>
        <SiteFooter />
      </div>
    );
  }

  const [selectedRoomId, setSelectedRoomId] = useState(stay.room_types?.[0]?.id || 'standard');
  const [roomsCount, setRoomsCount] = useState(1);

  useEffect(() => {
    if (stay) {
      document.title = `${stay.name} (${stay.city}) - Pesan Kamar Online | Jajapin.id`;
    }
  }, [stay]);

  const stayReviews = allReviews.filter((r) => r.property_id === stay.id);
  const allImages = [stay.image, ...(stay.gallery || [])];

  const handleSelectRoomType = (roomId) => {
    setSelectedRoomId(roomId);
    // Smooth scroll to booking widget on mobile
    if (window.innerWidth < 1024) {
      const widget = document.getElementById('booking-widget-section');
      if (widget) {
        widget.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm font-body text-muted-foreground mb-6">
            <Link to="/stays" className="hover:text-primary transition-colors">
              Semua penginapan
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">{stay.name}</span>
          </nav>

          {/* Gallery mosaic */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8 rounded-3xl overflow-hidden md:h-[460px]">
            <div className="md:col-span-2 md:row-span-2 h-72 md:h-full overflow-hidden">
              <img
                src={allImages[0]}
                alt={stay.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            {allImages.slice(1, 3).map((img, i) => (
              <div key={i} className="hidden md:block h-[224px] overflow-hidden">
                <img
                  src={img}
                  alt={`${stay.name} ${i + 2}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <Badge variant="lime">{stay.type}</Badge>
                  {stay.is_jajapin_verified && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-body font-semibold px-2.5 py-1 rounded-full bg-emerald-600 text-white shadow-sm">
                      <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5]" /> Properti Resmi Jajapin Network
                    </span>
                  )}
                </div>
                <h1 className="font-display font-semibold text-3xl sm:text-4xl tracking-tight text-foreground mb-2">
                  {stay.name}
                </h1>
                <div className="flex items-center gap-4 text-sm font-body text-muted-foreground mb-3">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-primary" /> {stay.address}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-brand-lime text-brand-lime" />
                  <span className="font-body font-semibold">{stay.rating}</span>
                  <span className="text-sm text-muted-foreground font-body">
                    ({stay.review_count} ulasan di Google & OTA)
                  </span>
                </div>
              </div>

              {stay.is_jajapin_verified && (
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs font-body text-emerald-900 space-y-1.5">
                  <div className="font-semibold flex items-center gap-1.5 text-emerald-800 text-sm">
                    <Sparkles className="w-4 h-4 text-emerald-600" /> Penginapan Terdaftar & Terintegrasi
                  </div>
                  <p className="text-[11px] leading-relaxed text-emerald-700">
                    Properti ini terdaftar di Google Maps dan platform OTA resmi (Tiket.com, Agoda, Traveloka).
                    Pemesanan langsung via situs resmi Jajapin.id bebas biaya perantara dan mendapatkan konfirmasi instan.
                  </p>
                </div>
              )}

              <p className="font-display text-xl italic text-accent">{stay.tagline}</p>
              <p className="font-body text-foreground/80 leading-relaxed">{stay.description}</p>

              {/* Facts strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { icon: Users, label: 'Kapasitas', value: `Hingga ${stay.guests * 2} tamu` },
                  { icon: DoorOpen, label: 'Tipe Kamar', value: `${stay.room_types?.length || 1} tipe pilihan` },
                  { icon: BedDouble, label: 'Tempat tidur', value: `${stay.beds} ranjang/kamar` },
                  { icon: Bath, label: 'Kamar mandi', value: `${stay.bathrooms} km. mandi` },
                ].map((f) => (
                  <div key={f.label} className="flex items-center gap-3 p-4 rounded-2xl bg-muted/50">
                    <f.icon className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] font-body text-muted-foreground">{f.label}</p>
                      <p className="font-body font-semibold text-sm">{f.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* SECTION: PILIHAN TIPE KAMAR & HARGA BERBEDA */}
              {stay.room_types && stay.room_types.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-border">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="font-display font-semibold text-xl tracking-tight text-foreground flex items-center gap-2">
                        <BedDouble className="w-5 h-5 text-emerald-600" /> Pilihan Tipe Kamar & Tarif
                      </h3>
                      <p className="text-xs text-muted-foreground font-body">
                        Pilih tipe kamar yang Anda inginkan dan tentukan jumlah kamar yang akan dipesan
                      </p>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary shrink-0 self-start sm:self-auto font-body">
                      Bisa Pesan &gt; 1 Kamar
                    </span>
                  </div>

                  <div className="space-y-4">
                    {stay.room_types.map((room) => {
                      const isSelected = room.id === selectedRoomId;

                      return (
                        <div
                          key={room.id}
                          className={`p-5 rounded-3xl border transition-all ${
                            isSelected
                              ? 'border-emerald-600 bg-emerald-50/40 dark:bg-emerald-950/20 shadow-md ring-2 ring-emerald-500/50'
                              : 'border-border bg-card hover:border-border/80'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row gap-5 items-start">
                            {room.image && (
                              <img
                                src={room.image}
                                alt={room.name}
                                className="w-full sm:w-44 h-32 rounded-2xl object-cover shrink-0"
                              />
                            )}
                            <div className="flex-1 space-y-2">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <h4 className="font-display font-semibold text-lg text-foreground">
                                  {room.name}
                                </h4>
                                <div className="text-right">
                                  <span className="font-display font-bold text-xl text-emerald-700 dark:text-emerald-400">
                                    {formatIDR(room.price)}
                                  </span>
                                  <span className="text-xs text-muted-foreground font-body block">/kamar/malam</span>
                                </div>
                              </div>

                              <p className="text-xs font-body text-muted-foreground leading-relaxed">
                                {room.description}
                              </p>

                              <div className="flex flex-wrap gap-2 pt-1">
                                <span className="text-[11px] px-2.5 py-1 rounded-xl bg-muted font-body text-foreground">
                                  🛏️ {room.bed}
                                </span>
                                <span className="text-[11px] px-2.5 py-1 rounded-xl bg-muted font-body text-foreground">
                                  👥 Maks {room.capacity} Orang
                                </span>
                                {room.amenities?.map((am) => (
                                  <span
                                    key={am}
                                    className="text-[11px] px-2.5 py-1 rounded-xl bg-emerald-100/70 text-emerald-800 font-body"
                                  >
                                    ✓ {am}
                                  </span>
                                ))}
                              </div>

                              <div className="pt-3 flex flex-wrap items-center justify-between gap-3 border-t border-border/50">
                                <span className="text-xs text-muted-foreground font-body">
                                  Tersedia: <strong className="text-foreground">{room.available_units || 5} unit kamar</strong>
                                </span>

                                <Button
                                  size="sm"
                                  variant={isSelected ? 'default' : 'outline'}
                                  className={isSelected ? 'bg-emerald-700 hover:bg-emerald-800 text-white' : ''}
                                  onClick={() => handleSelectRoomType(room.id)}
                                >
                                  {isSelected ? (
                                    <>
                                      <Check className="w-3.5 h-3.5 mr-1.5" /> Tipe Kamar Terpilih
                                    </>
                                  ) : (
                                    'Pilih Tipe Kamar Ini'
                                  )}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Amenities */}
              <div>
                <h3 className="font-display font-semibold text-lg tracking-tight mb-4">Fasilitas Properti</h3>
                <div className="flex flex-wrap gap-2">
                  {stay.amenities.map((a) => (
                    <span key={a} className="px-4 py-2 rounded-full bg-brand-sand text-sm font-body text-foreground">
                      {a}
                    </span>
                  ))}
                </div>
              </div>

              {/* Check-in/out */}
              <div className="flex gap-8">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] font-body text-muted-foreground">Check-in</p>
                    <p className="font-body font-semibold">{stay.check_in_time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-accent" />
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] font-body text-muted-foreground">Check-out</p>
                    <p className="font-body font-semibold">{stay.check_out_time}</p>
                  </div>
                </div>
              </div>

              {/* Reviews */}
              <div>
                <h3 className="font-display font-semibold text-lg tracking-tight mb-4">Ulasan Tamu Nyata</h3>
                <div className="space-y-4">
                  {stayReviews.map((review, i) => (
                    <Card key={i}>
                      <CardContent className="p-5">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-body font-semibold text-sm">{review.guest_name}</span>
                          <span className="text-xs text-muted-foreground font-body">{formatDate(review.stay_date)}</span>
                        </div>
                        <div className="flex items-center gap-1 mb-2">
                          {Array.from({ length: 5 }).map((_, j) => (
                            <Star
                              key={j}
                              className={`w-3.5 h-3.5 ${
                                j < review.rating ? 'fill-brand-lime text-brand-lime' : 'text-border'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="font-body text-sm text-foreground/80">{review.comment}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Sticky Booking Widget */}
            <div id="booking-widget-section">
              <BookingWidget
                stay={stay}
                selectedRoomId={selectedRoomId}
                onSelectRoom={setSelectedRoomId}
                roomsCount={roomsCount}
                onRoomsCountChange={setRoomsCount}
              />
            </div>
          </div>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, CreditCard, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';
import { useAuth } from '../../contexts/AuthContext';
import { formatIDR, calculateNights } from '../../lib/format';

export default function BookingWidget({ stay }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);

  const nights = checkIn && checkOut ? calculateNights(checkIn, checkOut) : 0;
  const total = nights * stay.price;

  const handleBook = () => {
    const targetUrl = `/pesan/${stay.slug}?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`;
    if (!isAuthenticated) {
      navigate('/login', { state: { from: targetUrl } });
      return;
    }
    navigate(targetUrl);
  };

  return (
    <div className="lg:sticky lg:top-24">
      <Card className="shadow-[0_18px_40px_-28px_rgba(18,20,22,0.35)] border-border bg-card">
        <CardContent className="p-6 space-y-5">
          <div className="flex items-baseline justify-between border-b border-border pb-4">
            <div>
              <span className="font-display font-semibold text-2xl text-foreground">{formatIDR(stay.price)}</span>
              <span className="text-sm text-muted-foreground font-body"> /malam</span>
            </div>
            <div className="text-xs text-muted-foreground font-body">
              Harga langsung pengelola
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] font-body font-semibold text-muted-foreground mb-1.5">
                <Calendar className="w-3 h-3 inline mr-1 text-primary" /> Check-in
              </label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full h-11 px-4 rounded-2xl border border-border bg-background text-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                aria-label="Tanggal check-in"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] font-body font-semibold text-muted-foreground mb-1.5">
                <Calendar className="w-3 h-3 inline mr-1 text-primary" /> Check-out
              </label>
              <input
                type="date"
                value={checkOut}
                min={checkIn || undefined}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full h-11 px-4 rounded-2xl border border-border bg-background text-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                aria-label="Tanggal check-out"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] font-body font-semibold text-muted-foreground mb-1.5">
                <Users className="w-3 h-3 inline mr-1 text-primary" /> Tamu
              </label>
              <select
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="w-full h-11 px-4 rounded-2xl border border-border bg-background text-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 appearance-none cursor-pointer"
                aria-label="Jumlah tamu"
              >
                {Array.from({ length: stay.guests || 4 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>{n} tamu</option>
                ))}
              </select>
            </div>
          </div>

          {nights > 0 && (
            <div className="space-y-2 pt-3 border-t border-border">
              <div className="flex justify-between text-sm font-body text-muted-foreground">
                <span>{formatIDR(stay.price)} × {nights} malam</span>
                <span className="text-foreground">{formatIDR(total)}</span>
              </div>
              <div className="flex justify-between text-sm font-body text-muted-foreground">
                <span>Biaya layanan Jajapin</span>
                <span className="text-primary font-medium">Rp0 (Gratis)</span>
              </div>
              <div className="flex justify-between font-display font-semibold text-lg pt-2 border-t border-border text-foreground">
                <span>Total estimasi</span>
                <span className="text-primary">{formatIDR(total)}</span>
              </div>
            </div>
          )}

          <Button
            className="w-full"
            size="lg"
            onClick={handleBook}
            disabled={!checkIn || !checkOut || nights <= 0}
          >
            <CreditCard className="w-4 h-4 mr-2" /> Pesan sekarang
          </Button>

          <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground font-body text-center pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            <span>Tanpa biaya tersembunyi · Konfirmasi instan</span>
          </div>

          {!isAuthenticated && (
            <p className="text-xs text-center text-accent font-body bg-accent/5 p-2 rounded-xl">
              Anda akan diarahkan ke halaman masuk sebelum menyelesaikan pemesanan
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, CreditCard, ShieldCheck, BedDouble, Plus, Minus, Check } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';
import { useAuth } from '../../contexts/AuthContext';
import { formatIDR, calculateNights } from '../../lib/format';

export default function BookingWidget({
  stay,
  selectedRoomId: externalSelectedRoomId,
  onSelectRoom: externalOnSelectRoom,
  roomsCount: externalRoomsCount,
  onRoomsCountChange: externalOnRoomsCountChange,
}) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const roomTypes = useMemo(() => {
    if (stay.room_types && stay.room_types.length > 0) {
      return stay.room_types;
    }
    return [
      {
        id: 'standard',
        name: 'Kamar Standar',
        bed: `${stay.beds || 1} Ranjang`,
        capacity: stay.guests || 2,
        price: stay.price,
        description: 'Kamar nyaman standar properti.',
      },
    ];
  }, [stay]);

  // Internal states if not controlled externally
  const [internalRoomId, setInternalRoomId] = useState(roomTypes[0]?.id || 'standard');
  const [internalRoomsCount, setInternalRoomsCount] = useState(1);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);

  const activeRoomId = externalSelectedRoomId !== undefined ? externalSelectedRoomId : internalRoomId;
  const activeRoomsCount = externalRoomsCount !== undefined ? externalRoomsCount : internalRoomsCount;

  const currentRoom = useMemo(() => {
    return roomTypes.find((r) => r.id === activeRoomId) || roomTypes[0];
  }, [roomTypes, activeRoomId]);

  const handleRoomChange = (roomId) => {
    if (externalOnSelectRoom) {
      externalOnSelectRoom(roomId);
    } else {
      setInternalRoomId(roomId);
    }
  };

  const handleRoomsCountChange = (count) => {
    const val = Math.max(1, Math.min(10, count));
    if (externalOnRoomsCountChange) {
      externalOnRoomsCountChange(val);
    } else {
      setInternalRoomsCount(val);
    }
  };

  const nights = checkIn && checkOut ? calculateNights(checkIn, checkOut) : 0;
  const ratePerRoomNight = currentRoom?.price || stay.price;
  const subtotalPerNight = ratePerRoomNight * activeRoomsCount;
  const total = nights > 0 ? subtotalPerNight * nights : subtotalPerNight;

  const handleBook = () => {
    const targetUrl = `/pesan/${stay.slug}?roomType=${encodeURIComponent(
      currentRoom.id
    )}&rooms=${activeRoomsCount}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`;

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
          {/* Header Harga Berdasarkan Tipe Kamar */}
          <div className="flex items-baseline justify-between border-b border-border pb-4">
            <div>
              <span className="font-display font-semibold text-2xl text-foreground">
                {formatIDR(ratePerRoomNight)}
              </span>
              <span className="text-xs text-muted-foreground font-body"> /kamar/malam</span>
              <p className="text-xs text-primary font-semibold font-body mt-0.5">
                {currentRoom.name}
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 block">
                Bebas Biaya Admin
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {/* 1. PILIHAN TIPE KAMAR & HARGA */}
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] font-body font-semibold text-muted-foreground mb-1.5 flex items-center justify-between">
                <span>
                  <BedDouble className="w-3.5 h-3.5 inline mr-1 text-primary" /> Pilihan Tipe Kamar
                </span>
                <span className="text-[10px] text-primary lowercase">
                  ({roomTypes.length} tipe tersedia)
                </span>
              </label>

              <div className="space-y-2">
                {roomTypes.map((room) => {
                  const isSelected = room.id === activeRoomId;
                  return (
                    <button
                      key={room.id}
                      type="button"
                      onClick={() => handleRoomChange(room.id)}
                      className={`w-full text-left p-3 rounded-2xl border transition-all text-xs font-body ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/20 ring-1 ring-emerald-500'
                          : 'border-border bg-background hover:bg-muted/40'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-foreground flex items-center gap-1.5">
                            {room.name}
                            {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />}
                          </p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            {room.bed} • Maks {room.capacity} orang
                          </p>
                        </div>
                        <span className="font-display font-bold text-sm text-emerald-700 dark:text-emerald-400 shrink-0">
                          {formatIDR(room.price)}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. JUMLAH KAMAR (BISA PESAN LEBIH DARI 1 KAMAR) */}
            <div className="p-3.5 rounded-2xl bg-muted/40 border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-[11px] font-semibold text-foreground font-body">
                    Jumlah Kamar
                  </label>
                  <p className="text-[10px] text-muted-foreground font-body">
                    Pesan 1 atau lebih kamar sekaligus
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleRoomsCountChange(activeRoomsCount - 1)}
                    disabled={activeRoomsCount <= 1}
                    className="w-8 h-8 rounded-full border border-border bg-card flex items-center justify-center text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    aria-label="Kurangi Kamar"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center font-display font-bold text-base text-foreground">
                    {activeRoomsCount}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRoomsCountChange(activeRoomsCount + 1)}
                    disabled={activeRoomsCount >= 10}
                    className="w-8 h-8 rounded-full border border-border bg-card flex items-center justify-center text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    aria-label="Tambah Kamar"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* 3. TANGGAL CHECK-IN & CHECK-OUT */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] font-body font-semibold text-muted-foreground mb-1.5">
                  <Calendar className="w-3 h-3 inline mr-1 text-primary" /> Check-in
                </label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full h-11 px-3 rounded-2xl border border-border bg-background text-xs font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
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
                  className="w-full h-11 px-3 rounded-2xl border border-border bg-background text-xs font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  aria-label="Tanggal check-out"
                />
              </div>
            </div>

            {/* 4. JUMLAH TAMU */}
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] font-body font-semibold text-muted-foreground mb-1.5">
                <Users className="w-3 h-3 inline mr-1 text-primary" /> Total Tamu
              </label>
              <select
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="w-full h-11 px-4 rounded-2xl border border-border bg-background text-xs font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 appearance-none cursor-pointer"
                aria-label="Jumlah tamu"
              >
                {Array.from({ length: (currentRoom.capacity || 2) * activeRoomsCount + 4 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n} tamu (Kapasitas ideal: {currentRoom.capacity * activeRoomsCount} orang)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Rincian Kalkulasi Harga Transparan */}
          {nights > 0 && (
            <div className="space-y-2 pt-3 border-t border-border font-body text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>
                  {activeRoomsCount} Kamar × {formatIDR(ratePerRoomNight)}
                </span>
                <span className="text-foreground">{formatIDR(subtotalPerNight)}/mlm</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Durasi Menginap</span>
                <span className="text-foreground">{nights} malam</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Biaya Layanan Jajapin</span>
                <span className="text-emerald-700 font-semibold">Rp0 (Gratis)</span>
              </div>
              <div className="flex justify-between font-display font-semibold text-lg pt-2 border-t border-border text-foreground items-baseline">
                <div>
                  <span className="block text-xs font-normal text-muted-foreground font-body">
                    Total Tagihan ({activeRoomsCount} Kamar, {nights} Malam)
                  </span>
                  <span>Total</span>
                </div>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold text-xl">
                  {formatIDR(total)}
                </span>
              </div>
            </div>
          )}

          <Button
            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white"
            size="lg"
            onClick={handleBook}
            disabled={!checkIn || !checkOut || nights <= 0}
          >
            <CreditCard className="w-4 h-4 mr-2" /> Pesan {activeRoomsCount} Kamar Sekarang
          </Button>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground font-body text-center pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Garansi Harga Resmi • Konfirmasi Instan</span>
          </div>

          {!isAuthenticated && (
            <p className="text-[11px] text-center text-accent font-body bg-accent/5 p-2.5 rounded-xl">
              Anda akan diminta masuk / mendaftar singkat sebelum pembayaran untuk menerbitkan bukti reservasi.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

import { useState } from 'react';
import { X, Calendar, User, Phone, Mail, Building } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { generateBookingCode } from '../../lib/format';

export default function ReservationModal({ isOpen, onClose, properties = [], onSave }) {
  if (!isOpen) return null;

  const [propertyId, setPropertyId] = useState(properties[0]?.id || 1);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [pricePerNight, setPricePerNight] = useState(properties[0]?.price || 500000);
  const [notes, setNotes] = useState('');

  const selectedProperty = properties.find((p) => p.id === Number(propertyId)) || properties[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    const nights = Math.max(1, Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)) || 1);
    const totalPrice = nights * (selectedProperty?.price || pricePerNight);

    const newBooking = {
      booking_code: generateBookingCode(),
      property_id: selectedProperty.id,
      property_name: selectedProperty.name,
      property_image: selectedProperty.image,
      property_city: selectedProperty.city,
      guest_name: guestName,
      guest_email: guestEmail,
      guest_phone: guestPhone,
      check_in: checkIn || new Date().toISOString().split('T')[0],
      check_out: checkOut || new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      guests: Number(guests),
      nights: nights,
      price_per_night: selectedProperty.price || pricePerNight,
      total_price: totalPrice,
      status: 'dikonfirmasi',
      payment_status: 'dibayar',
      payment_method: 'Manual / Kasir PMS',
      midtrans_order_id: `PMS-${Date.now()}`,
      paid_at: new Date().toISOString(),
      notes: notes,
      source: 'pms',
      created_at: new Date().toISOString(),
    };

    onSave(newBooking);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-card w-full max-w-lg rounded-3xl border border-border shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h3 className="font-display font-semibold text-lg text-foreground">Tambah Reservasi Baru</h3>
            <p className="text-xs text-muted-foreground font-body">Input reservasi manual / walk-in ke sistem PMS</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-muted text-muted-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div>
            <label className="block text-[11px] uppercase tracking-[0.2em] font-body font-semibold text-muted-foreground mb-2">
              Pilih Properti
            </label>
            <select
              value={propertyId}
              onChange={(e) => {
                setPropertyId(e.target.value);
                const prop = properties.find((p) => p.id === Number(e.target.value));
                if (prop) setPricePerNight(prop.price);
              }}
              className="flex h-11 w-full rounded-2xl border border-border bg-card px-4 py-2 font-body text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 cursor-pointer"
            >
              {properties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.city})
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Nama Lengkap Tamu"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            required
            placeholder="Contoh: Andi Pratama"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email Tamu"
              type="email"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              required
              placeholder="andi@email.com"
            />
            <Input
              label="No. Telepon / WhatsApp"
              value={guestPhone}
              onChange={(e) => setGuestPhone(e.target.value)}
              required
              placeholder="0813xxxxxxxx"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Tanggal Check-in"
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              required
            />
            <Input
              label="Tanggal Check-out"
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] uppercase tracking-[0.2em] font-body font-semibold text-muted-foreground mb-2">
                Jumlah Tamu
              </label>
              <select
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="flex h-11 w-full rounded-2xl border border-border bg-card px-4 py-2 font-body text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
              >
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>{n} Orang</option>
                ))}
              </select>
            </div>
            <Input
              label="Catatan Kamar"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Tambah extra bed"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose}>Batal</Button>
            <Button type="submit">Simpan Reservasi</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

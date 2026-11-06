import { useState, useMemo } from 'react';
import {
  X,
  Calendar,
  User,
  Phone,
  Mail,
  Building,
  CreditCard,
  FileText,
  Globe,
  Tag,
  DollarSign,
  BedDouble,
  CheckCircle2,
  AlertCircle,
  Hash,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { formatIDR, generateBookingCode } from '../../lib/format';
import { CHANNEL_SOURCES } from '../../lib/bookingStatus';

export default function ReservationModal({ isOpen, onClose, properties = [], onSave }) {
  if (!isOpen) return null;

  const [propertyId, setPropertyId] = useState(properties[0]?.id || 1);
  const selectedProperty = properties.find((p) => p.id === Number(propertyId)) || properties[0] || {};

  // Channel & Source
  const [channel, setChannel] = useState('direct_walkin');
  const [otaBookingId, setOtaBookingId] = useState('');

  // Guest Details
  const [guestName, setGuestName] = useState('');
  const [guestIdNumber, setGuestIdNumber] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');

  // Dates & Guests
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const [checkIn, setCheckIn] = useState(todayStr);
  const [checkOut, setCheckOut] = useState(tomorrowStr);
  const [guestsCount, setGuestsCount] = useState(2);

  // Room Assignment
  const roomTypes = useMemo(() => {
    return [
      { id: 'deluxe', name: 'Deluxe Room', baseRate: selectedProperty?.price || 450000 },
      { id: 'standard', name: 'Standard Room', baseRate: Math.round((selectedProperty?.price || 450000) * 0.8) },
      { id: 'suite', name: 'Suite / Villa Family', baseRate: Math.round((selectedProperty?.price || 450000) * 1.5) },
    ];
  }, [selectedProperty]);

  const [roomType, setRoomType] = useState('Deluxe Room');
  const [roomNumber, setRoomNumber] = useState('101');

  // Rates & Financials
  const [ratePerNight, setRatePerNight] = useState(selectedProperty?.price || 450000);
  const [extraFee, setExtraFee] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState('dibayar'); // 'dibayar' | 'dp' | 'belum_bayar'
  const [depositAmount, setDepositAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('Tunai / Kasir');
  const [notes, setNotes] = useState('');

  // Auto calculate nights
  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 1;
    const diff = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
    return Math.max(1, diff || 1);
  }, [checkIn, checkOut]);

  // Total calculation
  const subtotalRoom = Number(ratePerNight || 0) * nights;
  const totalPrice = Math.max(0, subtotalRoom + Number(extraFee || 0) - Number(discountAmount || 0));

  const amountPaid = useMemo(() => {
    if (paymentStatus === 'dibayar') return totalPrice;
    if (paymentStatus === 'belum_bayar') return 0;
    return Math.min(totalPrice, Number(depositAmount || 0));
  }, [paymentStatus, totalPrice, depositAmount]);

  const balanceDue = Math.max(0, totalPrice - amountPaid);

  const handleSubmit = (e) => {
    e.preventDefault();

    const bookingCode = generateBookingCode();
    const isOta = channel.startsWith('ota_');

    const newBooking = {
      booking_code: bookingCode,
      property_id: selectedProperty.id || 1,
      property_name: selectedProperty.name || 'Jajapin Stay',
      property_image: selectedProperty.image || '/assets/logo-jajapin.jpg',
      property_city: selectedProperty.city || 'Indonesia',
      guest_name: guestName,
      guest_id_number: guestIdNumber,
      guest_email: guestEmail || `${guestName.toLowerCase().replace(/\s+/g, '')}@guest.jajapin.id`,
      guest_phone: guestPhone,
      check_in: checkIn,
      check_out: checkOut,
      guests: Number(guestsCount),
      nights: nights,
      room_type: roomType,
      room_number: roomNumber,
      price_per_night: Number(ratePerNight),
      subtotal_room: subtotalRoom,
      extra_fee: Number(extraFee),
      discount: Number(discountAmount),
      total_price: totalPrice,
      amount_paid: amountPaid,
      balance_due: balanceDue,
      status: 'dikonfirmasi',
      payment_status: paymentStatus,
      payment_method: paymentMethod,
      source: channel,
      source_name: CHANNEL_SOURCES[channel]?.name || 'Direct Booking',
      ota_booking_id: isOta ? otaBookingId : null,
      notes: notes,
      created_at: new Date().toISOString(),
      invoice_number: `INV/${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}/${bookingCode}`,
    };

    onSave(newBooking);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      <div className="bg-card w-full max-w-2xl rounded-3xl border border-border shadow-2xl overflow-hidden my-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-border bg-muted/20">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] uppercase tracking-[0.25em] font-body font-bold text-primary">
                Hotel Management System (PMS)
              </span>
            </div>
            <h3 className="font-display font-semibold text-xl text-foreground mt-0.5">
              Tambah Reservasi Baru
            </h3>
            <p className="text-xs text-muted-foreground font-body">
              Input reservasi tamu dari Direct Booking, Walk-in, WhatsApp, atau OTA (Traveloka, Tiket, Booking, dll.)
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-6 max-h-[78vh] overflow-y-auto">
          {/* SECTION 1: SALURAN PEMESANAN (CHANNEL SOURCE) */}
          <div className="space-y-3">
            <label className="block text-[11px] uppercase tracking-[0.2em] font-body font-bold text-foreground">
              1. Sumber / Saluran Pemesanan (Channel Source) *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'direct_walkin', label: 'Walk-In (Kasir)', cat: 'Direct' },
                { id: 'direct_whatsapp', label: 'WhatsApp / Chat', cat: 'Direct' },
                { id: 'direct_phone', label: 'Telepon Langsung', cat: 'Direct' },
                { id: 'direct_web', label: 'Website Jajapin', cat: 'Direct' },
                { id: 'ota_traveloka', label: 'Traveloka', cat: 'OTA' },
                { id: 'ota_tiket', label: 'Tiket.com', cat: 'OTA' },
                { id: 'ota_booking', label: 'Booking.com', cat: 'OTA' },
                { id: 'ota_agoda', label: 'Agoda', cat: 'OTA' },
                { id: 'ota_airbnb', label: 'Airbnb', cat: 'OTA' },
                { id: 'corporate', label: 'Corporate / B2B', cat: 'B2B' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setChannel(item.id)}
                  className={`p-2.5 rounded-2xl border text-left transition-all ${
                    channel === item.id
                      ? 'border-primary bg-primary/10 text-primary font-semibold ring-2 ring-primary/20'
                      : 'border-border bg-card text-foreground hover:border-muted-foreground/40'
                  }`}
                >
                  <span className="block text-[10px] text-muted-foreground uppercase tracking-wider font-body">
                    {item.cat}
                  </span>
                  <span className="block text-xs font-body font-medium truncate">{item.label}</span>
                </button>
              ))}
            </div>

            {/* If OTA or Corporate is chosen, show external reference ID */}
            {channel.startsWith('ota_') && (
              <div className="p-3.5 rounded-2xl bg-sky-50/80 border border-sky-200 space-y-1.5 animate-in fade-in">
                <div className="flex items-center gap-1.5 text-sky-900 text-xs font-semibold">
                  <Hash className="w-3.5 h-3.5" />
                  <span>Nomor Referensi / Booking ID dari {CHANNEL_SOURCES[channel]?.name}</span>
                </div>
                <Input
                  value={otaBookingId}
                  onChange={(e) => setOtaBookingId(e.target.value)}
                  placeholder="Contoh: TVLK-9831092 / BDC-771829"
                  className="bg-white"
                  required
                />
              </div>
            )}
          </div>

          {/* SECTION 2: PROPERTI & ALOKASI KAMAR */}
          <div className="space-y-3 pt-2 border-t border-border">
            <label className="block text-[11px] uppercase tracking-[0.2em] font-body font-bold text-foreground">
              2. Properti & Alokasi Kamar
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-1">
                <label className="block text-xs text-muted-foreground font-body mb-1">Properti</label>
                <select
                  value={propertyId}
                  onChange={(e) => {
                    setPropertyId(e.target.value);
                    const prop = properties.find((p) => p.id === Number(e.target.value));
                    if (prop) setRatePerNight(prop.price);
                  }}
                  className="w-full h-10 rounded-xl border border-border bg-background px-3 font-body text-xs text-foreground focus:ring-2 focus:ring-primary/20"
                >
                  {properties.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.city})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-muted-foreground font-body mb-1">Tipe Kamar</label>
                <select
                  value={roomType}
                  onChange={(e) => {
                    setRoomType(e.target.value);
                    const selected = roomTypes.find((r) => r.name === e.target.value);
                    if (selected) setRatePerNight(selected.baseRate);
                  }}
                  className="w-full h-10 rounded-xl border border-border bg-background px-3 font-body text-xs text-foreground focus:ring-2 focus:ring-primary/20"
                >
                  {roomTypes.map((r) => (
                    <option key={r.id} value={r.name}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-muted-foreground font-body mb-1">No. Unit Kamar</label>
                <Input
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  placeholder="Kamar 101"
                  required
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: INFORMASI TAMU */}
          <div className="space-y-3 pt-2 border-t border-border">
            <label className="block text-[11px] uppercase tracking-[0.2em] font-body font-bold text-foreground">
              3. Data Tamu Pemesan
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Nama Lengkap Tamu *"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Contoh: Raden Mas Danang"
                required
              />
              <Input
                label="No. KTP / Paspor (Opsional)"
                value={guestIdNumber}
                onChange={(e) => setGuestIdNumber(e.target.value)}
                placeholder="3201xxxxxxxxxxxx"
              />
              <Input
                label="No. Telepon / WhatsApp *"
                value={guestPhone}
                onChange={(e) => setGuestPhone(e.target.value)}
                placeholder="081234567890"
                required
              />
              <Input
                label="Alamat Email (Opsional)"
                type="email"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                placeholder="tamu@email.com"
              />
            </div>
          </div>

          {/* SECTION 4: JADWAL & JUMLAH TAMU */}
          <div className="space-y-3 pt-2 border-t border-border">
            <label className="block text-[11px] uppercase tracking-[0.2em] font-body font-bold text-foreground">
              4. Jadwal Menginap
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input
                label="Tanggal Check-In *"
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                required
              />
              <Input
                label="Tanggal Check-Out *"
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                required
              />
              <div>
                <label className="block text-xs text-muted-foreground font-body mb-1">
                  Jumlah Tamu ({nights} Malam)
                </label>
                <select
                  value={guestsCount}
                  onChange={(e) => setGuestsCount(Number(e.target.value))}
                  className="w-full h-10 rounded-xl border border-border bg-background px-3 font-body text-xs text-foreground focus:ring-2 focus:ring-primary/20"
                >
                  {[1, 2, 3, 4, 5, 6, 8, 10].map((n) => (
                    <option key={n} value={n}>
                      {n} Orang Tamu
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 5: KEUANGAN, TARIF & INVOICE */}
          <div className="space-y-3 pt-2 border-t border-border">
            <label className="block text-[11px] uppercase tracking-[0.2em] font-body font-bold text-foreground">
              5. Tarif, Tagihan & Pembayaran Invoice
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-muted-foreground font-body mb-1">
                  Tarif Kamar/Malam (Rp)
                </label>
                <Input
                  type="number"
                  value={ratePerNight}
                  onChange={(e) => setRatePerNight(Number(e.target.value))}
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-muted-foreground font-body mb-1">
                  Biaya Tambahan / Extra (Rp)
                </label>
                <Input
                  type="number"
                  value={extraFee}
                  onChange={(e) => setExtraFee(Number(e.target.value))}
                  placeholder="Extra bed, dll."
                />
              </div>

              <div>
                <label className="block text-xs text-muted-foreground font-body mb-1">
                  Diskon / Potongan (Rp)
                </label>
                <Input
                  type="number"
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(Number(e.target.value))}
                  placeholder="0"
                />
              </div>
            </div>

            {/* Total Summary Box */}
            <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-2">
              <div className="flex justify-between text-xs font-body text-muted-foreground">
                <span>
                  Sewa Kamar ({nights} malam x {formatIDR(ratePerNight)}):
                </span>
                <span className="font-semibold text-foreground">{formatIDR(subtotalRoom)}</span>
              </div>
              {extraFee > 0 && (
                <div className="flex justify-between text-xs font-body text-muted-foreground">
                  <span>Biaya Layanan / Tambahan:</span>
                  <span className="font-semibold text-foreground">+{formatIDR(extraFee)}</span>
                </div>
              )}
              {discountAmount > 0 && (
                <div className="flex justify-between text-xs font-body text-emerald-600">
                  <span>Potongan Diskon:</span>
                  <span className="font-semibold">-{formatIDR(discountAmount)}</span>
                </div>
              )}
              <div className="border-t border-border pt-2 flex justify-between text-sm font-body font-bold">
                <span className="text-foreground">Total Tagihan Invoice:</span>
                <span className="text-primary text-base font-display">{formatIDR(totalPrice)}</span>
              </div>
            </div>

            {/* Payment Status & Method */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs text-muted-foreground font-body mb-1">
                  Status Pembayaran *
                </label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  className="w-full h-10 rounded-xl border border-border bg-background px-3 font-body text-xs text-foreground focus:ring-2 focus:ring-primary/20"
                >
                  <option value="dibayar">Lunas (100% Dibayar)</option>
                  <option value="dp">Uang Muka / DP (Sebagian)</option>
                  <option value="belum_bayar">Belum Bayar (Pay at Hotel / Check-in)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-muted-foreground font-body mb-1">
                  Metode Pembayaran
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full h-10 rounded-xl border border-border bg-background px-3 font-body text-xs text-foreground focus:ring-2 focus:ring-primary/20"
                >
                  <option value="Tunai / Kasir">Tunai / Kasir Resepsionis</option>
                  <option value="Transfer BCA">Transfer Bank BCA</option>
                  <option value="Transfer Mandiri">Transfer Bank Mandiri</option>
                  <option value="Transfer BRI">Transfer Bank BRI</option>
                  <option value="QRIS">QRIS Kasir</option>
                  <option value="Debit / Kartu Kredit">Kartu Debit / Kredit (EDC)</option>
                  <option value="OTA Virtual Card">OTA Virtual Card / Kolektif OTA</option>
                </select>
              </div>
            </div>

            {/* If DP is selected, show nominal input */}
            {paymentStatus === 'dp' && (
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in fade-in">
                <div>
                  <label className="block text-xs font-semibold text-amber-900 mb-1">
                    Nominal Uang Muka / DP Diterima (Rp) *
                  </label>
                  <Input
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(Number(e.target.value))}
                    className="bg-white"
                    placeholder="Contoh: 200000"
                    required
                  />
                </div>
                <div className="flex flex-col justify-center text-xs font-body text-amber-800">
                  <span>Sisa Tagihan yang Belum Lunas:</span>
                  <span className="font-display font-bold text-sm text-amber-950">
                    {formatIDR(balanceDue)}
                  </span>
                  <span className="text-[10px] text-amber-700">Dilunasi saat tamu tiba / check-in.</span>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 6: CATATAN TAMU */}
          <div className="pt-2 border-t border-border">
            <Input
              label="Catatan Khusus / Permintaan Tamu"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Tamu late check-in pk 22.00, butuh extra bantal."
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row justify-end gap-3 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" className="gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Simpan & Terbitkan Invoice
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
import { useState } from 'react';
import {
  Search,
  Filter,
  MoreVertical,
  Check,
  X,
  Trash2,
  Calendar,
  Phone,
  Plus,
  FileText,
  Printer,
  Globe,
  Tag,
} from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { formatIDR, formatDate } from '../../lib/format';
import {
  STATUS_LABELS,
  STATUS_COLORS,
  PAYMENT_STATUS_LABELS,
  PAYMENT_STATUS_COLORS,
  getChannelInfo,
} from '../../lib/bookingStatus';
import InvoiceModal from './InvoiceModal';

export default function BookingsTable({
  bookings = [],
  onUpdateStatus,
  onDeleteBooking,
  onNewBooking,
}) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('semua');
  const [channelFilter, setChannelFilter] = useState('semua');
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const filtered = bookings.filter((b) => {
    const matchStatus = statusFilter === 'semua' || b.status === statusFilter;

    let matchChannel = true;
    if (channelFilter === 'direct') {
      matchChannel = !b.source || b.source.startsWith('direct_') || b.source === 'pms' || b.source === 'jajapin';
    } else if (channelFilter === 'ota') {
      matchChannel = b.source && b.source.startsWith('ota_');
    } else if (channelFilter === 'whatsapp') {
      matchChannel = b.source === 'direct_whatsapp';
    }

    const matchSearch =
      b.guest_name?.toLowerCase().includes(search.toLowerCase()) ||
      b.booking_code?.toLowerCase().includes(search.toLowerCase()) ||
      b.property_name?.toLowerCase().includes(search.toLowerCase()) ||
      b.ota_booking_id?.toLowerCase().includes(search.toLowerCase());

    return matchStatus && matchChannel && matchSearch;
  });

  return (
    <>
      <Card className="border-border bg-card">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="font-display font-semibold text-lg text-foreground">
                Daftar Reservasi & Pemesanan
              </h3>
              <p className="text-xs text-muted-foreground font-body">
                Kelola reservasi real-time dari Direct Booking, Walk-in, WhatsApp, dan Channel OTA (Traveloka, Tiket, Booking.com, dll.)
              </p>
            </div>
            {onNewBooking && (
              <Button size="sm" onClick={onNewBooking} className="gap-1.5">
                <Plus className="w-4 h-4" /> Tambah Reservasi
              </Button>
            )}
          </div>

          {/* Filters & Search */}
          <div className="space-y-3 mb-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari kode booking, nama tamu, no. referensi OTA, properti..."
                  className="w-full h-10 pl-10 pr-4 rounded-xl border border-border bg-background text-xs font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Status Filter */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {['semua', 'menunggu', 'dikonfirmasi', 'selesai', 'dibatalkan'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-body font-medium capitalize transition-colors whitespace-nowrap ${
                      statusFilter === st
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted/60 text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Channel Source Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto text-xs font-body pt-1">
              <span className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider shrink-0">
                Saluran:
              </span>
              {[
                { id: 'semua', label: 'Semua Saluran' },
                { id: 'direct', label: 'Direct Booking & Kasir' },
                { id: 'whatsapp', label: 'WhatsApp' },
                { id: 'ota', label: 'OTA (Traveloka, Tiket, Booking, dll)' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setChannelFilter(item.id)}
                  className={`px-2.5 py-1 rounded-lg border text-xs transition-colors whitespace-nowrap ${
                    channelFilter === item.id
                      ? 'border-primary bg-primary/10 text-primary font-semibold'
                      : 'border-border text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto -mx-6">
            <table className="w-full text-left text-xs font-body">
              <thead className="bg-muted/40 text-[10px] uppercase tracking-wider text-muted-foreground border-y border-border">
                <tr>
                  <th className="py-3 px-6">Tamu & Saluran</th>
                  <th className="py-3 px-4">Properti & Kamar</th>
                  <th className="py-3 px-4">Jadwal Menginap</th>
                  <th className="py-3 px-4">Tagihan & Invoice</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-muted-foreground">
                      Tidak ada reservasi yang cocok dengan kriteria pencarian.
                    </td>
                  </tr>
                ) : (
                  filtered.map((b) => {
                    const channel = getChannelInfo(b.source);
                    return (
                      <tr key={b.booking_code} className="hover:bg-muted/20 transition-colors">
                        <td className="py-3.5 px-6">
                          <div className="font-semibold text-foreground text-sm flex items-center gap-2">
                            <span>{b.guest_name}</span>
                            <span
                              className={`px-2 py-0.5 rounded-md border text-[10px] ${channel.badgeClass}`}
                            >
                              {channel.name}
                            </span>
                          </div>
                          <div className="font-mono text-[11px] text-primary mt-0.5">
                            {b.booking_code}
                          </div>
                          {b.ota_booking_id && (
                            <div className="text-[10px] text-sky-800 font-medium">
                              Ref OTA: {b.ota_booking_id}
                            </div>
                          )}
                          <div className="text-[11px] text-muted-foreground mt-0.5">
                            {b.guest_phone || b.guest_email}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-medium text-foreground">
                          {b.property_name}
                          <span className="block text-[11px] text-muted-foreground font-normal">
                            {b.room_type || 'Deluxe Room'}{' '}
                            {b.room_number ? `(Unit ${b.room_number})` : ''} • {b.property_city}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="text-foreground font-medium">{formatDate(b.check_in)}</div>
                          <div className="text-muted-foreground text-[11px]">
                            s.d. {formatDate(b.check_out)} ({b.nights || 1} mlm)
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-foreground text-sm">
                            {formatIDR(b.total_price)}
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider ${
                                PAYMENT_STATUS_COLORS[b.payment_status] || 'bg-muted text-foreground'
                              }`}
                            >
                              {PAYMENT_STATUS_LABELS[b.payment_status] || b.payment_status}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <Badge className={STATUS_COLORS[b.status] || 'bg-muted'}>
                            {STATUS_LABELS[b.status] || b.status}
                          </Badge>
                        </td>
                        <td className="py-3.5 px-6 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Tombol Invoice */}
                            <button
                              title="Lihat / Cetak Invoice"
                              onClick={() => setSelectedInvoice(b)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-medium text-xs"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>Invoice</span>
                            </button>

                            {/* Status Change Buttons */}
                            {b.status === 'menunggu' && (
                              <button
                                title="Konfirmasi Reservasi"
                                onClick={() => onUpdateStatus(b.booking_code, 'dikonfirmasi')}
                                className="p-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {b.status === 'dikonfirmasi' && (
                              <button
                                title="Tandai Selesai"
                                onClick={() => onUpdateStatus(b.booking_code, 'selesai')}
                                className="p-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors text-[11px] px-2 font-medium"
                              >
                                Selesai
                              </button>
                            )}
                            {b.status !== 'dibatalkan' && (
                              <button
                                title="Batalkan"
                                onClick={() => onUpdateStatus(b.booking_code, 'dibatalkan')}
                                className="p-1.5 rounded-lg bg-yellow-50 text-yellow-700 hover:bg-yellow-100 transition-colors"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button
                              title="Hapus Data"
                              onClick={() => onDeleteBooking(b.booking_code)}
                              className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Invoice Modal Component */}
      <InvoiceModal
        isOpen={!!selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        booking={selectedInvoice}
      />
    </>
  );
}
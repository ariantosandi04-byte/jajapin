import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users as UsersIcon, ArrowRight, Ban, FileText } from 'lucide-react';
import SiteHeader from '../components/site/SiteHeader';
import SiteFooter from '../components/site/SiteFooter';
import InvoiceModal from '../components/dashboard/InvoiceModal';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { getBookings, STATUS_LABELS, STATUS_COLORS, PAYMENT_STATUS_LABELS } from '../lib/bookingStatus';
import { formatIDR, formatDate } from '../lib/format';

export default function BookingsPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState('semua');
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const bookings = useMemo(() => {
    return getBookings(user?.email);
  }, [user, refreshKey]);

  const filteredBookings = useMemo(() => {
    if (filter === 'semua') return bookings;
    return bookings.filter((b) => b.status === filter);
  }, [bookings, filter]);

  const handleCancelBooking = (bookingCode) => {
    if (window.confirm(`Batalkan pemesanan dengan kode ${bookingCode}?`)) {
      const all = JSON.parse(localStorage.getItem('jajapin_bookings') || '[]');
      const updated = all.map((b) =>
        b.booking_code === bookingCode ? { ...b, status: 'dibatalkan' } : b
      );
      localStorage.setItem('jajapin_bookings', JSON.stringify(updated));
      setRefreshKey((k) => k + 1);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <p className="text-[11px] uppercase tracking-[0.24em] font-body font-semibold text-muted-foreground mb-1">
                Riwayat Perjalanan
              </p>
              <h1 className="font-display font-light text-3xl sm:text-4xl tracking-tight text-foreground">
                Booking Saya
              </h1>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
              {['semua', 'menunggu', 'dikonfirmasi', 'selesai', 'dibatalkan'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-1.5 rounded-full text-xs font-body font-semibold capitalize whitespace-nowrap transition-colors ${
                    filter === status
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card border border-border text-muted-foreground hover:bg-secondary'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {filteredBookings.length === 0 ? (
            <div className="text-center py-20 bg-card rounded-3xl border border-border p-8">
              <p className="font-display text-xl text-foreground mb-2">
                {filter === 'semua' ? 'Belum ada riwayat booking' : `Tidak ada booking berstatus "${filter}"`}
              </p>
              <p className="font-body text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
                Mulai jelajahi hotel, homestay, villa, dan resort pilihan terbaik di Indonesia.
              </p>
              <Link to="/stays">
                <Button>Cari Penginapan</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((b) => (
                <Card key={b.booking_code} className="border-border hover:shadow-md transition-shadow">
                  <CardContent className="p-5 sm:p-6">
                    <div className="flex flex-col sm:flex-row gap-5">
                      <img
                        src={b.property_image}
                        alt={b.property_name}
                        className="w-full sm:w-36 h-28 object-cover rounded-2xl shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div>
                            <h3 className="font-display font-semibold text-lg text-foreground truncate">
                              {b.property_name}
                            </h3>
                            <p className="text-xs text-muted-foreground font-body flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3.5 h-3.5" /> {b.property_city}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={STATUS_COLORS[b.status] || 'bg-muted'}>
                              {STATUS_LABELS[b.status] || b.status}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-4 text-xs font-body text-muted-foreground py-2 border-y border-border/60 my-2">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-primary" /> {formatDate(b.check_in)} — {formatDate(b.check_out)}
                          </span>
                          <span className="flex items-center gap-1">
                            <UsersIcon className="w-3.5 h-3.5 text-primary" /> {b.guests} tamu ({b.nights} malam)
                          </span>
                          <span>
                            Pembayaran: <strong className="text-foreground">{PAYMENT_STATUS_LABELS[b.payment_status] || b.payment_status}</strong>
                          </span>
                        </div>

                        <div className="flex items-center justify-between mt-3 pt-1">
                          <div>
                            <span className="text-xs text-muted-foreground font-body block">Total Biaya</span>
                            <span className="font-display font-bold text-lg text-primary">
                              {formatIDR(b.total_price)}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {b.status !== 'dibatalkan' && b.status !== 'selesai' && (
                              <button
                                onClick={() => handleCancelBooking(b.booking_code)}
                                className="text-xs text-red-500 hover:text-red-700 font-body font-medium px-3 py-1.5 rounded-full hover:bg-red-50 transition-colors flex items-center gap-1"
                              >
                                <Ban className="w-3.5 h-3.5" /> Batalkan
                              </button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedInvoice(b)}
                              className="text-xs"
                            >
                              <FileText className="w-3.5 h-3.5 mr-1" /> Invoice
                            </Button>
                            <Link to={`/konfirmasi/${b.booking_code}`}>
                              <Button size="sm" variant="outline">
                                Detail <ArrowRight className="w-3.5 h-3.5 ml-1" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      <InvoiceModal
        isOpen={!!selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        booking={selectedInvoice}
      />
      <SiteFooter />
    </div>
  );
}

import { useState, useMemo } from 'react';
import {
  FileSpreadsheet,
  Printer,
  Share2,
  CheckCircle2,
  AlertCircle,
  Building,
  Calendar,
  CreditCard,
  DollarSign,
  TrendingUp,
  Download,
  FileText,
  User,
  ArrowRight,
  Clock,
  Send,
  Check,
} from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { formatIDR, formatDateLong, formatDate } from '../../lib/format';
import { PAYMENT_STATUS_LABELS, PAYMENT_STATUS_COLORS } from '../../lib/bookingStatus';
import InvoiceModal from './InvoiceModal';

export default function OwnerPayoutPanel({ bookings = [], propertyName = 'Jajapin Hotel Putri Sari' }) {
  const [selectedDate, setSelectedDate] = useState('semua');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [payoutStatus, setPayoutStatus] = useState('pending'); // 'pending' | 'disbursed'
  const [transferRef, setTransferRef] = useState('');
  const [showTransferModal, setShowTransferModal] = useState(false);

  // Filter bookings for this payout period (2 - 8 November 2026)
  const payoutBookings = useMemo(() => {
    return bookings.filter((b) => {
      const isNovPeriod = b.booking_code?.startsWith('JP-NOV') || (b.check_in >= '2026-11-02' && b.check_in <= '2026-11-08');
      if (!isNovPeriod) return false;
      if (selectedDate === 'semua') return true;
      return b.check_in === selectedDate || b.payout_date === selectedDate;
    });
  }, [bookings, selectedDate]);

  // Overall Financial Calculations for the full period
  const totalStats = useMemo(() => {
    const allNov = bookings.filter(
      (b) => b.booking_code?.startsWith('JP-NOV') || (b.check_in >= '2026-11-02' && b.check_in <= '2026-11-08')
    );

    const totalGross = allNov.reduce((acc, b) => acc + (b.total_price || 0), 0);
    const totalCollected = allNov.reduce((acc, b) => acc + (b.amount_paid || 0), 0);
    const totalPending = allNov.reduce((acc, b) => acc + (b.balance_due || 0), 0);
    const platformFee = 0; // 0% Promo Mitra
    const netPayout = totalCollected - platformFee;

    return {
      count: allNov.length,
      totalGross,
      totalCollected,
      totalPending,
      platformFee,
      netPayout,
    };
  }, [bookings]);

  // Daily Breakdown counts
  const datesList = [
    { id: 'semua', label: 'Semua (2 - 8 Nov)', dateStr: 'semua' },
    { id: '2026-11-02', label: '2 Nov', dateStr: '2026-11-02' },
    { id: '2026-11-03', label: '3 Nov', dateStr: '2026-11-03' },
    { id: '2026-11-04', label: '4 Nov', dateStr: '2026-11-04' },
    { id: '2026-11-05', label: '5 Nov', dateStr: '2026-11-05' },
    { id: '2026-11-06', label: '6 Nov', dateStr: '2026-11-06' },
    { id: '2026-11-07', label: '7 Nov', dateStr: '2026-11-07' },
    { id: '2026-11-08', label: '8 Nov', dateStr: '2026-11-08' },
  ];

  const handlePrint = () => {
    window.print();
  };

  const handleShareWA = () => {
    const msg =
      `*REKAPITULASI PAYOUT PEMILIK PROPERTI*\n` +
      `Properti: ${propertyName}\n` +
      `Periode: 2 - 8 November 2026\n` +
      `--------------------------------\n` +
      `Total Booking: ${totalStats.count} Transaksi\n` +
      `Penerimaan Kotor: ${formatIDR(totalStats.totalGross)}\n` +
      `Dana Setoran Terkumpul: ${formatIDR(totalStats.totalCollected)}\n` +
      `Sisa Bayar di Tempat: ${formatIDR(totalStats.totalPending)}\n` +
      `Komisi Jajapin (0% Promo): Rp 0\n` +
      `--------------------------------\n` +
      `*TOTAL DANA SIAP PAYOUT: ${formatIDR(totalStats.netPayout)}*\n` +
      `Rekening Tujuan: BCA 7310-9182-441 a.n. Pemilik Properti\n` +
      `Status: ${payoutStatus === 'disbursed' ? 'SUDAH DITRANSFER ✅' : 'SIAP DITRANSFER / PENDING ⏳'}\n` +
      `--------------------------------\n` +
      `Laporan resmi Super Admin Jajapin PMS.`;

    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <Card className="border-border bg-card overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-[#0a2f18] to-[#144728] text-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-brand-lime font-body">
                  Super Admin • Rekapitulasi & Payout Owner
                </span>
              </div>
              <h2 className="font-display font-semibold text-2xl text-white">
                Rekapitulasi Booking & Payout Pemilik
              </h2>
              <p className="text-xs text-white/80 font-body max-w-xl mt-1">
                Rekapitulasi 43 transaksi pemesanan tamu periode <strong>2 – 8 November 2026</strong> untuk pencairan dana (*payout settlement*) ke pemilik {propertyName}.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={handleShareWA}
                className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5 text-green-300" /> Kirim Rekap WA
              </Button>
              <Button
                size="sm"
                onClick={handlePrint}
                className="bg-brand-lime text-[#0a2f18] hover:bg-brand-lime/90 font-semibold shadow-lg text-xs gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" /> Cetak Slip Payout
              </Button>
            </div>
          </div>
        </div>

        {/* Financial Stat Cards */}
        <div className="p-6 bg-card border-b border-border grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-muted/40 border border-border">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-body font-bold block">
              Total Booking Masuk
            </span>
            <span className="font-display font-bold text-2xl text-foreground block mt-1">
              {totalStats.count} Transaksi
            </span>
            <span className="text-[11px] text-muted-foreground font-body">Periode 2 - 8 Nov 2026</span>
          </div>

          <div className="p-4 rounded-2xl bg-muted/40 border border-border">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-body font-bold block">
              Penerimaan Kotor (Gross)
            </span>
            <span className="font-display font-bold text-2xl text-foreground block mt-1">
              {formatIDR(totalStats.totalGross)}
            </span>
            <span className="text-[11px] text-muted-foreground font-body">Nilai seluruh sewa & fee</span>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
            <span className="text-[10px] uppercase tracking-wider text-emerald-800 font-body font-bold block">
              Setoran Terkumpul (Cash In)
            </span>
            <span className="font-display font-bold text-2xl text-emerald-800 block mt-1">
              {formatIDR(totalStats.totalCollected)}
            </span>
            <span className="text-[11px] text-emerald-700 font-body">Sudah disetor tamu ✅</span>
          </div>

          <div className="p-4 rounded-2xl bg-brand-forest text-white">
            <span className="text-[10px] uppercase tracking-wider text-brand-lime font-body font-bold block">
              Net Payout ke Owner
            </span>
            <span className="font-display font-bold text-2xl text-white block mt-1">
              {formatIDR(totalStats.netPayout)}
            </span>
            <span className="text-[11px] text-white/80 font-body">Siap dicairkan / ditransfer</span>
          </div>
        </div>

        {/* Bank & Settlement Disbursement Card */}
        <div className="p-6 bg-card border-b border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-sm text-foreground">
                  Rekening Payout Pemilik: Bank BCA
                </h4>
                {payoutStatus === 'disbursed' ? (
                  <Badge variant="lime" className="text-[10px]">
                    ✓ SUDAH DITRANSFER
                  </Badge>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                    ⏳ SIAP DITRANSFER (PENDING)
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground font-body mt-0.5">
                No. Rek: <strong className="text-foreground font-mono">7310-9182-441</strong> a.n.{' '}
                <strong className="text-foreground">Pemilik Mitra {propertyName}</strong>
              </p>
              {transferRef && (
                <p className="text-[11px] text-emerald-700 font-mono mt-0.5">
                  Ref Bank: {transferRef}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {payoutStatus === 'pending' ? (
              <Button
                onClick={() => setShowTransferModal(true)}
                className="gap-1.5 text-xs bg-emerald-700 hover:bg-emerald-800"
              >
                <CheckCircle2 className="w-4 h-4" /> Proses Transfer Payout ke Owner
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPayoutStatus('pending')}
                className="text-xs"
              >
                Reset Status Payout
              </Button>
            )}
          </div>
        </div>

        {/* Daily Filter Tabs */}
        <div className="flex border-b border-border bg-muted/20 px-6 gap-1.5 overflow-x-auto text-xs font-body py-2">
          {datesList.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedDate(tab.dateStr)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
                selectedDate === tab.dateStr
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </Card>

      {/* Transaction Table */}
      <Card className="border-border bg-card">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="font-display font-semibold text-base text-foreground">
                Daftar Rincian Setoran Tamu ({payoutBookings.length} Transaksi)
              </h3>
              <p className="text-xs text-muted-foreground font-body">
                Data diverifikasi oleh resepsionis kasir untuk pencairan bagi hasil ke pemilik.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto -mx-6">
            <table className="w-full text-left text-xs font-body">
              <thead className="bg-muted/40 text-[10px] uppercase tracking-wider text-muted-foreground border-y border-border">
                <tr>
                  <th className="py-3 px-6">No & Tanggal</th>
                  <th className="py-3 px-4">Nama Tamu / Layanan</th>
                  <th className="py-3 px-4">Tipe Kamar / Unit</th>
                  <th className="py-3 px-4">Durasi & Catatan</th>
                  <th className="py-3 px-4">Status Setoran</th>
                  <th className="py-3 px-4 text-right">Nominal Setor</th>
                  <th className="py-3 px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {payoutBookings.map((b, idx) => (
                  <tr key={b.booking_code} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-6">
                      <div className="font-semibold text-foreground">{idx + 1}</div>
                      <div className="text-[10px] text-muted-foreground font-mono">
                        {formatDate(b.check_in)}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-foreground text-sm">{b.guest_name}</div>
                      <div className="font-mono text-[10px] text-primary">{b.booking_code}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-foreground">{b.room_type}</div>
                      <div className="text-[10px] text-muted-foreground">Unit: {b.room_number}</div>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">
                      <div>{b.nights > 1 ? `${b.nights} Malam` : '1 Malam'}</div>
                      <div className="text-[10px] text-emerald-700 font-medium">{b.notes}</div>
                    </td>
                    <td className="py-3 px-4">
                      {b.payment_status === 'dibayar' ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          ✓ Setor Lunas
                        </span>
                      ) : b.payment_status === 'dp' ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                          ⚠ DP (Sisa {formatIDR(b.balance_due)})
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                          Bayar di Tempat
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-foreground text-sm">
                      {formatIDR(b.amount_paid > 0 ? b.amount_paid : b.total_price)}
                    </td>
                    <td className="py-3 px-6 text-right">
                      <button
                        onClick={() => setSelectedInvoice(b)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 text-xs font-semibold"
                        title="Buka Invoice"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Invoice</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Transfer Payout Confirmation Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card w-full max-w-md rounded-3xl border border-border p-6 shadow-2xl space-y-4 font-body">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-display font-semibold text-lg text-foreground">
                Konfirmasi Transfer Payout
              </h3>
              <button
                onClick={() => setShowTransferModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-muted/40 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Penerima:</span>
                <span className="font-bold text-foreground">Pemilik {propertyName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Rekening Tujuan:</span>
                <span className="font-mono font-bold text-foreground">BCA 7310-9182-441</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Dana Dicairkan:</span>
                <span className="font-display font-bold text-base text-primary">
                  {formatIDR(totalStats.netPayout)}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Nomor Referensi Transfer Bank / Catatan Payout:
              </label>
              <input
                type="text"
                placeholder="Contoh: BCA-TRX-9182901 / Payout Nov Minggu 1"
                value={transferRef}
                onChange={(e) => setTransferRef(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-border bg-background text-xs font-body focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="pt-2 flex gap-3">
              <Button
                variant="outline"
                className="w-1/2 text-xs"
                onClick={() => setShowTransferModal(false)}
              >
                Batal
              </Button>
              <Button
                className="w-1/2 text-xs gap-1.5 bg-emerald-700 hover:bg-emerald-800"
                onClick={() => {
                  setPayoutStatus('disbursed');
                  if (!transferRef) setTransferRef(`PAYOUT-BCA-${Date.now().toString().slice(-6)}`);
                  setShowTransferModal(false);
                }}
              >
                <Check className="w-4 h-4" /> Selesaikan Payout
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Modal Instance */}
      <InvoiceModal
        isOpen={!!selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        booking={selectedInvoice}
      />
    </div>
  );
}
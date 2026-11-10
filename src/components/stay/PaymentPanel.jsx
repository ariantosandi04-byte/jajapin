import { CreditCard, QrCode, Building, Wallet, Check, ShieldCheck, Zap, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';

export const midtransSubChannels = [
  {
    id: 'midtrans_qris',
    name: 'QRIS Instan (Semua Bank & Dompet Digital)',
    subtitle: 'BCA, Mandiri, BRI, BNI, GoPay, OVO, ShopeePay, DANA',
    icon: QrCode,
    badge: 'Langsung Ter-Lock',
  },
  {
    id: 'midtrans_va',
    name: 'Virtual Account Bank Otomatis',
    subtitle: 'BCA, Mandiri, BRI, BNI, Permata, CIMB Niaga',
    icon: Building,
    badge: 'Konfirmasi 1 Detik',
  },
  {
    id: 'midtrans_ewallet',
    name: 'GoPay & ShopeePay',
    subtitle: 'Bayar instan via aplikasi dompet digital di ponsel Anda',
    icon: Wallet,
    badge: 'Praktis',
  },
  {
    id: 'midtrans_cc',
    name: 'Kartu Kredit / Debit Online',
    subtitle: 'Visa, MasterCard, JCB dengan proteksi 3D Secure 256-bit',
    icon: CreditCard,
    badge: '3D Secure',
  },
];

export default function PaymentPanel({
  gateway = 'midtrans',
  onGatewayChange,
  selectedMethod = 'midtrans_snap',
  onSelectMethod,
}) {
  return (
    <Card className="border-border">
      <CardContent className="p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
          <div>
            <h3 className="font-display font-semibold text-lg text-foreground flex items-center gap-2">
              Pilihan Metode Pembayaran
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Resmi & Aman
              </span>
            </h3>
            <p className="text-xs text-muted-foreground font-body">
              Pilih cara pembayaran yang paling nyaman untuk Anda
            </p>
          </div>

          {/* Selector 2 Metode Utama: Midtrans & Bayar di Tempat */}
          <div className="flex items-center gap-1 p-1 bg-muted/60 rounded-2xl border border-border text-xs font-body shrink-0">
            <button
              type="button"
              onClick={() => {
                onGatewayChange?.('midtrans');
                onSelectMethod?.('midtrans_snap');
              }}
              className={`px-3.5 py-2 rounded-xl transition-all font-semibold flex items-center gap-1.5 ${
                gateway === 'midtrans'
                  ? 'bg-card text-emerald-700 dark:text-emerald-400 shadow-sm border border-border'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-emerald-600" />
              <span>Midtrans (Online)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onGatewayChange?.('hotel');
                onSelectMethod?.('hotel');
              }}
              className={`px-3.5 py-2 rounded-xl transition-all font-semibold flex items-center gap-1.5 ${
                gateway === 'hotel'
                  ? 'bg-card text-amber-700 dark:text-amber-400 shadow-sm border border-border'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Building className="w-3.5 h-3.5 text-amber-600" />
              <span>Bayar di Tempat</span>
            </button>
          </div>
        </div>

        {/* 1. METODE MIDTRANS (ONLINE & LANGSUNG LOCK KAMAR) */}
        {gateway === 'midtrans' && (
          <div className="space-y-4">
            {/* Banner Jaminan Lock Kamar */}
            <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200 text-xs space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-emerald-800 dark:text-emerald-300">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>KAMAR LANGSUNG TER-LOCK 100% SETELAH PEMBAYARAN</span>
              </div>
              <p className="leading-relaxed text-emerald-900/90 dark:text-emerald-300/90">
                Pembayaran via <strong>Midtrans</strong> langsung mengonfirmasi dan mengunci (lock) kamar Anda di sistem hotel, bebas dari risiko kamar diambil atau dibatalkan sepihak.
              </p>
            </div>

            {/* Tombol Pilihan Midtrans Snap */}
            <div
              onClick={() => onSelectMethod?.('midtrans_snap')}
              className="p-4 rounded-2xl border-2 border-emerald-600 bg-emerald-50/40 dark:bg-emerald-950/20 cursor-pointer transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-foreground">
                      Midtrans Payment Gateway (Otomatis & Terverifikasi)
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Pilihan lengkap: QRIS, Virtual Account semua bank, GoPay, ShopeePay, dan Kartu Kredit.
                    </p>
                  </div>
                </div>
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              </div>

              {/* Sub-channel highlight icons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-border/60">
                {midtransSubChannels.map((sub) => {
                  const SubIcon = sub.icon;
                  return (
                    <div
                      key={sub.id}
                      className="p-2.5 rounded-xl bg-card border border-border/80 flex items-center gap-2.5 text-xs"
                    >
                      <SubIcon className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div className="min-w-0">
                        <span className="font-medium text-foreground block truncate">{sub.name}</span>
                        <span className="text-[10px] text-muted-foreground block truncate">{sub.subtitle}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 2. METODE BAYAR DI TEMPAT (CATATAN: BELUM DIKONFIRMASI / BELUM LOCK) */}
        {gateway === 'hotel' && (
          <div className="space-y-4">
            {/* Banner Peringatan Kritis: Belum Dikonfirmasi / Lock */}
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border-2 border-amber-400 dark:border-amber-700 text-amber-950 dark:text-amber-200 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-200 text-sm">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                <span>CATATAN PENTING: BOOKING BELUM DIKONFIRMASI / TER-LOCK</span>
              </div>
              <p className="leading-relaxed font-medium">
                Pemesanan dengan metode <strong>Bayar di Tempat</strong> berstatus <strong className="underline">Menunggu Pembayaran</strong> dan <strong className="underline">KAMAR BELUM TER-LOCK</strong> sebelum ada pembayaran diterima oleh penginapan.
              </p>
              <div className="p-3 rounded-xl bg-amber-100/70 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-800 space-y-1">
                <p className="font-semibold text-amber-900 dark:text-amber-100">
                  ⚠️ Ketentuan Pengalihan Kamar:
                </p>
                <ul className="list-disc pl-4 space-y-0.5 text-amber-800 dark:text-amber-200 text-[11px]">
                  <li>Ketersediaan kamar sewaktu-waktu dapat dialihkan kepada tamu lain yang membayar lunas lebih dahulu jika penginapan penuh.</li>
                  <li>Harap hubungi nomor kontak penginapan setelah pemesanan untuk konfirmasi perkiraan jam kedatangan Anda.</li>
                  <li>Jika ingin kamar <strong>pasti aman dan ter-lock 100%</strong>, disarankan menggunakan metode pembayaran online <strong>Midtrans</strong>.</li>
                </ul>
              </div>
            </div>

            {/* Tombol Konfirmasi Bayar di Tempat */}
            <div
              onClick={() => onSelectMethod?.('hotel')}
              className="p-4 rounded-2xl border-2 border-amber-500 bg-amber-50/30 dark:bg-amber-950/20 cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-foreground">
                    Bayar saat Check-in (di Resepsionis Hotel)
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Bayar tunai atau transfer saat tiba. (Booking belum ter-lock sampai pembayaran dilakukan).
                  </p>
                </div>
              </div>
              <div className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center shrink-0">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            </div>
          </div>
        )}

        {/* Jaminan Keamanan Standar Bank */}
        <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] text-muted-foreground font-body border-t border-border/60">
          <span className="flex items-center gap-1">
            🔒 Keamanan Pembayaran Bersertifikasi Resmi Bank Indonesia & PCI-DSS
          </span>
          <span className="text-emerald-700 font-semibold">Harga Jujur Bersih Tanpa Biaya Tersembunyi</span>
        </div>
      </CardContent>
    </Card>
  );
}

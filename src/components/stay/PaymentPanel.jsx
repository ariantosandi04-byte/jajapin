import { CreditCard, QrCode, Building, Wallet, Check, ShieldCheck, Zap } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';

export const xenditChannels = [
  {
    id: 'xendit_qris',
    name: 'QRIS Instan (Semua Bank & E-Wallet)',
    subtitle: 'BCA, Mandiri, BRI, BNI, GoPay, OVO, ShopeePay, DANA',
    icon: QrCode,
    badge: 'Instan Otomatis',
    badgeVariant: 'lime',
  },
  {
    id: 'xendit_va',
    name: 'Virtual Account Bank',
    subtitle: 'BCA, Mandiri, BRI, BNI, Permata, BSI (Konfirmasi 1 Detik)',
    icon: Building,
    badge: 'Bebas Antre',
    badgeVariant: 'default',
  },
  {
    id: 'xendit_ewallet',
    name: 'E-Wallet (DANA, OVO, ShopeePay)',
    subtitle: 'Buka langsung aplikasi dompet digital favorit Anda',
    icon: Wallet,
    badge: 'Praktis',
    badgeVariant: 'default',
  },
  {
    id: 'xendit_cc',
    name: 'Kartu Kredit / Debit Online',
    subtitle: 'Visa, MasterCard, JCB dengan proteksi 3D Secure 256-bit',
    icon: CreditCard,
    badge: '3D Secure',
    badgeVariant: 'default',
  },
];

export const alternativeMethods = [
  {
    id: 'midtrans_snap',
    name: 'Midtrans Snap Gateway',
    subtitle: 'Alternatif pembayaran via pop-up Midtrans',
    icon: Zap,
    badge: 'Midtrans',
    gateway: 'midtrans',
  },
  {
    id: 'hotel',
    name: 'Bayar saat Check-in (di Properti)',
    subtitle: 'Bayar tunai atau transfer langsung saat tiba di meja resepsionis',
    icon: Building,
    badge: 'Fleksibel',
    gateway: 'hotel',
  },
];

export default function PaymentPanel({
  gateway = 'xendit',
  onGatewayChange,
  selectedMethod = 'xendit_qris',
  onSelectMethod,
}) {
  return (
    <Card className="border-border">
      <CardContent className="p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border">
          <div>
            <h3 className="font-display font-semibold text-lg text-foreground flex items-center gap-2">
              Metode Pembayaran
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Resmi & Terverifikasi
              </span>
            </h3>
            <p className="text-xs text-muted-foreground font-body">
              Diproses aman melalui Payment Gateway berlisensi Bank Indonesia
            </p>
          </div>

          {/* Selector Gateway Tab */}
          <div className="flex items-center gap-1 p-1 bg-muted/60 rounded-xl border border-border text-xs font-body shrink-0">
            <button
              type="button"
              onClick={() => {
                onGatewayChange?.('xendit');
                if (!selectedMethod.startsWith('xendit')) onSelectMethod?.('xendit_qris');
              }}
              className={`px-3 py-1.5 rounded-lg transition-all font-medium ${
                gateway === 'xendit'
                  ? 'bg-card text-foreground shadow-sm font-semibold text-emerald-700 dark:text-emerald-400'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              ⚡ Xendit (Utama)
            </button>
            <button
              type="button"
              onClick={() => {
                onGatewayChange?.('midtrans');
                onSelectMethod?.('midtrans_snap');
              }}
              className={`px-3 py-1.5 rounded-lg transition-all font-medium ${
                gateway === 'midtrans'
                  ? 'bg-card text-foreground shadow-sm font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Midtrans
            </button>
            <button
              type="button"
              onClick={() => {
                onGatewayChange?.('hotel');
                onSelectMethod?.('hotel');
              }}
              className={`px-3 py-1.5 rounded-lg transition-all font-medium ${
                gateway === 'hotel'
                  ? 'bg-card text-foreground shadow-sm font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Bayar di Hotel
            </button>
          </div>
        </div>

        {/* Xendit Channel Options */}
        {gateway === 'xendit' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground font-body">
              <span>Pilih kanal pembayaran Xendit:</span>
              <span className="text-emerald-700 font-semibold text-[11px] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Xendit Invoice V2 Ready
              </span>
            </div>

            <div className="space-y-2.5">
              {xenditChannels.map((channel) => {
                const Icon = channel.icon;
                const isSelected = selectedMethod === channel.id;
                return (
                  <button
                    key={channel.id}
                    type="button"
                    onClick={() => onSelectMethod(channel.id)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/20 ring-1 ring-emerald-500'
                        : 'border-border bg-card hover:bg-secondary/40'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-emerald-600 text-white' : 'bg-muted text-foreground'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-body text-sm font-semibold text-foreground">
                            {channel.name}
                          </span>
                          <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                            {channel.badge}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground font-body block mt-0.5">
                          {channel.subtitle}
                        </span>
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors shrink-0 ml-2 ${
                        isSelected ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-border'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Midtrans Channel */}
        {gateway === 'midtrans' && (
          <div className="space-y-2.5">
            <button
              type="button"
              onClick={() => onSelectMethod('midtrans_snap')}
              className={`w-full flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all ${
                selectedMethod === 'midtrans_snap'
                  ? 'border-primary bg-primary/5 ring-1 ring-primary'
                  : 'border-border bg-card'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-body text-sm font-semibold text-foreground block">
                    Midtrans Snap Gateway (Pop-up Modal)
                  </span>
                  <span className="text-xs text-muted-foreground font-body">
                    Mendukung GoPay, ShopeePay, Indomaret/Alfamart, & Transfer Bank
                  </span>
                </div>
              </div>
              <div className="w-5 h-5 rounded-full border border-primary bg-primary text-white flex items-center justify-center">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
            </button>
          </div>
        )}

        {/* Pay at Hotel */}
        {gateway === 'hotel' && (
          <div className="space-y-2.5">
            <button
              type="button"
              onClick={() => onSelectMethod('hotel')}
              className={`w-full flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all ${
                selectedMethod === 'hotel'
                  ? 'border-primary bg-primary/5 ring-1 ring-primary'
                  : 'border-border bg-card'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-muted text-foreground flex items-center justify-center">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-body text-sm font-semibold text-foreground block">
                    Bayar saat Check-in (di Properti)
                  </span>
                  <span className="text-xs text-muted-foreground font-body">
                    Pemesanan langsung terkonfirmasi, Anda dapat membayar tunai saat tiba.
                  </span>
                </div>
              </div>
              <div className="w-5 h-5 rounded-full border border-primary bg-primary text-white flex items-center justify-center">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
            </button>
          </div>
        )}

        {/* Jaminan Keamanan */}
        <div className="pt-2 flex items-center justify-between text-[11px] text-muted-foreground font-body">
          <span className="flex items-center gap-1">
            🔒 Enkripsi Bank-Grade PCI-DSS Level 1
          </span>
          <span className="text-emerald-700 font-medium">Bebas Biaya Admin Tambahan</span>
        </div>
      </CardContent>
    </Card>
  );
}

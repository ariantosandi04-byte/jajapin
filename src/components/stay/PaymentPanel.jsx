import { useState } from 'react';
import { CreditCard, QrCode, Building, Wallet, Check } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';

const paymentMethods = [
  { id: 'qris', name: 'QRIS (Semua E-Wallet & Bank)', icon: QrCode, badge: 'Instan' },
  { id: 'bca_va', name: 'BCA Virtual Account', icon: Building, badge: 'Otomatis' },
  { id: 'mandiri_va', name: 'Mandiri Virtual Account', icon: Building, badge: 'Otomatis' },
  { id: 'cc', name: 'Kartu Kredit / Debit', icon: CreditCard, badge: 'Visa/Mastercard' },
  { id: 'hotel', name: 'Bayar saat Check-in (di Properti)', icon: Wallet, badge: 'Fleksibel' },
];

export default function PaymentPanel({ selectedMethod, onSelect }) {
  return (
    <Card className="border-border">
      <CardContent className="p-6 space-y-4">
        <div>
          <h3 className="font-display font-semibold text-lg text-foreground">Metode Pembayaran</h3>
          <p className="text-xs text-muted-foreground font-body">Pilih metode yang paling nyaman untuk Anda</p>
        </div>

        <div className="space-y-2.5">
          {paymentMethods.map((m) => {
            const Icon = m.icon;
            const isSelected = selectedMethod === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => onSelect(m.id)}
                className={`w-full flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'border-primary bg-primary/5 ring-1 ring-primary'
                    : 'border-border bg-card hover:bg-secondary/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isSelected ? 'bg-primary text-white' : 'bg-muted text-foreground'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-body text-sm font-medium text-foreground block">{m.name}</span>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-body">{m.badge}</span>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${isSelected ? 'border-primary bg-primary text-white' : 'border-border'}`}>
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

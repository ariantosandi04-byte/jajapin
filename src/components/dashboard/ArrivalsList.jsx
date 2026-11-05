import { Users, LogIn, LogOut, Phone, Calendar } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { formatDate } from '../../lib/format';

export default function ArrivalsList({ arrivals = [], onCheckIn }) {
  return (
    <Card className="border-border bg-card">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-display font-semibold text-lg text-foreground">
              Pergerakan Hari Ini
            </h3>
            <p className="text-xs text-muted-foreground font-body">
              Kedatangan dan kepulangan tamu hari ini
            </p>
          </div>
          <span className="text-xs font-body font-semibold text-primary">
            {arrivals.length} Tamu
          </span>
        </div>

        {arrivals.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground font-body text-sm">
            <Calendar className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p>Tidak ada pergerakan kedatangan/kepulangan hari ini.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {arrivals.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-muted/40 hover:bg-muted/70 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${item.type === 'departure' ? 'bg-accent/10 text-accent' : 'bg-primary/10 text-primary'}`}>
                    {item.type === 'departure' ? <LogOut className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
                  </div>
                  <div>
                    <h4 className="font-body font-semibold text-sm text-foreground">
                      {item.guest_name}
                    </h4>
                    <p className="text-xs text-muted-foreground font-body flex items-center gap-2">
                      <span>{item.property_name}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {item.guest_phone || 'WhatsApp'}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge variant={item.type === 'departure' ? 'accent' : 'lime'}>
                    {item.type === 'departure' ? 'Check-out' : 'Check-in'}
                  </Badge>
                  {item.status === 'menunggu' && onCheckIn && (
                    <button
                      onClick={() => onCheckIn(item.booking_code)}
                      className="text-xs font-body font-semibold text-primary hover:underline"
                    >
                      Konfirmasi Tiba
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

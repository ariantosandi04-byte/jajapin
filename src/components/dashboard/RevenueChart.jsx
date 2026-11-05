import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Card, CardContent } from '../ui/Card';
import { ArrowUpRight } from 'lucide-react';
import { formatIDR } from '../../lib/format';

const defaultData = [
  { date: '22 Okt', amount: 0.2 },
  { date: '24 Okt', amount: 0.1 },
  { date: '26 Okt', amount: 0.3 },
  { date: '28 Okt', amount: 0.2 },
  { date: '30 Okt', amount: 0.4 },
  { date: '31 Okt', amount: 0.3 },
  { date: '1 Nov', amount: 1.4 },
  { date: '2 Nov', amount: 0.8 },
  { date: '3 Nov', amount: 0.3 },
  { date: '4 Nov', amount: 0.7 },
  { date: '5 Nov', amount: 1.2 },
];

export default function RevenueChart({ totalAmount = 'Rp 2.0 jt' }) {
  return (
    <Card className="border-border bg-card">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="font-display font-semibold text-lg text-foreground">
              Pembayaran Diterima
            </h3>
            <p className="text-xs text-muted-foreground font-body">
              14 hari terakhir — dalam juta Rupiah
            </p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-body font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>{totalAmount} bulan ini</span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={defaultData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="forestGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#135D2D" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#135D2D" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" opacity={0.6} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: '#6b7280' }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: '#6b7280' }}
                tickFormatter={(v) => `${v}`}
              />
              <Tooltip
                formatter={(val) => [`Rp${(val * 1000000).toLocaleString('id-ID')}`, 'Pendapatan']}
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderRadius: '1rem',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                  fontSize: '12px',
                  fontFamily: 'Manrope, sans-serif',
                }}
              />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#135D2D"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#forestGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

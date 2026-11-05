import { ArrowUpRight, ArrowDownRight, Users, DoorClosed, TrendingUp, CalendarCheck } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { formatIDR } from '../../lib/format';

export default function StatCards({ stats }) {
  const cards = [
    {
      title: 'KEDATANGAN HARI INI',
      value: stats.todayArrivals,
      subtitle: stats.todayArrivals > 0 ? 'Semua tercatat' : 'Semua lunas',
      icon: CalendarCheck,
      trend: null,
      color: 'text-foreground',
    },
    {
      title: 'KEPULANGAN HARI INI',
      value: stats.todayDepartures,
      subtitle: 'Semua beres',
      icon: DoorClosed,
      trend: null,
      color: 'text-foreground',
    },
    {
      title: 'OKUPANSI',
      value: `${stats.occupancyRate}%`,
      subtitle: `${stats.occupiedRooms} dari ${stats.totalRooms} kamar terisi`,
      icon: TrendingUp,
      trend: '+2.4%',
      isPositive: true,
      color: 'text-brand-forest',
    },
    {
      title: 'PENDAPATAN (BULAN INI)',
      value: formatIDR(stats.monthlyRevenue),
      subtitle: `${stats.totalBookings} pemesanan selesai/aktif`,
      icon: Users,
      trend: '+14.8%',
      isPositive: true,
      color: 'text-brand-forest',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <Card key={i} className="border-border bg-card">
            <CardContent className="p-5">
              <div className="flex items-center justify-between text-muted-foreground mb-3">
                <span className="text-[10px] uppercase tracking-[0.2em] font-body font-semibold">
                  {c.title}
                </span>
                {c.trend ? (
                  <span className={`text-xs font-body font-medium flex items-center ${c.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {c.isPositive ? <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> : <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />}
                    {c.trend}
                  </span>
                ) : (
                  <Icon className="w-4 h-4 text-muted-foreground/60" />
                )}
              </div>
              <div className={`font-display font-semibold text-2xl mb-1 ${c.color}`}>
                {c.value}
              </div>
              <p className="text-xs text-muted-foreground font-body">
                {c.subtitle}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

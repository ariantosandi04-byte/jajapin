import { Link } from 'react-router-dom';
import { Star, MapPin, Users } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { formatIDR } from '../../lib/format';

export default function StayCard({ stay }) {
  return (
    <Link to={`/stays/${stay.slug}`}>
      <Card hover className="h-full">
        <div className="relative overflow-hidden aspect-[4/3]">
          <img src={stay.image} alt={stay.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]" loading="lazy" />
          <Badge variant="lime" className="absolute top-3 left-3">{stay.type}</Badge>
        </div>
        <div className="p-5">
          <div className="flex items-center gap-1 text-sm text-muted-foreground font-body mb-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>{stay.city}, {stay.province}</span>
          </div>
          <h3 className="font-display font-semibold text-lg text-foreground tracking-tight mb-1">{stay.name}</h3>
          <p className="font-display text-sm italic text-muted-foreground mb-3">{stay.tagline}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-brand-lime text-brand-lime" />
              <span className="text-sm font-body font-semibold">{stay.rating}</span>
              <span className="text-xs text-muted-foreground font-body">({stay.review_count})</span>
            </div>
            <div className="text-right">
              <span className="font-display font-semibold text-lg text-foreground">{formatIDR(stay.price)}</span>
              <span className="text-xs text-muted-foreground font-body"> /malam</span>
            </div>
          </div>
          <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground font-body">
            <Users className="w-3 h-3" />
            <span>{stay.guests} tamu</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}

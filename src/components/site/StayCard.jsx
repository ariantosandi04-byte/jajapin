import { Link } from 'react-router-dom';
import { Star, MapPin, Users, ShieldCheck } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { formatIDR } from '../../lib/format';

export default function StayCard({ stay }) {
  return (
    <Link to={`/stays/${stay.slug}`} className="block h-full group">
      <Card hover className="h-full flex flex-col justify-between overflow-hidden">
        <div>
          <div className="relative overflow-hidden aspect-[4/3] bg-muted">
            <img
              src={stay.image}
              alt={stay.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
              <Badge variant="lime" className="shadow-sm">
                {stay.type}
              </Badge>
              {stay.is_jajapin_verified && (
                <span className="inline-flex items-center gap-1 text-[10px] font-body font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-600 text-white shadow-sm">
                  <ShieldCheck className="w-3 h-3 stroke-[2.5]" /> Jajapin Official
                </span>
              )}
            </div>

            {stay.ota_links && (
              <div className="absolute bottom-2.5 right-2.5 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-mono text-white/90">
                OTA Sync ⚡
              </div>
            )}
          </div>

          <div className="p-5 pb-3">
            <div className="flex items-center gap-1 text-xs text-muted-foreground font-body mb-1.5">
              <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
              <span className="truncate">{stay.city}, {stay.province}</span>
            </div>
            <h3 className="font-display font-semibold text-lg text-foreground tracking-tight mb-1 group-hover:text-primary transition-colors">
              {stay.name}
            </h3>
            <p className="font-display text-xs italic text-muted-foreground mb-3 line-clamp-2">
              {stay.tagline}
            </p>
          </div>
        </div>

        <div className="p-5 pt-0 border-t border-border/40 mt-auto">
          <div className="flex items-center justify-between pt-3">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-brand-lime text-brand-lime" />
              <span className="text-sm font-body font-semibold">{stay.rating}</span>
              <span className="text-xs text-muted-foreground font-body">({stay.review_count})</span>
            </div>
            <div className="text-right">
              <span className="font-display font-semibold text-base text-foreground">
                {formatIDR(stay.price)}
              </span>
              <span className="text-xs text-muted-foreground font-body"> /malam</span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground font-body">
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>{stay.guests} tamu</span>
            </span>
            {stay.is_jajapin_verified ? (
              <span className="text-[11px] text-emerald-700 font-medium">Bisa Pesan Langsung</span>
            ) : (
              <span className="text-[11px] text-muted-foreground">Mitra Pilihan</span>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}

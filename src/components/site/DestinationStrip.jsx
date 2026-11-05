import { Link } from 'react-router-dom';
import { destinations } from '../../data/destinations';

export default function DestinationStrip() {
  return (
    <section id="destinasi" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <h2 className="font-display font-light text-3xl sm:text-4xl tracking-tight text-foreground mb-10">
        Tempat yang sedang diperbincangkan
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {destinations.map((dest, i) => (
          <Link
            key={dest.name}
            to={`/stays?city=${dest.slug}`}
            className={`group relative overflow-hidden rounded-3xl ${i === 0 ? 'col-span-2 lg:col-span-2 row-span-1' : ''}`}
          >
            <div className="aspect-[4/5]">
              <img src={dest.image} alt={dest.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <h3 className="absolute bottom-4 left-4 font-display font-semibold text-xl text-white">{dest.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

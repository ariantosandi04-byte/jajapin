import { ShieldCheck, UserCheck, Heart } from 'lucide-react';

const features = [
  {
    icon: ShieldCheck,
    title: 'Harga langsung dari pengelola',
    desc: 'Tanpa markup tersembunyi. Harga yang Anda lihat adalah harga yang ditetapkan langsung oleh pemilik penginapan.',
  },
  {
    icon: UserCheck,
    title: 'Dikonfirmasi manusia',
    desc: 'Setiap pemesanan dikonfirmasi langsung oleh pengelola, bukan bot. Anda tahu siapa yang menyambut Anda.',
  },
  {
    icon: Heart,
    title: 'Mendukung tuan rumah lokal',
    desc: 'Setiap pemesanan langsung mendukung keluarga dan komunitas lokal yang mengelola penginapan mereka sendiri.',
  },
];

export default function WhyJajapin() {
  return (
    <section className="bg-brand-sand py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-display font-light text-3xl sm:text-4xl tracking-tight text-foreground mb-12 text-center">
          Kenapa Jajapin?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map(f => (
            <div key={f.title} className="text-center">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
                <f.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-lg tracking-tight mb-2">{f.title}</h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

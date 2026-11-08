import { ShieldCheck, UserCheck, Heart, Zap } from 'lucide-react';

const features = [
  {
    icon: ShieldCheck,
    title: 'Tarif Murni dari Pengelola',
    desc: 'Tanpa markup tersembunyi atau biaya perantara tak terduga. Harga yang Anda lihat di layar adalah tarif resmi dari pengelola penginapan.',
  },
  {
    icon: Zap,
    title: 'Bisa Pesan Tanpa Registrasi Akun',
    desc: 'Kami tidak mewajibkan tamu membuat akun. Cukup isi nama dan kontak WhatsApp, e-voucher resmi langsung diterbitkan setelah bayar.',
  },
  {
    icon: UserCheck,
    title: 'Dikonfirmasi Resepsionis Asli',
    desc: 'Pemesanan Anda ditangani langsung oleh staf dan pengelola penginapan di lokasi, bukan bot. Anda tahu persis siapa yang menyambut Anda.',
  },
  {
    icon: Heart,
    title: 'Mendukung Tuan Rumah Lokal',
    desc: 'Setiap pembayaran langsung disalurkan ke pemilik penginapan lokal di berbagai penjuru nusantara untuk memajukan pariwisata daerah.',
  },
];

export default function WhyJajapin() {
  return (
    <section className="bg-stone-100/70 border-t border-stone-200/80 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <p className="text-[11px] uppercase tracking-[0.24em] font-body font-semibold text-emerald-800 mb-2">
            Komitmen Layanan Jajapin
          </p>
          <h2 className="font-display font-light text-3xl sm:text-4xl tracking-tight text-stone-900 leading-tight">
            Pengalaman Menginap yang Jujur & Terpercaya
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center mb-5">
                  <f.icon className="w-5 h-5 text-emerald-800" />
                </div>
                <h3 className="font-display font-semibold text-base text-stone-900 tracking-tight mb-2">
                  {f.title}
                </h3>
                <p className="font-body text-xs text-stone-600 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

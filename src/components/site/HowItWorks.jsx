export default function HowItWorks() {
  const steps = [
    { num: '01', title: 'Cari tempatmu', desc: 'Masukkan destinasi, tanggal, dan jumlah tamu. Filter berdasarkan tipe, harga, dan fasilitas.' },
    { num: '02', title: 'Pilih kamar', desc: 'Jelajahi foto, ulasan tamu, dan fasilitas. Bandingkan pilihan hingga menemukan yang tepat.' },
    { num: '03', title: 'Konfirmasi & tiba', desc: 'Pesan langsung, dapatkan konfirmasi dari pengelola, dan tiba di penginapan impian Anda.' },
  ];

  return (
    <section id="cara-kerja" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <div>
          <h2 className="font-display font-light text-3xl sm:text-4xl tracking-tight text-foreground mb-4">
            Tiga langkah, lalu berangkat.
          </h2>
          <p className="font-body text-muted-foreground leading-relaxed">
            Kami menyederhanakan proses pemesanan agar Anda bisa fokus pada yang penting: menikmati perjalanan Anda.
          </p>
        </div>
        <div className="space-y-0">
          {steps.map((step, i) => (
            <div key={step.num} className={`py-8 ${i < steps.length - 1 ? 'border-b border-border' : ''}`}>
              <div className="flex gap-6">
                <span className="font-display font-light text-4xl text-brand-lime/60">{step.num}</span>
                <div>
                  <h3 className="font-display font-semibold text-lg tracking-tight mb-1">{step.title}</h3>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

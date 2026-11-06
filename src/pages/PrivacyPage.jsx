import { Link } from 'react-router-dom';
import SiteHeader from '../components/site/SiteHeader';
import SiteFooter from '../components/site/SiteFooter';
import { ShieldCheck, Lock, ArrowLeft, Eye, Database } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-body text-muted-foreground hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Beranda
          </Link>

          {/* Title Header */}
          <div className="border-b border-border pb-6 mb-8">
            <div className="flex items-center gap-2 text-primary text-xs font-body font-bold uppercase tracking-widest mb-1.5">
              <Lock className="w-4 h-4" /> Perlindungan Data Pribadi
            </div>
            <h1 className="font-display font-light text-3xl sm:text-4xl text-foreground tracking-tight">
              Kebijakan Privasi (Privacy Policy)
            </h1>
            <p className="text-xs text-muted-foreground font-body mt-2">
              Terakhir diperbarui: 6 November 2026 • Sesuai dengan Undang-Undang Perlindungan Data Pribadi (UU PDP No. 27 Tahun 2022).
            </p>
          </div>

          <div className="space-y-8 font-body text-xs sm:text-sm text-foreground/80 leading-relaxed">
            <section className="space-y-3">
              <h2 className="font-display font-semibold text-lg text-foreground">
                1. Komitmen Privasi Kami
              </h2>
              <p>
                <strong>PT Jalan Jalan Pesona Indonesia (Jajapin)</strong> menghormati dan berkomitmen penuh untuk melindungi privasi serta keamanan data pribadi seluruh tamu dan mitra pengguna layanan kami. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, mengelola, menyimpan, dan melindungi informasi pribadi Anda saat menggunakan situs <strong>jajapin.id</strong>.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display font-semibold text-lg text-foreground">
                2. Data yang Kami Kumpulkan
              </h2>
              <p>Kami mengumpulkan data yang Anda berikan secara langsung saat melakukan proses pemesanan atau pendaftaran akun:</p>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li><strong>Identitas Diri:</strong> Nama lengkap, nomor KTP/Paspor (untuk keperluan check-in hotel).</li>
                <li><strong>Data Kontak:</strong> Alamat email dan nomor telepon / WhatsApp aktif.</li>
                <li><strong>Rincian Transaksi:</strong> Tanggal menginap, tipe kamar, total nilai transaksi, dan preferensi menginap.</li>
                <li><strong>Data Pembayaran:</strong> Metode pembayaran yang dipilih. Catatan: Informasi sensitif seperti nomor kartu kredit diproses langsung oleh payment gateway bersertifikasi PCI-DSS (Xendit & Midtrans) dan tidak pernah disimpan di server Jajapin.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="font-display font-semibold text-lg text-foreground">
                3. Tujuan Penggunaan Data
              </h2>
              <p>Data pribadi Anda digunakan semata-mata untuk kepentingan:</p>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>Memproses dan mengonfirmasi reservasi akomodasi Anda ke pihak hotel/properti.</li>
                <li>Menerbitkan tiket pesanan, kwitansi, dan faktur resmi (Invoice).</li>
                <li>Mengirimkan notifikasi status pembayaran dan reminder check-in melalui WhatsApp dan Email.</li>
                <li>Penyelesaian kendala layanan, pengembalian dana (refund), serta perlindungan dari aktivitas mencurigakan.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="font-display font-semibold text-lg text-foreground">
                4. Pembagian Data kepada Pihak Ketiga
              </h2>
              <p>
                Kami tidak akan pernah menjual atau menyewakan data pribadi Anda kepada pihak manapun. Data Anda hanya dibagikan kepada:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li><strong>Mitra Penginapan Terkait:</strong> Untuk keperluan validasi check-in dan alokasi kamar tamu.</li>
                <li><strong>Gerbang Pembayaran Resmi (Xendit & Midtrans):</strong> Untuk verifikasi keabsahan transaksi perbankan.</li>
                <li><strong>Otoritas Hukum Berwenang:</strong> Apabila diwajibkan oleh peraturan perundang-undangan Republik Indonesia.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="font-display font-semibold text-lg text-foreground">
                5. Keamanan Data (SSL & Encryption)
              </h2>
              <p>
                Seluruh komunikasi data di <strong>jajapin.id</strong> diamankan dengan protokol enkripsi standar industri <strong>HTTPS 256-bit SSL/TLS</strong>. Kami menerapkan pengamanan teknis dan manajerial berlapis untuk mencegah akses tidak sah, kebocoran, atau perubahan data tanpa izin.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display font-semibold text-lg text-foreground">
                6. Hak Pengguna & Penghapusan Data
              </h2>
              <p>
                Anda berhak meminta salinan data pribadi yang kami simpan, melakukan perbaikan data yang keliru, atau mengajukan permohonan penghapusan akun dengan mengirimkan email ke <a href="mailto:halo@jajapin.id" className="text-primary underline">halo@jajapin.id</a>.
              </p>
            </section>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
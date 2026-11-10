import { Link } from 'react-router-dom';
import SiteHeader from '../components/site/SiteHeader';
import SiteFooter from '../components/site/SiteFooter';
import { ShieldCheck, FileText, ArrowLeft, Building2, HelpCircle } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';

export default function TermsPage() {
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
              <ShieldCheck className="w-4 h-4" /> Ketentuan Penggunaan Layanan
            </div>
            <h1 className="font-display font-light text-3xl sm:text-4xl text-foreground tracking-tight">
              Syarat & Ketentuan Layanan
            </h1>
            <p className="text-xs text-muted-foreground font-body mt-2">
              Terakhir diperbarui: 6 November 2026 • Berlaku untuk seluruh pengguna platform Jajapin (jajapin.id).
            </p>
          </div>

          {/* Content Document */}
          <div className="space-y-8 font-body text-xs sm:text-sm text-foreground/80 leading-relaxed">
            <section className="space-y-3">
              <h2 className="font-display font-semibold text-lg text-foreground">
                1. Definisi & Ketentuan Umum
              </h2>
              <p>
                Selamat datang di <strong>Jajapin</strong> (dioperasikan oleh PT Jalan Jalan Pesona Indonesia, selanjutnya disebut "Kami" atau "Platform"). Jajapin merupakan platform teknologi perantara yang menghubungkan tamu/wisatawan ("Pengguna" atau "Tamu") dengan penyedia akomodasi berizin resmi seperti hotel, villa, homestay, dan resort ("Mitra Properti").
              </p>
              <p>
                Dengan mengakses, mendaftar, atau melakukan pemesanan di situs <strong>jajapin.id</strong>, Anda menyatakan telah membaca, memahami, dan menyetujui seluruh Syarat & Ketentuan ini. Apabila Anda tidak menyetujui salah satu ketentuan, Anda dipersilakan untuk tidak menggunakan layanan kami.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display font-semibold text-lg text-foreground">
                2. Persyaratan Pengguna
              </h2>
              <ul className="list-disc pl-5 space-y-1.5 text-muted-foreground">
                <li>Pengguna wajib berusia sekurang-kurangnya 18 (delapan belas) tahun atau telah cakap secara hukum untuk membuat perjanjian yang mengikat.</li>
                <li>Pengguna wajib memberikan informasi identitas yang benar, akurat, dan dapat dipertanggungjawabkan (Nama, Nomor Telepon/WhatsApp, Email, dan Identitas KTP/Paspor).</li>
                <li>Dilarang menyalahgunakan platform untuk kegiatan melanggar hukum, penipuan, atau reservasi fiktif.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="font-display font-semibold text-lg text-foreground">
                3. Pemesanan & Konfirmasi Reservasi
              </h2>
              <p>
                Setiap pemesanan yang dibuat melalui Jajapin akan menghasilkan <strong>Kode Booking Resmi</strong> dan <strong>Faktur / Invoice</strong>. Konfirmasi pemesanan berlaku mengikat setelah pembayaran berhasil diverifikasi oleh payment gateway resmi kami (Midtrans) atau setelah konfirmasi setoran dari kasir properti.
              </p>
              <p>
                Tamu wajib menunjukkan bukti konfirmasi booking digital dan kartu identitas fisik (KTP/Paspor/SIM) saat proses check-in di resepsionis properti.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display font-semibold text-lg text-foreground">
                4. Harga, Pajak & Pembayaran (Payment Gateway)
              </h2>
              <p>
                Seluruh tarif kamar yang tercantum di situs Jajapin dinyatakan dalam mata uang <strong>Rupiah (IDR)</strong> dan telah mencakup pajak daerah (PB1) serta biaya layanan, kecuali dinyatakan lain secara tertulis.
              </p>
              <p>
                Transaksi pembayaran digital diproses melalui mitra gerbang pembayaran berizin Bank Indonesia, yaitu <strong>Midtrans</strong>, yang mendukung metode:
              </p>
              <div className="p-4 rounded-2xl bg-muted/40 border border-border grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-semibold text-foreground">
                <div>• Virtual Account Bank</div>
                <div>• QRIS (Gopay/BCA/dll)</div>
                <div>• e-Wallet (OVO/DANA)</div>
                <div>• Kartu Debit / Kredit</div>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="font-display font-semibold text-lg text-foreground">
                5. Kebijakan Check-In & Aturan Akomodasi
              </h2>
              <p>
                Waktu check-in standar dimulai pukul <strong>14:00 WIB</strong> dan waktu check-out maksimal pukul <strong>12:00 WIB</strong>. Keterlambatan check-out tanpa konfirmasi dapat dikenakan biaya tambahan oleh mitra properti. Tamu berkewajiban menjaga ketertiban, kebersihan, dan mematuhi peraturan internal tiap penginapan.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display font-semibold text-lg text-foreground">
                6. Pembatalan & Pengembalian Dana
              </h2>
              <p>
                Ketentuan pembatalan, penjadwalan ulang (reschedule), dan pengembalian dana (refund) tunduk pada{' '}
                <Link to="/refund-policy" className="text-primary font-semibold underline">
                  Kebijakan Pengembalian Dana & Pembatalan Jajapin
                </Link>
                .
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display font-semibold text-lg text-foreground">
                7. Kontak & Layanan Bantuan
              </h2>
              <p>
                Apabila terdapat pertanyaan mengenai ketentuan ini, hubungi tim operasional kami melalui:
              </p>
              <div className="p-4 rounded-2xl bg-brand-forest/5 border border-brand-forest/15 space-y-1 text-xs">
                <p><strong>PT Jalan Jalan Pesona Indonesia (Jajapin)</strong></p>
                <p>Email: <a href="mailto:halo@jajapin.id" className="text-primary underline">halo@jajapin.id</a></p>
                <p>WhatsApp Layanan: +62 858-1415-730</p>
                <p>Alamat Operasional: Jakarta & Pelabuhan Ratu, Indonesia</p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
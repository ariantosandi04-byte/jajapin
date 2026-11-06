import { Link } from 'react-router-dom';
import SiteHeader from '../components/site/SiteHeader';
import SiteFooter from '../components/site/SiteFooter';
import { RefreshCcw, ArrowLeft, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';

export default function RefundPolicyPage() {
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
              <RefreshCcw className="w-4 h-4" /> Kebijakan Transaksi Konsumen
            </div>
            <h1 className="font-display font-light text-3xl sm:text-4xl text-foreground tracking-tight">
              Kebijakan Pembatalan & Pengembalian Dana (Refund)
            </h1>
            <p className="text-xs text-muted-foreground font-body mt-2">
              Terakhir diperbarui: 6 November 2026 • Panduan resmi klaim pengembalian dana transaksi di Jajapin.
            </p>
          </div>

          <div className="space-y-8 font-body text-xs sm:text-sm text-foreground/80 leading-relaxed">
            <section className="space-y-3">
              <h2 className="font-display font-semibold text-lg text-foreground">
                1. Prinsip Dasar Kebijakan Refund
              </h2>
              <p>
                <strong>Jajapin</strong> berkomitmen memberikan rasa aman dan kenyamanan maksimal bagi setiap wisatawan. Kami memahami bahwa rencana perjalanan dapat berubah sewaktu-waktu. Kebijakan ini mengatur hak dan kewajiban pengembalian dana (*refund*) atas pemesanan kamar yang dibatalkan oleh tamu maupun oleh pihak akomodasi.
              </p>
            </section>

            {/* Refund Tier Box */}
            <section className="space-y-4">
              <h2 className="font-display font-semibold text-lg text-foreground">
                2. Ketentuan & Skema Pengembalian Dana Berdasarkan Waktu Pembatalan
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-emerald-200 bg-emerald-50/50">
                  <CardContent className="p-5 space-y-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                      H-3 atau Lebih
                    </span>
                    <h3 className="font-display font-bold text-lg text-emerald-950">
                      Refund 100%
                    </h3>
                    <p className="text-xs text-emerald-800/80">
                      Pembatalan dilakukan minimal 3 hari (72 jam) sebelum tanggal check-in (pukul 14.00 WIB). Dana dikembalikan penuh (dikurangi biaya admin payment gateway jika berlaku).
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-amber-200 bg-amber-50/50">
                  <CardContent className="p-5 space-y-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 text-amber-800 border border-amber-300">
                      H-1 hingga H-2
                    </span>
                    <h3 className="font-display font-bold text-lg text-amber-950">
                      Refund 50%
                    </h3>
                    <p className="text-xs text-amber-800/80">
                      Pembatalan dilakukan 24 hingga 48 jam sebelum jadwal check-in. Tamu berhak menerima pengembalian dana sebesar 50% dari total nilai sewa.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-rose-200 bg-rose-50/50">
                  <CardContent className="p-5 space-y-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-100 text-rose-800 border border-rose-300">
                      Hari H / No-Show
                    </span>
                    <h3 className="font-display font-bold text-lg text-rose-950">
                      Non-Refundable
                    </h3>
                    <p className="text-xs text-rose-800/80">
                      Pembatalan kurang dari 24 jam sebelum check-in atau tamu tidak hadir tanpa kabar (*No-Show*) tidak dapat mengajukan pengembalian dana.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="font-display font-semibold text-lg text-foreground">
                3. Pembatalan oleh Pihak Mitra Penginapan atau Force Majeure
              </h2>
              <p>
                Apabila pemesanan terpaksa dibatalkan oleh pihak penginapan akibat kendala teknis kamar, bencana alam, kebijakan darurat pemerintah, atau situasi kahar (*Force Majeure*):
              </p>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>Tamu berhak atas <strong>pengembalian dana 100% (penuh) tanpa potongan apapun</strong>.</li>
                <li>Atau tamu dapat memilih opsi relokasi ke kamar/penginapan lain yang setara tanpa biaya tambahan.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="font-display font-semibold text-lg text-foreground">
                4. Prosedur & Langkah Pengajuan Refund
              </h2>
              <ol className="list-decimal pl-5 space-y-2 text-muted-foreground">
                <li>
                  <strong>Buka Menu Booking Saya:</strong> Masuk ke akun Anda di <strong>jajapin.id/bookings</strong> dan klik tombol <em>Batalkan Pesanan</em> pada tiket terkait, ATAU
                </li>
                <li>
                  <strong>Hubungi Layanan Bantuan:</strong> Kirim email ke <a href="mailto:halo@jajapin.id" className="text-primary underline">halo@jajapin.id</a> atau WhatsApp ke nomor CS dengan menyebutkan:
                  <ul className="list-disc pl-5 mt-1 space-y-0.5 text-foreground">
                    <li>Kode Booking (contoh: <code>JP-928410</code>)</li>
                    <li>Nama Tamu Pemesan</li>
                    <li>Nomor Rekening Bank Pengembalian Dana (Nama Bank, No. Rek, Nama Pemilik)</li>
                  </ul>
                </li>
              </ol>
            </section>

            <section className="space-y-3">
              <h2 className="font-display font-semibold text-lg text-foreground">
                5. Jangka Waktu & Metode Pengembalian Dana (SLA)
              </h2>
              <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-2 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-border">
                  <span className="font-semibold text-foreground">Virtual Account / Transfer Bank:</span>
                  <span className="text-primary font-bold">1 – 3 Hari Kerja</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-border">
                  <span className="font-semibold text-foreground">e-Wallet (OVO / DANA / QRIS):</span>
                  <span className="text-primary font-bold">Maksimal 1 Hari Kerja (Real-time)</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="font-semibold text-foreground">Kartu Kredit / Debit:</span>
                  <span className="text-muted-foreground">5 – 14 Hari Kerja (tergantung bank penerbit)</span>
                </div>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="font-display font-semibold text-lg text-foreground">
                6. Hubungi Tim Layanan Pelanggan
              </h2>
              <p>
                Jika Anda membutuhkan bantuan seputar status refund atau pembatalan, tim kami siap melayani Anda setiap hari (08:00 – 22:00 WIB) melalui:
              </p>
              <div className="p-4 rounded-2xl bg-brand-forest/5 border border-brand-forest/15 space-y-1 text-xs">
                <p><strong>Customer Care Jajapin</strong></p>
                <p>Email: <a href="mailto:halo@jajapin.id" className="text-primary underline">halo@jajapin.id</a></p>
                <p>WhatsApp Hotline: +62 858-1415-730</p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
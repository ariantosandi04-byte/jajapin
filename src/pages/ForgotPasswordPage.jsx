import { useState } from 'react';
import { Link } from 'react-router-dom';
import { siteMedia } from '@/data/siteMedia';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Column: Brand Hero */}
      <div className="hidden lg:flex lg:w-1/2 bg-brand-forest relative items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={siteMedia.hero}
            alt="Jajapin Hero"
            className="w-full h-full object-cover opacity-25 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-forest-deep via-brand-forest/90 to-brand-forest-deep" />
        </div>

        <div className="relative z-10 max-w-md text-white text-center space-y-4">
          <Link to="/" className="inline-flex items-center gap-3">
            <img
              src={siteMedia.logo}
              alt="Jajapin"
              className="w-16 h-16 rounded-full object-cover border-2 border-brand-lime shadow-lg mx-auto"
            />
          </Link>
          <h2 className="font-display font-light text-3xl sm:text-4xl tracking-tight leading-tight">
            Pemulihan Akses Akun Anda
          </h2>
          <p className="font-body text-sm text-white/70 leading-relaxed">
            Kami akan membantu Anda mengatur ulang kata sandi dengan aman dan cepat.
          </p>
        </div>
      </div>

      {/* Right Column: Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-6">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-xs font-body text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke halaman masuk
          </Link>

          <div>
            <h1 className="font-display font-light text-3xl text-foreground tracking-tight">
              Lupa Kata Sandi?
            </h1>
            <p className="font-body text-sm text-muted-foreground mt-1">
              Masukkan alamat email Anda untuk menerima instruksi pemulihan.
            </p>
          </div>

          {submitted ? (
            <div className="p-6 rounded-3xl bg-green-50 border border-green-200 text-green-900 space-y-4 font-body">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0" />
                <h3 className="font-semibold text-sm">Tautan Pemulihan Telah Terkirim (Demo)</h3>
              </div>
              <p className="text-xs text-green-800 leading-relaxed">
                Kami telah mensimulasikan pengiriman tautan reset kata sandi ke <strong>{email}</strong>.
              </p>
              <div className="pt-2">
                <Link to="/reset-password">
                  <Button size="sm" variant="default">
                    Lanjut ke Halaman Buat Sandi Baru →
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Alamat Email Terdaftar"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.id"
                required
              />

              <Button type="submit" size="lg" className="w-full">
                <Mail className="w-4 h-4 mr-2" /> Kirim Tautan Pemulihan
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

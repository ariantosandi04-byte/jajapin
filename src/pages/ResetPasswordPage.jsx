import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { siteMedia } from '@/data/siteMedia';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { KeyRound, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    if (password.length < 6) {
      setError('Kata sandi minimal 6 karakter.');
      return;
    }

    setSuccess(true);
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
            Keamanan Akun Jajapin Anda
          </h2>
          <p className="font-body text-sm text-white/70 leading-relaxed">
            Perbarui kata sandi Anda dengan kombinasi yang kuat dan mudah Anda ingat.
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
              Atur Ulang Kata Sandi
            </h1>
            <p className="font-body text-sm text-muted-foreground mt-1">
              Masukkan kata sandi baru untuk akun Anda.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-xs font-body">
              {error}
            </div>
          )}

          {success ? (
            <div className="p-6 rounded-3xl bg-green-50 border border-green-200 text-green-900 space-y-4 font-body">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0" />
                <h3 className="font-semibold text-sm">Kata Sandi Berhasil Diperbarui!</h3>
              </div>
              <p className="text-xs text-green-800 leading-relaxed">
                Kata sandi baru Anda telah tersimpan (mode demo). Anda sekarang dapat masuk kembali.
              </p>
              <div className="pt-2">
                <Button size="sm" onClick={() => navigate('/login')} className="w-full">
                  Masuk Sekarang
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Kata Sandi Baru"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                required
              />
              <Input
                label="Ulangi Kata Sandi Baru"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Konfirmasi kata sandi baru"
                required
              />

              <Button type="submit" size="lg" className="w-full">
                <KeyRound className="w-4 h-4 mr-2" /> Simpan Kata Sandi Baru
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { siteMedia } from '@/data/siteMedia';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { UserPlus, ShieldCheck } from 'lucide-react';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
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

    const result = register(name, email, password);
    if (result.success) {
      navigate('/bookings');
    } else {
      setError(result.message || 'Gagal mendaftar. Email mungkin sudah digunakan.');
    }
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

        <div className="relative z-10 max-w-md text-white text-center space-y-6">
          <Link to="/" className="inline-flex items-center gap-3">
            <img
              src={siteMedia.logo}
              alt="Jajapin"
              className="w-16 h-16 rounded-full object-cover border-2 border-brand-lime shadow-lg mx-auto"
            />
          </Link>
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-[0.28em] font-body text-brand-lime font-bold">
              Bergabung dengan Jajapin
            </span>
            <h2 className="font-display font-light text-3xl sm:text-4xl tracking-tight leading-tight">
              Temukan pengalaman menginap otentik Indonesia.
            </h2>
          </div>
          <p className="font-body text-sm text-white/70 leading-relaxed">
            Daftar akun gratis sekarang untuk kemudahan pemesanan cepat, simpan properti favorit, dan riwayat perjalanan Anda.
          </p>
        </div>
      </div>

      {/* Right Column: Register Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-6">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 mb-6 lg:hidden">
              <img src={siteMedia.logo} alt="Jajapin" className="w-8 h-8 rounded-full" />
              <span className="font-display font-bold text-lg text-foreground">Jajapin</span>
            </Link>
            <p className="text-[11px] uppercase tracking-[0.24em] font-body font-semibold text-primary mb-1">
              Akun Baru
            </p>
            <h1 className="font-display font-light text-3xl sm:text-4xl text-foreground tracking-tight">
              Daftar Sekarang
            </h1>
            <p className="font-body text-sm text-muted-foreground mt-1">
              Lengkapi informasi dasar Anda untuk membuat akun tamu.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-xs font-body">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nama Lengkap"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Siti Rahmawati"
              required
            />
            <Input
              label="Alamat Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.id"
              required
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Kata Sandi"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                required
              />
              <Input
                label="Ulangi Sandi"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi kata sandi"
                required
              />
            </div>

            <Button type="submit" size="lg" className="w-full">
              <UserPlus className="w-4 h-4 mr-2" /> Buat Akun Jajapin
            </Button>
          </form>

          <div className="text-center text-xs text-muted-foreground font-body">
            Sudah memiliki akun?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              Masuk di sini
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

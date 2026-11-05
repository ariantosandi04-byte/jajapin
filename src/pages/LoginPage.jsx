import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { siteMedia } from '@/data/siteMedia';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ShieldCheck, LogIn, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || '/';

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const result = login(email, password);
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.message || 'Email atau kata sandi tidak cocok.');
    }
  };

  const handleDemoFill = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Column: Brand Hero Panel */}
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
              Jalan Jalan Pesona Indonesia
            </span>
            <h2 className="font-display font-light text-3xl sm:text-4xl tracking-tight leading-tight">
              Kenyamanan menginap langsung dari pengelolanya.
            </h2>
          </div>
          <p className="font-body text-sm text-white/70 leading-relaxed">
            Platform kurasi hotel, villa, homestay, dan resort di seluruh nusantara. Masuk untuk mengelola reservasi atau mengelola properti Anda.
          </p>

          <div className="pt-6 border-t border-white/10 flex items-center justify-center gap-6 text-xs text-white/60 font-body">
            <span>120+ Properti</span>
            <span>·</span>
            <span>34 Provinsi</span>
            <span>·</span>
            <span>Harga Langsung</span>
          </div>
        </div>
      </div>

      {/* Right Column: Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-6">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 mb-6 lg:hidden">
              <img src={siteMedia.logo} alt="Jajapin" className="w-8 h-8 rounded-full" />
              <span className="font-display font-bold text-lg text-foreground">Jajapin</span>
            </Link>
            <p className="text-[11px] uppercase tracking-[0.24em] font-body font-semibold text-primary mb-1">
              Selamat Datang Kembali
            </p>
            <h1 className="font-display font-light text-3xl sm:text-4xl text-foreground tracking-tight">
              Masuk Akun
            </h1>
            <p className="font-body text-sm text-muted-foreground mt-1">
              Akses booking Anda atau dashboard pengelolaan properti.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-xs font-body">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Alamat Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.id"
              required
            />
            <Input
              label="Kata Sandi"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            <div className="flex items-center justify-between text-xs font-body pt-1">
              <label className="flex items-center gap-2 text-muted-foreground cursor-pointer">
                <input type="checkbox" className="rounded text-primary focus:ring-primary/30" />
                <span>Ingat saya</span>
              </label>
              <Link to="/forgot-password" className="text-primary hover:underline font-medium">
                Lupa kata sandi?
              </Link>
            </div>

            <Button type="submit" size="lg" className="w-full">
              <LogIn className="w-4 h-4 mr-2" /> Masuk ke Jajapin
            </Button>
          </form>

          {/* Quick Demo Accounts */}
          <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider font-body font-bold text-muted-foreground">
                Akun Uji Coba (Demo Mode)
              </span>
              <span className="text-[10px] text-primary font-body font-semibold">Klik untuk mengisi</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleDemoFill('admin@jajapin.id', 'admin123')}
                className="p-2 rounded-xl bg-card border border-border text-left hover:border-primary transition-colors text-xs font-body"
              >
                <span className="font-semibold block text-foreground">Super Admin</span>
                <span className="text-[10px] text-muted-foreground block truncate">admin@jajapin.id</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill('owner@bukitsenja.id', 'owner123')}
                className="p-2 rounded-xl bg-card border border-border text-left hover:border-primary transition-colors text-xs font-body"
              >
                <span className="font-semibold block text-foreground">Pemilik Mitra</span>
                <span className="text-[10px] text-muted-foreground block truncate">owner@bukitsenja.id</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill('tamu@gmail.com', 'tamu123')}
                className="p-2 rounded-xl bg-card border border-border text-left hover:border-primary transition-colors text-xs font-body"
              >
                <span className="font-semibold block text-foreground">Tamu Wisata</span>
                <span className="text-[10px] text-muted-foreground block truncate">tamu@gmail.com</span>
              </button>
            </div>
          </div>

          <div className="text-center text-xs text-muted-foreground font-body">
            Belum memiliki akun?{' '}
            <Link to="/register" className="text-primary font-semibold hover:underline">
              Daftar sekarang
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

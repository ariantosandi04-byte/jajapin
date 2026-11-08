import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, User, ArrowRight, ShieldCheck, Waves } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { siteMedia } from '../../data/siteMedia';

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isAuthenticated, isOwner, isAdmin, logout } = useAuth();
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { to: '/stays', label: 'Penginapan' },
    { to: '/putrisari', label: 'Hotel Putri Sari', isFeatured: true },
    { to: '/#destinasi', label: 'Destinasi' },
    { to: '/#cara-kerja', label: 'Cara Kerja' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      
      {/* Top Banner Connecting jajapin.id to putrisari.jajapin.id */}
      <div className="bg-[#0b1f14] text-white/90 text-[11px] py-1.5 px-4 border-b border-emerald-900/60 font-body">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
            <span className="text-emerald-300 font-semibold uppercase tracking-wider text-[10px]">
              Jajapin Network:
            </span>
            <span className="truncate text-white/80">
              Hotel Putri Sari Pelabuhan Ratu (Depan Pantai Kumala) resmi terhubung dengan <span className="font-mono text-emerald-300">putrisari.jajapin.id</span>
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <Link
              to="/putrisari"
              className="text-emerald-300 hover:text-white font-semibold inline-flex items-center gap-1 transition-colors"
            >
              Lihat Kamar & Booking Cepat <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className={`transition-all duration-500 ${
        scrolled || !isHome ? 'bg-card/95 backdrop-blur-md shadow-xs border-b border-border/80' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 lg:h-18">
          
          {/* Left: Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src={siteMedia.logo}
              alt="Jajapin"
              className="w-10 h-10 rounded-full object-cover border-2 border-brand-lime/40 group-hover:scale-105 transition-transform"
            />
            <div>
              <span className={`font-display font-semibold text-lg tracking-tight ${scrolled || !isHome ? 'text-foreground' : 'text-white'}`}>
                Jajapin
              </span>
              <span className={`block text-[9px] uppercase tracking-[0.28em] ${scrolled || !isHome ? 'text-muted-foreground' : 'text-white/70'}`}>
                Pesona Indonesia
              </span>
            </div>
          </Link>

          {/* Center: Nav (desktop) */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-body font-medium transition-colors flex items-center gap-1.5 ${
                  link.isFeatured
                    ? scrolled || !isHome
                      ? 'text-emerald-900 font-bold bg-emerald-50 hover:bg-emerald-100/80 px-3.5 py-1 rounded-full border border-emerald-300 shadow-2xs'
                      : 'text-white font-bold bg-white/15 hover:bg-white/25 px-3.5 py-1 rounded-full border border-brand-lime/40 shadow-2xs'
                    : scrolled || !isHome
                    ? 'text-foreground hover:text-primary'
                    : 'text-white/90 hover:text-white'
                }`}
              >
                <span>{link.label}</span>
                {link.isFeatured && (
                  <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.2 bg-emerald-700 text-white rounded font-bold">
                    Depan Pantai
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Right: Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated && (
              <Link
                to="/bookings"
                className={`text-sm font-body font-medium transition-colors ${
                  scrolled || !isHome ? 'text-foreground hover:text-primary' : 'text-white/90 hover:text-white'
                }`}
              >
                Booking saya
              </Link>
            )}
            {isAuthenticated && (isOwner || isAdmin) && (
              <Link
                to="/dashboard"
                className={`text-sm font-body font-medium transition-colors ${
                  scrolled || !isHome ? 'text-foreground hover:text-primary' : 'text-white/90 hover:text-white'
                }`}
              >
                Dashboard
              </Link>
            )}
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className={`text-sm font-body ${scrolled || !isHome ? 'text-muted-foreground' : 'text-white/70'}`}>
                  {user.name}
                </span>
                <button
                  onClick={logout}
                  className={`text-sm font-body font-medium ${scrolled || !isHome ? 'text-red-500' : 'text-red-300'}`}
                >
                  Keluar
                </button>
              </div>
            ) : (
              <Link to="/login">
                <Button variant={scrolled || !isHome ? 'default' : 'lime'} size="sm">
                  <User className="w-4 h-4 mr-2" /> Masuk
                </Button>
              </Link>
            )}
            <Link to="/stays">
              <Button
                variant={scrolled || !isHome ? 'default' : 'outline'}
                size="sm"
                className={!scrolled && isHome ? 'border-white/40 text-white hover:bg-white/10' : ''}
              >
                <Search className="w-4 h-4 mr-2" /> Cari penginapan
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden p-2 text-white">
            {menuOpen ? (
              <X className={`w-6 h-6 ${scrolled || !isHome ? 'text-foreground' : 'text-white'}`} />
            ) : (
              <Menu className={`w-6 h-6 ${scrolled || !isHome ? 'text-foreground' : 'text-white'}`} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      {menuOpen && (
        <div className="lg:hidden absolute top-full left-4 right-4 mt-2 bg-card rounded-3xl shadow-xl border border-border p-6 animate-in">
          <nav className="flex flex-col gap-4">
            
            {/* Quick banner for Putri Sari on mobile */}
            <div className="p-3 rounded-2xl bg-emerald-950 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">Pilihan Utama</span>
                <span className="text-xs font-semibold">Hotel Putri Sari Pelabuhan Ratu</span>
              </div>
              <Link
                to="/putrisari"
                onClick={() => setMenuOpen(false)}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 text-[11px] font-semibold text-white"
              >
                Buka
              </Link>
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className="text-foreground font-body font-medium hover:text-primary transition-colors flex items-center justify-between"
              >
                <span>{link.label}</span>
                {link.isFeatured && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                    Depan Pantai
                  </span>
                )}
              </Link>
            ))}
            {isAuthenticated && (
              <Link to="/bookings" onClick={() => setMenuOpen(false)} className="text-foreground font-body font-medium hover:text-primary">
                Booking saya
              </Link>
            )}
            {isAuthenticated && (isOwner || isAdmin) && (
              <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="text-foreground font-body font-medium hover:text-primary">
                Dashboard
              </Link>
            )}
            <hr className="border-border" />
            {isAuthenticated ? (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground font-body">{user.name}</span>
                <button
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                  className="text-sm text-red-500 font-body font-medium"
                >
                  Keluar
                </button>
              </div>
            ) : (
              <Link to="/login" onClick={() => setMenuOpen(false)}>
                <Button className="w-full">
                  <User className="w-4 h-4 mr-2" /> Masuk
                </Button>
              </Link>
            )}
            <Link to="/stays" onClick={() => setMenuOpen(false)}>
              <Button variant="secondary" className="w-full">
                <Search className="w-4 h-4 mr-2" /> Cari penginapan
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

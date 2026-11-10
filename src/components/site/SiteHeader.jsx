import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, User } from 'lucide-react';
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
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { to: '/stays', label: 'Penginapan' },
    { to: '/#destinasi', label: 'Destinasi' },
    { to: '/#cara-kerja', label: 'Cara Kerja' },
    { to: '/#tentang', label: 'Tentang Jajapin' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Main Navigation Bar (Bersih, Rapi & Netral) */}
      <div
        className={`transition-all duration-500 ${
          scrolled || !isHome
            ? 'bg-card/95 backdrop-blur-md shadow-xs border-b border-border/80'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 lg:h-20">
          {/* Left: Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src={siteMedia.logo}
              alt="Jajapin"
              className="w-10 h-10 rounded-full object-cover border-2 border-brand-lime/40 group-hover:scale-105 transition-transform shadow-xs"
            />
            <div>
              <span
                className={`font-display font-semibold text-lg tracking-tight ${
                  scrolled || !isHome ? 'text-foreground' : 'text-white'
                }`}
              >
                Jajapin
              </span>
              <span
                className={`block text-[9px] uppercase tracking-[0.28em] ${
                  scrolled || !isHome ? 'text-muted-foreground' : 'text-white/70'
                }`}
              >
                Pesona Indonesia
              </span>
            </div>
          </Link>

          {/* Center: Nav (desktop - Netral) */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-body font-medium transition-colors ${
                  scrolled || !isHome
                    ? 'text-foreground/90 hover:text-primary'
                    : 'text-white/85 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right: Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated && (
              <Link
                to="/bookings"
                className={`text-sm font-body font-medium transition-colors ${
                  scrolled || !isHome
                    ? 'text-foreground hover:text-primary'
                    : 'text-white/90 hover:text-white'
                }`}
              >
                Booking saya
              </Link>
            )}
            {isAuthenticated && (isOwner || isAdmin) && (
              <Link
                to="/dashboard"
                className={`text-sm font-body font-medium transition-colors ${
                  scrolled || !isHome
                    ? 'text-foreground hover:text-primary'
                    : 'text-white/90 hover:text-white'
                }`}
              >
                Dashboard
              </Link>
            )}
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span
                  className={`text-sm font-body ${
                    scrolled || !isHome ? 'text-muted-foreground' : 'text-white/70'
                  }`}
                >
                  {user.name}
                </span>
                <button
                  onClick={logout}
                  className={`text-sm font-body font-medium ${
                    scrolled || !isHome ? 'text-red-500 hover:text-red-700' : 'text-red-300 hover:text-white'
                  }`}
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
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-2 text-white"
            aria-label="Menu Navigasi"
          >
            {menuOpen ? (
              <X className={`w-6 h-6 ${scrolled || !isHome ? 'text-foreground' : 'text-white'}`} />
            ) : (
              <Menu className={`w-6 h-6 ${scrolled || !isHome ? 'text-foreground' : 'text-white'}`} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu panel (Bersih & Netral) */}
      {menuOpen && (
        <div className="lg:hidden absolute top-full left-4 right-4 mt-2 bg-card rounded-3xl shadow-xl border border-border p-6 animate-in">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className="text-foreground font-body font-medium hover:text-primary transition-colors py-1"
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated && (
              <Link
                to="/bookings"
                onClick={() => setMenuOpen(false)}
                className="text-foreground font-body font-medium hover:text-primary py-1"
              >
                Booking saya
              </Link>
            )}
            {isAuthenticated && (isOwner || isAdmin) && (
              <Link
                to="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="text-foreground font-body font-medium hover:text-primary py-1"
              >
                Dashboard
              </Link>
            )}
            <hr className="border-border my-1" />
            {isAuthenticated ? (
              <div className="flex items-center justify-between pt-1">
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

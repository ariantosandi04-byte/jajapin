import { Link } from 'react-router-dom';
import SiteHeader from '../components/site/SiteHeader';
import SiteFooter from '../components/site/SiteFooter';
import { Button } from '../components/ui/Button';
import { Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="font-display font-light text-8xl text-primary mb-4">404</h1>
          <p className="font-display text-2xl text-foreground mb-2">Halaman tidak ditemukan</p>
          <p className="font-body text-muted-foreground mb-8">Alamat yang Anda tuju tidak tersedia atau sudah dipindahkan.</p>
          <Link to="/">
            <Button><Home className="w-4 h-4 mr-2" /> Kembali ke beranda</Button>
          </Link>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}

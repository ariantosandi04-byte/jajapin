import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Users, X } from 'lucide-react';
import { Button } from '../ui/Button';

const popularDestinations = [
  'Bandung, Jawa Barat',
  'Yogyakarta, D.I. Yogyakarta',
  'Ubud, Bali',
  'Labuan Bajo, Nusa Tenggara Timur',
  'Tasikmalaya, Jawa Barat',
  'Pangandaran, Jawa Barat',
  'Sukabumi, Jawa Barat',
  'Bukittinggi, Sumatera Barat',
  'Kuta, Lombok',
];

export default function SearchBar() {
  const navigate = useNavigate();
  const [destination, setDestination] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2');

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    const cleanDest = destination.trim();
    if (cleanDest) {
      // Cari secara netral berdasarkan area/kata kunci atau nama kota
      params.set('area', cleanDest);
    }
    if (checkIn) params.set('checkIn', checkIn);
    if (checkOut) params.set('checkOut', checkOut);
    if (guests) params.set('guests', guests);
    navigate(`/stays?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="bg-white/15 dark:bg-card/70 backdrop-blur-xl rounded-3xl lg:rounded-full border border-white/25 dark:border-border shadow-xl p-2.5 sm:p-3 flex flex-col lg:flex-row items-stretch lg:items-center gap-2 max-w-4xl w-full"
    >
      {/* Kolom Destinasi Netral */}
      <div className="flex items-center gap-2.5 px-4 flex-1 min-w-0 py-1">
        <MapPin className="w-5 h-5 text-brand-lime shrink-0" />
        <div className="flex-1 min-w-0">
          <label htmlFor="search-destination" className="sr-only">
            Lokasi, Kota, atau Nama Penginapan
          </label>
          <input
            id="search-destination"
            type="text"
            list="destinations-list"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Mau menginap di mana? (Kota, destinasi, atau hotel)"
            className="bg-transparent text-white dark:text-foreground placeholder-white/70 dark:placeholder-muted-foreground text-sm font-body w-full focus:outline-none"
            autoComplete="off"
          />
          <datalist id="destinations-list">
            {popularDestinations.map((d) => (
              <option key={d} value={d} />
            ))}
          </datalist>
        </div>
        {destination && (
          <button
            type="button"
            onClick={() => setDestination('')}
            className="p-1 rounded-full text-white/60 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="hidden lg:block w-px h-8 bg-white/20 dark:bg-border" />

      {/* Tanggal Check-in */}
      <div className="flex items-center gap-2 px-4 flex-1 py-1">
        <Calendar className="w-4 h-4 text-white/60 dark:text-muted-foreground shrink-0" />
        <div className="flex-1 min-w-0">
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="bg-transparent text-white dark:text-foreground text-xs sm:text-sm font-body w-full focus:outline-none"
            aria-label="Tanggal Check-in"
          />
        </div>
      </div>

      <div className="hidden lg:block w-px h-8 bg-white/20 dark:bg-border" />

      {/* Tanggal Check-out */}
      <div className="flex items-center gap-2 px-4 flex-1 py-1">
        <Calendar className="w-4 h-4 text-white/60 dark:text-muted-foreground shrink-0" />
        <div className="flex-1 min-w-0">
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="bg-transparent text-white dark:text-foreground text-xs sm:text-sm font-body w-full focus:outline-none"
            aria-label="Tanggal Check-out"
          />
        </div>
      </div>

      <div className="hidden lg:block w-px h-8 bg-white/20 dark:bg-border" />

      {/* Jumlah Tamu */}
      <div className="flex items-center gap-2 px-4 py-1">
        <Users className="w-4 h-4 text-white/60 dark:text-muted-foreground shrink-0" />
        <select
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
          className="bg-transparent text-white dark:text-foreground text-sm font-body py-1 focus:outline-none appearance-none cursor-pointer"
          aria-label="Jumlah Tamu"
        >
          <option value="1" className="text-foreground">1 Tamu</option>
          <option value="2" className="text-foreground">2 Tamu</option>
          <option value="3" className="text-foreground">3 Tamu</option>
          <option value="4" className="text-foreground">4 Tamu</option>
          <option value="5" className="text-foreground">5+ Tamu</option>
        </select>
      </div>

      {/* Tombol Cari */}
      <Button
        type="submit"
        variant="lime"
        className="rounded-full px-6 py-2.5 shrink-0 font-semibold shadow-md"
      >
        <Search className="w-4 h-4 mr-2" /> Cari
      </Button>
    </form>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Users } from 'lucide-react';
import { Button } from '../ui/Button';

const cities = ['Ubud', 'Yogyakarta', 'Kuta', 'Lembang', 'Labuan Bajo', 'Pelabuhan Ratu', 'Jakarta Selatan'];

export default function SearchBar() {
  const navigate = useNavigate();
  const [city, setCity] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2');

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city) params.set('city', city);
    if (checkIn) params.set('checkIn', checkIn);
    if (checkOut) params.set('checkOut', checkOut);
    if (guests) params.set('guests', guests);
    navigate(`/stays?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="bg-white/10 backdrop-blur-xl rounded-full border border-white/20 p-2 flex flex-col lg:flex-row items-stretch lg:items-center gap-2 max-w-4xl">
      <div className="flex items-center gap-2 px-4 flex-1 min-w-0">
        <MapPin className="w-4 h-4 text-white/50 shrink-0" />
        <select value={city} onChange={(e) => setCity(e.target.value)} className="bg-transparent text-white text-sm font-body w-full py-2 focus:outline-none appearance-none cursor-pointer" aria-label="Destinasi">
          <option value="" className="text-foreground">Semua destinasi</option>
          {cities.map(c => <option key={c} value={c} className="text-foreground">{c}</option>)}
        </select>
      </div>
      <div className="hidden lg:block w-px h-8 bg-white/20" />
      <div className="flex items-center gap-2 px-4 flex-1">
        <Calendar className="w-4 h-4 text-white/50 shrink-0" />
        <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="bg-transparent text-white text-sm font-body w-full py-2 focus:outline-none" aria-label="Check-in" placeholder="Check-in" />
      </div>
      <div className="hidden lg:block w-px h-8 bg-white/20" />
      <div className="flex items-center gap-2 px-4 flex-1">
        <Calendar className="w-4 h-4 text-white/50 shrink-0" />
        <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="bg-transparent text-white text-sm font-body w-full py-2 focus:outline-none" aria-label="Check-out" placeholder="Check-out" />
      </div>
      <div className="hidden lg:block w-px h-8 bg-white/20" />
      <div className="flex items-center gap-2 px-4">
        <Users className="w-4 h-4 text-white/50 shrink-0" />
        <select value={guests} onChange={(e) => setGuests(e.target.value)} className="bg-transparent text-white text-sm font-body py-2 focus:outline-none appearance-none cursor-pointer" aria-label="Jumlah tamu">
          {[1,2,3,4,5,6].map(n => <option key={n} value={n} className="text-foreground">{n} tamu</option>)}
        </select>
      </div>
      <Button type="submit" variant="lime" className="rounded-full px-6 shrink-0">
        <Search className="w-4 h-4 mr-2" /> Cari
      </Button>
    </form>
  );
}

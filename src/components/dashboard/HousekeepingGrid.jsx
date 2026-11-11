import { useState } from 'react';
import { Sparkles, CheckCircle, AlertTriangle, Eye, ShieldAlert, RotateCw } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export default function HousekeepingGrid() {
  const [rooms, setRooms] = useState([
    // Lantai 1: 5 Unit Deluxe Room (King Size, AC, Water Heater, TV, Meja Rias, Lemari, Sofa)
    { number: '101', type: 'Deluxe', status: 'Bersih', housekeeper: 'Siti R.' },
    { number: '102', type: 'Deluxe', status: 'Bersih', housekeeper: 'Asep M.' },
    { number: '103', type: 'Deluxe', status: 'Bersih', housekeeper: 'Siti R.' },
    { number: '104', type: 'Deluxe', status: 'Diperiksa', housekeeper: 'Budi W.' },
    { number: '105', type: 'Deluxe', status: 'Bersih', housekeeper: 'Budi W.' },

    // Lantai 2: 5 Unit Standard AC (Queen Bed, Toilet Duduk Western, AC)
    { number: '201', type: 'Standard AC', status: 'Bersih', housekeeper: 'Asep M.' },
    { number: '202', type: 'Standard AC', status: 'Kotor', housekeeper: 'Asep M.' },
    { number: '203', type: 'Standard AC', status: 'Bersih', housekeeper: 'Siti R.' },
    { number: '204', type: 'Standard AC', status: 'Bersih', housekeeper: 'Siti R.' },
    { number: '205', type: 'Standard AC', status: 'Bersih', housekeeper: 'Budi W.' },

    // Lantai 3: 5 Unit Fan Room / Kipas (Queen Bed, Toilet Jongkok Indian)
    { number: '301', type: 'Fan / Kipas', status: 'Bersih', housekeeper: 'Budi W.' },
    { number: '302', type: 'Fan / Kipas', status: 'Bersih', housekeeper: 'Siti R.' },
    { number: '303', type: 'Fan / Kipas', status: 'Kotor', housekeeper: 'Asep M.' },
    { number: '304', type: 'Fan / Kipas', status: 'Bersih', housekeeper: 'Asep M.' },
    { number: '305', type: 'Fan / Kipas', status: 'Bersih', housekeeper: 'Siti R.' },
  ]);

  const counts = {
    Bersih: rooms.filter((r) => r.status === 'Bersih').length,
    Kotor: rooms.filter((r) => r.status === 'Kotor').length,
    Diperiksa: rooms.filter((r) => r.status === 'Diperiksa').length,
    'Tutup Sementara': rooms.filter((r) => r.status === 'Tutup Sementara').length,
  };

  const cycleStatus = (num) => {
    const sequence = ['Bersih', 'Kotor', 'Diperiksa', 'Tutup Sementara'];
    setRooms(
      rooms.map((r) => {
        if (r.number === num) {
          const nextIdx = (sequence.indexOf(r.status) + 1) % sequence.length;
          return { ...r, status: sequence[nextIdx] };
        }
        return r;
      })
    );
  };

  const getStatusColor = (st) => {
    switch (st) {
      case 'Bersih':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Kotor':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Diperiksa':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="border-border bg-card">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="font-display font-semibold text-lg text-foreground flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" /> Housekeeping & Status Kamar
            </h3>
            <p className="text-xs text-muted-foreground font-body">
              Klik pada kartu kamar untuk mengubah status kebersihan secara instan
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-xs font-body">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 font-semibold border border-green-200">
              <span className="w-2 h-2 rounded-full bg-green-500" /> Bersih: {counts.Bersih}
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 font-semibold border border-red-200">
              <span className="w-2 h-2 rounded-full bg-red-500" /> Kotor: {counts.Kotor}
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-200">
              <span className="w-2 h-2 rounded-full bg-blue-500" /> Diperiksa: {counts.Diperiksa}
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-50 text-gray-700 font-semibold border border-gray-200">
              <span className="w-2 h-2 rounded-full bg-gray-500" /> Tutup: {counts['Tutup Sementara']}
            </span>
          </div>
        </div>

        {/* Room Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {rooms.map((room) => (
            <button
              key={room.number}
              type="button"
              onClick={() => cycleStatus(room.number)}
              className={`p-4 rounded-2xl border text-left transition-all hover:scale-[1.02] shadow-sm ${getStatusColor(
                room.status
              )}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-display font-bold text-lg">{room.number}</span>
                <RotateCw className="w-3.5 h-3.5 opacity-40 hover:opacity-100" />
              </div>
              <p className="text-xs font-semibold">{room.type}</p>
              <p className="text-[10px] uppercase tracking-wider opacity-80 mt-1">{room.status}</p>
              <p className="text-[10px] opacity-70 mt-1">Petugas: {room.housekeeper}</p>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

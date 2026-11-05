import { useState } from 'react';
import { BedDouble, Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Input } from '../ui/Input';
import { formatIDR } from '../../lib/format';

export default function RoomManagement({ propertyName }) {
  const [rooms, setRooms] = useState([
    { id: 101, type: 'Deluxe Room', price: 350000, beds: 1, capacity: 2, status: 'Tersedia' },
    { id: 102, type: 'Deluxe Room', price: 350000, beds: 1, capacity: 2, status: 'Terisi' },
    { id: 103, type: 'Deluxe Twin', price: 380000, beds: 2, capacity: 2, status: 'Tersedia' },
    { id: 104, type: 'Family Suite', price: 650000, beds: 3, capacity: 4, status: 'Tersedia' },
    { id: 105, type: 'Standard AC', price: 300000, beds: 1, capacity: 2, status: 'Tersedia' },
    { id: 106, type: 'Standard Non-AC', price: 200000, beds: 1, capacity: 2, status: 'Tersedia' },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [newRoom, setNewRoom] = useState({ id: '', type: 'Standard Room', price: 350000, beds: 1, capacity: 2, status: 'Tersedia' });

  const handleAddRoom = (e) => {
    e.preventDefault();
    if (!newRoom.id) return;
    setRooms([...rooms, { ...newRoom, id: Number(newRoom.id), price: Number(newRoom.price) }]);
    setNewRoom({ id: '', type: 'Standard Room', price: 350000, beds: 1, capacity: 2, status: 'Tersedia' });
    setIsAdding(false);
  };

  const handleDeleteRoom = (id) => {
    if (window.confirm(`Hapus Kamar ${id}?`)) {
      setRooms(rooms.filter((r) => r.id !== id));
    }
  };

  const handleToggleStatus = (id) => {
    setRooms(rooms.map((r) => {
      if (r.id === id) {
        return { ...r, status: r.status === 'Tersedia' ? 'Terisi' : 'Tersedia' };
      }
      return r;
    }));
  };

  return (
    <Card className="border-border bg-card">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="font-display font-semibold text-lg text-foreground flex items-center gap-2">
              <BedDouble className="w-5 h-5 text-primary" /> Kamar & Tipe — {propertyName}
            </h3>
            <p className="text-xs text-muted-foreground font-body">
              Manajemen inventaris unit, tipe kamar, tarif, dan ketersediaan (CRUD)
            </p>
          </div>
          <Button size="sm" onClick={() => setIsAdding(!isAdding)}>
            <Plus className="w-4 h-4 mr-1.5" /> Tambah Kamar
          </Button>
        </div>

        {isAdding && (
          <form onSubmit={handleAddRoom} className="p-4 mb-6 rounded-2xl bg-muted/40 border border-border space-y-4">
            <h4 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">Form Kamar Baru</h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <Input
                label="Nomor Kamar"
                type="number"
                value={newRoom.id}
                onChange={(e) => setNewRoom({ ...newRoom, id: e.target.value })}
                required
                placeholder="Misal: 107"
              />
              <Input
                label="Tipe Kamar"
                value={newRoom.type}
                onChange={(e) => setNewRoom({ ...newRoom, type: e.target.value })}
                required
                placeholder="Deluxe / Suite"
              />
              <Input
                label="Tarif / Malam (Rp)"
                type="number"
                value={newRoom.price}
                onChange={(e) => setNewRoom({ ...newRoom, price: e.target.value })}
                required
              />
              <Input
                label="Kapasitas Tamu"
                type="number"
                value={newRoom.capacity}
                onChange={(e) => setNewRoom({ ...newRoom, capacity: e.target.value })}
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsAdding(false)}>Batal</Button>
              <Button type="submit" size="sm">Simpan Kamar</Button>
            </div>
          </form>
        )}

        <div className="overflow-x-auto -mx-6">
          <table className="w-full text-left text-xs font-body">
            <thead className="bg-muted/40 text-[10px] uppercase tracking-wider text-muted-foreground border-y border-border">
              <tr>
                <th className="py-3 px-6">No. Kamar</th>
                <th className="py-3 px-4">Tipe Kamar</th>
                <th className="py-3 px-4">Tarif per Malam</th>
                <th className="py-3 px-4">Kapasitas</th>
                <th className="py-3 px-4">Status Kamar</th>
                <th className="py-3 px-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {rooms.map((room) => (
                <tr key={room.id} className="hover:bg-muted/20">
                  <td className="py-3.5 px-6 font-bold text-foreground">
                    Kamar #{room.id}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-foreground">{room.type}</td>
                  <td className="py-3.5 px-4">{formatIDR(room.price)}</td>
                  <td className="py-3.5 px-4">{room.capacity} Tamu ({room.beds} Bed)</td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => handleToggleStatus(room.id)}
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                        room.status === 'Tersedia'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {room.status}
                    </button>
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <button
                      onClick={() => handleDeleteRoom(room.id)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Hapus"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

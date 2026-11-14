import { useState, useEffect, useRef } from 'react';
import {
  BedDouble,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Image as ImageIcon,
  Save,
  CheckCircle2,
  Building,
  DollarSign,
  Users,
  Eye,
  Upload,
  Camera,
  Sparkles,
} from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Input } from '../ui/Input';
import { formatIDR } from '../../lib/format';

const HOTEL_PRESET_PHOTOS = [
  { label: 'Gerbang Depan', path: '/assets/putri-sari/cover.jpg' },
  { label: 'Deluxe (Kasur Hijau)', path: '/assets/putri-sari/3.jpg' },
  { label: 'Standard (Kasur Oranye)', path: '/assets/putri-sari/2.jpg' },
  { label: 'Standard AC Double', path: '/assets/putri-sari/4.jpg' },
  { label: 'Fan Room (Kipas & Balkon)', path: '/assets/putri-sari/fan-room.jpg' },
  { label: 'Fan Room / Single', path: '/assets/putri-sari/1.jpg' },
];

export default function RoomManagement({
  property,
  propertyName = 'Properti',
  onUpdateProperty,
}) {
  // Sync room types from property
  const [roomTypes, setRoomTypes] = useState([]);
  const [coverImage, setCoverImage] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [isAdding, setIsAdding] = useState(false);
  const coverFileInputRef = useRef(null);
  const newRoomFileInputRef = useRef(null);
  const editRoomFileInputRef = useRef(null);

  const handleFileUpload = (e, callback) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file foto maksimal 5 MB!');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === 'string') {
        callback(result);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };
  const [newRoom, setNewRoom] = useState({
    id: '',
    name: '',
    bed: '1 King / Double Bed',
    capacity: 2,
    price: 250000,
    available_units: 5,
    description: '',
    image: '/assets/putri-sari/3.jpg',
    amenities: ['AC', 'WiFi Cepat', 'Kamar Mandi Dalam'],
  });
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    if (property) {
      setRoomTypes(property.room_types || []);
      setCoverImage(property.image || '/assets/putri-sari/cover.jpg');
    }
  }, [property]);

  const handleSaveCoverImage = (e) => {
    e.preventDefault();
    if (onUpdateProperty && property) {
      onUpdateProperty({
        ...property,
        image: coverImage,
      });
      showNotice();
    }
  };

  const showNotice = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const startEdit = (idx) => {
    setEditingIndex(idx);
    setEditFormData({ ...roomTypes[idx] });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    const updated = [...roomTypes];
    updated[editingIndex] = {
      ...editFormData,
      price: Number(editFormData.price) || 0,
      capacity: Number(editFormData.capacity) || 2,
      available_units: Number(editFormData.available_units) || 0,
    };
    setRoomTypes(updated);
    setEditingIndex(null);

    if (onUpdateProperty && property) {
      onUpdateProperty({
        ...property,
        room_types: updated,
      });
      showNotice();
    }
  };

  const handleDeleteRoom = (idx) => {
    const target = roomTypes[idx];
    if (window.confirm(`Hapus tipe kamar "${target.name}"?`)) {
      const updated = roomTypes.filter((_, i) => i !== idx);
      setRoomTypes(updated);
      if (onUpdateProperty && property) {
        onUpdateProperty({
          ...property,
          room_types: updated,
        });
        showNotice();
      }
    }
  };

  const handleToggleAvailability = (idx) => {
    const updated = [...roomTypes];
    const current = updated[idx];
    // Toggle ketersediaan: jika 0 jadi 5, jika ada jadi 0
    const newUnits = (current.available_units || 0) > 0 ? 0 : 5;
    updated[idx] = {
      ...current,
      available_units: newUnits,
    };
    setRoomTypes(updated);
    if (onUpdateProperty && property) {
      onUpdateProperty({
        ...property,
        room_types: updated,
      });
      showNotice();
    }
  };

  const handleAddNewRoom = (e) => {
    e.preventDefault();
    if (!newRoom.name) return;

    const id = newRoom.name.toLowerCase().replace(/[^a-z0-9]+/g, '_');
    const roomPayload = {
      ...newRoom,
      id: id || `room_${Date.now()}`,
      price: Number(newRoom.price) || 150000,
      capacity: Number(newRoom.capacity) || 2,
      available_units: Number(newRoom.available_units) || 5,
    };

    const updated = [...roomTypes, roomPayload];
    setRoomTypes(updated);
    setIsAdding(false);
    setNewRoom({
      id: '',
      name: '',
      bed: '1 King / Double Bed',
      capacity: 2,
      price: 250000,
      available_units: 5,
      description: '',
      image: '/assets/putri-sari/3.jpg',
      amenities: ['AC', 'WiFi Cepat', 'Kamar Mandi Dalam'],
    });

    if (onUpdateProperty && property) {
      onUpdateProperty({
        ...property,
        room_types: updated,
      });
      showNotice();
    }
  };

  return (
    <div className="space-y-6">
      {savedNotice && (
        <div className="p-4 rounded-2xl bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center justify-between text-xs font-bold animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-700" />
            <span>Perubahan data kamar & ketersediaan berhasil disimpan ke sistem PMS & Booking!</span>
          </div>
          <button onClick={() => setSavedNotice(false)} className="text-emerald-700 hover:text-emerald-950">
            ✕
          </button>
        </div>
      )}

      {/* 1. KARTU UBAH GAMBAR COVER PROPERTI */}
      <Card className="border-border bg-card">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="font-display font-semibold text-lg text-foreground flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-emerald-700" /> Foto Utama & Cover — {propertyName}
              </h3>
              <p className="text-xs text-muted-foreground font-body">
                Ubah gambar profil dan sampul yang tampil di halaman booking tamu
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveCoverImage} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            <div className="sm:col-span-3">
              <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-muted border border-border shadow-xs">
                <img
                  src={coverImage || '/assets/putri-sari/cover.jpg'}
                  alt={propertyName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = '/assets/putri-sari/cover.jpg';
                  }}
                />
              </div>
            </div>

            <div className="sm:col-span-9 space-y-3">
              <Input
                label="Path / URL Gambar Cover Utama"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="Contoh: /assets/putri-sari/cover.jpg atau https://..."
                required
              />

              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="file"
                  ref={coverFileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, (dataUrl) => setCoverImage(dataUrl))}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => coverFileInputRef.current?.click()}
                  className="text-xs font-semibold gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5 text-emerald-700" />
                  Unggah dari HP / Komputer
                </Button>
                <Button type="submit" size="sm" className="bg-emerald-800 hover:bg-emerald-900 text-white font-semibold">
                  <Save className="w-4 h-4 mr-1.5" /> Simpan Foto Cover
                </Button>
              </div>

              {/* Koleksi Preset Bawaan Hotel */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] font-semibold text-muted-foreground mr-1">Koleksi Bawaan:</span>
                {HOTEL_PRESET_PHOTOS.map((opt) => (
                  <button
                    key={opt.path}
                    type="button"
                    onClick={() => setCoverImage(opt.path)}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-medium border transition-all ${
                      coverImage === opt.path
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-400 font-bold'
                        : 'bg-muted/50 text-muted-foreground border-border hover:bg-muted'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* 2. DAFTAR TIPE KAMAR, HARGA, & KETERSEDIAAN */}
      <Card className="border-border bg-card">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="font-display font-semibold text-lg text-foreground flex items-center gap-2">
                <BedDouble className="w-5 h-5 text-emerald-700" /> Tipe Kamar, Tarif & Ketersediaan — {propertyName}
              </h3>
              <p className="text-xs text-muted-foreground font-body">
                Kelola tipe kamar, ranjang, foto kamar, tarif per malam, dan kuantitas unit kamar yang tersedia untuk dipesan
              </p>
            </div>
            <Button size="sm" onClick={() => setIsAdding(!isAdding)} className="bg-emerald-800 hover:bg-emerald-900 text-white font-semibold">
              <Plus className="w-4 h-4 mr-1.5" /> Tambah Tipe Kamar
            </Button>
          </div>

          {/* FORM TAMBAH TIPE KAMAR BARU */}
          {isAdding && (
            <form onSubmit={handleAddNewRoom} className="p-5 mb-6 rounded-3xl bg-muted/40 border border-border space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <h4 className="font-semibold text-xs uppercase tracking-wider text-foreground">
                  Formulir Tipe Kamar Baru
                </h4>
                <button type="button" onClick={() => setIsAdding(false)} className="text-xs text-muted-foreground hover:text-foreground">
                  ✕ Batal
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Input
                  label="Nama Tipe Kamar"
                  value={newRoom.name}
                  onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
                  placeholder="Contoh: Deluxe King Suite (Kasur Hijau)"
                  required
                />
                <Input
                  label="Tipe Ranjang"
                  value={newRoom.bed}
                  onChange={(e) => setNewRoom({ ...newRoom, bed: e.target.value })}
                  placeholder="Contoh: 1 King Bed Ekstra Luas"
                  required
                />
                <Input
                  label="Tarif per Malam (Rp)"
                  type="number"
                  value={newRoom.price}
                  onChange={(e) => setNewRoom({ ...newRoom, price: Number(e.target.value) })}
                  required
                />
                <Input
                  label="Kapasitas Tamu"
                  type="number"
                  value={newRoom.capacity}
                  onChange={(e) => setNewRoom({ ...newRoom, capacity: Number(e.target.value) })}
                  required
                />
                <Input
                  label="Kuantitas Unit Kamar (Ketersediaan)"
                  type="number"
                  value={newRoom.available_units}
                  onChange={(e) => setNewRoom({ ...newRoom, available_units: Number(e.target.value) })}
                  required
                />
              </div>

              {/* Foto Tipe Kamar Baru */}
              <div className="p-3.5 rounded-2xl bg-background border border-border space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">
                    Foto Tipe Kamar
                  </span>
                  <input
                    type="file"
                    ref={newRoomFileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, (dataUrl) => setNewRoom({ ...newRoom, image: dataUrl }))}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => newRoomFileInputRef.current?.click()}
                    className="text-[11px] h-7 gap-1"
                  >
                    <Upload className="w-3 h-3 text-emerald-700" />
                    Unggah dari HP / Komputer
                  </Button>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-16 h-12 rounded-xl overflow-hidden bg-muted border border-border shrink-0 shadow-2xs">
                    <img
                      src={newRoom.image || '/assets/putri-sari/3.jpg'}
                      alt="Preview Foto"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/assets/putri-sari/3.jpg';
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      value={newRoom.image}
                      onChange={(e) => setNewRoom({ ...newRoom, image: e.target.value })}
                      placeholder="/assets/putri-sari/3.jpg atau tempel link URL online"
                      className="h-9 text-xs"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-muted-foreground mr-1">Preset Foto Cepat:</span>
                  {HOTEL_PRESET_PHOTOS.map((opt) => (
                    <button
                      key={opt.path}
                      type="button"
                      onClick={() => setNewRoom({ ...newRoom, image: opt.path })}
                      className={`px-2 py-0.5 rounded text-[10px] border transition-all ${
                        newRoom.image === opt.path
                          ? 'bg-emerald-100 text-emerald-900 border-emerald-400 font-bold'
                          : 'bg-muted/40 text-muted-foreground border-border hover:bg-muted'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <Input
                label="Deskripsi Kamar"
                value={newRoom.description}
                onChange={(e) => setNewRoom({ ...newRoom, description: e.target.value })}
                placeholder="Fasilitas AC dingin, lemari pakaian, balkon asri..."
              />

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsAdding(false)}>
                  Batal
                </Button>
                <Button type="submit" size="sm" className="bg-emerald-800 hover:bg-emerald-900 text-white font-semibold">
                  <Check className="w-4 h-4 mr-1.5" /> Simpan Tipe Kamar
                </Button>
              </div>
            </form>
          )}

          {/* TABEL / KARTU TIPE KAMAR */}
          <div className="overflow-x-auto -mx-6">
            <table className="w-full text-left text-xs font-body">
              <thead className="bg-muted/40 text-[10px] uppercase tracking-wider text-muted-foreground border-y border-border">
                <tr>
                  <th className="py-3 px-6">Foto</th>
                  <th className="py-3 px-4">Tipe Kamar & Ranjang</th>
                  <th className="py-3 px-4">Tarif / Malam</th>
                  <th className="py-3 px-4">Kapasitas</th>
                  <th className="py-3 px-4">Ketersediaan</th>
                  <th className="py-3 px-4">Status Booking</th>
                  <th className="py-3 px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {roomTypes.map((room, idx) => {
                  const isEditing = editingIndex === idx;
                  const isAvailable = (room.available_units || 0) > 0;

                  if (isEditing) {
                    return (
                      <tr key={idx} className="bg-emerald-50/50">
                        <td colSpan={7} className="p-5">
                          <form onSubmit={handleSaveEdit} className="space-y-3">
                            <div className="font-bold text-xs text-emerald-900 mb-1">
                              Edit Tipe Kamar: {room.name}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                              <Input
                                label="Nama Tipe Kamar"
                                value={editFormData.name || ''}
                                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                                required
                              />
                              <Input
                                label="Tarif / Malam (Rp)"
                                type="number"
                                value={editFormData.price || 0}
                                onChange={(e) => setEditFormData({ ...editFormData, price: e.target.value })}
                                required
                              />
                              <Input
                                label="Tipe Ranjang"
                                value={editFormData.bed || ''}
                                onChange={(e) => setEditFormData({ ...editFormData, bed: e.target.value })}
                                required
                              />
                              <Input
                                label="Unit Tersedia"
                                type="number"
                                value={editFormData.available_units || 0}
                                onChange={(e) => setEditFormData({ ...editFormData, available_units: e.target.value })}
                                required
                              />
                              <Input
                                label="Kapasitas Tamu"
                                type="number"
                                value={editFormData.capacity || 2}
                                onChange={(e) => setEditFormData({ ...editFormData, capacity: e.target.value })}
                                required
                              />
                              <div className="sm:col-span-3 p-3.5 rounded-2xl bg-background border border-border space-y-2.5">
                                <div className="flex items-center justify-between">
                                  <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">
                                    Ganti Foto Kamar
                                  </span>
                                  <input
                                    type="file"
                                    ref={editRoomFileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) => handleFileUpload(e, (dataUrl) => setEditFormData({ ...editFormData, image: dataUrl }))}
                                  />
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => editRoomFileInputRef.current?.click()}
                                    className="text-[11px] h-7 gap-1"
                                  >
                                    <Upload className="w-3 h-3 text-emerald-700" />
                                    Unggah Foto dari HP / Komputer
                                  </Button>
                                </div>

                                <div className="flex items-center gap-3">
                                  <div className="w-16 h-12 rounded-xl overflow-hidden bg-muted border border-border shrink-0 shadow-2xs">
                                    <img
                                      src={editFormData.image || '/assets/putri-sari/3.jpg'}
                                      alt="Preview Foto"
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        e.target.src = '/assets/putri-sari/3.jpg';
                                      }}
                                    />
                                  </div>
                                  <div className="flex-1">
                                    <Input
                                      value={editFormData.image || ''}
                                      onChange={(e) => setEditFormData({ ...editFormData, image: e.target.value })}
                                      placeholder="/assets/putri-sari/3.jpg atau tempel URL online"
                                      className="h-9 text-xs"
                                      required
                                    />
                                  </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                                  <span className="text-[10px] text-muted-foreground mr-1">Preset Foto Cepat:</span>
                                  {HOTEL_PRESET_PHOTOS.map((opt) => (
                                    <button
                                      key={opt.path}
                                      type="button"
                                      onClick={() => setEditFormData({ ...editFormData, image: opt.path })}
                                      className={`px-2 py-0.5 rounded text-[10px] border transition-all ${
                                        editFormData.image === opt.path
                                          ? 'bg-emerald-100 text-emerald-900 border-emerald-400 font-bold'
                                          : 'bg-muted/40 text-muted-foreground border-border hover:bg-muted'
                                      }`}
                                    >
                                      {opt.label}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                              <Button type="button" variant="outline" size="sm" onClick={() => setEditingIndex(null)}>
                                Batal
                              </Button>
                              <Button type="submit" size="sm" className="bg-emerald-800 hover:bg-emerald-900 text-white font-semibold">
                                <Save className="w-4 h-4 mr-1.5" /> Simpan Perubahan
                              </Button>
                            </div>
                          </form>
                        </td>
                      </tr>
                    );
                  }

                  return (
                    <tr key={idx} className="hover:bg-muted/20">
                      {/* Foto Thumbnail */}
                      <td className="py-3.5 px-6">
                        <div className="w-14 h-11 rounded-xl overflow-hidden bg-muted border border-border">
                          <img
                            src={room.image || '/assets/putri-sari/3.jpg'}
                            alt={room.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = '/assets/putri-sari/3.jpg';
                            }}
                          />
                        </div>
                      </td>

                      {/* Tipe Kamar */}
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-foreground block text-xs">{room.name}</span>
                        <span className="text-[11px] text-muted-foreground">{room.bed}</span>
                      </td>

                      {/* Tarif */}
                      <td className="py-3.5 px-4 font-bold text-emerald-800">
                        {formatIDR(room.price)}
                      </td>

                      {/* Kapasitas */}
                      <td className="py-3.5 px-4 text-muted-foreground">
                        {room.capacity} Tamu
                      </td>

                      {/* Ketersediaan Unit */}
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-foreground">{room.available_units || 0} Unit</span>
                      </td>

                      {/* Status Toggle */}
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleToggleAvailability(idx)}
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${
                            isAvailable
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200'
                              : 'bg-rose-100 text-rose-800 border border-rose-300 hover:bg-rose-200'
                          }`}
                          title="Klik untuk ubah ketersediaan"
                        >
                          {isAvailable ? '✓ Tersedia' : '✕ Penuh / Ditutup'}
                        </button>
                      </td>

                      {/* Aksi */}
                      <td className="py-3.5 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => startEdit(idx)}
                            className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Edit Tipe Kamar, Foto & Tarif"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteRoom(idx)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Hapus"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

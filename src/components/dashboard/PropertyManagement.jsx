import { useState, useRef } from 'react';
import {
  Building,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  MapPin,
  DollarSign,
  Star,
  Globe,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Link2,
  Upload,
} from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Input } from '../ui/Input';
import { formatIDR } from '../../lib/format';

export default function PropertyManagement({
  properties = [],
  isAdmin,
  currentOwnerEmail,
  onSaveProperty,
}) {
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});
  const propFileInputRef = useRef(null);

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
  const [isAddingNew, setIsAddingNew] = useState(false);

  // New property form state
  const [newProp, setNewProp] = useState({
    name: '',
    type: 'Hotel',
    city: '',
    province: 'Jawa Barat',
    address: '',
    tagline: '',
    description: '',
    price: 250000,
    agodaUrl: '',
    mainRoomType: 'Deluxe Room',
  });

  const startEdit = (prop) => {
    setEditingId(prop.id);
    setFormData({ ...prop });
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (onSaveProperty) {
      onSaveProperty(formData);
    }
    setEditingId(null);
  };

  const handleAddNewProperty = (e) => {
    e.preventDefault();
    if (!newProp.name || !newProp.city) {
      alert('Nama properti dan kota wajib diisi!');
      return;
    }

    const payload = {
      name: newProp.name,
      type: newProp.type,
      city: newProp.city,
      province: newProp.province,
      address: newProp.address || `Jl. ${newProp.name}, ${newProp.city}`,
      tagline: newProp.tagline || `Penginapan nyaman & strategis di ${newProp.city}.`,
      description:
        newProp.description ||
        `${newProp.name} adalah akomodasi pilihan di ${newProp.city} yang terdaftar di Agoda dan sistem Jajapin.id. Menyediakan kamar bersih, nyaman, dan fasilitas lengkap dengan jaminan harga langsung pengelola.`,
      price: Number(newProp.price) || 250000,
      image: '/assets/destinasi-bandung.png',
      gallery: ['/assets/destinasi-ubud.png', '/assets/destinasi-lombok.png'],
      rating: 4.8,
      review_count: 36,
      guests: 2,
      bedrooms: 1,
      beds: 1,
      bathrooms: 1,
      amenities: ['AC / Kipas', 'WiFi Gratis', 'Kamar Mandi Dalam', 'Parkir', 'Resepsionis 24 Jam'],
      is_active: true,
      is_jajapin_verified: true,
      ota_links: {
        agoda: newProp.agodaUrl || 'https://www.agoda.com',
      },
      room_types: [
        {
          id: 'standard',
          name: newProp.mainRoomType || 'Standard Room',
          bed: '1 Double / Queen Bed',
          capacity: 2,
          price: Number(newProp.price) || 250000,
          available_units: 6,
          description: `Kamar tipe ${newProp.mainRoomType || 'Standard Room'} dengan fasilitas lengkap dan AC.`,
          image: '/assets/destinasi-bandung.png',
          amenities: ['AC', 'WiFi Cepat', 'Kamar Mandi Dalam', 'TV'],
        },
        {
          id: 'superior',
          name: 'Superior Room (Lebih Luas)',
          bed: '1 King Bed',
          capacity: 2,
          price: Math.round(Number(newProp.price || 250000) * 1.3),
          available_units: 4,
          description: 'Kamar lebih luas dengan kasur king bed dan pemandangan luar.',
          image: '/assets/destinasi-ubud.png',
          amenities: ['King Bed', 'AC', 'Shower Air Hangat', 'Smart TV'],
        },
      ],
    };

    if (onSaveProperty) {
      onSaveProperty(payload);
    }

    setIsAddingNew(false);
    setNewProp({
      name: '',
      type: 'Hotel',
      city: '',
      province: 'Jawa Barat',
      address: '',
      tagline: '',
      description: '',
      price: 250000,
      agodaUrl: '',
      mainRoomType: 'Deluxe Room',
    });
  };

  return (
    <Card className="border-border bg-card">
      <CardContent className="p-6 space-y-6">
        {/* Header & Add Button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <div>
            <h3 className="font-display font-semibold text-lg text-foreground flex items-center gap-2">
              <Building className="w-5 h-5 text-primary" /> Kelola Properti & Listing ({properties.length})
            </h3>
            <p className="text-xs text-muted-foreground font-body">
              {isAdmin
                ? 'Super Admin: Akses penuh mengelola seluruh listing hotel, villa, dan integrasi Agoda/OTA'
                : 'Pemilik Properti: Kelola informasi penginapan, tarif kamar, dan tautan Agoda Anda'}
            </p>
          </div>

          <Button
            onClick={() => setIsAddingNew(true)}
            className="bg-emerald-700 hover:bg-emerald-800 text-white gap-2 font-semibold shadow-sm"
          >
            <Plus className="w-4 h-4" /> Tambah Properti (Agoda / Baru)
          </Button>
        </div>

        {/* MODAL / FORM TAMBAH PROPERTI BARU */}
        {isAddingNew && (
          <div className="p-6 rounded-3xl bg-emerald-50/50 dark:bg-emerald-950/20 border-2 border-emerald-300 dark:border-emerald-800 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-800 dark:text-emerald-300 block">
                  Formulir Listing Baru
                </span>
                <h4 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" /> Masukkan Properti Agoda / Baru ke Jajapin
                </h4>
              </div>
              <button
                onClick={() => setIsAddingNew(false)}
                className="w-8 h-8 rounded-full hover:bg-black/10 flex items-center justify-center text-foreground"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddNewProperty} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <Input
                  label="Nama Properti (Sesuai di Agoda)"
                  placeholder="Contoh: Jajapin Villa Sunset / Agoda Hotel Sukabumi"
                  value={newProp.name}
                  onChange={(e) => setNewProp({ ...newProp, name: e.target.value })}
                  required
                />

                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-muted-foreground font-body mb-1">
                    Tipe Penginapan
                  </label>
                  <select
                    value={newProp.type}
                    onChange={(e) => setNewProp({ ...newProp, type: e.target.value })}
                    className="w-full h-11 px-3.5 rounded-2xl border border-border bg-card text-xs font-body text-foreground focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="Hotel">Hotel</option>
                    <option value="Villa">Villa</option>
                    <option value="Glamping">Glamping</option>
                    <option value="Guest House">Guest House</option>
                    <option value="Homestay">Homestay</option>
                    <option value="Apartemen">Apartemen</option>
                    <option value="Resort">Resort</option>
                    <option value="Pondok Wisata">Pondok Wisata</option>
                  </select>
                </div>

                <Input
                  label="Tarif per Malam (Rp)"
                  type="number"
                  placeholder="250000"
                  value={newProp.price}
                  onChange={(e) => setNewProp({ ...newProp, price: e.target.value })}
                  required
                />

                <Input
                  label="Kota / Wilayah"
                  placeholder="Contoh: Pelabuhan Ratu / Pangandaran / Bandung"
                  value={newProp.city}
                  onChange={(e) => setNewProp({ ...newProp, city: e.target.value })}
                  required
                />

                <Input
                  label="Provinsi"
                  placeholder="Contoh: Jawa Barat / Bali / NTT"
                  value={newProp.province}
                  onChange={(e) => setNewProp({ ...newProp, province: e.target.value })}
                  required
                />

                <Input
                  label="Tipe Kamar Utama"
                  placeholder="Contoh: Deluxe Room AC / Standard Single"
                  value={newProp.mainRoomType}
                  onChange={(e) => setNewProp({ ...newProp, mainRoomType: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Link Listing Agoda (Opsional)"
                  placeholder="https://www.agoda.com/id-id/..."
                  value={newProp.agodaUrl}
                  onChange={(e) => setNewProp({ ...newProp, agodaUrl: e.target.value })}
                />

                <Input
                  label="Tagline / Slogan Singkat"
                  placeholder="Contoh: Langkah kaki dari pantai pasir putih."
                  value={newProp.tagline}
                  onChange={(e) => setNewProp({ ...newProp, tagline: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-muted-foreground font-body mb-1">
                  Alamat Lengkap Properti
                </label>
                <Input
                  placeholder="Jl. Raya Pantai No. 12, Kelurahan XYZ, Sukabumi..."
                  value={newProp.address}
                  onChange={(e) => setNewProp({ ...newProp, address: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setIsAddingNew(false)}>
                  Batal
                </Button>
                <Button type="submit" className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold">
                  <Check className="w-4 h-4 mr-1.5" /> Simpan & Daftarkan ke Jajapin
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* LIST DAFTAR PROPERTI */}
        <div className="grid grid-cols-1 gap-4">
          {properties.map((prop) => {
            const isEditing = editingId === prop.id;

            return (
              <div
                key={prop.id}
                className="p-5 rounded-3xl border border-border bg-background/50 hover:bg-background transition-colors"
              >
                {isEditing ? (
                  <form onSubmit={handleSave} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <Input
                        label="Nama Properti"
                        value={formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                      <Input
                        label="Tarif per Malam (Rp)"
                        type="number"
                        value={formData.price || 0}
                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                        required
                      />
                      <Input
                        label="Tagline"
                        value={formData.tagline || ''}
                        onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-[0.2em] font-body font-semibold text-muted-foreground mb-2">
                        Deskripsi Lengkap
                      </label>
                      <textarea
                        value={formData.description || ''}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                        className="w-full rounded-2xl border border-border bg-card px-4 py-2 font-body text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                      />
                    </div>

                    {/* Ganti Foto Cover Properti */}
                    <div className="p-3.5 rounded-2xl bg-card border border-border space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground font-body">
                          Foto Utama / Cover Properti
                        </span>
                        <input
                          type="file"
                          ref={propFileInputRef}
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, (dataUrl) => setFormData({ ...formData, image: dataUrl }))}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => propFileInputRef.current?.click()}
                          className="text-[11px] h-7 gap-1"
                        >
                          <Upload className="w-3 h-3 text-emerald-700" />
                          Unggah dari HP / Komputer
                        </Button>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-16 h-12 rounded-xl overflow-hidden bg-muted border border-border shrink-0 shadow-2xs">
                          <img
                            src={formData.image || '/assets/putri-sari/cover.jpg'}
                            alt="Preview Foto"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = '/assets/putri-sari/cover.jpg';
                            }}
                          />
                        </div>
                        <div className="flex-1">
                          <Input
                            value={formData.image || ''}
                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                            placeholder="/assets/putri-sari/cover.jpg atau tautan URL online"
                            className="h-9 text-xs"
                          />
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[10px] text-muted-foreground mr-1">Preset Foto Cepat:</span>
                        {[
                          { label: 'Gerbang Depan', path: '/assets/putri-sari/cover.jpg' },
                          { label: 'Deluxe (Kasur Hijau)', path: '/assets/putri-sari/3.jpg' },
                          { label: 'Standard (Kasur Oranye)', path: '/assets/putri-sari/2.jpg' },
                          { label: 'Standard AC Double', path: '/assets/putri-sari/4.jpg' },
                          { label: 'Fan Room (Kipas & Balkon)', path: '/assets/putri-sari/fan-room.jpg' },
                          { label: 'Fan Room / Single', path: '/assets/putri-sari/1.jpg' },
                        ].map((opt) => (
                          <button
                            key={opt.path}
                            type="button"
                            onClick={() => setFormData({ ...formData, image: opt.path })}
                            className={`px-2 py-0.5 rounded text-[10px] border transition-all ${
                              formData.image === opt.path
                                ? 'bg-emerald-100 text-emerald-900 border-emerald-400 font-bold'
                                : 'bg-muted/40 text-muted-foreground border-border hover:bg-muted'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" size="sm" onClick={() => setEditingId(null)}>
                        Batal
                      </Button>
                      <Button type="submit" size="sm">
                        Simpan Perubahan
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex gap-4 items-center">
                      <img
                        src={prop.image}
                        alt={prop.name}
                        className="w-20 h-20 rounded-2xl object-cover shrink-0"
                      />
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <Badge variant="lime">{prop.type}</Badge>
                          {prop.is_jajapin_verified && (
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                              ✓ Jajapin Official
                            </span>
                          )}
                          {prop.ota_links?.agoda && (
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 flex items-center gap-1">
                              ⚡ Agoda Sync
                            </span>
                          )}
                          <span className="text-xs text-muted-foreground font-body">ID: #{prop.id}</span>
                          <span className="text-xs text-primary font-body font-semibold">
                            Pemilik: {prop.owner_email}
                          </span>
                        </div>
                        <h4 className="font-display font-semibold text-base text-foreground">
                          {prop.name}
                        </h4>
                        <p className="text-xs text-muted-foreground font-body flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" /> {prop.city}, {prop.province}
                        </p>
                        <p className="text-xs italic text-accent font-display mt-0.5">
                          "{prop.tagline}"
                        </p>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-end justify-between w-full sm:w-auto gap-2">
                      <div className="text-right">
                        <span className="font-display font-bold text-lg text-emerald-700 dark:text-emerald-400 block">
                          {formatIDR(prop.price)}
                        </span>
                        <span className="text-[11px] text-muted-foreground font-body">
                          Rating {prop.rating} ({prop.review_count} ulasan)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {prop.ota_links?.agoda && (
                          <a
                            href={prop.ota_links.agoda}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[11px] font-semibold text-orange-700 hover:underline flex items-center gap-1 px-2.5 py-1 rounded-xl bg-orange-50 border border-orange-200"
                          >
                            <ExternalLink className="w-3 h-3" /> Buka di Agoda
                          </a>
                        )}
                        <Button size="sm" variant="outline" onClick={() => startEdit(prop)}>
                          <Edit2 className="w-3.5 h-3.5 mr-1.5" /> Edit Data
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

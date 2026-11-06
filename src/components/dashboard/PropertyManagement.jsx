import { useState } from 'react';
import { Building, Plus, Edit2, Trash2, Check, X, MapPin, DollarSign, Star } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Input } from '../ui/Input';
import { formatIDR } from '../../lib/format';

export default function PropertyManagement({ properties = [], isAdmin, currentOwnerEmail, onSaveProperty }) {
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});

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

  return (
    <Card className="border-border bg-card">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="font-display font-semibold text-lg text-foreground flex items-center gap-2">
              <Building className="w-5 h-5 text-primary" /> Kelola Properti & Tarif (CRUD)
            </h3>
            <p className="text-xs text-muted-foreground font-body">
              {isAdmin
                ? 'Super Admin: Akses penuh mengelola seluruh properti dan mitra penginapan'
                : 'Pemilik Properti: Kelola informasi penginapan, tarif, dan deskripsi unit Anda'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {properties.map((prop) => {
            const isEditing = editingId === prop.id;

            return (
              <div
                key={prop.id}
                className="p-5 rounded-2xl border border-border bg-background/50 hover:bg-background transition-colors"
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
                        <span className="font-display font-bold text-lg text-primary block">
                          {formatIDR(prop.price)}
                        </span>
                        <span className="text-[11px] text-muted-foreground font-body">
                          Rating {prop.rating} ({prop.review_count} ulasan)
                        </span>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => startEdit(prop)}>
                        <Edit2 className="w-3.5 h-3.5 mr-1.5" /> Edit Data
                      </Button>
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

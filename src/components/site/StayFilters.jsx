import { Select } from '../ui/Select';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { RotateCcw } from 'lucide-react';

const cityOptions = [
  { value: 'Pelabuhan Ratu', label: 'Pelabuhan Ratu (Sukabumi)' },
  { value: 'Cicurug, Sukabumi', label: 'Cicurug (Sukabumi)' },
  { value: 'Cisayong, Tasikmalaya', label: 'Tasikmalaya (Galunggung)' },
  { value: 'Bandung', label: 'Bandung' },
  { value: 'Pangandaran', label: 'Pangandaran' },
  { value: 'Bukittinggi', label: 'Bukittinggi (Sumbar)' },
  { value: 'Yogyakarta', label: 'Yogyakarta' },
  { value: 'Ubud', label: 'Ubud (Bali)' },
  { value: 'Labuan Bajo', label: 'Labuan Bajo' },
  { value: 'Kuta', label: 'Kuta (Lombok)' },
  { value: 'Lembang', label: 'Lembang (Bandung)' },
  { value: 'Jakarta Selatan', label: 'Jakarta Selatan' },
];

const typeOptions = [
  'Hotel',
  'Glamping',
  'Guest House',
  'Homestay',
  'Apartemen',
  'Pondok Wisata',
  'Villa',
  'Resort',
];

const guestOptions = [
  { value: '1', label: '1+ tamu' },
  { value: '2', label: '2+ tamu' },
  { value: '3', label: '3+ tamu' },
  { value: '4', label: '4+ tamu' },
  { value: '5', label: '5+ tamu' },
  { value: '6', label: '6+ tamu' },
];

const priceOptions = [
  { value: '250000', label: 'Maks Rp250.000 (Hemat)' },
  { value: '500000', label: 'Maks Rp500.000' },
  { value: '1000000', label: 'Maks Rp1.000.000' },
  { value: '1500000', label: 'Maks Rp1.500.000' },
  { value: '2500000', label: 'Maks Rp2.500.000' },
  { value: '999999999', label: 'Semua harga' },
];

export default function StayFilters({ filters, setFilters, onReset }) {
  const update = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="space-y-5 font-body">
      <Input
        label="Cari penginapan atau area"
        placeholder="Contoh: Putri Sari, Bandung, Pangandaran..."
        value={filters.area || ''}
        onChange={(e) => update('area', e.target.value)}
      />
      <Select
        label="Kota / Wilayah"
        options={cityOptions}
        value={filters.city || ''}
        onChange={(e) => update('city', e.target.value)}
        placeholder="Semua kota"
      />
      <Select
        label="Tipe Penginapan"
        options={typeOptions}
        value={filters.type || ''}
        onChange={(e) => update('type', e.target.value)}
        placeholder="Semua tipe"
      />
      <Select
        label="Batas Harga"
        options={priceOptions}
        value={filters.maxPrice || ''}
        onChange={(e) => update('maxPrice', e.target.value)}
        placeholder="Semua harga"
      />
      <Select
        label="Kapasitas Tamu"
        options={guestOptions}
        value={filters.guests || ''}
        onChange={(e) => update('guests', e.target.value)}
        placeholder="Semua"
      />
      <Button variant="ghost" className="w-full text-sm" onClick={onReset}>
        <RotateCcw className="w-4 h-4 mr-2" /> Reset filter
      </Button>
    </div>
  );
}

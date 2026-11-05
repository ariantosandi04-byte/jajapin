import { Select } from '../ui/Select';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { RotateCcw } from 'lucide-react';

const cityOptions = [
  { value: 'Ubud', label: 'Ubud' },
  { value: 'Yogyakarta', label: 'Yogyakarta' },
  { value: 'Kuta', label: 'Kuta, Lombok' },
  { value: 'Lembang', label: 'Lembang, Bandung' },
  { value: 'Labuan Bajo', label: 'Labuan Bajo' },
  { value: 'Pelabuhan Ratu', label: 'Pelabuhan Ratu' },
  { value: 'Jakarta Selatan', label: 'Jakarta Selatan' },
];

const typeOptions = ['Hotel', 'Homestay', 'Villa', 'Resort'];
const guestOptions = [
  { value: '1', label: '1 tamu' }, { value: '2', label: '2 tamu' },
  { value: '3', label: '3 tamu' }, { value: '4', label: '4 tamu' },
  { value: '5', label: '5 tamu' }, { value: '6', label: '6 tamu' },
];
const priceOptions = [
  { value: '500000', label: 'Maks Rp500.000' },
  { value: '1000000', label: 'Maks Rp1.000.000' },
  { value: '1500000', label: 'Maks Rp1.500.000' },
  { value: '2000000', label: 'Maks Rp2.000.000' },
  { value: '999999999', label: 'Semua harga' },
];

export default function StayFilters({ filters, setFilters, onReset }) {
  const update = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));

  return (
    <div className="space-y-5">
      <Input label="Cari area" placeholder="Contoh: Canggu, Seminyak..." value={filters.area || ''} onChange={(e) => update('area', e.target.value)} />
      <Select label="Kota" options={cityOptions} value={filters.city || ''} onChange={(e) => update('city', e.target.value)} placeholder="Semua kota" />
      <Select label="Tipe" options={typeOptions} value={filters.type || ''} onChange={(e) => update('type', e.target.value)} placeholder="Semua tipe" />
      <Select label="Harga maksimum" options={priceOptions} value={filters.maxPrice || ''} onChange={(e) => update('maxPrice', e.target.value)} placeholder="Semua harga" />
      <Select label="Jumlah tamu" options={guestOptions} value={filters.guests || ''} onChange={(e) => update('guests', e.target.value)} placeholder="Semua" />
      <Button variant="ghost" className="w-full text-sm" onClick={onReset}>
        <RotateCcw className="w-4 h-4 mr-2" /> Reset filter
      </Button>
    </div>
  );
}

import { useState } from 'react';
import {
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Key,
  Globe,
  Link2,
  Calendar,
  Layers,
  SlidersHorizontal,
  Copy,
  ExternalLink,
  Check,
  Radio,
  Clock,
  ArrowRight,
  TrendingUp,
  Tag,
  ToggleLeft,
  ToggleRight,
  Plane,
  Ticket,
  Building,
  Home,
} from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { formatIDR } from '../../lib/format';

export default function PmsPanel({ connection, onSaveConnection, onSyncNow }) {
  const [activeTab, setActiveTab] = useState('channels'); // 'channels' | 'mapping' | 'ical' | 'logs' | 'config'
  const [provider, setProvider] = useState(connection?.provider || 'Channex.io / SiteMinder');
  const [apiToken, setApiToken] = useState(connection?.api_token || 'jp_live_994827103859');
  const [webhookUrl, setWebhookUrl] = useState(connection?.reservations_url || 'https://pms.jajapin.id/api/v1/webhook');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [copiedIcal, setCopiedIcal] = useState(false);

  // Channels state
  const [channels, setChannels] = useState([
    {
      id: 'traveloka',
      name: 'Traveloka',
      code: 'TVLK',
      category: 'OTA Regional',
      isConnected: true,
      autoSyncRates: true,
      autoSyncAvailability: true,
      lastSync: 'Baru saja',
      color: 'bg-sky-50 text-sky-700 border-sky-200',
    },
    {
      id: 'tiket',
      name: 'Tiket.com',
      code: 'TKT',
      category: 'OTA Regional',
      isConnected: true,
      autoSyncRates: true,
      autoSyncAvailability: true,
      lastSync: '2 menit lalu',
      color: 'bg-amber-50 text-amber-800 border-amber-200',
    },
    {
      id: 'booking',
      name: 'Booking.com',
      code: 'BDC',
      category: 'OTA Global',
      isConnected: true,
      autoSyncRates: true,
      autoSyncAvailability: true,
      lastSync: '5 menit lalu',
      color: 'bg-indigo-50 text-indigo-900 border-indigo-200',
    },
    {
      id: 'agoda',
      name: 'Agoda YCS',
      code: 'AGD',
      category: 'OTA Global',
      isConnected: true,
      autoSyncRates: true,
      autoSyncAvailability: true,
      lastSync: '10 menit lalu',
      color: 'bg-orange-50 text-orange-800 border-orange-200',
    },
    {
      id: 'airbnb',
      name: 'Airbnb (iCal / API)',
      code: 'ABNB',
      category: 'Vacation Rental',
      isConnected: true,
      autoSyncRates: false,
      autoSyncAvailability: true,
      lastSync: '12 menit lalu',
      color: 'bg-rose-50 text-rose-800 border-rose-200',
    },
  ]);

  // Room mappings
  const [roomMappings, setRoomMappings] = useState([
    {
      id: 1,
      jajapinRoom: 'Deluxe Ocean View',
      basePrice: 350000,
      otaRoomId: 'RM-TVLK-101',
      markupPercent: 12,
      stopSell: false,
    },
    {
      id: 2,
      jajapinRoom: 'Standard Double Room',
      basePrice: 280000,
      otaRoomId: 'RM-TKT-202',
      markupPercent: 10,
      stopSell: false,
    },
    {
      id: 3,
      jajapinRoom: 'Suite Villa Sunset',
      basePrice: 2150000,
      otaRoomId: 'RM-BDC-303',
      markupPercent: 15,
      stopSell: false,
    },
  ]);

  // iCal feeds
  const [airbnbIcalUrl, setAirbnbIcalUrl] = useState('https://www.airbnb.com/calendar/ical/91823901.ics?s=...');
  const jajapinExportIcalUrl = 'https://pms.jajapin.id/api/v1/ical/property-6/calendar.ics';

  // Sync event logs
  const [logs, setLogs] = useState([
    {
      id: 1,
      time: 'Hari ini, 21:50 WIB',
      channel: 'Traveloka',
      event: 'Ketersediaan kamar disinkronkan (Availability Push)',
      status: 'success',
    },
    {
      id: 2,
      time: 'Hari ini, 21:42 WIB',
      channel: 'Tiket.com',
      event: 'Pembaruan tarif kamar Deluxe Ocean View: Rp385.000',
      status: 'success',
    },
    {
      id: 3,
      time: 'Hari ini, 21:30 WIB',
      channel: 'Airbnb iCal',
      event: 'Sinkronisasi kalender iCal eksternal selesai (2 tanggal terblokir)',
      status: 'success',
    },
    {
      id: 4,
      time: 'Kemarin, 18:15 WIB',
      channel: 'Booking.com',
      event: 'Reservasi masuk otomatis #BDC-771829 dimasukkan ke sistem PMS',
      status: 'success',
    },
  ]);

  const handleSyncAll = () => {
    setIsSyncing(true);
    setSyncSuccess(false);

    setTimeout(() => {
      setIsSyncing(false);
      setSyncSuccess(true);
      const newLog = {
        id: Date.now(),
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
        channel: 'Semua Channel',
        event: 'Sinkronisasi 2 arah berhasil: 5 channel OTA & ketersediaan kamar diperbarui.',
        status: 'success',
      };
      setLogs((prev) => [newLog, ...prev]);

      if (onSyncNow) onSyncNow();
    }, 1500);
  };

  const toggleChannel = (id) => {
    setChannels((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isConnected: !c.isConnected } : c))
    );
  };

  const toggleStopSell = (mappingId) => {
    setRoomMappings((prev) =>
      prev.map((m) => (m.id === mappingId ? { ...m, stopSell: !m.stopSell } : m))
    );
  };

  const handleCopyIcal = () => {
    navigator.clipboard.writeText(jajapinExportIcalUrl);
    setCopiedIcal(true);
    setTimeout(() => setCopiedIcal(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Status */}
      <Card className="border-border bg-card overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-[#0a2f18] to-[#144728] text-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-brand-lime font-body">
                  Channel Manager 2-Way Sync
                </span>
              </div>
              <h2 className="font-display font-semibold text-2xl text-white">
                Pusat Integrasi Channel Manager & OTA
              </h2>
              <p className="text-xs text-white/80 font-body max-w-xl mt-1">
                Hubungkan ketersediaan kamar, tarif, dan pemesanan secara otomatis 2 arah dengan Traveloka, Tiket.com, Booking.com, Agoda, dan Airbnb.
              </p>
            </div>

            <Button
              onClick={handleSyncAll}
              disabled={isSyncing}
              className="bg-brand-lime text-[#0a2f18] hover:bg-brand-lime/90 font-semibold shadow-lg whitespace-nowrap self-start sm:self-auto gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Menyinkronkan...' : 'Sinkronkan Sekarang'}
            </Button>
          </div>
        </div>

        {syncSuccess && (
          <div className="p-3.5 bg-emerald-50 border-b border-emerald-200 text-emerald-800 text-xs font-body flex items-center justify-between px-6 animate-in fade-in">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Sinkronisasi 2 arah berhasil! Seluruh channel OTA kini memiliki data ketersediaan & tarif terkini.
            </span>
            <span className="text-[10px] font-mono text-emerald-700">Waktu: Baru saja</span>
          </div>
        )}

        {/* Sub-Navigation Tabs */}
        <div className="flex border-b border-border bg-muted/20 px-6 gap-2 overflow-x-auto text-xs font-body">
          {[
            { id: 'channels', label: 'Channel OTA Terhubung (5)' },
            { id: 'mapping', label: 'Pemetaan Kamar & Markup' },
            { id: 'ical', label: 'Kalender iCal (Airbnb/Agoda)' },
            { id: 'logs', label: 'Riwayat Log Sinkronisasi' },
            { id: 'config', label: 'Pengaturan API & Webhook' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-3 font-semibold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </Card>

      {/* TAB 1: CHANNELS GRID */}
      {activeTab === 'channels' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-body text-muted-foreground">
              Status koneksi 2 arah per masing-masing Online Travel Agent (OTA).
            </p>
            <Badge variant="outline" className="text-xs">
              Penyedia Aktif: <strong>{provider}</strong>
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {channels.map((ch) => (
              <Card key={ch.id} className="border-border bg-card hover:border-primary/50 transition-all">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-display font-semibold text-base text-foreground">
                          {ch.name}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${ch.color}`}>
                          {ch.code}
                        </span>
                      </div>
                      <span className="text-[10px] text-muted-foreground font-body block mt-0.5">
                        {ch.category}
                      </span>
                    </div>

                    <button
                      onClick={() => toggleChannel(ch.id)}
                      className={`text-xs px-2.5 py-1 rounded-full font-semibold transition-colors ${
                        ch.isConnected
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      {ch.isConnected ? '● Terhubung' : '○ Non-aktif'}
                    </button>
                  </div>

                  <div className="space-y-1.5 text-xs font-body text-muted-foreground border-y border-border/60 py-2.5">
                    <div className="flex justify-between items-center">
                      <span>Sync Ketersediaan (Inventory):</span>
                      <span className={ch.autoSyncAvailability ? 'text-emerald-600 font-semibold' : 'text-muted-foreground'}>
                        {ch.autoSyncAvailability ? 'Aktif (Auto)' : 'Manual'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Sync Tarif Harga (Rates):</span>
                      <span className={ch.autoSyncRates ? 'text-emerald-600 font-semibold' : 'text-muted-foreground'}>
                        {ch.autoSyncRates ? 'Aktif (Auto)' : 'Manual'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Terakhir Sinkron:</span>
                      <span className="text-foreground font-mono text-[11px]">{ch.lastSync}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> API Terverifikasi
                    </span>
                    <Button variant="outline" size="sm" className="text-xs h-8">
                      Atur Channel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: ROOM MAPPING & MARKUP */}
      {activeTab === 'mapping' && (
        <Card className="border-border bg-card">
          <CardContent className="p-6 space-y-4">
            <div>
              <h3 className="font-display font-semibold text-base text-foreground">
                Pemetaan Kamar & Strategi Markup OTA (Room Mapping)
              </h3>
              <p className="text-xs text-muted-foreground font-body">
                Petakan tipe kamar Jajapin ke kode kamar OTA dan terapkan persentase markup untuk menutup komisi OTA.
              </p>
            </div>

            <div className="overflow-x-auto -mx-6">
              <table className="w-full text-left text-xs font-body">
                <thead className="bg-muted/40 text-[10px] uppercase tracking-wider text-muted-foreground border-y border-border">
                  <tr>
                    <th className="py-3 px-6">Tipe Kamar Jajapin</th>
                    <th className="py-3 px-4">Tarif Dasar</th>
                    <th className="py-3 px-4">Kode Kamar OTA</th>
                    <th className="py-3 px-4">Markup OTA (%)</th>
                    <th className="py-3 px-4">Tarif di OTA</th>
                    <th className="py-3 px-4">Stop-Sell (Tutup)</th>
                    <th className="py-3 px-6 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {roomMappings.map((m) => {
                    const otaPrice = Math.round(m.basePrice * (1 + m.markupPercent / 100));
                    return (
                      <tr key={m.id} className="hover:bg-muted/20">
                        <td className="py-3.5 px-6 font-semibold text-foreground">
                          {m.jajapinRoom}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-medium">
                          {formatIDR(m.basePrice)}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-primary font-semibold">
                          {m.otaRoomId}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                            +{m.markupPercent}%
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-foreground">
                          {formatIDR(otaPrice)}
                        </td>
                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => toggleStopSell(m.id)}
                            className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-colors ${
                              m.stopSell
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-muted text-muted-foreground hover:bg-muted/80'
                            }`}
                          >
                            {m.stopSell ? '⛔ Ditutup di OTA' : '✓ Buka Penjualan'}
                          </button>
                        </td>
                        <td className="py-3.5 px-6 text-right">
                          <Button variant="outline" size="sm" className="text-xs h-8">
                            Ubah
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB 3: iCAL SYNC */}
      {activeTab === 'ical' && (
        <Card className="border-border bg-card">
          <CardContent className="p-6 space-y-6">
            <div>
              <h3 className="font-display font-semibold text-base text-foreground">
                Sinkronisasi Kalender iCal 2 Arah (.ics)
              </h3>
              <p className="text-xs text-muted-foreground font-body">
                Sangat ideal untuk Villa, Homestay, dan Glamping yang ingin terhubung langsung dengan Airbnb, Booking.com, dan Google Calendar tanpa biaya API tambahan.
              </p>
            </div>

            {/* Export iCal */}
            <div className="p-5 rounded-2xl bg-muted/40 border border-border space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-foreground">
                1. Tautan Ekspor Kalender Jajapin (Salin ke Airbnb / Agoda)
              </label>
              <p className="text-xs text-muted-foreground">
                Tempelkan tautan ini di pengaturan kalender Airbnb atau Booking.com Anda agar tanggal yang di-book di Jajapin otomatis terblokir di sana.
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={jajapinExportIcalUrl}
                  className="w-full h-10 px-3.5 rounded-xl border border-border bg-white text-xs font-mono text-foreground focus:outline-none"
                />
                <Button size="sm" onClick={handleCopyIcal} className="whitespace-nowrap gap-1.5">
                  {copiedIcal ? <Check className="w-4 h-4 text-brand-lime" /> : <Copy className="w-4 h-4" />}
                  {copiedIcal ? 'Tersalin!' : 'Salin URL'}
                </Button>
              </div>
            </div>

            {/* Import iCal */}
            <div className="p-5 rounded-2xl bg-muted/40 border border-border space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-foreground">
                2. Impor Kalender dari Airbnb / Booking.com ke Jajapin
              </label>
              <p className="text-xs text-muted-foreground">
                Masukkan tautan ekspor iCal dari Airbnb atau Booking.com. Jajapin akan otomatis memblokir kamar saat ada booking dari platform tersebut.
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  value={airbnbIcalUrl}
                  onChange={(e) => setAirbnbIcalUrl(e.target.value)}
                  placeholder="https://www.airbnb.com/calendar/ical/..."
                  className="bg-white"
                />
                <Button size="sm" variant="secondary" className="whitespace-nowrap">
                  Simpan & Sinkronkan
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB 4: LOGS */}
      {activeTab === 'logs' && (
        <Card className="border-border bg-card">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-semibold text-base text-foreground">
                  Riwayat Aktivitas & Event Sinkronisasi
                </h3>
                <p className="text-xs text-muted-foreground font-body">
                  Catatan real-time perubahan ketersediaan, pembaruan harga, dan reservasi masuk dari OTA.
                </p>
              </div>
              <Button size="sm" variant="outline" onClick={() => setLogs([...logs])} className="text-xs">
                Segarkan Log
              </Button>
            </div>

            <div className="space-y-2.5">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="p-3.5 rounded-2xl bg-muted/30 border border-border flex items-start justify-between gap-3 text-xs font-body"
                >
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-foreground flex items-center gap-2">
                        <span>{log.channel}</span>
                        <span className="text-[10px] text-muted-foreground font-normal">
                          • {log.time}
                        </span>
                      </div>
                      <p className="text-muted-foreground mt-0.5">{log.event}</p>
                    </div>
                  </div>
                  <Badge variant="lime" className="text-[10px] shrink-0">
                    SUKSES
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB 5: CONFIG */}
      {activeTab === 'config' && (
        <Card className="border-border bg-card">
          <CardContent className="p-6 space-y-4">
            <div>
              <h3 className="font-display font-semibold text-base text-foreground">
                Pengaturan API & Webhook Channel Manager
              </h3>
              <p className="text-xs text-muted-foreground font-body">
                Konfigurasi kredensial koneksi ke gateway penyedia Channel Manager.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert('Konfigurasi Channel Manager berhasil disimpan!');
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-foreground mb-1">
                  Penyedia Channel Manager
                </label>
                <select
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  className="w-full h-10 rounded-xl border border-border bg-background px-3 font-body text-xs text-foreground focus:ring-2 focus:ring-primary/20"
                >
                  <option value="Channex.io">Channex.io (Modern Multi-Channel API)</option>
                  <option value="SiteMinder">SiteMinder (Enterprise Channel Manager)</option>
                  <option value="STAAH">STAAH Max Channel Manager</option>
                  <option value="Cloudbeds">Cloudbeds Channel Manager API</option>
                  <option value="Custom REST API / Webhook">Custom Webhook / REST API</option>
                </select>
              </div>

              <Input
                label="Webhook URL Endpoint Reservasi Masuk"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
              />

              <Input
                label="API Secret Key / Access Token"
                type="password"
                value={apiToken}
                onChange={(e) => setApiToken(e.target.value)}
              />

              <div className="pt-2 flex gap-3">
                <Button type="submit">Simpan Konfigurasi</Button>
                <Button type="button" variant="outline" onClick={handleSyncAll}>
                  Uji Koneksi
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
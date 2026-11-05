import { useState } from 'react';
import { RefreshCw, CheckCircle2, AlertCircle, ShieldAlert, Key, Globe, Link2 } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export default function PmsPanel({ connection, onSaveConnection, onSyncNow }) {
  const [provider, setProvider] = useState(connection?.provider || 'Jajapin Hotel PMS');
  const [reservationsUrl, setReservationsUrl] = useState(connection?.reservations_url || 'https://pms.jajapin.id/api/v1/reservations');
  const [apiToken, setApiToken] = useState(connection?.api_token || 'jp_live_994827103859');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState(null);

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncResult(null);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncResult({
        success: true,
        message: 'Berhasil menyinkronkan 5 reservasi terbaru dari PMS.',
        time: new Date().toLocaleTimeString('id-ID'),
      });
      if (onSyncNow) onSyncNow();
    }, 1200);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (onSaveConnection) {
      onSaveConnection({
        ...connection,
        provider,
        reservations_url: reservationsUrl,
        api_token: apiToken,
        last_sync_at: new Date().toISOString(),
      });
    }
  };

  return (
    <Card className="border-border bg-card">
      <CardContent className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-display font-semibold text-lg text-foreground flex items-center gap-2">
              <Link2 className="w-5 h-5 text-primary" /> Sinkronisasi Channel & PMS Eksternal
            </h3>
            <p className="text-xs text-muted-foreground font-body">
              Hubungkan sistem reservasi hotel dengan OTA, PMS pihak ketiga, atau Channel Manager.
            </p>
          </div>
          <Badge variant={connection?.is_active ? 'lime' : 'outline'}>
            {connection?.is_active ? 'Koneksi Terhubung' : 'Non-aktif'}
          </Badge>
        </div>

        {syncResult && (
          <div className="p-4 rounded-2xl bg-green-50 border border-green-200 text-green-800 text-xs font-body flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">{syncResult.message}</p>
              <p className="text-[11px] text-green-600 mt-0.5">Waktu sinkron: {syncResult.time}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Nama Penyedia PMS / Channel"
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            placeholder="Contoh: SiteMinder, Cloudbeds, Jajapin PMS"
          />

          <Input
            label="URL Endpoint Reservasi (Webhook / REST API)"
            value={reservationsUrl}
            onChange={(e) => setReservationsUrl(e.target.value)}
            placeholder="https://..."
          />

          <Input
            label="API Key / Secret Token"
            type="password"
            value={apiToken}
            onChange={(e) => setApiToken(e.target.value)}
            placeholder="jp_live_..."
          />

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <Button type="submit" variant="secondary" size="sm">
              Simpan Konfigurasi
            </Button>
            <Button
              type="button"
              variant="default"
              size="sm"
              disabled={isSyncing}
              onClick={handleSync}
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Menyinkronkan...' : 'Sinkronkan Sekarang'}
            </Button>
          </div>
        </form>

        <div className="border-t border-border pt-4 flex flex-wrap items-center justify-between gap-4 text-xs font-body text-muted-foreground">
          <div>
            Terakhir disinkronkan: <span className="text-foreground font-semibold">4 Nov 2026, 23:10 WIB</span>
          </div>
          <div>
            Total data terkirim: <span className="text-foreground font-semibold">124 Reservasi</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

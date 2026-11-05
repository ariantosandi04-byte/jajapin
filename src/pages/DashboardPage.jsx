import { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarDays,
  BookOpen,
  Users,
  BedDouble,
  Sparkles,
  Receipt,
  FileSpreadsheet,
  Building2,
  KeyRound,
  ExternalLink,
  Plus,
  LogOut,
  ChevronDown,
  Menu,
  X,
  ShieldCheck,
  Globe,
  Bell,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { stays as initialStays } from '../data/stays';
import { siteMedia } from '../data/siteMedia';
import { formatIDR, formatDate } from '../lib/format';
import { getBookings, saveBooking } from '../lib/bookingStatus';

// Sub-components
import StatCards from '../components/dashboard/StatCards';
import RevenueChart from '../components/dashboard/RevenueChart';
import ArrivalsList from '../components/dashboard/ArrivalsList';
import BookingsTable from '../components/dashboard/BookingsTable';
import PmsPanel from '../components/dashboard/PmsPanel';
import ReservationModal from '../components/dashboard/ReservationModal';
import RoomManagement from '../components/dashboard/RoomManagement';
import HousekeepingGrid from '../components/dashboard/HousekeepingGrid';
import PropertyManagement from '../components/dashboard/PropertyManagement';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

export default function DashboardPage() {
  const { user, isAdmin, isOwner, logout, login } = useAuth();
  const navigate = useNavigate();

  // If user is a guest, provide quick-switch demo options
  if (!isAdmin && !isOwner) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-card rounded-3xl border border-border p-8 text-center shadow-lg">
          <div className="w-14 h-14 rounded-full bg-accent/10 text-accent flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-7 h-7" />
          </div>
          <h1 className="font-display font-semibold text-2xl text-foreground mb-2">Akses Khusus Pengelola</h1>
          <p className="font-body text-sm text-muted-foreground mb-6">
            Dashboard Manajemen Hotel (PMS) khusus untuk <strong>Pemilik Properti</strong> dan <strong>Super Admin</strong>.
          </p>
          <div className="space-y-3">
            <Button className="w-full" onClick={() => login('admin@jajapin.id', 'admin123')}>
              Beralih ke Super Admin (Akses Penuh)
            </Button>
            <Button variant="secondary" className="w-full" onClick={() => login('owner@bukitsenja.id', 'owner123')}>
              Beralih ke Pemilik Properti (Bukit Senja)
            </Button>
            <Link to="/" className="block pt-2 text-xs text-muted-foreground font-body hover:underline">
              ← Kembali ke Beranda Tamu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Active view tab
  const [activeTab, setActiveTab] = useState('dasbor');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Properties state (supports CRUD)
  const [properties, setProperties] = useState(() => {
    const saved = localStorage.getItem('jajapin_properties');
    return saved ? JSON.parse(saved) : initialStays;
  });

  // Filter properties based on role
  const userProperties = useMemo(() => {
    if (isAdmin) return properties;
    return properties.filter((p) => p.owner_email === user?.email);
  }, [properties, isAdmin, user]);

  // Selected property for switcher
  const [selectedPropertyId, setSelectedPropertyId] = useState(() => {
    return userProperties[0]?.id || 1;
  });

  useEffect(() => {
    if (userProperties.length > 0 && !userProperties.some((p) => p.id === selectedPropertyId)) {
      setSelectedPropertyId(userProperties[0].id);
    }
  }, [userProperties, selectedPropertyId]);

  const activeProperty = useMemo(() => {
    return properties.find((p) => p.id === selectedPropertyId) || properties[0];
  }, [properties, selectedPropertyId]);

  // Bookings state (stored in localStorage)
  const [bookings, setBookings] = useState(() => {
    return JSON.parse(localStorage.getItem('jajapin_bookings') || '[]');
  });

  // Seed default sample bookings if empty
  useEffect(() => {
    if (bookings.length === 0) {
      const sample = [
        {
          booking_code: 'JP-928410',
          property_id: 6,
          property_name: 'Jajapin Hotel Putri Sari',
          property_image: '/assets/putri-sari/cover.jpg',
          property_city: 'Pelabuhan Ratu',
          guest_name: 'Budi Santoso',
          guest_email: 'budi@gmail.com',
          guest_phone: '081234567890',
          check_in: '2026-11-04',
          check_out: '2026-11-06',
          guests: 2,
          nights: 2,
          price_per_night: 350000,
          total_price: 700000,
          status: 'dikonfirmasi',
          payment_status: 'dibayar',
          payment_method: 'qris',
          midtrans_order_id: 'MID-1730700000',
          paid_at: '2026-11-04T10:00:00Z',
          notes: 'Minta kamar lantai 1',
          source: 'jajapin',
          created_at: '2026-11-04T09:00:00Z',
        },
        {
          booking_code: 'JP-184920',
          property_id: 1,
          property_name: 'Bukit Senja Lodge',
          property_image: '/assets/destinasi-labuan-bajo.png',
          property_city: 'Labuan Bajo',
          guest_name: 'Dewi Lestari',
          guest_email: 'dewi@gmail.com',
          guest_phone: '081987654321',
          check_in: '2026-11-05',
          check_out: '2026-11-08',
          guests: 4,
          nights: 3,
          price_per_night: 2150000,
          total_price: 6450000,
          status: 'dikonfirmasi',
          payment_status: 'dibayar',
          payment_method: 'bca_va',
          midtrans_order_id: 'MID-1730701111',
          paid_at: '2026-11-03T14:00:00Z',
          notes: 'Antar jemput bandara',
          source: 'jajapin',
          created_at: '2026-11-03T13:30:00Z',
        },
      ];
      localStorage.setItem('jajapin_bookings', JSON.stringify(sample));
      setBookings(sample);
    }
  }, [bookings.length]);

  // Filter bookings for current view
  const currentPropertyBookings = useMemo(() => {
    if (isAdmin && selectedPropertyId === 0) return bookings;
    return bookings.filter((b) => b.property_id === selectedPropertyId);
  }, [bookings, selectedPropertyId, isAdmin]);

  // CRUD for Bookings
  const handleUpdateBookingStatus = (code, newStatus) => {
    const updated = bookings.map((b) =>
      b.booking_code === code ? { ...b, status: newStatus } : b
    );
    setBookings(updated);
    localStorage.setItem('jajapin_bookings', JSON.stringify(updated));
  };

  const handleDeleteBooking = (code) => {
    if (window.confirm(`Hapus reservasi ${code}?`)) {
      const updated = bookings.filter((b) => b.booking_code !== code);
      setBookings(updated);
      localStorage.setItem('jajapin_bookings', JSON.stringify(updated));
    }
  };

  const handleCreateReservation = (newRes) => {
    const updated = [newRes, ...bookings];
    setBookings(updated);
    localStorage.setItem('jajapin_bookings', JSON.stringify(updated));
  };

  // CRUD for Property
  const handleSaveProperty = (updatedProp) => {
    const updated = properties.map((p) =>
      p.id === updatedProp.id ? { ...p, ...updatedProp } : p
    );
    setProperties(updated);
    localStorage.setItem('jajapin_properties', JSON.stringify(updated));
  };

  // Stats calculation
  const stats = useMemo(() => {
    const relevant = currentPropertyBookings;
    const monthlyRev = relevant
      .filter((b) => b.payment_status === 'dibayar')
      .reduce((acc, curr) => acc + (curr.total_price || 0), 0);

    return {
      todayArrivals: relevant.filter((b) => b.check_in === '2026-11-04' || b.check_in === '2026-11-05').length,
      todayDepartures: 0,
      occupancyRate: '11.1',
      occupiedRooms: 1,
      totalRooms: 9,
      monthlyRevenue: monthlyRev || 2000000,
      totalBookings: relevant.length,
    };
  }, [currentPropertyBookings]);

  // Nav categories matching Image 2
  const navSections = [
    {
      heading: 'OPERASIONAL',
      items: [
        { id: 'dasbor', label: 'Dasbor', icon: LayoutDashboard },
        { id: 'tape-chart', label: 'Tape Chart', icon: CalendarDays },
        { id: 'reservasi', label: 'Reservasi', icon: BookOpen },
        { id: 'tamu', label: 'Tamu', icon: Users },
      ],
    },
    {
      heading: 'PROPERTI',
      items: [
        { id: 'kamar', label: 'Kamar & Tipe', icon: BedDouble },
        { id: 'housekeeping', label: 'Housekeeping', icon: Sparkles },
      ],
    },
    {
      heading: 'KEUANGAN',
      items: [
        { id: 'invoice', label: 'Invoice', icon: Receipt },
        { id: 'laporan', label: 'Laporan Pemilik', icon: FileSpreadsheet },
      ],
    },
    {
      heading: 'ADMINISTRASI',
      items: [
        { id: 'properti', label: 'Properti', icon: Building2 },
        { id: 'channel-api', label: 'Channel & API', icon: KeyRound },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex">
      {/* Sidebar - Dark Colonial Forest Green matching screenshot */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0a2f18] text-white flex flex-col justify-between transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand Logo Header */}
          <div className="p-6 pb-4 border-b border-white/10 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <img
                src={siteMedia.logo}
                alt="Jajapin"
                className="w-10 h-10 rounded-full object-cover border-2 border-brand-lime/40"
              />
              <div>
                <span className="font-display font-bold text-lg tracking-tight block text-white leading-tight">
                  JAJAPIN
                </span>
                <span className="text-[9px] uppercase tracking-[0.24em] text-brand-lime font-body font-semibold block">
                  MANAJEMEN HOTEL
                </span>
              </div>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white/70">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <div className="py-4 px-3 space-y-6 overflow-y-auto max-h-[calc(100vh-180px)]">
            {navSections.map((sec) => (
              <div key={sec.heading}>
                <span className="px-3 text-[10px] uppercase tracking-[0.2em] font-body font-bold text-white/40 block mb-2">
                  {sec.heading}
                </span>
                <div className="space-y-0.5">
                  {sec.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setSidebarOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-body text-xs font-medium transition-all ${
                          isActive
                            ? 'bg-[#154626] text-white font-semibold shadow-inner'
                            : 'text-white/70 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isActive ? 'text-brand-lime' : 'text-white/60'}`} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/10 text-[11px] font-body text-white/50 space-y-1">
          <p className="font-semibold text-white/80">PT Jalan Jalan Pesona Indonesia</p>
          <p className="text-[10px]">halo@jajapin.id · +62 858 1415 730</p>
          <div className="pt-2 flex items-center justify-between">
            <Link to="/" className="text-brand-lime hover:underline flex items-center gap-1 text-[11px]">
              <Globe className="w-3 h-3" /> Beranda Web
            </Link>
            <button onClick={logout} className="text-red-400 hover:text-red-300 flex items-center gap-1 text-[11px]">
              <LogOut className="w-3 h-3" /> Keluar
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar matching Image 2 */}
        <header className="h-16 bg-white border-b border-border px-4 sm:px-8 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-foreground hover:bg-muted"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Property Selector */}
            <div className="flex items-center gap-2">
              <select
                value={selectedPropertyId}
                onChange={(e) => setSelectedPropertyId(Number(e.target.value))}
                className="font-display font-semibold text-sm sm:text-base text-foreground bg-transparent border-none focus:outline-none cursor-pointer pr-2"
                aria-label="Pilih Properti"
              >
                {isAdmin && <option value={0}>Seluruh Properti (Ringkasan Global)</option>}
                {userProperties.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              {activeProperty && (
                <Badge variant="outline" className="hidden sm:inline-flex text-[10px] bg-muted/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 inline-block" />
                  {activeProperty.province}
                </Badge>
              )}
            </div>
          </div>

          {/* Right Top Header Actions */}
          <div className="flex items-center gap-3">
            <Badge variant="lime" className="hidden sm:inline-flex">
              {isAdmin ? 'SUPER ADMIN' : 'PEMILIK PROPERTI'}
            </Badge>

            <div className="flex items-center gap-2 border-l border-border pl-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : 'JA'}
              </div>
              <span className="hidden md:inline font-body text-xs font-semibold text-foreground">
                {user?.name || 'Jajapin Travel'}
              </span>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="hidden sm:flex"
              onClick={() => setActiveTab('tape-chart')}
            >
              <CalendarDays className="w-3.5 h-3.5 mr-1.5" /> Tape chart
            </Button>

            <Button
              size="sm"
              onClick={() => setIsModalOpen(true)}
              className="bg-brand-forest hover:bg-brand-forest-deep"
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> Reservasi Baru
            </Button>
          </div>
        </header>

        {/* Dashboard Body Content */}
        <main className="p-4 sm:p-8 space-y-8 flex-1 overflow-y-auto">
          {/* Page Subheader */}
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-border/80 pb-4">
            <div>
              <span className="text-[10px] uppercase tracking-[0.24em] font-body font-semibold text-muted-foreground block mb-1">
                RAB, 4 NOV 2026
              </span>
              <h1 className="font-display font-light text-2xl sm:text-3xl text-foreground tracking-tight">
                {selectedPropertyId === 0 ? 'Semua Properti Jajapin' : activeProperty?.name}
              </h1>
              <p className="font-body text-xs text-muted-foreground mt-0.5">
                Okupansi, kedatangan, dan pendapatan terkini seluruh properti Jajapin.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link to={activeProperty ? `/stays/${activeProperty.slug}` : '/stays'} target="_blank">
                <Button variant="outline" size="sm" className="text-xs">
                  <ExternalLink className="w-3.5 h-3.5 mr-1" /> Buka Halaman Tamu
                </Button>
              </Link>
            </div>
          </div>

          {/* TAB 1: DASBOR OVERVIEW */}
          {activeTab === 'dasbor' && (
            <div className="space-y-6">
              {/* 4 Stat Cards */}
              <StatCards stats={stats} />

              {/* Chart & Occupancy per Property Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8">
                  <RevenueChart totalAmount="Rp 2.0 jt" />
                </div>

                <div className="lg:col-span-4">
                  <Card className="border-border bg-card h-full flex flex-col justify-between">
                    <CardContent className="p-6">
                      <h3 className="font-display font-semibold text-base text-foreground mb-1">
                        Okupansi per Properti
                      </h3>
                      <p className="text-xs text-muted-foreground font-body mb-5">
                        Saat ini — % kamar terisi
                      </p>

                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-xs font-body font-semibold mb-1.5">
                            <span>{activeProperty?.name || 'Jajapin Hotel Putri Sari'}</span>
                            <span className="text-primary">11.1%</span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: '11.1%' }} />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                          <div>
                            <span className="text-[10px] uppercase tracking-wider text-muted-foreground block font-body">
                              ADR (Rata-rata Tarif)
                            </span>
                            <span className="font-display font-semibold text-sm text-foreground">
                              Rp 253.750
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase tracking-wider text-muted-foreground block font-body">
                              REVPAR
                            </span>
                            <span className="font-display font-semibold text-sm text-foreground">
                              Rp 56.389
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>

                    <div className="p-6 pt-0 border-t border-border/40 mt-4">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="w-full text-xs"
                        onClick={() => setActiveTab('reservasi')}
                      >
                        Lihat Semua Reservasi <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </div>
                  </Card>
                </div>
              </div>

              {/* Bottom Row: Pergerakan Hari Ini & Housekeeping */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7">
                  <ArrivalsList
                    arrivals={currentPropertyBookings.filter((b) => b.check_in === '2026-11-04' || b.check_in === '2026-11-05')}
                    onCheckIn={(code) => handleUpdateBookingStatus(code, 'selesai')}
                  />
                </div>

                <div className="lg:col-span-5">
                  <Card className="border-border bg-card h-full">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-display font-semibold text-base text-foreground">
                            Housekeeping
                          </h3>
                          <p className="text-xs text-muted-foreground font-body">
                            Status kamar seluruh properti
                          </p>
                        </div>
                        <Sparkles className="w-4 h-4 text-primary" />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-4 rounded-2xl bg-green-50/70 border border-green-100">
                          <span className="text-[10px] uppercase tracking-wider text-green-700 font-semibold flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-green-500" /> BERSIH
                          </span>
                          <span className="font-display font-bold text-2xl text-green-900 block mt-1">7</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-red-50/70 border border-red-100">
                          <span className="text-[10px] uppercase tracking-wider text-red-700 font-semibold flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-red-500" /> KOTOR
                          </span>
                          <span className="font-display font-bold text-2xl text-red-900 block mt-1">2</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100">
                          <span className="text-[10px] uppercase tracking-wider text-blue-700 font-semibold flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-blue-500" /> DIPERIKSA
                          </span>
                          <span className="font-display font-bold text-2xl text-blue-900 block mt-1">0</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-gray-50/70 border border-gray-200">
                          <span className="text-[10px] uppercase tracking-wider text-gray-700 font-semibold flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-gray-400" /> TUTUP
                          </span>
                          <span className="font-display font-bold text-2xl text-gray-900 block mt-1">0</span>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-xs"
                        onClick={() => setActiveTab('housekeeping')}
                      >
                        Buka papan housekeeping
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Tautan Website Pemesanan Banner matching Image 2 */}
              <div className="p-5 rounded-2xl bg-card border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-body font-semibold text-sm text-foreground">
                      Tautan Website Pemesanan Tamu
                    </h4>
                    <p className="text-xs text-muted-foreground font-body">
                      Pasang tautan ini di website hotel Anda sebagai tombol "Pesan Kamar". Setiap pesanan langsung masuk ke sistem.
                    </p>
                  </div>
                </div>

                <Link to={activeProperty ? `/stays/${activeProperty.slug}` : '/stays'} target="_blank">
                  <Button variant="outline" size="sm" className="whitespace-nowrap">
                    <ExternalLink className="w-3.5 h-3.5 mr-1.5" /> Buka halaman
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* TAB 2: TAPE CHART (Interactive Visual Schedule) */}
          {activeTab === 'tape-chart' && (
            <Card className="border-border bg-card">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="font-display font-semibold text-lg text-foreground">
                      Tape Chart — Jadwal Hunian Kamar
                    </h3>
                    <p className="text-xs text-muted-foreground font-body">
                      Visualisasi status ketersediaan dan alokasi kamar 7 hari ke depan
                    </p>
                  </div>
                  <Button size="sm" onClick={() => setIsModalOpen(true)}>
                    <Plus className="w-4 h-4 mr-1" /> Tambah Reservasi
                  </Button>
                </div>

                {/* Calendar Schedule Grid */}
                <div className="overflow-x-auto -mx-6">
                  <table className="w-full text-xs font-body border-collapse min-w-[700px]">
                    <thead>
                      <tr className="bg-muted/40 text-muted-foreground border-y border-border">
                        <th className="py-3 px-4 text-left w-32">Kamar</th>
                        {['Rab 4 Nov', 'Kam 5 Nov', 'Jum 6 Nov', 'Sab 7 Nov', 'Min 8 Nov', 'Sen 9 Nov', 'Sel 10 Nov'].map((d) => (
                          <th key={d} className="py-3 px-3 text-center border-l border-border/40 font-medium">
                            {d}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {[
                        { num: '101', type: 'Deluxe', guest: null },
                        { num: '102', type: 'Deluxe', guest: 'Budi Santoso (JP-928410)' },
                        { num: '103', type: 'Deluxe Twin', guest: null },
                        { num: '104', type: 'Family Suite', guest: 'Dewi Lestari (JP-184920)' },
                        { num: '105', type: 'Standard AC', guest: null },
                        { num: '106', type: 'Standard Non-AC', guest: null },
                      ].map((rm) => (
                        <tr key={rm.num} className="hover:bg-muted/20">
                          <td className="py-4 px-4 font-bold text-foreground">
                            #{rm.num} <span className="block text-[10px] font-normal text-muted-foreground">{rm.type}</span>
                          </td>
                          {Array.from({ length: 7 }).map((_, colIdx) => {
                            const isBooked = rm.guest && colIdx < 3;
                            return (
                              <td key={colIdx} className="p-1 border-l border-border/40 text-center">
                                {isBooked ? (
                                  <div className="bg-primary/15 border border-primary/30 text-primary p-2 rounded-xl text-[10px] font-medium leading-tight truncate">
                                    {rm.guest}
                                  </div>
                                ) : (
                                  <div className="h-8 rounded-lg hover:bg-muted/40 transition-colors flex items-center justify-center text-muted-foreground/30 text-[10px]">
                                    Kosong
                                  </div>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* TAB 3: RESERVASI CRUD */}
          {activeTab === 'reservasi' && (
            <BookingsTable
              bookings={currentPropertyBookings}
              onUpdateStatus={handleUpdateBookingStatus}
              onDeleteBooking={handleDeleteBooking}
              onNewBooking={() => setIsModalOpen(true)}
            />
          )}

          {/* TAB 4: TAMU */}
          {activeTab === 'tamu' && (
            <Card className="border-border bg-card">
              <CardContent className="p-6">
                <h3 className="font-display font-semibold text-lg text-foreground mb-1">
                  Database Tamu & Riwayat Kunjungan
                </h3>
                <p className="text-xs text-muted-foreground font-body mb-6">
                  Daftar profil tamu yang pernah melakukan pemesanan di properti Anda
                </p>

                <div className="overflow-x-auto -mx-6">
                  <table className="w-full text-left text-xs font-body">
                    <thead className="bg-muted/40 text-[10px] uppercase tracking-wider text-muted-foreground border-y border-border">
                      <tr>
                        <th className="py-3 px-6">Nama Tamu</th>
                        <th className="py-3 px-4">Kontak (Email / Telp)</th>
                        <th className="py-3 px-4">Total Menginap</th>
                        <th className="py-3 px-4">Total Transaksi</th>
                        <th className="py-3 px-4">Status Terakhir</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {currentPropertyBookings.map((b) => (
                        <tr key={b.booking_code} className="hover:bg-muted/20">
                          <td className="py-3.5 px-6 font-semibold text-foreground">
                            {b.guest_name}
                          </td>
                          <td className="py-3.5 px-4 text-muted-foreground">
                            <div>{b.guest_email}</div>
                            <div className="text-[11px]">{b.guest_phone}</div>
                          </td>
                          <td className="py-3.5 px-4 text-foreground font-medium">
                            {b.nights} Malam ({b.guests} Tamu)
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-primary">
                            {formatIDR(b.total_price)}
                          </td>
                          <td className="py-3.5 px-4">
                            <Badge variant="lime">Tamu Terverifikasi</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* TAB 5: KAMAR & TIPE (CRUD) */}
          {activeTab === 'kamar' && (
            <RoomManagement propertyName={activeProperty?.name || 'Properti'} />
          )}

          {/* TAB 6: HOUSEKEEPING */}
          {activeTab === 'housekeeping' && <HousekeepingGrid />}

          {/* TAB 7 & 8: KEUANGAN (Invoice & Laporan) */}
          {(activeTab === 'invoice' || activeTab === 'laporan') && (
            <Card className="border-border bg-card">
              <CardContent className="p-6">
                <h3 className="font-display font-semibold text-lg text-foreground mb-1">
                  {activeTab === 'invoice' ? 'Rekapitulasi Faktur & Invoice' : 'Laporan Keuangan Pemilik'}
                </h3>
                <p className="text-xs text-muted-foreground font-body mb-6">
                  Rincian pembayaran, bagi hasil, dan komisi sistem reservasi Jajapin.
                </p>

                <div className="p-5 rounded-2xl bg-muted/40 border border-border space-y-3">
                  <div className="flex justify-between text-sm font-body">
                    <span className="text-muted-foreground">Pendapatan Kotor Bulan Ini</span>
                    <span className="font-semibold">{formatIDR(stats.monthlyRevenue)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-body">
                    <span className="text-muted-foreground">Biaya Komisi Platform Jajapin (0% Promo)</span>
                    <span className="font-semibold text-primary">Rp0</span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between font-display font-semibold text-lg">
                    <span>Pendapatan Bersih (Net Payout)</span>
                    <span className="text-primary">{formatIDR(stats.monthlyRevenue)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* TAB 9: PROPERTI CRUD */}
          {activeTab === 'properti' && (
            <PropertyManagement
              properties={userProperties}
              isAdmin={isAdmin}
              currentOwnerEmail={user?.email}
              onSaveProperty={handleSaveProperty}
            />
          )}

          {/* TAB 10: CHANNEL & API / PMS */}
          {activeTab === 'channel-api' && (
            <PmsPanel
              connection={{
                provider: 'Jajapin Hotel PMS',
                reservations_url: 'https://pms.jajapin.id/api/v1/reservations',
                api_token: 'jp_live_891240182471',
                is_active: true,
              }}
              onSaveConnection={() => alert('Konfigurasi PMS berhasil disimpan.')}
              onSyncNow={() => {}}
            />
          )}
        </main>
      </div>

      {/* New Reservation Modal */}
      <ReservationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        properties={userProperties}
        onSave={handleCreateReservation}
      />
    </div>
  );
}

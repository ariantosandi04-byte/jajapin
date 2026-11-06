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
import {
  getBookings,
  saveBooking,
  getChannelInfo,
  PAYMENT_STATUS_LABELS,
  PAYMENT_STATUS_COLORS,
} from '../lib/bookingStatus';

// Sub-components
import StatCards from '../components/dashboard/StatCards';
import RevenueChart from '../components/dashboard/RevenueChart';
import ArrivalsList from '../components/dashboard/ArrivalsList';
import BookingsTable from '../components/dashboard/BookingsTable';
import PmsPanel from '../components/dashboard/PmsPanel';
import ReservationModal from '../components/dashboard/ReservationModal';
import InvoiceModal from '../components/dashboard/InvoiceModal';
import OwnerPayoutPanel from '../components/dashboard/OwnerPayoutPanel';
import RoomManagement from '../components/dashboard/RoomManagement';
import HousekeepingGrid from '../components/dashboard/HousekeepingGrid';
import PropertyManagement from '../components/dashboard/PropertyManagement';
import { ACTUAL_BOOKINGS_DATA } from '../data/actualBookings';
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
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [invoiceFilter, setInvoiceFilter] = useState('semua');

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

  // Bookings state (stored in localStorage, synced with actual 2-8 Nov transactions)
  const [bookings, setBookings] = useState(() => {
    const saved = JSON.parse(localStorage.getItem('jajapin_bookings') || '[]');
    const existingCodes = new Set(saved.map((b) => b.booking_code));
    const missing = ACTUAL_BOOKINGS_DATA.filter((b) => !existingCodes.has(b.booking_code));
    if (missing.length > 0) {
      const merged = [...missing, ...saved];
      try {
        localStorage.setItem('jajapin_bookings', JSON.stringify(merged));
      } catch (e) {
        // storage quota fallback
      }
      return merged;
    }
    return saved.length > 0 ? saved : ACTUAL_BOOKINGS_DATA;
  });

  // Seed default sample bookings if empty
  useEffect(() => {
    if (bookings.length === 0) {
      const sample = [
        {
          booking_code: 'JP-928410',
          invoice_number: 'INV/202611/JP-928410',
          property_id: 6,
          property_name: 'Jajapin Hotel Putri Sari',
          property_image: '/assets/putri-sari/cover.jpg',
          property_city: 'Pelabuhan Ratu',
          guest_name: 'Budi Santoso',
          guest_id_number: '3202102901920001',
          guest_email: 'budi@gmail.com',
          guest_phone: '081234567890',
          check_in: '2026-11-04',
          check_out: '2026-11-06',
          guests: 2,
          nights: 2,
          room_type: 'Deluxe Ocean View',
          room_number: '101',
          price_per_night: 350000,
          subtotal_room: 700000,
          extra_fee: 0,
          discount: 0,
          total_price: 700000,
          amount_paid: 700000,
          balance_due: 0,
          status: 'dikonfirmasi',
          payment_status: 'dibayar',
          payment_method: 'Tunai / Kasir Resepsionis',
          midtrans_order_id: 'MID-1730700000',
          paid_at: '2026-11-04T10:00:00Z',
          notes: 'Minta kamar lantai 1 menghadap taman',
          source: 'direct_walkin',
          source_name: 'Direct / Walk-In',
          created_at: '2026-11-04T09:00:00Z',
        },
        {
          booking_code: 'JP-301984',
          invoice_number: 'INV/202611/JP-301984',
          property_id: 6,
          property_name: 'Jajapin Hotel Putri Sari',
          property_image: '/assets/putri-sari/cover.jpg',
          property_city: 'Pelabuhan Ratu',
          guest_name: 'Hendra Gunawan',
          guest_id_number: '3202111004880003',
          guest_email: 'hendra.g@gmail.com',
          guest_phone: '085711223344',
          check_in: '2026-11-06',
          check_out: '2026-11-08',
          guests: 2,
          nights: 2,
          room_type: 'Standard Double',
          room_number: '105',
          price_per_night: 350000,
          subtotal_room: 700000,
          extra_fee: 50000,
          discount: 50000,
          total_price: 700000,
          amount_paid: 350000,
          balance_due: 350000,
          status: 'dikonfirmasi',
          payment_status: 'dp',
          payment_method: 'Transfer BCA (DP 50%)',
          notes: 'Tamu booking via WhatsApp, sisa Rp350.000 bayar saat check-in',
          source: 'direct_whatsapp',
          source_name: 'WhatsApp / Chat',
          created_at: '2026-11-05T14:15:00Z',
        },
        {
          booking_code: 'JP-774102',
          invoice_number: 'INV/202611/JP-774102',
          property_id: 6,
          property_name: 'Jajapin Hotel Putri Sari',
          property_image: '/assets/putri-sari/cover.jpg',
          property_city: 'Pelabuhan Ratu',
          guest_name: 'Sarah Wijaya',
          guest_id_number: '3171092801940002',
          guest_email: 'sarah.wijaya@yahoo.com',
          guest_phone: '081388997700',
          check_in: '2026-11-07',
          check_out: '2026-11-09',
          guests: 2,
          nights: 2,
          room_type: 'Deluxe Ocean View',
          room_number: '201',
          price_per_night: 350000,
          subtotal_room: 700000,
          extra_fee: 0,
          discount: 0,
          total_price: 700000,
          amount_paid: 700000,
          balance_due: 0,
          status: 'dikonfirmasi',
          payment_status: 'dibayar',
          payment_method: 'OTA Virtual Card',
          notes: 'Reservasi otomatis tersinkron dari Traveloka',
          source: 'ota_traveloka',
          source_name: 'Traveloka',
          ota_booking_id: 'TVLK-8849102',
          created_at: '2026-11-05T18:30:00Z',
        },
        {
          booking_code: 'JP-184920',
          invoice_number: 'INV/202611/JP-184920',
          property_id: 1,
          property_name: 'Bukit Senja Lodge',
          property_image: '/assets/destinasi-labuan-bajo.png',
          property_city: 'Labuan Bajo',
          guest_name: 'Dewi Lestari',
          guest_id_number: '3172085903910005',
          guest_email: 'dewi@gmail.com',
          guest_phone: '081987654321',
          check_in: '2026-11-05',
          check_out: '2026-11-08',
          guests: 4,
          nights: 3,
          room_type: 'Suite Villa Sunset',
          room_number: 'Villa 02',
          price_per_night: 2150000,
          subtotal_room: 6450000,
          extra_fee: 0,
          discount: 0,
          total_price: 6450000,
          amount_paid: 6450000,
          balance_due: 0,
          status: 'dikonfirmasi',
          payment_status: 'dibayar',
          payment_method: 'Tiket.com Pay',
          midtrans_order_id: 'MID-1730701111',
          paid_at: '2026-11-03T14:00:00Z',
          notes: 'Antar jemput bandara Komodo Labuan Bajo',
          source: 'ota_tiket',
          source_name: 'Tiket.com',
          ota_booking_id: 'TKT-991204',
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
        { id: 'laporan', label: 'Rekap & Payout Owner', icon: FileSpreadsheet },
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
        <main className="p-3 sm:p-8 space-y-6 sm:space-y-8 flex-1 overflow-y-auto pb-28 lg:pb-8">
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

          {/* TAB 7: INVOICE MANAGEMENT CENTER */}
          {activeTab === 'invoice' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-display font-semibold text-xl text-foreground">
                    Pusat Faktur & Invoice Reservasi
                  </h3>
                  <p className="text-xs text-muted-foreground font-body">
                    Kelola dan cetak faktur resmi untuk tamu dari Direct Booking, Walk-in, WhatsApp, maupun OTA
                  </p>
                </div>
                <Button size="sm" onClick={() => setIsModalOpen(true)} className="gap-1.5">
                  <Plus className="w-4 h-4" /> Buat Reservasi & Invoice Baru
                </Button>
              </div>

              {/* Invoice Metric Cards */}
              {(() => {
                const totalInvoiced = currentPropertyBookings.reduce(
                  (acc, b) => acc + (b.total_price || 0),
                  0
                );
                const totalPaid = currentPropertyBookings.reduce((acc, b) => {
                  if (b.payment_status === 'dibayar') return acc + (b.total_price || 0);
                  if (b.payment_status === 'dp') return acc + (b.amount_paid || Math.round((b.total_price || 0) * 0.5));
                  return acc;
                }, 0);
                const totalReceivable = Math.max(0, totalInvoiced - totalPaid);

                return (
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <Card className="border-border bg-card">
                      <CardContent className="p-4">
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-body font-bold block">
                          Total Nilai Invoice
                        </span>
                        <span className="font-display font-bold text-xl text-foreground block mt-1">
                          {formatIDR(totalInvoiced)}
                        </span>
                        <span className="text-[11px] text-muted-foreground font-body">
                          {currentPropertyBookings.length} Lembar Invoice
                        </span>
                      </CardContent>
                    </Card>

                    <Card className="border-border bg-card">
                      <CardContent className="p-4">
                        <span className="text-[10px] uppercase tracking-wider text-emerald-700 font-body font-bold block">
                          Pembayaran Diterima (Lunas)
                        </span>
                        <span className="font-display font-bold text-xl text-emerald-800 block mt-1">
                          {formatIDR(totalPaid)}
                        </span>
                        <span className="text-[11px] text-muted-foreground font-body">
                          Kasir, transfer, & OTA
                        </span>
                      </CardContent>
                    </Card>

                    <Card className="border-border bg-card">
                      <CardContent className="p-4">
                        <span className="text-[10px] uppercase tracking-wider text-amber-700 font-body font-bold block">
                          Sisa Piutang / Pelunasan
                        </span>
                        <span className="font-display font-bold text-xl text-amber-800 block mt-1">
                          {formatIDR(totalReceivable)}
                        </span>
                        <span className="text-[11px] text-muted-foreground font-body">
                          Dilunasi saat tamu check-in
                        </span>
                      </CardContent>
                    </Card>

                    <Card className="border-border bg-card">
                      <CardContent className="p-4">
                        <span className="text-[10px] uppercase tracking-wider text-primary font-body font-bold block">
                          Status Pembayaran
                        </span>
                        <span className="font-display font-bold text-xl text-primary block mt-1">
                          {Math.round((totalPaid / (totalInvoiced || 1)) * 100)}%
                        </span>
                        <span className="text-[11px] text-muted-foreground font-body">
                          Rasio Pelunasan Kasir
                        </span>
                      </CardContent>
                    </Card>
                  </div>
                );
              })()}

              {/* Invoice List Card */}
              <Card className="border-border bg-card">
                <CardContent className="p-6">
                  {/* Filter Pills */}
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                    <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                      {[
                        { id: 'semua', label: 'Semua Invoice' },
                        { id: 'dibayar', label: 'Lunas' },
                        { id: 'dp', label: 'Uang Muka (DP)' },
                        { id: 'belum_bayar', label: 'Belum Bayar' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setInvoiceFilter(item.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-body font-medium transition-colors ${
                            invoiceFilter === item.id
                              ? 'bg-primary text-primary-foreground font-semibold'
                              : 'bg-muted/60 text-muted-foreground hover:bg-muted'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Invoice Table */}
                  <div className="overflow-x-auto -mx-6">
                    <table className="w-full text-left text-xs font-body">
                      <thead className="bg-muted/40 text-[10px] uppercase tracking-wider text-muted-foreground border-y border-border">
                        <tr>
                          <th className="py-3 px-6">No. Invoice & Tanggal</th>
                          <th className="py-3 px-4">Tamu Pemesan</th>
                          <th className="py-3 px-4">Saluran / Channel</th>
                          <th className="py-3 px-4">Kamar & Durasi</th>
                          <th className="py-3 px-4">Total & Status Bayar</th>
                          <th className="py-3 px-6 text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60">
                        {currentPropertyBookings
                          .filter((b) => invoiceFilter === 'semua' || b.payment_status === invoiceFilter)
                          .map((b) => {
                            const channel = getChannelInfo(b.source);
                            const invoiceNum =
                              b.invoice_number ||
                              `INV/${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}/${b.booking_code}`;

                            const amountPaid =
                              b.payment_status === 'dibayar'
                                ? b.total_price
                                : b.amount_paid !== undefined
                                ? b.amount_paid
                                : b.payment_status === 'dp'
                                ? Math.round((b.total_price || 0) * 0.5)
                                : 0;
                            const balanceDue = Math.max(0, (b.total_price || 0) - amountPaid);

                            return (
                              <tr key={b.booking_code} className="hover:bg-muted/20 transition-colors">
                                <td className="py-3.5 px-6">
                                  <div className="font-mono font-bold text-foreground text-xs">
                                    {invoiceNum}
                                  </div>
                                  <div className="text-[11px] text-muted-foreground">
                                    {formatDate(b.created_at || b.check_in)}
                                  </div>
                                </td>
                                <td className="py-3.5 px-4">
                                  <div className="font-semibold text-foreground text-sm">
                                    {b.guest_name}
                                  </div>
                                  <div className="text-[11px] text-muted-foreground">
                                    {b.guest_phone || b.guest_email}
                                  </div>
                                </td>
                                <td className="py-3.5 px-4">
                                  <span
                                    className={`px-2 py-0.5 rounded-md border text-[10px] inline-block ${channel.badgeClass}`}
                                  >
                                    {channel.name}
                                  </span>
                                  {b.ota_booking_id && (
                                    <div className="text-[10px] text-sky-800 font-medium mt-0.5">
                                      Ref: {b.ota_booking_id}
                                    </div>
                                  )}
                                </td>
                                <td className="py-3.5 px-4">
                                  <div className="text-foreground font-medium">
                                    {b.room_type || 'Deluxe Room'}{' '}
                                    {b.room_number ? `(${b.room_number})` : ''}
                                  </div>
                                  <div className="text-[11px] text-muted-foreground">
                                    {b.nights || 1} Malam ({formatDate(b.check_in)} - {formatDate(b.check_out)})
                                  </div>
                                </td>
                                <td className="py-3.5 px-4">
                                  <div className="font-bold text-foreground text-sm">
                                    {formatIDR(b.total_price)}
                                  </div>
                                  <div className="flex items-center gap-1.5 mt-0.5">
                                    <span
                                      className={`px-1.5 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider ${
                                        PAYMENT_STATUS_COLORS[b.payment_status] || 'bg-muted'
                                      }`}
                                    >
                                      {PAYMENT_STATUS_LABELS[b.payment_status] || b.payment_status}
                                    </span>
                                  </div>
                                  {balanceDue > 0 && (
                                    <div className="text-[10px] text-amber-700 font-medium mt-0.5">
                                      Sisa: {formatIDR(balanceDue)}
                                    </div>
                                  )}
                                </td>
                                <td className="py-3.5 px-6 text-right">
                                  <Button
                                    size="sm"
                                    onClick={() => setSelectedInvoice(b)}
                                    className="gap-1.5 text-xs"
                                  >
                                    <Receipt className="w-3.5 h-3.5" /> Buka Invoice
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
            </div>
          )}

          {/* TAB 8: REKAPITULASI & PAYOUT OWNER */}
          {activeTab === 'laporan' && (
            <OwnerPayoutPanel
              bookings={bookings}
              propertyName={activeProperty?.name || 'Jajapin Hotel Putri Sari'}
            />
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

        {/* Mobile Bottom Navigation Bar (App-like UX for smartphone screens) */}
        <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-border shadow-[0_-8px_20px_rgba(0,0,0,0.06)] px-2 py-2 flex items-center justify-around">
          <button
            onClick={() => setActiveTab('dasbor')}
            className={`flex flex-col items-center gap-1 text-[10px] font-body transition-colors ${
              activeTab === 'dasbor' ? 'text-primary font-bold' : 'text-muted-foreground'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Dasbor</span>
          </button>

          <button
            onClick={() => setActiveTab('tape-chart')}
            className={`flex flex-col items-center gap-1 text-[10px] font-body transition-colors ${
              activeTab === 'tape-chart' ? 'text-primary font-bold' : 'text-muted-foreground'
            }`}
          >
            <CalendarDays className="w-5 h-5" />
            <span>Kalender</span>
          </button>

          {/* Mobile Central FAB - Quick Reservation Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex flex-col items-center -mt-6 group"
            title="Tambah Reservasi Cepat"
          >
            <div className="w-12 h-12 rounded-full bg-brand-forest text-brand-lime flex items-center justify-center shadow-lg shadow-brand-forest/30 border-2 border-white transition-transform active:scale-95">
              <Plus className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold text-foreground mt-0.5">+ Booking</span>
          </button>

          <button
            onClick={() => setActiveTab('reservasi')}
            className={`flex flex-col items-center gap-1 text-[10px] font-body transition-colors ${
              activeTab === 'reservasi' ? 'text-primary font-bold' : 'text-muted-foreground'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span>Reservasi</span>
          </button>

          <button
            onClick={() => setActiveTab('invoice')}
            className={`flex flex-col items-center gap-1 text-[10px] font-body transition-colors ${
              activeTab === 'invoice' ? 'text-primary font-bold' : 'text-muted-foreground'
            }`}
          >
            <Receipt className="w-5 h-5" />
            <span>Invoice</span>
          </button>

          <button
            onClick={() => setSidebarOpen(true)}
            className="flex flex-col items-center gap-1 text-[10px] font-body text-muted-foreground"
            title="Buka Menu Lainnya"
          >
            <Menu className="w-5 h-5" />
            <span>Menu</span>
          </button>
        </nav>
      </div>

      {/* New Reservation Modal */}
      <ReservationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        properties={userProperties}
        onSave={handleCreateReservation}
      />

      {/* Invoice Viewer & Printable Modal */}
      <InvoiceModal
        isOpen={!!selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        booking={selectedInvoice}
      />
    </div>
  );
}

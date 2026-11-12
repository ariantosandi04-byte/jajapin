import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import SEOHead from '@/components/SEOHead'

const HomePage = lazy(() => import('@/pages/HomePage'))
const StaysPage = lazy(() => import('@/pages/StaysPage'))
const StayDetailPage = lazy(() => import('@/pages/StayDetailPage'))
const CheckoutPage = lazy(() => import('@/pages/CheckoutPage'))
const ConfirmationPage = lazy(() => import('@/pages/ConfirmationPage'))
const BookingsPage = lazy(() => import('@/pages/BookingsPage'))
const LoginPage = lazy(() => import('@/pages/LoginPage'))
const RegisterPage = lazy(() => import('@/pages/RegisterPage'))
const ForgotPasswordPage = lazy(() => import('@/pages/ForgotPasswordPage'))
const ResetPasswordPage = lazy(() => import('@/pages/ResetPasswordPage'))
const DashboardPage = lazy(() => import('@/pages/DashboardPage'))
const TermsPage = lazy(() => import('@/pages/TermsPage'))
const PrivacyPage = lazy(() => import('@/pages/PrivacyPage'))
const RefundPolicyPage = lazy(() => import('@/pages/RefundPolicyPage'))
const PutriSariPage = lazy(() => import('@/pages/PutriSariPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

// Deteksi jika domain yang diakses adalah subdomain putrisari.jajapin.id
const isPutriSariHost =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'putrisari.jajapin.id' ||
    window.location.hostname.startsWith('putrisari.'));

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-muted-foreground font-body text-sm">Memuat...</p>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      {/* Pengelola SEO & Tag Kanonis Otomatis Sesuai URL */}
      <SEOHead />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Jika diakses lewat subdomain putrisari.jajapin.id, root langsung memuat PutriSariPage */}
          <Route path="/" element={isPutriSariHost ? <PutriSariPage /> : <HomePage />} />
          
          {/* Rute Resmi Hotel Putri Sari - Terhubung ke HMS */}
          <Route path="/putrisari" element={<PutriSariPage />} />
          <Route path="/putri-sari" element={<PutriSariPage />} />

          {/* Pengalihan otomatis jika ada yang membuka URL /stays/jajapin-hotel-putri-sari */}
          <Route path="/stays/jajapin-hotel-putri-sari" element={<Navigate to="/putrisari" replace />} />
          <Route path="/stays/putri-sari" element={<Navigate to="/putrisari" replace />} />

          <Route path="/stays" element={<StaysPage />} />
          <Route path="/stays/:slug" element={<StayDetailPage />} />
          {/* Pemesanan Tanpa Wajib Buat Akun (Guest Direct Booking) */}
          <Route path="/pesan/:slug" element={<CheckoutPage />} />
          <Route path="/konfirmasi/:id" element={<ConfirmationPage />} />
          <Route
            path="/bookings"
            element={
              <ProtectedRoute>
                <BookingsPage />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/syarat-ketentuan" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/kebijakan-privasi" element={<PrivacyPage />} />
          <Route path="/refund-policy" element={<RefundPolicyPage />} />
          <Route path="/kebijakan-pengembalian" element={<RefundPolicyPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </AuthProvider>
  )
}

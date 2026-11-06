import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'

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
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

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
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/stays" element={<StaysPage />} />
          <Route path="/stays/:slug" element={<StayDetailPage />} />
          <Route
            path="/pesan/:slug"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/konfirmasi/:id"
            element={
              <ProtectedRoute>
                <ConfirmationPage />
              </ProtectedRoute>
            }
          />
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
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/refund-policy" element={<RefundPolicyPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </AuthProvider>
  )
}

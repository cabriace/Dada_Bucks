/**
 * Dada Bucks - Main App Component
 * 
 * A children's behavior and habit-building app using 100% virtual currency.
 * NO REAL MONEY - NO BANKING - NO DEBIT CARDS
 * 
 * Features:
 * - Supabase Auth with email/password
 * - Parent/Child role-based access
 * - Parent-child linking via codes
 * - Task tracking, savings with interest
 * - 10 PM daily reset
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Toaster } from '@/components/ui/sonner';

// Pages
import { LandingPage } from '@/pages/LandingPage';
import { AuthPage, RoleSelectorPage, ParentSignupPage, ChildSignupPage } from '@/pages/auth';

// Views (existing)
import { ParentView } from '@/views/ParentView';
import { ChildView } from '@/views/ChildView';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-[#7B5CFF] font-nunito overflow-x-hidden">
          {/* Grain Texture Overlay */}
          <div 
            className="fixed inset-0 pointer-events-none z-50 opacity-[0.06] mix-blend-multiply"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />

          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            
            {/* Auth Routes - redirect if already authenticated */}
            <Route 
              path="/auth" 
              element={
                <ProtectedRoute requireAuth={false}>
                  <AuthPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/auth/signup/role" 
              element={
                <ProtectedRoute requireAuth={false}>
                  <RoleSelectorPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/auth/signup/:role" 
              element={
                <ProtectedRoute requireAuth={false}>
                  <ParentSignupPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/auth/signup/child" 
              element={
                <ProtectedRoute requireAuth={false}>
                  <ChildSignupPage />
                </ProtectedRoute>
              } 
            />

            {/* Parent Routes */}
            <Route 
              path="/parent/*" 
              element={
                <ProtectedRoute requireAuth requireParent>
                  <ParentView />
                </ProtectedRoute>
              } 
            />

            {/* Child Routes */}
            <Route 
              path="/child/*" 
              element={
                <ProtectedRoute requireAuth requireChild>
                  <ChildView />
                </ProtectedRoute>
              } 
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          {/* Toast Notifications */}
          <Toaster 
            position="top-center"
            toastOptions={{
              style: {
                background: '#FFF6D6',
                border: '3px solid #1A1A2E',
                borderRadius: '16px',
                boxShadow: '0 8px 0 #1A1A2E',
                fontFamily: 'Nunito, sans-serif',
                fontWeight: 700,
              },
            }}
          />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

/**
 * Protected Route Component
 * 
 * Guards routes based on authentication and role
 */

import { Navigate } from 'react-router-dom';
import { useAuth, useIsParent, useIsChild } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireParent?: boolean;
  requireChild?: boolean;
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  requireAuth = true,
  requireParent = false,
  requireChild = false,
  redirectTo = '/auth',
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const isParent = useIsParent();
  const isChild = useIsChild();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#7B5CFF] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
          <p className="text-white font-bold">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // Already authenticated, trying to access auth pages
  if (!requireAuth && isAuthenticated) {
    if (isChild) {
      return <Navigate to="/child" replace />;
    }
    return <Navigate to="/parent" replace />;
  }

  // Require parent role
  if (requireParent && !isParent) {
    return <Navigate to="/child" replace />;
  }

  // Require child role
  if (requireChild && !isChild) {
    return <Navigate to="/parent" replace />;
  }

  return <>{children}</>;
}

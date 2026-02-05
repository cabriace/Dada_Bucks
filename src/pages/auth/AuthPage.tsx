/**
 * Auth Entry Page
 * 
 * Sign In / Sign Up entry point
 * Redirects to appropriate flows based on user choice
 */

import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PiggyBank, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { signIn } from '@/lib/supabase';
import { toast } from 'sonner';

export function AuthPage() {
  const navigate = useSearchParams()[0].get('mode') === 'signin' ? useNavigate() : useNavigate();
  const [searchParams] = useSearchParams();
  const defaultMode = searchParams.get('mode') === 'signin' ? 'signin' : 'select';
  
  const [mode, setMode] = useState<'select' | 'signin' | 'signup'>(defaultMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }

    setIsLoading(true);
    try {
      await signIn(email, password);
      toast.success('Welcome back!', { icon: '👋' });
      // Navigation will happen automatically via auth state change
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#7B5CFF] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back button */}
        {mode !== 'select' && (
          <button
            onClick={() => setMode('select')}
            className="mb-4 flex items-center gap-2 text-white font-bold hover:underline"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
        )}

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 bg-[#FFD200] border-[4px] border-[#1A1A2E] rounded-3xl px-6 py-3 shadow-[0_8px_0_#1A1A2E]">
            <PiggyBank className="w-8 h-8 text-[#1A1A2E]" />
            <span className="text-[#1A1A2E] font-black text-2xl">Dada Bucks</span>
          </div>
        </div>

        {/* Mode Selection */}
        {mode === 'select' && (
          <div className="dada-card bg-white p-8">
            <h2 className="text-2xl font-black text-[#1A1A2E] text-center mb-6 uppercase">
              Welcome!
            </h2>
            <p className="text-[#6B6B8C] font-bold text-center mb-8">
              Are you new here or coming back?
            </p>

            <div className="space-y-4">
              <button
                onClick={() => setMode('signin')}
                className="w-full dada-button dada-button-primary py-4"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/auth/signup/role')}
                className="w-full dada-button bg-[#B8FFC9] text-[#1A1A2E] py-4"
              >
                Create Account
              </button>
            </div>

            <p className="text-center text-[#6B6B8C] font-bold text-sm mt-6">
              100% fake money. No real payments.
            </p>
          </div>
        )}

        {/* Sign In Form */}
        {mode === 'signin' && (
          <div className="dada-card bg-white p-8">
            <h2 className="text-2xl font-black text-[#1A1A2E] text-center mb-6 uppercase">
              Sign In
            </h2>

            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="dada-label mb-2 block">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="dada-input"
                  required
                />
              </div>

              <div>
                <label className="dada-label mb-2 block">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="dada-input pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6B8C]"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full dada-button dada-button-primary py-4 mt-6"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <p className="text-center text-[#6B6B8C] font-bold text-sm mt-6">
              Don&apos;t have an account?{' '}
              <button
                onClick={() => navigate('/auth/signup/role')}
                className="text-[#7B5CFF] hover:underline"
              >
                Create one
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

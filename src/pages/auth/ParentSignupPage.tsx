/**
 * Parent Signup Page
 * 
 * Signup form for parents and co-parents
 */

import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, Check } from 'lucide-react';
import { signUpParent, validateLinkCode } from '@/lib/supabase';
import { toast } from 'sonner';

export function ParentSignupPage() {
  const navigate = useNavigate();
  const { role } = useParams<{ role: 'parent' | 'co_parent' }>();
  const isCoParent = role === 'co_parent';

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    email: '',
    password: '',
    confirmPassword: '',
    linkCode: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateStep1 = () => {
    if (!formData.firstName.trim()) {
      toast.error('Please enter your first name');
      return false;
    }
    if (!formData.lastName.trim()) {
      toast.error('Please enter your last name');
      return false;
    }
    if (!formData.age || parseInt(formData.age) < 18) {
      toast.error('You must be at least 18 years old');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.email.trim()) {
      toast.error('Please enter your email');
      return false;
    }
    if (!formData.password || formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
      if (validateStep1()) {
        setStep(2);
      }
      return;
    }

    if (!validateStep2()) return;

    // For co-parent, validate link code
    if (isCoParent && formData.linkCode) {
      const codeData = await validateLinkCode(formData.linkCode);
      if (!codeData) {
        toast.error('Invalid or expired link code');
        return;
      }
      if (codeData.role !== 'co_parent') {
        toast.error('This code is not for co-parents');
        return;
      }
    }

    setIsLoading(true);
    try {
      await signUpParent(
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName,
        parseInt(formData.age),
        isCoParent ? 'co_parent' : 'parent'
      );
      
      toast.success('Account created! Welcome to Dada Bucks!', { icon: '🎉' });
      // Auth state change will handle navigation
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#7B5CFF] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back button */}
        <button
          onClick={() => step === 1 ? navigate('/auth/signup/role') : setStep(1)}
          className="mb-4 flex items-center gap-2 text-white font-bold hover:underline"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <div className="dada-card bg-white p-8">
          <h2 className="text-2xl font-black text-[#1A1A2E] text-center mb-2 uppercase">
            {isCoParent ? 'Co-Parent' : 'Parent'} Signup
          </h2>
          <p className="text-[#6B6B8C] font-bold text-center mb-6">
            Step {step} of 2
          </p>

          {/* Progress bar */}
          <div className="dada-progress mb-8">
            <div 
              className="dada-progress-fill bg-[#B8FFC9]"
              style={{ width: step === 1 ? '50%' : '100%' }}
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 ? (
              <>
                <div>
                  <label className="dada-label mb-2 block">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="John"
                    className="dada-input"
                  />
                </div>

                <div>
                  <label className="dada-label mb-2 block">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Doe"
                    className="dada-input"
                  />
                </div>

                <div>
                  <label className="dada-label mb-2 block">Age</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="30"
                    min="18"
                    className="dada-input"
                  />
                </div>

                {isCoParent && (
                  <div>
                    <label className="dada-label mb-2 block">Family Link Code</label>
                    <input
                      type="text"
                      name="linkCode"
                      value={formData.linkCode}
                      onChange={handleChange}
                      placeholder="123456"
                      maxLength={6}
                      className="dada-input text-center text-xl font-black tracking-widest"
                    />
                    <p className="text-xs text-[#6B6B8C] font-bold mt-1">
                      Ask the parent for their family code
                    </p>
                  </div>
                )}
              </>
            ) : (
              <>
                <div>
                  <label className="dada-label mb-2 block">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="dada-input"
                  />
                </div>

                <div>
                  <label className="dada-label mb-2 block">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Min 6 characters"
                      className="dada-input pr-12"
                      minLength={6}
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

                <div>
                  <label className="dada-label mb-2 block">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      className="dada-input pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6B8C]"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full dada-button dada-button-primary py-4 mt-6"
            >
              {isLoading ? (
                'Creating account...'
              ) : step === 1 ? (
                'Next'
              ) : (
                <>
                  <Check className="w-5 h-5 mr-2" />
                  Create Account
                </>
              )}
            </button>
          </form>

          <p className="text-center text-[#6B6B8C] font-bold text-sm mt-6">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/auth?mode=signin')}
              className="text-[#7B5CFF] hover:underline"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Child Signup Page
 * 
 * Signup form for children - requires parent linking code
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, Check, Sparkles } from 'lucide-react';
import { signUpChild, validateLinkCode } from '@/lib/supabase';
import { toast } from 'sonner';

export function ChildSignupPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
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
  const [isValidatingCode, setIsValidatingCode] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateStep1 = async () => {
    if (!formData.name.trim()) {
      toast.error('Please enter your name');
      return false;
    }
    if (!formData.age || parseInt(formData.age) < 4 || parseInt(formData.age) > 17) {
      toast.error('Age must be between 4 and 17');
      return false;
    }
    if (!formData.linkCode.trim() || formData.linkCode.length !== 6) {
      toast.error('Please enter a valid 6-digit link code');
      return false;
    }

    // Validate link code
    setIsValidatingCode(true);
    try {
      const codeData = await validateLinkCode(formData.linkCode);
      if (!codeData) {
        toast.error('Invalid or expired link code. Ask your parent for a new one!');
        return false;
      }
      if (codeData.role !== 'child') {
        toast.error('This code is not for children. Ask your parent for the right code!');
        return false;
      }
      toast.success('Link code verified! 🎉');
      return true;
    } catch (error) {
      toast.error('Failed to validate link code');
      return false;
    } finally {
      setIsValidatingCode(false);
    }
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
      const isValid = await validateStep1();
      if (isValid) {
        setStep(2);
      }
      return;
    }

    if (!validateStep2()) return;

    setIsLoading(true);
    try {
      await signUpChild(
        formData.email,
        formData.password,
        formData.name,
        parseInt(formData.age),
        formData.linkCode
      );
      
      toast.success('Welcome to Dada Bucks! 🎉', { 
        description: 'Your account is ready! Start earning Dada Bucks by completing tasks!'
      });
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
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-[#B8FFC9] rounded-full flex items-center justify-center mx-auto mb-4 border-[4px] border-[#1A1A2E] shadow-[0_6px_0_#1A1A2E]">
              <Sparkles className="w-8 h-8 text-[#1A1A2E]" />
            </div>
            <h2 className="text-2xl font-black text-[#1A1A2E] uppercase">
              Kid Signup
            </h2>
            <p className="text-[#6B6B8C] font-bold">
              Step {step} of 2
            </p>
          </div>

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
                  <label className="dada-label mb-2 block">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="What should we call you?"
                    className="dada-input"
                  />
                </div>

                <div>
                  <label className="dada-label mb-2 block">Your Age</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="How old are you?"
                    min="4"
                    max="17"
                    className="dada-input"
                  />
                </div>

                <div>
                  <label className="dada-label mb-2 block">Parent&apos;s Link Code</label>
                  <input
                    type="text"
                    name="linkCode"
                    value={formData.linkCode}
                    onChange={handleChange}
                    placeholder="123456"
                    maxLength={6}
                    className="dada-input text-center text-2xl font-black tracking-widest"
                  />
                  <p className="text-xs text-[#6B6B8C] font-bold mt-2">
                    Ask your mom or dad for this 6-digit code!
                  </p>
                </div>
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
                    placeholder="your@email.com"
                    className="dada-input"
                  />
                  <p className="text-xs text-[#6B6B8C] font-bold mt-1">
                    Ask your parent to help with this
                  </p>
                </div>

                <div>
                  <label className="dada-label mb-2 block">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a secret password"
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
                      placeholder="Type it again"
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
              disabled={isLoading || isValidatingCode}
              className="w-full dada-button dada-button-primary py-4 mt-6"
            >
              {isLoading ? (
                'Creating account...'
              ) : isValidatingCode ? (
                'Checking code...'
              ) : step === 1 ? (
                'Next'
              ) : (
                <>
                  <Check className="w-5 h-5 mr-2" />
                  Create My Account!
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

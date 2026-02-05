/**
 * Landing Page
 * 
 * Friendly introduction to Dada Bucks
 * Explains the app for parents and children
 */

import { useNavigate } from 'react-router-dom';
import { 
  PiggyBank, 
  Star, 
  Shield, 
  Users, 
  TrendingUp, 
  Gift,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#7B5CFF]">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 text-6xl animate-float">⭐</div>
        <div className="absolute top-20 right-20 text-5xl animate-float" style={{ animationDelay: '1s' }}>💰</div>
        <div className="absolute bottom-20 left-20 text-4xl animate-float" style={{ animationDelay: '2s' }}>✨</div>
        <div className="absolute top-40 right-10 text-5xl animate-float" style={{ animationDelay: '0.5s' }}>🐷</div>

        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          {/* Logo */}
          <div className="inline-flex items-center gap-3 bg-[#FFD200] border-[4px] border-[#1A1A2E] rounded-3xl px-8 py-4 shadow-[0_10px_0_#1A1A2E] mb-8">
            <PiggyBank className="w-10 h-10 text-[#1A1A2E]" />
            <span className="text-[#1A1A2E] font-black text-3xl tracking-tight">
              Dada Bucks
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
            Teach Kids Responsibility<br />
            <span className="text-[#FFD200]">With Fun Rewards!</span>
          </h1>

          <p className="text-xl text-white/90 font-bold mb-10 max-w-2xl mx-auto">
            A simple way for kids to earn, save, and learn about money — 
            <span className="text-[#FFD200]"> 100% fake, 100% fun!</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/auth')}
              className="dada-button dada-button-primary text-lg py-4 px-8"
            >
              Get Started
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
            <button
              onClick={() => navigate('/auth?mode=signin')}
              className="dada-button bg-white text-[#1A1A2E] text-lg py-4 px-8"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-white py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-4xl font-black text-[#1A1A2E] text-center mb-12 uppercase">
            How It Works
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="dada-card bg-[#FFF6D6] p-8 text-center">
              <div className="w-20 h-20 bg-[#FFD200] rounded-full flex items-center justify-center mx-auto mb-6 border-[4px] border-[#1A1A2E] shadow-[0_6px_0_#1A1A2E]">
                <Star className="w-10 h-10 text-[#1A1A2E]" />
              </div>
              <div className="w-10 h-10 bg-[#1A1A2E] text-white rounded-full flex items-center justify-center font-black text-xl mx-auto mb-4">
                1
              </div>
              <h3 className="text-2xl font-black text-[#1A1A2E] mb-3">Do Tasks</h3>
              <p className="text-[#6B6B8C] font-bold">
                Kids complete chores, homework, and good deeds to earn Dada Bucks
              </p>
            </div>

            {/* Step 2 */}
            <div className="dada-card bg-[#B8FFC9] p-8 text-center">
              <div className="w-20 h-20 bg-[#15803d] rounded-full flex items-center justify-center mx-auto mb-6 border-[4px] border-[#1A1A2E] shadow-[0_6px_0_#1A1A2E]">
                <TrendingUp className="w-10 h-10 text-white" />
              </div>
              <div className="w-10 h-10 bg-[#1A1A2E] text-white rounded-full flex items-center justify-center font-black text-xl mx-auto mb-4">
                2
              </div>
              <h3 className="text-2xl font-black text-[#1A1A2E] mb-3">Earn & Save</h3>
              <p className="text-[#6B6B8C] font-bold">
                Earnings deposited daily at 10 PM. Save to earn interest!
              </p>
            </div>

            {/* Step 3 */}
            <div className="dada-card bg-[#A6EFFF] p-8 text-center">
              <div className="w-20 h-20 bg-[#0369a1] rounded-full flex items-center justify-center mx-auto mb-6 border-[4px] border-[#1A1A2E] shadow-[0_6px_0_#1A1A2E]">
                <Gift className="w-10 h-10 text-white" />
              </div>
              <div className="w-10 h-10 bg-[#1A1A2E] text-white rounded-full flex items-center justify-center font-black text-xl mx-auto mb-4">
                3
              </div>
              <h3 className="text-2xl font-black text-[#1A1A2E] mb-3">Spend Wisely</h3>
              <p className="text-[#6B6B8C] font-bold">
                Request rewards like screen time or treats — parents approve!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-[#FFF6D6] py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-4xl font-black text-[#1A1A2E] text-center mb-12 uppercase">
            Why Families Love It
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="dada-card bg-white p-6 flex items-start gap-4">
              <div className="w-14 h-14 bg-[#FFD200] rounded-xl flex items-center justify-center border-[3px] border-[#1A1A2E] shadow-[0_4px_0_#1A1A2E] flex-shrink-0">
                <Shield className="w-7 h-7 text-[#1A1A2E]" />
              </div>
              <div>
                <h3 className="text-xl font-black text-[#1A1A2E] mb-2">100% Safe</h3>
                <p className="text-[#6B6B8C] font-bold">
                  No real money, no banking, no credit cards. Just fake Dada Bucks for learning!
                </p>
              </div>
            </div>

            <div className="dada-card bg-white p-6 flex items-start gap-4">
              <div className="w-14 h-14 bg-[#B8FFC9] rounded-xl flex items-center justify-center border-[3px] border-[#1A1A2E] shadow-[0_4px_0_#1A1A2E] flex-shrink-0">
                <Sparkles className="w-7 h-7 text-[#1A1A2E]" />
              </div>
              <div>
                <h3 className="text-xl font-black text-[#1A1A2E] mb-2">Teaches Saving</h3>
                <p className="text-[#6B6B8C] font-bold">
                  Kids earn interest on savings — 1 Dada Buck per 100 saved every day!
                </p>
              </div>
            </div>

            <div className="dada-card bg-white p-6 flex items-start gap-4">
              <div className="w-14 h-14 bg-[#A6EFFF] rounded-xl flex items-center justify-center border-[3px] border-[#1A1A2E] shadow-[0_4px_0_#1A1A2E] flex-shrink-0">
                <Users className="w-7 h-7 text-[#1A1A2E]" />
              </div>
              <div>
                <h3 className="text-xl font-black text-[#1A1A2E] mb-2">Family Friendly</h3>
                <p className="text-[#6B6B8C] font-bold">
                  Parents, co-parents, and multiple kids — everyone stays connected!
                </p>
              </div>
            </div>

            <div className="dada-card bg-white p-6 flex items-start gap-4">
              <div className="w-14 h-14 bg-[#FFB8D0] rounded-xl flex items-center justify-center border-[3px] border-[#1A1A2E] shadow-[0_4px_0_#1A1A2E] flex-shrink-0">
                <PiggyBank className="w-7 h-7 text-[#1A1A2E]" />
              </div>
              <div>
                <h3 className="text-xl font-black text-[#1A1A2E] mb-2">Delayed Gratification</h3>
                <p className="text-[#6B6B8C] font-bold">
                  Earnings deposited at 10 PM daily — teaches patience and planning!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-[#7B5CFF] py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-black text-white mb-6">
            Ready to Start?
          </h2>
          <p className="text-xl text-white/90 font-bold mb-8">
            Join thousands of families teaching responsibility through play!
          </p>
          <button
            onClick={() => navigate('/auth')}
            className="dada-button dada-button-primary text-xl py-5 px-12"
          >
            Create Free Account
            <ArrowRight className="w-6 h-6 ml-2" />
          </button>
          <p className="text-white/70 font-bold mt-4 text-sm">
            No credit card required. No real money. Just fun!
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-[#1A1A2E] py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <PiggyBank className="w-6 h-6 text-[#FFD200]" />
            <span className="text-white font-black text-xl">Dada Bucks</span>
          </div>
          <p className="text-white/60 font-bold text-sm">
            Teaching kids responsibility, one Dada Buck at a time.
          </p>
          <p className="text-white/40 font-bold text-xs mt-2">
            100% fake currency. No real money involved.
          </p>
        </div>
      </div>
    </div>
  );
}

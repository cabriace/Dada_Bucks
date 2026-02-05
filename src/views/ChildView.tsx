/**
 * ChildView Component
 * 
 * The main child interface with 4 sections:
 * 1. Balance - Large animated balance display
 * 2. Savings - Manage savings and see interest
 * 3. Spend - Shop for rewards
 * 4. Profile - Avatar and transaction history
 */

import { useState } from 'react';
import { signOut } from '@/lib/supabase';
import { useFamily } from '@/hooks/useFamily';
import { BalanceSection } from '@/components/child/BalanceSection';
import { SavingsSection } from '@/components/child/SavingsSection';
import { SpendSection } from '@/components/child/SpendSection';
import { ProfileSection } from '@/components/child/ProfileSection';
import { toast } from 'sonner';

type ChildTab = 'balance' | 'savings' | 'spend' | 'profile';

export function ChildView() {
  const [activeTab, setActiveTab] = useState<ChildTab>('balance');
  const { currentChild, isLoading } = useFamily();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl font-bold">Loading...</div>
      </div>
    );
  }

  if (!currentChild) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl font-bold">No child data found</div>
      </div>
    );
  }

  const hasPendingRequest = false; // Will be fetched from useSpendRequests

  const tabs: { id: ChildTab; label: string; emoji: string; badge?: boolean }[] = [
    { id: 'balance', label: 'My Bucks', emoji: '💰' },
    { id: 'savings', label: 'Savings', emoji: '🐷' },
    { id: 'spend', label: 'Shop', emoji: '🛒', badge: hasPendingRequest },
    { id: 'profile', label: 'Me', emoji: currentChild?.avatar || '👧' },
  ];

  return (
    <div className="max-w-4xl mx-auto pt-20 pb-8 px-4">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-[#7B5CFF]/95 backdrop-blur-sm border-b-2 border-[#1A1A2E]/10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <div className="bg-[#FFD200] border-[3px] border-[#1A1A2E] rounded-xl px-3 py-1 shadow-[0_4px_0_#1A1A2E]">
            <span className="text-[#1A1A2E] font-black text-lg">Dada Bucks</span>
          </div>

          {/* User Info */}
          <div className="flex items-center gap-3">
            <span className="text-white font-bold hidden sm:inline">
              {currentChild?.name}
            </span>
            <button
              onClick={handleSignOut}
              className="text-white/80 hover:text-white font-bold text-sm"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`dada-tab relative text-lg ${activeTab === tab.id ? 'dada-tab-active' : ''}`}
          >
            <span className="mr-2">{tab.emoji}</span>
            {tab.label}
            {tab.badge && (
              <span className="absolute -top-2 -right-2 w-6 h-6 bg-[#FFD200] text-[#1A1A2E] text-xs font-black rounded-full flex items-center justify-center border-2 border-[#1A1A2E] animate-bounce">
                !
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="animate-slide-in">
        {activeTab === 'balance' && <BalanceSection child={currentChild} />}
        {activeTab === 'savings' && <SavingsSection child={currentChild} />}
        {activeTab === 'spend' && <SpendSection child={currentChild} />}
        {activeTab === 'profile' && <ProfileSection child={currentChild} />}
      </div>
    </div>
  );
}

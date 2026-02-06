/**
 * ParentView Component
 * 
 * The main parent interface with 4 sections:
 * 1. Dashboard - Overview of balances, earnings, and strikes
 * 2. Earn - Task management and tracking
 * 3. Requests - Spending approval queue
 * 4. Settings - Profile, children management, and app settings
 */

import { useState } from 'react';
import { useAuth, signOut } from '@/hooks/useAuth';
import { useFamily } from '@/hooks/useFamily';
import { DashboardSection } from '@/components/parent/DashboardSection';
import { TaskSection } from '@/components/parent/TaskSection';
import { RequestsSection } from '@/components/parent/RequestsSection';
import { SettingsSection } from '@/components/parent/SettingsSection';
import { ChildSelector } from '@/components/parent/ChildSelector';
import { toast } from 'sonner';

type ParentTab = 'dashboard' | 'earn' | 'requests' | 'settings';

export function ParentView() {
  const [activeTab, setActiveTab] = useState<ParentTab>('dashboard');
  const { profile } = useAuth();
  const { children, currentChild, currentChildId, switchChild, isLoading } = useFamily();

  // Get pending requests count for current child
  const pendingCount = 0; // Will be fetched from useSpendRequests

  const tabs: { id: ParentTab; label: string; badge?: number }[] = [
    { id: 'dashboard', label: 'Home' },
    { id: 'earn', label: 'Earn' },
    { id: 'requests', label: 'Requests', badge: pendingCount > 0 ? pendingCount : undefined },
    { id: 'settings', label: 'Settings' },
  ];

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

  return (
    <div className="max-w-6xl mx-auto pt-20 pb-8 px-4">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-[#7B5CFF]/95 backdrop-blur-sm border-b-2 border-[#1A1A2E]/10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <div className="bg-[#FFD200] border-[3px] border-[#1A1A2E] rounded-xl px-3 py-1 shadow-[0_4px_0_#1A1A2E]">
            <span className="text-[#1A1A2E] font-black text-lg">Dada Bucks</span>
          </div>

          {/* User Info */}
          <div className="flex items-center gap-3">
            <span className="text-white font-bold hidden sm:inline">
              {profile?.first_name} {profile?.last_name}
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

      {/* Child Selector */}
      {children.length > 0 && (
        <div className="mb-6">
          <ChildSelector 
            children={children}
            currentChildId={currentChildId}
            onSwitch={switchChild}
          />
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`dada-tab relative ${activeTab === tab.id ? 'dada-tab-active' : ''}`}
          >
            {tab.label}
            {tab.badge && (
              <span className="absolute -top-2 -right-2 w-6 h-6 bg-[#FF6A3D] text-white text-xs font-black rounded-full flex items-center justify-center border-2 border-[#1A1A2E]">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="animate-slide-in">
        {activeTab === 'dashboard' && <DashboardSection child={currentChild} />}
        {activeTab === 'earn' && <TaskSection childId={currentChildId || undefined} />}
        {activeTab === 'requests' && <RequestsSection childId={currentChildId || undefined} />}
        {activeTab === 'settings' && <SettingsSection />}
      </div>
    </div>
  );
}

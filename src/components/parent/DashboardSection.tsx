/**
 * DashboardSection Component
 * 
 * Parent dashboard showing:
 * - Child balance and savings
 * - Pending earnings
 * - Today's stats
 * - Strike counter
 */

import { Wallet, PiggyBank, TrendingUp, AlertTriangle, Clock, Moon } from 'lucide-react';
import type { FamilyChild } from '@/hooks/useFamily';
import { MAX_STRIKES, RESET_HOUR } from '@/types';

interface DashboardSectionProps {
  child?: FamilyChild;
}

export function DashboardSection({ child }: DashboardSectionProps) {
  if (!child) {
    return (
      <div className="dada-card bg-white p-8 text-center">
        <p className="text-[#6B6B8C] font-bold">No child selected</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="text-center mb-8">
        <h1 className="section-title text-white mb-2">
          {child.name}&apos;s Dashboard
        </h1>
        <p className="text-white/80 font-bold">
          Manage tasks, track earnings, and approve spending
        </p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Child Balance */}
        <div className="dada-card dada-card-mint p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#FFD200] rounded-xl flex items-center justify-center border-[3px] border-[#1A1A2E] shadow-[0_4px_0_#1A1A2E]">
                <Wallet className="w-6 h-6 text-[#1A1A2E]" />
              </div>
              <div>
                <p className="dada-label">{child.name}&apos;s Balance</p>
                <p className="text-sm text-[#6B6B8C] font-bold">Available to spend</p>
              </div>
            </div>
            <div className="text-4xl">{child.avatar}</div>
          </div>
          <div className="balance-display text-[#1A1A2E]">
            {child.balance}
          </div>
          <p className="text-[#6B6B8C] font-bold mt-2">Dada Bucks</p>
        </div>

        {/* Savings */}
        <div className="dada-card bg-[#A6EFFF] p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border-[3px] border-[#1A1A2E] shadow-[0_4px_0_#1A1A2E]">
              <PiggyBank className="w-6 h-6 text-[#1A1A2E]" />
            </div>
            <div>
              <p className="dada-label">Savings</p>
              <p className="text-sm text-[#1A1A2E]/70 font-bold">Earns 1 DB per 100 saved daily</p>
            </div>
          </div>
          <div className="text-4xl font-black text-[#1A1A2E]">
            {child.savings_balance}
          </div>
          <p className="text-[#1A1A2E]/70 font-bold mt-1">Dada Bucks</p>
          {child.savings_balance >= 100 && (
            <p className="text-sm text-[#1A1A2E] font-bold mt-2">
              💰 Earns +{Math.floor(child.savings_balance / 100)} DB per day!
            </p>
          )}
        </div>
      </div>

      {/* Pending Earnings */}
      {child.pending_earnings > 0 && (
        <div className="dada-card bg-[#FFF6D6] p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#FFD200] rounded-xl flex items-center justify-center border-[3px] border-[#1A1A2E] shadow-[0_4px_0_#1A1A2E]">
              <Moon className="w-6 h-6 text-[#1A1A2E]" />
            </div>
            <div>
              <p className="font-black text-[#1A1A2E]">
                {child.pending_earnings} Dada Bucks Pending
              </p>
              <p className="text-sm text-[#6B6B8C] font-bold">
                Will be deposited at {RESET_HOUR}:00 PM
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Today's Earnings */}
        <div className="dada-card bg-white p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-[#22c55e]" />
            <p className="dada-label text-xs">Total Earned</p>
          </div>
          <p className="text-3xl font-black text-[#22c55e]">
            {child.total_earned}
          </p>
        </div>

        {/* Today's Spending */}
        <div className="dada-card bg-white p-4">
          <div className="flex items-center gap-2 mb-2">
            <PiggyBank className="w-5 h-5 text-[#ef4444]" />
            <p className="dada-label text-xs">Total Spent</p>
          </div>
          <p className="text-3xl font-black text-[#ef4444]">
            {child.total_spent}
          </p>
        </div>

        {/* Strikes */}
        <div className="dada-card bg-white p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-[#FF6A3D]" />
            <p className="dada-label text-xs">Strikes</p>
          </div>
          <div className="flex items-center gap-2">
            <p className={`text-3xl font-black ${child.strikes >= MAX_STRIKES ? 'text-[#FF6A3D]' : 'text-[#1A1A2E]'}`}>
              {child.strikes}
            </p>
            <span className="text-[#6B6B8C] font-bold">/ {MAX_STRIKES}</span>
          </div>
        </div>

        {/* Age */}
        <div className="dada-card bg-white p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-[#7B5CFF]" />
            <p className="dada-label text-xs">Age</p>
          </div>
          <p className="text-3xl font-black text-[#1A1A2E]">
            {child.age}
          </p>
        </div>
      </div>

      {/* Strike Warning */}
      {child.strikes > 0 && child.strikes < MAX_STRIKES && (
        <div className="dada-card bg-[#FFD200] p-4 border-[#1A1A2E]">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-[#1A1A2E]" />
            <div>
              <p className="font-black text-[#1A1A2E] uppercase">
                Warning: {child.strikes} Strike{child.strikes !== 1 ? 's' : ''}
              </p>
              <p className="text-[#1A1A2E] font-bold text-sm">
                {MAX_STRIKES - child.strikes} more and all pending earnings will be forfeited!
              </p>
            </div>
          </div>
        </div>
      )}

      {child.strikes >= MAX_STRIKES && (
        <div className="dada-card bg-[#FF6A3D] p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-white" />
            <div>
              <p className="font-black text-white uppercase">
                Earnings Locked!
              </p>
              <p className="text-white/90 font-bold text-sm">
                {child.name} has {MAX_STRIKES} strikes. Try again tomorrow!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

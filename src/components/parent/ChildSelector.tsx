/**
 * ChildSelector Component
 * 
 * Allows parents to:
 * - Switch between children
 * - Add new children (generates link code)
 */

import { useState } from 'react';
import { ChevronDown, Plus, Copy, Check } from 'lucide-react';
import { generateLinkCode } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import type { FamilyChild } from '@/hooks/useFamily';
import { toast } from 'sonner';

interface ChildSelectorProps {
  children: FamilyChild[];
  currentChildId: string | null;
  onSwitch: (childId: string) => void;
}

export function ChildSelector({ children, currentChildId, onSwitch }: ChildSelectorProps) {
  const { user, profile } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const isParent = profile?.role === 'parent';
  const currentChild = children.find(c => c.id === currentChildId) || children[0];

  const handleGenerateCode = async () => {
    if (!user) return;
    try {
      const code = await generateLinkCode(user.id, 'child');
      setGeneratedCode(code);
      toast.success('Link code generated!');
    } catch (error) {
      toast.error('Failed to generate code');
    }
  };

  const copyCode = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode);
      setCopied(true);
      toast.success('Code copied!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      <div className="relative">
        {/* Current Child Display */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="dada-card bg-white px-4 py-3 flex items-center gap-3 min-w-[200px] justify-between"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">{currentChild?.avatar}</span>
              <span className="font-black text-lg text-[#1A1A2E]">{currentChild?.name}</span>
            </div>
            <ChevronDown className={`w-5 h-5 text-[#6B6B8C] transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
          </button>
          
          {isParent && (
            <button
              onClick={() => {
                setShowAddModal(true);
                setGeneratedCode(null);
              }}
              className="w-12 h-12 rounded-xl bg-[#B8FFC9] border-[3px] border-[#1A1A2E] shadow-[0_4px_0_#1A1A2E] flex items-center justify-center hover:translate-y-[-2px] hover:shadow-[0_6px_0_#1A1A2E] active:translate-y-[2px] active:shadow-[0_2px_0_#1A1A2E] transition-all"
            >
              <Plus className="w-6 h-6 text-[#1A1A2E]" />
            </button>
          )}
        </div>

        {/* Dropdown Menu */}
        {showDropdown && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-white border-[3px] border-[#1A1A2E] rounded-2xl shadow-[0_8px_0_#1A1A2E] z-50 overflow-hidden">
            {children.map((child) => (
              <button
                key={child.id}
                onClick={() => {
                  onSwitch(child.id);
                  setShowDropdown(false);
                }}
                className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-[#FFF6D6] transition-colors ${
                  child.id === currentChildId ? 'bg-[#FFF6D6]' : ''
                }`}
              >
                <span className="text-2xl">{child.avatar}</span>
                <span className="font-bold text-[#1A1A2E]">{child.name}</span>
                {child.id === currentChildId && (
                  <span className="ml-auto text-xs bg-[#FFD200] px-2 py-1 rounded-full font-bold">Active</span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Click outside to close dropdown */}
        {showDropdown && (
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowDropdown(false)}
          />
        )}
      </div>

      {/* Add Child Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-[#1A1A2E]/80 flex items-center justify-center z-50 p-4">
          <div className="dada-card bg-white w-full max-w-md p-6">
            <h3 className="card-title text-center mb-4">Add a Child</h3>
            <p className="text-[#6B6B8C] font-bold text-center mb-6">
              Generate a link code for your child to join
            </p>

            {!generatedCode ? (
              <button
                onClick={handleGenerateCode}
                className="w-full dada-button dada-button-primary py-4"
              >
                <Plus className="w-5 h-5 mr-2" />
                Generate Link Code
              </button>
            ) : (
              <div className="text-center">
                <p className="dada-label mb-2">Share this code with your child:</p>
                <div 
                  onClick={copyCode}
                  className="bg-[#FFF6D6] border-[3px] border-[#1A1A2E] rounded-xl py-4 px-6 cursor-pointer hover:bg-[#FFD200] transition-colors"
                >
                  <p className="text-4xl font-black text-[#1A1A2E] tracking-widest">
                    {generatedCode}
                  </p>
                  <p className="text-sm text-[#6B6B8C] font-bold mt-2 flex items-center justify-center gap-2">
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" /> Click to copy
                      </>
                    )}
                  </p>
                </div>
                <p className="text-xs text-[#6B6B8C] font-bold mt-4">
                  Code expires in 7 days
                </p>
              </div>
            )}

            <button
              onClick={() => setShowAddModal(false)}
              className="w-full dada-button dada-button-secondary mt-4"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

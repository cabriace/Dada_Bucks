/**
 * ViewToggle Component
 * 
 * Allows switching between Parent and Child views (for parents only)
 * Also handles sign out
 */

import { useNavigate } from 'react-router-dom';
import { useIsParent } from '@/hooks/useAuth';
import { signOut } from '@/lib/supabase';
import { Shield, User, LogOut } from 'lucide-react';
import { toast } from 'sonner';

export function ViewToggle() {
  const navigate = useNavigate();
  const isParent = useIsParent();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
      navigate('/auth');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  // Only show for parents who can toggle between views
  if (!isParent) return null;

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => navigate('/parent')}
        className="dada-tab flex items-center gap-2"
      >
        <Shield className="w-4 h-4" />
        Parent
      </button>
      <button
        onClick={() => navigate('/child')}
        className="dada-tab flex items-center gap-2"
      >
        <User className="w-4 h-4" />
        Kid
      </button>
      <button
        onClick={handleSignOut}
        className="w-10 h-10 rounded-xl bg-[#FFB8D0] border-[3px] border-[#1A1A2E] shadow-[0_3px_0_#1A1A2E] flex items-center justify-center hover:translate-y-[-2px] hover:shadow-[0_5px_0_#1A1A2E] active:translate-y-[2px] active:shadow-[0_1px_0_#1A1A2E] transition-all"
        title="Sign Out"
      >
        <LogOut className="w-5 h-5 text-[#1A1A2E]" />
      </button>
    </div>
  );
}

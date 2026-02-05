/**
 * Role Selector Page
 * 
 * User selects their role during signup:
 * - Parent
 * - Co-Parent
 * - Child
 */

import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, UserPlus, Baby } from 'lucide-react';

export function RoleSelectorPage() {
  const navigate = useNavigate();

  const roles = [
    {
      id: 'parent',
      label: 'Parent',
      description: 'Create and manage your family account',
      icon: Users,
      color: 'bg-[#FFD200]',
    },
    {
      id: 'co_parent',
      label: 'Co-Parent',
      description: 'Join an existing family with a link code',
      icon: UserPlus,
      color: 'bg-[#A6EFFF]',
    },
    {
      id: 'child',
      label: 'Child',
      description: 'Join your family with a parent code',
      icon: Baby,
      color: 'bg-[#B8FFC9]',
    },
  ];

  return (
    <div className="min-h-screen bg-[#7B5CFF] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back button */}
        <button
          onClick={() => navigate('/auth')}
          className="mb-4 flex items-center gap-2 text-white font-bold hover:underline"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <div className="dada-card bg-white p-8">
          <h2 className="text-2xl font-black text-[#1A1A2E] text-center mb-2 uppercase">
            Who Are You?
          </h2>
          <p className="text-[#6B6B8C] font-bold text-center mb-8">
            Select your role to get started
          </p>

          <div className="space-y-4">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => navigate(`/auth/signup/${role.id}`)}
                className="w-full dada-card p-4 flex items-center gap-4 hover:translate-y-[-2px] transition-transform text-left"
              >
                <div className={`w-14 h-14 ${role.color} rounded-xl flex items-center justify-center border-[3px] border-[#1A1A2E] shadow-[0_4px_0_#1A1A2E] flex-shrink-0`}>
                  <role.icon className="w-7 h-7 text-[#1A1A2E]" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-[#1A1A2E]">{role.label}</h3>
                  <p className="text-[#6B6B8C] font-bold text-sm">{role.description}</p>
                </div>
              </button>
            ))}
          </div>

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

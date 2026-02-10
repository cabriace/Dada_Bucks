// src/services/profile.service.ts
import { supabase } from '@/lib/supabase';
import type { Profile, UserRole } from '@/types';

export async function createProfileForAuthUser(options: {
  userId: string;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  age?: number | null;
  role?: UserRole;
}) {
  const { userId, email, firstName, lastName, age, role = 'parent' } = options;

  // build display name from first/last if provided, otherwise null
  const display_name = firstName || lastName ? `${firstName ?? ''} ${lastName ?? ''}`.trim() : null;

  const { data, error } = await supabase
    .from('profiles')
    .insert({
      id: userId,
      email: email ?? null,
      display_name,
      age: age ?? null,
      role,
      avatar: null,
    });

  if (error) throw error;
  return data;
}

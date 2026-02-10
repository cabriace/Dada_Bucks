/**
 * Supabase Client Configuration
 * 
 * Dada Bucks - Supabase Integration
 * NO REAL MONEY - 100% VIRTUAL CURRENCY
 */

import { createClient } from '@supabase/supabase-js';
import { createProfileForAuthUser } from '@/services/profile.service';
import type { UserRole } from '@/types'; // optional if you need the type

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ============================================================================
// TYPE DEFINITIONS (matching existing database schema)
// ============================================================================

export type UserRole = 'parent' | 'co_parent' | 'child';

export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  name: string | null; // For children
  age: number | null;
  role: UserRole;
  avatar: string | null;
  created_at: string;
  updated_at: string;
}

export interface Child {
  id: string;
  balance: number;
  savings_balance: number;
  strikes: number;
  total_earned: number;
  total_spent: number;
  pending_earnings: number;
  savings_interest_accrued: number;
  last_interest_date: string;
  created_at: string;
  updated_at: string;
}

export interface ParentChildLink {
  id: string;
  parent_id: string;
  child_id: string;
  role: 'parent' | 'co_parent';
  created_at: string;
}

export interface LinkCode {
  id: string;
  code: string;
  created_by: string;
  role: 'child' | 'co_parent';
  expires_at: string;
  used: boolean;
  used_by: string | null;
  created_at: string;
}

export interface Task {
  id: string;
  name: string;
  icon: string;
  payout: number;
  daily_max: number;
  category: string;
  is_active: boolean;
  created_by: string;
  created_at: string;
}

export interface TaskLog {
  id: string;
  task_id: string;
  child_id: string;
  completed_at: string;
  payout: number;
  deposited: boolean;
}

export interface Transaction {
  id: string;
  child_id: string;
  type: 'earn' | 'spend' | 'refund' | 'strike_penalty' | 'interest' | 'savings_deposit' | 'savings_withdrawal' | 'parent_gift';
  amount: number;
  description: string;
  created_at: string;
}

export interface SpendRequest {
  id: string;
  child_id: string;
  items: SpendRequestItem[];
  total_cost: number;
  status: 'pending' | 'approved' | 'denied';
  requested_at: string;
  responded_at: string | null;
  responded_by: string | null;
}

export interface SpendRequestItem {
  name: string;
  icon: string;
  cost: number;
  quantity: number;
}

// ============================================================================
// AUTH HELPERS
// ============================================================================

export async function signUpParent(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  age: number,
  role: 'parent' | 'co_parent' = 'parent'
) {
  // 1. Create auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) throw authError;
  if (!authData.user) throw new Error('Failed to create user');

  // 2. Create profile using service (this inserts into profiles table)
  await createProfileForAuthUser({
    userId: authData.user.id,
    email,
    firstName,
    lastName,
    age,
    role,
  });

  return authData.user;
}


export async function signUpChild(
  email: string,
  password: string,
  name: string,
  age: number,
  linkCode: string
) {
  // 1. Validate linking code
  const { data: codeData, error: codeError } = await supabase
    .from('link_codes')
    .select('*')
    .eq('code', linkCode)
    .eq('used', false)
    .gt('expires_at', new Date().toISOString())
    .single();

  if (codeError || !codeData) {
    throw new Error('Invalid or expired linking code');
  }

  // 2. Create auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) throw authError;
  if (!authData.user) throw new Error('Failed to create user');

    // 3. Create profile via service
  await createProfileForAuthUser({
    userId: authData.user.id,
    email,
    firstName: name, // using single name as firstName for display
    lastName: null,
    age,
    role: 'child',
  });

  // 4. Insert into children table
  const { error: childError } = await supabase.from('children').insert({
    id: authData.user.id,
    balance: 0,
    savings_balance: 0,
    strike_count: 0,
    total_earned: 0,
    total_spent: 0,
    pending_earnings: 0,
    savings_interest_accrued: 0,
    last_interest_date: new Date().toISOString().split('T')[0],
  });

  if (childError) throw childError;

  // 5. Create parent-child link
  const { error: linkError } = await supabase.from('parent_child_links').insert({
    parent_id: codeData.parent_id || codeData.created_by || codeData.parentId,
    child_id: authData.user.id,
    role: 'parent',
  });

  if (linkError) throw linkError;

  // 6. Mark link code as used
  const { error: updateError } = await supabase
    .from('link_codes')
    .update({ used: true, used_by: authData.user.id })
    .eq('code', linkCode); // use code field to update

  if (updateError) throw updateError;

  return authData.user;

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data as Profile;
}

// ============================================================================
// LINK CODE HELPERS
// ============================================================================

export async function generateLinkCode(
  parentId: string,
  role: 'child' | 'co_parent'
): Promise<string> {
  // Generate 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Set expiration to 7 days
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  const { error } = await supabase.from('link_codes').insert({
    code,
    created_by: parentId,
    role,
    expires_at: expiresAt.toISOString(),
    used: false,
  });

  if (error) throw error;
  return code;
}

export async function validateLinkCode(code: string): Promise<LinkCode | null> {
  const { data, error } = await supabase
    .from('link_codes')
    .select('*')
    .eq('code', code)
    .eq('used', false)
    .gt('expires_at', new Date().toISOString())
    .single();

  if (error) return null;
  return data as LinkCode;
}

// ============================================================================
// CHILDREN HELPERS
// ============================================================================

export async function getParentChildren(parentId: string) {
  const { data, error } = await supabase
    .from('parent_child_links')
    .select(`
      child_id,
      role,
      children:child_id (
        *,
        profile:profiles!children_id_fkey (*)
      )
    `)
    .eq('parent_id', parentId);

  if (error) throw error;
  return data || [];
}

export async function getChildData(childId: string) {
  const { data, error } = await supabase
    .from('children')
    .select(`
      *,
      profile:profiles!children_id_fkey (*)
    `)
    .eq('id', childId)
    .single();

  if (error) throw error;
  return data;
}

// ============================================================================
// TASK HELPERS
// ============================================================================

export async function getTasks(parentId: string) {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('created_by', parentId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Task[];
}

export async function createTask(
  parentId: string,
  task: Omit<Task, 'id' | 'created_by' | 'created_at'>
) {
  const { data, error } = await supabase
    .from('tasks')
    .insert({
      ...task,
      created_by: parentId,
    })
    .select()
    .single();

  if (error) throw error;
  return data as Task;
}

// ============================================================================
// TRANSACTION HELPERS
// ============================================================================

export async function getChildTransactions(childId: string) {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('child_id', childId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Transaction[];
}

// ============================================================================
// SPEND REQUEST HELPERS
// ============================================================================

export async function getPendingSpendRequests(childId: string) {
  const { data, error } = await supabase
    .from('spend_requests')
    .select('*')
    .eq('child_id', childId)
    .eq('status', 'pending')
    .order('requested_at', { ascending: false });

  if (error) throw error;
  return data as SpendRequest[];
}

export async function getSpendRequestHistory(childId: string) {
  const { data, error } = await supabase
    .from('spend_requests')
    .select('*')
    .eq('child_id', childId)
    .neq('status', 'pending')
    .order('requested_at', { ascending: false });

  if (error) throw error;
  return data as SpendRequest[];
}

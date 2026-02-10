/**
 * Supabase Client Configuration
 *
 * Dada Bucks - Supabase Integration
 * NO REAL MONEY - 100% VIRTUAL CURRENCY
 */

import { createClient } from '@supabase/supabase-js'
import { createProfileForAuthUser } from '@/services/profile.service'

// ============================================================================
// ENV SETUP (Vercel-safe)
// ============================================================================

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    '❌ Missing Supabase env vars. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel.'
  )
}

export const supabase = createClient(
  supabaseUrl ?? '',
  supabaseAnonKey ?? ''
)

// ============================================================================
// TYPES
// ============================================================================

export type UserRole = 'parent' | 'co_parent' | 'child'

export interface Profile {
  id: string
  first_name: string | null
  last_name: string | null
  name: string | null
  age: number | null
  role: UserRole
  avatar: string | null
  created_at: string
  updated_at: string
}

export interface Child {
  id: string
  balance: number
  savings_balance: number
  strikes: number
  total_earned: number
  total_spent: number
  pending_earnings: number
  savings_interest_accrued: number
  last_interest_date: string
  created_at: string
  updated_at: string
}

export interface LinkCode {
  id: string
  code: string
  created_by: string
  role: 'child' | 'co_parent'
  expires_at: string
  used: boolean
  used_by: string | null
  created_at: string
}

export interface Task {
  id: string
  name: string
  icon: string
  payout: number
  daily_max: number
  category: string
  is_active: boolean
  created_by: string
  created_at: string
}

export interface Transaction {
  id: string
  child_id: string
  type:
    | 'earn'
    | 'spend'
    | 'refund'
    | 'strike_penalty'
    | 'interest'
    | 'savings_deposit'
    | 'savings_withdrawal'
    | 'parent_gift'
  amount: number
  description: string
  created_at: string
}

export interface SpendRequestItem {
  name: string
  icon: string
  cost: number
  quantity: number
}

export interface SpendRequest {
  id: string
  child_id: string
  items: SpendRequestItem[]   // 👈 ADD THIS
  total_cost: number
  status: 'pending' | 'approved' | 'denied'
  requested_at: string
  responded_at: string | null
  responded_by: string | null
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
  role: UserRole = 'parent'
) {
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) throw error
  if (!data.user) throw new Error('Failed to create user')

  await createProfileForAuthUser({
    userId: data.user.id,
    email,
    firstName,
    lastName,
    age,
    role,
  })

  return data.user
}

export async function signUpChild(
  email: string,
  password: string,
  name: string,
  age: number,
  linkCode: string
) {
  const code = await validateLinkCode(linkCode)
  if (!code) throw new Error('Invalid or expired linking code')

  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) throw error
  if (!data.user) throw new Error('Failed to create user')

  await createProfileForAuthUser({
    userId: data.user.id,
    email,
    firstName: name,
    lastName: null,
    age,
    role: 'child',
  })

  const { error: childError } = await supabase.from('children').insert({
    id: data.user.id,
    balance: 0,
    savings_balance: 0,
    strikes: 0,
    total_earned: 0,
    total_spent: 0,
    pending_earnings: 0,
    savings_interest_accrued: 0,
    last_interest_date: new Date().toISOString().split('T')[0],
  })

  if (childError) throw childError

  await supabase
    .from('parent_child_links')
    .insert({
      parent_id: code.created_by,
      child_id: data.user.id,
      role: 'parent',
    })

  await supabase
    .from('link_codes')
    .update({ used: true, used_by: data.user.id })
    .eq('code', linkCode)

  return data.user
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser()
  if (error) throw error
  return data.user
}

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) throw error
  return data as Profile
}

// ============================================================================
// LINK CODE HELPERS (FIXES YOUR BUILD ERRORS)
// ============================================================================

export async function generateLinkCode(
  parentId: string,
  role: 'child' | 'co_parent'
): Promise<string> {
  const code = Math.floor(100000 + Math.random() * 900000).toString()

  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 7)

  const { error } = await supabase.from('link_codes').insert({
    code,
    created_by: parentId,
    role,
    expires_at: expiresAt.toISOString(),
    used: false,
  })

  if (error) throw error
  return code
}

export async function validateLinkCode(code: string): Promise<LinkCode | null> {
  const { data, error } = await supabase
    .from('link_codes')
    .select('*')
    .eq('code', code)
    .eq('used', false)
    .gt('expires_at', new Date().toISOString())
    .single()

  if (error) return null
  return data as LinkCode
}

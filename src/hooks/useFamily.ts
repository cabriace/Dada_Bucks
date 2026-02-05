/**
 * Family Hook
 * 
 * Manages family data for parents and children
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase, type Task, type Transaction, type SpendRequest } from '@/lib/supabase';
import { useAuth } from './useAuth';

export interface FamilyChild {
  id: string;
  name: string;
  avatar: string;
  balance: number;
  savings_balance: number;
  strikes: number;
  total_earned: number;
  total_spent: number;
  pending_earnings: number;
  age: number;
}

export function useFamily() {
  const { user, profile } = useAuth();
  const [children, setChildren] = useState<FamilyChild[]>([]);
  const [currentChildId, setCurrentChildId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isParent = profile?.role === 'parent' || profile?.role === 'co_parent';
  const isChild = profile?.role === 'child';

  // Load children for parent
  const loadChildren = useCallback(async () => {
    if (!user || !isParent) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('parent_child_links')
        .select(`
          child_id,
          children:child_id (
            id,
            balance,
            savings_balance,
            strikes,
            total_earned,
            total_spent,
            pending_earnings,
            profile:profiles!children_id_fkey (
              name,
              avatar,
              age
            )
          )
        `)
        .eq('parent_id', user.id);

      if (error) throw error;

      const formattedChildren: FamilyChild[] = (data || []).map((link: any) => ({
        id: link.children.id,
        name: link.children.profile?.name || 'Child',
        avatar: link.children.profile?.avatar || '👧',
        balance: link.children.balance,
        savings_balance: link.children.savings_balance,
        strikes: link.children.strikes,
        total_earned: link.children.total_earned,
        total_spent: link.children.total_spent,
        pending_earnings: link.children.pending_earnings,
        age: link.children.profile?.age || 0,
      }));

      setChildren(formattedChildren);
      
      // Set first child as current if none selected
      if (formattedChildren.length > 0 && !currentChildId) {
        setCurrentChildId(formattedChildren[0].id);
      }
    } catch (error) {
      console.error('Failed to load children:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user, isParent, currentChildId]);

  // Load child's own data
  const loadChildData = useCallback(async () => {
    if (!user || !isChild) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('children')
        .select(`
          *,
          profile:profiles!children_id_fkey (*)
        `)
        .eq('id', user.id)
        .single();

      if (error) throw error;

      const childData: FamilyChild = {
        id: data.id,
        name: data.profile?.name || 'Me',
        avatar: data.profile?.avatar || '👧',
        balance: data.balance,
        savings_balance: data.savings_balance,
        strikes: data.strikes,
        total_earned: data.total_earned,
        total_spent: data.total_spent,
        pending_earnings: data.pending_earnings,
        age: data.profile?.age || 0,
      };

      setChildren([childData]);
      setCurrentChildId(user.id);
    } catch (error) {
      console.error('Failed to load child data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user, isChild]);

  useEffect(() => {
    if (isParent) {
      loadChildren();
    } else if (isChild) {
      loadChildData();
    }
  }, [isParent, isChild, loadChildren, loadChildData]);

  const currentChild = children.find(c => c.id === currentChildId) || children[0];

  const switchChild = (childId: string) => {
    setCurrentChildId(childId);
  };

  const refresh = () => {
    if (isParent) {
      loadChildren();
    } else {
      loadChildData();
    }
  };

  return {
    children,
    currentChild,
    currentChildId,
    switchChild,
    isLoading,
    refresh,
  };
}

// ============================================================================
// Tasks Hook
// ============================================================================

export function useTasks(parentId?: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadTasks = useCallback(async () => {
    if (!parentId) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('created_by', parentId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    } finally {
      setIsLoading(false);
    }
  }, [parentId]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const createTask = async (task: Omit<Task, 'id' | 'created_by' | 'created_at'>) => {
    if (!parentId) return;

    const { data, error } = await supabase
      .from('tasks')
      .insert({ ...task, created_by: parentId })
      .select()
      .single();

    if (error) throw error;
    await loadTasks();
    return data;
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    const { error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', taskId);

    if (error) throw error;
    await loadTasks();
  };

  const deleteTask = async (taskId: string) => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);

    if (error) throw error;
    await loadTasks();
  };

  return {
    tasks,
    isLoading,
    createTask,
    updateTask,
    deleteTask,
    refresh: loadTasks,
  };
}

// ============================================================================
// Transactions Hook
// ============================================================================

export function useTransactions(childId?: string) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadTransactions = useCallback(async () => {
    if (!childId) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('child_id', childId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Failed to load transactions:', error);
    } finally {
      setIsLoading(false);
    }
  }, [childId]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  return {
    transactions,
    isLoading,
    refresh: loadTransactions,
  };
}

// ============================================================================
// Spend Requests Hook
// ============================================================================

export function useSpendRequests(childId?: string) {
  const [pendingRequests, setPendingRequests] = useState<SpendRequest[]>([]);
  const [requestHistory, setRequestHistory] = useState<SpendRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadRequests = useCallback(async () => {
    if (!childId) return;

    setIsLoading(true);
    try {
      // Pending requests
      const { data: pending, error: pendingError } = await supabase
        .from('spend_requests')
        .select('*')
        .eq('child_id', childId)
        .eq('status', 'pending')
        .order('requested_at', { ascending: false });

      if (pendingError) throw pendingError;
      setPendingRequests(pending || []);

      // History
      const { data: history, error: historyError } = await supabase
        .from('spend_requests')
        .select('*')
        .eq('child_id', childId)
        .neq('status', 'pending')
        .order('requested_at', { ascending: false });

      if (historyError) throw historyError;
      setRequestHistory(history || []);
    } catch (error) {
      console.error('Failed to load spend requests:', error);
    } finally {
      setIsLoading(false);
    }
  }, [childId]);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const createRequest = async (items: any[], totalCost: number) => {
    if (!childId) return;

    const { data, error } = await supabase
      .from('spend_requests')
      .insert({
        child_id: childId,
        items,
        total_cost: totalCost,
        status: 'pending',
      })
      .select()
      .single();

    if (error) throw error;
    await loadRequests();
    return data;
  };

  const approveRequest = async (requestId: string) => {
    const { error } = await supabase
      .from('spend_requests')
      .update({
        status: 'approved',
        responded_at: new Date().toISOString(),
      })
      .eq('id', requestId);

    if (error) throw error;
    await loadRequests();
  };

  const denyRequest = async (requestId: string) => {
    const { error } = await supabase
      .from('spend_requests')
      .update({
        status: 'denied',
        responded_at: new Date().toISOString(),
      })
      .eq('id', requestId);

    if (error) throw error;
    await loadRequests();
  };

  return {
    pendingRequests,
    requestHistory,
    isLoading,
    createRequest,
    approveRequest,
    denyRequest,
    refresh: loadRequests,
  };
}

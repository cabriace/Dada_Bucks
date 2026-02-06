/**
 * TaskSection Component
 * 
 * Parent interface for:
 * - Viewing all tasks
 * - Adding new tasks
 * - Editing task payouts and limits
 * - Tracking completions
 * - Adding/removing strikes
 */

import { useState } from 'react';
import { useTasks, useFamily } from '@/hooks/useFamily';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import type { TaskCategory } from '@/types';
import { MAX_STRIKES } from '@/types';
import { Plus, Minus, Edit2, AlertTriangle, Check, X, Settings, Moon } from 'lucide-react';
import { toast } from 'sonner';

interface TaskSectionProps {
  childId?: string;
}

export function TaskSection({ childId }: TaskSectionProps) {
  const { user } = useAuth();
  const { currentChild, refresh } = useFamily();
  const { tasks, isLoading, createTask, updateTask, deleteTask } = useTasks(user?.id);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [strikeReason, setStrikeReason] = useState('');
  const [showStrikeForm, setShowStrikeForm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Form state
  const [newTask, setNewTask] = useState({
    name: '',
    payout: 1,
    daily_max: 1,
    category: 'chores' as TaskCategory,
    icon: '📌',
  });

  const child = currentChild;
  const canEarn = (child?.strikes || 0) < MAX_STRIKES;

  const handleComplete = async (taskId: string, payout: number) => {
    if (!childId || !canEarn) return;
    
    setIsProcessing(true);
    try {
      // Create task log
      const { error: logError } = await supabase.from('task_logs').insert({
        task_id: taskId,
        child_id: childId,
        payout: payout,
        deposited: false,
      });

      if (logError) throw logError;

      // Update pending earnings
      const { error: updateError } = await supabase
        .from('children')
        .update({
          pending_earnings: (child?.pending_earnings || 0) + payout,
          total_earned: (child?.total_earned || 0) + payout,
        })
        .eq('id', childId);

      if (updateError) throw updateError;

      toast.success(`+${payout} Dada Bucks! Will be deposited at 10 PM`, { icon: '🎉' });
      refresh();
    } catch (error: any) {
      toast.error(error.message || 'Failed to complete task');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUndo = async (taskId: string, payout: number) => {
    if (!childId) return;
    
    setIsProcessing(true);
    try {
      // Find and delete the most recent task log for this task
      const { data: logs, error: findError } = await supabase
        .from('task_logs')
        .select('id')
        .eq('task_id', taskId)
        .eq('child_id', childId)
        .eq('deposited', false)
        .order('completed_at', { ascending: false })
        .limit(1);

      if (findError) throw findError;
      if (!logs || logs.length === 0) {
        toast.error('Cannot undo - already deposited');
        return;
      }

      // Delete the task log
      const { error: deleteError } = await supabase
        .from('task_logs')
        .delete()
        .eq('id', logs[0].id);

      if (deleteError) throw deleteError;

      // Update pending earnings
      const { error: updateError } = await supabase
        .from('children')
        .update({
          pending_earnings: Math.max(0, (child?.pending_earnings || 0) - payout),
          total_earned: Math.max(0, (child?.total_earned || 0) - payout),
        })
        .eq('id', childId);

      if (updateError) throw updateError;

      toast.success('Task undone');
      refresh();
    } catch (error: any) {
      toast.error(error.message || 'Failed to undo task');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddTask = async () => {
    if (!newTask.name.trim()) {
      toast.error('Please enter a task name');
      return;
    }
    try {
      await createTask({
        ...newTask,
        is_active: true,
      });
      setNewTask({ name: '', payout: 1, daily_max: 1, category: 'chores', icon: '📌' });
      setShowAddForm(false);
      toast.success('Task added!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add task');
    }
  };

  const handleAddStrike = async () => {
    if (!strikeReason.trim() || !childId) {
      toast.error('Please enter a reason');
      return;
    }
    
    setIsProcessing(true);
    try {
      const currentStrikes = child?.strikes || 0;
      const newStrikes = currentStrikes + 1;
      const forfeited = newStrikes >= MAX_STRIKES && (child?.pending_earnings || 0) > 0;

      // Update strikes
      const { error: updateError } = await supabase
        .from('children')
        .update({
          strikes: newStrikes,
          ...(forfeited ? { pending_earnings: 0 } : {}),
        })
        .eq('id', childId);

      if (updateError) throw updateError;

      // Create transaction record for strike
      await supabase.from('transactions').insert({
        child_id: childId,
        type: 'strike_penalty',
        amount: forfeited ? -(child?.pending_earnings || 0) : 0,
        description: `Strike: ${strikeReason}${forfeited ? ' (forfeited pending earnings)' : ''}`,
      });

      toast.success(
        forfeited 
          ? `Strike added! ${child?.pending_earnings} DB forfeited.` 
          : `Strike ${newStrikes} of ${MAX_STRIKES}`,
        { icon: forfeited ? '💔' : '⚠️', duration: forfeited ? 5000 : 3000 }
      );
      
      setStrikeReason('');
      setShowStrikeForm(false);
      refresh();
    } catch (error: any) {
      toast.error(error.message || 'Failed to add strike');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!child) {
    return (
      <div className="dada-card bg-white p-8 text-center">
        <p className="text-[#6B6B8C] font-bold">No child selected</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="section-title text-white">Task Tracker</h2>
          <p className="text-white/80 font-bold">
            Complete tasks to earn Dada Bucks (deposited at 10 PM)
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowStrikeForm(true)}
            className="dada-button dada-button-danger"
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            Add Strike
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="dada-button dada-button-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </button>
        </div>
      </div>

      {/* Pending Earnings Banner */}
      {child.pending_earnings > 0 && (
        <div className="dada-card bg-[#FFF6D6] p-4">
          <div className="flex items-center gap-3">
            <Moon className="w-6 h-6 text-[#1A1A2E]" />
            <div>
              <p className="font-black text-[#1A1A2E]">
                {child.pending_earnings} Dada Bucks pending
              </p>
              <p className="text-sm text-[#6B6B8C] font-bold">
                Will be deposited at 10:00 PM tonight
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Strike Status */}
      <div className="dada-card bg-white p-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-4">
            <span className="font-black text-[#1A1A2E] uppercase">Strikes Today:</span>
            <div className="flex gap-2">
              {[1, 2, 3].map((num) => (
                <div
                  key={num}
                  className={`strike-badge ${
                    num <= (child.strikes || 0) ? 'strike-badge-filled' : 'strike-badge-empty'
                  }`}
                >
                  {num <= (child.strikes || 0) ? 'X' : num}
                </div>
              ))}
            </div>
          </div>
          {!canEarn && (
            <span className="text-[#FF6A3D] font-black uppercase">
              Earnings Locked!
            </span>
          )}
        </div>
      </div>

      {/* Add Task Form */}
      {showAddForm && (
        <div className="dada-card bg-[#FFF6D6] p-6">
          <h3 className="card-title mb-4">Add New Task</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="dada-label mb-2 block">Task Name</label>
              <input
                type="text"
                value={newTask.name}
                onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                placeholder="e.g., Feed the dog"
                className="dada-input"
              />
            </div>
            <div>
              <label className="dada-label mb-2 block">Icon</label>
              <input
                type="text"
                value={newTask.icon}
                onChange={(e) => setNewTask({ ...newTask, icon: e.target.value })}
                className="dada-input text-2xl text-center"
                maxLength={2}
              />
            </div>
            <div>
              <label className="dada-label mb-2 block">Payout (DB)</label>
              <input
                type="number"
                min={1}
                max={100}
                value={newTask.payout}
                onChange={(e) => setNewTask({ ...newTask, payout: parseInt(e.target.value) || 1 })}
                className="dada-input"
              />
            </div>
            <div>
              <label className="dada-label mb-2 block">Daily Max</label>
              <input
                type="number"
                min={1}
                max={50}
                value={newTask.daily_max}
                onChange={(e) => setNewTask({ ...newTask, daily_max: parseInt(e.target.value) || 1 })}
                className="dada-input"
              />
            </div>
            <div>
              <label className="dada-label mb-2 block">Category</label>
              <select
                value={newTask.category}
                onChange={(e) => setNewTask({ ...newTask, category: e.target.value as TaskCategory })}
                className="dada-input"
              >
                <option value="chores">Chores</option>
                <option value="hygiene">Hygiene</option>
                <option value="learning">Learning</option>
                <option value="helping">Helping</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={handleAddTask} className="dada-button dada-button-success">
              <Check className="w-4 h-4 mr-2" />
              Save
            </button>
            <button 
              onClick={() => setShowAddForm(false)} 
              className="dada-button dada-button-secondary"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Add Strike Form */}
      {showStrikeForm && (
        <div className="dada-card bg-[#FFB8D0] p-6">
          <h3 className="card-title mb-2 text-[#1A1A2E]">Add Strike</h3>
          <p className="text-[#1A1A2E] font-bold mb-4">
            {(child.strikes || 0) >= MAX_STRIKES - 1 
              ? '⚠️ Next strike will forfeit all pending earnings!' 
              : `Strike ${(child.strikes || 0) + 1} of ${MAX_STRIKES}`}
          </p>
          <input
            type="text"
            value={strikeReason}
            onChange={(e) => setStrikeReason(e.target.value)}
            placeholder="Reason for strike..."
            className="dada-input mb-4"
          />
          <div className="flex gap-2">
            <button 
              onClick={handleAddStrike} 
              className="dada-button dada-button-danger"
              disabled={isProcessing}
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Add Strike
            </button>
            <button 
              onClick={() => setShowStrikeForm(false)} 
              className="dada-button dada-button-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Task List */}
      {isLoading ? (
        <div className="text-center py-8 text-white font-bold">Loading tasks...</div>
      ) : (
        <div className="grid gap-3">
          {tasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              childId={childId}
              canEarn={canEarn}
              onComplete={() => handleComplete(task.id, task.payout)}
              onUndo={() => handleUndo(task.id, task.payout)}
              onEdit={() => setEditingTask(task.id)}
              onDelete={async () => {
                await deleteTask(task.id);
                toast.success('Task deleted');
              }}
              onToggleActive={async () => {
                await updateTask(task.id, { is_active: !task.is_active });
                toast.success(task.is_active ? 'Task deactivated' : 'Task activated');
              }}
              isEditing={editingTask === task.id}
              onSaveEdit={async (updates) => {
                await updateTask(task.id, updates);
                setEditingTask(null);
                toast.success('Task updated');
              }}
              onCancelEdit={() => setEditingTask(null)}
              isProcessing={isProcessing}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Task Row Component
interface TaskRowProps {
  task: {
    id: string;
    name: string;
    icon: string;
    payout: number;
    daily_max: number;
    is_active: boolean;
  };
  childId?: string;
  canEarn: boolean;
  onComplete: () => void;
  onUndo: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleActive: () => void;
  isEditing: boolean;
  onSaveEdit: (updates: { name?: string; payout?: number; daily_max?: number }) => void;
  onCancelEdit: () => void;
  isProcessing: boolean;
}

function TaskRow({
  task,
  canEarn,
  onComplete,
  onUndo,
  onEdit,
  onDelete,
  onToggleActive,
  isEditing,
  onSaveEdit,
  onCancelEdit,
  isProcessing,
}: TaskRowProps) {
  const [editData, setEditData] = useState({
    name: task.name,
    payout: task.payout,
    daily_max: task.daily_max,
  });
  const completions = 0;

  if (isEditing) {
    return (
      <div className="dada-card bg-[#FFF6D6] p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <input
            type="text"
            value={editData.name}
            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
            className="dada-input"
          />
          <input
            type="number"
            value={editData.payout}
            onChange={(e) => setEditData({ ...editData, payout: parseInt(e.target.value) || 1 })}
            className="dada-input"
          />
          <input
            type="number"
            value={editData.daily_max}
            onChange={(e) => setEditData({ ...editData, daily_max: parseInt(e.target.value) || 1 })}
            className="dada-input"
          />
          <div className="flex gap-2">
            <button 
              onClick={() => onSaveEdit(editData)} 
              className="dada-button dada-button-success flex-1"
            >
              <Check className="w-4 h-4" />
            </button>
            <button 
              onClick={onCancelEdit} 
              className="dada-button dada-button-secondary flex-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  const progress = (completions / task.daily_max) * 100;
  const isMaxed = completions >= task.daily_max;

  return (
    <div className={`dada-card p-4 ${task.is_active ? 'bg-white' : 'bg-gray-100'}`}>
      <div className="flex items-center gap-3">
        {/* Icon */}
        <div className="text-3xl flex-shrink-0">{task.icon}</div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className={`font-black text-base truncate ${task.is_active ? 'text-[#1A1A2E]' : 'text-[#6B6B8C]'}`}>
              {task.name}
            </h4>
            {!task.is_active && (
              <span className="text-xs bg-[#6B6B8C] text-white px-2 py-0.5 rounded-full font-bold">
                INACTIVE
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 text-sm flex-wrap">
            <span className="font-bold text-[#15803d]">+{task.payout} DB</span>
            <span className="text-[#6B6B8C] font-bold">
              {completions}/{task.daily_max} today
            </span>
          </div>
          {/* Progress bar */}
          <div className="dada-progress mt-2 h-2">
            <div 
              className="dada-progress-fill h-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {/* Undo button */}
          {completions > 0 && (
            <button
              onClick={onUndo}
              disabled={isProcessing}
              className="w-9 h-9 rounded-lg bg-[#FFB8D0] border-[2px] border-[#1A1A2E] shadow-[0_2px_0_#1A1A2E] flex items-center justify-center active:translate-y-[2px] active:shadow-none transition-all"
            >
              <Minus className="w-4 h-4 text-[#1A1A2E]" />
            </button>
          )}

          {/* Complete button */}
          <button
            onClick={onComplete}
            disabled={!canEarn || isMaxed || !task.is_active || isProcessing}
            className={`w-11 h-11 rounded-xl border-[3px] border-[#1A1A2E] shadow-[0_3px_0_#1A1A2E] flex items-center justify-center transition-all ${
              canEarn && !isMaxed && task.is_active
                ? 'bg-[#B8FFC9] active:translate-y-[3px] active:shadow-none'
                : 'bg-gray-200 cursor-not-allowed'
            }`}
          >
            <Plus className="w-6 h-6 text-[#1A1A2E]" />
          </button>

          {/* Edit/Delete/Toggle buttons */}
          <div className="flex flex-col gap-1">
            <button
              onClick={onEdit}
              className="w-7 h-7 rounded-md bg-[#A6EFFF] border-[2px] border-[#1A1A2E] flex items-center justify-center"
              title="Edit"
            >
              <Edit2 className="w-3 h-3" />
            </button>
            <button
              onClick={onDelete}
              className="w-7 h-7 rounded-md bg-[#FFB8D0] border-[2px] border-[#1A1A2E] flex items-center justify-center"
              title="Delete"
            >
              <X className="w-3 h-3" />
            </button>
            <button
              onClick={onToggleActive}
              className="w-7 h-7 rounded-md bg-[#FFF6D6] border-[2px] border-[#1A1A2E] flex items-center justify-center"
              title="Toggle Active"
            >
              <Settings className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

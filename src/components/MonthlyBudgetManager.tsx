import React, { useState, useEffect, useRef } from 'react';
import { 
  Calendar, 
  Plus, 
  Trash2, 
  Copy, 
  Check, 
  ShieldCheck, 
  ShieldAlert,
  Flame,
  Droplets,
  Home,
  CreditCard,
  ShoppingBag,
  Zap,
  Wifi,
  Coffee,
  HeartPulse,
  Film,
  MoreHorizontal,
  X,
  PieChart,
  Target,
  TrendingDown,
  ArrowDownRight,
  Edit2,
  GraduationCap,
  Smartphone,
  Wrench,
  Car,
  GripVertical,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BudgetCategory } from '../types';

export const MonthlyBudgetManager: React.FC = () => {
  const { 
    selectedMonth, 
    getBudgetForMonth, 
    saveMonthBudget, 
    copyBudgetFromPreviousMonth,
    renameCategory,
    requestDeleteConfirm,
    showToast,
    dailyExpenses
  } = useApp();

  const currentDeclaration = getBudgetForMonth(selectedMonth);
  const [categories, setCategories] = useState<BudgetCategory[]>(currentDeclaration.categories);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Rename Category State
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editingCatName, setEditingCatName] = useState<string>('');

  // Drag-and-drop & Touch Long-Press Reordering State
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [touchDragIndex, setTouchDragIndex] = useState<number | null>(null);
  const [touchCurrentOverIndex, setTouchCurrentOverIndex] = useState<number | null>(null);

  const touchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const startYRef = useRef<number>(0);
  const isLongPressActiveRef = useRef<boolean>(false);

  const reorderCategory = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0 || fromIndex >= categories.length || toIndex >= categories.length) return;
    setCategories(prev => {
      const updated = [...prev];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      saveMonthBudget(selectedMonth, updated);
      return updated;
    });
  };

  const moveUp = (index: number) => {
    if (index > 0) reorderCategory(index, index - 1);
  };

  const moveDown = (index: number) => {
    if (index < categories.length - 1) reorderCategory(index, index + 1);
  };

  const handleTouchStart = (index: number, e: React.TouchEvent) => {
    const touch = e.touches[0];
    startYRef.current = touch.clientY;
    isLongPressActiveRef.current = false;

    touchTimerRef.current = setTimeout(() => {
      isLongPressActiveRef.current = true;
      setTouchDragIndex(index);
      setTouchCurrentOverIndex(index);
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(40);
      }
    }, 250);
  };

  const handleTouchMove = (_index: number, e: React.TouchEvent) => {
    const touch = e.touches[0];
    const deltaY = Math.abs(touch.clientY - startYRef.current);

    if (!isLongPressActiveRef.current) {
      if (deltaY > 8) {
        if (touchTimerRef.current) clearTimeout(touchTimerRef.current);
      }
      return;
    }

    if (e.cancelable) {
      e.preventDefault();
    }

    const clientY = touch.clientY;
    for (let i = 0; i < itemRefs.current.length; i++) {
      const el = itemRefs.current[i];
      if (el) {
        const rect = el.getBoundingClientRect();
        if (clientY >= rect.top && clientY <= rect.bottom) {
          setTouchCurrentOverIndex(i);
          break;
        }
      }
    }
  };

  const handleTouchEnd = () => {
    if (touchTimerRef.current) {
      clearTimeout(touchTimerRef.current);
      touchTimerRef.current = null;
    }

    if (isLongPressActiveRef.current && touchDragIndex !== null && touchCurrentOverIndex !== null) {
      if (touchDragIndex !== touchCurrentOverIndex) {
        reorderCategory(touchDragIndex, touchCurrentOverIndex);
      }
    }

    isLongPressActiveRef.current = false;
    setTouchDragIndex(null);
    setTouchCurrentOverIndex(null);
  };

  // New Category Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatAmount, setNewCatAmount] = useState<number | ''>('');
  const [newCatEssential, setNewCatEssential] = useState(true);

  useEffect(() => {
    const budget = getBudgetForMonth(selectedMonth);
    setCategories(budget.categories);
    setSaveSuccess(false);
  }, [selectedMonth]);

  const formatCurrency = (amt: number) => '₹' + amt.toLocaleString('en-IN');

  const monthExpenses = dailyExpenses.filter(e => e.date.startsWith(selectedMonth));
  const getSpentForCategory = (catId: string) => {
    return monthExpenses.filter(e => e.categoryId === catId).reduce((sum, e) => sum + e.amount, 0);
  };

  const handleAmountChange = (id: string, value: string) => {
    const clean = String(value).replace(/[^0-9.-]+/g, '');
    const num = clean === '' ? 0 : Number(clean);
    setCategories(prev => {
      const next = prev.map(c => c.id === id ? { ...c, budgetedAmount: num } : c);
      saveMonthBudget(selectedMonth, next);
      return next;
    });
  };

  const handleToggleEssential = (id: string) => {
    setCategories(prev => {
      const next = prev.map(c => c.id === id ? { ...c, isEssential: !c.isEssential } : c);
      saveMonthBudget(selectedMonth, next);
      return next;
    });
  };

  const handleDeleteCategory = (id: string, name?: string) => {
    setCategories(prev => {
      const next = prev.filter(c => c.id !== id);
      saveMonthBudget(selectedMonth, next);
      return next;
    });
    if (name) {
      showToast(`Category "${name}" deleted.`, 'error');
    }
  };

  const handleSave = () => {
    saveMonthBudget(selectedMonth, categories);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleCopyPrior = () => {
    copyBudgetFromPreviousMonth(selectedMonth);
    const updated = getBudgetForMonth(selectedMonth);
    setCategories(updated.categories);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim() || newCatAmount === '') return;

    const newCat: BudgetCategory = {
      id: 'cat-' + Date.now(),
      name: newCatName.trim(),
      budgetedAmount: Number(newCatAmount),
      isEssential: newCatEssential
    };

    const updated = [...categories, newCat];
    setCategories(updated);
    saveMonthBudget(selectedMonth, updated);

    setNewCatName('');
    setNewCatAmount('');
    setNewCatEssential(true);
    setIsAddModalOpen(false);
  };

  const handleSaveRename = (catId: string) => {
    const trimmed = editingCatName.trim();
    if (!trimmed) {
      setEditingCatId(null);
      return;
    }
    renameCategory(catId, trimmed);
    setCategories(prev => prev.map(c => c.id === catId ? { ...c, name: trimmed } : c));
    setEditingCatId(null);
  };

    const totalPlanned = categories.reduce((sum, c) => sum + (Number(c.budgetedAmount) || 0), 0);
  const totalActual = categories.reduce((sum, c) => sum + getSpentForCategory(c.id), 0);
  const totalDifference = totalPlanned - totalActual;

  const getCategoryIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('home') || n.includes('rent') || n.includes('flat')) return <Home className="w-4 h-4 text-amber-500" />;
    if (n.includes('fee') || n.includes('shivansh') || n.includes('school') || n.includes('college')) return <GraduationCap className="w-4 h-4 text-purple-500" />;
    if (n.includes('lic') || n.includes('insurance')) return <ShieldCheck className="w-4 h-4 text-teal-500" />;
    if (n.includes('recharge') || n.includes('mobile') || n.includes('phone')) return <Smartphone className="w-4 h-4 text-sky-500" />;
    if (n.includes('food') || n.includes('grocery') || n.includes('ration')) return <ShoppingBag className="w-4 h-4 text-emerald-500" />;
    if (n.includes('water')) return <Droplets className="w-4 h-4 text-cyan-500" />;
    if (n.includes('electric') || n.includes('bijli') || n.includes('power')) return <Zap className="w-4 h-4 text-yellow-500" />;
    if (n.includes('gas') || n.includes('lpg') || n.includes('fuel')) return <Flame className="w-4 h-4 text-rose-500" />;
    if (n.includes('medical') || n.includes('medicine') || n.includes('health') || n.includes('doctor')) return <HeartPulse className="w-4 h-4 text-red-500" />;
    if (n.includes('milk') || n.includes('dairy') || n.includes('doodh')) return <Coffee className="w-4 h-4 text-orange-500" />;
    if (n.includes('manti') || n.includes('maint') || n.includes('repair')) return <Wrench className="w-4 h-4 text-indigo-500" />;
    if (n.includes('traval') || n.includes('travel') || n.includes('petrol') || n.includes('diesel') || n.includes('car')) return <Car className="w-4 h-4 text-blue-500" />;
    if (n.includes('wifi') || n.includes('broadband') || n.includes('internet')) return <Wifi className="w-4 h-4 text-violet-500" />;
    if (n.includes('emi') || n.includes('loan')) return <CreditCard className="w-4 h-4 text-purple-500" />;
    if (n.includes('dining') || n.includes('entertainment')) return <Film className="w-4 h-4 text-pink-500" />;
    return <MoreHorizontal className="w-4 h-4 text-slate-400" />;
  };

  const getCategoryBg = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('home') || n.includes('rent')) return 'bg-amber-50 dark:bg-amber-950/40 border-amber-200/60 dark:border-amber-900/40';
    if (n.includes('fee') || n.includes('shivansh')) return 'bg-purple-50 dark:bg-purple-950/40 border-purple-200/60 dark:border-purple-900/40';
    if (n.includes('lic')) return 'bg-teal-50 dark:bg-teal-950/40 border-teal-200/60 dark:border-teal-900/40';
    if (n.includes('recharge')) return 'bg-sky-50 dark:bg-sky-950/40 border-sky-200/60 dark:border-sky-900/40';
    if (n.includes('food')) return 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/60 dark:border-emerald-900/40';
    if (n.includes('water')) return 'bg-cyan-50 dark:bg-cyan-950/40 border-cyan-200/60 dark:border-cyan-900/40';
    if (n.includes('electric')) return 'bg-yellow-50 dark:bg-yellow-950/40 border-yellow-200/60 dark:border-yellow-900/40';
    if (n.includes('gas')) return 'bg-rose-50 dark:bg-rose-950/40 border-rose-200/60 dark:border-rose-900/40';
    if (n.includes('medical')) return 'bg-red-50 dark:bg-red-950/40 border-red-200/60 dark:border-red-900/40';
    if (n.includes('milk')) return 'bg-orange-50 dark:bg-orange-950/40 border-orange-200/60 dark:border-orange-900/40';
    if (n.includes('manti') || n.includes('maint')) return 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200/60 dark:border-indigo-900/40';
    if (n.includes('traval') || n.includes('travel')) return 'bg-blue-50 dark:bg-blue-950/40 border-blue-200/60 dark:border-blue-900/40';
    if (n.includes('wifi')) return 'bg-violet-50 dark:bg-violet-950/40 border-violet-200/60 dark:border-violet-900/40';
    if (n.includes('emi') || n.includes('loan')) return 'bg-purple-50 dark:bg-purple-950/40 border-purple-200/60 dark:border-purple-900/40';
    return 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700';
  };

  return (
    <div className="space-y-4">
      {/* Top Banner (Compact) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              <PieChart className="w-3.5 h-3.5" />
            </span>
            <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Monthly Budget Declaration
            </h1>
            <span className="text-[11px] px-2 py-0.2 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/40 font-bold">
              {selectedMonth}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl">
            Declare your estimated expenditure (Rent, EMI, Food, Fuel). Auto-saves in real-time.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={handleCopyPrior}
            className="py-1.5 px-3 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1 border border-slate-200 dark:border-slate-700 transition"
            title="Copy declarations from previous month"
          >
            <Copy className="w-3 h-3 text-indigo-500" />
            <span>Copy Prior</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="py-1.5 px-3 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1 border border-slate-200 dark:border-slate-700 transition"
          >
            <Plus className="w-3 h-3 text-emerald-600" />
            <span>Add Category</span>
          </button>

          <button
            onClick={handleSave}
            className="py-1.5 px-3.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-bold rounded-xl flex items-center gap-1 transition shadow-xs"
          >
            {saveSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span>Saved!</span>
              </>
            ) : (
              <span>Save Budget</span>
            )}
          </button>
        </div>
      </div>

      {/* 3 Summary Tabs / Cards: Plan, Actual, Difference */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
        {/* Tab 1: Total Plan */}
        <div className="bg-gradient-to-br from-indigo-50/70 via-white to-slate-50 dark:from-indigo-950/20 dark:via-slate-900 dark:to-slate-900 border border-indigo-200/80 dark:border-indigo-900/40 rounded-2xl p-3.5 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide flex items-center gap-1">
              <Target className="w-3.5 h-3.5" />
              Total Plan ({selectedMonth})
            </span>
            <span className="text-[10px] bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold px-1.5 py-0.2 rounded-full">
              {categories.length} Categories
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {formatCurrency(totalPlanned)}
            <span className="text-xs font-normal text-slate-500 dark:text-slate-400 ml-1">/mo</span>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400">
            Declared monthly plan amount
          </p>
        </div>

        {/* Tab 2: Total Actual */}
        <div className="bg-gradient-to-br from-amber-50/70 via-white to-slate-50 dark:from-amber-950/20 dark:via-slate-900 dark:to-slate-900 border border-amber-200/80 dark:border-amber-900/40 rounded-2xl p-3.5 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wide flex items-center gap-1">
              <TrendingDown className="w-3.5 h-3.5" />
              Total Actual Spent
            </span>
            <span className="text-[10px] bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-bold px-1.5 py-0.2 rounded-full">
              {monthExpenses.length} Logged
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400 tracking-tight">
            {formatCurrency(totalActual)}
            <span className="text-xs font-normal text-slate-500 dark:text-slate-400 ml-1">/mo</span>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400">
            Real expenditure from Daily Expenses
          </p>
        </div>

        {/* Tab 3: Total Difference */}
        <div className={`bg-gradient-to-br rounded-2xl p-3.5 shadow-xs space-y-1 border ${
          totalDifference >= 0
            ? 'from-emerald-50/70 via-white to-slate-50 dark:from-emerald-950/20 dark:via-slate-900 dark:to-slate-900 border-emerald-200/80 dark:border-emerald-900/40'
            : 'from-rose-50/70 via-white to-slate-50 dark:from-rose-950/20 dark:via-slate-900 dark:to-slate-900 border-rose-200/80 dark:border-rose-900/40'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-bold uppercase tracking-wide flex items-center gap-1 ${
              totalDifference >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
            }`}>
              <ArrowDownRight className="w-3.5 h-3.5" />
              Total Difference
            </span>
            <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
              totalDifference >= 0
                ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
            }`}>
              {totalDifference >= 0 ? '✓ Remaining (बचत)' : '⚠ Over Budget (अधिक)'}
            </span>
          </div>
          <div className={`text-xl sm:text-2xl font-black tracking-tight ${
            totalDifference >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
          }`}>
            {totalDifference >= 0 ? '+' : ''}{formatCurrency(totalDifference)}
            <span className="text-xs font-normal text-slate-500 dark:text-slate-400 ml-1">
              {totalDifference >= 0 ? 'left' : 'over'}
            </span>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400">
            {totalDifference >= 0 ? 'Within planned expenditure' : `Exceeded plan by ${formatCurrency(Math.abs(totalDifference))}`}
          </p>
        </div>
      </div>

      {/* Modern Category List Editor Table (Compact) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-850">
          <div>
            <h2 className="font-extrabold text-slate-900 dark:text-white text-base">Category Allocations</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Only Plan Amount is editable. Actual Spent comes from Daily Expenses, and Difference is calculated automatically.
            </p>
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold self-start sm:self-center">
            {categories.length} Categories Declared
          </div>
        </div>

        {/* Desktop Table Column Headers for Plan, Actual, Difference */}
        <div className="hidden sm:flex items-center justify-between px-6 py-2.5 bg-slate-100/70 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          <div>Category Name</div>
          <div className="flex items-center gap-3 pr-10">
            <div className="w-32 text-right">Plan (Editable)</div>
            <div className="w-28 text-right">Actual Spent</div>
            <div className="w-28 text-right">Difference</div>
          </div>
        </div>
      <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
          {categories.map((cat, index) => {
            const spent = getSpentForCategory(cat.id);
            const planned = Number(cat.budgetedAmount) || 0;
            const diff = planned - spent;
            const utilization = planned > 0 
              ? Math.min(100, Math.round((spent / planned) * 100))
              : spent > 0 ? 100 : 0;
            const catBg = getCategoryBg(cat.name);

            const isBeingDragged = touchDragIndex === index || draggedIndex === index;
            const isTargetDrop = (dragOverIndex === index || touchCurrentOverIndex === index) && !isBeingDragged;

            return (
              <div 
                key={cat.id} 
                ref={el => itemRefs.current[index] = el}
                draggable={true}
                onDragStart={(e) => {
                  setDraggedIndex(index);
                  e.dataTransfer.effectAllowed = 'move';
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = 'move';
                  if (dragOverIndex !== index) {
                    setDragOverIndex(index);
                  }
                }}
                onDragEnd={() => {
                  setDraggedIndex(null);
                  setDragOverIndex(null);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  if (draggedIndex !== null && draggedIndex !== index) {
                    reorderCategory(draggedIndex, index);
                  }
                  setDraggedIndex(null);
                  setDragOverIndex(null);
                }}
                onTouchStart={(e) => handleTouchStart(index, e)}
                onTouchMove={(e) => handleTouchMove(index, e)}
                onTouchEnd={handleTouchEnd}
                onTouchCancel={handleTouchEnd}
                className={`p-3.5 sm:p-4 transition-all duration-150 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group relative select-none ${
                  isBeingDragged
                    ? 'scale-[1.02] shadow-2xl ring-2 ring-indigo-500 bg-indigo-50/90 dark:bg-indigo-950/80 z-30 opacity-95 rounded-2xl'
                    : isTargetDrop
                    ? 'bg-indigo-50/50 dark:bg-indigo-950/40 border-t-2 border-indigo-500'
                    : 'hover:bg-slate-50/70 dark:hover:bg-slate-800/40'
                }`}
              >
                {/* Left: Drag Handle, Category Icon, Name, and Essential Badge */}
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  {/* Long-Press & Drag Handle */}
                  <div className="flex items-center gap-0.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 shrink-0">
                    <div 
                      className="p-1 cursor-grab active:cursor-grabbing hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg touch-none"
                      title="Long press or drag to reorder"
                    >
                      <GripVertical className="w-4 h-4" />
                    </div>
                    {/* Quick Move Arrows for Touch */}
                    <div className="flex flex-col -space-y-1 sm:hidden">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={(e) => { e.stopPropagation(); moveUp(index); }}
                        className="p-0.5 text-slate-400 disabled:opacity-20 hover:text-indigo-600 disabled:hover:text-slate-400 cursor-pointer"
                        title="Move Up"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={index === categories.length - 1}
                        onClick={(e) => { e.stopPropagation(); moveDown(index); }}
                        className="p-0.5 text-slate-400 disabled:opacity-20 hover:text-indigo-600 disabled:hover:text-slate-400 cursor-pointer"
                        title="Move Down"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${catBg}`}>
                    {getCategoryIcon(cat.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    {editingCatId === cat.id ? (
                      <div className="flex items-center gap-1.5 my-0.5">
                        <input
                          type="text"
                          value={editingCatName}
                          onChange={(e) => setEditingCatName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveRename(cat.id);
                            if (e.key === 'Escape') setEditingCatId(null);
                          }}
                          autoFocus
                          className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-800 border border-indigo-500 rounded-lg px-2 py-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 max-w-[200px]"
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveRename(cat.id)}
                          className="p-1 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-800 rounded-md transition"
                          title="Save Name"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingCatId(null)}
                          className="p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition"
                          title="Cancel"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 group/edit">
                        <h3 className="font-bold text-slate-900 dark:text-white text-sm truncate">
                          {cat.name}
                        </h3>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingCatId(cat.id);
                            setEditingCatName(cat.name);
                          }}
                          className="opacity-70 group-hover:opacity-100 p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                          title="Rename Category"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <button
                        type="button"
                        onClick={() => handleToggleEssential(cat.id)}
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full transition flex items-center gap-1 cursor-pointer ${
                          cat.isEssential 
                            ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40' 
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:text-slate-800'
                        }`}
                      >
                        {cat.isEssential ? '✓ Essential' : 'Optional'}
                      </button>

                      {planned > 0 && (
                        <span className="text-[10px] text-slate-400 font-medium">
                          {((planned / (totalPlanned || 1)) * 100).toFixed(0)}% of plan
                        </span>
                      )}
                    </div>

                    {/* Category burn mini bar */}
                    {planned > 0 && (
                      <div className="w-32 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-300 ${
                            utilization > 100 ? 'bg-rose-500' : utilization > 80 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${utilization}%` }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Mobile-only delete button */}
                  <div className="sm:hidden shrink-0">
                    <button
                      onClick={() => {
                        requestDeleteConfirm({
                          title: 'Delete Budget Category',
                          message: `Are you sure you want to delete category "${cat.name}"?`,
                          onConfirm: () => handleDeleteCategory(cat.id, cat.name)
                        });
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-500 rounded-xl hover:bg-rose-50 dark:hover:bg-slate-800 transition"
                      title="Remove Category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Mobile View: 3 Boxes side-by-side (Plan, Actual, Difference) */}
                <div className="grid grid-cols-3 gap-2 mt-1 sm:hidden w-full pt-2 border-t border-slate-100 dark:border-slate-800/60">
                  {/* Plan (Editable) */}
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide block mb-1">Plan (Edit)</span>
                    <div className="relative">
                      <span className="absolute left-2 top-2 text-xs font-bold text-slate-400">₹</span>
                      <input
                        type="number"
                        min={0}
                        value={cat.budgetedAmount === 0 ? '' : cat.budgetedAmount}
                        onChange={(e) => handleAmountChange(cat.id, e.target.value)}
                        placeholder="0"
                        className="w-full pl-5 pr-2 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white text-right focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Actual Spent (Read-only) */}
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide block mb-1">Actual</span>
                    <div className="px-2 py-1.5 bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 text-right truncate">
                      {formatCurrency(spent)}
                    </div>
                  </div>

                  {/* Difference (Read-only) */}
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide block mb-1">Diff</span>
                    <div className={`px-2 py-1.5 border rounded-xl text-xs font-black text-right truncate ${
                      diff >= 0 
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/80 dark:border-emerald-800/40 text-emerald-600 dark:text-emerald-400' 
                        : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200/80 dark:border-rose-800/40 text-rose-600 dark:text-rose-400'
                    }`}>
                      {diff >= 0 ? `+${formatCurrency(diff)}` : `-${formatCurrency(Math.abs(diff))}`}
                    </div>
                  </div>
                </div>

                {/* Desktop View: Plan Input, Actual Spent, Difference & Delete Action */}
                <div className="hidden sm:flex items-center gap-3 self-end sm:self-center shrink-0">
                  {/* Plan (Editable) */}
                  <div className="relative w-32">
                    <span className="absolute left-2.5 top-2 text-xs font-bold text-slate-400">₹</span>
                    <input
                      type="number"
                      min={0}
                      value={cat.budgetedAmount === 0 ? '' : cat.budgetedAmount}
                      onChange={(e) => handleAmountChange(cat.id, e.target.value)}
                      placeholder="0"
                      className="w-full pl-6 pr-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-bold text-slate-900 dark:text-white text-right focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
                      title="Editable monthly planned budget"
                    />
                  </div>

                  {/* Actual Spent (Read-only) */}
                  <div 
                    className="w-28 px-2.5 py-1.5 bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 text-right cursor-not-allowed select-none"
                    title="Actual expenses logged for this category"
                  >
                    {formatCurrency(spent)}
                  </div>

                  {/* Difference (Read-only) */}
                  <div 
                    className={`w-28 px-2.5 py-1.5 border rounded-xl text-xs sm:text-sm font-black text-right cursor-not-allowed select-none ${
                      diff >= 0 
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/80 dark:border-emerald-800/40 text-emerald-600 dark:text-emerald-400' 
                        : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200/80 dark:border-rose-800/40 text-rose-600 dark:text-rose-400'
                    }`}
                    title={diff >= 0 ? `Remaining: ${formatCurrency(diff)}` : `Over budget by: ${formatCurrency(Math.abs(diff))}`}
                  >
                    {diff >= 0 ? `+${formatCurrency(diff)}` : `-${formatCurrency(Math.abs(diff))}`}
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => {
                      requestDeleteConfirm({
                        title: 'Delete Budget Category',
                        message: `Are you sure you want to delete category "${cat.name}"?`,
                        onConfirm: () => handleDeleteCategory(cat.id, cat.name)
                      });
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-500 rounded-xl hover:bg-rose-50 dark:hover:bg-slate-800 transition cursor-pointer"
                    title="Remove Category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Save Bar */}
        <div className="p-4 bg-slate-50/50 dark:bg-slate-850 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Changes auto-save instantly as you type.
          </span>
          <button
            onClick={handleSave}
            className="py-2.5 px-5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-bold rounded-2xl flex items-center gap-1.5 transition shadow-md shadow-emerald-600/20 cursor-pointer"
          >
            {saveSuccess ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>Saved!</span>
              </>
            ) : (
              <span>Save Budget</span>
            )}
          </button>
        </div>
      </div>

      {/* Add Custom Category Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-800 dark:hover:text-white p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-200/80 dark:border-indigo-800/40">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Add Budget Category</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Create a personalized monthly allocation</p>
              </div>
            </div>

            <form onSubmit={handleAddCategory} className="space-y-4 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Category Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="e.g. Children School Fee, Pet Food, Gym"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Monthly Budget Allocation (₹) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold text-sm">₹</span>
                  <input
                    type="number"
                    required
                    min={0}
                    value={newCatAmount}
                    onChange={(e) => setNewCatAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="3,000"
                    className="w-full pl-8 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-white block">Essential Survival Need</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Uncheck if this is optional/discretionary</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={newCatEssential} 
                    onChange={(e) => setNewCatEssential(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-bold rounded-xl transition shadow-md shadow-indigo-600/20"
                >
                  Add Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

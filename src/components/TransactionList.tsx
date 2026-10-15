import React, { useState, useMemo } from 'react';
import {
  Search,
  Edit2,
  Trash2,
  Inbox,
  AlertTriangle,
  Plus,
} from 'lucide-react';
import { Language, Transaction, TransactionType } from '../types';
import { getCategoryById } from '../utils/categories';
import { CategoryIcon } from './CategoryIcon';
import {
  formatCurrency,
  formatDateReadable,
  formatTime12h,
  toBengaliDigits,
} from '../utils/formatters';

interface TransactionListProps {
  language: Language;
  selectedMonth: string;
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  onDeleteAll: () => void;
  onOpenNewTransaction: () => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  language,
  selectedMonth,
  transactions,
  onEdit,
  onDelete,
  onDeleteAll,
  onOpenNewTransaction,
}) => {
  const isBn = language === 'bn';

  const [filterType, setFilterType] = useState<'all' | TransactionType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'amount_high' | 'amount_low'>('date_desc');

  // Inline delete confirmation state (avoids window.confirm in iframe)
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);

  // Filter transactions for selected month
  const monthTransactions = useMemo(() => {
    return transactions.filter((t) => t.date.startsWith(selectedMonth));
  }, [transactions, selectedMonth]);

  // Apply search, type and category filters
  const filteredList = useMemo(() => {
    return monthTransactions
      .filter((t) => {
        if (filterType !== 'all' && t.type !== filterType) return false;
        if (selectedCategory !== 'all' && t.category !== selectedCategory) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = t.title.toLowerCase().includes(q);
          const matchNotes = t.notes?.toLowerCase().includes(q) || false;
          const cat = getCategoryById(t.category);
          const matchCat =
            cat.nameBn.toLowerCase().includes(q) || cat.nameEn.toLowerCase().includes(q);
          if (!matchTitle && !matchNotes && !matchCat) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'date_desc') return b.date.localeCompare(a.date) || b.createdAt - a.createdAt;
        if (sortBy === 'date_asc') return a.date.localeCompare(b.date) || a.createdAt - b.createdAt;
        if (sortBy === 'amount_high') return b.amount - a.amount;
        if (sortBy === 'amount_low') return a.amount - b.amount;
        return 0;
      });
  }, [monthTransactions, filterType, selectedCategory, searchQuery, sortBy]);

  // Get unique categories in this month's transactions
  const presentCategoryIds = useMemo(() => {
    const set = new Set<string>();
    monthTransactions.forEach((t) => set.add(t.category));
    return Array.from(set);
  }, [monthTransactions]);

  const confirmDelete = (id: string) => {
    onDelete(id);
    setDeletingId(null);
  };

  const confirmDeleteAll = () => {
    onDeleteAll();
    setShowDeleteAllConfirm(false);
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
      {/* Table / List Header Controls */}
      <div className="p-4 border-b border-slate-100 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900">
              {isBn ? 'দৈনিক খরচের তালিকা ও ভাউচার' : 'Daily Transaction Ledger'}
            </h3>
            <span className="text-xs text-slate-400 font-mono-num">
              ({isBn ? toBengaliDigits(filteredList.length) : filteredList.length})
            </span>

            {monthTransactions.length > 0 && (
              <button
                onClick={() => setShowDeleteAllConfirm(true)}
                className="ml-2 text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2 py-0.5 rounded-md transition-colors"
                title={isBn ? 'এই মাসের সব হিসাব মুছুন' : 'Delete all transactions'}
              >
                {isBn ? 'সব মুছুন' : 'Delete All'}
              </button>
            )}
          </div>

          {/* Segmented Filter: All / Expense / Money from home */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                filterType === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isBn ? 'সব লেনদেন' : 'All'}
            </button>
            <button
              onClick={() => setFilterType('expense')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                filterType === 'expense'
                  ? 'bg-white text-rose-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isBn ? 'শুধুমাত্র খরচ' : 'Expenses'}
            </button>
            <button
              onClick={() => setFilterType('income')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                filterType === 'income'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isBn ? 'বাসা থেকে টাকা' : 'From Home'}
            </button>
          </div>
        </div>

        {/* Search, Category, and Sort Row */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 pt-1">
          {/* Search bar */}
          <div className="sm:col-span-5 relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isBn ? 'খরচের বিবরণ বা খাত খুঁজুন...' : 'Search description or category...'}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white"
            />
          </div>

          {/* Category filter */}
          <div className="sm:col-span-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-700"
            >
              <option value="all">{isBn ? 'সব ক্যাটেগরি' : 'All Categories'}</option>
              {presentCategoryIds.map((catId) => {
                const cat = getCategoryById(catId);
                return (
                  <option key={cat.id} value={cat.id}>
                    {isBn ? cat.nameBn : cat.nameEn}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Sort order */}
          <div className="sm:col-span-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-700"
            >
              <option value="date_desc">{isBn ? 'তারিখ (নতুন আগে)' : 'Date: Newest'}</option>
              <option value="date_asc">{isBn ? 'তারিখ (পুরোনো আগে)' : 'Date: Oldest'}</option>
              <option value="amount_high">{isBn ? 'টাকা (বেশি থেকে কম)' : 'Amount: High to Low'}</option>
              <option value="amount_low">{isBn ? 'টাকা (কম থেকে বেশি)' : 'Amount: Low to High'}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Delete All In-App Confirmation Modal */}
      {showDeleteAllConfirm && (
        <div className="p-4 bg-red-50 border-b border-red-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2 text-xs font-semibold text-red-800">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span>
              {isBn
                ? 'আপনি কি নিশ্চিত যে এই মাসের সকল হিসাব সম্পূর্ণ মুছে ফেলবেন?'
                : 'Are you sure you want to delete all entries for this month?'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDeleteAllConfirm(false)}
              className="px-3 py-1 text-xs font-medium bg-white text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-100"
            >
              {isBn ? 'না, বাতিল' : 'Cancel'}
            </button>
            <button
              onClick={confirmDeleteAll}
              className="px-3 py-1 text-xs font-bold bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-xs"
            >
              {isBn ? 'হ্যাঁ, সব ডিলিট করুন' : 'Yes, Delete All'}
            </button>
          </div>
        </div>
      )}

      {/* Transaction List Items */}
      {filteredList.length === 0 ? (
        <div className="py-16 px-4 text-center">
          <Inbox className="w-10 h-10 mx-auto text-slate-300 mb-2" />
          <p className="text-sm font-bold text-slate-800">
            {isBn ? 'বর্তমানে কোনো খরচের হিসাব নেই' : 'No transactions recorded yet'}
          </p>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {searchQuery || selectedCategory !== 'all' || filterType !== 'all'
              ? isBn
                ? 'ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন'
                : 'Try clearing your filters or search'
              : isBn
              ? 'আপনার প্রতিদিনের খরচ কিংবা বাসা থেকে পাওয়া টাকা লিখে রাখতে নিচের বাটনে চাপ দিন'
              : 'Click below to log your first daily expense or allowance'}
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <button
              onClick={onOpenNewTransaction}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>{isBn ? 'প্রথম খরচ যোগ করুন' : 'Add First Entry'}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {filteredList.map((t) => {
            const isIncome = t.type === 'income';
            const cat = getCategoryById(t.category);
            const isConfirmingThis = deletingId === t.id;

            return (
              <div
                key={t.id}
                className="p-3.5 sm:px-5 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                {/* Left: Category Icon + Title + Meta */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: cat.bgLight, color: cat.color }}
                  >
                    <CategoryIcon name={cat.iconName} className="w-4 h-4" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-semibold text-slate-900 truncate">
                        {t.title}
                      </span>
                    </div>

                    {/* Metadata text without pill boxes */}
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                      <span className="text-slate-700 font-medium">
                        {isBn ? cat.nameBn : cat.nameEn}
                      </span>
                      <span className="text-slate-300">·</span>
                      <span>{formatDateReadable(t.date, language)}</span>
                      {t.time && (
                        <>
                          <span className="text-slate-300">·</span>
                          <span>{formatTime12h(t.time, language)}</span>
                        </>
                      )}
                      {t.paymentMethod && (
                        <>
                          <span className="text-slate-300">·</span>
                          <span className="text-slate-600">{t.paymentMethod}</span>
                        </>
                      )}
                      {t.notes && (
                        <>
                          <span className="text-slate-300">·</span>
                          <span className="text-slate-400 italic truncate max-w-[150px]">
                            {t.notes}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Amount & Action buttons */}
                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                  <div className="text-left sm:text-right">
                    <div
                      className={`text-sm sm:text-base font-bold font-mono-num flex items-center justify-start sm:justify-end gap-0.5 ${
                        isIncome ? 'text-emerald-700' : 'text-slate-900'
                      }`}
                    >
                      <span>{isIncome ? '+' : '-'}</span>
                      <span>{formatCurrency(t.amount, language)}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                      {isIncome ? (isBn ? 'প্রাপ্তি' : 'Received') : (isBn ? 'খরচ' : 'Expense')}
                    </span>
                  </div>

                  {/* Inline Delete Confirmation or Action Buttons */}
                  {isConfirmingThis ? (
                    <div className="flex items-center gap-1.5 bg-red-50 p-1 rounded-lg border border-red-200">
                      <span className="text-[11px] text-red-700 font-semibold px-1">
                        {isBn ? 'মুছবেন?' : 'Delete?'}
                      </span>
                      <button
                        onClick={() => confirmDelete(t.id)}
                        className="px-2 py-0.5 text-xs font-bold bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        {isBn ? 'হ্যাঁ' : 'Yes'}
                      </button>
                      <button
                        onClick={() => setDeletingId(null)}
                        className="px-2 py-0.5 text-xs font-medium bg-slate-200 text-slate-700 rounded hover:bg-slate-300"
                      >
                        {isBn ? 'না' : 'No'}
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEdit(t)}
                        className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                        title={isBn ? 'সম্পাদনা করুন' : 'Edit'}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeletingId(t.id)}
                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        title={isBn ? 'মুছে ফেলুন' : 'Delete'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

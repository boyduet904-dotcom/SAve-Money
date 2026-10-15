import React from 'react';
import { Plus, ArrowDownLeft } from 'lucide-react';
import { Language } from '../types';

interface QuickAddBarProps {
  language: Language;
  onOpenIncomeModal: () => void;
  onOpenExpenseModal: () => void;
}

export const QuickAddBar: React.FC<QuickAddBarProps> = ({
  language,
  onOpenIncomeModal,
  onOpenExpenseModal,
}) => {
  const isBn = language === 'bn';

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-slate-900">
            {isBn ? 'দৈনিক হিসাব এন্ট্রি' : 'Daily Record'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {isBn
              ? 'আপনার প্রতিদিনের খরচ কিংবা বাসা থেকে পাওয়া টাকা লিখে রাখুন'
              : 'Log your daily expenditures or money received from home'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenIncomeModal}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-300 transition-colors whitespace-nowrap shadow-xs"
          >
            <ArrowDownLeft className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
            <span>{isBn ? 'বাসা থেকে টাকা এড' : 'Add Home Money'}</span>
          </button>

          <button
            onClick={onOpenExpenseModal}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors whitespace-nowrap shadow-xs"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>{isBn ? 'খরচের টাকা এন্ট্রি' : 'Add Expense'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

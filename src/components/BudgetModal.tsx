import React, { useState } from 'react';
import { Target, X, Check, Trash2, AlertCircle } from 'lucide-react';
import { Language } from '../types';
import { formatCurrency, formatMonthName, toBengaliDigits } from '../utils/formatters';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMonth: string;
  currentBudget: number;
  totalExpenseSoFar: number;
  language: Language;
  onSaveBudget: (month: string, amount: number) => void;
}

export const BudgetModal: React.FC<BudgetModalProps> = ({
  isOpen,
  onClose,
  selectedMonth,
  currentBudget,
  totalExpenseSoFar,
  language,
  onSaveBudget,
}) => {
  const [amountStr, setAmountStr] = useState<string>(
    currentBudget > 0 ? currentBudget.toString() : ''
  );
  const isBn = language === 'bn';

  if (!isOpen) return null;

  const quickPresets = [5000, 8000, 10000, 12000, 15000, 20000];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(amountStr) || 0;
    onSaveBudget(selectedMonth, Math.max(0, amount));
    onClose();
  };

  const handleRemove = () => {
    onSaveBudget(selectedMonth, 0);
    onClose();
  };

  const numericAmount = parseFloat(amountStr) || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Target className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {isBn ? 'মাসিক বাজেট সীমা সেট করুন' : 'Set Monthly Budget'}
              </h3>
              <p className="text-xs text-slate-500">
                {formatMonthName(selectedMonth, language)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-5 space-y-4">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-600 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p>
              {isBn
                ? 'এই মাসের খরচের একটি সর্বোচ্চ সীমা ঠিক করে রাখুন। এতে সারা মাস ধরে খরচ নিয়ন্ত্রণের মধ্যে রাখা সহজ হবে।'
                : 'Set an upper expense threshold for this month. The tracker will monitor your burn rate and alert you when you approach the limit.'}
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {isBn ? 'বাজেট পরিমাণ (টাকা)' : 'Budget Amount (BDT)'}
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-base">
                ৳
              </span>
              <input
                type="number"
                min="0"
                step="100"
                required
                value={amountStr}
                onChange={(e) => setAmountStr(e.target.value)}
                placeholder="যেমন: 10000"
                className="w-full pl-8 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-base font-bold text-slate-900 font-mono-num focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                autoFocus
              />
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
              {isBn ? 'সাধারণ বাজেট সাইজ' : 'Quick Presets'}
            </span>
            <div className="grid grid-cols-3 gap-2">
              {quickPresets.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setAmountStr(val.toString())}
                  className={`py-1.5 px-2 text-xs font-medium rounded-lg border transition-all text-center font-mono-num ${
                    numericAmount === val
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {formatCurrency(val, language)}
                </button>
              ))}
            </div>
          </div>

          {totalExpenseSoFar > 0 && numericAmount > 0 && (
            <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl text-xs space-y-1 text-slate-700">
              <div className="flex justify-between">
                <span>{isBn ? 'চলতি মাসে ইতোমধ্যে খরচ:' : 'Spent so far:'}</span>
                <strong className="font-mono-num text-slate-900">
                  {formatCurrency(totalExpenseSoFar, language)}
                </strong>
              </div>
              <div className="flex justify-between">
                <span>{isBn ? 'প্রস্তাবিত বাজেটে অবশিষ্ট থাকবে:' : 'Remaining capacity:'}</span>
                <strong
                  className={`font-mono-num ${
                    numericAmount - totalExpenseSoFar >= 0 ? 'text-emerald-700' : 'text-red-600'
                  }`}
                >
                  {formatCurrency(numericAmount - totalExpenseSoFar, language)}
                </strong>
              </div>
            </div>
          )}

          <div className="pt-2 flex items-center justify-between gap-3">
            {currentBudget > 0 ? (
              <button
                type="button"
                onClick={handleRemove}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl border border-red-200 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isBn ? 'বাজেট মুছে ফেলুন' : 'Remove Budget'}</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
              >
                {isBn ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors"
              >
                <Check className="w-4 h-4" />
                <span>{isBn ? 'সংরক্ষণ করুন' : 'Save Budget'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

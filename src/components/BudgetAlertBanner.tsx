import React from 'react';
import { AlertTriangle, AlertOctagon, CheckCircle2, X } from 'lucide-react';
import { Language } from '../types';
import { formatCurrency, toBengaliDigits } from '../utils/formatters';

interface BudgetAlertBannerProps {
  language: Language;
  monthlyBudget: number;
  totalExpense: number;
  onOpenBudgetModal: () => void;
}

export const BudgetAlertBanner: React.FC<BudgetAlertBannerProps> = ({
  language,
  monthlyBudget,
  totalExpense,
  onOpenBudgetModal,
}) => {
  const isBn = language === 'bn';

  if (!monthlyBudget || monthlyBudget <= 0) return null;

  const percent = Math.round((totalExpense / monthlyBudget) * 100);
  const remaining = monthlyBudget - totalExpense;

  if (percent < 80) {
    return null; // Don't clutter if comfortably within budget
  }

  const isOver = totalExpense > monthlyBudget;

  return (
    <div
      className={`rounded-xl p-3.5 mb-6 border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
        isOver
          ? 'bg-red-50/90 border-red-200 text-red-900'
          : 'bg-amber-50/90 border-amber-200 text-amber-900'
      }`}
    >
      <div className="flex items-start sm:items-center gap-3">
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
            isOver ? 'bg-red-200/80 text-red-700' : 'bg-amber-200/80 text-amber-700'
          }`}
        >
          {isOver ? <AlertOctagon className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
        </div>
        <div>
          <div className="text-xs font-bold">
            {isOver
              ? isBn
                ? 'সতর্কতা: মাসিক বাজেট সীমা অতিক্রম করেছে!'
                : 'Alert: Monthly budget limit exceeded!'
              : isBn
              ? `সাবধানতা: মাসিক বাজেটের ${toBengaliDigits(percent)}% খরচ হয়ে গেছে!`
              : `Warning: ${percent}% of monthly budget already spent!`}
          </div>
          <div className="text-[11px] opacity-90 font-mono-num mt-0.5">
            {isOver
              ? isBn
                ? `বাজেট ছিল ${formatCurrency(monthlyBudget, language)}, মোট খরচ হয়েছে ${formatCurrency(
                    totalExpense,
                    language
                  )} (অতিরিক্ত: ${formatCurrency(totalExpense - monthlyBudget, language)})`
                : `Budget was ${formatCurrency(monthlyBudget, language)}, total spend is ${formatCurrency(
                    totalExpense,
                    language
                  )}`
              : isBn
              ? `বাজেটের মধ্যে আর মাত্র ${formatCurrency(remaining, language)} খরচ করা যাবে।`
              : `Remaining budget allowance: ${formatCurrency(remaining, language)}`}
          </div>
        </div>
      </div>

      <div className="shrink-0 flex items-center gap-2">
        <button
          onClick={onOpenBudgetModal}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shadow-xs ${
            isOver
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-amber-600 hover:bg-amber-700 text-white'
          }`}
        >
          {isBn ? 'বাজেট সীমা বাড়ান' : 'Adjust Budget'}
        </button>
      </div>
    </div>
  );
};

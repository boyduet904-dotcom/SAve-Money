import React from 'react';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Wallet,
  Target,
  Edit2,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
} from 'lucide-react';
import { Language } from '../types';
import { formatCurrency, toBengaliDigits } from '../utils/formatters';

interface SummaryCardsProps {
  language: Language;
  totalIncome: number;
  totalExpense: number;
  incomeCount: number;
  expenseCount: number;
  monthlyBudget: number;
  daysPassedInMonth: number;
  daysInMonth: number;
  onOpenBudgetModal: () => void;
  onOpenIncomeModal: () => void;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  language,
  totalIncome,
  totalExpense,
  incomeCount,
  expenseCount,
  monthlyBudget,
  daysPassedInMonth,
  daysInMonth,
  onOpenBudgetModal,
  onOpenIncomeModal,
}) => {
  const isBn = language === 'bn';

  const balance = totalIncome - totalExpense;
  const isPositiveBalance = balance >= 0;

  // Budget calculations
  const hasBudget = monthlyBudget > 0;
  const budgetPercentage = hasBudget ? Math.min(Math.round((totalExpense / monthlyBudget) * 100), 200) : 0;
  const remainingBudget = monthlyBudget - totalExpense;
  const isOverBudget = hasBudget && totalExpense > monthlyBudget;
  const isNearBudget = hasBudget && budgetPercentage >= 80 && !isOverBudget;

  const avgDailySpend = daysPassedInMonth > 0 ? Math.round(totalExpense / daysPassedInMonth) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* 1. Money from Home (Income) */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs relative overflow-hidden flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {isBn ? 'বাসা থেকে প্রাপ্ত টাকা' : 'Money from Home'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ArrowDownLeft className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono-num">
            {formatCurrency(totalIncome, language)}
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>
            {isBn
              ? `${toBengaliDigits(incomeCount)} টি এন্ট্রি`
              : `${incomeCount} transfers`}
          </span>
          <button
            onClick={onOpenIncomeModal}
            className="text-emerald-700 hover:text-emerald-800 font-semibold text-xs flex items-center gap-1 hover:underline"
          >
            <span>{isBn ? '+ টাকা এড' : '+ Add'}</span>
          </button>
        </div>
      </div>

      {/* 2. Total Expenses */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {isBn ? 'মাসের মোট খরচ' : 'Total Expense'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono-num">
            {formatCurrency(totalExpense, language)}
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>
            {isBn
              ? `${toBengaliDigits(expenseCount)} টি খরচ`
              : `${expenseCount} entries`}
          </span>
          <span className="text-slate-600 font-mono-num">
            {isBn ? 'দৈনিক গড়: ' : 'Daily avg: '}
            <strong className="text-slate-900">{formatCurrency(avgDailySpend, language)}</strong>
          </span>
        </div>
      </div>

      {/* 3. Net Balance / Remaining Money */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {isBn ? 'বর্তমান স্থিতি (ব্যালেন্স)' : 'Net Cash Balance'}
            </span>
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                isPositiveBalance ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'
              }`}
            >
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div
            className={`text-2xl font-bold font-mono-num ${
              isPositiveBalance ? 'text-slate-900' : 'text-red-600'
            }`}
          >
            {formatCurrency(balance, language)}
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className={isPositiveBalance ? 'text-emerald-700 font-medium' : 'text-red-700 font-medium'}>
            {isPositiveBalance
              ? isBn
                ? 'অবশিষ্ট টাকা সঞ্চয় আছে'
                : 'Surplus in hand'
              : isBn
                ? 'ঘাটতি (খরচ আয়ের বেশি)'
                : 'Deficit'}
          </span>
          <span className="text-slate-400 font-mono-num">
            {daysPassedInMonth}/{daysInMonth} {isBn ? 'দিন' : 'days'}
          </span>
        </div>
      </div>

      {/* 4. Monthly Budget Limit */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {isBn ? 'মাসিক বাজেট সীমা' : 'Monthly Budget'}
              </span>
              <button
                onClick={onOpenBudgetModal}
                className="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100 transition-colors"
                title={isBn ? 'বাজেট সীমা পরিবর্তন করুন' : 'Edit Budget'}
              >
                <Edit2 className="w-3 h-3" />
              </button>
            </div>
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                isOverBudget
                  ? 'bg-red-50 text-red-600'
                  : isNearBudget
                  ? 'bg-amber-50 text-amber-600'
                  : 'bg-emerald-50 text-emerald-600'
              }`}
            >
              <Target className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold text-slate-900 font-mono-num">
              {hasBudget ? formatCurrency(monthlyBudget, language) : isBn ? 'বাজেট নেই' : 'No Budget'}
            </div>
            {hasBudget && (
              <span
                className={`text-xs font-bold font-mono-num px-1.5 py-0.5 rounded ${
                  isOverBudget
                    ? 'bg-red-100 text-red-800'
                    : isNearBudget
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {isBn ? `${toBengaliDigits(budgetPercentage)}%` : `${budgetPercentage}%`}
              </span>
            )}
          </div>
        </div>

        {hasBudget ? (
          <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5">
            {/* Progress bar */}
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  isOverBudget
                    ? 'bg-red-600'
                    : isNearBudget
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 font-mono-num">
              <span>
                {isOverBudget
                  ? isBn
                    ? 'বাজেট অতিরিক্ত:'
                    : 'Over by:'
                  : isBn
                  ? 'বাজেট বাকি আছে:'
                  : 'Remaining:'}
              </span>
              <strong
                className={
                  isOverBudget
                    ? 'text-red-600'
                    : isNearBudget
                    ? 'text-amber-700'
                    : 'text-emerald-700'
                }
              >
                {formatCurrency(Math.abs(remainingBudget), language)}
              </strong>
            </div>
          </div>
        ) : (
          <div className="mt-3 pt-3 border-t border-slate-100">
            <button
              onClick={onOpenBudgetModal}
              className="w-full py-1 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg text-center transition-colors"
            >
              {isBn ? 'বাজেট সীমা নির্ধারণ করুন' : 'Set Budget Limit'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

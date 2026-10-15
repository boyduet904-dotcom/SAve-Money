import React from 'react';
import {
  PieChart,
  CalendarDays,
  TrendingUp,
  AlertCircle,
  Award,
  ArrowRight,
} from 'lucide-react';
import { Language, Transaction } from '../types';
import { getCategoryById } from '../utils/categories';
import { CategoryIcon } from './CategoryIcon';
import {
  formatCurrency,
  formatDateReadable,
  formatMonthName,
  toBengaliDigits,
} from '../utils/formatters';

interface MonthlyAnalyticsProps {
  language: Language;
  selectedMonth: string;
  transactions: Transaction[];
  monthlyBudget: number;
  onOpenReportModal: () => void;
}

export const MonthlyAnalytics: React.FC<MonthlyAnalyticsProps> = ({
  language,
  selectedMonth,
  transactions,
  monthlyBudget,
  onOpenReportModal,
}) => {
  const isBn = language === 'bn';

  // Filter transactions for this month
  const monthTransactions = transactions.filter((t) => t.date.startsWith(selectedMonth));
  const expenseTransactions = monthTransactions.filter((t) => t.type === 'expense');
  const incomeTransactions = monthTransactions.filter((t) => t.type === 'income');

  const totalExpense = expenseTransactions.reduce((acc, t) => acc + t.amount, 0);
  const totalIncome = incomeTransactions.reduce((acc, t) => acc + t.amount, 0);
  const netSavings = totalIncome - totalExpense;

  // Category breakdown calculation
  const categoryTotals: Record<string, number> = {};
  expenseTransactions.forEach((t) => {
    categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
  });

  const sortedCategories = Object.entries(categoryTotals)
    .map(([catId, amount]) => ({
      category: getCategoryById(catId),
      amount,
      percentage: totalExpense > 0 ? Math.round((amount / totalExpense) * 100) : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  // Daily spend timeline calculation
  const dailySpendMap: Record<string, number> = {};
  expenseTransactions.forEach((t) => {
    dailySpendMap[t.date] = (dailySpendMap[t.date] || 0) + t.amount;
  });

  const daysWithSpend = Object.entries(dailySpendMap).sort(([d1], [d2]) => d1.localeCompare(d2));

  // Max daily spend
  let maxSpendDay = '';
  let maxSpendAmount = 0;
  Object.entries(dailySpendMap).forEach(([day, amt]) => {
    if (amt > maxSpendAmount) {
      maxSpendAmount = amt;
      maxSpendDay = day;
    }
  });

  const [yearStr, monthStr] = selectedMonth.split('-');
  const daysInMonth = new Date(parseInt(yearStr, 10), parseInt(monthStr, 10), 0).getDate();
  const distinctSpendingDays = daysWithSpend.length;
  const avgDaily = distinctSpendingDays > 0 ? Math.round(totalExpense / distinctSpendingDays) : 0;

  if (monthTransactions.length === 0) {
    return (
      <div className="bg-white border border-slate-200/90 rounded-xl p-8 text-center text-slate-500 mb-6">
        <PieChart className="w-10 h-10 mx-auto text-slate-300 mb-3" />
        <h4 className="text-sm font-bold text-slate-700 mb-1">
          {isBn ? 'এই মাসে এখনো কোনো হিসাব যোগ করা হয়নি' : 'No transactions logged this month'}
        </h4>
        <p className="text-xs text-slate-400">
          {isBn
            ? 'উপরে "টাকা এন্ট্রি করুন" বাটনে ক্লিক করে খরচ বা বাসা থেকে আসা টাকা যোগ করুন।'
            : 'Click "Add Entry" above to log your expenses or money received from home.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 mb-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-emerald-600" />
            <span>{isBn ? 'মাসের খরচের বিস্তারিত বিশ্লেষণ ও হিসাব' : 'Monthly Expense Breakdown'}</span>
          </h2>
          <p className="text-xs text-slate-500">
            {formatMonthName(selectedMonth, language)} ·{' '}
            {isBn
              ? `মোট খরচ ${formatCurrency(totalExpense, language)}`
              : `Total expenses ${formatCurrency(totalExpense, language)}`}
          </p>
        </div>

        <button
          onClick={onOpenReportModal}
          className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 px-3 py-1.5 rounded-lg transition-colors w-fit"
        >
          <span>{isBn ? 'মাস শেষের পূর্ণাঙ্গ স্টেটমেন্ট দেখুন' : 'Full Month-End Statement'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Category Breakdown (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {isBn ? 'কোন খাতে কত খরচ হয়েছে' : 'Spending by Category'}
            </h3>
            <span className="text-xs text-slate-400">
              {isBn
                ? `${toBengaliDigits(sortedCategories.length)} টি খাত`
                : `${sortedCategories.length} categories`}
            </span>
          </div>

          {sortedCategories.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              {isBn ? 'কোনো খরচের এন্ট্রি নেই' : 'No expenses recorded'}
            </div>
          ) : (
            <div className="space-y-3.5">
              {sortedCategories.map((item) => (
                <div key={item.category.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
                        style={{
                          backgroundColor: item.category.bgLight,
                          color: item.category.color,
                        }}
                      >
                        <CategoryIcon name={item.category.iconName} className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-medium text-slate-800 truncate">
                        {isBn ? item.category.nameBn : item.category.nameEn}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-slate-400 font-mono-num text-[11px]">
                        {isBn ? `${toBengaliDigits(item.percentage)}%` : `${item.percentage}%`}
                      </span>
                      <span className="font-bold text-slate-900 font-mono-num">
                        {formatCurrency(item.amount, language)}
                      </span>
                    </div>
                  </div>

                  {/* Visual Bar */}
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor: item.category.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Insights & Daily Highlights (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Key Insights Box */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              {isBn ? 'এক নজরে মাসের সারসংক্ষেপ' : 'Month At a Glance'}
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-600">{isBn ? 'বাসা থেকে মোট প্রাপ্তি:' : 'Home Allowance:'}</span>
                <span className="font-bold text-emerald-700 font-mono-num">
                  {formatCurrency(totalIncome, language)}
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-600">{isBn ? 'মাসের মোট খরচ:' : 'Total Expenditure:'}</span>
                <span className="font-bold text-rose-600 font-mono-num">
                  {formatCurrency(totalExpense, language)}
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-600">{isBn ? 'মাসিক নিট সঞ্চয় / অবশিষ্ট:' : 'Net Savings:'}</span>
                <span
                  className={`font-bold font-mono-num ${
                    netSavings >= 0 ? 'text-emerald-700' : 'text-red-600'
                  }`}
                >
                  {formatCurrency(netSavings, language)}
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-600">{isBn ? 'সক্রিয় খরচের দিন:' : 'Spending Days:'}</span>
                <span className="font-medium text-slate-800 font-mono-num">
                  {isBn
                    ? `${toBengaliDigits(distinctSpendingDays)} / ${toBengaliDigits(daysInMonth)} দিন`
                    : `${distinctSpendingDays} / ${daysInMonth} days`}
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5">
                <span className="text-slate-600">{isBn ? 'প্রতিদিনের গড় খরচ:' : 'Average Daily Spend:'}</span>
                <span className="font-bold text-slate-900 font-mono-num">
                  {formatCurrency(avgDaily, language)}
                </span>
              </div>
            </div>
          </div>

          {/* Highest Spending Day Card */}
          {maxSpendAmount > 0 && (
            <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  {isBn ? 'মাসের সর্বোচ্চ খরচের দিন' : 'Highest Spending Day'}
                </div>
                <div className="text-xs font-bold text-slate-900 mt-0.5 truncate">
                  {formatDateReadable(maxSpendDay, language)}
                </div>
                <div className="text-xs font-bold text-rose-600 font-mono-num mt-0.5">
                  {formatCurrency(maxSpendAmount, language)}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Daily Expense Distribution Bar Strip */}
      {daysWithSpend.length > 0 && (
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
              <span>{isBn ? 'দিনভিত্তিক খরচের পরিসংখ্যান' : 'Daily Expense Timeline'}</span>
            </h3>
            <span className="text-xs text-slate-400">
              {isBn ? 'তারিখ অনুযায়ী খরচের মাত্রা' : 'Timeline of expenditures'}
            </span>
          </div>

          <div className="flex items-end gap-1.5 h-28 pt-4 overflow-x-auto pb-1">
            {daysWithSpend.map(([date, amt]) => {
              const heightPercent = maxSpendAmount > 0 ? Math.max(12, Math.round((amt / maxSpendAmount) * 100)) : 10;
              const dayNum = date.split('-')[2];
              return (
                <div
                  key={date}
                  className="flex-1 min-w-[28px] max-w-[48px] flex flex-col items-center gap-1 group relative cursor-pointer"
                  title={`${formatDateReadable(date, language)}: ${formatCurrency(amt, language)}`}
                >
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-slate-900 text-white text-[10px] py-0.5 px-1.5 rounded whitespace-nowrap pointer-events-none z-10 font-mono-num">
                    {formatCurrency(amt, language)}
                  </div>

                  <div className="w-full bg-slate-100 rounded-t-md h-full flex items-end overflow-hidden">
                    <div
                      className="w-full bg-emerald-500 group-hover:bg-emerald-600 transition-all rounded-t-md"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>

                  <span className="text-[10px] font-medium text-slate-500 font-mono-num">
                    {isBn ? toBengaliDigits(dayNum) : dayNum}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

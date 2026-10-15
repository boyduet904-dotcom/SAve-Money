import React, { useRef, useState } from 'react';
import {
  X,
  FileDown,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Check,
  FileSpreadsheet,
  Smartphone,
  Download,
} from 'lucide-react';
import { Language, Transaction } from '../types';
import { getCategoryById } from '../utils/categories';
import {
  formatCurrency,
  formatDateCompact,
  formatDateReadable,
  formatMonthName,
  toBengaliDigits,
} from '../utils/formatters';
import { exportElementToPDF } from '../utils/pdfExport';

interface MonthlyReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  selectedMonth: string;
  transactions: Transaction[];
  monthlyBudget: number;
  onTriggerInstall?: () => void;
  isDirectInstallable?: boolean;
}

interface ToastState {
  text: string;
  type: 'success' | 'error' | 'info';
}

export const MonthlyReportModal: React.FC<MonthlyReportModalProps> = ({
  isOpen,
  onClose,
  language,
  selectedMonth,
  transactions,
  monthlyBudget,
  onTriggerInstall,
  isDirectInstallable,
}) => {
  const isBn = language === 'bn';
  const reportRef = useRef<HTMLDivElement>(null);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [isApkModalOpen, setIsApkModalOpen] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  if (!isOpen) return null;

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Filter transactions for this month
  const monthTransactions = transactions
    .filter((t) => t.date.startsWith(selectedMonth))
    .sort((a, b) => a.date.localeCompare(b.date) || a.createdAt - b.createdAt);

  const expenses = monthTransactions.filter((t) => t.type === 'expense');
  const incomes = monthTransactions.filter((t) => t.type === 'income');

  const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0);
  const totalIncome = incomes.reduce((sum, t) => sum + t.amount, 0);
  const netBalance = totalIncome - totalExpense;

  // Category breakdown for expenses
  const categoryMap: Record<string, number> = {};
  expenses.forEach((t) => {
    categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
  });

  const sortedCategories = Object.entries(categoryMap)
    .map(([id, amount]) => ({
      category: getCategoryById(id),
      amount,
      percentage: totalExpense > 0 ? Math.round((amount / totalExpense) * 100) : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  // Budget status
  const hasBudget = monthlyBudget > 0;
  const budgetUsagePercent = hasBudget ? Math.round((totalExpense / monthlyBudget) * 100) : 0;
  const isOverBudget = hasBudget && totalExpense > monthlyBudget;

  const handleExportPDF = async () => {
    if (!reportRef.current || isExportingPDF) return;

    try {
      setIsExportingPDF(true);
      const fileName = `TakaHishab_${selectedMonth}_Statement.pdf`;
      const success = await exportElementToPDF(reportRef.current, fileName);

      if (success) {
        showToast(
          isBn
            ? 'মাসিক স্টেটমেন্টের PDF ফাইল সফলভাবে ডাউনলোড হয়েছে!'
            : 'Monthly statement PDF downloaded successfully!',
          'success'
        );
      } else {
        showToast(
          isBn
            ? 'PDF তৈরিতে সমস্যা হয়েছে। আবার চেষ্টা করুন।'
            : 'Failed to generate PDF. Please try again.',
          'error'
        );
      }
    } catch (err) {
      console.error(err);
      showToast(
        isBn
          ? 'PDF ডাউনলোড করতে ব্যর্থ হয়েছে।'
          : 'Failed to download PDF.',
        'error'
      );
    } finally {
      setIsExportingPDF(false);
    }
  };

  const handleDownloadCSV = () => {
    const headers = ['Date', 'Type', 'Description', 'Payment Method', 'Amount (BDT)', 'Notes'];
    const rows = monthTransactions.map((t) => [
      t.date,
      t.type === 'income' ? 'Income/From Home' : 'Expense',
      `"${t.title.replace(/"/g, '""')}"`,
      t.paymentMethod || 'Cash',
      t.amount,
      `"${(t.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `TakaHishab_${selectedMonth}_Report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(isBn ? 'CSV ফাইল ডাউনলোড সম্পন্ন হয়েছে!' : 'CSV exported successfully!', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150 max-h-[94vh] flex flex-col">
        {/* Modal Top Header (Clean: No Print Icon, Clear PDF & CSV Actions) */}
        <div className="px-3.5 sm:px-5 py-3 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/90 print-hidden">
          <div className="flex items-center gap-2 min-w-0">
            <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
              {isBn ? 'মাসিক খরচের হিসাব ও স্টেটমেন্ট' : 'Monthly Financial Statement'}
            </h3>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Android APK / WebAPK button */}
            <button
              onClick={() => setIsApkModalOpen(true)}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 transition-colors shadow-xs"
              title={isBn ? 'অ্যান্ড্রয়েড APK ও ১-ক্লিক WebAPK প্যাকেজ ডাউনলোড' : 'Android APK & WebAPK Package'}
            >
              <Smartphone className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>{isBn ? 'APK / অ্যাপ' : 'APK / App'}</span>
            </button>

            {/* CSV export */}
            <button
              onClick={handleDownloadCSV}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 text-slate-700 hover:bg-white transition-colors"
              title="Download as CSV spreadsheet"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden xs:inline">{isBn ? 'CSV এক্সপোর্ট' : 'CSV'}</span>
            </button>

            {/* Formatted PDF Export Button (Primary Action, Print button removed) */}
            <button
              onClick={handleExportPDF}
              disabled={isExportingPDF}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-70 transition-colors shadow-xs"
              title="Export as clean formatted PDF file"
            >
              {isExportingPDF ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>{isBn ? 'PDF তৈরি হচ্ছে...' : 'Generating...'}</span>
                </>
              ) : (
                <>
                  <FileDown className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>{isBn ? 'PDF ডাউনলোড' : 'Download PDF'}</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors ml-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dynamic Toast Feedback */}
        {toast && (
          <div
            className={`px-4 py-2 text-xs font-semibold flex items-center gap-2 border-b print-hidden animate-in fade-in ${
              toast.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : toast.type === 'error'
                ? 'bg-red-50 border-red-200 text-red-800'
                : 'bg-amber-50 border-amber-200 text-amber-800'
            }`}
          >
            {toast.type === 'success' ? (
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            )}
            <span>{toast.text}</span>
          </div>
        )}

        {/* Scrollable Printable Statement Body - Maximum width, minimal nested padding on mobile */}
        <div className="overflow-y-auto p-2 sm:p-5 bg-slate-100/60">
          {/* Target Element for PDF Capture with clean background and no heavy outer clipping */}
          <div
            ref={reportRef}
            className="print-area bg-white p-3.5 sm:p-7 rounded-xl shadow-xs border border-slate-200/90 text-slate-900 space-y-5 max-w-2xl mx-auto w-full"
          >
            {/* Statement Header */}
            <div className="border-b border-slate-200 pb-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="inline-flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block shrink-0" />
                    <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                      {isBn ? 'টাকা হিসাব স্টেটমেন্ট' : 'TakaHishab Statement'}
                    </span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                    {formatMonthName(selectedMonth, language)}
                  </h1>
                  <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
                    {isBn
                      ? 'বাসা থেকে প্রাপ্ত টাকা ও দৈনিক খরচের পূর্ণাঙ্গ বিবরণী'
                      : 'Comprehensive personal expense and allowance record'}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                    {isBn ? 'ডাউনলোড তারিখ' : 'Issued Date'}
                  </span>
                  <span className="text-xs font-semibold text-slate-800 font-mono-num">
                    {formatDateReadable(new Date().toISOString().split('T')[0], language)}
                  </span>
                </div>
              </div>
            </div>

            {/* 3-Box Financial Summary */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <div className="p-2.5 sm:p-3.5 rounded-xl border border-emerald-100 bg-emerald-50/50">
                <span className="text-[10px] sm:text-[11px] font-semibold text-emerald-800 uppercase tracking-wider block mb-0.5">
                  {isBn ? 'বাসা থেকে প্রাপ্তি' : 'Allowance'}
                </span>
                <div className="text-base sm:text-lg font-bold text-emerald-700 font-mono-num leading-tight">
                  {formatCurrency(totalIncome, language)}
                </div>
                <span className="text-[10px] text-emerald-600 mt-0.5 block">
                  {isBn ? `${toBengaliDigits(incomes.length)} টি এন্ট্রি` : `${incomes.length} deposits`}
                </span>
              </div>

              <div className="p-2.5 sm:p-3.5 rounded-xl border border-rose-100 bg-rose-50/50">
                <span className="text-[10px] sm:text-[11px] font-semibold text-rose-800 uppercase tracking-wider block mb-0.5">
                  {isBn ? 'মোট খরচ' : 'Expenditure'}
                </span>
                <div className="text-base sm:text-lg font-bold text-rose-700 font-mono-num leading-tight">
                  {formatCurrency(totalExpense, language)}
                </div>
                <span className="text-[10px] text-rose-600 mt-0.5 block">
                  {isBn ? `${toBengaliDigits(expenses.length)} টি খরচ` : `${expenses.length} expenses`}
                </span>
              </div>

              <div className="p-2.5 sm:p-3.5 rounded-xl border border-slate-200 bg-slate-50/70">
                <span className="text-[10px] sm:text-[11px] font-semibold text-slate-700 uppercase tracking-wider block mb-0.5">
                  {isBn ? 'অবশিষ্ট সঞ্চয়' : 'Net Balance'}
                </span>
                <div
                  className={`text-base sm:text-lg font-bold font-mono-num leading-tight ${
                    netBalance >= 0 ? 'text-slate-900' : 'text-red-600'
                  }`}
                >
                  {formatCurrency(netBalance, language)}
                </div>
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  {netBalance >= 0
                    ? isBn
                      ? 'উদ্বৃত্ত রয়েছে'
                      : 'Surplus'
                    : isBn
                    ? 'ঘাটতি'
                    : 'Deficit'}
                </span>
              </div>
            </div>

            {/* Budget Adherence Section */}
            {hasBudget && (
              <div className="p-2.5 sm:p-3.5 rounded-xl border border-slate-200 bg-slate-50/40">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                    {isOverBudget ? (
                      <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                    ) : (
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    )}
                    <span className="truncate">
                      {isOverBudget
                        ? isBn
                          ? `বাজেট সীমা ছাড়িয়ে গেছে (${toBengaliDigits(budgetUsagePercent)}%)`
                          : `Budget limit exceeded (${budgetUsagePercent}%)`
                        : isBn
                        ? `বাজেট নিয়ন্ত্রণে রয়েছে (${toBengaliDigits(budgetUsagePercent)}% খরচ)`
                        : `Budget on track (${budgetUsagePercent}% spent)`}
                    </span>
                  </div>

                  <div className="font-mono-num text-slate-700 text-xs shrink-0 ml-2">
                    {isBn ? 'বাজেট: ' : 'Budget: '}
                    <strong>{formatCurrency(monthlyBudget, language)}</strong>
                  </div>
                </div>

                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full ${isOverBudget ? 'bg-red-600' : 'bg-emerald-600'}`}
                    style={{ width: `${Math.min(budgetUsagePercent, 100)}%` }}
                  />
                </div>
              </div>
            )}

            {/* Category summary (compact & clean) */}
            {sortedCategories.length > 0 && (
              <div className="pt-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    {isBn ? 'খাতভিত্তিক খরচের সারসংক্ষেপ' : 'Category-wise Spending'}
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    {isBn ? `${toBengaliDigits(sortedCategories.length)} টি খাত` : `${sortedCategories.length} categories`}
                  </span>
                </div>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                      <tr>
                        <th className="py-1.5 px-2.5 sm:px-3">{isBn ? 'খাত' : 'Category'}</th>
                        <th className="py-1.5 px-2.5 sm:px-3 text-right">{isBn ? 'শতকরা অংশ' : 'Share'}</th>
                        <th className="py-1.5 px-2.5 sm:px-3 text-right">{isBn ? 'মোট টাকা' : 'Amount'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {sortedCategories.map((c) => (
                        <tr key={c.category.id}>
                          <td className="py-1.5 px-2.5 sm:px-3 font-medium text-slate-800">
                            {isBn ? c.category.nameBn : c.category.nameEn}
                          </td>
                          <td className="py-1.5 px-2.5 sm:px-3 text-right text-slate-500 font-mono-num">
                            {isBn ? `${toBengaliDigits(c.percentage)}%` : `${c.percentage}%`}
                          </td>
                          <td className="py-1.5 px-2.5 sm:px-3 text-right font-bold text-slate-900 font-mono-num">
                            {formatCurrency(c.amount, language)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Itemized Transactions Table - No inner cramped box, "খাত" removed, Date aligned to extreme left, Amount always visible on the right */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider">
                  {isBn ? 'দৈনিক খরচের সম্পূর্ণ বিবরণী' : 'Daily Itemized Statement'}
                </h4>
                <span className="text-xs text-slate-500 font-mono-num">
                  ({isBn ? toBengaliDigits(monthTransactions.length) : monthTransactions.length} {isBn ? 'টি এন্ট্রি' : 'entries'})
                </span>
              </div>

              {monthTransactions.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
                  {isBn ? 'এই মাসে কোনো লেনদেন নেই।' : 'No transactions recorded for this month.'}
                </div>
              ) : (
                <div className="w-full">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b-2 border-slate-200 text-slate-600 text-[11px] sm:text-xs uppercase tracking-wider font-bold">
                        <th className="py-2.5 pl-0 pr-2 text-left w-[22%] sm:w-[20%]">
                          {isBn ? 'তারিখ' : 'Date'}
                        </th>
                        <th className="py-2.5 px-2 text-left">
                          {isBn ? 'বিবরণ ও মাধ্যম' : 'Description & Method'}
                        </th>
                        <th className="py-2.5 pl-2 pr-0 text-right w-[32%] sm:w-[28%] whitespace-nowrap">
                          {isBn ? 'টাকার পরিমাণ' : 'Amount'}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {monthTransactions.map((t) => {
                        const isInc = t.type === 'income';
                        const cd = formatDateCompact(t.date, language);
                        return (
                          <tr key={t.id} className="hover:bg-slate-50/60 transition-colors">
                            {/* Date Column: Extreme left, compact, clean */}
                            <td className="py-2.5 sm:py-3 pl-0 pr-2 text-left align-top whitespace-nowrap">
                              <div className="font-mono-num leading-tight">
                                <div className="font-bold text-slate-900 text-xs sm:text-sm">
                                  {cd.day} {cd.month}
                                </div>
                                <div className="text-[10px] text-slate-400">
                                  {cd.year}
                                </div>
                              </div>
                            </td>

                            {/* Description Column: Full space, title + payment method + notes */}
                            <td className="py-2.5 sm:py-3 px-2 text-left align-top min-w-0">
                              <div className="font-semibold text-slate-900 text-xs sm:text-sm leading-snug break-words">
                                {t.title}
                              </div>
                              <div className="flex flex-wrap items-center gap-1.5 mt-0.5 text-[11px] text-slate-500">
                                <span className="inline-block px-1.5 py-0.2 rounded-md bg-slate-100 font-medium text-slate-700 text-[10px]">
                                  {t.paymentMethod || (isBn ? 'নগদ' : 'Cash')}
                                </span>
                                {t.notes && (
                                  <span className="text-slate-400 text-[10px] italic truncate max-w-[150px] sm:max-w-none">
                                    ({t.notes})
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Amount Column: Extreme right, bold, high contrast, 100% visible on mobile portrait & rotated landscape */}
                            <td className="py-2.5 sm:py-3 pl-2 pr-0 text-right align-top whitespace-nowrap">
                              <div className="font-mono-num">
                                <span
                                  className={`font-black text-xs sm:text-base leading-tight inline-block ${
                                    isInc ? 'text-emerald-700' : 'text-slate-900'
                                  }`}
                                >
                                  {isInc ? '+' : '-'} {formatCurrency(t.amount, language)}
                                </span>
                                <div className="text-[10px] text-slate-400 mt-0.5">
                                  {isInc
                                    ? isBn
                                      ? 'বাসা থেকে প্রাপ্তি'
                                      : 'Allowance'
                                    : isBn
                                    ? 'খরচ হয়েছে'
                                    : 'Expense'}
                                </div>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400">
              <span>{isBn ? 'টাকা হিসাব — ব্যক্তিগত খরচের রেকর্ড' : 'TakaHishab — Personal Expense Record'}</span>
              <span>{isBn ? 'ব্যক্তিগত নথির জন্য সংরক্ষিত' : 'Confidential Financial Record'}</span>
            </div>
          </div>
        </div>

        {/* Android APK & WebAPK Download Sub-Modal */}
        {isApkModalOpen && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white rounded-2xl max-w-md w-full p-4 sm:p-5 shadow-2xl border border-slate-200 animate-in zoom-in-95 text-slate-900 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {isBn ? 'অ্যান্ড্রয়েড APK ও ইনস্টলেশন প্যাকেজ' : 'Android APK & Installation Package'}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      {isBn ? 'মাসিক রিপোর্ট ও স্টেটমেন্ট এক্সপোর্ট মেনু' : 'Export Menu Package'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsApkModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Option 1: 1-Click Native WebAPK Install */}
              <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/60 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-950 text-xs">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{isBn ? '১-ক্লিক অ্যান্ড্রয়েড ইনস্টল (WebAPK)' : '1-Click Android WebAPK Install'}</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
                    {isBn ? 'সবচেয়ে দ্রুত' : 'Fastest'}
                  </span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  {isBn
                    ? 'আপনার ফোনে গুগল ক্রোম দিয়ে সরাসরি আসল WebAPK অ্যাপ ইনস্টল করুন। এতে ফোন লঞ্চারে আসল অ্যাপের মতো আইকন চলে আসবে ও অফলাইনেও কাজ করবে।'
                    : 'Install directly on Android via Chrome with genuine WebAPK registration, app drawer icon and offline support.'}
                </p>
                {isDirectInstallable && onTriggerInstall ? (
                  <button
                    onClick={() => {
                      onTriggerInstall();
                      setIsApkModalOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>{isBn ? 'এখনই ফোনে ইনস্টল করুন (WebAPK)' : 'Install on Android Phone Now'}</span>
                  </button>
                ) : (
                  <div className="bg-white/80 p-2.5 rounded-lg border border-emerald-100 text-[11px] text-slate-700 space-y-1">
                    <span className="font-bold text-emerald-900 block">
                      {isBn ? 'ফোনে ইনস্টল করার নিয়ম:' : 'To install on phone:'}
                    </span>
                    <p>
                      {isBn
                        ? 'অ্যান্ড্রয়েড ফোনের Chrome ব্রাউজারে ওপেন করে উপরের ডানপাশের ⋮ মেনু থেকে "Install app" বা "হোম স্ক্রিনে যোগ করুন" চাপুন।'
                        : 'Open in Chrome on Android and tap the 3-dots (⋮) menu, then choose "Install app".'}
                    </p>
                  </div>
                )}
              </div>

              {/* Option 2: Direct Project APK Package File Download */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
                    <Download className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{isBn ? 'সরাসরি প্রজেক্ট APK ফাইল ডাউনলোড (.apk)' : 'Direct Project APK File (.apk)'}</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-800">
                    ৬২ KB
                  </span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  {isBn
                    ? 'প্রজেক্ট ফাইল থেকে সরাসরি আসল takahishab-android-app.apk ফাইলটি ডাউনলোড করে নিজের ফোনে বা মেমোরিতে সংরক্ষণ করুন:'
                    : 'Download the standalone takahishab-android-app.apk package directly from project files:'}
                </p>
                <a
                  href="/takahishab-android-app.apk"
                  download="takahishab-android-app.apk"
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-colors"
                >
                  <Download className="w-4 h-4 stroke-[2.5]" />
                  <span>{isBn ? 'takahishab-android-app.apk ডাউনলোড (৬২ KB)' : 'Download APK Package'}</span>
                </a>
              </div>

              {/* Footer controls */}
              <div className="flex items-center justify-between pt-1 text-xs">
                <a
                  href="https://www.pwabuilder.com?url=https%3A%2F%2Fais-pre-imldizthc7luoevykbbeyq-386259831332.asia-southeast1.run.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-700 hover:text-emerald-800 font-semibold inline-flex items-center gap-1 text-[11px]"
                >
                  <span>{isBn ? 'প্লে-স্টোর প্যাকেজার' : 'Play Store Packager'}</span>
                  <span aria-hidden="true">→</span>
                </a>
                <button
                  onClick={() => setIsApkModalOpen(false)}
                  className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                >
                  {isBn ? 'বন্ধ করুন' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

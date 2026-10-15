import React from 'react';
import { Wallet, FileText, ChevronLeft, ChevronRight, Calendar, UserCheck, Download } from 'lucide-react';
import { Language } from '../types';
import { formatMonthName, getCurrentMonth } from '../utils/formatters';

interface TopNavProps {
  language: Language;
  onToggleLanguage: () => void;
  selectedMonth: string;
  onMonthChange: (month: string) => void;
  onOpenReportModal: () => void;
  onOpenDeveloperModal: () => void;
  onOpenInstallModal: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  language,
  onToggleLanguage,
  selectedMonth,
  onMonthChange,
  onOpenReportModal,
  onOpenDeveloperModal,
  onOpenInstallModal,
}) => {
  const isBn = language === 'bn';

  const navigateMonth = (delta: number) => {
    const [yearStr, monthStr] = selectedMonth.split('-');
    let year = parseInt(yearStr, 10);
    let month = parseInt(monthStr, 10) + delta;

    if (month > 12) {
      month = 1;
      year += 1;
    } else if (month < 1) {
      month = 12;
      year -= 1;
    }

    const nextMonth = `${year}-${String(month).padStart(2, '0')}`;
    onMonthChange(nextMonth);
  };

  const isCurrentMonth = selectedMonth === getCurrentMonth();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 w-full overflow-hidden">
      <div className="max-w-6xl mx-auto px-2.5 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-1.5 sm:gap-3 w-full">
        {/* Zone 1: Brand title & Logo */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs shrink-0">
            <Wallet className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <h1 className="text-sm sm:text-lg font-bold tracking-tight text-slate-900 leading-tight whitespace-nowrap">
              {isBn ? 'টাকা হিসাব' : 'TakaHishab'}
            </h1>
            <p className="text-[10px] text-slate-500 hidden lg:block leading-none mt-0.5">
              {isBn ? 'দৈনিক খরচ ও বাসা থেকে টাকা ট্র্যাকার' : 'Daily Expense & Allowance Tracker'}
            </p>
          </div>
        </div>

        {/* Zone 2: Month Navigation Switcher (compact & responsive) */}
        <div className="flex items-center gap-0.5 sm:gap-1 bg-slate-100/90 p-0.5 sm:p-1 rounded-xl border border-slate-200/60 shrink min-w-0">
          <button
            onClick={() => navigateMonth(-1)}
            aria-label="Previous Month"
            className="p-1 sm:p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white transition-colors shrink-0"
            title={isBn ? 'আগের মাস' : 'Previous Month'}
          >
            <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          <div className="flex items-center gap-1 px-1 sm:px-2 py-0.5 text-xs sm:text-sm font-semibold text-slate-800 truncate">
            <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600 shrink-0 hidden xs:inline-block" />
            <span className="whitespace-nowrap text-[11px] sm:text-xs md:text-sm font-bold">
              {formatMonthName(selectedMonth, language)}
            </span>
          </div>

          <button
            onClick={() => navigateMonth(1)}
            aria-label="Next Month"
            className="p-1 sm:p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white transition-colors shrink-0"
            title={isBn ? 'পরের মাস' : 'Next Month'}
          >
            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {!isCurrentMonth && (
            <button
              onClick={() => onMonthChange(getCurrentMonth())}
              className="hidden xl:inline-block ml-1 px-2 py-0.5 text-[10px] font-medium bg-emerald-100 text-emerald-800 rounded-md hover:bg-emerald-200 transition-colors whitespace-nowrap"
            >
              {isBn ? 'চলতি মাস' : 'Today'}
            </button>
          )}
        </div>

        {/* Zone 3: Actions (Install App, Monthly Report, Developer Info, Language Toggle) */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Prominent Install App button (matching the user's requested top Install button) */}
          <button
            onClick={onOpenInstallModal}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 active:scale-98 transition-all whitespace-nowrap shadow-xs"
            title={isBn ? 'মোবাইল বা পিসিতে অ্যাপ ইনস্টল করুন' : 'Install App'}
          >
            <Download className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="text-[11px] sm:text-xs">{isBn ? 'ইনস্টল' : 'Install'}</span>
          </button>

          {/* Monthly Report modal trigger */}
          <button
            onClick={onOpenReportModal}
            className="hidden md:flex items-center gap-1 px-2 sm:px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap"
            title={isBn ? 'মাসের খরচের পূর্ণাঙ্গ হিসাব' : 'Monthly Statement'}
          >
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden lg:inline">{isBn ? 'মাসিক রিপোর্ট' : 'Report'}</span>
          </button>

          {/* Developer Profile trigger */}
          <button
            onClick={onOpenDeveloperModal}
            className="flex items-center gap-1 p-1.5 sm:px-2.5 sm:py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 transition-colors whitespace-nowrap shadow-xs"
            title={isBn ? 'অ্যাপ নির্মাতা ও ডেভেলপার পরিচিতি' : 'Developer & App Info'}
          >
            <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">{isBn ? 'ডেভেলপার' : 'Developer'}</span>
          </button>

          {/* Language Switcher - positioned cleanly at the right end */}
          <button
            onClick={onToggleLanguage}
            className="px-2 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors whitespace-nowrap"
            title={isBn ? 'Switch to English' : 'বাংলায় পরিবর্তন করুন'}
          >
            {isBn ? 'English' : 'বাংলা'}
          </button>
        </div>
      </div>
    </header>
  );
};

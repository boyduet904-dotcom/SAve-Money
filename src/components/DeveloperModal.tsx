import React from 'react';
import {
  X,
  GraduationCap,
  Mail,
  Building2,
  Code2,
  Sparkles,
} from 'lucide-react';
import { Language } from '../types';

interface DeveloperModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const DeveloperModal: React.FC<DeveloperModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const isBn = language === 'bn';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col text-slate-900">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {isBn ? 'অ্যাপ নির্মাতা ও ডেভেলপার পরিচিতি' : 'Developer & App Info'}
              </h3>
              <p className="text-[11px] text-slate-500">
                {isBn ? 'টাকা হিসাব অ্যাপ্লিকেশন' : 'TakaHishab Application'}
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

        {/* Content Body */}
        <div className="p-6 space-y-5 text-slate-800">
          {/* Developer Card Profile */}
          <div className="text-center p-5 bg-gradient-to-b from-emerald-50/60 to-slate-50/60 rounded-2xl border border-emerald-100 relative">
            {/* Version Badge */}
            <span className="absolute top-3 right-3 text-[10px] font-mono-num font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white shadow-xs">
              V0.1
            </span>

            {/* Profile Avatar / Initials */}
            <div className="w-16 h-16 rounded-2xl bg-emerald-700 text-white font-bold text-xl flex items-center justify-center mx-auto mb-3 shadow-sm border-2 border-white">
              MS
            </div>

            {/* Exact Name */}
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Md. Mehedi Hassan Saon
            </h2>

            {/* Education & University */}
            <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-emerald-800 mt-1">
              <GraduationCap className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>BSc. in EEE</span>
              <span className="text-slate-300">·</span>
              <Building2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Uttara University</span>
            </div>

            {/* Email Contact */}
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-white rounded-lg border border-slate-200/80 text-xs font-mono-num text-slate-700 shadow-xs">
              <Mail className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <a
                href="mailto:saon00024@gmail.com"
                className="hover:text-emerald-700 transition-colors"
              >
                saon00024@gmail.com
              </a>
            </div>
          </div>

          {/* About App Mission */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 text-xs text-slate-600 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isBn ? 'অ্যাপ সম্পর্কে' : 'About the App'}</span>
            </div>
            <p className="leading-relaxed">
              {isBn
                ? 'দৈনিক খরচ ও মেসের হিসাব সংরক্ষণ, বাসা থেকে পাঠানো টাকা ট্র্যাকিং এবং মাসিক বাজেট সুনিয়ন্ত্রিত রাখতে এই অ্যাপ্লিকেশনটি তৈরি করা হয়েছে।'
                : 'Built for seamless daily expense tracking, home allowance logging, and monthly budget discipline.'}
            </p>
          </div>

          {/* Close button */}
          <div className="pt-1 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              {isBn ? 'বন্ধ করুন' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  X,
  Smartphone,
  Download,
  Copy,
  Check,
  ExternalLink,
  Laptop,
  Apple,
  Share2,
  Info,
} from 'lucide-react';
import { Language } from '../types';

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onTriggerInstall: () => void;
  isInstallable: boolean;
  isInstalled: boolean;
}

export const InstallModal: React.FC<InstallModalProps> = ({
  isOpen,
  onClose,
  language,
  onTriggerInstall,
  isInstallable,
  isInstalled,
}) => {
  const isBn = language === 'bn';
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // The permanent preview/production URL of this app
  const appUrl = window.location.origin.includes('run.app')
    ? window.location.href.split('?')[0]
    : 'https://ais-pre-imldizthc7luoevykbbeyq-386259831332.asia-southeast1.run.app';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150 max-h-[94vh] flex flex-col text-slate-900">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-emerald-50/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Download className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {isBn ? 'মোবাইল বা পিসিতে অ্যাপ ইনস্টল করুন' : 'Install App on Mobile / PC'}
              </h3>
              <p className="text-[11px] text-emerald-800 font-medium">
                {isBn ? 'ইন্টারনেট ছাড়াও ১০০% অফলাইনে চলবে' : 'Works 100% Offline like a Native App'}
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

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-700">
          {/* Status Banner */}
          {isInstalled ? (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-800 font-semibold">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{isBn ? 'অ্যাপটি ইতোমধ্যে আপনার ডিভাইসে ইনস্টল করা আছে!' : 'App is already installed on this device!'}</span>
            </div>
          ) : isInstallable ? (
            <div className="p-3 bg-emerald-600 text-white rounded-xl shadow-xs space-y-2">
              <div className="font-bold text-sm flex items-center gap-1.5">
                <Smartphone className="w-4 h-4" />
                <span>{isBn ? 'সরাসরি ১-ক্লিকে ইনস্টল করুন' : 'Instant 1-Click Install'}</span>
              </div>
              <p className="text-emerald-100 text-[11px] leading-relaxed">
                {isBn
                  ? 'নিচের বাটনে চাপ দিলে আপনার ডিভাইসে ইনস্টল করার প্রম্পট আসবে।'
                  : 'Click below to prompt device installation directly.'}
              </p>
              <button
                onClick={() => {
                  onTriggerInstall();
                  onClose();
                }}
                className="w-full py-2.5 px-4 bg-white text-emerald-800 font-bold rounded-lg shadow-xs hover:bg-emerald-50 active:scale-98 transition-all flex items-center justify-center gap-2 text-xs"
              >
                <Download className="w-4 h-4 text-emerald-600" />
                <span>{isBn ? 'এখনই ইনস্টল করুন' : 'Install Now'}</span>
              </button>
            </div>
          ) : (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2 text-amber-900">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-relaxed">
                {isBn
                  ? 'AI Studio প্রিভিউ ফ্রেমের ভেতরে থাকায় সরাসরি ব্রাউজারের লিঙ্কটি মোবাইলে ওপেন করে ইনস্টল করতে পারেন।'
                  : 'Open the link directly in your phone browser to install with 1 tap.'}
              </div>
            </div>
          )}

          {/* Copyable Direct Link to Open in Phone Chrome */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
            <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wider">
              {isBn ? 'ফোনে খোলার সরাসরি লিঙ্ক' : 'Direct Link to Open on Mobile'}
            </span>
            <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-lg border border-slate-200">
              <input
                type="text"
                readOnly
                value={appUrl}
                className="flex-1 text-[11px] font-mono text-slate-600 bg-transparent outline-none px-1 select-all"
              />
              <button
                onClick={handleCopyLink}
                className="px-2.5 py-1 text-xs font-semibold rounded-md bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center gap-1 shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>{isBn ? 'কপি হয়েছে' : 'Copied'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{isBn ? 'কপি লিংক' : 'Copy'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Step-by-Step Instructions */}
          <div className="space-y-2.5 pt-1">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              {isBn ? 'কীভাবে আপনার ফোনে ইনস্টল করবেন:' : 'Installation Instructions:'}
            </h4>

            {/* Android Chrome */}
            <div className="p-3 rounded-xl border border-slate-200/90 bg-white hover:border-emerald-200 transition-colors space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-slate-800 text-xs">
                <Smartphone className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{isBn ? 'অ্যান্ড্রয়েড ফোন (Google Chrome)' : 'Android (Google Chrome)'}</span>
              </div>
              <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-600 pl-1 leading-relaxed">
                <li>
                  {isBn
                    ? 'ফোনের Chrome ব্রাউজারে লিঙ্কটি ওপেন করুন।'
                    : 'Open the link in Chrome browser on your phone.'}
                </li>
                <li>
                  {isBn
                    ? 'উপরের ডানদিকের ৩-ডট মেনুতে (⋮) ট্যাপ করুন।'
                    : 'Tap the 3-dot menu (⋮) in the top-right.'}
                </li>
                <li>
                  <strong>
                    {isBn ? '"Install app" অথবা "Add to Home screen"' : '"Install app" or "Add to Home screen"'}
                  </strong>{' '}
                  {isBn ? 'অপশনে চাপ দিন।' : 'option.'}
                </li>
              </ol>
            </div>

            {/* iPhone Safari */}
            <div className="p-3 rounded-xl border border-slate-200/90 bg-white hover:border-emerald-200 transition-colors space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-slate-800 text-xs">
                <Apple className="w-4 h-4 text-slate-700 shrink-0" />
                <span>{isBn ? 'আইফোন / আইপ্যাড (Apple Safari)' : 'iPhone / iPad (Safari)'}</span>
              </div>
              <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-600 pl-1 leading-relaxed">
                <li>
                  {isBn
                    ? 'Safari ব্রাউজারে লিঙ্কটি ওপেন করে নিচের '
                    : 'Open in Safari and tap '}
                  <strong>{isBn ? 'Share (শেয়ার)' : 'Share'}</strong>{' '}
                  {isBn ? 'আইকনে চাপ দিন।' : 'icon.'}
                </li>
                <li>
                  {isBn
                    ? 'নিচে স্ক্রল করে '
                    : 'Scroll down and tap '}
                  <strong>{isBn ? '"Add to Home Screen"' : '"Add to Home Screen"'}</strong>{' '}
                  {isBn ? 'সিলেক্ট করুন।' : '.'}
                </li>
              </ol>
            </div>

            {/* PC / Laptop */}
            <div className="p-3 rounded-xl border border-slate-200/90 bg-white hover:border-emerald-200 transition-colors space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-slate-800 text-xs">
                <Laptop className="w-4 h-4 text-slate-600 shrink-0" />
                <span>{isBn ? 'কম্পিউটার বা ল্যাপটপ (Chrome / Edge)' : 'PC / Laptop (Chrome / Edge)'}</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed pl-1">
                {isBn
                  ? 'ব্রাউজারের অ্যাড্রেস বারের ডানপাশে থাকা ছোট Install আইকনে চাপ দিয়ে অ্যাপ হিসেবে পিসিতে সেভ করুন।'
                  : 'Click the Install icon in your browser address bar to install on desktop.'}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition-colors shadow-xs"
          >
            {isBn ? 'ঠিক আছে' : 'Got it'}
          </button>
        </div>
      </div>
    </div>
  );
};

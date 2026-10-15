import React, { useRef, useState } from 'react';
import { X, Download, Upload, Trash2, Database, ShieldCheck, Check } from 'lucide-react';
import { Language } from '../types';
import {
  exportDataAsJSON,
  importDataFromJSON,
  clearAllData,
  saveTransactions,
  saveBudgets,
} from '../utils/storage';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onDataChanged: () => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({
  isOpen,
  onClose,
  language,
  onDataChanged,
}) => {
  const isBn = language === 'bn';
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  if (!isOpen) return null;

  const showNotification = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  const handleExport = () => {
    const jsonStr = exportDataAsJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `takahishab_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification(isBn ? 'ব্যাকআপ ফাইল সফলভাবে ডাউনলোড হয়েছে!' : 'Backup exported successfully!');
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importDataFromJSON(content);
        if (success) {
          showNotification(isBn ? 'ডাটা সফলভাবে রিস্টোর হয়েছে!' : 'Data restored successfully!');
          onDataChanged();
          setTimeout(() => onClose(), 1000);
        } else {
          showNotification(isBn ? 'ভুল ফাইল ফরম্যাট। সঠিক JSON ফাইল দিন।' : 'Invalid file format.');
        }
      }
    };
    reader.readAsText(file);
  };

  const handleClearAllConfirmed = () => {
    clearAllData();
    saveTransactions([]);
    saveBudgets([]);
    onDataChanged();
    setShowClearConfirm(false);
    showNotification(isBn ? 'সকল হিসাব মুছে অ্যাপ একদম ফ্রেশ করা হয়েছে।' : 'All data wiped clean.');
    setTimeout(() => onClose(), 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">
              {isBn ? 'ডাটা ব্যাকআপ ও সেটিংস' : 'Data Backup & Storage'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {feedbackMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{feedbackMsg}</span>
            </div>
          )}

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p>
              {isBn
                ? 'আপনার সমস্ত খরচের তথ্য আপনার ডিভাইসের ব্রাউজারে সুরক্ষিতভাবে সংরক্ষিত থাকে। চাইলে আপনি ব্যাকআপ ফাইল ডাউনলোড করে রাখতে পারেন।'
                : 'Your data is securely stored inside your local device browser. You can export a JSON backup anytime.'}
            </p>
          </div>

          <div className="space-y-2">
            <button
              onClick={handleExport}
              className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 transition-colors text-left group"
            >
              <div className="flex items-center gap-2.5">
                <Download className="w-4 h-4 text-emerald-600" />
                <div>
                  <div className="text-xs font-semibold text-slate-900">
                    {isBn ? 'ব্যাকআপ ডাউনলোড করুন (JSON)' : 'Export Backup File'}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {isBn ? 'ভবিষ্যতে ব্যবহারের জন্য ফাইল সংরক্ষণ' : 'Save full data locally'}
                  </div>
                </div>
              </div>
            </button>

            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleImportFile}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 transition-colors text-left group"
              >
                <div className="flex items-center gap-2.5">
                  <Upload className="w-4 h-4 text-blue-600" />
                  <div>
                    <div className="text-xs font-semibold text-slate-900">
                      {isBn ? 'ব্যাকআপ থেকে রিস্টোর করুন' : 'Restore from Backup'}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {isBn ? 'পূর্বে সংরক্ষিত JSON ফাইল আপলোড করুন' : 'Load from previous JSON backup'}
                    </div>
                  </div>
                </div>
              </button>
            </div>

            {showClearConfirm ? (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 space-y-2">
                <div className="text-xs font-bold text-red-800">
                  {isBn ? 'সব হিসাব মুছে ফ্রেশ করতে চান?' : 'Wipe all data and start fresh?'}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="px-3 py-1.5 text-xs font-medium bg-white text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-100"
                  >
                    {isBn ? 'বাতিল' : 'Cancel'}
                  </button>
                  <button
                    onClick={handleClearAllConfirmed}
                    className="px-3 py-1.5 text-xs font-bold bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-xs"
                  >
                    {isBn ? 'হ্যাঁ, সব ডিলিট করুন' : 'Yes, Delete All'}
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-red-200 hover:bg-red-50/50 transition-colors text-left group"
              >
                <div className="flex items-center gap-2.5">
                  <Trash2 className="w-4 h-4 text-red-600" />
                  <div>
                    <div className="text-xs font-semibold text-red-700">
                      {isBn ? 'সমস্ত হিসাব মুছে সম্পূর্ণ নতুন শুরু' : 'Wipe All Data'}
                    </div>
                    <div className="text-[11px] text-red-500">
                      {isBn ? 'সকল খরচ ও বাজেট চিরতরে মুছে ফেলবে' : 'Clear all local data'}
                    </div>
                  </div>
                </div>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

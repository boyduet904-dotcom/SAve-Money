import React, { useState, useMemo } from 'react';
import {
  LayoutDashboard,
  Receipt,
  FileText,
  Database,
  Trash2,
  AlertTriangle,
  X,
  Smartphone,
  UserCheck,
} from 'lucide-react';
import { Language, Transaction, TransactionType } from './types';
import {
  getCurrentMonth,
} from './utils/formatters';
import {
  loadBudgets,
  loadTransactions,
  saveTransactions,
  saveBudgets,
  setBudgetForMonth,
  clearAllData,
} from './utils/storage';
import { TopNav } from './components/TopNav';
import { SummaryCards } from './components/SummaryCards';
import { QuickAddBar } from './components/QuickAddBar';
import { MonthlyAnalytics } from './components/MonthlyAnalytics';
import { TransactionList } from './components/TransactionList';
import { TransactionModal } from './components/TransactionModal';
import { BudgetModal } from './components/BudgetModal';
import { MonthlyReportModal } from './components/MonthlyReportModal';
import { BackupModal } from './components/BackupModal';
import { BudgetAlertBanner } from './components/BudgetAlertBanner';
import { MotivationalTipBanner } from './components/MotivationalTipBanner';
import { DeveloperModal } from './components/DeveloperModal';
import { InstallModal } from './components/InstallModal';
import { usePWAInstall } from './hooks/usePWAInstall';

export default function App() {
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('takahishab_lang') as Language) || 'bn';
  });

  const { isInstallable, isInstalled, install } = usePWAInstall();

  const [selectedMonth, setSelectedMonth] = useState<string>(() => getCurrentMonth());
  const [transactions, setTransactions] = useState<Transaction[]>(() => loadTransactions());
  const [budgets, setBudgets] = useState(() => loadBudgets());

  const [activeTab, setActiveTab] = useState<'dashboard' | 'ledger' | 'report'>('dashboard');

  // Modals state
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [txModalDefaultType, setTxModalDefaultType] = useState<TransactionType>('expense');
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [isClearAllModalOpen, setIsClearAllModalOpen] = useState(false);
  const [isDeveloperModalOpen, setIsDeveloperModalOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  const isBn = language === 'bn';

  const toggleLanguage = () => {
    const nextLang: Language = language === 'bn' ? 'en' : 'bn';
    setLanguage(nextLang);
    localStorage.setItem('takahishab_lang', nextLang);
  };

  const reloadData = () => {
    setTransactions(loadTransactions());
    setBudgets(loadBudgets());
  };

  // Monthly stats
  const monthTransactions = useMemo(() => {
    return transactions.filter((t) => t.date.startsWith(selectedMonth));
  }, [transactions, selectedMonth]);

  const monthExpenses = useMemo(() => {
    return monthTransactions.filter((t) => t.type === 'expense');
  }, [monthTransactions]);

  const monthIncomes = useMemo(() => {
    return monthTransactions.filter((t) => t.type === 'income');
  }, [monthTransactions]);

  const totalExpense = useMemo(() => {
    return monthExpenses.reduce((sum, t) => sum + t.amount, 0);
  }, [monthExpenses]);

  const totalIncome = useMemo(() => {
    return monthIncomes.reduce((sum, t) => sum + t.amount, 0);
  }, [monthIncomes]);

  const currentBudget = useMemo(() => {
    const b = budgets.find((item) => item.month === selectedMonth);
    return b ? b.amount : 0;
  }, [budgets, selectedMonth]);

  // Days calculations
  const { daysInMonth, daysPassedInMonth } = useMemo(() => {
    const [yStr, mStr] = selectedMonth.split('-');
    const year = parseInt(yStr, 10);
    const month = parseInt(mStr, 10);
    const totalDays = new Date(year, month, 0).getDate();

    const today = new Date();
    const isCurrent =
      today.getFullYear() === year && today.getMonth() + 1 === month;

    let passed = totalDays;
    if (isCurrent) {
      passed = today.getDate();
    } else if (
      today.getFullYear() < year ||
      (today.getFullYear() === year && today.getMonth() + 1 < month)
    ) {
      passed = 0;
    }

    return { daysInMonth: totalDays, daysPassedInMonth: passed };
  }, [selectedMonth]);

  // Handlers
  const handleSaveTransaction = (
    data: Omit<Transaction, 'id' | 'createdAt'> & { id?: string }
  ) => {
    let updated: Transaction[];
    if (data.id) {
      // Edit
      updated = transactions.map((t) =>
        t.id === data.id
          ? {
              ...t,
              ...data,
              id: t.id,
              createdAt: t.createdAt,
            }
          : t
      );
    } else {
      // Add new
      const newTx: Transaction = {
        ...data,
        id: 'tx_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        createdAt: Date.now(),
      };
      updated = [newTx, ...transactions];
    }

    setTransactions(updated);
    saveTransactions(updated);
    setEditingTransaction(null);
  };

  const handleDeleteTransaction = (id: string) => {
    const updated = transactions.filter((t) => t.id !== id);
    setTransactions(updated);
    saveTransactions(updated);
  };

  const handleDeleteAllMonthTransactions = () => {
    const updated = transactions.filter((t) => !t.date.startsWith(selectedMonth));
    setTransactions(updated);
    saveTransactions(updated);
  };

  const handleWipeEntireApp = () => {
    clearAllData();
    setTransactions([]);
    setBudgets([]);
    saveTransactions([]);
    saveBudgets([]);
    setIsClearAllModalOpen(false);
  };

  const handleSaveBudget = (month: string, amount: number) => {
    setBudgetForMonth(month, amount);
    setBudgets(loadBudgets());
  };

  const openExpenseModal = () => {
    setEditingTransaction(null);
    setTxModalDefaultType('expense');
    setIsTxModalOpen(true);
  };

  const openIncomeModal = () => {
    setEditingTransaction(null);
    setTxModalDefaultType('income');
    setIsTxModalOpen(true);
  };

  const handleEditTransaction = (tx: Transaction) => {
    setEditingTransaction(tx);
    setIsTxModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans overflow-x-hidden w-full">
      {/* Top Header */}
      <TopNav
        language={language}
        onToggleLanguage={toggleLanguage}
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onOpenDeveloperModal={() => setIsDeveloperModalOpen(true)}
        onOpenInstallModal={() => {
          if (isInstallable) {
            install();
          } else {
            setIsInstallModalOpen(true);
          }
        }}
      />

      {/* Main Container */}
      <main className="max-w-6xl w-full mx-auto px-3.5 sm:px-6 py-4 sm:py-6 flex-1 overflow-x-hidden">
        {/* Motivational Tip Banner on Health & Expense Control */}
        <MotivationalTipBanner language={language} />

        {/* Quick Action Bar */}
        <QuickAddBar
          language={language}
          onOpenIncomeModal={openIncomeModal}
          onOpenExpenseModal={openExpenseModal}
        />

        {/* 4 Key Summary Stat Cards */}
        <SummaryCards
          language={language}
          totalIncome={totalIncome}
          totalExpense={totalExpense}
          incomeCount={monthIncomes.length}
          expenseCount={monthExpenses.length}
          monthlyBudget={currentBudget}
          daysPassedInMonth={daysPassedInMonth}
          daysInMonth={daysInMonth}
          onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
          onOpenIncomeModal={openIncomeModal}
        />

        {/* Budget Alert Banner if reaching/exceeding threshold */}
        <BudgetAlertBanner
          language={language}
          monthlyBudget={currentBudget}
          totalExpense={totalExpense}
          onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
        />

        {/* Tab Controls */}
        <div className="flex items-center gap-1 p-1 bg-slate-200/60 rounded-xl w-fit mb-6">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'dashboard'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-emerald-600" />
            <span>{isBn ? 'খরচের সারসংক্ষেপ ও বিশ্লেষণ' : 'Analytics & Overview'}</span>
          </button>

          <button
            onClick={() => setActiveTab('ledger')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'ledger'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Receipt className="w-3.5 h-3.5 text-slate-500" />
            <span>{isBn ? 'দৈনিক খরচের তালিকা' : 'Daily Ledger'}</span>
          </button>

          <button
            onClick={() => setIsReportModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg text-slate-600 hover:text-slate-900 transition-all"
          >
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span>{isBn ? 'মাসিক রিপোর্ট' : 'Monthly Statement'}</span>
          </button>
        </div>

        {/* Tab Contents */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <MonthlyAnalytics
              language={language}
              selectedMonth={selectedMonth}
              transactions={transactions}
              monthlyBudget={currentBudget}
              onOpenReportModal={() => setIsReportModalOpen(true)}
            />

            <TransactionList
              language={language}
              selectedMonth={selectedMonth}
              transactions={transactions}
              onEdit={handleEditTransaction}
              onDelete={handleDeleteTransaction}
              onDeleteAll={handleDeleteAllMonthTransactions}
              onOpenNewTransaction={openExpenseModal}
            />
          </div>
        )}

        {activeTab === 'ledger' && (
          <TransactionList
            language={language}
            selectedMonth={selectedMonth}
            transactions={transactions}
            onEdit={handleEditTransaction}
            onDelete={handleDeleteTransaction}
            onDeleteAll={handleDeleteAllMonthTransactions}
            onOpenNewTransaction={openExpenseModal}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            <button
              onClick={() => setIsDeveloperModalOpen(true)}
              className="text-left group hover:opacity-90 transition-opacity"
            >
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <span>Md. Mehedi Hassan Saon</span>
                <span className="text-[10px] font-mono-num font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                  V0.1
                </span>
              </div>
              <div className="text-[11px] text-slate-500">
                BSc. in EEE · Uttara University · <span className="text-emerald-700 font-medium">saon00024@gmail.com</span>
              </div>
            </button>
          </div>

          <div className="flex items-center gap-3">
            {transactions.length > 0 && (
              <button
                onClick={() => setIsClearAllModalOpen(true)}
                className="flex items-center gap-1.5 text-red-600 hover:text-red-700 transition-colors font-semibold"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isBn ? 'সব ডাটা মুছুন' : 'Wipe All Data'}</span>
              </button>
            )}

            <button
              onClick={() => setIsInstallModalOpen(true)}
              className="flex items-center gap-1.5 text-emerald-700 hover:text-emerald-800 transition-colors font-semibold"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isBn ? 'অ্যাপ ইনস্টল' : 'Install App'}</span>
            </button>

            <button
              onClick={() => setIsDeveloperModalOpen(true)}
              className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 transition-colors font-medium"
            >
              <UserCheck className="w-3.5 h-3.5 text-slate-500" />
              <span>{isBn ? 'ডেভেলপার পরিচিতি' : 'About Developer'}</span>
            </button>

            <button
              onClick={() => setIsBackupModalOpen(true)}
              className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 transition-colors font-medium"
            >
              <Database className="w-3.5 h-3.5 text-slate-500" />
              <span>{isBn ? 'ডাটা ব্যাকআপ / রিস্টোর' : 'Backup & Restore'}</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <TransactionModal
        isOpen={isTxModalOpen}
        onClose={() => {
          setIsTxModalOpen(false);
          setEditingTransaction(null);
        }}
        language={language}
        onSave={handleSaveTransaction}
        editingTransaction={editingTransaction}
        defaultType={txModalDefaultType}
      />

      <BudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        selectedMonth={selectedMonth}
        currentBudget={currentBudget}
        totalExpenseSoFar={totalExpense}
        language={language}
        onSaveBudget={handleSaveBudget}
      />

      <MonthlyReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        language={language}
        selectedMonth={selectedMonth}
        transactions={transactions}
        monthlyBudget={currentBudget}
      />

      <BackupModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        language={language}
        onDataChanged={reloadData}
      />

      <DeveloperModal
        isOpen={isDeveloperModalOpen}
        onClose={() => setIsDeveloperModalOpen(false)}
        language={language}
      />

      <InstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        language={language}
        onTriggerInstall={install}
        isInstallable={isInstallable}
        isInstalled={isInstalled}
      />

      {/* Dedicated Clear All Confirmation Modal */}
      {isClearAllModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="text-sm font-bold text-slate-900">
                  {isBn ? 'সব ডাটা মুছে ফেলতে চান?' : 'Clear All Data?'}
                </h3>
              </div>
              <button
                onClick={() => setIsClearAllModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 mb-5 leading-relaxed">
              {isBn
                ? 'আপনার অ্যাপের সকল খরচ, বাসা থেকে আসা টাকার হিসাব এবং বাজেট সীমা চিরতরে মুছে সম্পূর্ণ নতুন ও ফ্রেশ করা হবে। আপনি কি নিশ্চিত?'
                : 'All transactions, allowances, and budget settings will be permanently erased. Do you want to continue?'}
            </p>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsClearAllModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                {isBn ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleWipeEntireApp}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-red-600 text-white rounded-xl hover:bg-red-700 shadow-xs transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isBn ? 'হ্যাঁ, সব মুছে ফ্রেশ করুন' : 'Yes, Wipe Everything'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

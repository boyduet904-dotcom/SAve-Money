import React, { useState, useEffect } from 'react';
import {
  X,
  ArrowUpRight,
  ArrowDownLeft,
  Check,
  Calendar,
  CreditCard,
  Tag,
  AlignLeft,
} from 'lucide-react';
import {
  Language,
  PaymentMethod,
  Transaction,
  TransactionType,
} from '../types';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../utils/categories';
import { CategoryIcon } from './CategoryIcon';
import { getCurrentTime, getTodayDate } from '../utils/formatters';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onSave: (transaction: Omit<Transaction, 'id' | 'createdAt'> & { id?: string }) => void;
  editingTransaction?: Transaction | null;
  defaultType?: TransactionType;
}

const PAYMENT_METHODS: { id: PaymentMethod; nameBn: string; nameEn: string }[] = [
  { id: 'Cash', nameBn: 'ক্যাশ টাকা', nameEn: 'Cash' },
  { id: 'bKash', nameBn: 'বিকাশ (bKash)', nameEn: 'bKash' },
  { id: 'Nagad', nameBn: 'নগদ (Nagad)', nameEn: 'Nagad' },
  { id: 'Rocket', nameBn: 'রকেট (Rocket)', nameEn: 'Rocket' },
  { id: 'Bank', nameBn: 'ব্যাংক / কার্ড', nameEn: 'Bank / Card' },
  { id: 'Other', nameBn: 'অন্যান্য মাধ্যম', nameEn: 'Other' },
];

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  language,
  onSave,
  editingTransaction,
  defaultType = 'expense',
}) => {
  const isBn = language === 'bn';

  const [type, setType] = useState<TransactionType>(defaultType);
  const [amount, setAmount] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [category, setCategory] = useState<string>('food_mess');
  const [date, setDate] = useState<string>(getTodayDate());
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    if (editingTransaction) {
      setType(editingTransaction.type);
      setAmount(editingTransaction.amount.toString());
      setTitle(editingTransaction.title);
      setCategory(editingTransaction.category);
      setDate(editingTransaction.date);
      setPaymentMethod(editingTransaction.paymentMethod || 'Cash');
      setNotes(editingTransaction.notes || '');
    } else {
      setType(defaultType);
      setAmount('');
      setTitle('');
      setCategory(defaultType === 'income' ? 'home_money' : 'food_mess');
      setDate(getTodayDate());
      setPaymentMethod(defaultType === 'income' ? 'bKash' : 'Cash');
      setNotes('');
    }
  }, [editingTransaction, defaultType, isOpen]);

  if (!isOpen) return null;

  const currentCategories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || parsedAmount <= 0) return;

    onSave({
      id: editingTransaction ? editingTransaction.id : undefined,
      type,
      amount: parsedAmount,
      title: title.trim() || (type === 'income' ? (isBn ? 'বাসা থেকে প্রাপ্ত টাকা' : 'Money from Home') : (isBn ? 'দৈনিক খরচ' : 'Daily Expense')),
      category,
      date,
      time: editingTransaction?.time || getCurrentTime(),
      paymentMethod,
      notes: notes.trim(),
    });

    onClose();
  };

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    if (!editingTransaction) {
      setCategory(newType === 'income' ? 'home_money' : 'food_mess');
      if (newType === 'income' && paymentMethod === 'Cash') {
        setPaymentMethod('bKash');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900">
              {editingTransaction
                ? isBn
                  ? 'হিসাব পরিবর্তন বা আপডেট'
                  : 'Edit Transaction'
                : isBn
                ? 'নতুন লেনদেন এন্ট্রি'
                : 'New Entry'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-left">
          {/* Type Toggle: Expense vs Money from Home */}
          {!editingTransaction && (
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => handleTypeChange('expense')}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                  type === 'expense'
                    ? 'bg-white text-rose-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ArrowUpRight className="w-4 h-4" />
                <span>{isBn ? 'খরচের এন্ট্রি' : 'Daily Expense'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleTypeChange('income')}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                  type === 'income'
                    ? 'bg-white text-emerald-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ArrowDownLeft className="w-4 h-4" />
                <span>{isBn ? 'বাসা থেকে টাকা এড' : 'Money from Home'}</span>
              </button>
            </div>
          )}

          {/* Amount input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {isBn ? 'টাকার পরিমাণ (BDT)' : 'Amount'} <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">
                ৳
              </span>
              <input
                type="number"
                min="1"
                step="any"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="w-full pl-8 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-lg font-bold text-slate-900 font-mono-num focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                autoFocus
              />
            </div>
          </div>

          {/* Title / Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {isBn ? 'বিবরণ / শিরোনাম' : 'Description / Title'}{' '}
              <span className="text-slate-400 font-normal">
                {isBn ? '(যেমন: দুপুরের খাবার, আম্মু বিকাশ করছে)' : ''}
              </span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                type === 'income'
                  ? isBn
                    ? 'বাসা থেকে পাঠিয়েছে / হাতখরচ'
                    : 'Allowance from parents'
                  : isBn
                  ? 'কীসের খরচ? যেমন: মেস মিল, রিকশা ভাড়া'
                  : 'What was this spent on?'
              }
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          {/* Category Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              <span>{isBn ? 'ক্যাটেগরি নির্বাচন করুন' : 'Select Category'}</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto p-1">
              {currentCategories.map((cat) => {
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`flex items-center gap-2 p-2 rounded-xl text-left border transition-all ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-semibold shadow-xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div
                      className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor: isSelected ? cat.color : cat.bgLight,
                        color: isSelected ? '#ffffff' : cat.color,
                      }}
                    >
                      <CategoryIcon name={cat.iconName} className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs truncate">{isBn ? cat.nameBn : cat.nameEn}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date & Payment Method in 2 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{isBn ? 'তারিখ' : 'Date'}</span>
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono-num"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                <span>{isBn ? 'লেনদেনের মাধ্যম' : 'Payment Method'}</span>
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {PAYMENT_METHODS.map((pm) => (
                  <option key={pm.id} value={pm.id}>
                    {isBn ? pm.nameBn : pm.nameEn}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Optional Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <AlignLeft className="w-3.5 h-3.5 text-slate-400" />
              <span>{isBn ? 'অতিরিক্ত মন্তব্য (ঐচ্ছিক)' : 'Notes (Optional)'}</span>
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={isBn ? 'কোন বিশেষ তথ্য থাকলে লিখে রাখুন...' : 'Additional notes...'}
              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              {isBn ? 'বাতিল' : 'Cancel'}
            </button>
            <button
              type="submit"
              className={`flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white rounded-xl shadow-xs transition-colors ${
                type === 'income' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-slate-900 hover:bg-slate-800'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>
                {editingTransaction
                  ? isBn
                    ? 'আপডেট করুন'
                    : 'Update'
                  : type === 'income'
                  ? isBn
                    ? 'টাকা যোগ করুন'
                    : 'Add Allowance'
                  : isBn
                  ? 'খরচ সংরক্ষণ করুন'
                  : 'Save Expense'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

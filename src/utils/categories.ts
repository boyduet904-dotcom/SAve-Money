import { CategoryInfo } from '../types';

export const EXPENSE_CATEGORIES: CategoryInfo[] = [
  {
    id: 'food_mess',
    nameBn: 'খাবার ও মেস মিল',
    nameEn: 'Food & Meals',
    iconName: 'Utensils',
    color: '#ea580c', // orange-600
    bgLight: '#ffedd5', // orange-100
    type: 'expense',
  },
  {
    id: 'groceries',
    nameBn: 'কাঁচাবাজার ও মুদি',
    nameEn: 'Groceries',
    iconName: 'ShoppingBag',
    color: '#16a34a', // green-600
    bgLight: '#dcfce7',
    type: 'expense',
  },
  {
    id: 'rent',
    nameBn: 'মেস / রুম ভাড়া',
    nameEn: 'Rent / Accommodation',
    iconName: 'Home',
    color: '#0284c7', // sky-600
    bgLight: '#e0f2fe',
    type: 'expense',
  },
  {
    id: 'transport',
    nameBn: 'যাতায়াত ও রিকশা',
    nameEn: 'Transport',
    iconName: 'Bus',
    color: '#7c3aed', // violet-600
    bgLight: '#ede9fe',
    type: 'expense',
  },
  {
    id: 'snacks',
    nameBn: 'চা-নাশতা ও আড্ডা',
    nameEn: 'Tea & Snacks',
    iconName: 'Coffee',
    color: '#d97706', // amber-600
    bgLight: '#fef3c7',
    type: 'expense',
  },
  {
    id: 'education',
    nameBn: 'পড়াশোনা ও বইপত্র',
    nameEn: 'Education & Books',
    iconName: 'BookOpen',
    color: '#2563eb', // blue-600
    bgLight: '#dbeafe',
    type: 'expense',
  },
  {
    id: 'mobile_internet',
    nameBn: 'মোবাইল রিচার্জ ও নেট',
    nameEn: 'Mobile & Internet',
    iconName: 'Wifi',
    color: '#0d9488', // teal-600
    bgLight: '#ccfbf1',
    type: 'expense',
  },
  {
    id: 'utilities',
    nameBn: 'বিদ্যুৎ / ইউটিলিটি বিল',
    nameEn: 'Utility Bills',
    iconName: 'Zap',
    color: '#ca8a04', // yellow-600
    bgLight: '#fef9c3',
    type: 'expense',
  },
  {
    id: 'medicine',
    nameBn: 'চিকিৎসা ও ওষুধ',
    nameEn: 'Healthcare & Medicine',
    iconName: 'HeartPulse',
    color: '#e11d48', // rose-600
    bgLight: '#ffe4e6',
    type: 'expense',
  },
  {
    id: 'shopping',
    nameBn: 'পোশাক ও কেনাকাটা',
    nameEn: 'Shopping & Clothes',
    iconName: 'Shirt',
    color: '#9333ea', // purple-600
    bgLight: '#f3e8ff',
    type: 'expense',
  },
  {
    id: 'other_expense',
    nameBn: 'অন্যান্য খরচ',
    nameEn: 'Other Expenses',
    iconName: 'CircleEllipsis',
    color: '#64748b', // slate-500
    bgLight: '#f1f5f9',
    type: 'expense',
  },
];

export const INCOME_CATEGORIES: CategoryInfo[] = [
  {
    id: 'home_money',
    nameBn: 'বাসা থেকে পাঠানো টাকা',
    nameEn: 'Allowance from Home',
    iconName: 'Home',
    color: '#059669', // emerald-600
    bgLight: '#d1fae5',
    type: 'income',
  },
  {
    id: 'tuition',
    nameBn: 'টিউশনি / খণ্ডকালীন কাজ',
    nameEn: 'Tuition / Part-time',
    iconName: 'Briefcase',
    color: '#2563eb', // blue-600
    bgLight: '#dbeafe',
    type: 'income',
  },
  {
    id: 'gift_bonus',
    nameBn: 'উপহার / সালামি / বোনাস',
    nameEn: 'Gift / Bonus',
    iconName: 'Gift',
    color: '#d97706', // amber-600
    bgLight: '#fef3c7',
    type: 'income',
  },
  {
    id: 'loan_return',
    nameBn: 'ধার ফেরত পাওয়া',
    nameEn: 'Debt Repayment',
    iconName: 'ArrowDownLeft',
    color: '#0891b2', // cyan-600
    bgLight: '#cffafe',
    type: 'income',
  },
  {
    id: 'other_income',
    nameBn: 'অন্যান্য প্রাপ্তি',
    nameEn: 'Other Income',
    iconName: 'Wallet',
    color: '#4f46e5', // indigo-600
    bgLight: '#e0e7ff',
    type: 'income',
  },
];

export function getCategoryById(id: string): CategoryInfo {
  const found = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES].find((c) => c.id === id);
  if (found) return found;
  return {
    id: id || 'other_expense',
    nameBn: 'অন্যান্য',
    nameEn: 'Other',
    iconName: 'CircleEllipsis',
    color: '#64748b',
    bgLight: '#f1f5f9',
    type: 'expense',
  };
}

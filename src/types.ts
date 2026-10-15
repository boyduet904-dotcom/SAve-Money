export type TransactionType = 'expense' | 'income';

export type PaymentMethod = 'Cash' | 'bKash' | 'Nagad' | 'Rocket' | 'Bank' | 'Other';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  title: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:mm
  paymentMethod: PaymentMethod;
  notes?: string;
  createdAt: number;
}

export interface MonthlyBudget {
  month: string; // YYYY-MM
  amount: number; // Budget limit for this month
}

export interface CategoryInfo {
  id: string;
  nameBn: string;
  nameEn: string;
  iconName: string;
  color: string;
  bgLight: string;
  type: TransactionType;
}

export type Language = 'bn' | 'en';

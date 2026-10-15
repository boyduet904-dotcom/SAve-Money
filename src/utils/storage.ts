import { MonthlyBudget, Transaction } from '../types';

const TRANSACTIONS_KEY = 'takahishab_transactions_v2';
const OLD_TRANSACTIONS_KEY = 'takahishab_transactions_v1';
const BUDGETS_KEY = 'takahishab_budgets_v2';
const OLD_BUDGETS_KEY = 'takahishab_budgets_v1';

export function loadTransactions(): Transaction[] {
  try {
    // Clean up old sample data if present
    localStorage.removeItem(OLD_TRANSACTIONS_KEY);
    localStorage.removeItem(OLD_BUDGETS_KEY);

    const raw = localStorage.getItem(TRANSACTIONS_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    // Filter out any dummy initial sample records that start with 'tx_init_'
    const userOnly = parsed.filter((t: Transaction) => !t.id.startsWith('tx_init_'));
    if (userOnly.length !== parsed.length) {
      saveTransactions(userOnly);
    }
    return userOnly;
  } catch (err) {
    console.error('Failed to load transactions from localStorage', err);
    return [];
  }
}

export function saveTransactions(transactions: Transaction[]): void {
  try {
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
  } catch (err) {
    console.error('Failed to save transactions to localStorage', err);
  }
}

export function loadBudgets(): MonthlyBudget[] {
  try {
    const raw = localStorage.getItem(BUDGETS_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Failed to load budgets from localStorage', err);
    return [];
  }
}

export function saveBudgets(budgets: MonthlyBudget[]): void {
  try {
    localStorage.setItem(BUDGETS_KEY, JSON.stringify(budgets));
  } catch (err) {
    console.error('Failed to save budgets to localStorage', err);
  }
}

export function getBudgetForMonth(month: string): number {
  const budgets = loadBudgets();
  const found = budgets.find((b) => b.month === month);
  return found ? found.amount : 0;
}

export function setBudgetForMonth(month: string, amount: number): void {
  const budgets = loadBudgets();
  const index = budgets.findIndex((b) => b.month === month);
  if (index >= 0) {
    budgets[index].amount = amount;
  } else {
    budgets.push({ month, amount });
  }
  saveBudgets(budgets);
}

export function clearAllData(): void {
  try {
    localStorage.removeItem(TRANSACTIONS_KEY);
    localStorage.removeItem(OLD_TRANSACTIONS_KEY);
    localStorage.removeItem(BUDGETS_KEY);
    localStorage.removeItem(OLD_BUDGETS_KEY);
  } catch (err) {
    console.error('Failed to clear storage', err);
  }
}

export function exportDataAsJSON(): string {
  const transactions = loadTransactions();
  const budgets = loadBudgets();
  return JSON.stringify({ transactions, budgets, exportedAt: new Date().toISOString() }, null, 2);
}

export function importDataFromJSON(jsonString: string): boolean {
  try {
    const parsed = JSON.parse(jsonString);
    if (parsed && Array.isArray(parsed.transactions)) {
      saveTransactions(parsed.transactions);
      if (Array.isArray(parsed.budgets)) {
        saveBudgets(parsed.budgets);
      }
      return true;
    }
    return false;
  } catch (err) {
    console.error('Failed to import JSON data', err);
    return false;
  }
}

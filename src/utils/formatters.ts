import { Language } from '../types';

const BENGALI_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

const BENGALI_MONTHS = [
  'জানুয়ারি',
  'ফেব্রুয়ারি',
  'মার্চ',
  'এপ্রিল',
  'মে',
  'জুন',
  'জুলাই',
  'আগস্ট',
  'সেপ্টেম্বর',
  'অক্টোবর',
  'নভেম্বর',
  'ডিসেম্বর',
];

const ENGLISH_MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export function toBengaliDigits(input: string | number): string {
  const str = input.toString();
  return str.replace(/[0-9]/g, (digit) => BENGALI_DIGITS[parseInt(digit, 10)]);
}

export function formatCurrency(
  amount: number,
  language: Language = 'bn',
  showSymbol: boolean = true
): string {
  const rounded = Math.round(amount);
  const formattedWithCommas = new Intl.NumberFormat('en-IN').format(rounded);
  
  if (language === 'bn') {
    const bnNum = toBengaliDigits(formattedWithCommas);
    return showSymbol ? `৳ ${bnNum}` : bnNum;
  }
  return showSymbol ? `৳ ${formattedWithCommas}` : formattedWithCommas;
}

export function getTodayDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getCurrentMonth(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

export function getCurrentTime(): string {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function formatMonthName(yearMonth: string, language: Language = 'bn'): string {
  const [yearStr, monthStr] = yearMonth.split('-');
  const monthIdx = parseInt(monthStr, 10) - 1;
  const yearNum = parseInt(yearStr, 10);

  if (monthIdx < 0 || monthIdx > 11) return yearMonth;

  if (language === 'bn') {
    return `${BENGALI_MONTHS[monthIdx]} ${toBengaliDigits(yearNum)}`;
  }
  return `${ENGLISH_MONTHS[monthIdx]} ${yearNum}`;
}

export function formatDateReadable(dateStr: string, language: Language = 'bn'): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;

  const year = parseInt(parts[0], 10);
  const monthIdx = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);

  if (language === 'bn') {
    return `${toBengaliDigits(day)} ${BENGALI_MONTHS[monthIdx]}, ${toBengaliDigits(year)}`;
  }
  return `${day} ${ENGLISH_MONTHS[monthIdx]} ${year}`;
}

const BENGALI_SHORT_MONTHS = [
  'জানু',
  'ফেব',
  'মার্চ',
  'এপ্রিল',
  'মে',
  'জুন',
  'জুলাই',
  'আগস্ট',
  'সেপ্টে',
  'অক্টো',
  'নভে',
  'ডিসে',
];

const ENGLISH_SHORT_MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export function formatDateCompact(dateStr: string, language: Language = 'bn'): { day: string; month: string; year: string; full: string } {
  if (!dateStr) return { day: '', month: '', year: '', full: '' };
  const parts = dateStr.split('-');
  if (parts.length !== 3) return { day: dateStr, month: '', year: '', full: dateStr };

  const year = parseInt(parts[0], 10);
  const monthIdx = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);

  if (language === 'bn') {
    const dayBn = toBengaliDigits(day);
    const monthBn = BENGALI_SHORT_MONTHS[monthIdx] || '';
    const yearBn = toBengaliDigits(year);
    return {
      day: dayBn,
      month: monthBn,
      year: yearBn,
      full: `${dayBn} ${monthBn} ${yearBn}`,
    };
  }

  const dayEn = String(day);
  const monthEn = ENGLISH_SHORT_MONTHS[monthIdx] || '';
  const yearEn = String(year);
  return {
    day: dayEn,
    month: monthEn,
    year: yearEn,
    full: `${dayEn} ${monthEn} ${yearEn}`,
  };
}

export function formatTime12h(timeStr?: string, language: Language = 'bn'): string {
  if (!timeStr) return '';
  const [hourStr, minStr] = timeStr.split(':');
  let hour = parseInt(hourStr, 10);
  const min = minStr || '00';
  let period = hour >= 12 ? 'PM' : 'AM';
  let periodBn = hour >= 12 ? 'বিকাল/রাত' : 'সকাল';
  if (hour >= 18) periodBn = 'রাত';
  else if (hour >= 12) periodBn = 'দুপুর';
  else if (hour >= 6) periodBn = 'সকাল';
  else periodBn = 'রাত/ভোর';

  if (hour === 0) hour = 12;
  else if (hour > 12) hour -= 12;

  if (language === 'bn') {
    return `${periodBn} ${toBengaliDigits(hour)}:${toBengaliDigits(min)}`;
  }
  return `${hour}:${min} ${period}`;
}

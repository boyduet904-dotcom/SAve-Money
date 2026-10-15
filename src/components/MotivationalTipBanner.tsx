import React, { useState } from 'react';
import {
  Sparkles,
  Apple,
  Ban,
  TrendingDown,
  RefreshCw,
  ChevronRight,
  Heart,
  X,
  Lightbulb,
} from 'lucide-react';
import { Language } from '../types';

interface MotivationalTipBannerProps {
  language: Language;
}

interface AdviceItem {
  id: string;
  category: 'food' | 'saving' | 'health';
  categoryLabelBn: string;
  categoryLabelEn: string;
  quoteBn: string;
  quoteEn: string;
  subtextBn: string;
  subtextEn: string;
  actionBn: string;
  actionEn: string;
  type: 'avoid' | 'encourage' | 'save';
}

const TIPS_LIST: AdviceItem[] = [
  {
    id: 'tip_junk_food',
    category: 'food',
    categoryLabelBn: 'স্বাস্থ্য ও সাশ্রয়',
    categoryLabelEn: 'Health & Savings',
    quoteBn: 'বাইরের জাঙ্ক ফুড ও অতিরিক্ত কোল্ড ড্রিঙ্কস পরিহার করুন—টাকাও বাঁচবে, শরীরও সুস্থ থাকবে।',
    quoteEn: 'Skip processed junk food & sugary sodas—save your money and protect your health.',
    subtextBn:
      'বাইরের ভাজাপোড়া, বার্গার বা কোল্ড ড্রিঙ্কস সাময়িক তৃপ্তি দিলেও প্রতিদিনের বাজেটের বড় অংশ নষ্ট করে এবং গ্যাস্ট্রিক ও অসুস্থতা বাড়িয়ে চিকিৎসার বাড়তি খরচের কারণ হয়।',
    subtextEn:
      'Fast food and fried snacks drain your daily allowance and cause expensive health issues down the line.',
    actionBn: 'বাইরের জাঙ্ক ফুডের বদলে ডিম, কলা, ফলমূল বা মেসের সুষম খাবার খাওয়ার অভ্যাস গড়ে তুলুন।',
    actionEn: 'Choose boiled eggs, fresh fruits, vegetables, and clean home-cooked meals instead.',
    type: 'avoid',
  },
  {
    id: 'tip_homemade_healthy',
    category: 'food',
    categoryLabelBn: 'পুষ্টিকর খাদ্যাভ্যাস',
    categoryLabelEn: 'Nutritious Lifestyle',
    quoteBn: 'ঘরের তৈরি খাবার ও প্রচুর শাকসবজি খান: কম খরচে সেরা পুষ্টি।',
    quoteEn: 'Eat home-cooked food, fresh greens & seasonal fruits for peak health on a budget.',
    subtextBn:
      'প্রতিদিন মাত্র একটি ডিম, মৌসুমী ফল এবং বেশি করে পানি পানের অভ্যাস আপনার রোগপ্রতিরোধ ক্ষমতা বাড়ায়, ফলে ডাক্তারের পেছনে অপ্রয়োজনীয় খরচ হবে না।',
    subtextEn:
      'A daily egg, seasonal fruits, and plenty of clean water boost immunity and prevent hospital bills.',
    actionBn: 'দিনে অন্তত ২–৩ লিটার বিশুদ্ধ পানি পান করুন এবং সবসময় সাথে নিজের পানির বোতল রাখুন।',
    actionEn: 'Drink 2-3 liters of water and carry your own water bottle to save on packaged drinks.',
    type: 'encourage',
  },
  {
    id: 'tip_small_spends',
    category: 'saving',
    categoryLabelBn: 'দৈনিক খরচে নিয়ন্ত্রণ',
    categoryLabelEn: 'Daily Discipline',
    quoteBn: 'ছোট ছোট অপ্রয়োজনীয় খরচগুলো থামান—মাসের শেষে বড় সঞ্চয় দেখতে পাবেন।',
    quoteEn: 'Beware of tiny everyday expenses—a small leak can sink a great ship.',
    subtextBn:
      'প্রতিদিন বারবার চা-সিগারেট, অনর্থক রাইড শেয়ারিং বা শখের কেনাকাটায় ৫০–১০০ টাকা করে চলে যায়, যা মাসে ২,০০০–৩,০০০ টাকার ঘাটতি তৈরি করে।',
    subtextEn:
      'Small daily splurges of 50-100 BDT easily add up to 2,000-3,000 BDT wasted each month.',
    actionBn: 'কাছের দূরত্বে একটু হেঁটে যাতায়াত করুন; এতে ব্যায়ামও হবে, রিকশা ভাড়াও বাঁচবে।',
    actionEn: 'Walk short distances when possible—great for cardiovascular fitness and saves fare.',
    type: 'save',
  },
  {
    id: 'tip_impulse_buying',
    category: 'saving',
    categoryLabelBn: 'স্মার্ট চিন্তা',
    categoryLabelEn: 'Smart Mindset',
    quoteBn: 'কোনো কিছু কেনার আগে নিজেকে জিজ্ঞেস করুন: "এটা কি আমার সত্যিই দরকার নাকি সাময়িক ইচ্ছা?"',
    quoteEn: 'Before buying, ask: "Do I truly need this, or is it just an impulse desire?"',
    subtextBn:
      'অপ্রয়োজনীয় জিনিস কেনা বা বন্ধুদের পাল্লায় পড়ে অতিরিক্ত খরচ আপনার জরুরি সময়ের জমানো টাকাকে নষ্ট করে।',
    subtextEn:
      'Buying on impulse or peer pressure burns the money you need for rent, education, and genuine priorities.',
    actionBn: 'বড় খরচের ক্ষেত্রে ২৪ ঘণ্টার নিয়ম মেনে চলুন—একদিন অপেক্ষা করলে অপ্রয়োজনীয় আগ্রহ অনেক কমে যায়।',
    actionEn: 'Use the 24-hour rule: wait a day before non-essential purchases to curb impulsive buying.',
    type: 'avoid',
  },
  {
    id: 'tip_home_respect',
    category: 'saving',
    categoryLabelBn: 'বাসার পাঠানো টাকা',
    categoryLabelEn: 'Hard-Earned Money',
    quoteBn: 'বাসা থেকে যে টাকা পাঠানো হয়, তা পরিবারের বহু কষ্ট ও ত্যাগের ফল—প্রতিটি টাকা হিসেব করে খরচ করুন।',
    quoteEn: 'Money from home is earned with hard work and family sacrifice—honor it with mindful spending.',
    subtextBn:
      'বাবা-মায়ের পাঠানো টাকাকে আমানত মনে করে সঠিক খাতে ব্যয় করা এবং মাসের শেষ দিনগুলোতে আর্থিক কষ্টে না পড়ার সবচেয়ে ভালো উপায় হলো দৈনিক খরচের হিসাব রাখা।',
    subtextEn:
      'Track your expenses daily so you never run out of money before month-end and honor family support.',
    actionBn: 'বাজেট সীমা মেনে চলুন এবং মাস শেষে অন্তত ৫০০–১০০০ টাকা জরুরি সঞ্চয় হিসেবে রাখার চেষ্টা করুন।',
    actionEn: 'Stay strictly within your monthly budget and try to set aside an emergency buffer.',
    type: 'save',
  },
];

export const MotivationalTipBanner: React.FC<MotivationalTipBannerProps> = ({ language }) => {
  const isBn = language === 'bn';
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAllTipsModal, setShowAllTipsModal] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  const currentTip = TIPS_LIST[currentIndex];

  const handleNextTip = () => {
    setCurrentIndex((prev) => (prev + 1) % TIPS_LIST.length);
  };

  if (isDismissed) {
    return (
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setIsDismissed(false)}
          className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1 rounded-lg transition-colors"
        >
          <Lightbulb className="w-3.5 h-3.5 text-emerald-600" />
          <span>{isBn ? 'খরচ কমানো ও স্বাস্থ্য পরামর্শ দেখুন' : 'Show Health & Savings Tips'}</span>
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-sm mb-6 relative overflow-hidden border border-emerald-800/40">
        {/* Subtle background glow */}
        <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Left: Tip badge and main inspirational content */}
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                {isBn ? currentTip.categoryLabelBn : currentTip.categoryLabelEn}
              </span>

              <span className="text-[11px] text-emerald-200/70 font-medium">
                {isBn ? 'দৈনিক সুস্থতা ও সাশ্রয় পরামর্শ' : 'Daily Health & Budget Tip'}
              </span>
            </div>

            <p className="text-sm sm:text-base font-bold text-white tracking-tight leading-snug">
              "{isBn ? currentTip.quoteBn : currentTip.quoteEn}"
            </p>

            <p className="text-xs text-slate-300 leading-relaxed">
              {isBn ? currentTip.subtextBn : currentTip.subtextEn}
            </p>

            {/* Practical takeaway */}
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300 bg-black/25 px-2.5 py-1 rounded-lg border border-white/10 mt-1">
              <Heart className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span>{isBn ? currentTip.actionBn : currentTip.actionEn}</span>
            </div>
          </div>

          {/* Right: Actions (Next Tip, View All, Dismiss) */}
          <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-white/10 shrink-0">
            <div className="flex items-center gap-2">
              <button
                onClick={handleNextTip}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/15"
                title={isBn ? 'পরের পরামর্শ দেখুন' : 'Next Tip'}
              >
                <RefreshCw className="w-3 h-3 text-emerald-400" />
                <span>{isBn ? 'পরের টিপস' : 'Next Tip'}</span>
              </button>

              <button
                onClick={() => setShowAllTipsModal(true)}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shadow-xs"
              >
                <span>{isBn ? 'সকল পরামর্শ' : 'All Advice'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={() => setIsDismissed(true)}
              className="text-[11px] text-slate-400 hover:text-white transition-colors py-0.5 px-1"
              title={isBn ? 'লুকিয়ে রাখুন' : 'Hide for now'}
            >
              {isBn ? 'লুকান' : 'Dismiss'}
            </button>
          </div>
        </div>
      </div>

      {/* Modal containing full guide on reducing expenses & skipping junk food */}
      {showAllTipsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col text-slate-900">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/80">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Apple className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {isBn
                      ? 'খরচ কমানো এবং সুস্থ থাকার পূর্ণাঙ্গ গাইডলাইন'
                      : 'Healthy Eating & Smart Spending Guide'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {isBn
                      ? 'জাঙ্ক ফুড বর্জন, পুষ্টিকর খাবার গ্রহণ এবং অর্থ সাশ্রয়ের টিপস'
                      : 'Skip junk food, nourish your body, and save money every month'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAllTipsModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              {/* Highlight Box: Junk Food vs Healthy Food */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Avoid Box */}
                <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/50 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-rose-800">
                    <Ban className="w-4 h-4 text-rose-600" />
                    <span>{isBn ? 'যা এড়িয়ে চলবেন (ক্ষতিকর ও ব্যয়বহুল)' : 'Avoid These (Harmful & Costly)'}</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-slate-700 leading-relaxed">
                    <li>{isBn ? 'রাস্তার ভাজাপোড়া ও তেল চিটচিটে খাবার' : 'Oily street food & deep-fried snacks'}</li>
                    <li>{isBn ? 'কোমল পানীয়, এনার্জি ড্রিঙ্কস ও প্যাকেটজাত জুস' : 'Sodas, energy drinks & sugary beverages'}</li>
                    <li>{isBn ? 'দামি ফাস্টফুড (বার্গার, পিৎজা, রোল)' : 'Expensive burgers, pizza, and fast-food'}</li>
                    <li>{isBn ? 'সিগারেট ও অতিরিক্ত চা-কফি পানের অভ্যাস' : 'Smoking and excessive roadside tea trips'}</li>
                  </ul>
                </div>

                {/* Encourage Box */}
                <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                    <Apple className="w-4 h-4 text-emerald-600" />
                    <span>{isBn ? 'যা খাবেন (কম খরচে সেরা পুষ্টি)' : 'Eat These (Budget-Friendly Health)'}</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-slate-700 leading-relaxed">
                    <li>{isBn ? 'প্রতিদিন ১টি সিদ্ধ ডিম ও ১টি কলা' : '1 boiled egg and a banana daily'}</li>
                    <li>{isBn ? 'মেস বা ঘরের তৈরি ভাত, ডাল ও টাটকা শাকসবজি' : 'Clean rice, lentils (dal) and seasonal veggies'}</li>
                    <li>{isBn ? 'মৌসুমী সাশ্রয়ী ফল (পেয়ারা, আমলকী, পেঁপে)' : 'Local seasonal fruits (guava, papaya)'}</li>
                    <li>{isBn ? 'পর্যাপ্ত বিশুদ্ধ পানি (নিজস্ব বোতল সাথে রাখুন)' : 'Plenty of water (carry your own refill bottle)'}</li>
                  </ul>
                </div>
              </div>

              {/* Actionable Rules for Expense Control */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
                  <TrendingDown className="w-4 h-4 text-emerald-600" />
                  <span>{isBn ? 'দৈনিক খরচ নিয়ন্ত্রণে রাখার ৫টি সহজ কৌশল' : '5 Practical Rules to Cut Expenses'}</span>
                </h4>

                <div className="space-y-2 text-slate-600">
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                    <strong className="text-slate-900 block mb-0.5">
                      {isBn ? '১. খরচের সাথে সাথে লিখে রাখুন:' : '1. Log immediately:'}
                    </strong>
                    {isBn
                      ? 'টাকা খরচ হওয়ার সাথে সাথে টাকা হিসাব অ্যাপে এন্ট্রি করে ফেলুন। এতে দিন শেষে জানা যাবে কোথায় অনর্থক টাকা চলে গেল।'
                      : 'Record expenses right away in this tracker to stay mindful of where money leaks.'}
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                    <strong className="text-slate-900 block mb-0.5">
                      {isBn ? '২. বাজেট সীমাকে সম্মান করুন:' : '2. Respect the monthly budget limit:'}
                    </strong>
                    {isBn
                      ? 'মাসের শুরুতে যে বাজেট সীমা ঠিক করেছেন, তা কখনোই অতিক্রম করবেন না। অ্যাপের সতর্কতা বাতি হলুদ বা লাল হলে সাথে সাথে অপ্রয়োজনীয় ব্যয় বন্ধ করুন।'
                      : 'Never exceed your monthly budget threshold. If the alert turns amber or red, cut discretionary spending immediately.'}
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                    <strong className="text-slate-900 block mb-0.5">
                      {isBn ? '৩. বাইরের নাস্তায় রাশ টানুন:' : '3. Cut daily tea/snack rounds:'}
                    </strong>
                    {isBn
                      ? 'প্রতিদিন বন্ধুদের সাথে আড্ডায় একাধিকবার চা-বিস্কুট বা ভারী নাস্তা করলে মাসে ২,০০০ টাকার বেশি অপচয় হয়। সপ্তাহে ১–২ দিনের বেশি নয়।'
                      : 'Multiple roadside snacks and tea rounds easily waste thousands of BDT every month.'}
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                    <strong className="text-slate-900 block mb-0.5">
                      {isBn ? '৪. বাসা থেকে আসা টাকাকে সম্মান দিন:' : '4. Honor the money sent from home:'}
                    </strong>
                    {isBn
                      ? 'পরিবার বহু শ্রম ও কষ্ট সহ্য করে আপনার পড়াশোনা বা মেসের খরচের টাকা পাঠায়। অপ্রয়োজনীয় শখ বা ফুটানিতে তা নষ্ট না করে নিজের ভবিষ্যৎ গড়ুন।'
                      : 'Family works hard to send your allowance. Use it to build your future, not on temporary show-offs.'}
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowAllTipsModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors shadow-xs"
                >
                  {isBn ? 'বুঝেছি, মেনে চলব' : 'Got it, I will follow'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

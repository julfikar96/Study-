import React, { useState } from 'react';
import { Calendar, Target, Edit3, Check, Clock, Flame, ArrowUpRight } from 'lucide-react';
import { ExamTarget } from '../types';
import { formatNum } from '../utils/numberUtils';

interface ExamCountdownProps {
  examTarget: ExamTarget;
  onUpdateTarget: (target: ExamTarget) => void;
  numberFormat: 'bn' | 'en';
  remainingChapters: number;
}

const PRESET_EXAMS = [
  { title: 'SSC Board Exam 2026', monthOffset: 3 },
  { title: 'HSC Board Exam 2026', monthOffset: 6 },
  { title: 'Pre-Test / Model Test Exam', monthOffset: 1 },
  { title: 'Varsity / Medical Admission', monthOffset: 8 },
];

export const ExamCountdown: React.FC<ExamCountdownProps> = ({
  examTarget,
  onUpdateTarget,
  numberFormat,
  remainingChapters,
}) => {
  const isBn = numberFormat === 'bn';
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [title, setTitle] = useState<string>(examTarget.title);
  const [targetDate, setTargetDate] = useState<string>(examTarget.date);

  // Calculate days remaining
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(targetDate);
  target.setHours(0, 0, 0, 0);

  const diffTime = target.getTime() - today.getTime();
  const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  // Pace: chapters per day
  const chaptersPerDay = daysRemaining > 0 && remainingChapters > 0
    ? (remainingChapters / daysRemaining).toFixed(1)
    : '0';

  const handleSave = () => {
    onUpdateTarget({
      ...examTarget,
      title: title.trim() || 'Academic Target',
      date: targetDate,
    });
    setIsEditing(false);
  };

  const handleApplyPreset = (p: typeof PRESET_EXAMS[0]) => {
    const future = new Date();
    future.setMonth(future.getMonth() + p.monthOffset);
    const dStr = future.toISOString().slice(0, 10);
    setTitle(p.title);
    setTargetDate(dStr);
  };

  return (
    <div className="bg-white dark:bg-[#18191d] rounded-xl border border-stone-200/80 dark:border-zinc-800 p-4 sm:p-5 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left: Target title & badge */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400">
              <Target className="w-3.5 h-3.5" />
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Target Exam & Pace (পরীক্ষার লক্ষ্য ও গতি)
            </span>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 text-xs cursor-pointer p-0.5"
              title="Edit Exam Target"
            >
              <Edit3 className="w-3 h-3" />
            </button>
          </div>

          <h3 className="font-semibold text-stone-900 dark:text-stone-100 text-sm sm:text-base">
            {examTarget.title}
          </h3>
          <p className="text-[11px] text-stone-400 dark:text-stone-500 font-mono">
            তারিখ: {new Date(examTarget.date).toLocaleDateString(isBn ? 'bn-BD' : 'en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </p>
        </div>

        {/* Right: Days remaining & chapters/day metrics */}
        <div className="flex items-center gap-3">
          {/* Metric: Days remaining */}
          <div className="px-3.5 py-2 rounded-lg bg-stone-50 dark:bg-zinc-850/60 border border-stone-200/70 dark:border-zinc-800 text-center min-w-[90px]">
            <span className="block text-2xl font-bold font-mono text-amber-600 dark:text-amber-400 leading-none">
              {formatNum(daysRemaining, isBn)}
            </span>
            <span className="text-[10px] text-stone-500 dark:text-stone-400 font-medium">
              দিন বাকি (Days Left)
            </span>
          </div>

          {/* Metric: Target Pace */}
          <div className="px-3.5 py-2 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/60 text-center min-w-[110px]">
            <span className="block text-2xl font-bold font-mono text-emerald-700 dark:text-emerald-400 leading-none">
              {formatNum(chaptersPerDay, isBn)}
            </span>
            <span className="text-[10px] text-emerald-800 dark:text-emerald-300 font-medium">
              অধ্যায়/দিন প্রয়োজন
            </span>
          </div>
        </div>
      </div>

      {/* Editing Form */}
      {isEditing && (
        <div className="mt-4 pt-3 border-t border-stone-200/70 dark:border-zinc-800 space-y-3 text-xs">
          <div className="flex flex-wrap gap-1.5">
            <span className="text-[11px] text-stone-400 self-center mr-1">Presets:</span>
            {PRESET_EXAMS.map((p) => (
              <button
                key={p.title}
                type="button"
                onClick={() => handleApplyPreset(p)}
                className="px-2 py-0.5 rounded bg-stone-100 dark:bg-zinc-800 hover:bg-stone-200 dark:hover:bg-zinc-700 text-stone-600 dark:text-stone-300 text-[11px] cursor-pointer"
              >
                {p.title}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] text-stone-600 dark:text-stone-400 mb-1">
                পরীক্ষা / লক্ষ্যের নাম:
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 rounded-md focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] text-stone-600 dark:text-stone-400 mb-1">
                পরীক্ষার তারিখ (Target Date):
              </label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 rounded-md focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 rounded bg-stone-100 dark:bg-zinc-800 text-stone-600 dark:text-stone-400 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-1 rounded bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 font-medium cursor-pointer"
            >
              Save Target
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

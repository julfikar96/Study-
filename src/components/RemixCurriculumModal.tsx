import React, { useState } from 'react';
import { X, Sparkles, Check, BookOpen, Layers, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';
import { CURRICULUM_PRESETS } from '../data/curriculumPresets';
import { CurriculumPreset } from '../types';
import { formatNum } from '../utils/numberUtils';
import { SubjectIcon } from './SubjectIcon';

interface RemixCurriculumModalProps {
  isOpen: boolean;
  onClose: () => void;
  activePresetId?: string;
  onApplyPreset: (preset: CurriculumPreset, keepMatchingProgress: boolean) => void;
  numberFormat: 'bn' | 'en';
}

export const RemixCurriculumModal: React.FC<RemixCurriculumModalProps> = ({
  isOpen,
  onClose,
  activePresetId,
  onApplyPreset,
  numberFormat,
}) => {
  const isBn = numberFormat === 'bn';
  const [selectedPresetId, setSelectedPresetId] = useState<string>(activePresetId || 'ssc-science-full');
  const [keepProgress, setKeepProgress] = useState<boolean>(true);
  const [confirmed, setConfirmed] = useState<boolean>(false);

  if (!isOpen) return null;

  const selectedPreset = CURRICULUM_PRESETS.find((p) => p.id === selectedPresetId) || CURRICULUM_PRESETS[0];
  const totalChapters = selectedPreset.subjects.reduce((sum, s) => sum + s.count, 0);

  const handleApply = () => {
    onApplyPreset(selectedPreset, keepProgress);
    setConfirmed(true);
    setTimeout(() => {
      setConfirmed(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/50 backdrop-blur-xs">
      <div className="bg-white dark:bg-[#18191d] rounded-2xl max-w-2xl w-full border border-stone-200/80 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-200/70 dark:border-zinc-800 flex items-center justify-between bg-stone-50/70 dark:bg-zinc-850/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 dark:bg-emerald-500 text-white flex items-center justify-center shadow-2xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm sm:text-base text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <span>Remix Syllabus (সিলেবাস রিমিক্স)</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-mono uppercase tracking-wider">
                  Presets
                </span>
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                আপনার ক্লাস ও বিভাগ অনুযায়ী সাজানো সিলেবাস টেমপ্লেট নির্বাচন করুন
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-lg cursor-pointer hover:bg-stone-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1">
          {/* Preset Selector Grid */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block">
              Choose Curriculum Track (বিভাগ বা ট্র্যাক নির্বাচন):
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {CURRICULUM_PRESETS.map((preset) => {
                const isSelected = selectedPreset.id === preset.id;
                const pTotalCh = preset.subjects.reduce((sum, s) => sum + s.count, 0);

                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setSelectedPresetId(preset.id)}
                    className={`text-left p-3 rounded-xl border transition-all cursor-pointer relative ${
                      isSelected
                        ? 'border-emerald-600 dark:border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20 shadow-2xs ring-1 ring-emerald-500/20'
                        : 'border-stone-200/80 dark:border-zinc-800 hover:border-stone-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-850/30'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1">
                      <div className="font-semibold text-xs text-stone-900 dark:text-stone-100 leading-tight">
                        {preset.title}
                      </div>
                      {isSelected && (
                        <div className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 line-clamp-1">
                      {preset.bnTitle}
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-[10px] text-stone-400 dark:text-stone-500 font-mono">
                      <span>{formatNum(preset.subjects.length, isBn)} বিষয়</span>
                      <span>•</span>
                      <span>{formatNum(pTotalCh, isBn)} অধ্যায়</span>
                      <span className="ml-auto text-[9px] px-1.5 py-0.2 rounded bg-stone-100 dark:bg-zinc-800 text-stone-600 dark:text-stone-300">
                        {preset.badge.split(' ')[0]}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detailed Preview of Selected Preset */}
          <div className="bg-stone-50/80 dark:bg-zinc-850/50 rounded-xl border border-stone-200/80 dark:border-zinc-800 p-3.5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200/60 dark:border-zinc-800/80 pb-2.5">
              <div>
                <span className="text-xs font-semibold text-stone-900 dark:text-stone-100 block">
                  {selectedPreset.title} — সিলেবাস প্রিভিউ
                </span>
                <span className="text-[11px] text-stone-500 dark:text-stone-400">
                  {selectedPreset.description}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono font-medium text-emerald-700 dark:text-emerald-400">
                <span className="px-2 py-0.5 rounded bg-white dark:bg-zinc-800 border border-stone-200/60 dark:border-zinc-700">
                  {formatNum(selectedPreset.subjects.length, isBn)} Subjects
                </span>
                <span className="px-2 py-0.5 rounded bg-white dark:bg-zinc-800 border border-stone-200/60 dark:border-zinc-700">
                  {formatNum(totalChapters, isBn)} Chapters
                </span>
              </div>
            </div>

            {/* Subject pill badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-44 overflow-y-auto pr-1">
              {selectedPreset.subjects.map((sub, i) => (
                <div
                  key={sub.id}
                  className="flex items-center gap-2 p-2 rounded-lg bg-white dark:bg-zinc-900 border border-stone-200/70 dark:border-zinc-800 text-xs"
                >
                  <div className="w-5 h-5 rounded bg-stone-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 text-stone-600 dark:text-stone-300">
                    <SubjectIcon name={sub.icon} className="w-3 h-3" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-stone-800 dark:text-stone-200 truncate text-[11px]">
                      {sub.bnName || sub.name}
                    </div>
                    <div className="text-[10px] text-stone-400 font-mono">
                      {formatNum(sub.count, isBn)} অধ্যায়
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Merge vs Fresh Start Option */}
          <div className="p-3.5 rounded-xl border border-stone-200/70 dark:border-zinc-800 bg-white dark:bg-zinc-850/30 space-y-2">
            <span className="text-xs font-semibold text-stone-700 dark:text-stone-300 block">
              Remix Strategy (প্রগ্রেস অপশন):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <label
                onClick={() => setKeepProgress(true)}
                className={`flex items-start gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-all ${
                  keepProgress
                    ? 'border-emerald-600 dark:border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/20 ring-1 ring-emerald-500/20'
                    : 'border-stone-200/80 dark:border-zinc-800'
                }`}
              >
                <input
                  type="radio"
                  name="remix-strategy"
                  checked={keepProgress}
                  onChange={() => setKeepProgress(true)}
                  className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                />
                <div>
                  <span className="font-medium text-stone-900 dark:text-stone-100 block">
                    Keep Matching Progress (প্রগ্রেস ধরে রাখুন)
                  </span>
                  <span className="text-[11px] text-stone-500 dark:text-stone-400 block mt-0.5">
                    যেসব বিষয় ও অধ্যায় পূর্বে টিক করা ছিল, সেগুলো স্বয়ংক্রিয়ভাবে সংরক্ষিত থাকবে।
                  </span>
                </div>
              </label>

              <label
                onClick={() => setKeepProgress(false)}
                className={`flex items-start gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-all ${
                  !keepProgress
                    ? 'border-emerald-600 dark:border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/20 ring-1 ring-emerald-500/20'
                    : 'border-stone-200/80 dark:border-zinc-800'
                }`}
              >
                <input
                  type="radio"
                  name="remix-strategy"
                  checked={!keepProgress}
                  onChange={() => setKeepProgress(false)}
                  className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                />
                <div>
                  <span className="font-medium text-stone-900 dark:text-stone-100 block">
                    Fresh Clean Start (সম্পূর্ণ নতুন শুরু)
                  </span>
                  <span className="text-[11px] text-stone-500 dark:text-stone-400 block mt-0.5">
                    নির্বাচিত ট্র্যাকের সকল অধ্যায় ০% থেকে ফ্রেশভাবে শুরু হবে।
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-stone-200/70 dark:border-zinc-800 flex items-center justify-between bg-stone-50/50 dark:bg-zinc-850/40">
          <div className="text-[11px] text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>কোনো ডেটা হারানোর ভয় নেই (পরে সেটিংস থেকে রিস্টোর সম্ভব)</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-stone-600 dark:text-stone-400 hover:bg-stone-200/60 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-all cursor-pointer shadow-sm hover:shadow active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{confirmed ? 'Applied!' : 'Apply & Remix Now'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

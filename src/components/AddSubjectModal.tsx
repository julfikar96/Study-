import React, { useState } from 'react';
import { X, Plus, Sparkles } from 'lucide-react';
import { SubjectIcon } from './SubjectIcon';

interface AddSubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (params: {
    name: string;
    bnName?: string;
    chapterCount: number;
    color: string;
    icon: string;
  }) => void;
}

const PRESETS = [
  { name: 'English 1st Paper', bnName: 'ইংরেজি ১ম পত্র', count: 15, icon: 'BookOpen' },
  { name: 'English 2nd Paper', bnName: 'ইংরেজি ২য় পত্র', count: 12, icon: 'FileText' },
  { name: 'Agriculture Studies', bnName: 'কৃষি শিক্ষা', count: 7, icon: 'Globe' },
  { name: 'Home Science', bnName: 'গার্হস্থ্য বিজ্ঞান', count: 8, icon: 'Award' },
];

const ICONS = [
  'BookOpen',
  'BookMarked',
  'Calculator',
  'Sigma',
  'Atom',
  'FlaskConical',
  'Dna',
  'Globe',
  'Cpu',
  'FileText',
  'Award',
  'Bookmark',
];

export const AddSubjectModal: React.FC<AddSubjectModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [bnName, setBnName] = useState('');
  const [chapterCount, setChapterCount] = useState<number>(10);
  const [icon, setIcon] = useState<string>('BookOpen');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({
      name: name.trim(),
      bnName: bnName.trim() || undefined,
      chapterCount: Math.max(1, Math.min(chapterCount || 10, 100)),
      color: 'stone',
      icon,
    });
    setName('');
    setBnName('');
    onClose();
  };

  const handlePresetClick = (p: typeof PRESETS[0]) => {
    setName(p.name);
    setBnName(p.bnName);
    setChapterCount(p.count);
    setIcon(p.icon);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/40 backdrop-blur-xs">
      <div className="bg-white dark:bg-[#18191d] rounded-xl max-w-md w-full border border-stone-200/80 dark:border-zinc-800 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-200/70 dark:border-zinc-800 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-sm text-stone-900 dark:text-stone-100">
              Add New Subject (বাকি বিষয় যোগ করুন)
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              আপনার অবশিষ্ট বিষয়সমূহ ও অধ্যায় সংখ্যা নির্ধারণ করুন
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-md cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Quick presets */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-medium text-stone-500 dark:text-stone-400">
              জনপ্রিয় বিষয় থেকে নির্বাচন করুন:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {PRESETS.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => handlePresetClick(p)}
                  className="px-2 py-1 rounded bg-stone-100 dark:bg-zinc-800 hover:bg-stone-200/80 dark:hover:bg-zinc-700 text-stone-700 dark:text-stone-300 transition-colors cursor-pointer text-xs"
                >
                  {p.bnName} ({p.count})
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div className="space-y-1">
            <label className="block font-medium text-stone-700 dark:text-stone-300">
              Subject Name (বিষয়ের নাম) *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. English 1st Paper"
              className="w-full px-3 py-2 bg-stone-50 dark:bg-zinc-800/80 border border-stone-200/80 dark:border-zinc-700 rounded-md focus:outline-none focus:border-stone-400"
            />
          </div>

          {/* Bengali Name */}
          <div className="space-y-1">
            <label className="block font-medium text-stone-700 dark:text-stone-300">
              বাংলা নাম (ঐচ্ছিক)
            </label>
            <input
              type="text"
              value={bnName}
              onChange={(e) => setBnName(e.target.value)}
              placeholder="যেমন: ইংরেজি ১ম পত্র"
              className="w-full px-3 py-2 bg-stone-50 dark:bg-zinc-800/80 border border-stone-200/80 dark:border-zinc-700 rounded-md focus:outline-none focus:border-stone-400"
            />
          </div>

          {/* Chapter count */}
          <div className="space-y-1">
            <label className="block font-medium text-stone-700 dark:text-stone-300">
              Number of Chapters (অধ্যায় সংখ্যা)
            </label>
            <input
              type="number"
              min={1}
              max={100}
              required
              value={chapterCount}
              onChange={(e) => setChapterCount(parseInt(e.target.value, 10) || 1)}
              className="w-full px-3 py-2 bg-stone-50 dark:bg-zinc-800/80 border border-stone-200/80 dark:border-zinc-700 rounded-md focus:outline-none focus:border-stone-400"
            />
          </div>

          {/* Icon Selection */}
          <div className="space-y-1.5">
            <label className="block font-medium text-stone-700 dark:text-stone-300">
              Icon
            </label>
            <div className="grid grid-cols-6 gap-1.5">
              {ICONS.map((ic) => (
                <button
                  key={ic}
                  type="button"
                  onClick={() => setIcon(ic)}
                  className={`p-2 rounded-md border flex items-center justify-center transition-colors cursor-pointer ${
                    icon === ic
                      ? 'border-stone-900 dark:border-stone-100 bg-stone-100 dark:bg-zinc-800 text-stone-900 dark:text-stone-100'
                      : 'border-stone-200/70 dark:border-zinc-750 text-stone-500 hover:bg-stone-50 dark:hover:bg-zinc-800'
                  }`}
                >
                  <SubjectIcon name={ic} className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-stone-200/70 dark:border-zinc-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-md text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-zinc-800 font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3.5 py-1.5 rounded-md bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 font-medium hover:opacity-90 cursor-pointer shadow-2xs"
            >
              Create Subject
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

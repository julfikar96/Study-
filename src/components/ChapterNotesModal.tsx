import React, { useState, useEffect } from 'react';
import { X, FileText, Check, Save } from 'lucide-react';
import { Chapter } from '../types';

interface ChapterNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  chapter: Chapter | null;
  subjectName: string;
  onSaveNotes: (chapterId: string, notes: string) => void;
}

export const ChapterNotesModal: React.FC<ChapterNotesModalProps> = ({
  isOpen,
  onClose,
  chapter,
  subjectName,
  onSaveNotes,
}) => {
  const [content, setContent] = useState('');

  useEffect(() => {
    if (chapter) {
      setContent(chapter.notes || '');
    }
  }, [chapter]);

  if (!isOpen || !chapter) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveNotes(chapter.id, content);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/40 backdrop-blur-xs">
      <div className="bg-white dark:bg-[#18191d] rounded-xl max-w-lg w-full border border-stone-200/80 dark:border-zinc-800 shadow-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-stone-200/70 dark:border-zinc-800 flex items-center justify-between bg-stone-50/70 dark:bg-zinc-850/40">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-500" />
            <div>
              <h3 className="font-semibold text-xs sm:text-sm text-stone-900 dark:text-stone-100">
                {chapter.name} — নোট ও সূত্র
              </h3>
              <p className="text-[11px] text-stone-400">
                {subjectName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-md cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSave} className="p-4 space-y-3 flex-1 flex flex-col">
          <label className="block text-xs text-stone-600 dark:text-stone-300">
            এই অধ্যায়ের গুরুত্বপূর্ণ সূত্র, নিয়মাবলী বা রিভিশন নোট লিখে রাখুন:
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            placeholder="উদাহরণ: গুরুত্বপূর্ণ সূত্র, বিগত বছরের বোর্ড প্রশ্নের ধরন, যে টপিকগুলো বেশি আসে..."
            className="w-full p-3 text-xs bg-stone-50 dark:bg-zinc-800/80 border border-stone-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:border-emerald-500 leading-relaxed resize-y font-sans"
          />

          <div className="pt-2 flex items-center justify-between">
            <span className="text-[11px] text-stone-400 font-mono">
              {content.length} characters
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-zinc-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Notes</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

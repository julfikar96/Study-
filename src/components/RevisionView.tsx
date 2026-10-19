import React, { useState, useMemo } from 'react';
import {
  RotateCcw,
  Check,
  Search,
  Filter,
  CheckCircle2,
  ArrowRight,
  Star,
} from 'lucide-react';
import { Subject, Chapter, TaskType } from '../types';
import { formatNum, formatPercent } from '../utils/numberUtils';
import { SubjectIcon } from './SubjectIcon';

interface RevisionViewProps {
  subjects: Subject[];
  numberFormat: 'bn' | 'en';
  onToggleCheckbox: (subjectId: string, chapterId: string, task: TaskType) => void;
  onSelectSubject: (subjectId: string) => void;
}

export const RevisionView: React.FC<RevisionViewProps> = ({
  subjects,
  numberFormat,
  onToggleCheckbox,
  onSelectSubject,
}) => {
  const isBn = numberFormat === 'bn';
  const [filterType, setFilterType] = useState<'all-pending' | 'starred' | 'need-chapter' | 'need-mcq' | 'need-cq'>('all-pending');
  const [search, setSearch] = useState('');

  // Collect pending chapters across all subjects
  const pendingBySubject = useMemo(() => {
    return subjects
      .map((sub) => {
        const filtered = sub.chapters.filter((ch) => {
          if (search.trim()) {
            const q = search.toLowerCase();
            const matchesName = ch.name.toLowerCase().includes(q);
            const matchesSub = sub.name.toLowerCase().includes(q);
            if (!matchesName && !matchesSub) return false;
          }

          if (filterType === 'starred') return !!ch.isPriority;
          if (filterType === 'need-chapter') return !ch.chapterDone;
          if (filterType === 'need-mcq') return !ch.mcqDone;
          if (filterType === 'need-cq') return !ch.cqDone;
          return !ch.chapterDone || !ch.mcqDone || !ch.cqDone;
        });

        return {
          subject: sub,
          chapters: filtered,
        };
      })
      .filter((item) => item.chapters.length > 0);
  }, [subjects, filterType, search]);

  const totalPendingChapters = pendingBySubject.reduce((acc, curr) => acc + curr.chapters.length, 0);

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <span>Revision Queue (রিভিশন ও বাকি কাজ)</span>
            <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-stone-100 dark:bg-zinc-800 text-stone-600 dark:text-stone-300">
              {formatNum(totalPendingChapters, isBn)}টি অধ্যায় তালিকাভুক্ত
            </span>
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            যেসব অধ্যায়ের কাজ এখনো বাকি আছে বা স্টার করা, তা এক নজরে দেখে সরাসরি সম্পন্ন করুন।
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 p-0.5 bg-stone-100/80 dark:bg-zinc-850 rounded-lg border border-stone-200/60 dark:border-zinc-750 text-xs self-start sm:self-auto flex-wrap">
          <button
            onClick={() => setFilterType('all-pending')}
            className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer text-xs ${
              filterType === 'all-pending'
                ? 'bg-white dark:bg-zinc-700 text-stone-900 dark:text-stone-100 font-medium shadow-2xs'
                : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            All Pending
          </button>
          <button
            onClick={() => setFilterType('starred')}
            className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer text-xs inline-flex items-center gap-1 ${
              filterType === 'starred'
                ? 'bg-white dark:bg-zinc-700 text-stone-900 dark:text-stone-100 font-medium shadow-2xs'
                : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
            <span>Starred</span>
          </button>
          <button
            onClick={() => setFilterType('need-chapter')}
            className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer text-xs ${
              filterType === 'need-chapter'
                ? 'bg-white dark:bg-zinc-700 text-stone-900 dark:text-stone-100 font-medium shadow-2xs'
                : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            অধ্যায় বাকি
          </button>
          <button
            onClick={() => setFilterType('need-mcq')}
            className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer text-xs ${
              filterType === 'need-mcq'
                ? 'bg-white dark:bg-zinc-700 text-stone-900 dark:text-stone-100 font-medium shadow-2xs'
                : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            MCQ বাকি
          </button>
          <button
            onClick={() => setFilterType('need-cq')}
            className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer text-xs ${
              filterType === 'need-cq'
                ? 'bg-white dark:bg-zinc-700 text-stone-900 dark:text-stone-100 font-medium shadow-2xs'
                : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            CQ বাকি
          </button>
        </div>
      </div>

      {/* List of Pending Chapters grouped by Subject */}
      {pendingBySubject.length === 0 ? (
        <div className="bg-white dark:bg-[#18191d] rounded-xl border border-stone-200/80 dark:border-zinc-800 p-12 text-center space-y-2">
          <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
          <h3 className="font-semibold text-stone-900 dark:text-stone-100 text-base">
            সব কাজ সম্পূর্ণ!
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            এই ফিল্টারে কোনো বাকি অধ্যায় নেই। আপনি সিলেবাসের সকল লক্ষ্য অর্জন করেছেন।
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingBySubject.map(({ subject, chapters }) => (
            <div
              key={subject.id}
              className="bg-white dark:bg-[#18191d] rounded-xl border border-stone-200/80 dark:border-zinc-800 shadow-2xs overflow-hidden"
            >
              {/* Subject Group Header */}
              <div className="px-4 py-2.5 bg-stone-50/70 dark:bg-zinc-850/50 border-b border-stone-200/70 dark:border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded bg-stone-100 dark:bg-zinc-800 flex items-center justify-center text-stone-600 dark:text-stone-300">
                    <SubjectIcon name={subject.icon} className="w-3 h-3" />
                  </div>
                  <span className="font-semibold text-xs text-stone-900 dark:text-stone-100">
                    {subject.name}
                  </span>
                  <span className="text-[10px] text-stone-400 font-mono">
                    ({formatNum(chapters.length, isBn)}টি অধ্যায় বাকি)
                  </span>
                </div>

                <button
                  onClick={() => onSelectSubject(subject.id)}
                  className="text-xs text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 font-medium inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>বিষয়ে যান</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* Chapters List */}
              <div className="divide-y divide-stone-200/60 dark:divide-zinc-800/70">
                {chapters.map((chapter) => (
                  <div
                    key={chapter.id}
                    className="p-3 sm:px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 hover:bg-stone-50/50 dark:hover:bg-zinc-850/30 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {chapter.isPriority && (
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
                      )}
                      <span className="w-5 h-5 rounded bg-stone-100 dark:bg-zinc-800 text-stone-600 dark:text-stone-400 text-xs font-mono font-medium flex items-center justify-center shrink-0">
                        {formatNum(chapter.order, isBn)}
                      </span>
                      <span className="text-xs font-medium text-stone-800 dark:text-stone-200 truncate">
                        {chapter.name}
                      </span>
                    </div>

                    {/* Three tasks inline */}
                    <div className="flex items-center gap-1.5 self-end sm:self-auto">
                      <button
                        onClick={() => onToggleCheckbox(subject.id, chapter.id, 'chapterDone')}
                        className={`px-2.5 py-1 rounded text-xs font-medium border cursor-pointer select-none ${
                          chapter.chapterDone
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                            : 'bg-stone-50 dark:bg-zinc-800 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-zinc-700 hover:border-stone-400'
                        }`}
                      >
                        অধ্যায় {chapter.chapterDone ? '✓' : ''}
                      </button>
                      <button
                        onClick={() => onToggleCheckbox(subject.id, chapter.id, 'mcqDone')}
                        className={`px-2.5 py-1 rounded text-xs font-medium border cursor-pointer select-none ${
                          chapter.mcqDone
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                            : 'bg-stone-50 dark:bg-zinc-800 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-zinc-700 hover:border-stone-400'
                        }`}
                      >
                        MCQ {chapter.mcqDone ? '✓' : ''}
                      </button>
                      <button
                        onClick={() => onToggleCheckbox(subject.id, chapter.id, 'cqDone')}
                        className={`px-2.5 py-1 rounded text-xs font-medium border cursor-pointer select-none ${
                          chapter.cqDone
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                            : 'bg-stone-50 dark:bg-zinc-800 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-zinc-700 hover:border-stone-400'
                        }`}
                      >
                        CQ {chapter.cqDone ? '✓' : ''}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

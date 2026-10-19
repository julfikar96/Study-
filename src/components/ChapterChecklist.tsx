import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Check,
  Search,
  Plus,
  Edit2,
  X,
  RotateCcw,
  SlidersHorizontal,
  ChevronRight,
  MoreHorizontal,
  CheckCheck,
  Star,
  FileText,
  Repeat,
  Trash2,
} from 'lucide-react';
import { Subject, Chapter, TaskType, ChapterFilter } from '../types';
import { formatNum, formatPercent, toBnNumber } from '../utils/numberUtils';
import { SubjectIcon } from './SubjectIcon';
import { ChapterNotesModal } from './ChapterNotesModal';

interface ChapterChecklistProps {
  subject: Subject;
  numberFormat: 'bn' | 'en';
  onBack: () => void;
  onToggleCheckbox: (subjectId: string, chapterId: string, task: TaskType) => void;
  onTogglePriority?: (subjectId: string, chapterId: string) => void;
  onIncrementRevision?: (subjectId: string, chapterId: string) => void;
  onUpdateNotes?: (subjectId: string, chapterId: string, notes: string) => void;
  onRenameChapter: (subjectId: string, chapterId: string, newName: string) => void;
  onAddChapter: (subjectId: string, name?: string) => void;
  onDeleteChapter: (subjectId: string, chapterId: string) => void;
  onBulkSetTasks: (subjectId: string, task: TaskType, value: boolean) => void;
  onResetSubject: (subjectId: string) => void;
}

export const ChapterChecklist: React.FC<ChapterChecklistProps> = ({
  subject,
  numberFormat,
  onBack,
  onToggleCheckbox,
  onTogglePriority,
  onIncrementRevision,
  onUpdateNotes,
  onRenameChapter,
  onAddChapter,
  onDeleteChapter,
  onBulkSetTasks,
  onResetSubject,
}) => {
  const isBn = numberFormat === 'bn';

  // State for inline chapter editing
  const [editingChapterId, setEditingChapterId] = useState<string | null>(null);
  const [editNameValue, setEditNameValue] = useState<string>('');

  // Chapter Notes modal
  const [activeNotesChapter, setActiveNotesChapter] = useState<Chapter | null>(null);

  // Search & Filter
  const [chapterSearch, setChapterSearch] = useState<string>('');
  const [filter, setFilter] = useState<ChapterFilter>('all');
  const [showBulkMenu, setShowBulkMenu] = useState<boolean>(false);
  const [isAddingChapter, setIsAddingChapter] = useState<boolean>(false);
  const [newChapterInput, setNewChapterInput] = useState<string>('');

  // Feedback toast
  const [savedIndicator, setSavedIndicator] = useState<string | null>(null);

  // Compute stats for current subject
  const subjectTotal = subject.chapters.length;
  let chDoneCount = 0;
  let mcqDoneCount = 0;
  let cqDoneCount = 0;
  let allDoneCount = 0;
  let priorityCount = 0;

  subject.chapters.forEach((ch) => {
    if (ch.chapterDone) chDoneCount++;
    if (ch.mcqDone) mcqDoneCount++;
    if (ch.cqDone) cqDoneCount++;
    if (ch.chapterDone && ch.mcqDone && ch.cqDone) allDoneCount++;
    if (ch.isPriority) priorityCount++;
  });

  const overallSubPct = formatPercent(
    chDoneCount + mcqDoneCount + cqDoneCount,
    subjectTotal * 3,
    isBn
  );

  const handleStartEdit = (chapter: Chapter) => {
    setEditingChapterId(chapter.id);
    setEditNameValue(chapter.name);
  };

  const handleSaveEdit = (chapterId: string) => {
    if (editNameValue.trim()) {
      onRenameChapter(subject.id, chapterId, editNameValue.trim());
      showFeedback('অধ্যায়ের নাম পরিবর্তিত হয়েছে');
    }
    setEditingChapterId(null);
  };

  const handleCancelEdit = () => {
    setEditingChapterId(null);
    setEditNameValue('');
  };

  const showFeedback = (msg: string) => {
    setSavedIndicator(msg);
    setTimeout(() => {
      setSavedIndicator(null);
    }, 1800);
  };

  const handleToggle = (chapter: Chapter, task: TaskType) => {
    onToggleCheckbox(subject.id, chapter.id, task);
    showFeedback('সংরক্ষিত');
  };

  const handleCreateChapter = (e: React.FormEvent) => {
    e.preventDefault();
    onAddChapter(subject.id, newChapterInput.trim() || undefined);
    setNewChapterInput('');
    setIsAddingChapter(false);
    showFeedback('নতুন অধ্যায় যুক্ত হয়েছে');
  };

  // Filtered chapters
  const filteredChapters = useMemo(() => {
    return subject.chapters.filter((ch) => {
      if (chapterSearch.trim()) {
        const q = chapterSearch.toLowerCase();
        const matchesName = ch.name.toLowerCase().includes(q);
        const matchesOrder = String(ch.order).includes(q) || formatNum(ch.order, true).includes(q);
        if (!matchesName && !matchesOrder) return false;
      }

      if (filter === 'priority') {
        return !!ch.isPriority;
      }
      if (filter === 'pending') {
        return !ch.chapterDone || !ch.mcqDone || !ch.cqDone;
      }
      if (filter === 'completed') {
        return ch.chapterDone && ch.mcqDone && ch.cqDone;
      }
      if (filter === 'needChapter') {
        return !ch.chapterDone;
      }
      if (filter === 'needMcq') {
        return !ch.mcqDone;
      }
      if (filter === 'needCq') {
        return !ch.cqDone;
      }
      return true;
    });
  }, [subject.chapters, chapterSearch, filter]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2">
      {/* 1. Subtle Breadcrumbs and Back Navigation */}
      <div className="flex items-center justify-between">
        <nav className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400">
          <button
            onClick={onBack}
            className="hover:text-stone-900 dark:hover:text-stone-100 font-medium inline-flex items-center gap-1 cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Overview</span>
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-stone-300 dark:text-stone-600" />
          <span className="font-semibold text-stone-900 dark:text-stone-100">
            {subject.name}
          </span>
        </nav>

        {/* Small unobtrusive feedback indicator */}
        {savedIndicator && (
          <div className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800 transition-opacity">
            ✓ {savedIndicator}
          </div>
        )}
      </div>

      {/* 2. Subject Title & Progress Card */}
      <div className="bg-white dark:bg-[#18191d] rounded-xl border border-stone-200/80 dark:border-zinc-800 p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-stone-100 dark:bg-zinc-800 border border-stone-200/60 dark:border-zinc-700/60 flex items-center justify-center shrink-0 text-stone-700 dark:text-stone-200 mt-0.5 shadow-2xs">
              <SubjectIcon name={subject.icon} className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-100">
                  {subject.name}
                </h1>
                {subjectTotal === allDoneCount && subjectTotal > 0 && (
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/80">
                    সম্পূর্ণ শেষ
                  </span>
                )}
                {priorityCount > 0 && (
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/80 inline-flex items-center gap-1">
                    <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                    <span>{formatNum(priorityCount, isBn)} গুরুত্বপূর্ণ</span>
                  </span>
                )}
              </div>
              {subject.bnName && subject.bnName !== subject.name && (
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  {subject.bnName}
                </p>
              )}
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 self-start sm:self-auto text-xs font-mono">
            <div className="text-right">
              <span className="block text-stone-900 dark:text-stone-100 font-semibold text-sm">
                {formatNum(chDoneCount, isBn)} / {formatNum(subjectTotal, isBn)}
              </span>
              <span className="text-[10px] text-stone-400 uppercase">
                অধ্যায় সম্পন্ন
              </span>
            </div>
            <div className="h-7 w-px bg-stone-200 dark:bg-zinc-800" />
            <div className="text-right">
              <span className="block text-stone-900 dark:text-stone-100 font-semibold text-sm">
                {overallSubPct.text}
              </span>
              <span className="text-[10px] text-stone-400 uppercase">
                সামগ্রিক সমাপ্তি
              </span>
            </div>
          </div>
        </div>

        {/* Thin Progress bar */}
        <div className="space-y-1">
          <div className="w-full bg-stone-100 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-600 dark:bg-emerald-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, Math.max(0, overallSubPct.percent))}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[11px] font-mono text-stone-400">
            <span>MCQ: {formatNum(mcqDoneCount, isBn)}/{formatNum(subjectTotal, isBn)}</span>
            <span>CQ: {formatNum(cqDoneCount, isBn)}/{formatNum(subjectTotal, isBn)}</span>
          </div>
        </div>
      </div>

      {/* 3. Controls Bar: Search, Filters, and Bulk Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-xs">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={chapterSearch}
            onChange={(e) => setChapterSearch(e.target.value)}
            placeholder="Search chapters..."
            className="w-full pl-8 pr-7 py-1.5 text-xs bg-white dark:bg-[#18191d] border border-stone-200/80 dark:border-zinc-800 rounded-lg focus:outline-none focus:border-stone-400 dark:focus:border-zinc-600 text-stone-900 dark:text-stone-100 placeholder:text-stone-400"
          />
          {chapterSearch && (
            <button
              onClick={() => setChapterSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Pills & Bulk Action */}
        <div className="flex items-center gap-1.5 flex-wrap sm:flex-nowrap">
          <div className="flex items-center gap-1 p-0.5 bg-stone-100/80 dark:bg-zinc-850 rounded-lg border border-stone-200/60 dark:border-zinc-750 text-xs">
            <button
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer text-xs ${
                filter === 'all'
                  ? 'bg-white dark:bg-zinc-700 text-stone-900 dark:text-stone-100 font-medium shadow-2xs'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              All ({formatNum(subject.chapters.length, isBn)})
            </button>
            <button
              onClick={() => setFilter('priority')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer text-xs inline-flex items-center gap-1 ${
                filter === 'priority'
                  ? 'bg-white dark:bg-zinc-700 text-stone-900 dark:text-stone-100 font-medium shadow-2xs'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <Star className="w-3 h-3 text-amber-500" />
              <span>Starred ({formatNum(priorityCount, isBn)})</span>
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer text-xs ${
                filter === 'pending'
                  ? 'bg-white dark:bg-zinc-700 text-stone-900 dark:text-stone-100 font-medium shadow-2xs'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer text-xs ${
                filter === 'completed'
                  ? 'bg-white dark:bg-zinc-700 text-stone-900 dark:text-stone-100 font-medium shadow-2xs'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              Done ({formatNum(allDoneCount, isBn)})
            </button>
          </div>

          {/* Add Chapter Button */}
          <button
            onClick={() => setIsAddingChapter(!isAddingChapter)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-stone-200/80 dark:border-zinc-800 bg-white dark:bg-[#18191d] hover:bg-stone-50 dark:hover:bg-zinc-850 text-stone-700 dark:text-stone-300 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-600" />
            <span>Add Chapter</span>
          </button>

          {/* Bulk Action Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowBulkMenu(!showBulkMenu)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-stone-200/80 dark:border-zinc-800 bg-white dark:bg-[#18191d] hover:bg-stone-50 dark:hover:bg-zinc-850 text-stone-700 dark:text-stone-300 transition-colors cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5 text-stone-500" />
              <span>Bulk Actions</span>
            </button>

            {showBulkMenu && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setShowBulkMenu(false)}
                />
                <div className="absolute right-0 mt-1.5 w-60 bg-white dark:bg-[#18191d] rounded-lg shadow-lg border border-stone-200/80 dark:border-zinc-800 p-1.5 z-30 space-y-0.5 text-xs">
                  <div className="px-2 py-1 text-[10px] font-semibold text-stone-400 uppercase tracking-wider">
                    এক ক্লিকে সব চিহ্নিত করুন
                  </div>
                  <button
                    onClick={() => {
                      onBulkSetTasks(subject.id, 'chapterDone', true);
                      setShowBulkMenu(false);
                      showFeedback('সব অধ্যায় সমাপ্ত চিহ্নিত হয়েছে');
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-stone-100 dark:hover:bg-zinc-800 text-stone-700 dark:text-stone-200 font-medium flex items-center justify-between"
                  >
                    <span>Mark all Chapters (অধ্যায় শেষ)</span>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  </button>
                  <button
                    onClick={() => {
                      onBulkSetTasks(subject.id, 'mcqDone', true);
                      setShowBulkMenu(false);
                      showFeedback('সব MCQ সমাপ্ত চিহ্নিত হয়েছে');
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-stone-100 dark:hover:bg-zinc-800 text-stone-700 dark:text-stone-200 font-medium flex items-center justify-between"
                  >
                    <span>Mark all MCQs (MCQ শেষ)</span>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  </button>
                  <button
                    onClick={() => {
                      onBulkSetTasks(subject.id, 'cqDone', true);
                      setShowBulkMenu(false);
                      showFeedback('সব CQ সমাপ্ত চিহ্নিত হয়েছে');
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-stone-100 dark:hover:bg-zinc-800 text-stone-700 dark:text-stone-200 font-medium flex items-center justify-between"
                  >
                    <span>Mark all CQs (CQ শেষ)</span>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  </button>
                  <div className="border-t border-stone-100 dark:border-zinc-800 my-1" />
                  <button
                    onClick={() => {
                      if (window.confirm(`আপনি কি "${subject.name}" বিষয়ের সকল টিকচিহ্ন মুছে ফেলতে চান?`)) {
                        onResetSubject(subject.id);
                        showFeedback('সকল টিকচিহ্ন মুছে ফেলা হয়েছে');
                      }
                      setShowBulkMenu(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-medium flex items-center justify-between"
                  >
                    <span>Clear all in this subject</span>
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Add Chapter Form */}
      {isAddingChapter && (
        <form onSubmit={handleCreateChapter} className="flex items-center gap-2 p-3 bg-white dark:bg-[#18191d] rounded-xl border border-emerald-300 dark:border-emerald-800">
          <input
            type="text"
            value={newChapterInput}
            onChange={(e) => setNewChapterInput(e.target.value)}
            placeholder={`অধ্যায়ের নাম (ডিফল্ট: অধ্যায় ${toBnNumber(subject.chapters.length + 1)})`}
            className="flex-1 px-3 py-1.5 text-xs bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 rounded-lg focus:outline-none"
            autoFocus
          />
          <button
            type="submit"
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
          >
            Add
          </button>
          <button
            type="button"
            onClick={() => setIsAddingChapter(false)}
            className="px-3 py-1.5 bg-stone-100 dark:bg-zinc-800 text-stone-600 dark:text-stone-300 rounded-lg text-xs cursor-pointer"
          >
            Cancel
          </button>
        </form>
      )}

      {/* 4. Desktop Table Layout */}
      <div className="hidden md:block bg-white dark:bg-[#18191d] rounded-xl border border-stone-200/80 dark:border-zinc-800 shadow-2xs overflow-hidden">
        {/* Table Column Headers */}
        <div className="grid grid-cols-12 px-5 py-2.5 bg-stone-50/70 dark:bg-zinc-850/50 border-b border-stone-200/80 dark:border-zinc-800 text-[11px] font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
          <div className="col-span-6 flex items-center gap-2">
            <span>Chapter (অধ্যায়)</span>
          </div>
          <div className="col-span-2 text-center">
            <span>অধ্যায় শেষ</span>
          </div>
          <div className="col-span-2 text-center">
            <span>MCQ শেষ</span>
          </div>
          <div className="col-span-2 text-center">
            <span>CQ শেষ</span>
          </div>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-stone-200/60 dark:divide-zinc-800/70">
          {filteredChapters.length === 0 ? (
            <div className="py-12 text-center text-xs text-stone-400">
              কোনো অধ্যায় পাওয়া যায়নি। ফিল্টার বা সার্চ পরিবর্তন করুন।
            </div>
          ) : (
            filteredChapters.map((chapter) => {
              const isAllDone = chapter.chapterDone && chapter.mcqDone && chapter.cqDone;
              const isEditing = editingChapterId === chapter.id;

              return (
                <div
                  key={chapter.id}
                  className={`grid grid-cols-12 px-5 py-3 items-center transition-colors group ${
                    isAllDone
                      ? 'bg-stone-50/50 dark:bg-zinc-850/20'
                      : 'hover:bg-stone-50/60 dark:hover:bg-zinc-850/40'
                  }`}
                >
                  {/* Column 1: Chapter Name, Star, Revision, Notes */}
                  <div className="col-span-6 flex items-center gap-2.5 pr-4 min-w-0">
                    {/* Star Priority Button */}
                    <button
                      type="button"
                      onClick={() => onTogglePriority?.(subject.id, chapter.id)}
                      className={`p-1 rounded cursor-pointer transition-colors ${
                        chapter.isPriority
                          ? 'text-amber-500'
                          : 'text-stone-300 dark:text-stone-600 hover:text-amber-400'
                      }`}
                      title={chapter.isPriority ? 'Remove Star (গুরুত্বপূর্ণ)' : 'Star Chapter (গুরুত্বপূর্ণ হিসেবে চিহ্নিত করুন)'}
                    >
                      <Star className={`w-3.5 h-3.5 ${chapter.isPriority ? 'fill-amber-500' : ''}`} />
                    </button>

                    <span className="w-6 h-6 rounded bg-stone-100 dark:bg-zinc-800 text-stone-600 dark:text-stone-400 text-xs font-mono font-medium flex items-center justify-center shrink-0">
                      {formatNum(chapter.order, isBn)}
                    </span>

                    {isEditing ? (
                      <div className="flex items-center gap-1.5 flex-1 min-w-0">
                        <input
                          type="text"
                          value={editNameValue}
                          onChange={(e) => setEditNameValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveEdit(chapter.id);
                            if (e.key === 'Escape') handleCancelEdit();
                          }}
                          autoFocus
                          className="w-full px-2 py-1 text-xs bg-white dark:bg-zinc-900 border border-stone-400 dark:border-zinc-500 rounded focus:outline-none"
                        />
                        <button
                          onClick={() => handleSaveEdit(chapter.id)}
                          className="p-1 text-emerald-600 hover:text-emerald-700 cursor-pointer"
                          title="Save"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="p-1 text-stone-400 hover:text-stone-600 cursor-pointer"
                          title="Cancel"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span
                          onClick={() => handleStartEdit(chapter)}
                          className={`text-xs font-medium cursor-pointer hover:text-stone-900 dark:hover:text-stone-100 leading-relaxed transition-colors truncate ${
                            isAllDone
                              ? 'text-stone-900 dark:text-stone-100'
                              : 'text-stone-800 dark:text-stone-200'
                          }`}
                          title="অধ্যায়ের নাম পরিবর্তন করতে ক্লিক করুন"
                        >
                          {chapter.name}
                        </span>

                        {/* Revision Counter Badge */}
                        <button
                          type="button"
                          onClick={() => onIncrementRevision?.(subject.id, chapter.id)}
                          className="text-[10px] font-mono px-1.5 py-0.2 rounded border border-stone-200/80 dark:border-zinc-750 bg-stone-50 dark:bg-zinc-800 hover:bg-stone-100 text-stone-600 dark:text-stone-400 cursor-pointer shrink-0"
                          title="Revision count (রিভিশন সংখ্যা পরিবর্তন করুন)"
                        >
                          Rev {formatNum(chapter.revisionCount || 0, isBn)}x
                        </button>

                        {/* Notes Icon */}
                        <button
                          type="button"
                          onClick={() => setActiveNotesChapter(chapter)}
                          className={`p-1 rounded cursor-pointer transition-colors shrink-0 ${
                            chapter.notes
                              ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40'
                              : 'opacity-0 group-hover:opacity-100 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300'
                          }`}
                          title={chapter.notes ? 'View Notes' : 'Add Chapter Note'}
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleStartEdit(chapter)}
                          className="opacity-0 group-hover:opacity-100 p-0.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-opacity cursor-pointer shrink-0"
                          title="Rename chapter"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>

                        <button
                          onClick={() => {
                            if (window.confirm(`অধ্যায় "${chapter.name}" মুছে ফেলতে চান?`)) {
                              onDeleteChapter(subject.id, chapter.id);
                            }
                          }}
                          className="opacity-0 group-hover:opacity-100 p-0.5 text-stone-400 hover:text-rose-600 transition-opacity cursor-pointer shrink-0 ml-auto"
                          title="Delete chapter"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Column 2: Checkbox 1 (অধ্যায় শেষ) */}
                  <div className="col-span-2 flex justify-center">
                    <button
                      type="button"
                      onClick={() => handleToggle(chapter, 'chapterDone')}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer select-none ${
                        chapter.chapterDone
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/80 shadow-2xs'
                          : 'bg-stone-50 dark:bg-zinc-800 text-stone-600 dark:text-stone-400 border border-stone-200/80 dark:border-zinc-700/80 hover:border-stone-400'
                      }`}
                    >
                      <span
                        className={`w-3.5 h-3.5 rounded flex items-center justify-center transition-colors ${
                          chapter.chapterDone
                            ? 'bg-emerald-600 text-white'
                            : 'border border-stone-300 dark:border-zinc-600'
                        }`}
                      >
                        {chapter.chapterDone && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </span>
                      <span className="text-[11px]">অধ্যায় শেষ</span>
                    </button>
                  </div>

                  {/* Column 3: Checkbox 2 (MCQ শেষ) */}
                  <div className="col-span-2 flex justify-center">
                    <button
                      type="button"
                      onClick={() => handleToggle(chapter, 'mcqDone')}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer select-none ${
                        chapter.mcqDone
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/80 shadow-2xs'
                          : 'bg-stone-50 dark:bg-zinc-800 text-stone-600 dark:text-stone-400 border border-stone-200/80 dark:border-zinc-700/80 hover:border-stone-400'
                      }`}
                    >
                      <span
                        className={`w-3.5 h-3.5 rounded flex items-center justify-center transition-colors ${
                          chapter.mcqDone
                            ? 'bg-emerald-600 text-white'
                            : 'border border-stone-300 dark:border-zinc-600'
                        }`}
                      >
                        {chapter.mcqDone && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </span>
                      <span className="text-[11px]">MCQ শেষ</span>
                    </button>
                  </div>

                  {/* Column 4: Checkbox 3 (CQ শেষ) */}
                  <div className="col-span-2 flex justify-center">
                    <button
                      type="button"
                      onClick={() => handleToggle(chapter, 'cqDone')}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer select-none ${
                        chapter.cqDone
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/80 shadow-2xs'
                          : 'bg-stone-50 dark:bg-zinc-800 text-stone-600 dark:text-stone-400 border border-stone-200/80 dark:border-zinc-700/80 hover:border-stone-400'
                      }`}
                    >
                      <span
                        className={`w-3.5 h-3.5 rounded flex items-center justify-center transition-colors ${
                          chapter.cqDone
                            ? 'bg-emerald-600 text-white'
                            : 'border border-stone-300 dark:border-zinc-600'
                        }`}
                      >
                        {chapter.cqDone && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </span>
                      <span className="text-[11px]">CQ শেষ</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 5. Mobile Layout */}
      <div className="md:hidden space-y-2.5">
        {filteredChapters.map((chapter) => {
          const isAllDone = chapter.chapterDone && chapter.mcqDone && chapter.cqDone;
          const isEditing = editingChapterId === chapter.id;

          return (
            <div
              key={chapter.id}
              className={`p-3.5 rounded-xl border transition-colors bg-white dark:bg-[#18191d] ${
                isAllDone
                  ? 'border-emerald-300/80 dark:border-emerald-800/50'
                  : 'border-stone-200/80 dark:border-zinc-800'
              }`}
            >
              {/* Top: Chapter Order, Star & Name */}
              <div className="flex items-center gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => onTogglePriority?.(subject.id, chapter.id)}
                  className={`p-0.5 rounded cursor-pointer ${
                    chapter.isPriority ? 'text-amber-500' : 'text-stone-300 dark:text-stone-600'
                  }`}
                >
                  <Star className={`w-3.5 h-3.5 ${chapter.isPriority ? 'fill-amber-500' : ''}`} />
                </button>

                <span className="w-5 h-5 rounded bg-stone-100 dark:bg-zinc-800 text-stone-600 dark:text-stone-400 text-xs font-mono font-medium flex items-center justify-center shrink-0">
                  {formatNum(chapter.order, isBn)}
                </span>

                {isEditing ? (
                  <div className="flex items-center gap-1.5 flex-1">
                    <input
                      type="text"
                      value={editNameValue}
                      onChange={(e) => setEditNameValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveEdit(chapter.id);
                        if (e.key === 'Escape') handleCancelEdit();
                      }}
                      autoFocus
                      className="w-full px-2 py-1 text-xs bg-white dark:bg-zinc-900 border border-stone-400 rounded focus:outline-none"
                    />
                    <button
                      onClick={() => handleSaveEdit(chapter.id)}
                      className="p-1 text-emerald-600"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between flex-1 min-w-0">
                    <span
                      onClick={() => handleStartEdit(chapter)}
                      className="text-xs font-medium text-stone-900 dark:text-stone-100 truncate cursor-pointer"
                    >
                      {chapter.name}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => onIncrementRevision?.(subject.id, chapter.id)}
                        className="text-[10px] font-mono px-1 py-0.2 rounded border border-stone-200 dark:border-zinc-700 text-stone-600 dark:text-stone-400"
                      >
                        {formatNum(chapter.revisionCount || 0, isBn)}x
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveNotesChapter(chapter)}
                        className={`p-1 ${chapter.notes ? 'text-emerald-600' : 'text-stone-400'}`}
                      >
                        <FileText className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleStartEdit(chapter)}
                        className="p-1 text-stone-400"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Three Checkbox buttons */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleToggle(chapter, 'chapterDone')}
                  className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium border cursor-pointer select-none ${
                    chapter.chapterDone
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                      : 'bg-stone-50 dark:bg-zinc-800 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-zinc-700'
                  }`}
                >
                  <span
                    className={`w-3.5 h-3.5 rounded flex items-center justify-center ${
                      chapter.chapterDone ? 'bg-emerald-600 text-white' : 'border border-stone-300'
                    }`}
                  >
                    {chapter.chapterDone && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </span>
                  <span className="text-[11px]">অধ্যায়</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleToggle(chapter, 'mcqDone')}
                  className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium border cursor-pointer select-none ${
                    chapter.mcqDone
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                      : 'bg-stone-50 dark:bg-zinc-800 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-zinc-700'
                  }`}
                >
                  <span
                    className={`w-3.5 h-3.5 rounded flex items-center justify-center ${
                      chapter.mcqDone ? 'bg-emerald-600 text-white' : 'border border-stone-300'
                    }`}
                  >
                    {chapter.mcqDone && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </span>
                  <span className="text-[11px]">MCQ</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleToggle(chapter, 'cqDone')}
                  className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium border cursor-pointer select-none ${
                    chapter.cqDone
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                      : 'bg-stone-50 dark:bg-zinc-800 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-zinc-700'
                  }`}
                >
                  <span
                    className={`w-3.5 h-3.5 rounded flex items-center justify-center ${
                      chapter.cqDone ? 'bg-emerald-600 text-white' : 'border border-stone-300'
                    }`}
                  >
                    {chapter.cqDone && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </span>
                  <span className="text-[11px]">CQ</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chapter Notes Modal */}
      <ChapterNotesModal
        isOpen={!!activeNotesChapter}
        onClose={() => setActiveNotesChapter(null)}
        chapter={activeNotesChapter}
        subjectName={subject.name}
        onSaveNotes={(chapterId, notes) => {
          onUpdateNotes?.(subject.id, chapterId, notes);
          showFeedback('নোট সংরক্ষিত হয়েছে');
        }}
      />
    </div>
  );
};

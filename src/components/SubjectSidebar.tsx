import React from 'react';
import {
  LayoutDashboard,
  BookOpen,
  RotateCcw,
  Settings,
  Plus,
  X,
  CheckCircle2,
  ChevronRight,
  Layers,
  Sparkles,
} from 'lucide-react';
import { Subject } from '../types';
import { SubjectIcon } from './SubjectIcon';
import { formatNum } from '../utils/numberUtils';

export type NavView = 'overview' | 'all-subjects' | 'revision';

interface SubjectSidebarProps {
  subjects: Subject[];
  currentNav: NavView;
  selectedSubjectId: string | null;
  onSelectNav: (nav: NavView) => void;
  onSelectSubject: (id: string | null) => void;
  onOpenSettings: () => void;
  onOpenAddSubject: () => void;
  onOpenRemixCurriculum: () => void;
  numberFormat: 'bn' | 'en';
  stats: {
    totalChapters: number;
    chaptersDone: number;
    subjectStatsMap: Record<string, { allDone: number; total: number; overallPercent: number; chapterDone: number }>;
  };
  isOpenOnMobile: boolean;
  onCloseMobile: () => void;
}

export const SubjectSidebar: React.FC<SubjectSidebarProps> = ({
  subjects,
  currentNav,
  selectedSubjectId,
  onSelectNav,
  onSelectSubject,
  onOpenSettings,
  onOpenAddSubject,
  onOpenRemixCurriculum,
  numberFormat,
  stats,
  isOpenOnMobile,
  onCloseMobile,
}) => {
  const isBn = numberFormat === 'bn';

  // Calculate chapters needing revision/completion
  const pendingChaptersCount = Math.max(0, stats.totalChapters - stats.chaptersDone);

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#fbfbfa] dark:bg-[#15161a] border-r border-stone-200/80 dark:border-zinc-800 text-stone-700 dark:text-stone-300 select-none">
      {/* Brand Header */}
      <div className="px-5 py-4 border-b border-stone-200/60 dark:border-zinc-800/80 flex items-center justify-between">
        <div
          onClick={() => {
            onSelectNav('overview');
            onSelectSubject(null);
            onCloseMobile();
          }}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-6 h-6 rounded-md bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 flex items-center justify-center font-bold text-xs tracking-tighter">
            ST
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-semibold text-sm tracking-tight text-stone-900 dark:text-stone-100">
              StudyTrack
            </span>
            <span className="text-[10px] uppercase font-mono text-emerald-600 dark:text-emerald-400 font-semibold tracking-wider">
              REMIX
            </span>
          </div>
        </div>

        <button
          onClick={onCloseMobile}
          className="lg:hidden p-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-md cursor-pointer"
          aria-label="Close menu"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main Navigation */}
      <div className="p-3 space-y-0.5">
        <button
          onClick={() => {
            onSelectNav('overview');
            onSelectSubject(null);
            onCloseMobile();
          }}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            currentNav === 'overview' && !selectedSubjectId
              ? 'bg-stone-200/70 dark:bg-zinc-800 text-stone-900 dark:text-stone-100 font-semibold shadow-2xs'
              : 'hover:bg-stone-100 dark:hover:bg-zinc-850 text-stone-600 dark:text-stone-400'
          }`}
        >
          <LayoutDashboard className="w-4 h-4 shrink-0 text-stone-500 dark:text-stone-400" />
          <span className="flex-1 text-left">Overview (সারসংক্ষেপ)</span>
        </button>

        <button
          onClick={() => {
            onSelectNav('all-subjects');
            onSelectSubject(null);
            onCloseMobile();
          }}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            currentNav === 'all-subjects' && !selectedSubjectId
              ? 'bg-stone-200/70 dark:bg-zinc-800 text-stone-900 dark:text-stone-100 font-semibold shadow-2xs'
              : 'hover:bg-stone-100 dark:hover:bg-zinc-850 text-stone-600 dark:text-stone-400'
          }`}
        >
          <BookOpen className="w-4 h-4 shrink-0 text-stone-500 dark:text-stone-400" />
          <span className="flex-1 text-left">All Subjects (সকল বিষয়)</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-stone-200/60 dark:bg-zinc-800 text-stone-600 dark:text-stone-400">
            {formatNum(subjects.length, isBn)}
          </span>
        </button>

        <button
          onClick={() => {
            onSelectNav('revision');
            onSelectSubject(null);
            onCloseMobile();
          }}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            currentNav === 'revision' && !selectedSubjectId
              ? 'bg-stone-200/70 dark:bg-zinc-800 text-stone-900 dark:text-stone-100 font-semibold shadow-2xs'
              : 'hover:bg-stone-100 dark:hover:bg-zinc-850 text-stone-600 dark:text-stone-400'
          }`}
        >
          <RotateCcw className="w-4 h-4 shrink-0 text-stone-500 dark:text-stone-400" />
          <span className="flex-1 text-left">Revision (বাকি অধ্যায়)</span>
          {pendingChaptersCount > 0 && (
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-stone-200/60 dark:bg-zinc-800 text-stone-600 dark:text-stone-400">
              {formatNum(pendingChaptersCount, isBn)}
            </span>
          )}
        </button>

        {/* Remix Syllabus Trigger Button in Sidebar */}
        <button
          onClick={() => {
            onOpenRemixCurriculum();
            onCloseMobile();
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors cursor-pointer border border-dashed border-emerald-300 dark:border-emerald-800/80 my-1"
        >
          <Sparkles className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span className="flex-1 text-left font-semibold">Remix Syllabus (রিমিক্স)</span>
          <span className="text-[9px] uppercase px-1 py-0.2 rounded bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 font-mono">
            New
          </span>
        </button>

        <button
          onClick={() => {
            onOpenSettings();
            onCloseMobile();
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium hover:bg-stone-100 dark:hover:bg-zinc-850 text-stone-600 dark:text-stone-400 transition-colors cursor-pointer"
        >
          <Settings className="w-4 h-4 shrink-0 text-stone-500 dark:text-stone-400" />
          <span className="flex-1 text-left">Settings (সেটিংস ও ব্যাকআপ)</span>
        </button>
      </div>

      {/* Subjects Sub-list */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5">
        <div className="flex items-center justify-between px-3 py-1.5 text-[10px] font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-wider">
          <span>Subjects ({formatNum(subjects.length, isBn)})</span>
          <button
            onClick={onOpenAddSubject}
            className="p-0.5 hover:text-stone-700 dark:hover:text-stone-300 rounded cursor-pointer"
            title="নতুন বিষয় যোগ করুন"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {subjects.map((sub) => {
          const isSelected = selectedSubjectId === sub.id;
          const subStat = stats.subjectStatsMap[sub.id] || {
            allDone: 0,
            total: sub.chapters.length,
            overallPercent: 0,
            chapterDone: 0,
          };
          const isFinished = subStat.allDone === subStat.total && subStat.total > 0;

          return (
            <button
              key={sub.id}
              onClick={() => {
                onSelectSubject(sub.id);
                onCloseMobile();
              }}
              className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-xs transition-colors cursor-pointer group text-left ${
                isSelected
                  ? 'bg-stone-200/70 dark:bg-zinc-800 text-stone-900 dark:text-stone-100 font-medium'
                  : 'hover:bg-stone-100 dark:hover:bg-zinc-850/70 text-stone-600 dark:text-stone-400'
              }`}
            >
              <span className="w-3.5 h-3.5 shrink-0 opacity-70 group-hover:opacity-100 flex items-center justify-center">
                <SubjectIcon name={sub.icon} className="w-3.5 h-3.5" />
              </span>

              <span className="flex-1 truncate text-xs">{sub.name}</span>

              {isFinished ? (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-500 shrink-0" />
              ) : (
                <span className="text-[10px] font-mono text-stone-400 dark:text-stone-500">
                  {formatNum(subStat.chapterDone, isBn)}/{formatNum(subStat.total, isBn)}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer info: Auto-save status and Quick Add */}
      <div className="p-3 border-t border-stone-200/60 dark:border-zinc-800/80 bg-stone-100/50 dark:bg-zinc-900/40">
        <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400 px-1">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
            <span className="text-[10px]">অটো-সেভ সক্রিয়</span>
          </div>
          <button
            onClick={onOpenAddSubject}
            className="text-[10px] text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white font-medium cursor-pointer"
          >
            + বিষয় যোগ
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Width Sidebar (240px) */}
      <aside className="hidden lg:block w-[240px] shrink-0 sticky top-0 h-screen border-r border-stone-200/80 dark:border-zinc-800 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isOpenOnMobile && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-stone-950/40 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="fixed inset-y-0 left-0 w-[260px] shadow-xl z-50 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

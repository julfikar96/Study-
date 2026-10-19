import React from 'react';
import {
  ChevronRight,
  Plus,
  BookOpen,
  CheckCircle2,
  ListFilter,
  Check,
  Sparkles,
  Flame,
  Star,
  RefreshCw,
} from 'lucide-react';
import { Subject, ExamTarget } from '../types';
import { formatNum, formatPercent } from '../utils/numberUtils';
import { SubjectIcon } from './SubjectIcon';
import { ExamCountdown } from './ExamCountdown';
import { PomodoroTimer } from './PomodoroTimer';
import { DailyActivity } from '../hooks/useTracker';

interface DashboardOverviewProps {
  subjects: Subject[];
  stats: {
    totalSubjects: number;
    totalChapters: number;
    chaptersDone: number;
    mcqsDone: number;
    cqsDone: number;
    totalPossibleTasks: number;
    totalDoneTasks: number;
    overallProgressPercent: number;
    chapterProgressPercent: number;
    mcqProgressPercent: number;
    cqProgressPercent: number;
    priorityChaptersCount?: number;
    fullyCompletedChapters?: number;
    subjectStatsMap: Record<
      string,
      {
        total: number;
        chapterDone: number;
        mcqDone: number;
        cqDone: number;
        allDone: number;
        overallPercent: number;
        chapterPercent: number;
        mcqPercent: number;
        cqPercent: number;
      }
    >;
  };
  numberFormat: 'bn' | 'en';
  onSelectSubject: (subjectId: string) => void;
  onOpenAddSubject: () => void;
  onOpenRemixCurriculum: () => void;
  filteredSubjects: Subject[];
  examTarget: ExamTarget;
  onUpdateExamTarget: (target: ExamTarget) => void;
  streakData: DailyActivity;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  subjects,
  stats,
  numberFormat,
  onSelectSubject,
  onOpenAddSubject,
  onOpenRemixCurriculum,
  filteredSubjects,
  examTarget,
  onUpdateExamTarget,
  streakData,
}) => {
  const isBn = numberFormat === 'bn';
  const denom = stats.totalChapters || 170;

  const chPct = formatPercent(stats.chaptersDone, denom, isBn);
  const mcqPct = formatPercent(stats.mcqsDone, denom, isBn);
  const cqPct = formatPercent(stats.cqsDone, denom, isBn);
  const overallPct = formatPercent(stats.totalDoneTasks, stats.totalPossibleTasks, isBn);

  const remainingChapters = Math.max(0, denom - stats.chaptersDone);

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2">
      {/* 1. Header & Contextual Greeting with Quick Remix Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-emerald-500/10 via-transparent to-indigo-500/10 p-4 sm:p-5 rounded-2xl border border-stone-200/80 dark:border-zinc-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-semibold uppercase tracking-wider font-mono">
              Academic Suite PRO
            </span>
            {streakData.currentStreak > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[10px] font-semibold font-mono">
                <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
                <span>{formatNum(streakData.currentStreak, isBn)} দিন স্ট্রিক</span>
              </span>
            )}
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
            Study Dashboard & Syllabus Tracker
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
            {formatNum(stats.totalSubjects, isBn)}টি বিষয় এবং {formatNum(denom, isBn)}টি অধ্যায়ের পড়াশোনা, MCQ ও CQ চেকলিস্ট।
          </p>
        </div>

        {/* Quick Remix Syllabus Trigger */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenRemixCurriculum}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs hover:shadow transition-all cursor-pointer group"
          >
            <Sparkles className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
            <span>Remix Syllabus (সিলেবাস রিমিক্স)</span>
          </button>
        </div>
      </div>

      {/* 2. Target Exam & Pace countdown widget */}
      <ExamCountdown
        examTarget={examTarget}
        onUpdateTarget={onUpdateExamTarget}
        numberFormat={numberFormat}
        remainingChapters={remainingChapters}
      />

      {/* 3. Pomodoro Focus Timer */}
      <PomodoroTimer
        numberFormat={numberFormat}
        onSessionComplete={() => {}}
      />

      {/* 4. Four Compact Summary Metrics */}
      <div className="bg-white dark:bg-[#18191d] rounded-xl border border-stone-200/80 dark:border-zinc-800 shadow-2xs divide-y sm:divide-y-0 sm:divide-x divide-stone-200/70 dark:divide-zinc-800 grid grid-cols-2 sm:grid-cols-4">
        {/* Metric 1: Total Subjects */}
        <div className="p-4 sm:p-5">
          <span className="block text-[11px] font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider">
            Total Subjects
          </span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-semibold tracking-tight text-stone-900 dark:text-stone-100 font-mono">
              {formatNum(stats.totalSubjects, isBn)}
            </span>
          </div>
          <span className="block text-[11px] text-stone-400 dark:text-stone-500 mt-1">
            সিলেবাসের বিষয়সমূহ
          </span>
        </div>

        {/* Metric 2: Total Chapters */}
        <div className="p-4 sm:p-5">
          <span className="block text-[11px] font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider">
            Total Chapters
          </span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-semibold tracking-tight text-stone-900 dark:text-stone-100 font-mono">
              {formatNum(stats.totalChapters, isBn)}
            </span>
            {stats.priorityChaptersCount && stats.priorityChaptersCount > 0 ? (
              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium inline-flex items-center gap-0.5 ml-1">
                <Star className="w-2.5 h-2.5 fill-amber-500" />
                {formatNum(stats.priorityChaptersCount, isBn)}
              </span>
            ) : null}
          </div>
          <span className="block text-[11px] text-stone-400 dark:text-stone-500 mt-1">
            নির্ধারিত অধ্যায়
          </span>
        </div>

        {/* Metric 3: Chapters Completed */}
        <div className="p-4 sm:p-5">
          <span className="block text-[11px] font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider">
            Chapters Completed
          </span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-semibold tracking-tight text-stone-900 dark:text-stone-100 font-mono">
              {formatNum(stats.chaptersDone, isBn)}
            </span>
            <span className="text-xs text-stone-400 font-mono">
              /{formatNum(denom, isBn)}
            </span>
          </div>
          <span className="block text-[11px] text-emerald-600 dark:text-emerald-500 font-medium mt-1">
            {chPct.text} শেষ হয়েছে
          </span>
        </div>

        {/* Metric 4: Overall Progress */}
        <div className="p-4 sm:p-5">
          <span className="block text-[11px] font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider">
            Overall Progress
          </span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-semibold tracking-tight text-stone-900 dark:text-stone-100 font-mono">
              {overallPct.text}
            </span>
          </div>
          <span className="block text-[11px] text-stone-400 dark:text-stone-500 mt-1">
            {formatNum(stats.totalDoneTasks, isBn)} / {formatNum(stats.totalPossibleTasks, isBn)} কাজ সম্পন্ন
          </span>
        </div>
      </div>

      {/* 5. Three Separate Progress Indicators (Chapter, MCQ, CQ) */}
      <div className="bg-white dark:bg-[#18191d] rounded-xl border border-stone-200/80 dark:border-zinc-800 p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold text-stone-600 dark:text-stone-300 uppercase tracking-wider">
            Category Breakdown (তিনটি পৃথক অগ্রগতি সূচক)
          </h2>
          <span className="text-[11px] text-stone-400 font-mono">
            ভিত্তি: {formatNum(denom, isBn)}টি অধ্যায়
          </span>
        </div>

        <div className="space-y-4 pt-1">
          {/* 1. Chapter completion */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-stone-800 dark:text-stone-200">
                Chapter Completion (অধ্যায় শেষ)
              </span>
              <div className="flex items-center gap-2 font-mono">
                <span className="text-stone-500 dark:text-stone-400 text-[11px]">
                  {formatNum(stats.chaptersDone, isBn)} / {formatNum(denom, isBn)}
                </span>
                <span className="font-semibold text-stone-900 dark:text-stone-100 text-xs">
                  {chPct.text}
                </span>
              </div>
            </div>
            <div className="w-full bg-stone-100 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-emerald-600 dark:bg-emerald-500 h-full rounded-full transition-all duration-300 ease-out"
                style={{ width: `${Math.min(100, Math.max(0, chPct.percent))}%` }}
              />
            </div>
          </div>

          {/* 2. MCQ completion */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-stone-800 dark:text-stone-200">
                MCQ Completion (MCQ শেষ)
              </span>
              <div className="flex items-center gap-2 font-mono">
                <span className="text-stone-500 dark:text-stone-400 text-[11px]">
                  {formatNum(stats.mcqsDone, isBn)} / {formatNum(denom, isBn)}
                </span>
                <span className="font-semibold text-stone-900 dark:text-stone-100 text-xs">
                  {mcqPct.text}
                </span>
              </div>
            </div>
            <div className="w-full bg-stone-100 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-stone-800 dark:bg-stone-300 h-full rounded-full transition-all duration-300 ease-out"
                style={{ width: `${Math.min(100, Math.max(0, mcqPct.percent))}%` }}
              />
            </div>
          </div>

          {/* 3. CQ completion */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-stone-800 dark:text-stone-200">
                CQ Completion (CQ শেষ)
              </span>
              <div className="flex items-center gap-2 font-mono">
                <span className="text-stone-500 dark:text-stone-400 text-[11px]">
                  {formatNum(stats.cqsDone, isBn)} / {formatNum(denom, isBn)}
                </span>
                <span className="font-semibold text-stone-900 dark:text-stone-100 text-xs">
                  {cqPct.text}
                </span>
              </div>
            </div>
            <div className="w-full bg-stone-100 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-stone-600 dark:bg-stone-400 h-full rounded-full transition-all duration-300 ease-out"
                style={{ width: `${Math.min(100, Math.max(0, cqPct.percent))}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 6. Section: Your Subjects */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold tracking-tight text-stone-900 dark:text-stone-100">
              Your Subjects
            </h2>
            <span className="text-[11px] font-mono text-stone-400">
              ({formatNum(filteredSubjects.length, isBn)})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenRemixCurriculum}
              className="inline-flex items-center gap-1 text-xs text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 font-medium cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Remix</span>
            </button>
            <span className="text-stone-300 dark:text-stone-700">•</span>
            <button
              onClick={onOpenAddSubject}
              className="inline-flex items-center gap-1 text-xs text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 font-medium transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Subject</span>
            </button>
          </div>
        </div>

        {/* Clean, consistent Subject List / Grid */}
        <div className="bg-white dark:bg-[#18191d] rounded-xl border border-stone-200/80 dark:border-zinc-800 shadow-2xs divide-y divide-stone-200/70 dark:divide-zinc-800/80 overflow-hidden">
          {filteredSubjects.map((sub) => {
            const subStat = stats.subjectStatsMap[sub.id] || {
              total: sub.chapters.length,
              chapterDone: 0,
              mcqDone: 0,
              cqDone: 0,
              allDone: 0,
              overallPercent: 0,
              chapterPercent: 0,
              mcqPercent: 0,
              cqPercent: 0,
            };

            const isAllFinished = subStat.allDone === subStat.total && subStat.total > 0;
            const subOverallRounded = Math.round(subStat.overallPercent);

            return (
              <div
                key={sub.id}
                onClick={() => onSelectSubject(sub.id)}
                className="group flex flex-col sm:flex-row sm:items-center justify-between p-3.5 sm:px-5 sm:py-3.5 hover:bg-stone-50 dark:hover:bg-zinc-850/60 transition-colors cursor-pointer gap-3"
              >
                {/* Subject name & icon */}
                <div className="flex items-center gap-3 min-w-0 sm:w-1/3">
                  <div className="w-8 h-8 rounded-lg bg-stone-100 dark:bg-zinc-800 border border-stone-200/60 dark:border-zinc-700/60 flex items-center justify-center shrink-0 text-stone-600 dark:text-stone-300 shadow-2xs">
                    <SubjectIcon name={sub.icon} className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="font-medium text-xs sm:text-sm text-stone-900 dark:text-stone-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors truncate">
                        {sub.name}
                      </span>
                      {isAllFinished && (
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-500 shrink-0 stroke-[2.5]" />
                      )}
                    </div>
                    {sub.bnName && sub.bnName !== sub.name && (
                      <p className="text-[11px] text-stone-400 truncate">
                        {sub.bnName}
                      </p>
                    )}
                  </div>
                </div>

                {/* Task counts breakdown (Chapter, MCQ, CQ) */}
                <div className="flex items-center gap-3 text-[11px] font-mono text-stone-500 dark:text-stone-400 sm:w-1/3">
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-stone-400">CH:</span>
                    <span className="text-stone-800 dark:text-stone-200 font-semibold">
                      {formatNum(subStat.chapterDone, isBn)}/{formatNum(subStat.total, isBn)}
                    </span>
                  </div>
                  <span className="text-stone-300 dark:text-stone-700">•</span>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-stone-400">MCQ:</span>
                    <span className="text-stone-800 dark:text-stone-200 font-semibold">
                      {formatNum(subStat.mcqDone, isBn)}/{formatNum(subStat.total, isBn)}
                    </span>
                  </div>
                  <span className="text-stone-300 dark:text-stone-700">•</span>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-stone-400">CQ:</span>
                    <span className="text-stone-800 dark:text-stone-200 font-semibold">
                      {formatNum(subStat.cqDone, isBn)}/{formatNum(subStat.total, isBn)}
                    </span>
                  </div>
                </div>

                {/* Progress bar & navigation chevron */}
                <div className="flex items-center gap-3 sm:w-1/4 justify-end">
                  <div className="w-20 sm:w-28 bg-stone-100 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden shrink-0">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isAllFinished ? 'bg-emerald-600 dark:bg-emerald-500' : 'bg-stone-700 dark:bg-stone-300'
                      }`}
                      style={{ width: `${Math.min(100, Math.max(0, subStat.overallPercent))}%` }}
                    />
                  </div>

                  <span className="font-mono text-xs text-stone-500 dark:text-stone-400 w-9 text-right shrink-0">
                    {formatNum(subOverallRounded, isBn)}%
                  </span>

                  <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-stone-700 dark:group-hover:text-stone-200 group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

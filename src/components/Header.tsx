import React from 'react';
import {
  Search,
  Sun,
  Moon,
  Plus,
  RotateCcw,
  Menu,
  ChevronRight,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react';
import { formatNum } from '../utils/numberUtils';

interface HeaderProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  numberFormat: 'bn' | 'en';
  onToggleNumberFormat: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenAddSubject: () => void;
  onOpenSettings: () => void;
  onOpenRemixCurriculum?: () => void;
  breadcrumb: { title: string; subtitle?: string };
  onBreadcrumbRootClick: () => void;
  onToggleMobileMenu: () => void;
  overallPercent: number;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onToggleTheme,
  numberFormat,
  onToggleNumberFormat,
  searchQuery,
  onSearchChange,
  onOpenAddSubject,
  onOpenSettings,
  onOpenRemixCurriculum,
  breadcrumb,
  onBreadcrumbRootClick,
  onToggleMobileMenu,
  overallPercent,
}) => {
  const isBn = numberFormat === 'bn';

  return (
    <header className="sticky top-0 z-20 h-14 bg-[#fbfbfa]/95 dark:bg-[#111215]/95 backdrop-blur-xs border-b border-stone-200/80 dark:border-zinc-800 transition-colors">
      <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-3 max-w-6xl mx-auto">
        {/* Left: Mobile hamburger & subtle breadcrumbs */}
        <div className="flex items-center gap-2 min-w-0">
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-1.5 -ml-1 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 rounded-md cursor-pointer"
            aria-label="Toggle navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <nav className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400 truncate">
            <button
              onClick={onBreadcrumbRootClick}
              className="hover:text-stone-900 dark:hover:text-stone-100 font-medium cursor-pointer truncate"
            >
              StudyTrack
            </button>
            <ChevronRight className="w-3.5 h-3.5 shrink-0 text-stone-400" />
            <span className="font-semibold text-stone-900 dark:text-stone-100 truncate">
              {breadcrumb.title}
            </span>
            {breadcrumb.subtitle && (
              <>
                <span className="text-stone-300 dark:text-stone-700 hidden sm:inline">•</span>
                <span className="text-stone-500 dark:text-stone-400 hidden sm:inline truncate">
                  {breadcrumb.subtitle}
                </span>
              </>
            )}
          </nav>
        </div>

        {/* Center: Clean Search Bar */}
        <div className="flex-1 max-w-sm mx-2 hidden md:block">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search chapters or subjects..."
              className="w-full pl-8 pr-7 py-1 text-xs bg-stone-100/80 dark:bg-zinc-800/80 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 rounded-md border border-stone-200/80 dark:border-zinc-700/70 focus:outline-none focus:border-stone-400 dark:focus:border-zinc-500 focus:bg-white dark:focus:bg-zinc-900 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Progress pill */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-stone-100 dark:bg-zinc-800/80 border border-stone-200/60 dark:border-zinc-700/60 text-[11px] font-mono text-stone-600 dark:text-stone-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-500" />
            <span>{formatNum(Math.round(overallPercent), isBn)}% complete</span>
          </div>

          {/* Remix Syllabus button */}
          {onOpenRemixCurriculum && (
            <button
              onClick={onOpenRemixCurriculum}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/80 transition-colors cursor-pointer"
              title="Remix Syllabus Preset"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Remix</span>
            </button>
          )}

          {/* New Subject button */}
          <button
            onClick={onOpenAddSubject}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-stone-200 text-stone-50 dark:text-stone-900 transition-colors cursor-pointer shadow-2xs"
            title="Add Subject"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add Subject</span>
          </button>

          {/* Number format toggle */}
          <button
            onClick={onToggleNumberFormat}
            className="px-2 py-1 text-[11px] font-mono text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-zinc-800 rounded-md border border-stone-200/60 dark:border-zinc-700/60 transition-colors cursor-pointer"
            title="Toggle Bangla / English numbers"
          >
            {numberFormat === 'bn' ? 'বাংলা' : 'EN'}
          </button>

          {/* Theme toggle */}
          <button
            onClick={onToggleTheme}
            className="p-1.5 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-zinc-800 rounded-md transition-colors cursor-pointer"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-stone-300" />
            ) : (
              <Moon className="w-4 h-4 text-stone-600" />
            )}
          </button>

          {/* Settings modal */}
          <button
            onClick={onOpenSettings}
            className="p-1.5 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-zinc-800 rounded-md transition-colors cursor-pointer"
            title="Settings & Data"
            aria-label="Settings"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile search input */}
      <div className="px-4 pb-2 md:hidden">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search chapters or subjects..."
            className="w-full pl-8 pr-7 py-1 text-xs bg-stone-100 dark:bg-zinc-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 rounded-md border border-stone-200 dark:border-zinc-700 focus:outline-none"
          />
        </div>
      </div>
    </header>
  );
};

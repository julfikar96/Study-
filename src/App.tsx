import React, { useState, useMemo } from 'react';
import { useTracker } from './hooks/useTracker';
import { Header } from './components/Header';
import { DashboardOverview } from './components/DashboardOverview';
import { ChapterChecklist } from './components/ChapterChecklist';
import { SubjectSidebar, NavView } from './components/SubjectSidebar';
import { RevisionView } from './components/RevisionView';
import { AddSubjectModal } from './components/AddSubjectModal';
import { ResetConfirmModal } from './components/ResetConfirmModal';
import { SettingsModal } from './components/SettingsModal';
import { RemixCurriculumModal } from './components/RemixCurriculumModal';
import { formatNum } from './utils/numberUtils';
import { BookOpen, ChevronRight, Check, Sparkles } from 'lucide-react';
import { SubjectIcon } from './components/SubjectIcon';

export default function App() {
  const {
    subjects,
    theme,
    toggleTheme,
    numberFormat,
    toggleNumberFormat,
    examTarget,
    updateExamTarget,
    activePresetId,
    applyCurriculumPreset,
    streakData,
    stats,
    toggleCheckbox,
    toggleChapterPriority,
    incrementChapterRevision,
    updateChapterNotes,
    renameChapter,
    addChapter,
    deleteChapter,
    addSubject,
    deleteSubject,
    renameSubject,
    setAllSubjectTasks,
    resetSubjectCheckboxes,
    resetProgressOnly,
    resetAllToDefault,
    importData,
  } = useTracker();

  // Navigation state
  const [currentNav, setCurrentNav] = useState<NavView>('overview');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState<boolean>(false);

  // Modals state
  const [isAddSubjectOpen, setIsAddSubjectOpen] = useState<boolean>(false);
  const [isResetOpen, setIsResetOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isRemixOpen, setIsRemixOpen] = useState<boolean>(false);

  // Filtered subjects based on search
  const filteredSubjects = useMemo(() => {
    if (!searchQuery.trim()) return subjects;
    const q = searchQuery.toLowerCase();
    return subjects.filter((s) => {
      const matchName = s.name.toLowerCase().includes(q);
      const matchBn = s.bnName?.toLowerCase().includes(q);
      const matchChapter = s.chapters.some((ch) => ch.name.toLowerCase().includes(q));
      return matchName || matchBn || matchChapter;
    });
  }, [subjects, searchQuery]);

  // Selected subject object
  const currentSubject = useMemo(() => {
    if (!selectedSubjectId) return null;
    return subjects.find((s) => s.id === selectedSubjectId) || null;
  }, [subjects, selectedSubjectId]);

  // Dynamic breadcrumb
  const breadcrumb = useMemo(() => {
    if (currentSubject) {
      return {
        title: currentSubject.name,
        subtitle: currentSubject.bnName !== currentSubject.name ? currentSubject.bnName : undefined,
      };
    }
    if (currentNav === 'revision') {
      return { title: 'Revision Queue', subtitle: 'Pending & Starred' };
    }
    if (currentNav === 'all-subjects') {
      return { title: 'All Subjects', subtitle: `${subjects.length} Subjects` };
    }
    return { title: 'Overview', subtitle: 'Academic Tracker' };
  }, [currentSubject, currentNav, subjects.length]);

  return (
    <div className="min-h-screen bg-[#fbfbfa] dark:bg-[#111215] text-stone-900 dark:text-stone-100 flex font-sans transition-colors duration-150">
      {/* 1. Left Sidebar (Fixed width: 240px) */}
      <SubjectSidebar
        subjects={subjects}
        currentNav={currentNav}
        selectedSubjectId={selectedSubjectId}
        onSelectNav={(nav) => {
          setCurrentNav(nav);
          setSelectedSubjectId(null);
          setSearchQuery('');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSelectSubject={(id) => {
          setSelectedSubjectId(id);
          setSearchQuery('');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAddSubject={() => setIsAddSubjectOpen(true)}
        onOpenRemixCurriculum={() => setIsRemixOpen(true)}
        numberFormat={numberFormat}
        stats={stats}
        isOpenOnMobile={mobileDrawerOpen}
        onCloseMobile={() => setMobileDrawerOpen(false)}
      />

      {/* 2. Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <Header
          theme={theme}
          onToggleTheme={toggleTheme}
          numberFormat={numberFormat}
          onToggleNumberFormat={toggleNumberFormat}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenAddSubject={() => setIsAddSubjectOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenRemixCurriculum={() => setIsRemixOpen(true)}
          breadcrumb={breadcrumb}
          onBreadcrumbRootClick={() => {
            setSelectedSubjectId(null);
            setCurrentNav('overview');
            setSearchQuery('');
          }}
          onToggleMobileMenu={() => setMobileDrawerOpen(true)}
          overallPercent={stats.overallProgressPercent}
        />

        {/* Main Content Area */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-6xl w-full mx-auto pb-24">
          {currentSubject ? (
            /* Dedicated Subject & Chapter Page */
            <ChapterChecklist
              subject={currentSubject}
              numberFormat={numberFormat}
              onBack={() => {
                setSelectedSubjectId(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onToggleCheckbox={toggleCheckbox}
              onTogglePriority={toggleChapterPriority}
              onIncrementRevision={incrementChapterRevision}
              onUpdateNotes={updateChapterNotes}
              onRenameChapter={renameChapter}
              onAddChapter={addChapter}
              onDeleteChapter={deleteChapter}
              onBulkSetTasks={setAllSubjectTasks}
              onResetSubject={resetSubjectCheckboxes}
            />
          ) : currentNav === 'revision' ? (
            /* Revision Queue View */
            <RevisionView
              subjects={subjects}
              numberFormat={numberFormat}
              onToggleCheckbox={toggleCheckbox}
              onSelectSubject={(id) => {
                setSelectedSubjectId(id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          ) : currentNav === 'all-subjects' ? (
            /* All Subjects Dedicated Grid / Catalog */
            <div className="space-y-6 max-w-5xl mx-auto py-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-100">
                    All Subjects (সকল বিষয়)
                  </h1>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    আপনার সিলেবাসভুক্ত মোট {formatNum(subjects.length, numberFormat === 'bn')}টি বিষয়ের তালিকা ও অগ্রগতি
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsRemixOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-semibold cursor-pointer hover:bg-emerald-100"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Remix Syllabus</span>
                  </button>
                  <button
                    onClick={() => setIsAddSubjectOpen(true)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 text-xs font-semibold cursor-pointer"
                  >
                    + Add Subject
                  </button>
                </div>
              </div>

              <div className="bg-white dark:bg-[#18191d] rounded-xl border border-stone-200/80 dark:border-zinc-800 shadow-2xs divide-y divide-stone-200/70 dark:divide-zinc-800/80 overflow-hidden">
                {filteredSubjects.map((sub) => {
                  const subStat = stats.subjectStatsMap[sub.id] || {
                    total: sub.chapters.length,
                    chapterDone: 0,
                    mcqDone: 0,
                    cqDone: 0,
                    allDone: 0,
                    overallPercent: 0,
                  };
                  const isDone = subStat.allDone === subStat.total && subStat.total > 0;

                  return (
                    <div
                      key={sub.id}
                      onClick={() => setSelectedSubjectId(sub.id)}
                      className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-stone-50 dark:hover:bg-zinc-850/60 transition-colors cursor-pointer gap-3"
                    >
                      <div className="flex items-center gap-3 sm:w-1/3">
                        <div className="w-8 h-8 rounded-lg bg-stone-100 dark:bg-zinc-800 border border-stone-200/60 dark:border-zinc-700/60 flex items-center justify-center shrink-0 text-stone-600 dark:text-stone-300 shadow-2xs">
                          <SubjectIcon name={sub.icon} className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-medium text-xs sm:text-sm text-stone-900 dark:text-stone-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                              {sub.name}
                            </span>
                            {isDone && (
                              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-500 stroke-[2.5]" />
                            )}
                          </div>
                          {sub.bnName && sub.bnName !== sub.name && (
                            <p className="text-[11px] text-stone-400">
                              {sub.bnName}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs font-mono text-stone-500 sm:w-1/3">
                        <div>
                          <span className="text-[10px] text-stone-400 uppercase mr-1">CH:</span>
                          <span className="font-semibold text-stone-800 dark:text-stone-200">
                            {formatNum(subStat.chapterDone, numberFormat === 'bn')}/{formatNum(subStat.total, numberFormat === 'bn')}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-stone-400 uppercase mr-1">MCQ:</span>
                          <span className="font-semibold text-stone-800 dark:text-stone-200">
                            {formatNum(subStat.mcqDone, numberFormat === 'bn')}/{formatNum(subStat.total, numberFormat === 'bn')}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-stone-400 uppercase mr-1">CQ:</span>
                          <span className="font-semibold text-stone-800 dark:text-stone-200">
                            {formatNum(subStat.cqDone, numberFormat === 'bn')}/{formatNum(subStat.total, numberFormat === 'bn')}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 sm:w-1/4 justify-end">
                        <div className="w-24 bg-stone-100 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-emerald-600 dark:bg-emerald-500 h-full rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(100, Math.max(0, subStat.overallPercent))}%` }}
                          />
                        </div>
                        <span className="font-mono text-xs text-stone-500 w-9 text-right">
                          {formatNum(Math.round(subStat.overallPercent), numberFormat === 'bn')}%
                        </span>
                        <ChevronRight className="w-4 h-4 text-stone-400 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Dashboard Overview */
            <DashboardOverview
              subjects={subjects}
              stats={stats}
              numberFormat={numberFormat}
              onSelectSubject={(id) => {
                setSelectedSubjectId(id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenAddSubject={() => setIsAddSubjectOpen(true)}
              onOpenRemixCurriculum={() => setIsRemixOpen(true)}
              filteredSubjects={filteredSubjects}
              examTarget={examTarget}
              onUpdateExamTarget={updateExamTarget}
              streakData={streakData}
            />
          )}
        </main>
      </div>

      {/* Remix Curriculum Modal */}
      <RemixCurriculumModal
        isOpen={isRemixOpen}
        onClose={() => setIsRemixOpen(false)}
        activePresetId={activePresetId}
        onApplyPreset={applyCurriculumPreset}
        numberFormat={numberFormat}
      />

      {/* Add Subject Modal */}
      <AddSubjectModal
        isOpen={isAddSubjectOpen}
        onClose={() => setIsAddSubjectOpen(false)}
        onAdd={(params) => {
          const newId = addSubject(params);
          setSelectedSubjectId(newId);
        }}
      />

      {/* Reset Confirmation Modal */}
      <ResetConfirmModal
        isOpen={isResetOpen}
        onClose={() => setIsResetOpen(false)}
        onResetProgressOnly={resetProgressOnly}
        onResetAllToDefault={resetAllToDefault}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        subjects={subjects}
        theme={theme}
        onToggleTheme={toggleTheme}
        numberFormat={numberFormat}
        onToggleNumberFormat={toggleNumberFormat}
        onImportData={importData}
        onOpenResetConfirm={() => setIsResetOpen(true)}
      />
    </div>
  );
}

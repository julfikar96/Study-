import { useState, useEffect, useMemo, useCallback } from 'react';
import { Subject, Chapter, TaskType, ExamTarget, CurriculumPreset } from '../types';
import { getInitialSubjects } from '../data/initialSubjects';
import { buildSubjectsFromPreset, CURRICULUM_PRESETS } from '../data/curriculumPresets';
import { toBnNumber } from '../utils/numberUtils';
import { sounds, triggerConfetti, triggerBigCelebration } from '../utils/soundUtils';

const STORAGE_KEY = 'my_study_tracker_data_v1';
const THEME_KEY = 'my_study_tracker_theme';
const NUM_FORMAT_KEY = 'my_study_tracker_num_format';
const EXAM_TARGET_KEY = 'my_study_tracker_exam_target';
const ACTIVE_PRESET_KEY = 'my_study_tracker_active_preset';
const STREAK_KEY = 'my_study_tracker_streak';

export interface DailyActivity {
  todayCount: number;
  currentStreak: number;
  lastActiveDate: string; // YYYY-MM-DD
}

export function useTracker() {
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load tracker state from localStorage', e);
    }
    return getInitialSubjects();
  });

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const storedTheme = localStorage.getItem(THEME_KEY);
      if (storedTheme === 'dark' || storedTheme === 'light') {
        return storedTheme;
      }
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    } catch {
      return 'light';
    }
  });

  const [numberFormat, setNumberFormat] = useState<'bn' | 'en'>(() => {
    try {
      const stored = localStorage.getItem(NUM_FORMAT_KEY);
      if (stored === 'bn' || stored === 'en') return stored;
    } catch {}
    return 'bn';
  });

  const [activePresetId, setActivePresetId] = useState<string>(() => {
    try {
      return localStorage.getItem(ACTIVE_PRESET_KEY) || 'ssc-core-classic';
    } catch {
      return 'ssc-core-classic';
    }
  });

  const [examTarget, setExamTarget] = useState<ExamTarget>(() => {
    try {
      const stored = localStorage.getItem(EXAM_TARGET_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {}
    // Default exam target: Approx 6 months out or February SSC Exam
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 90);
    return {
      id: 'ssc-exam',
      title: 'SSC Board Exam',
      date: defaultDate.toISOString().slice(0, 10),
      enabled: true,
    };
  });

  const [streakData, setStreakData] = useState<DailyActivity>(() => {
    const today = new Date().toISOString().slice(0, 10);
    try {
      const stored = localStorage.getItem(STREAK_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.lastActiveDate === today) {
          return parsed;
        } else {
          // Check if streak was yesterday
          const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
          const isConsecutive = parsed.lastActiveDate === yesterday;
          return {
            todayCount: 0,
            currentStreak: isConsecutive ? parsed.currentStreak : 0,
            lastActiveDate: today,
          };
        }
      }
    } catch {}
    return {
      todayCount: 0,
      currentStreak: 1,
      lastActiveDate: today,
    };
  });

  // Sync theme
  useEffect(() => {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {}
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Sync number format
  useEffect(() => {
    try {
      localStorage.setItem(NUM_FORMAT_KEY, numberFormat);
    } catch {}
  }, [numberFormat]);

  // Sync exam target
  useEffect(() => {
    try {
      localStorage.setItem(EXAM_TARGET_KEY, JSON.stringify(examTarget));
    } catch {}
  }, [examTarget]);

  // Sync preset ID
  useEffect(() => {
    try {
      localStorage.setItem(ACTIVE_PRESET_KEY, activePresetId);
    } catch {}
  }, [activePresetId]);

  // Sync streak
  useEffect(() => {
    try {
      localStorage.setItem(STREAK_KEY, JSON.stringify(streakData));
    } catch {}
  }, [streakData]);

  // Sync subjects to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(subjects));
    } catch (err) {
      console.error('Error saving study tracker data:', err);
    }
  }, [subjects]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const toggleNumberFormat = useCallback(() => {
    setNumberFormat((prev) => (prev === 'bn' ? 'en' : 'bn'));
  }, []);

  // Update streak when user completes a task
  const recordTaskCompletion = useCallback(() => {
    const today = new Date().toISOString().slice(0, 10);
    setStreakData((prev) => {
      const isToday = prev.lastActiveDate === today;
      const newCount = isToday ? prev.todayCount + 1 : 1;
      const newStreak = isToday ? prev.currentStreak : prev.currentStreak + 1;
      return {
        todayCount: newCount,
        currentStreak: Math.max(1, newStreak),
        lastActiveDate: today,
      };
    });
  }, []);

  // Toggle chapter checkbox
  const toggleCheckbox = useCallback(
    (subjectId: string, chapterId: string, task: TaskType) => {
      let isNowChecked = false;
      let isSubjectNowComplete = false;

      setSubjects((prevSubjects) => {
        const next = prevSubjects.map((sub) => {
          if (sub.id !== subjectId) return sub;

          let allDoneAfter = true;
          const updatedChapters = sub.chapters.map((ch) => {
            if (ch.id !== chapterId) {
              if (!ch.chapterDone || !ch.mcqDone || !ch.cqDone) allDoneAfter = false;
              return ch;
            }
            const newValue = !ch[task];
            if (newValue) isNowChecked = true;
            const updatedCh = {
              ...ch,
              [task]: newValue,
              lastUpdated: new Date().toISOString(),
            };
            if (!updatedCh.chapterDone || !updatedCh.mcqDone || !updatedCh.cqDone) {
              allDoneAfter = false;
            }
            return updatedCh;
          });

          if (allDoneAfter && updatedChapters.length > 0) {
            isSubjectNowComplete = true;
          }

          return {
            ...sub,
            chapters: updatedChapters,
          };
        });
        return next;
      });

      // Sound and streak
      if (isNowChecked) {
        sounds.playCheck();
        recordTaskCompletion();
        if (isSubjectNowComplete) {
          triggerBigCelebration();
        } else {
          triggerConfetti(0.7);
        }
      }
    },
    [recordTaskCompletion]
  );

  // Toggle Priority / Starred
  const toggleChapterPriority = useCallback((subjectId: string, chapterId: string) => {
    setSubjects((prev) =>
      prev.map((sub) => {
        if (sub.id !== subjectId) return sub;
        return {
          ...sub,
          chapters: sub.chapters.map((ch) => {
            if (ch.id !== chapterId) return ch;
            return { ...ch, isPriority: !ch.isPriority, lastUpdated: new Date().toISOString() };
          }),
        };
      })
    );
  }, []);

  // Increment revision cycle (1x, 2x, 3x...)
  const incrementChapterRevision = useCallback((subjectId: string, chapterId: string) => {
    setSubjects((prev) =>
      prev.map((sub) => {
        if (sub.id !== subjectId) return sub;
        return {
          ...sub,
          chapters: sub.chapters.map((ch) => {
            if (ch.id !== chapterId) return ch;
            const current = ch.revisionCount || 0;
            return { ...ch, revisionCount: (current + 1) % 5, lastUpdated: new Date().toISOString() };
          }),
        };
      })
    );
  }, []);

  // Update chapter notes
  const updateChapterNotes = useCallback((subjectId: string, chapterId: string, notes: string) => {
    setSubjects((prev) =>
      prev.map((sub) => {
        if (sub.id !== subjectId) return sub;
        return {
          ...sub,
          chapters: sub.chapters.map((ch) => {
            if (ch.id !== chapterId) return ch;
            return { ...ch, notes: notes.trim() || undefined, lastUpdated: new Date().toISOString() };
          }),
        };
      })
    );
  }, []);

  // Rename a chapter
  const renameChapter = useCallback(
    (subjectId: string, chapterId: string, newName: string) => {
      const trimmed = newName.trim();
      if (!trimmed) return;
      setSubjects((prevSubjects) =>
        prevSubjects.map((sub) => {
          if (sub.id !== subjectId) return sub;
          return {
            ...sub,
            chapters: sub.chapters.map((ch) => {
              if (ch.id !== chapterId) return ch;
              return { ...ch, name: trimmed, lastUpdated: new Date().toISOString() };
            }),
          };
        })
      );
    },
    []
  );

  // Add chapter to subject
  const addChapter = useCallback((subjectId: string, customName?: string) => {
    setSubjects((prevSubjects) =>
      prevSubjects.map((sub) => {
        if (sub.id !== subjectId) return sub;
        const newOrder = sub.chapters.length + 1;
        const newChapter: Chapter = {
          id: `ch-${Date.now()}-${Math.random().toString(36).substring(2, 7)}-${newOrder}`,
          name: customName?.trim() || `অধ্যায় ${toBnNumber(newOrder)}`,
          order: newOrder,
          chapterDone: false,
          mcqDone: false,
          cqDone: false,
          isPriority: false,
          revisionCount: 0,
          lastUpdated: new Date().toISOString(),
        };
        return {
          ...sub,
          chapters: [...sub.chapters, newChapter],
        };
      })
    );
  }, []);

  // Delete chapter from subject
  const deleteChapter = useCallback((subjectId: string, chapterId: string) => {
    setSubjects((prevSubjects) =>
      prevSubjects.map((sub) => {
        if (sub.id !== subjectId) return sub;
        const filtered = sub.chapters.filter((ch) => ch.id !== chapterId);
        return {
          ...sub,
          chapters: filtered.map((ch, idx) => ({ ...ch, order: idx + 1 })),
        };
      })
    );
  }, []);

  // Add a new subject
  const addSubject = useCallback(
    (params: {
      name: string;
      bnName?: string;
      chapterCount: number;
      category?: 'core' | 'science' | 'commerce' | 'humanities' | 'general' | 'elective';
      icon?: string;
      color?: string;
    }) => {
      const count = Math.max(1, Math.min(params.chapterCount || 10, 100));
      const generatedChapters: Chapter[] = Array.from({ length: count }, (_, idx) => {
        const num = idx + 1;
        return {
          id: `ch-${Date.now()}-${Math.random().toString(36).substring(2, 7)}-${num}`,
          name: `অধ্যায় ${toBnNumber(num)}`,
          order: num,
          chapterDone: false,
          mcqDone: false,
          cqDone: false,
          isPriority: false,
          revisionCount: 0,
        };
      });

      const newSubject: Subject = {
        id: `subj-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        name: params.name.trim(),
        bnName: params.bnName?.trim() || params.name.trim(),
        category: params.category || 'elective',
        icon: params.icon || 'BookOpen',
        color: params.color || 'indigo',
        chapters: generatedChapters,
        createdAt: new Date().toISOString(),
      };

      setSubjects((prev) => [...prev, newSubject]);
      return newSubject.id;
    },
    []
  );

  // Delete a subject
  const deleteSubject = useCallback((subjectId: string) => {
    setSubjects((prev) => prev.filter((s) => s.id !== subjectId));
  }, []);

  // Rename a subject
  const renameSubject = useCallback((subjectId: string, newName: string, newBnName?: string) => {
    setSubjects((prev) =>
      prev.map((s) => {
        if (s.id !== subjectId) return s;
        return {
          ...s,
          name: newName.trim(),
          bnName: newBnName?.trim() || s.bnName,
        };
      })
    );
  }, []);

  // Bulk actions for a specific subject
  const setAllSubjectTasks = useCallback(
    (subjectId: string, task: TaskType, value: boolean) => {
      setSubjects((prev) =>
        prev.map((sub) => {
          if (sub.id !== subjectId) return sub;
          return {
            ...sub,
            chapters: sub.chapters.map((ch) => ({
              ...ch,
              [task]: value,
              lastUpdated: new Date().toISOString(),
            })),
          };
        })
      );
      if (value) {
        sounds.playCheck();
        triggerConfetti(0.7);
      }
    },
    []
  );

  const resetSubjectCheckboxes = useCallback((subjectId: string) => {
    setSubjects((prev) =>
      prev.map((sub) => {
        if (sub.id !== subjectId) return sub;
        return {
          ...sub,
          chapters: sub.chapters.map((ch) => ({
            ...ch,
            chapterDone: false,
            mcqDone: false,
            cqDone: false,
            lastUpdated: new Date().toISOString(),
          })),
        };
      })
    );
  }, []);

  // Global reset: keeps subjects & custom names, unchecks all
  const resetProgressOnly = useCallback(() => {
    setSubjects((prev) =>
      prev.map((sub) => ({
        ...sub,
        chapters: sub.chapters.map((ch) => ({
          ...ch,
          chapterDone: false,
          mcqDone: false,
          cqDone: false,
          lastUpdated: new Date().toISOString(),
        })),
      }))
    );
  }, []);

  // Apply a curriculum preset (Remix Syllabus)
  const applyCurriculumPreset = useCallback((preset: CurriculumPreset, keepMatchingProgress: boolean) => {
    const newSubjects = buildSubjectsFromPreset(preset);

    if (keepMatchingProgress) {
      // Map previous progress by subject name or id
      const oldSubjectMap = new Map<string, Subject>();
      subjects.forEach((s) => {
        oldSubjectMap.set(s.id, s);
        oldSubjectMap.set(s.name.toLowerCase().trim(), s);
        if (s.bnName) oldSubjectMap.set(s.bnName.toLowerCase().trim(), s);
      });

      const mergedSubjects = newSubjects.map((newSub) => {
        const match =
          oldSubjectMap.get(newSub.id) ||
          oldSubjectMap.get(newSub.name.toLowerCase().trim()) ||
          (newSub.bnName ? oldSubjectMap.get(newSub.bnName.toLowerCase().trim()) : null);

        if (!match) return newSub;

        // Copy matching chapter checkboxes where order aligns
        const mergedChapters = newSub.chapters.map((ch, idx) => {
          const oldCh = match.chapters[idx];
          if (!oldCh) return ch;
          return {
            ...ch,
            chapterDone: oldCh.chapterDone,
            mcqDone: oldCh.mcqDone,
            cqDone: oldCh.cqDone,
            isPriority: oldCh.isPriority || false,
            notes: oldCh.notes,
            revisionCount: oldCh.revisionCount || 0,
          };
        });

        return {
          ...newSub,
          chapters: mergedChapters,
        };
      });

      setSubjects(mergedSubjects);
    } else {
      setSubjects(newSubjects);
    }

    setActivePresetId(preset.id);
    triggerConfetti(0.5);
  }, [subjects]);

  // Hard reset: restores initial 10 subjects and 170 chapters
  const resetAllToDefault = useCallback(() => {
    const defaults = getInitialSubjects();
    setSubjects(defaults);
    setActivePresetId('ssc-core-classic');
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Update exam target
  const updateExamTarget = useCallback((target: ExamTarget) => {
    setExamTarget(target);
  }, []);

  // Import JSON backup
  const importData = useCallback((data: unknown) => {
    if (!Array.isArray(data)) {
      throw new Error('অবৈধ ব্যাকআপ ফাইল ফরম্যাট');
    }
    const valid = data.every(
      (s) => s && typeof s.id === 'string' && Array.isArray(s.chapters)
    );
    if (!valid) {
      throw new Error('ব্যাকআপ ফাইলের গঠন সঠিক নয়');
    }
    setSubjects(data as Subject[]);
  }, []);

  // Stats calculation
  const stats = useMemo(() => {
    let totalChapters = 0;
    let chaptersDone = 0;
    let mcqsDone = 0;
    let cqsDone = 0;
    let priorityChaptersCount = 0;
    let fullyCompletedChapters = 0;

    const subjectStatsMap: Record<
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
    > = {};

    subjects.forEach((sub) => {
      const subTotal = sub.chapters.length;
      let subChDone = 0;
      let subMcqDone = 0;
      let subCqDone = 0;
      let subAllDone = 0;

      sub.chapters.forEach((ch) => {
        if (ch.chapterDone) subChDone++;
        if (ch.mcqDone) subMcqDone++;
        if (ch.cqDone) subCqDone++;
        if (ch.chapterDone && ch.mcqDone && ch.cqDone) {
          subAllDone++;
          fullyCompletedChapters++;
        }
        if (ch.isPriority) priorityChaptersCount++;
      });

      totalChapters += subTotal;
      chaptersDone += subChDone;
      mcqsDone += subMcqDone;
      cqsDone += subCqDone;

      const subPossible = subTotal * 3;
      const subCompletedTotal = subChDone + subMcqDone + subCqDone;

      subjectStatsMap[sub.id] = {
        total: subTotal,
        chapterDone: subChDone,
        mcqDone: subMcqDone,
        cqDone: subCqDone,
        allDone: subAllDone,
        overallPercent: subPossible > 0 ? (subCompletedTotal / subPossible) * 100 : 0,
        chapterPercent: subTotal > 0 ? (subChDone / subTotal) * 100 : 0,
        mcqPercent: subTotal > 0 ? (subMcqDone / subTotal) * 100 : 0,
        cqPercent: subTotal > 0 ? (subCqDone / subTotal) * 100 : 0,
      };
    });

    const totalPossibleTasks = totalChapters * 3;
    const totalDoneTasks = chaptersDone + mcqsDone + cqsDone;
    const overallProgressPercent =
      totalPossibleTasks > 0 ? (totalDoneTasks / totalPossibleTasks) * 100 : 0;

    const chapterProgressPercent =
      totalChapters > 0 ? (chaptersDone / totalChapters) * 100 : 0;
    const mcqProgressPercent = totalChapters > 0 ? (mcqsDone / totalChapters) * 100 : 0;
    const cqProgressPercent = totalChapters > 0 ? (cqsDone / totalChapters) * 100 : 0;

    return {
      totalSubjects: subjects.length,
      totalChapters,
      chaptersDone,
      mcqsDone,
      cqsDone,
      totalPossibleTasks,
      totalDoneTasks,
      overallProgressPercent,
      chapterProgressPercent,
      mcqProgressPercent,
      cqProgressPercent,
      priorityChaptersCount,
      fullyCompletedChapters,
      subjectStatsMap,
    };
  }, [subjects]);

  return {
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
  };
}

export interface Chapter {
  id: string;
  name: string;
  order: number;
  chapterDone: boolean;
  mcqDone: boolean;
  cqDone: boolean;
  notes?: string;
  isPriority?: boolean; // Starred / High-yield
  revisionCount?: number; // Multiple revision cycle (1, 2, 3...)
  difficulty?: 'easy' | 'medium' | 'hard';
  lastUpdated?: string;
}

export interface Subject {
  id: string;
  name: string;
  bnName?: string;
  code?: string;
  category: 'core' | 'science' | 'commerce' | 'humanities' | 'general' | 'elective';
  icon: string;
  color: string; // Tailwind color token or hex
  chapters: Chapter[];
  createdAt?: string;
}

export interface ExamTarget {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  enabled: boolean;
}

export interface TrackerState {
  version: number;
  subjects: Subject[];
  theme: 'light' | 'dark' | 'system';
  numberFormat: 'bn' | 'en';
  examTarget?: ExamTarget;
  activePresetId?: string;
}

export type TaskType = 'chapterDone' | 'mcqDone' | 'cqDone';

export type ChapterFilter = 'all' | 'pending' | 'completed' | 'needChapter' | 'needMcq' | 'needCq' | 'priority';

export interface CurriculumPreset {
  id: string;
  title: string;
  bnTitle: string;
  description: string;
  badge: string;
  subjects: Array<{
    id: string;
    name: string;
    bnName: string;
    count: number;
    category: 'core' | 'science' | 'commerce' | 'humanities' | 'general' | 'elective';
    icon: string;
    color: string;
  }>;
}

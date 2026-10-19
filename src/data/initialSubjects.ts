import { Subject, Chapter } from '../types';
import { toBnNumber } from '../utils/numberUtils';

function createChapters(count: number, prefix: string = 'অধ্যায় '): Chapter[] {
  return Array.from({ length: count }, (_, idx) => {
    const chapterNum = idx + 1;
    return {
      id: `ch-${Date.now()}-${Math.random().toString(36).substr(2, 6)}-${chapterNum}`,
      name: `${prefix}${toBnNumber(chapterNum)}`,
      order: chapterNum,
      chapterDone: false,
      mcqDone: false,
      cqDone: false,
    };
  });
}

export const INITIAL_SUBJECTS_CONFIG = [
  {
    id: 'bangla-1st',
    name: 'বাংলা ১ম পত্র',
    count: 30,
    category: 'core' as const,
    icon: 'BookOpen',
    color: 'emerald',
    bnName: 'বাংলা ১ম পত্র (সাহিত্য)',
  },
  {
    id: 'bangla-2nd',
    name: 'বাংলা ২য় পত্র',
    count: 43,
    category: 'core' as const,
    icon: 'BookMarked',
    color: 'teal',
    bnName: 'বাংলা ২য় পত্র (ব্যাকরণ ও নির্মিতি)',
  },
  {
    id: 'gen-math',
    name: 'General Mathematics',
    count: 17,
    category: 'science' as const,
    icon: 'Calculator',
    color: 'blue',
    bnName: 'সাধারণ গণিত',
  },
  {
    id: 'higher-math',
    name: 'Higher Mathematics',
    count: 14,
    category: 'science' as const,
    icon: 'Sigma',
    color: 'indigo',
    bnName: 'উচ্চতর গণিত',
  },
  {
    id: 'physics',
    name: 'Physics',
    count: 14,
    category: 'science' as const,
    icon: 'Atom',
    color: 'violet',
    bnName: 'পদার্থবিজ্ঞান',
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    count: 12,
    category: 'science' as const,
    icon: 'FlaskConical',
    color: 'amber',
    bnName: 'রসায়ন',
  },
  {
    id: 'biology',
    name: 'Biology',
    count: 14,
    category: 'science' as const,
    icon: 'Dna',
    color: 'green',
    bnName: 'জীববিজ্ঞান',
  },
  {
    id: 'islam',
    name: 'Islam',
    count: 5,
    category: 'general' as const,
    icon: 'Compass',
    color: 'cyan',
    bnName: 'ইসলাম ও নৈতিক শিক্ষা',
  },
  {
    id: 'ict',
    name: 'ICT',
    count: 6,
    category: 'general' as const,
    icon: 'Cpu',
    color: 'rose',
    bnName: 'তথ্য ও যোগাযোগ প্রযুক্তি',
  },
  {
    id: 'bgs',
    name: 'BGS',
    count: 15,
    category: 'general' as const,
    icon: 'Globe',
    color: 'orange',
    bnName: 'বাংলাদেশ ও বিশ্বপরিচয়',
  },
];

export function getInitialSubjects(): Subject[] {
  return INITIAL_SUBJECTS_CONFIG.map((conf) => ({
    id: conf.id,
    name: conf.name,
    bnName: conf.bnName,
    category: conf.category,
    icon: conf.icon,
    color: conf.color,
    chapters: createChapters(conf.count),
    createdAt: new Date().toISOString(),
  }));
}

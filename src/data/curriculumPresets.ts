import { CurriculumPreset, Chapter, Subject } from '../types';
import { toBnNumber } from '../utils/numberUtils';

export function createPresetChapters(count: number, prefix: string = 'অধ্যায় '): Chapter[] {
  return Array.from({ length: count }, (_, idx) => {
    const chapterNum = idx + 1;
    return {
      id: `ch-${Date.now()}-${Math.random().toString(36).substring(2, 7)}-${chapterNum}`,
      name: `${prefix}${toBnNumber(chapterNum)}`,
      order: chapterNum,
      chapterDone: false,
      mcqDone: false,
      cqDone: false,
      isPriority: false,
      revisionCount: 0,
    };
  });
}

export const CURRICULUM_PRESETS: CurriculumPreset[] = [
  {
    id: 'ssc-science-full',
    title: 'SSC Science (বিজ্ঞান বিভাগ)',
    bnTitle: 'এসএসসি বিজ্ঞান পূর্ণাঙ্গ ১২ বিষয়',
    description: 'বাংলা, ইংরেজি, গণিত, পদার্থ, রসায়ন, জীববিজ্ঞান, উচ্চতর গণিত সহ পূর্ণাঙ্গ সিলেবাস।',
    badge: 'জনপ্রিয় (Most Popular)',
    subjects: [
      { id: 'bangla-1st', name: 'বাংলা ১ম পত্র', bnName: 'বাংলা ১ম পত্র (সাহিত্য)', count: 30, category: 'core', icon: 'BookOpen', color: 'emerald' },
      { id: 'bangla-2nd', name: 'বাংলা ২য় পত্র', bnName: 'বাংলা ২য় পত্র (ব্যাকরণ ও নির্মিতি)', count: 43, category: 'core', icon: 'BookMarked', color: 'teal' },
      { id: 'eng-1st', name: 'English 1st Paper', bnName: 'ইংরেজি ১ম পত্র', count: 15, category: 'core', icon: 'FileText', color: 'blue' },
      { id: 'eng-2nd', name: 'English 2nd Paper', bnName: 'ইংরেজি ২য় পত্র (Grammar & Comp)', count: 12, category: 'core', icon: 'FileText', color: 'indigo' },
      { id: 'gen-math', name: 'General Mathematics', bnName: 'সাধারণ গণিত', count: 17, category: 'science', icon: 'Calculator', color: 'blue' },
      { id: 'higher-math', name: 'Higher Mathematics', bnName: 'উচ্চতর গণিত', count: 14, category: 'science', icon: 'Sigma', color: 'indigo' },
      { id: 'physics', name: 'Physics', bnName: 'পদার্থবিজ্ঞান', count: 14, category: 'science', icon: 'Atom', color: 'violet' },
      { id: 'chemistry', name: 'Chemistry', bnName: 'রসায়ন', count: 12, category: 'science', icon: 'FlaskConical', color: 'amber' },
      { id: 'biology', name: 'Biology', bnName: 'জীববিজ্ঞান', count: 14, category: 'science', icon: 'Dna', color: 'green' },
      { id: 'bgs', name: 'BGS', bnName: 'বাংলাদেশ ও বিশ্বপরিচয়', count: 15, category: 'general', icon: 'Globe', color: 'orange' },
      { id: 'islam', name: 'Islam & Moral Education', bnName: 'ইসলাম ও নৈতিক শিক্ষা', count: 5, category: 'general', icon: 'Compass', color: 'cyan' },
      { id: 'ict', name: 'ICT', bnName: 'তথ্য ও যোগাযোগ প্রযুক্তি', count: 6, category: 'general', icon: 'Cpu', color: 'rose' },
    ],
  },
  {
    id: 'ssc-commerce',
    title: 'SSC Business Studies (ব্যবসায় শিক্ষা)',
    bnTitle: 'এসএসসি ব্যবসায় শিক্ষা বিভাগ',
    description: 'হিসাববিজ্ঞান, ফিন্যান্স, ব্যবসায় উদ্যোগ ও বিজ্ঞান সহ ১১টি বিষয়ের তালিকা।',
    badge: 'কমার্স (Commerce)',
    subjects: [
      { id: 'bangla-1st', name: 'বাংলা ১ম পত্র', bnName: 'বাংলা ১ম পত্র (সাহিত্য)', count: 30, category: 'core', icon: 'BookOpen', color: 'emerald' },
      { id: 'bangla-2nd', name: 'বাংলা ২য় পত্র', bnName: 'বাংলা ২য় পত্র (ব্যাকরণ)', count: 43, category: 'core', icon: 'BookMarked', color: 'teal' },
      { id: 'eng-1st', name: 'English 1st Paper', bnName: 'ইংরেজি ১ম পত্র', count: 15, category: 'core', icon: 'FileText', color: 'blue' },
      { id: 'eng-2nd', name: 'English 2nd Paper', bnName: 'ইংরেজি ২য় পত্র', count: 12, category: 'core', icon: 'FileText', color: 'indigo' },
      { id: 'gen-math', name: 'General Mathematics', bnName: 'সাধারণ গণিত', count: 17, category: 'core', icon: 'Calculator', color: 'blue' },
      { id: 'accounting', name: 'Accounting', bnName: 'হিসাববিজ্ঞান', count: 12, category: 'commerce', icon: 'Calculator', color: 'emerald' },
      { id: 'finance', name: 'Finance & Banking', bnName: 'ফিন্যান্স ও ব্যাংকিং', count: 11, category: 'commerce', icon: 'Award', color: 'amber' },
      { id: 'business-ent', name: 'Business Entrepreneurship', bnName: 'ব্যবসায় উদ্যোগ', count: 11, category: 'commerce', icon: 'Globe', color: 'violet' },
      { id: 'gen-science', name: 'General Science', bnName: 'সাধারণ বিজ্ঞান', count: 14, category: 'general', icon: 'Atom', color: 'cyan' },
      { id: 'ict', name: 'ICT', bnName: 'তথ্য ও যোগাযোগ প্রযুক্তি', count: 6, category: 'general', icon: 'Cpu', color: 'rose' },
      { id: 'islam', name: 'Islam & Moral Education', bnName: 'ইসলাম ও নৈতিক শিক্ষা', count: 5, category: 'general', icon: 'Compass', color: 'teal' },
    ],
  },
  {
    id: 'ssc-humanities',
    title: 'SSC Humanities (মানবিক বিভাগ)',
    bnTitle: 'এসএসসি মানবিক বিভাগ',
    description: 'ইতিহাস, ভূগোল, পৌরনীতি, অর্থনীতি ও সাধারণ বিজ্ঞান সহ মানবিক সিলেবাস।',
    badge: 'আর্টস (Humanities)',
    subjects: [
      { id: 'bangla-1st', name: 'বাংলা ১ম পত্র', bnName: 'বাংলা ১ম পত্র', count: 30, category: 'core', icon: 'BookOpen', color: 'emerald' },
      { id: 'bangla-2nd', name: 'বাংলা ২য় পত্র', bnName: 'বাংলা ২য় পত্র', count: 43, category: 'core', icon: 'BookMarked', color: 'teal' },
      { id: 'eng-1st', name: 'English 1st Paper', bnName: 'ইংরেজি ১ম পত্র', count: 15, category: 'core', icon: 'FileText', color: 'blue' },
      { id: 'eng-2nd', name: 'English 2nd Paper', bnName: 'ইংরেজি ২য় পত্র', count: 12, category: 'core', icon: 'FileText', color: 'indigo' },
      { id: 'gen-math', name: 'General Mathematics', bnName: 'সাধারণ গণিত', count: 17, category: 'core', icon: 'Calculator', color: 'blue' },
      { id: 'history', name: 'History of Bangladesh & World', bnName: 'বাংলাদেশের ইতিহাস ও বিশ্বসভ্যতা', count: 14, category: 'humanities', icon: 'Globe', color: 'amber' },
      { id: 'geography', name: 'Geography & Environment', bnName: 'ভূগোল ও পরিবেশ', count: 15, category: 'humanities', icon: 'Globe', color: 'green' },
      { id: 'civics', name: 'Civics & Citizenship', bnName: 'পৌরনীতি ও নাগরিকতা', count: 11, category: 'humanities', icon: 'Award', color: 'violet' },
      { id: 'economics', name: 'Economics', bnName: 'অর্থনীতি', count: 10, category: 'humanities', icon: 'Calculator', color: 'teal' },
      { id: 'gen-science', name: 'General Science', bnName: 'সাধারণ বিজ্ঞান', count: 14, category: 'general', icon: 'Atom', color: 'cyan' },
      { id: 'ict', name: 'ICT', bnName: 'তথ্য ও যোগাযোগ প্রযুক্তি', count: 6, category: 'general', icon: 'Cpu', color: 'rose' },
    ],
  },
  {
    id: 'hsc-science',
    title: 'HSC Science (এইচএসসি বিজ্ঞান বিভাগ)',
    bnTitle: 'এইচএসসি বিজ্ঞান ১ম ও ২য় পত্র',
    description: 'পদার্থ ১ম ও ২য়, রসায়ন ১ম ও ২য়, উচ্চতর গণিত ১ম ও ২য়, জীববিজ্ঞান ১ম ও ২য় সহ ১৩ বিষয়।',
    badge: 'এইচএসসি (HSC)',
    subjects: [
      { id: 'hsc-phy-1', name: 'Physics 1st Paper', bnName: 'পদার্থবিজ্ঞান ১ম পত্র', count: 10, category: 'science', icon: 'Atom', color: 'violet' },
      { id: 'hsc-phy-2', name: 'Physics 2nd Paper', bnName: 'পদার্থবিজ্ঞান ২য় পত্র', count: 11, category: 'science', icon: 'Atom', color: 'indigo' },
      { id: 'hsc-chem-1', name: 'Chemistry 1st Paper', bnName: 'রসায়ন ১ম পত্র', count: 5, category: 'science', icon: 'FlaskConical', color: 'amber' },
      { id: 'hsc-chem-2', name: 'Chemistry 2nd Paper', bnName: 'রসায়ন ২য় পত্র', count: 5, category: 'science', icon: 'FlaskConical', color: 'orange' },
      { id: 'hsc-math-1', name: 'Higher Math 1st Paper', bnName: 'উচ্চতর গণিত ১ম পত্র', count: 10, category: 'science', icon: 'Sigma', color: 'blue' },
      { id: 'hsc-math-2', name: 'Higher Math 2nd Paper', bnName: 'উচ্চতর গণিত ২য় পত্র', count: 10, category: 'science', icon: 'Sigma', color: 'teal' },
      { id: 'hsc-bio-1', name: 'Biology 1st (Botany)', bnName: 'জীববিজ্ঞান ১ম পত্র (উদ্ভিদবিজ্ঞান)', count: 12, category: 'science', icon: 'Dna', color: 'green' },
      { id: 'hsc-bio-2', name: 'Biology 2nd (Zoology)', bnName: 'জীববিজ্ঞান ২য় পত্র (প্রাণিবিজ্ঞান)', count: 12, category: 'science', icon: 'Dna', color: 'emerald' },
      { id: 'hsc-bangla-1', name: 'Bangla 1st Paper', bnName: 'বাংলা ১ম পত্র (সাহিত্য)', count: 12, category: 'core', icon: 'BookOpen', color: 'rose' },
      { id: 'hsc-bangla-2', name: 'Bangla 2nd Paper', bnName: 'বাংলা ২য় পত্র (ব্যাকরণ ও নির্মিতি)', count: 8, category: 'core', icon: 'BookMarked', color: 'pink' },
      { id: 'hsc-eng-1', name: 'English 1st Paper', bnName: 'ইংরেজি ১ম পত্র', count: 10, category: 'core', icon: 'FileText', color: 'cyan' },
      { id: 'hsc-eng-2', name: 'English 2nd Paper', bnName: 'ইংরেজি ২য় পত্র', count: 10, category: 'core', icon: 'FileText', color: 'sky' },
      { id: 'hsc-ict', name: 'ICT', bnName: 'তথ্য ও যোগাযোগ প্রযুক্তি', count: 6, category: 'general', icon: 'Cpu', color: 'purple' },
    ],
  },
  {
    id: 'ssc-core-classic',
    title: 'SSC 10-Subject Classic (ক্লাসিক ১০ বিষয়)',
    bnTitle: 'ডিফল্ট ১০টি প্রধান বিষয় (১৭০ অধ্যায়)',
    description: 'বাংলা, গণিত, উচ্চতর গণিত, পদার্থ, রসায়ন, জীববিজ্ঞান, বিজিএস, ইসলাম, আইসিটি।',
    badge: 'ডিফল্ট (Original)',
    subjects: [
      { id: 'bangla-1st', name: 'বাংলা ১ম পত্র', bnName: 'বাংলা ১ম পত্র (সাহিত্য)', count: 30, category: 'core', icon: 'BookOpen', color: 'emerald' },
      { id: 'bangla-2nd', name: 'বাংলা ২য় পত্র', bnName: 'বাংলা ২য় পত্র (ব্যাকরণ ও নির্মিতি)', count: 43, category: 'core', icon: 'BookMarked', color: 'teal' },
      { id: 'gen-math', name: 'General Mathematics', bnName: 'সাধারণ গণিত', count: 17, category: 'science', icon: 'Calculator', color: 'blue' },
      { id: 'higher-math', name: 'Higher Mathematics', bnName: 'উচ্চতর গণিত', count: 14, category: 'science', icon: 'Sigma', color: 'indigo' },
      { id: 'physics', name: 'Physics', bnName: 'পদার্থবিজ্ঞান', count: 14, category: 'science', icon: 'Atom', color: 'violet' },
      { id: 'chemistry', name: 'Chemistry', bnName: 'রসায়ন', count: 12, category: 'science', icon: 'FlaskConical', color: 'amber' },
      { id: 'biology', name: 'Biology', bnName: 'জীববিজ্ঞান', count: 14, category: 'science', icon: 'Dna', color: 'green' },
      { id: 'islam', name: 'Islam', bnName: 'ইসলাম ও নৈতিক শিক্ষা', count: 5, category: 'general', icon: 'Compass', color: 'cyan' },
      { id: 'ict', name: 'ICT', bnName: 'তথ্য ও যোগাযোগ প্রযুক্তি', count: 6, category: 'general', icon: 'Cpu', color: 'rose' },
      { id: 'bgs', name: 'BGS', bnName: 'বাংলাদেশ ও বিশ্বপরিচয়', count: 15, category: 'general', icon: 'Globe', color: 'orange' },
    ],
  },
  {
    id: 'admission-prep',
    title: 'Admission Test Prep (এডমিশন প্রস্তুতি)',
    bnTitle: 'মেডিকেল ও ইঞ্জিনিয়ারিং ভর্তি প্রস্তুতি',
    description: 'ফিজিক্স, কেমিস্ট্রি, ম্যাথ/বায়োলজি, ইংলিশ ও সাধারণ জ্ঞান শর্ট সিলেবাস ও মক টেস্ট।',
    badge: 'ভর্তি পরীক্ষা (Admission)',
    subjects: [
      { id: 'adm-phy', name: 'Physics (ভর্তি পরীক্ষা)', bnName: 'পদার্থবিজ্ঞান (এডমিশন কনসেপ্ট)', count: 21, category: 'science', icon: 'Atom', color: 'violet' },
      { id: 'adm-chem', name: 'Chemistry (ভর্তি পরীক্ষা)', bnName: 'রসায়ন (মেডিকেল ও ইঞ্জিনিয়ারিং)', count: 10, category: 'science', icon: 'FlaskConical', color: 'amber' },
      { id: 'adm-math', name: 'Higher Math (ভর্তি পরীক্ষা)', bnName: 'উচ্চতর গণিত (ইঞ্জিনিয়ারিং ও ভার্সিটি ক)', count: 20, category: 'science', icon: 'Sigma', color: 'blue' },
      { id: 'adm-bio', name: 'Biology (মেডিকেল প্রস্তুতি)', bnName: 'জীববিজ্ঞান (মেডিকেল ও ডেন্টাল)', count: 24, category: 'science', icon: 'Dna', color: 'green' },
      { id: 'adm-eng', name: 'English For Admission', bnName: 'ইংরেজি (গ্রামার ও ভোকাবুলারি)', count: 16, category: 'core', icon: 'FileText', color: 'indigo' },
      { id: 'adm-gk', name: 'General Knowledge (বাংলাদেশ ও আন্তর্জাতিক)', bnName: 'সাধারণ জ্ঞান ও সাম্প্রতিক তথ্য', count: 15, category: 'general', icon: 'Globe', color: 'emerald' },
    ],
  },
];

export function buildSubjectsFromPreset(preset: CurriculumPreset): Subject[] {
  return preset.subjects.map((sub) => ({
    id: sub.id,
    name: sub.name,
    bnName: sub.bnName,
    category: sub.category,
    icon: sub.icon,
    color: sub.color,
    chapters: createPresetChapters(sub.count),
    createdAt: new Date().toISOString(),
  }));
}

import React from 'react';
import {
  BookOpen,
  BookMarked,
  Calculator,
  Sigma,
  Atom,
  FlaskConical,
  Dna,
  Compass,
  Cpu,
  Globe,
  GraduationCap,
  FileText,
  Bookmark,
  Award,
  Sparkles,
} from 'lucide-react';

interface Props {
  name: string;
  className?: string;
}

export const SubjectIcon: React.FC<Props> = ({ name, className = 'w-5 h-5' }) => {
  switch (name) {
    case 'BookOpen':
      return <BookOpen className={className} />;
    case 'BookMarked':
      return <BookMarked className={className} />;
    case 'Calculator':
      return <Calculator className={className} />;
    case 'Sigma':
      return <Sigma className={className} />;
    case 'Atom':
      return <Atom className={className} />;
    case 'FlaskConical':
      return <FlaskConical className={className} />;
    case 'Dna':
      return <Dna className={className} />;
    case 'Compass':
      return <Compass className={className} />;
    case 'Cpu':
      return <Cpu className={className} />;
    case 'Globe':
      return <Globe className={className} />;
    case 'FileText':
      return <FileText className={className} />;
    case 'Bookmark':
      return <Bookmark className={className} />;
    case 'Award':
      return <Award className={className} />;
    case 'Sparkles':
      return <Sparkles className={className} />;
    default:
      return <GraduationCap className={className} />;
  }
};

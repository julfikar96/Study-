/**
 * Refined neutral styling tokens for subjects.
 * Strictly adheres to a restrained, premium neutral palette with forest green/emerald accents.
 */

export interface SubjectTheme {
  badge: string;
  dot: string;
  bar: string;
  borderHover: string;
}

export function getSubjectColorTheme(): SubjectTheme {
  return {
    badge: 'bg-stone-100 dark:bg-zinc-800 text-stone-700 dark:text-stone-300 border-stone-200/80 dark:border-zinc-700/80',
    dot: 'bg-stone-400 dark:bg-stone-500',
    bar: 'bg-emerald-600 dark:bg-emerald-500',
    borderHover: 'hover:border-stone-400 dark:hover:border-zinc-600',
  };
}

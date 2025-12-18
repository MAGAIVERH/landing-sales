import type { LucideIcon } from 'lucide-react';

export type UseCase = {
  id: string;
  icon: LucideIcon;
  painTitle: string;
  painDesc: string;
  solutionTitle: string;
  solutionDesc: string;
  bullets: string[];
  outcomes: string[];
};

// Types for Dota 2 Role Finder App

export interface User {
  id: string;
  name: string;
  createdAt: number;
}

export interface PositionScores {
  pos1: number;
  pos2: number;
  pos3: number;
  pos4: number;
  pos5: number;
}

export interface PositionQuizResult {
  type: 'position_quiz';
  mainPos: keyof PositionScores;
  extraPos: keyof PositionScores | null;
  isPure: boolean;
  position: string;
  posShort: string;
  positionIndex: number;
  date: string;
}

export interface HeroResult {
  name: string;
  score: number;
  matchPercent: number;
}

export interface HeroQuizResult {
  type: 'hero_quiz';
  heroPositionIndex: number;
  topHeroes: HeroResult[];
  date: string;
}

export type QuizResult = PositionQuizResult | HeroQuizResult;

export interface UserData {
  user: User;
  results: QuizResult[];
}

export interface Answer {
  id?: string;
  text: string;
  scores?: Partial<PositionScores>;
  tags?: string[];
}

export interface Question {
  questionId?: string;
  question: string;
  answers: Answer[];
}

export interface Hero {
  name: string;
  tags: string[] | Record<string, number | undefined>;
  difficulty?: string;
  melee?: boolean;
  both?: boolean;
}

export interface HeroData {
  questions: Question[];
  heroes: Hero[];
}

export const POSITION_NAMES: Record<string, string> = {
  pos1: 'Pos 1 — Керри',
  pos2: 'Pos 2 — Мидер',
  pos3: 'Pos 3 — Хардлейнер',
  pos4: 'Pos 4 — Роумер',
  pos5: 'Pos 5 — Фулл-саппорт',
};

export const POSITION_SHORT_NAMES: Record<string, string> = {
  pos1: 'Керри',
  pos2: 'Мидер',
  pos3: 'Хардлейнер',
  pos4: 'Роумер',
  pos5: 'Фулл-саппорт',
};

export const HERO_HEADER_TEXTS: Record<number, string> = {
  0: 'Герои для Керри',
  1: 'Герои для Мидера',
  2: 'Герои для Хардлейнера',
  3: 'Герои для Роумера',
  4: 'Герои для Фулл-саппорта',
};

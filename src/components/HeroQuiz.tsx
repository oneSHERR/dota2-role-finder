import { useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, RotateCcw, ExternalLink } from 'lucide-react';
import {
  heroCarryData,
  heroMidData,
  heroOfflaneData,
  heroPos4Data,
  heroPos5Data,
  getHeroIconUrlByName,
  getDota2ProTrackerUrl,
} from '@/data';
import type { HeroQuizResult, HeroResult } from '@/types';
import { HERO_HEADER_TEXTS } from '@/types';

interface HeroQuizProps {
  positionIndex: number;
  onComplete: (result: HeroQuizResult) => void;
  onBack: () => void;
}

const heroDataByPosition = [
  heroCarryData,
  heroMidData,
  heroOfflaneData,
  heroPos4Data,
  heroPos5Data,
];

export function HeroQuiz({ positionIndex, onComplete, onBack }: HeroQuizProps) {
  const heroData = heroDataByPosition[positionIndex];
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[][]>([]);
  const [currentSelections, setCurrentSelections] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<HeroQuizResult | null>(null);

  const question = heroData.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / heroData.questions.length) * 100;

  // Shuffle answers for carry position (position 0)
  const displayAnswers = useMemo(() => {
    if (positionIndex === 0) {
      const shuffled = [...question.answers];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    }
    return question.answers;
  }, [question.answers, positionIndex]);

  const handleSelect = useCallback((index: number) => {
    setCurrentSelections((prev) => {
      const exists = prev.includes(index);
      if (exists) {
        return prev.filter((i) => i !== index);
      }
      if (prev.length >= 2) return prev;
      return [...prev, index];
    });
  }, []);

  const handleNext = useCallback(() => {
    if (currentSelections.length === 0) return;

    const selectedTags = currentSelections.flatMap(
      (i) => displayAnswers[i].tags || []
    );
    setAnswers((prev) => [...prev, selectedTags]);

    if (currentQuestion < heroData.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setCurrentSelections([]);
    } else {
      // Calculate results
      const allAnswers = [...answers, selectedTags];
      const topHeroes = calculateTopHeroes(allAnswers, heroData.heroes, positionIndex);

      const quizResult: HeroQuizResult = {
        type: 'hero_quiz',
        heroPositionIndex: positionIndex,
        topHeroes,
        date: new Date().toLocaleDateString('ru-RU'),
      };

      setResult(quizResult);
      setShowResult(true);
      onComplete(quizResult);
    }
  }, [
    currentSelections,
    currentQuestion,
    heroData.questions.length,
    heroData.heroes,
    positionIndex,
    displayAnswers,
    answers,
    onComplete,
  ]);

  const handleBack = useCallback(() => {
    if (currentQuestion > 0) {
      setAnswers((prev) => prev.slice(0, -1));
      setCurrentQuestion((prev) => prev - 1);
      setCurrentSelections([]);
    } else {
      onBack();
    }
  }, [currentQuestion, onBack]);

  const handleRestart = useCallback(() => {
    setCurrentQuestion(0);
    setAnswers([]);
    setCurrentSelections([]);
    setShowResult(false);
    setResult(null);
  }, []);

  const getHintText = () => {
    if (currentSelections.length === 0) return 'Выбери 1 или 2 варианта';
    if (currentSelections.length === 2) return 'Выбрано максимум';
    return 'Можно добавить ещё один вариант';
  };

  if (showResult && result) {
    return (
      <div className="space-y-6">
        <Card className="bg-[rgba(15,15,20,0.9)] border-[rgba(255,255,255,0.08)] backdrop-blur-xl">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#a70008] to-[#461818] flex items-center justify-center text-lg mx-auto mb-3 shadow-[0_0_16px_rgba(241,40,40,0.5)]">
                ⚔️
              </div>
              <h2 className="text-xl font-bold text-white">
                {HERO_HEADER_TEXTS[positionIndex]}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {result.topHeroes.map((hero, index) => {
                const matchPercent = hero.matchPercent;
                let borderClass = 'border-[rgba(255,255,255,0.06)]';
                let shadowClass = '';

                if (matchPercent >= 90) {
                  borderClass = 'border-[rgba(255,215,90,0.9)]';
                  shadowClass = 'shadow-[0_0_26px_rgba(255,215,90,0.55)]';
                } else if (matchPercent >= 75) {
                  borderClass = 'border-[rgba(210,218,255,0.85)]';
                  shadowClass = 'shadow-[0_0_16px_rgba(210,218,255,0.25)]';
                } else {
                  borderClass = 'border-[rgba(224,169,109,0.8)]';
                  shadowClass = 'shadow-[0_0_10px_rgba(224,169,109,0.25)]';
                }

                return (
                  <div
                    key={hero.name}
                    className={`p-4 rounded-2xl bg-[rgba(15,15,20,0.9)] border ${borderClass} ${shadowClass}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={getHeroIconUrlByName(hero.name)}
                          alt={hero.name}
                          className="w-11 h-6 rounded object-cover border border-[rgba(255,255,255,0.12)]"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                        <span className="font-semibold text-white text-sm">
                          {hero.name}
                        </span>
                      </div>
                      <div className="w-6 h-6 rounded-full bg-[rgba(31,41,55,0.9)] border border-[rgba(255,255,255,0.18)] flex items-center justify-center text-xs font-semibold text-[#f9fafb]">
                        {index + 1}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-[#9b9ba1]">Совпадение:</span>
                        <span className="text-[#ffd75a] font-semibold">
                          {matchPercent}%
                        </span>
                      </div>
                      <div className="h-1 rounded-full bg-[rgba(30,30,40,1)] overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#ff9f1c] to-[#ffd75a] shadow-[0_0_8px_rgba(255,159,28,0.7)]"
                          style={{ width: `${matchPercent}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-3 flex justify-end">
                      <a
                        href={getDota2ProTrackerUrl(hero.name)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1 rounded-full bg-[rgba(15,23,42,0.95)] text-[#e0f2fe] text-xs font-medium border border-[rgba(56,189,248,0.7)] hover:bg-[rgba(74,158,255,0.2)] transition-colors"
                      >
                        Открыть гайд
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button
            onClick={handleRestart}
            variant="outline"
            className="flex-1 border-[rgba(255,255,255,0.15)] text-[#9b9ba1] hover:bg-[rgba(255,255,255,0.05)] hover:text-white"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Пройти снова
          </Button>
          <Button
            onClick={onBack}
            className="flex-1 bg-gradient-to-r from-[#3a7bd5] to-[#00d2ff] hover:from-[#2a6bc5] hover:to-[#00c2ef] text-white"
          >
            Готово
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-[#9b9ba1]">
          <span>
            Вопрос {currentQuestion + 1} из {heroData.questions.length}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress
          value={progress}
          className="h-2 bg-[rgba(255,255,255,0.06)]"
        />
      </div>

      <Card className="bg-[rgba(15,15,20,0.9)] border-[rgba(255,255,255,0.08)] backdrop-blur-xl">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-white mb-2 leading-relaxed">
            {question.question}
          </h2>
          <p className="text-sm text-[#9b9ba1] mb-6">{getHintText()}</p>

          <div className="space-y-3">
            {displayAnswers.map((answer, index) => {
              const parts = answer.text.split(' ');
              const emoji = parts[0];
              const text = parts.slice(1).join(' ');
              const isSelected = currentSelections.includes(index);

              return (
                <button
                  key={index}
                  onClick={() => handleSelect(index)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 ${
                    isSelected
                      ? 'bg-gradient-to-r from-[rgba(58,123,213,0.28)] to-[rgba(8,8,14,0.98)] border-[#3a7bd5]'
                      : 'bg-gradient-to-r from-[rgba(58,123,213,0.12)] to-[rgba(10,10,16,0.96)] border-[rgba(255,255,255,0.06)] hover:border-[rgba(58,123,213,0.45)]'
                  }`}
                >
                  <span className="text-xl mr-3">{emoji}</span>
                  <span className="text-white">{text}</span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button
          onClick={handleBack}
          variant="outline"
          className="flex-1 border-[rgba(255,255,255,0.15)] text-[#9b9ba1] hover:bg-[rgba(255,255,255,0.05)] hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Назад
        </Button>
        <Button
          onClick={handleNext}
          disabled={currentSelections.length === 0}
          className="flex-1 bg-gradient-to-r from-[#3a7bd5] to-[#00d2ff] hover:from-[#2a6bc5] hover:to-[#00c2ef] text-white disabled:opacity-50"
        >
          {currentQuestion === heroData.questions.length - 1
            ? 'Результат'
            : 'Далее'}
        </Button>
      </div>
    </div>
  );
}

function calculateTopHeroes(
  allAnswers: string[][],
  heroes: { name: string; tags: string[] | Record<string, number | undefined>; difficulty?: string; melee?: boolean; both?: boolean }[],
  positionIndex: number
): HeroResult[] {
  // Collect weighted tags
  const selectedTags: Record<string, number> = {};
  let selectedDifficulty: string | null = null;
  let wantsMelee = false;
  let wantsRanged = false;

  allAnswers.forEach((questionAnswers) => {
    const weight = questionAnswers.length === 1 ? 1.0 : 0.5;
    const questionTagWeights: Record<string, number> = {};

    questionAnswers.forEach((tag) => {
      if (tag === 'easy' || tag === 'medium' || tag === 'hard') {
        selectedDifficulty = tag;
      } else if (tag === 'melee') {
        wantsMelee = true;
      } else if (tag === 'ranged') {
        wantsRanged = true;
      } else {
        questionTagWeights[tag] = Math.min(1.0, (questionTagWeights[tag] || 0) + weight);
      }
    });

    Object.entries(questionTagWeights).forEach(([tag, w]) => {
      selectedTags[tag] = (selectedTags[tag] || 0) + w;
    });
  });

  // Score heroes
  const scoredHeroes = heroes.map((hero) => {
    let score = 0;
    const heroTags = hero.tags;

    Object.entries(selectedTags).forEach(([tag, weight]) => {
      if (Array.isArray(heroTags)) {
        if (heroTags.includes(tag)) {
          score += weight;
        }
      } else if (heroTags && typeof heroTags === 'object') {
        if (heroTags[tag] !== undefined) {
          score += heroTags[tag] * weight;
        }
      }
    });

    // Difficulty bonus
    if (selectedDifficulty && hero.difficulty === selectedDifficulty) {
      score += 1.5;
    }

    // Random tiebreaker for carry
    if (positionIndex === 0) {
      score += Math.random() * 0.02 - 0.01;
    }

    return { ...hero, score };
  });

  scoredHeroes.sort((a, b) => b.score - a.score);

  // Filter by melee/ranged for carry
  if (positionIndex === 0 && (wantsMelee || wantsRanged) && !(wantsMelee && wantsRanged)) {
    const preferred = scoredHeroes.filter((h) => {
      if (Array.isArray(h.tags)) {
        if (wantsMelee) return h.tags.includes('melee') && !h.tags.includes('ranged');
        return h.tags.includes('ranged') && !h.tags.includes('melee');
      }
      return wantsMelee ? h.melee === true || h.both === true : h.melee === false || h.both === true;
    });
    const fallback = scoredHeroes.filter((h) => !preferred.includes(h));
    const result = [...preferred, ...fallback];
    return result.slice(0, 5).map((h, i) => ({
      name: h.name,
      score: h.score,
      matchPercent: calculateMatchPercent(h.score, result[0].score, result[result.length - 1].score, i),
    }));
  }

  const topHeroes = scoredHeroes.slice(0, 5);
  const maxScore = topHeroes[0]?.score || 1;
  const minScore = topHeroes[topHeroes.length - 1]?.score || 0;

  return topHeroes.map((h, i) => ({
    name: h.name,
    score: h.score,
    matchPercent: calculateMatchPercent(h.score, maxScore, minScore, i),
  }));
}

function calculateMatchPercent(
  score: number,
  maxScore: number,
  minScore: number,
  _index: number
): number {
  if (maxScore === minScore) {
    return 75;
  }
  const normalized = (score - minScore) / (maxScore - minScore);
  return Math.round(60 + normalized * 40);
}

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { positionQuizData, getPurePosition, positionDescriptions } from '@/data';
import { POSITION_NAMES, POSITION_SHORT_NAMES } from '@/types';
import type { PositionScores, PositionQuizResult } from '@/types';

interface PositionQuizProps {
  onComplete: (result: PositionQuizResult) => void;
  onBack: () => void;
}

export function PositionQuiz({ onComplete, onBack }: PositionQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState<PositionScores>({
    pos1: 0,
    pos2: 0,
    pos3: 0,
    pos4: 0,
    pos5: 0,
  });
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<PositionQuizResult | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const question = positionQuizData[currentQuestion];
  const progress = ((currentQuestion + 1) / positionQuizData.length) * 100;

  const handleAnswer = useCallback(
    (answerIndex: number) => {
      const answer = question.answers[answerIndex];
      const answerId = answer.id!;

      // Update scores
      if (answer.scores) {
        setScores((prev) => ({
          pos1: prev.pos1 + (answer.scores?.pos1 || 0),
          pos2: prev.pos2 + (answer.scores?.pos2 || 0),
          pos3: prev.pos3 + (answer.scores?.pos3 || 0),
          pos4: prev.pos4 + (answer.scores?.pos4 || 0),
          pos5: prev.pos5 + (answer.scores?.pos5 || 0),
        }));
      }

      const newSelectedAnswers = [...selectedAnswers, answerId];
      setSelectedAnswers(newSelectedAnswers);

      // Move to next question or show result
      if (currentQuestion < positionQuizData.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
      } else {
        // Calculate result
        const purePos = getPurePosition(newSelectedAnswers);
        const isPure = purePos !== null;

        let mainPos: keyof PositionScores;
        let extraPos: keyof PositionScores | null;

        if (purePos) {
          mainPos = purePos;
          extraPos = null;
        } else {
          const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
          mainPos = sorted[0][0] as keyof PositionScores;
          extraPos = sorted[1][0] as keyof PositionScores;
        }

        const quizResult: PositionQuizResult = {
          type: 'position_quiz',
          mainPos,
          extraPos,
          isPure,
          position: POSITION_NAMES[mainPos],
          posShort: POSITION_SHORT_NAMES[mainPos],
          positionIndex: parseInt(mainPos.replace('pos', '')) - 1,
          date: new Date().toLocaleDateString('ru-RU'),
        };

        setResult(quizResult);
        setShowResult(true);
        onComplete(quizResult);
      }
    },
    [currentQuestion, question, scores, selectedAnswers, onComplete]
  );

  const handleBack = useCallback(() => {
    if (currentQuestion > 0) {
      const prevAnswerId = selectedAnswers[currentQuestion - 1];
      const prevQuestion = positionQuizData[currentQuestion - 1];
      const prevAnswer = prevQuestion.answers.find((a) => a.id === prevAnswerId);

      if (prevAnswer?.scores) {
        setScores((prev) => ({
          pos1: prev.pos1 - (prevAnswer.scores?.pos1 || 0),
          pos2: prev.pos2 - (prevAnswer.scores?.pos2 || 0),
          pos3: prev.pos3 - (prevAnswer.scores?.pos3 || 0),
          pos4: prev.pos4 - (prevAnswer.scores?.pos4 || 0),
          pos5: prev.pos5 - (prevAnswer.scores?.pos5 || 0),
        }));
      }

      setSelectedAnswers((prev) => prev.slice(0, -1));
      setCurrentQuestion((prev) => prev - 1);
    } else {
      onBack();
    }
  }, [currentQuestion, selectedAnswers, onBack]);

  const handleRestart = useCallback(() => {
    setCurrentQuestion(0);
    setScores({ pos1: 0, pos2: 0, pos3: 0, pos4: 0, pos5: 0 });
    setSelectedAnswers([]);
    setShowResult(false);
    setResult(null);
    setShowDetails(false);
  }, []);

  if (showResult && result) {
    const descriptionKey = result.isPure
      ? `${result.mainPos}_pure`
      : `${result.mainPos}_${result.extraPos}`;
    const description =
      positionDescriptions[descriptionKey] ||
      positionDescriptions[`${result.mainPos}_pure`] ||
      '';

    return (
      <div className="space-y-6">
        <Card className="bg-[rgba(15,15,20,0.9)] border-[rgba(255,255,255,0.08)] backdrop-blur-xl">
          <CardContent className="p-6 text-center">
            <div className="text-4xl mb-4">🎯</div>
            <p className="text-sm text-[#9b9ba1] uppercase tracking-wider mb-2">
              Твоя позиция
            </p>
            <h2 className="text-2xl font-bold text-white mb-4">
              {result.position}
            </h2>

            <div className="inline-flex items-center justify-center px-6 py-2 rounded-full bg-gradient-to-r from-[#1b2638] to-[#111827] border border-[#3cc3ff] text-[#e9f5ff] font-semibold mb-4 shadow-[0_0_10px_rgba(60,195,255,0.45)]">
              {result.posShort}
            </div>

            {!result.isPure && result.extraPos && (
              <div className="mt-4">
                <p className="text-sm text-[#9b9ba1] mb-2">Дополнительная позиция:</p>
                <div className="inline-flex items-center justify-center px-5 py-1.5 rounded-full bg-gradient-to-r from-[#0f172a] to-[#020617] border border-[rgba(80,180,255,0.6)] text-[#d7e2ff] text-sm">
                  {POSITION_SHORT_NAMES[result.extraPos]}
                </div>
              </div>
            )}

            <div className="mt-6">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-[#3a7bd5] hover:text-[#00d2ff] text-sm font-medium transition-colors"
              >
                {showDetails ? 'Скрыть детали' : 'Показать детали'}
              </button>
            </div>

            {showDetails && description && (
              <div className="mt-4 p-4 rounded-xl bg-[rgba(58,123,213,0.08)] border border-[rgba(58,123,213,0.25)] text-left">
                <p className="text-[#9b9ba1] text-sm whitespace-pre-line leading-relaxed">
                  {description}
                </p>
              </div>
            )}
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
            Вопрос {currentQuestion + 1} из {positionQuizData.length}
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
          <h2 className="text-lg font-semibold text-white mb-6 leading-relaxed">
            {question.question}
          </h2>

          <div className="space-y-3">
            {question.answers.map((answer, index) => {
              const parts = answer.text.split(' ');
              const emoji = parts[0];
              const text = parts.slice(1).join(' ');

              return (
                <button
                  key={answer.id || index}
                  onClick={() => handleAnswer(index)}
                  className="w-full text-left p-4 rounded-2xl bg-gradient-to-r from-[rgba(58,123,213,0.12)] to-[rgba(10,10,16,0.96)] border border-[rgba(255,255,255,0.06)] hover:border-[rgba(58,123,213,0.45)] hover:from-[rgba(58,123,213,0.18)] hover:to-[rgba(15,15,22,0.98)] transition-all duration-200 group"
                >
                  <span className="text-xl mr-3">{emoji}</span>
                  <span className="text-white group-hover:text-[#e8f4ff] transition-colors">
                    {text}
                  </span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Button
        onClick={handleBack}
        variant="outline"
        className="w-full border-[rgba(255,255,255,0.15)] text-[#9b9ba1] hover:bg-[rgba(255,255,255,0.05)] hover:text-white"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Назад
      </Button>
    </div>
  );
}

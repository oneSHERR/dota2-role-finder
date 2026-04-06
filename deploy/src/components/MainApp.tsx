import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Target, 
  User, 
  Sword, 
  ChevronRight, 
  LogOut,
  Trophy,
  Sparkles
} from 'lucide-react';
import { PositionQuiz } from './PositionQuiz';
import { HeroQuiz } from './HeroQuiz';
import type { User as UserType, QuizResult, PositionQuizResult, HeroQuizResult } from '@/types';
import { HERO_HEADER_TEXTS, POSITION_SHORT_NAMES } from '@/types';
import { getHeroIconUrlByName } from '@/data';

interface MainAppProps {
  user: UserType;
  results: QuizResult[];
  onLogout: () => void;
  onAddResult: (result: QuizResult) => void;
}

type View = 'home' | 'position-quiz' | 'hero-quiz-select' | 'hero-quiz';

export function MainApp({ user, results, onLogout, onAddResult }: MainAppProps) {
  const [view, setView] = useState<View>('home');
  const [selectedHeroPosition, setSelectedHeroPosition] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('home');

  const lastPositionResult = results
    .filter((r): r is PositionQuizResult => r.type === 'position_quiz')
    .pop();

  const lastHeroResult = results
    .filter((r): r is HeroQuizResult => r.type === 'hero_quiz')
    .pop();

  const handlePositionQuizComplete = (result: PositionQuizResult) => {
    onAddResult(result);
  };

  const handleHeroQuizComplete = (result: HeroQuizResult) => {
    onAddResult(result);
  };

  const startHeroQuizWithPosition = (positionIndex: number) => {
    setSelectedHeroPosition(positionIndex);
    setView('hero-quiz');
  };

  const renderContent = () => {
    switch (view) {
      case 'position-quiz':
        return (
          <PositionQuiz
            onComplete={(result) => {
              handlePositionQuizComplete(result);
              setView('home');
              setActiveTab('home');
            }}
            onBack={() => setView('home')}
          />
        );

      case 'hero-quiz-select':
        return (
          <div className="space-y-6">
            <Card className="bg-[rgba(15,15,20,0.9)] border-[rgba(255,255,255,0.08)] backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white">Выбери позицию</CardTitle>
                <CardDescription className="text-[#9b9ba1]">
                  Для какой позиции подобрать героев?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {lastPositionResult && (
                  <button
                    onClick={() => startHeroQuizWithPosition(lastPositionResult.positionIndex)}
                    className="w-full p-4 rounded-xl bg-gradient-to-r from-[rgba(58,123,213,0.2)] to-[rgba(10,10,16,0.96)] border border-[rgba(58,123,213,0.5)] hover:border-[#3a7bd5] transition-all text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-[#9b9ba1]">Твоя позиция</p>
                        <p className="text-white font-semibold">{lastPositionResult.posShort}</p>
                      </div>
                      <Sparkles className="w-5 h-5 text-[#3a7bd5]" />
                    </div>
                  </button>
                )}
                
                <div className="grid grid-cols-1 gap-2">
                  {Object.entries(POSITION_SHORT_NAMES).map(([key, name], index) => (
                    <button
                      key={key}
                      onClick={() => startHeroQuizWithPosition(index)}
                      className="w-full p-4 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.08)] hover:border-[rgba(58,123,213,0.45)] transition-all text-left"
                    >
                      <span className="text-white">{name}</span>
                    </button>
                  ))}
                </div>

                <Button
                  onClick={() => setView('home')}
                  variant="outline"
                  className="w-full border-[rgba(255,255,255,0.15)] text-[#9b9ba1] hover:bg-[rgba(255,255,255,0.05)] hover:text-white"
                >
                  Назад
                </Button>
              </CardContent>
            </Card>
          </div>
        );

      case 'hero-quiz':
        if (selectedHeroPosition === null) return null;
        return (
          <HeroQuiz
            positionIndex={selectedHeroPosition}
            onComplete={(result) => {
              handleHeroQuizComplete(result);
              setView('home');
              setActiveTab('home');
            }}
            onBack={() => setView('hero-quiz-select')}
          />
        );

      default:
        return (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-[rgba(255,255,255,0.05)]">
              <TabsTrigger value="home" className="data-[state=active]:bg-[rgba(58,123,213,0.3)] data-[state=active]:text-white">
                <Target className="w-4 h-4 mr-1" />
                Квизы
              </TabsTrigger>
              <TabsTrigger value="results" className="data-[state=active]:bg-[rgba(58,123,213,0.3)] data-[state=active]:text-white">
                <Trophy className="w-4 h-4 mr-1" />
                Результаты
              </TabsTrigger>
              <TabsTrigger value="profile" className="data-[state=active]:bg-[rgba(58,123,213,0.3)] data-[state=active]:text-white">
                <User className="w-4 h-4 mr-1" />
                Профиль
              </TabsTrigger>
            </TabsList>

            <TabsContent value="home" className="mt-6 space-y-4">
              {/* Position Quiz Card */}
              <Card className="bg-[rgba(15,15,20,0.9)] border-[rgba(255,255,255,0.08)] backdrop-blur-xl overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-[#3a7bd5] to-[#00d2ff]" />
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#3a7bd5] to-[#00d2ff] flex items-center justify-center">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    {lastPositionResult && (
                      <Badge variant="secondary" className="bg-[rgba(58,123,213,0.2)] text-[#00d2ff] border border-[rgba(58,123,213,0.3)]">
                        Пройден
                      </Badge>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    Квиз по позициям
                  </h3>
                  <p className="text-[#9b9ba1] text-sm mb-4">
                    Узнай, какая позиция (1-5) тебе подходит больше всего
                  </p>
                  <Button
                    onClick={() => setView('position-quiz')}
                    className="w-full bg-gradient-to-r from-[#3a7bd5] to-[#00d2ff] hover:from-[#2a6bc5] hover:to-[#00c2ef] text-white"
                  >
                    {lastPositionResult ? 'Пройти снова' : 'Начать'}
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              {/* Hero Quiz Card */}
              <Card className="bg-[rgba(15,15,20,0.9)] border-[rgba(255,255,255,0.08)] backdrop-blur-xl overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-[#ff9f1c] to-[#ffd75a]" />
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#ff9f1c] to-[#ffd75a] flex items-center justify-center">
                      <Sword className="w-6 h-6 text-white" />
                    </div>
                    {lastHeroResult && (
                      <Badge variant="secondary" className="bg-[rgba(255,159,28,0.2)] text-[#ffd75a] border border-[rgba(255,159,28,0.3)]">
                        Пройден
                      </Badge>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    Квиз по героям
                  </h3>
                  <p className="text-[#9b9ba1] text-sm mb-4">
                    Подбери идеальных героев под свою позицию
                  </p>
                  <Button
                    onClick={() => setView('hero-quiz-select')}
                    variant="outline"
                    className="w-full border-[rgba(255,159,28,0.5)] text-[#ffd75a] hover:bg-[rgba(255,159,28,0.1)]"
                  >
                    {lastHeroResult ? 'Пройти снова' : 'Начать'}
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="results" className="mt-6 space-y-4">
              {lastPositionResult ? (
                <Card className="bg-[rgba(15,15,20,0.9)] border-[rgba(255,255,255,0.08)] backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Последняя позиция</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#3a7bd5] to-[#00d2ff] flex items-center justify-center text-2xl">
                        🎯
                      </div>
                      <div>
                        <p className="text-white font-semibold text-lg">
                          {lastPositionResult.position}
                        </p>
                        <p className="text-[#9b9ba1] text-sm">
                          Пройден: {lastPositionResult.date}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-[rgba(15,15,20,0.9)] border-[rgba(255,255,255,0.08)] backdrop-blur-xl">
                  <CardContent className="p-8 text-center">
                    <Target className="w-12 h-12 text-[#9b9ba1] mx-auto mb-4 opacity-50" />
                    <p className="text-[#9b9ba1]">Пройди квиз по позициям, чтобы увидеть результат</p>
                  </CardContent>
                </Card>
              )}

              {lastHeroResult ? (
                <Card className="bg-[rgba(15,15,20,0.9)] border-[rgba(255,255,255,0.08)] backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">
                      {HERO_HEADER_TEXTS[lastHeroResult.heroPositionIndex]}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {lastHeroResult.topHeroes.slice(0, 3).map((hero, index) => (
                        <div
                          key={hero.name}
                          className="flex items-center gap-3 p-3 rounded-xl bg-[rgba(255,255,255,0.05)]"
                        >
                          <span className="text-[#9b9ba1] font-semibold w-6">
                            {index + 1}
                          </span>
                          <img
                            src={getHeroIconUrlByName(hero.name)}
                            alt={hero.name}
                            className="w-12 h-7 rounded object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                          <span className="text-white flex-1">{hero.name}</span>
                          <span className="text-[#ffd75a] font-semibold">
                            {hero.matchPercent}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-[rgba(15,15,20,0.9)] border-[rgba(255,255,255,0.08)] backdrop-blur-xl">
                  <CardContent className="p-8 text-center">
                    <Sword className="w-12 h-12 text-[#9b9ba1] mx-auto mb-4 opacity-50" />
                    <p className="text-[#9b9ba1]">Пройди квиз по героям, чтобы увидеть результат</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="profile" className="mt-6 space-y-4">
              <Card className="bg-[rgba(15,15,20,0.9)] border-[rgba(255,255,255,0.08)] backdrop-blur-xl">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#3a7bd5] to-[#00d2ff] flex items-center justify-center text-2xl font-bold text-white">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-white font-semibold text-lg">{user.name}</p>
                      <p className="text-[#9b9ba1] text-sm">
                        Пройдено квизов: {results.length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[rgba(15,15,20,0.9)] border-[rgba(255,255,255,0.08)] backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Статистика</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[#9b9ba1]">Квизов по позициям</span>
                    <span className="text-white font-semibold">
                      {results.filter((r) => r.type === 'position_quiz').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#9b9ba1]">Квизов по героям</span>
                    <span className="text-white font-semibold">
                      {results.filter((r) => r.type === 'hero_quiz').length}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Button
                onClick={onLogout}
                variant="outline"
                className="w-full border-[rgba(255,255,255,0.15)] text-[#9b9ba1] hover:bg-[rgba(255,255,255,0.05)] hover:text-white"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Выйти
              </Button>
            </TabsContent>
          </Tabs>
        );
    }
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[rgba(5,5,9,0.95)] backdrop-blur-xl border-b border-[rgba(255,255,255,0.08)]">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3a7bd5] to-[#00d2ff] flex items-center justify-center">
              <Sword className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold">Dota 2 Role Finder</h1>
              <p className="text-[#9b9ba1] text-xs">Привет, {user.name}!</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-lg mx-auto px-4 py-6">
        {renderContent()}
      </main>
    </div>
  );
}

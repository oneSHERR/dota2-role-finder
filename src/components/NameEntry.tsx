import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sword } from 'lucide-react';

interface NameEntryProps {
  onSubmit: (name: string) => void;
}

export function NameEntry({ onSubmit }: NameEntryProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Введи своё имя');
      return;
    }
    if (name.trim().length < 2) {
      setError('Имя должно быть не короче 2 символов');
      return;
    }
    onSubmit(name.trim());
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-[rgba(15,15,20,0.9)] border-[rgba(255,255,255,0.08)] backdrop-blur-xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-[#3a7bd5] to-[#00d2ff] flex items-center justify-center mb-4 shadow-lg shadow-[rgba(58,123,213,0.4)]">
            <Sword className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            Dota 2 Role Finder
          </CardTitle>
          <CardDescription className="text-[#9b9ba1]">
            Узнай свою идеальную позицию и героев
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Введи своё имя"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError('');
                }}
                className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white placeholder:text-[#9b9ba1] focus:border-[#3a7bd5] focus:ring-[#3a7bd5]"
                autoFocus
              />
              {error && (
                <p className="text-red-400 text-sm mt-2">{error}</p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[#3a7bd5] to-[#00d2ff] hover:from-[#2a6bc5] hover:to-[#00c2ef] text-white font-semibold py-6"
            >
              Начать
            </Button>
          </form>
          <p className="text-center text-xs text-[#9b9ba1] mt-4">
            Имя используется только для сохранения твоих результатов
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

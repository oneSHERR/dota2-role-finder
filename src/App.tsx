import { useUser } from '@/hooks/useUser';
import { NameEntry } from '@/components/NameEntry';
import { MainApp } from '@/components/MainApp';
import type { QuizResult } from '@/types';
import './App.css';

function App() {
  const {
    user,
    results,
    isLoaded,
    createUser,
    logout,
    addResult,
  } = useUser();

  const handleAddResult = (result: QuizResult) => {
    addResult(result);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050509]">
        <div className="w-8 h-8 border-2 border-[#3a7bd5] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <NameEntry onSubmit={createUser} />;
  }

  return (
    <MainApp
      user={user}
      results={results}
      onLogout={logout}
      onAddResult={handleAddResult}
    />
  );
}

export default App;

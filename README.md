# Dota 2 Role Finder

Приложение для определения идеальной позиции и героев в Dota 2 на основе ответов на вопросы.

## Функции

- **Квиз по позициям** — определяет, какая позиция (1-5) тебе подходит больше всего
- **Квиз по героям** — подбирает идеальных героев для выбранной позиции
- **Профиль** — сохраняет все результаты
- **Локальное хранение** — данные сохраняются в браузере

## Быстрый старт

### 1. Локальная разработка

```bash
npm install
npm run dev
```

### 2. Сборка для production

```bash
npm run build
```

### 3. Деплой на GitHub Pages

1. Создай репозиторий на GitHub.
2. Загрузи файлы проекта
3. Включи GitHub Pages в настройках репозитория (Settings → Pages)
4. Выбери ветку `main` и папку `/root` или `/docs`

**Важно:** Для GitHub Pages нужно настроить базовый путь в `vite.config.ts`:

```typescript
export default defineConfig({
  base: '/имя-твоего-репозитория/',
  // ... остальная конфигурация
})
```

## Подключение Firebase (для игры с друзьями)

Чтобы добавить возможность видеть результаты друзей, нужно подключить Firebase:

### 1. Создай проект в Firebase

1. Перейди на [firebase.google.com](https://firebase.google.com)
2. Нажми "Get started" и создай новый проект
3. Выбери "Web app" (</>)
4. Скопируй конфигурацию

### 2. Установи Firebase SDK

```bash
npm install firebase
```

### 3. Создай файл конфигурации

Создай файл `src/firebase.ts`:

```typescript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "твой-api-key",
  authDomain: "твой-проект.firebaseapp.com",
  projectId: "твой-проект",
  storageBucket: "твой-проект.appspot.com",
  messagingSenderId: "123456789",
  appId: "твой-app-id"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
```

### 4. Замени localStorage на Firestore

В файле `src/hooks/useUser.ts` замени localStorage на Firestore:

```typescript
import { db } from '@/firebase';
import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

// ... реализация с Firestore
```

### 5. Настрой правила безопасности

В Firebase Console перейди в Firestore Database → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if true;
      allow write: if true;
    }
    match /results/{resultId} {
      allow read: if true;
      allow write: if true;
    }
  }
}
```

**Примечание:** Эти правила открыты для чтения/записи. Для production используй аутентификацию.

## Структура проекта

```
src/
├── components/        # React компоненты
│   ├── NameEntry.tsx     # Вход по имени
│   ├── PositionQuiz.tsx  # Квиз по позициям
│   ├── HeroQuiz.tsx      # Квиз по героям
│   └── MainApp.tsx       # Главное приложение
├── data/             # Данные
│   ├── heroImages.ts     # URL иконок героев
│   ├── positionQuiz.ts   # Вопросы позиционного квиза
│   ├── heroCarryData.ts  # Данные для керри
│   ├── heroMidData.ts    # Данные для мидера
│   ├── heroOfflaneData.ts # Данные для оффлейнера
│   └── heroSupportData.ts # Данные для саппортов
├── hooks/            # Custom hooks
│   └── useUser.ts        # Работа с пользователем
├── types/            # TypeScript типы
│   └── index.ts
├── App.tsx           # Корневой компонент
├── App.css           # Стили
└── main.tsx          # Точка входа
```

## Технологии

- React 19
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- Lucide Icons

## Лицензия

MIT

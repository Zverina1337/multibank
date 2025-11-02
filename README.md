# 🏦 Multibank - Мультибанкинг платформа

Решение задачи мультибанкинга для хакатона ВТБ API Hack.

## 🚀 Быстрый старт

### 1. Установка зависимостей
```bash
npm install
```

### 2. Настройка окружения
```bash
# Скопируй .env.example в .env
cp .env.example .env

# Заполни переменные окружения
nano .env
```

### 3. Настройка базы данных
```bash
# Генерация Prisma клиента
npm run db:generate

# Применение миграций
npm run db:push
```

### 4. Запуск в dev режиме
```bash
npm run dev
```

Приложение доступно на [http://localhost:3000](http://localhost:3000)

---

## 📁 Структура проекта

```
multibank/
├── src/
│   ├── app/              # Next.js App Router
│   ├── components/       # React компоненты
│   ├── services/         # Бизнес-логика (микросервисная архитектура)
│   │   ├── banking/      # Сервис работы с банками
│   │   ├── ai/           # YandexGPT интеграция
│   │   └── billing/      # Подписки и токены
│   ├── lib/              # Утилиты, DB, Redis
│   └── types/            # TypeScript типы
├── prisma/               # Database schema
└── .github/workflows/    # CI/CD pipelines
```

---

## 🔧 Доступные команды

### Разработка
```bash
npm run dev          # Запуск dev сервера
npm run build        # Production build
npm run start        # Запуск production
```

### Проверка кода
```bash
npm run lint         # ESLint проверка
npm run lint:fix     # Автоматическое исправление
npm run type-check   # TypeScript проверка
npm run format       # Форматирование Prettier
```

### Тесты
```bash
npm run test         # Запуск тестов
npm run test:watch   # Тесты в watch режиме
npm run test:coverage # Тесты с coverage
```

### База данных
```bash
npm run db:generate  # Генерация Prisma клиента
npm run db:push      # Синхронизация schema с БД
npm run db:studio    # Открыть Prisma Studio
npm run db:migrate   # Создать миграцию
```

---

## 🌿 Git Workflow

### Создание feature ветки
```bash
git checkout dev
git pull origin dev
git checkout -b feat/new-feature
```

### Коммиты (Conventional Commits)
```bash
git commit -m "feat: add YandexGPT integration"
git commit -m "fix: resolve token counter bug"
git commit -m "docs: update API documentation"
```

### Создание Pull Request
```bash
git push origin feat/new-feature
# Создай PR через GitHub UI: feat/new-feature → dev
```

---

## 🔒 Защита веток

- ✅ **dev** - требует 1 approval + прохождение CI
- ✅ **prod** - требует 2 approvals + прохождение всех проверок

**Прямые коммиты заблокированы!** Только через Pull Requests.

---

## 📦 CI/CD Pipeline

### Автоматические проверки на каждый PR:
- Lint & Type Check
- Tests
- Build
- Security Scan
- Preview Deployment (Vercel)

### Автоматический деплой:
- **dev → prod** создаёт Production deployment
- **feature → dev** создаёт Preview deployment

---

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL + Prisma
- **Cache**: Upstash Redis
- **AI**: Yandex GPT
- **Auth**: NextAuth.js
- **Deploy**: Vercel
- **CI/CD**: GitHub Actions

---

## 📚 Документация

- [GitHub Setup Guide](./GITHUB_SETUP.md) - Пошаговая настройка CI/CD
- [Architecture](./docs/architecture.md) - Архитектура приложения
- [API Documentation](./docs/api.md) - API эндпоинты

---

## 👥 Команда

- [Zverinacode] - Tech Lead
- [Nick] - Frontend Developer
- [Коллега 2] - Backend Developer
- [Taly] - UI/UX Designer


---

## 📄 Лицензия

MIT

---

## 🤝 Contributing

1. Создай feature ветку от `dev`
2. Сделай изменения
3. Запусти проверки: `npm run lint && npm run type-check && npm run test`
4. Создай Pull Request
5. Дождись прохождения CI и получи approval
6. Мержи через GitHub UI

**Важно:** Все коммиты должны следовать [Conventional Commits](https://www.conventionalcommits.org/)

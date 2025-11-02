# 🎯 CI/CD Setup - Готово к использованию!

## 📦 Что создано:

### 1. GitHub Actions Workflows (`.github/workflows/`)
- **ci.yml** - Автоматические проверки кода (lint, type-check, tests, build, security)
- **deploy.yml** - Автодеплой на Vercel (dev → preview, prod → production)
- **pr-checks.yml** - Дополнительные проверки PR (размер бандла, preview deployment, напоминания)

### 2. Конфигурационные файлы
- **.eslintrc.json** - Правила линтинга
- **.prettierrc** - Форматирование кода
- **tsconfig.json** - TypeScript конфигурация с путями
- **.gitignore** - Игнорируемые файлы
- **.env.example** - Шаблон переменных окружения
- **package.json** - Зависимости и скрипты
- **CODEOWNERS** - Автоназначение ревьюеров (опционально)

### 3. Документация
- **README.md** - Главная документация проекта
- **GITHUB_SETUP.md** - Пошаговая инструкция настройки GitHub и Vercel
- **SETUP_CHECKLIST.md** - Чеклист для быстрой настройки

---

## 🚀 Быстрый старт (5 минут)

### 1. Скопируй файлы в свой проект
```bash
# Создай Next.js проект (если ещё не создан)
npx create-next-app@latest multibank --typescript --tailwind --app --src-dir
cd multibank

# Скопируй все файлы из скачанного архива в корень проекта
# Убедись что .github/ папка скопирована правильно
```

### 2. Установи зависимости
```bash
npm install
```

### 3. Создай репозиторий на GitHub
```bash
git init
git add .
git commit -m "feat: initial setup with CI/CD"

# Создай репозиторий на GitHub, затем:
git remote add origin https://github.com/YOUR_USERNAME/multibank.git
git branch -M main
git push -u origin main

# Создай dev и prod ветки
git checkout -b dev
git push -u origin dev
git checkout -b prod
git push -u origin prod
git checkout dev
```

### 4. Настрой защиту веток и секреты
📖 Открой **GITHUB_SETUP.md** и следуй инструкциям из раздела:
- "Часть 2: Настройка Branch Protection Rules"
- "Часть 3: Настройка Secrets для Vercel"

---

## 📚 Документы по приоритету

### Сначала прочитай:
1. **SETUP_CHECKLIST.md** ⭐ - Пошаговый чеклист (начни здесь!)
2. **GITHUB_SETUP.md** - Детальная инструкция по настройке

### Потом изучи:
3. **README.md** - Ежедневная работа с проектом
4. Остальные конфигурационные файлы (по необходимости)

---

## ✅ Что получится после настройки:

### Защита веток:
- ❌ Невозможно прямо пушить в `dev` или `prod`
- ✅ Только через Pull Requests
- ✅ `dev` требует 1 approval + CI
- ✅ `prod` требует 2 approvals + все проверки

### Автоматические проверки:
- ✅ ESLint на каждый PR
- ✅ TypeScript проверка
- ✅ Тесты (когда добавишь)
- ✅ Build проверка
- ✅ Security audit

### Деплой:
- ✅ Автодеплой на Vercel при мерже
- ✅ Preview для каждого PR
- ✅ `dev` → preview environment
- ✅ `prod` → production environment

---

## 🔧 Доступные команды

```bash
# Разработка
npm run dev              # Запуск dev сервера
npm run build            # Production build

# Проверки (запускаются автоматически в CI)
npm run lint             # ESLint
npm run type-check       # TypeScript
npm run test             # Jest тесты
npm run format           # Prettier форматирование

# База данных (когда настроишь Prisma)
npm run db:generate      # Генерация Prisma клиента
npm run db:push          # Синхронизация схемы
npm run db:studio        # Открыть Prisma Studio
```

---

## 🎯 Workflow разработки

```bash
# 1. Создай feature ветку от dev
git checkout dev
git pull origin dev
git checkout -b feat/new-feature

# 2. Делай коммиты
git add .
git commit -m "feat: add new feature"

# 3. Пуш и создай PR
git push origin feat/new-feature
# Создай PR через GitHub: feat/new-feature → dev

# 4. После approve и прохождения CI - мержи!
```

---

## ⚠️ Важные моменты

### Conventional Commits:
Все коммиты должны следовать формату:
```
feat: новая фича
fix: исправление бага
docs: документация
refactor: рефакторинг
test: тесты
chore: обновление зависимостей
```

### Branch Protection:
Настрой защиту веток СРАЗУ после создания репозитория, иначе кто-то случайно может напрямую пушить!

### Vercel Secrets:
Без них деплой не будет работать. Не забудь добавить:
- VERCEL_TOKEN
- VERCEL_ORG_ID
- VERCEL_PROJECT_ID

---

## 🐛 Troubleshooting

### Проблема: CI не запускается
**Решение:** Проверь что `.github/workflows/` скопирована в корень проекта

### Проблема: Deplot не работает
**Решение:** 
1. Проверь GitHub Secrets (Settings → Secrets and variables → Actions)
2. Убедись что проект создан на Vercel
3. Проверь логи в Actions

### Проблема: Не могу замержить PR
**Решение:**
1. Дождись прохождения всех CI checks ✅
2. Получи нужное количество approvals
3. Resolve все conversations
4. Update branch если нужно

---

## 📞 Помощь

Если что-то непонятно:
1. Сначала прочитай **SETUP_CHECKLIST.md**
2. Потом **GITHUB_SETUP.md** (там всё детально)
3. Проверь секцию Troubleshooting в README.md

---

## 🎉 Готово!

После настройки у тебя будет:
- ✅ Профессиональная CI/CD pipeline
- ✅ Защищённый репозиторий
- ✅ Автодеплой на Vercel
- ✅ Код-ревью процесс
- ✅ Впечатляющая архитектура для жюри

**Следующий шаг:** Открой `SETUP_CHECKLIST.md` и начни настройку! 🚀

Удачи на хакатоне! 💪

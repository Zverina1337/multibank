# ✅ Checklist: Настройка проекта с CI/CD

## 📦 Шаг 1: Создай структуру проекта

```bash
# Создай Next.js проект
npx create-next-app@latest multibank --typescript --tailwind --app --src-dir

cd multibank
```

## 📄 Шаг 2: Скопируй конфигурационные файлы

Создай следующие файлы в корне проекта:

### 1. GitHub Actions workflows
```
.github/
└── workflows/
    ├── ci.yml           # ✅ Создан
    ├── deploy.yml       # ✅ Создан
    └── pr-checks.yml    # ✅ Создан
```

### 2. Конфигурации
- [ ] `.eslintrc.json` - ✅ Создан
- [ ] `.prettierrc` - ✅ Создан
- [ ] `tsconfig.json` - ✅ Создан
- [ ] `.gitignore` - ✅ Создан
- [ ] `.env.example` - ✅ Создан

### 3. Документация
- [ ] `README.md` - ✅ Создан
- [ ] `GITHUB_SETUP.md` - ✅ Создан
- [ ] `CODEOWNERS` - ✅ Создан (опционально)

### 4. Package.json
- [ ] `package.json` - ✅ Создан (замени существующий или добавь скрипты)

---

## 🔧 Шаг 3: Установи зависимости

```bash
# Основные зависимости
npm install @prisma/client @upstash/redis next-auth zod recharts lucide-react date-fns clsx

# Dev зависимости
npm install -D prisma typescript @types/node @types/react @types/react-dom \
  eslint eslint-config-next @typescript-eslint/eslint-plugin @typescript-eslint/parser \
  prettier prettier-plugin-tailwindcss jest @testing-library/react \
  @testing-library/jest-dom husky lint-staged autoprefixer postcss tailwindcss
```

---

## 🗄️ Шаг 4: Настрой Prisma

```bash
# Инициализируй Prisma
npx prisma init

# Создай schema (смотри в GITHUB_SETUP.md пример схемы)
# Отредактируй prisma/schema.prisma
```

---

## 🐙 Шаг 5: Создай GitHub репозиторий

```bash
# Инициализируй git
git init
git add .
git commit -m "feat: initial project setup"

# Создай репозиторий на GitHub
# Затем:
git remote add origin https://github.com/YOUR_USERNAME/multibank.git
git branch -M main
git push -u origin main

# Создай dev и prod ветки
git checkout -b dev
git push -u origin dev

git checkout -b prod
git push -u origin prod

# Вернись на dev
git checkout dev
```

---

## 🔒 Шаг 6: Настрой Branch Protection

Следуй инструкциям из `GITHUB_SETUP.md`, секция **"Часть 2: Настройка Branch Protection Rules"**

### Для ветки `dev`:
- [ ] Require PR before merging
- [ ] Require 1 approval
- [ ] Require status checks (Lint, Tests, Build)
- [ ] Require conversation resolution

### Для ветки `prod`:
- [ ] Require PR before merging
- [ ] Require 2 approvals
- [ ] Require status checks (все + Security Scan)
- [ ] Require conversation resolution
- [ ] Do not allow bypassing

---

## 🔑 Шаг 7: Добавь GitHub Secrets

В репозитории: **Settings** → **Secrets and variables** → **Actions**

Создай 3 секрета:
- [ ] `VERCEL_TOKEN` (получи на vercel.com/account/tokens)
- [ ] `VERCEL_ORG_ID` (из `.vercel/project.json` или Vercel dashboard)
- [ ] `VERCEL_PROJECT_ID` (из `.vercel/project.json`)

**Как получить:**
```bash
# Установи Vercel CLI
npm i -g vercel

# Залогинься и подключи проект
vercel login
vercel link

# Найди ID в .vercel/project.json
cat .vercel/project.json
```

---

## 🚀 Шаг 8: Настрой Vercel проект

1. Зайди на [vercel.com](https://vercel.com)
2. Создай новый проект из GitHub репозитория
3. Выбери `multibank` репозиторий
4. **Framework Preset**: Next.js
5. **Build Command**: `npm run build`
6. **Output Directory**: `.next`
7. Добавь Environment Variables из `.env.example`

### Настройки деплоя:
- **Production Branch**: `prod`
- **Preview Branch**: `dev` + все feature ветки

---

## 🧪 Шаг 9: Проверь CI/CD

### 1. Создай тестовый PR
```bash
git checkout dev
git checkout -b feat/test-ci

# Создай тестовый файл
echo "export const test = 'CI works!';" > src/test.ts

git add .
git commit -m "feat: test CI pipeline"
git push origin feat/test-ci
```

### 2. Создай PR через GitHub
- Иди на GitHub → Pull Requests → New Pull Request
- Base: `dev`, Compare: `feat/test-ci`
- Создай PR

### 3. Проверь что запустились:
- [ ] CI workflow (Lint, Tests, Build, Security Scan)
- [ ] PR Checks workflow
- [ ] Preview Deployment на Vercel

### 4. После approve:
- [ ] Мержи PR
- [ ] Проверь что dev задеплоился на Vercel

---

## ✅ Шаг 10: Финальная проверка

### Проверь что работает:
- [ ] ❌ Прямой push в `dev` заблокирован
- [ ] ❌ Прямой push в `prod` заблокирован
- [ ] ✅ PR в `dev` требует 1 approval
- [ ] ✅ PR в `prod` требует 2 approvals
- [ ] ✅ CI проверки запускаются автоматически
- [ ] ✅ Preview deployment создаётся для каждого PR
- [ ] ✅ Мерж в `dev` деплоится на preview Vercel
- [ ] ✅ Мерж в `prod` деплоится на production Vercel

---

## 🎯 Workflow для разработки

### Ежедневная работа:
```bash
# 1. Обнови dev
git checkout dev
git pull origin dev

# 2. Создай feature ветку
git checkout -b feat/banking-integration

# 3. Делай работу + коммиты
git add .
git commit -m "feat: add VTB bank adapter"

# 4. Пуш и создай PR
git push origin feat/banking-integration
# Создай PR: feat/banking-integration → dev
```

### Релиз на prod:
```bash
# Убедись что dev стабилен
git checkout dev
git pull origin dev

# Создай PR через GitHub UI: dev → prod
# После 2 approvals + прохождения CI → мержи
```

---

## 🐛 Troubleshooting

### CI не проходит?
```bash
# Запусти проверки локально:
npm run lint
npm run type-check
npm run test
npm run build
```

### Не работает Vercel деплой?
1. Проверь GitHub Secrets (VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID)
2. Убедись что проект создан на Vercel
3. Проверь логи в Actions → Deploy workflow

### Не можешь замержить PR?
1. Все CI checks должны быть ✅
2. Получи нужное количество approvals (1 для dev, 2 для prod)
3. Resolve все комментарии
4. Update branch если нужно

---

## 📊 Monitoring

### GitHub Actions:
https://github.com/YOUR_USERNAME/multibank/actions

### Vercel Deployments:
https://vercel.com/YOUR_USERNAME/multibank/deployments

---

## 🎉 Готово!

Теперь у тебя:
- ✅ Профессиональная CI/CD pipeline
- ✅ Защищённые dev и prod ветки
- ✅ Автоматический деплой на Vercel
- ✅ Проверки кода на каждый PR
- ✅ Preview deployments

**Следующие шаги:**
1. Начни разработку в feature ветках
2. Создавай PR в `dev`
3. После тестирования на dev → создай PR в `prod`
4. Профит! 🚀

Удачи на хакатоне! 💪

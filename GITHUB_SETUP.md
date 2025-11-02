# 🚀 Инструкция по настройке CI/CD и защите веток

## 📋 Часть 1: Создание репозитория и веток

### 1. Создание репозитория
```bash
# Инициализируй проект локально
git init
git add .
git commit -m "feat: initial project setup"

# Создай репозиторий на GitHub и подключи его
git remote add origin https://github.com/your-username/multibank.git
git branch -M main
git push -u origin main
```

### 2. Создание веток dev и prod
```bash
# Создай ветку dev из main
git checkout -b dev
git push -u origin dev

# Создай ветку prod из dev
git checkout -b prod
git push -u origin prod

# Вернись на dev для работы
git checkout dev
```

---

## 🔒 Часть 2: Настройка Branch Protection Rules

### Для ветки `dev`:

1. Иди в **Settings** → **Branches** → **Add branch protection rule**

2. В поле **Branch name pattern** укажи: `dev`

3. Включи следующие опции:
   - ✅ **Require a pull request before merging**
     - ✅ Require approvals: **1**
     - ✅ Dismiss stale pull request approvals when new commits are pushed
   
   - ✅ **Require status checks to pass before merging**
     - ✅ Require branches to be up to date before merging
     - Добавь required checks:
       - `Lint & Type Check`
       - `Run Tests`
       - `Build Check`
   
   - ✅ **Require conversation resolution before merging**
   
   - ✅ **Do not allow bypassing the above settings**

4. Нажми **Create**

---

### Для ветки `prod`:

1. Создай новое правило: **Settings** → **Branches** → **Add branch protection rule**

2. В поле **Branch name pattern** укажи: `prod`

3. Включи следующие опции:
   - ✅ **Require a pull request before merging**
     - ✅ Require approvals: **2** ⚠️ (больше для prod!)
     - ✅ Dismiss stale pull request approvals when new commits are pushed
     - ✅ Require review from Code Owners
   
   - ✅ **Require status checks to pass before merging**
     - ✅ Require branches to be up to date before merging
     - Добавь required checks:
       - `Lint & Type Check`
       - `Run Tests`
       - `Build Check`
       - `Security Scan`
   
   - ✅ **Require conversation resolution before merging**
   
   - ✅ **Require deployments to succeed before merging** (опционально)
   
   - ✅ **Do not allow bypassing the above settings**
   
   - ✅ **Restrict who can push to matching branches** (опционально - только tech lead)

4. Нажми **Create**

---

## 🔑 Часть 3: Настройка Secrets для Vercel

### 1. Получи Vercel токены

Иди на [Vercel Dashboard](https://vercel.com):

```bash
# Установи Vercel CLI
npm i -g vercel

# Залогинься
vercel login

# Подключи проект
vercel link

# Это создаст .vercel/project.json с нужными ID
```

### 2. Добавь Secrets в GitHub

Иди в **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Добавь 3 секрета:

**1. VERCEL_TOKEN**
- Получи на: https://vercel.com/account/tokens
- Нажми "Create Token"
- Скопируй и добавь в GitHub

**2. VERCEL_ORG_ID**
- Найди в `.vercel/project.json` → поле `"orgId"`
- Или на: https://vercel.com/[username]/~/settings
- Скопируй Team ID

**3. VERCEL_PROJECT_ID**
- Найди в `.vercel/project.json` → поле `"projectId"`
- Или в URL проекта на Vercel

---

## 🎯 Часть 4: Workflow для работы

### Ежедневная разработка:

```bash
# 1. Создай feature ветку от dev
git checkout dev
git pull origin dev
git checkout -b feat/new-feature

# 2. Делай коммиты по мере работы
git add .
git commit -m "feat: add new banking adapter"

# 3. Пуш и создание PR
git push origin feat/new-feature
# Создай PR: feat/new-feature → dev
```

### Релиз на prod:

```bash
# 1. Убедись что dev стабилен
git checkout dev
git pull origin dev

# 2. Создай PR: dev → prod
# Через GitHub UI создай Pull Request

# 3. После approve и merge в prod - автоматический деплой на production
```

---

## ✅ Часть 5: Правила именования

### Коммиты (Conventional Commits):
```
feat: новая фича
fix: исправление бага
docs: документация
style: форматирование
refactor: рефакторинг
perf: оптимизация
test: тесты
chore: рутина (deps update и т.д.)
```

### Ветки:
```
feat/bank-integration
fix/login-bug
refactor/service-layer
docs/api-documentation
```

### Pull Requests:
```
feat: Add Yandex GPT integration
fix: Resolve token counter issue
```

---

## 🚨 Часть 6: Что НЕЛЬЗЯ делать

❌ **Прямые коммиты в dev или prod**
```bash
# ЭТО ЗАБЛОКИРОВАНО:
git checkout dev
git commit -m "quick fix"
git push origin dev  # ❌ Будет отклонено
```

❌ **Мержить PR без прохождения CI**
- Все проверки должны быть зелёными ✅

❌ **Мержить свой собственный PR в prod**
- Нужно минимум 2 аппрува от других разработчиков

✅ **ПРАВИЛЬНО:**
- Всегда создавай feature ветку
- Создавай PR
- Жди прохождения CI
- Получай approve
- Мержи через GitHub UI

---

## 📊 Часть 7: Мониторинг деплоев

### Vercel Dashboard:
- **Dev деплои**: https://vercel.com/[project]/deployments?environment=preview
- **Prod деплои**: https://vercel.com/[project]/deployments?environment=production

### GitHub Actions:
- Проверяй статус: https://github.com/[username]/[repo]/actions

---

## 🔧 Troubleshooting

### CI проверки не проходят?
```bash
# Запусти локально:
npm run lint
npm run type-check
npm run test
npm run build
```

### Vercel деплой не работает?
1. Проверь секреты в Settings → Secrets
2. Убедись что `.vercel/project.json` не в `.gitignore`
3. Проверь логи в Actions

### Не можешь замержить PR?
1. Проверь что все CI checks прошли ✅
2. Получи нужное количество approvals
3. Resolve все conversations
4. Убедись что ветка актуальна (Update branch)

---

## 🎉 Готово!

Теперь у тебя:
- ✅ Защищённые ветки dev и prod
- ✅ Автоматический CI на каждый PR
- ✅ Автодеплой на Vercel
- ✅ Preview deployments для каждого PR
- ✅ Невозможность сломать prod без ревью

Удачи на хакатоне! 🚀

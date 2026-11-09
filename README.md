# Наш маленький всесвіт — історія для Насті

Next.js 15 · TypeScript · Tailwind · Framer Motion · Lenis

## Запуск
```bash
npm install
npm run dev        # http://localhost:3000 (на iPhone — через IP комп'ютера в тій же Wi‑Fi мережі)
npm run build && npm start
```

## Фото
Оригінали лежать у `public/photos/` (без змін; з назв прибрано лише суфікси `(1)`, `(2)`).
Мапа «фото → розділ» — `lib/photos.ts` (поле `ch`, `orig` — початкова назва файлу) і `lib/photo-manifest.json`.
Нове фото: додай файл і рядок у `lib/photos.ts`, потім постав `<Ph k="ключ" />` у `components/Story.tsx`.
Натискання на будь-яке фото відкриває оригінал повністю.

## Музика (необов'язково)
Автозапуску немає. Поклади власний ліцензований файл `public/music/theme.mp3` — з'явиться кнопка ♫.
Без файлу кнопка просто не показується.

## Деплой на Vercel
1. Завантаж папку в GitHub-репозиторій (`git init && git add . && git commit -m "init"`, потім push).
2. На vercel.com: **Add New → Project → Import** цього репозиторію. Налаштування за замовчуванням (Framework: Next.js).
3. **Deploy**. Відправ Насті отриману посилання. Відповідь ніде не зберігається і не надсилається.

Альтернатива: `npx vercel --prod` у корені проєкту.

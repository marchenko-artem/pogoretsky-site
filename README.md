# Pogoretsky — Static Site (v0.1)

Стартовый каркас на **HTML + CSS + JS** с i18n, параллакс-hero, афишей (JSON), куки-баннером, юр.страницами и готовностью к апгрейду.

## Быстрый старт
- Открой `index.html` локально или раздавай папку через любой статический сервер.
- Измени переводы в `i18n/*.json`.
- Добавь концерты в `data/concerts.json` (ISO‑даты).

## Структура
```
pogoretsky-site_v0.1/
  assets/img/hero-*.svg
  assets/icons/favicon.svg
  styles/main.css
  scripts/('main.js', 'parallax.js', 'i18n.js', 'consent.js')
  i18n/('de.json', 'en.json', 'pl.json', 'ru.json', 'uk.json')
  data/concerts.json
  legal/('impressum.html', 'privacy.html', 'cookies.html', 'agb.html')
  index.html concerts.html about.html media.html press.html contact.html
  robots.txt sitemap.xml
  README.md CHANGELOG.md CONTEXT.md
```

## Апгрейды (позже)
- Подключить Git‑CMS (Decap) для редактирования концертов/био/медиа через браузер.
- Интеграции билетов (Eventim/Reservix/Pretix) — через конфиг/API.
- Динамические OG‑картинки и метаданные.

---

© 2025 Pogoretsky

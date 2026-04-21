# CENTER MIRA Landing

Landing-хаб для перехода в сервисы экосистемы (`booking`, `studio`, `academy`, `devices`, `shop`, `ai`, `charity`) + legal-страницы (`/impressum`, `/privacy`, `/sitemap`) с мультиязычностью.

## Local Run

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
```

## Git Setup

Если репозиторий еще не инициализирован:

```bash
git init
git add .
git commit -m "chore: init center-mira landing"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

`.env` исключен из Git, используйте `.env.example` как шаблон.

## Netlify Setup

В проект добавлен `netlify.toml`:

- build command: `npm run build`
- publish dir: `dist`
- SPA redirect: `/* -> /index.html (200)` для роутов `/impressum`, `/privacy`, `/sitemap`

### Deploy через Git (рекомендуется)

1. Push в GitHub/GitLab.
2. В Netlify: **Add new site** -> **Import an existing project**.
3. Выберите репозиторий `center-mira`.
4. Build settings подтянутся из `netlify.toml`.
5. В **Site configuration -> Environment variables** добавьте переменные из `.env.example`.
6. Нажмите **Deploy site**.

## Environment Variables

Скопируйте шаблон:

```bash
cp .env.example .env
```

И заполните значения:

- `VITE_LINK_STUDIO`
- `VITE_LINK_BOOKING`
- `VITE_LINK_ACADEMY`
- `VITE_LINK_DEVICES`
- `VITE_LINK_SHOP`
- `VITE_LINK_AI`
- `VITE_LINK_CHARITY`
- `VITE_LINK_INSTAGRAM`
- `VITE_LINK_FACEBOOK`
- `VITE_LINK_YOUTUBE`
- `VITE_LINK_TIKTOK`
- `VITE_LINK_WHATSAPP`
- `VITE_SITE_URL`
- `VITE_SEO_OG_IMAGE`
- `VITE_LEGAL_COMPANY`
- `VITE_LEGAL_ADDRESS`
- `VITE_LEGAL_EMAIL`
- `VITE_LEGAL_PHONE`
- `VITE_LEGAL_WEBSITE`
- `VITE_LEGAL_RESPONSIBLE_PERSON`

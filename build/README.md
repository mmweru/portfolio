# Maryann Wambui — Portfolio

Vite + Tailwind. Hanging ID-badge hero, role words, stats + tool marquee, drag-to-scroll
project carousel, about timeline, a working terminal, light/dark theme.

## Run locally

Requires Node 18+.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build into /dist
npm run preview    # serve the production build
```

## Edit these before you deploy

1. **Contact links** — open `src/main.js` and edit the `CONFIG` block at the top
   (email, LinkedIn, GitHub, resume path). Every button and the terminal's `contact`
   command update from there.
2. **Your photos** — three images in `public/photos/`: `badge.jpg` (4:5, hanging card),
   `intro.jpg` (4:5, intro section) and `about.jpg` (square, about section). To use a
   different outfit or photo, replace any of them (keep the filenames, keep the same
   aspect ratio, under ~300KB). Framing is tuned with `object-position` in `src/style.css`
   (`.photo-badge img`, `.photo-intro img`, `.photo-about img`).
3. **Resume** — replace `public/resume.pdf` (placeholder).
4. **Projects** — edit the three `<article class="work-card">` blocks in `index.html`.
   Add a real screenshot by replacing the gradient `work-visual` div with an `<img>`.
5. **Terminal data** — the `DB` object inside `terminal()` in `src/main.js`.
6. **Stats** — the `data-count` numbers in the stats section of `index.html`.
7. **Role words** — the four `.role-word` links in the hero, and the `words` array in
   `typedRole()` in `src/main.js`.

## Deploy to Vercel

**Option A — Git + dashboard (recommended)**

```bash
git init && git add . && git commit -m "Portfolio"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

1. Go to https://vercel.com/new and import the repository.
2. Vercel detects Vite. Confirm Build Command `npm run build` and Output Directory `dist`.
3. Click **Deploy**. Every future `git push` redeploys automatically.
4. Custom domain: Project → Settings → Domains.

**Option B — CLI**

```bash
npm i -g vercel
vercel          # first deploy
vercel --prod   # production
```

## What's inside

- **Hero badge** — drag it sideways; it swings and settles with spring physics.
- **Terminal** — `help`, `ls`, `whoami`, `contact`, `goto`, `theme`, `clear`, plus SQL:
  `select … from … where col = 'x' | like '%x%' order by col desc limit n`, `count(*)`.
  ↑/↓ history, Tab completion, Ctrl+L to clear.
- **Motion** — hero load-in, scroll reveal, count-up stats, marquee, card tilt, photo
  parallax, cursor spotlight, scroll progress bar. All respect `prefers-reduced-motion`.
- **Theme** — light/dark toggle, remembered between visits.

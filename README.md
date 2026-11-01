# TarVance SaaS website starter

A responsive four-route marketing website starter for TarVance, using the supplied logo and a premium royal-navy / blue / cream palette.

## Stack

- Vite + React + TypeScript (TSX)
- Tailwind CSS v4 with the first-party Vite plugin
- `tailwindcss-motion` utility plugin
- Framer Motion for scroll-linked effects and reveal animations
- React Router and Lucide icons

## Run locally

Requires Node.js 20.19+ or 22.12+ for current Vite releases.

```bash
npm install
npm run dev
```

The manifest already includes `framer-motion` and `tailwindcss-motion`. If adding them manually to another Vite app, use `npm i framer-motion` and `npm i -D tailwindcss-motion`.

Open the local URL printed by Vite. Production build and type-check:

```bash
npm run typecheck
npm run build
npm run preview
```

## Pages and route map

- `/` — Home: hero, how we work, what we do, sample projects, tools, team, reviews, contact call-to-action
- `/about` — About us, team, focus, principles, process
- `/contact` — Contact details and enquiry form (this is the only enquiry form)
- `/order` — Redirects to `/contact` so old links keep working

## Architecture

```text
src/
  components/
    layout/       Navbar, SiteLayout, Footer, PageTransition
    ui/           Reveal, SectionHeader, TeamGrid, button.ts (button styles), patterns.ts (shared class strings)
    visuals/      DigitalEarth, AsciiArt, ZoomHero
    sections/
      home/       One component per home-page section
  config/site.ts  Phone, email, address, social links and form endpoints
  data/           siteData.ts (services, principles, sample projects), team.ts (team photos)
  lib/            scroll.ts (smooth-scroll engine), backend.ts (forms and reviews)
  pages/          HomePage, AboutPage, ContactPage, NotFoundPage
  App.tsx         Route definitions
  index.css       Theme tokens, keyframes and 4 shared utilities (about 130 lines)
public/team/      Optimised team photos shown on Home and About
```

## Editing content

- **Contact details and address:** `src/config/site.ts`
- **Services, principles, sample projects:** `src/data/siteData.ts`
- **Team photos, names and roles:** `src/data/team.ts`. Add `name` and `role` to an entry and they appear under that photo. Photos are in `public/team/`.
- **Reviews:** loaded from the Google Apps Script endpoint in `config/site.ts`.

## Before launch

1. The four sample projects are demo sites, and the page says so. Add real client work in `src/data/siteData.ts` when you have it.
2. Review the process steps in `HowWeWorkSection.tsx` and the "What to expect" list in `AboutPage.tsx`. They describe how TarVance works, so make sure they match your actual practice.
3. Add names and roles for the team in `src/data/team.ts`.
4. For a production deployment on a static host, configure SPA route fallback to `index.html` for `/about` and `/contact`.

## Brand tokens

Main palette: midnight navy `#07163F`, deep navy `#0B2159`, royal blue `#2B56D7`, sky blue `#8BB6FF`, cream `#F4EFE2`, and warm paper `#FBF9F2`.

The logo source is preserved at `public/tarvance-logo.jpeg`; `public/favicon.svg` is a lightweight favicon mark.


## How We Work: smooth stacked cards

The About page's “How we work” section now uses a sticky stacked-card sequence animated with GSAP ScrollTrigger. Lenis supplies smooth scrolling, while Tailwind utility classes own the layout, spacing, colors, borders, and responsive behavior.

Install dependencies after extracting:

```bash
npm install
npm run dev
```

The `lenis` package was added to `package.json`. The section respects `prefers-reduced-motion` by disabling Lenis smoothing for users who request reduced motion. Card visuals are styled with Tailwind classes; no separate large stylesheet was added.


## Latest UI updates

- Lenis smooth scrolling is initialized once at the layout level and synchronized with GSAP ScrollTrigger.
- How We Work cards have a scroll-linked blue progress line and active-step counter. The final card keeps a solid navy background and full opacity.
- Home, About, and Contact hero areas use full-viewport height; the navbar is a fixed transparent glass overlay.
- The Digital Earth can be rotated by dragging it horizontally.
- The Concept Websites section has been removed from the home page.
- About includes editable team-member cards; replace the generic names and role descriptions with actual team information before launch.

## Page transitions, scroll engine & reviews marquee

- **Page transition** (`src/components/layout/PageTransition.tsx`, `TransitionLogo.tsx`): 20 columns sweep in, the TarVance mark draws itself, the route changes while the screen is covered, then the columns sweep away. Every internal `<Link>`/`<NavLink>` gets it automatically (one capture-phase click listener), so no page needs editing. Ctrl/Cmd/Shift-click, `target="_blank"`, `#anchors`, external links and same-page links are left alone. It is disabled for `prefers-reduced-motion`. Timings live in the constants at the top of `PageTransition.tsx` (`COVER`, `REVEAL`, `LOGO_DRAW`).
- **Scroll engine** (`src/lib/scroll.ts`): Lenis now runs inside framer-motion's frame loop and notifies every scroll-linked animation in the same frame. This removes the one-frame lag between the page and its parallax/pinned elements, which was the micro-vibration seen with the mouse wheel (keyboard scrolling is native, so it never showed it). Use `useScrollProgress(ref, [startOffset, endOffset])` instead of framer's `useScroll` for new scroll-linked effects.
- **Reviews** (`FeedbackSection.tsx`): an infinite marquee. Fewer than 6 reviews → one row; 6 or more → two rows moving in opposite directions. Pauses on hover/focus; swipeable strip for reduced-motion users. Tune `SECONDS_PER_CARD` for speed.

## Styling

Almost everything is styled with Tailwind utility classes directly in the components. `src/index.css` only holds what utilities can't express:

- **Theme** (`@theme`): brand colours, fonts, and the `animate-bob` / `animate-marquee-left` / `animate-marquee-right` animations.
- **Four shared utilities**: `site-container`, `section-pad`, `eyebrow` and `display-heading`.
- **Lenis** hooks and a reduced-motion safety net.

Buttons come from `components/ui/button.ts` (`button("primary", "lg")`). Other repeated class strings (form fields, hover-lift cards, the grid background) are in `components/ui/patterns.ts`. DaisyUI was removed because only its `btn` class was in use.


## Deploy to GitHub Pages

This project includes a GitHub Actions workflow at `.github/workflows/deploy.yml`. It builds the site using the repository name as Vite's base path, supports React Router routes such as `/about` and `/contact`, and publishes the `dist` folder.

1. Create a GitHub repository (for example, `TarVance`) and push this project to its `main` branch.
2. In the repository, open **Settings → Pages** and set **Build and deployment → Source** to **GitHub Actions**.
3. Open the **Actions** tab and check the **Deploy TarVance to GitHub Pages** workflow.
4. After it succeeds, the project site URL is `https://YOUR-USERNAME.github.io/TarVance/` (replace `TarVance` with your repository name if different).

Do not upload `node_modules`; run `npm ci` after extracting or cloning.

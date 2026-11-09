This is a portfolio web app built on top of Next.js.

## NOTE: This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

## About

This is the personal website of a software engineer. It presents who they are, what they have built, and what they write about. The site has three areas:

- **Portfolio**: introduction, projects, experience, skills and contact details.
- **Technical blog**: posts about software engineering, at `/blogs/tech`.
- **Travel blog**: posts about travel, kept separate from the technical blog, at `/blogs/travel`.

The two blogs are separate sections, each with its own listing and post pages. They are not one blog filtered by tag, so don't merge their routes, data or styling by default.

Every page must work on both mobile and desktop. Responsive layout is a requirement, not a polish step; see Breakpoints and responsive rules.

Blog posts are written in **MDX only**, stored in the repo. Don't introduce a CMS or other content formats.

## Commands

| Command             | What it does                                                  |
| ------------------- | ------------------------------------------------------------- |
| `npm run dev`       | Start the dev server                                          |
| `npm run build`     | Production build (also typechecks)                            |
| `npm run start`     | Serve the production build                                    |
| `npm run typecheck` | `next typegen && tsc --noEmit`                                |
| `npm run lint`      | ESLint (Next core-web-vitals + TypeScript rules)              |
| `npm run lint:css`  | Stylelint on `src/**/*.{css,scss}`; `lint:css:fix` auto-fixes |
| `npm run format`    | Prettier, write changes; `format:check` only checks           |
| `npm run test`      | Vitest in watch mode                                          |
| `npm run test:run`  | Vitest once (unit and component tests)                        |
| `npm run test:e2e`  | Playwright end-to-end tests                                   |

- Run `typecheck`, `lint`, `lint:css` and `format:check` before considering work done. The pre-commit hook covers staged files plus `typecheck`, but only fixes and checks what is staged.
- `typecheck` runs `next typegen` first because helpers like `LayoutProps<"/">` are generated, not checked in. Don't replace it with a bare `tsc`.
- Also run `test:run` before considering work done, and `test:e2e` when routes or user-facing behavior changed. See Testing.

## Code Style

Formatting is automated; don't hand-format or argue with the tools. Run `npm run format` instead.

- **Prettier** (`.prettierrc.json`): semicolons, single quotes in TS/JS (`jsxSingleQuote: false`, so JSX attributes use double quotes), 2-space indent, 100 columns, `es5` trailing commas, `arrowParens: "always"`.
- **Import order** (via `@trivago/prettier-plugin-sort-imports`), with a blank line between groups: `react`, `next*`, third-party, `@portfolio/components/*`, `@portfolio/(hooks|lib|data|types|styles)/*`, then relative imports. Specifiers are sorted.
- **ESLint** (`eslint.config.mjs`): flat config extending Next's `core-web-vitals` and `typescript` presets, then `eslint-config-prettier` last to switch off rules that conflict with Prettier. Don't add formatting rules to ESLint.
- **Stylelint** (`stylelint.config.mjs`): standard SCSS config plus `recess-order` property ordering. Enforces camelCase class names, no `!important`, no ID selectors, and no hex colors in `*.module.*` files (use `var(--color-*)` tokens). `globals` and `src/styles/` may define raw values. Pinned to v17 because `stylelint-config-standard-scss` doesn't support v18 yet.
- **TypeScript**: `strict` is on.
  - Model data with explicit types: an `interface` for object shapes (props, data records), a `type` for unions and aliases. Shared types go in `src/types/`; types used by one module stay in that module.
  - Prefer precise types over loose ones: literal unions (`'tech' | 'travel'`) over `string`, and `as const` for fixed lists.
  - Type function parameters and exported return values explicitly. Let TypeScript infer local variables.
  - Never use `any`. Use `unknown` only at boundaries where the shape isn't known yet (parsed JSON, `catch` errors, third-party input), then narrow it to a real type straight away.
  - Avoid `as` casts and non-null `!`. Fix the type, or narrow with a check, instead.

### Naming

| What                     | Convention                             | Example                                |
| ------------------------ | -------------------------------------- | -------------------------------------- |
| Components, types        | PascalCase                             | `ProjectCard`, `interface Project`     |
| Variables, functions     | camelCase, functions start with a verb | `formatDate`, `getPosts`               |
| Booleans                 | `is` / `has` / `should` prefix         | `isOpen`, `hasCover`                   |
| Event handlers           | `handle*` inside, `on*` for props      | `handleClick`, `onToggle`              |
| Hooks                    | `use*`, camelCase file                 | `hooks/useTheme.ts`                    |
| True constants           | UPPER_SNAKE_CASE (module level only)   | `SITE_URL`, `MAX_POSTS`                |
| Non-component files      | camelCase                              | `lib/posts.ts`, `data/projects.ts`     |
| Route folders, MDX slugs | kebab-case (they become URLs)          | `app/blogs/tech/`, `my-first-post.mdx` |
| Sass partials            | `_` prefix, kebab-case                 | `_breakpoints.scss`                    |
| Tests                    | Same name as the file under test       | `Button.test.tsx`, `home.spec.ts`      |

- Use descriptive names, not abbreviations: `project`, not `p` (`i` is fine in short loops).
- Arrays and collections are plural: `projects`, `posts`.
- No `I` prefix on interfaces and no `T` prefix on types.
- Name things by what they are, not how they look: `ProjectCard`, not `BlueBox`.
- Component-specific naming (folders, files, `<Name>Props`) is in Component Conventions; CSS class and token naming is in Styling.

### Pre-commit hook

Husky runs `.husky/pre-commit` on every `git commit`:

1. `npx lint-staged` (`.lintstagedrc.json`): on staged files only, runs `eslint --fix` + `prettier --write` for JS/TS, `stylelint --fix` + `prettier --write` for CSS/SCSS, and `prettier --write` for JSON/Markdown/YAML. Fixes are re-staged automatically.
2. `npm run typecheck` on the whole project.

If the hook fails, fix the reported problem and commit again. Do not use `--no-verify` to get past it unless the user explicitly says to.

## Git Workflow

- Never commit directly on `main`. Start each piece of work on a new branch cut from an up-to-date `main`:
  - `feat/<feature-name>` for new features (e.g. `feat/theme-toggle`)
  - `fix/<bug-name>` for bug fixes (e.g. `fix/mobile-nav-overflow`)
- Branch names after the prefix are lowercase kebab-case and describe the change, not the ticket or date.
- Commit on the branch and push it with `git push -u origin <branch>`. Merge into `main` through a pull request; `main` only changes by merging.
- Only commit, push or open a pull request when the user asks.
- Write commit messages as a short imperative summary line, then a body for anything non-obvious.
- The pre-commit hook must pass (see above); never bypass it with `--no-verify` unless the user explicitly says to.

## Folder Structure

`src/app/` is for routing only. Shared code lives in top-level folders under `src/`.

```
src/
  app/            (exists) Routing only: layout, page, route.ts, loading/error, sitemap, opengraph-image, globals.css
  components/     (planned)
    ui/           Small reusable primitives (Button, Card, Tag)
    sections/     Page-level blocks (Hero, About, Projects, Experience, Contact)
  content/        (planned) Blog posts as MDX: tech/<slug>.mdx, travel/<slug>.mdx
  data/           (planned) Typed content (projects, experience, socials) as TS, not hardcoded in JSX
  lib/            (planned) Pure helpers and utilities
  hooks/          (planned) Client-side React hooks
  types/          (exists) Shared TypeScript types (mdx.d.ts types MDX frontmatter)
  styles/         (planned) Sass-only helpers: _breakpoints.scss, _mixins.scss
  mdx-components.tsx  (exists) Required by @next/mdx: maps MDX elements to components
public/           (exists) Static assets served at /
```

- Planned folders are created on first use, not up front.
- Import via the `@portfolio/*` alias (maps to `./src/*`), e.g. `@portfolio/components/ui/Button`, not deep relative paths.
- Route-only private helpers may live in `app/<route>/_components` (underscore folders are not routable).
- Components are Server Components by default; add `"use client"` only where needed.

## Component Conventions

Every reusable component gets its own PascalCase folder in `components/ui/` (generic primitives with no page knowledge) or `components/sections/` (page-level blocks composed from ui components). Sections may import from ui; ui must never import from sections.

```
components/ui/Button/
  index.ts              Public entry, re-exports only
  Button.tsx            The component
  styles.module.scss    Scoped styles
```

Add other files only when needed, on first use: `Button.test.tsx`, `types.ts` (if props types grow large), `constants.ts`, `hooks.ts` (hooks used only by this component). If a sub-component is reused elsewhere, promote it to its own folder.

### Rules

- TypeScript only. Components are arrow functions with a default export; don't use `React.FC`.
- The component file is named after its folder (`Button/Button.tsx`).
- Props use an exported `interface <Name>Props` in the same file. Extend native element props where sensible (e.g. `ComponentPropsWithoutRef<"button">`).
- `index.ts` is the public entry. Consumers import `@portfolio/components/ui/Button`, never a file inside the folder.
- Server Component by default. Add `"use client"` only to the component that needs state, effects or browser APIs, and keep client components small leaves.
- Next special files in `app/` (`page.tsx`, `layout.tsx`, ...) keep their required function form; the arrow-function rule applies to `components/`.
- React Compiler is enabled (`reactCompiler: true`), so don't add manual `useMemo`, `useCallback` or `memo`.
- Use semantic HTML and `next/image` with meaningful `alt` text. No clickable `div`s.
- Components receive content via props from `data/`; no hardcoded content or business data inside them.

### Styling

- Each component folder has a `styles.module.scss`, imported as `import styles from "./styles.module.scss"`. It must be `.module.scss`: a plain `styles.scss` is global CSS and can leak across routes.
- Class names are camelCase (`styles.primaryButton`). Don't target bare elements globally from a component stylesheet.
- Colors, spacing and type come from CSS custom properties (see Styling & Theming); Sass-only helpers (breakpoints, mixins) live in `src/styles/` and are pulled in with `@use`.
- `sass` is not installed yet. Run `npm i -D sass` before adding the first component with styles.

### Reference example

```tsx
// components/ui/Button/Button.tsx
import type { ComponentPropsWithoutRef } from 'react';

import styles from './styles.module.scss';

export interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  variant?: 'primary' | 'ghost';
}

const Button = ({ variant = 'primary', className, ...rest }: ButtonProps) => (
  <button
    className={[styles.button, styles[variant], className].filter(Boolean).join(' ')}
    {...rest}
  />
);

export default Button;
```

```ts
// components/ui/Button/index.ts
export { default } from './Button';
export type { ButtonProps } from './Button';
```

## Styling & Theming

Design values are CSS custom properties; Sass is for structure (nesting, breakpoints, mixins). The visual design is not decided yet: values marked `TBD` are placeholders to fill in, and the structure around them is what to follow.

### Where things live

- `src/app/globals.scss` (currently `globals.css`; rename once `sass` is installed): reset, base element styles, and all `:root` design tokens. Imported once in the root layout. This is the only global stylesheet.
- `src/styles/_breakpoints.scss`, `_mixins.scss`: Sass-only helpers, no CSS output on their own. Use via `@use "@portfolio/styles/breakpoints" as bp;`-style imports (confirm the resolution works with Sass before relying on it, otherwise use a relative path).
- Component styles: `styles.module.scss` per component (see Component Conventions).

### Design tokens

Components must use tokens, never hardcoded colors, font sizes or spacing values. Add a new token rather than a one-off literal.

| Group            | Naming                               | Examples                                                                                                  |
| ---------------- | ------------------------------------ | --------------------------------------------------------------------------------------------------------- |
| Color (semantic) | `--color-<role>`                     | `--color-bg`, `--color-surface`, `--color-text`, `--color-text-muted`, `--color-accent`, `--color-border` |
| Spacing          | `--space-<step>`                     | `--space-1` ... `--space-8` (scale: TBD)                                                                  |
| Type             | `--font-<role>`, `--text-<size>`     | `--font-sans`, `--font-mono`, `--text-sm` ... `--text-4xl` (TBD)                                          |
| Radius / shadow  | `--radius-<size>`, `--shadow-<size>` | TBD                                                                                                       |

- Name colors by role, not by hue (`--color-accent`, not `--color-blue`), so themes can swap values without renaming.
- Fonts are loaded with `next/font` in `app/layout.tsx` (currently Geist) and exposed as `--font-geist-sans` / `--font-geist-mono`. Map them to `--font-sans` / `--font-mono` in `:root`; the scaffold's `Arial` body font should be replaced by `var(--font-sans)`.
- Palette, type scale and spacing values are `TBD` until the design is chosen. Do not invent them silently: ask.

### Light / dark theme

Supports the system preference plus a manual toggle (light, dark, or system).

- Light values are the `:root` defaults. Dark values are applied in two places, which is the only repetition allowed; wrap the dark token map in one Sass mixin so it's defined once:
  - `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { ...dark tokens } }`
  - `:root[data-theme="dark"] { ...dark tokens }`
- The user's choice is stored in `localStorage` (try/catch every access) and applied as `data-theme` on `<html>`. "System" means no `data-theme` attribute.
- To avoid a flash of the wrong theme, set `data-theme` from `localStorage` with a small inline script in the root layout `<head>` that runs before paint, and add `suppressHydrationWarning` to `<html>`. Read the Next docs on scripts in `node_modules/next/dist/docs/` before implementing.
- The toggle is a small `"use client"` component in `components/ui/ThemeToggle/`. It must render nothing theme-dependent until mounted, so server and client markup match.
- Set `color-scheme` on `:root` per theme so native controls and scrollbars match.

### Breakpoints and responsive rules

- Mobile first: base styles target small screens (down to 320px wide); add `min-width` queries going up. Never write `max-width` queries.
- Breakpoints are Sass variables in `_breakpoints.scss`, used only through the `bp.up(<name>)` mixin, e.g. `@include bp.up(md) { ... }`. Media queries can't read CSS variables, so don't put breakpoints in `:root`, and don't write raw pixel media queries in components.

| Name | Min width | Typical target           |
| ---- | --------- | ------------------------ |
| `sm` | 640px     | Large phones (landscape) |
| `md` | 768px     | Tablets                  |
| `lg` | 1024px    | Laptops                  |
| `xl` | 1280px    | Desktops                 |

- Below `sm` is the base (phone) style. Content width is capped by a max-width container token on wide screens, so lines stay readable.
- Use relative units (`rem`, `%`, `clamp()`) for type and layout; `px` only for borders and hairlines. Prefer fluid layouts (flex, grid, `clamp()`) over adding more breakpoints.
- No horizontal page scroll at any width. Wide content (code blocks, tables, embeds) scrolls inside its own container with `overflow-x: auto`.
- Tap targets are at least 44 x 44px. Nothing may work only on hover; hover effects are enhancements, wrapped in `@media (hover: hover)`.
- Navigation collapses into an accessible menu on small screens (button with `aria-expanded`, keyboard operable, closes on Escape).
- Images use `next/image` with a `sizes` prop that matches the layout, so phones don't download desktop-sized files.
- Respect `prefers-reduced-motion`: wrap non-essential animation in `@media (prefers-reduced-motion: no-preference)`.
- Check every new or changed layout at a phone width (about 375px) and a desktop width (about 1280px) before considering it done. E2E tests already run in both a desktop and a mobile browser (see Testing).

### Don'ts

- No inline `style` for static styling (dynamic values via CSS variables set from props are fine).
- No `!important`, no styling by ID, no global selectors in component stylesheets.
- No CSS-in-JS or utility-class frameworks; Sass modules are the only approach.
- Don't duplicate token values in components; reference the variable.

## Testing

Unit and component tests use **Vitest** and **React Testing Library**. End-to-end tests use **Playwright**. Configuration lives in `vitest.config.mts` and `playwright.config.ts`; the `@portfolio/*` alias works in tests. When changing test setup, follow Next's guides in `node_modules/next/dist/docs/01-app/02-guides/testing/`.

### What goes where

- **Unit and component tests**: `*.test.ts` / `*.test.tsx`, colocated with the code they test (`Button/Button.test.tsx`, `lib/format.test.ts`).
- **Data integrity tests**: one test file per dataset in `data/` checking required fields, unique ids or slugs, and well-formed URLs, so broken content fails a test instead of the page.
- **End-to-end tests**: `*.spec.ts` in the root `e2e/` folder. They run against the real app in a desktop and a mobile browser project; use relative URLs (`page.goto("/")`), since `baseURL` is configured.
- Vitest ignores `e2e/`, and Playwright only looks in `e2e/`. Don't mix the two.

### What to test

- Behavior of interactive components: what the user sees and can do (clicking, typing, keyboard use, open and close states, form validation and submit states).
- Utilities and logic with real branching, and any bug that has been fixed.
- Critical user flows end-to-end: pages load without console errors, navigation works, state that should persist survives a reload, and the layout works on mobile.
- Don't test purely presentational components, CSS, or Next internals. No snapshot tests.
- `async` Server Components can't be rendered by Vitest. Cover them with end-to-end tests instead.

### Writing tests

- Query by role or label (`getByRole`, `getByLabelText`), then by text. Avoid test IDs and CSS selectors unless there is no accessible alternative.
- Use `@testing-library/user-event` for interactions, not `fireEvent`.
- Assert on outcomes the user can observe, not on implementation details like state or class names.
- Import from `vitest` explicitly (`import { expect, test } from 'vitest'`); globals are off.
- Tests must be deterministic: no real network or clock. Mock `fetch` and use fake timers.
- Keep tests independent. Each one sets up its own state and doesn't rely on another test running first.

### Rules

- A new interactive component or utility ships with a test. A bug fix starts with a failing regression test.
- Don't delete or skip a failing test to get green (`.skip`, `.only`, loosened assertions). Fix the code or the test.
- Test files are linted, formatted and typechecked like any other code.
- Tests do **not** run in the pre-commit hook, so run them yourself (see Commands) before considering work done.

## Content and data

There are two kinds of content, stored differently.

### Blog posts (MDX only)

- One MDX file per post: `src/content/tech/<slug>.mdx` and `src/content/travel/<slug>.mdx`. The filename is the slug (lowercase kebab-case) and becomes the URL part under `/blogs/tech/` or `/blogs/travel/`.
- Never put posts in a CMS or another format. Files under `src/content/` are not routes (they have no `page` file).
- Each post starts with YAML frontmatter:

```mdx
---
title: 'Post title'
date: '2026-01-31'
summary: 'One sentence for listings and metadata.'
tags: ['nextjs', 'typescript']
draft: false
---
```

- `title` and `date` are required. Quote the date (`'YYYY-MM-DD'`) so it stays a string. `summary`, `tags` and `draft` are optional.
- Frontmatter is exported from each file as `frontmatter`, via `remark-frontmatter` and `remark-mdx-frontmatter` configured in `next.config.ts`. Its type is declared in `src/types/mdx.d.ts`; when you add a field, update that type and this list.
- Posts with `draft: true` must not appear in listings or be statically generated in production.
- Each blog has its own dynamic route (`app/blogs/tech/[slug]`, `app/blogs/travel/[slug]`) that loads a post with a dynamic import of the `.mdx` file, with `generateStaticParams` and `dynamicParams = false` so unknown slugs 404. Listing pages read the content directory on the server (`fs`) and use each post's frontmatter. Shared loading helpers may live in `lib/` parameterized by blog; keep routes, listing UI and styling separate per blog.
- Include the `.mdx` extension explicitly in dynamic imports, e.g. ``import(`@portfolio/content/tech/${slug}.mdx`)``.

### MDX components and plugins

- `src/mdx-components.tsx` is required by `@next/mdx` in the App Router. Map MDX elements (headings, links, images, code blocks) to project components there.
- Style MDX content with CSS Modules and design tokens. Do not copy the inline `style` examples from Next's docs.
- Remark and rehype plugins are configured in `next.config.ts` under `createMDX`. Turbopack requires plugin names as strings with serializable options (`'remark-gfm'`, `['remark-toc', { heading: 'Contents' }]`), never imported functions.
- Not decided yet (ask before assuming): where post images are stored, and syntax highlighting.

### Portfolio data

- Projects, experience, skills and socials are typed TypeScript in `src/data/<name>.ts`, exporting typed constants. Shared types go in `src/types/`.
- Components never contain this content; pages read it from `data/` and pass it down as props.
- Each dataset has a data integrity test (see Testing).

### Metadata and SEO

- Site-wide values (`SITE_NAME`, `SITE_DESCRIPTION`, `SITE_URL`) live in `src/lib/site.ts`. The root layout sets `metadataBase` and a title template (`%s | Amlan Nandy`) from them, so pages export only their own `title` and `description`.
- Every page sets its own `title` and `description`. Post pages derive them from the frontmatter (`title`, `summary`) with `generateMetadata`.
- Use relative paths for canonical and Open Graph URLs; `metadataBase` makes them absolute. Build absolute URLs (sitemap, feeds) from `SITE_URL`, never a hardcoded domain.
- When added, `app/sitemap.ts` lists all routes and every non-draft post, and `app/robots.ts` points to it.

## Deployment and environment variables

- **Host:** Vercel (Hobby plan, personal non-commercial use). Production deploys come from `main` on GitHub; there is no separate staging branch.
- **Domain:** `amlannandy.in`, registered at GoDaddy. DNS records at GoDaddy point to Vercel (apex `A` record and a `www` `CNAME`). Don't change them without checking Vercel's Domains settings.
- **Environment variables:** `NEXT_PUBLIC_SITE_URL` is the site's origin (no trailing slash). It is required and has no fallback in code: `src/lib/site.ts` throws if it is missing. Locally it lives in `.env.local` (`http://localhost:3000`); in production it is set to `https://amlannandy.in` in Vercel's project settings. `.env.example` lists every variable the app reads; update it when you add one. Always import `SITE_URL`; never hardcode the domain.
- Never commit secrets. `.env*` files are gitignored; set real values in Vercel's project settings. Variables prefixed `NEXT_PUBLIC_` are exposed to the browser.
- `npm run build` must pass locally before a push, since a failed build blocks the deploy.

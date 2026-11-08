This is a portfolio web app built on top of Next.js.

## NOTE: This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

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

- Run `typecheck`, `lint`, `lint:css` and `format:check` before considering work done. The pre-commit hook covers staged files plus `typecheck`, but only fixes and checks what is staged.
- `typecheck` runs `next typegen` first because helpers like `LayoutProps<"/">` are generated, not checked in. Don't replace it with a bare `tsc`.
- There is no test script yet.

## Code Style

Formatting is automated; don't hand-format or argue with the tools. Run `npm run format` instead.

- **Prettier** (`.prettierrc.json`): semicolons, single quotes in TS/JS (`jsxSingleQuote: false`, so JSX attributes use double quotes), 2-space indent, 100 columns, `es5` trailing commas, `arrowParens: "always"`.
- **Import order** (via `@trivago/prettier-plugin-sort-imports`), with a blank line between groups: `react`, `next*`, third-party, `@portfolio/components/*`, `@portfolio/(hooks|lib|data|types|styles)/*`, then relative imports. Specifiers are sorted.
- **ESLint** (`eslint.config.mjs`): flat config extending Next's `core-web-vitals` and `typescript` presets, then `eslint-config-prettier` last to switch off rules that conflict with Prettier. Don't add formatting rules to ESLint.
- **Stylelint** (`stylelint.config.mjs`): standard SCSS config plus `recess-order` property ordering. Enforces camelCase class names, no `!important`, no ID selectors, and no hex colors in `*.module.*` files (use `var(--color-*)` tokens). `globals` and `src/styles/` may define raw values. Pinned to v17 because `stylelint-config-standard-scss` doesn't support v18 yet.
- **TypeScript**: `strict` is on. Avoid `any`; prefer `unknown` and narrow.

### Pre-commit hook

Husky runs `.husky/pre-commit` on every `git commit`:

1. `npx lint-staged` (`.lintstagedrc.json`): on staged files only, runs `eslint --fix` + `prettier --write` for JS/TS, `stylelint --fix` + `prettier --write` for CSS/SCSS, and `prettier --write` for JSON/Markdown/YAML. Fixes are re-staged automatically.
2. `npm run typecheck` on the whole project.

If the hook fails, fix the reported problem and commit again. Do not use `--no-verify` to get past it unless the user explicitly says to.

## Folder Structure

`src/app/` is for routing only. Shared code lives in top-level folders under `src/`.

```
src/
  app/            (exists) Routing only: layout, page, route.ts, loading/error, sitemap, opengraph-image, globals.css
  components/     (planned)
    ui/           Small reusable primitives (Button, Card, Tag)
    sections/     Page-level blocks (Hero, About, Projects, Experience, Contact)
  data/           (planned) Typed content (projects, experience, socials) as TS, not hardcoded in JSX
  lib/            (planned) Pure helpers and utilities
  hooks/          (planned) Client-side React hooks
  types/          (planned) Shared TypeScript types
  styles/         (planned) Sass-only helpers: _breakpoints.scss, _mixins.scss
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

- Mobile first: base styles target small screens; add `min-width` queries going up.
- Breakpoints are Sass variables in `_breakpoints.scss` (values TBD; typical: 640 / 768 / 1024 / 1280 px) used through one mixin, e.g. `@include bp.up(md) { ... }`. Media queries can't read CSS variables, so don't put breakpoints in `:root`.
- Use relative units (`rem`, `%`, `clamp()`) for type and layout; `px` only for borders and hairlines.
- Respect `prefers-reduced-motion`: wrap non-essential animation in `@media (prefers-reduced-motion: no-preference)`.

### Don'ts

- No inline `style` for static styling (dynamic values via CSS variables set from props are fine).
- No `!important`, no styling by ID, no global selectors in component stylesheets.
- No CSS-in-JS or utility-class frameworks; Sass modules are the only approach.
- Don't duplicate token values in components; reference the variable.

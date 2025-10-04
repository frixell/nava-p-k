# Modernization Plan

## Status Snapshot

- ✅ Wrapped: TypeScript migration, state/data layer cleanup, legacy dependency removal, routing/entry refresh, styling consistency.
- 🧭 In Motion: Testing & Tooling upgrades, Build & Performance audits, Deployment hardening.
- 🔜 Next Planning Pass: Testing coverage expansion before build/perf experiments.

## ✅ Finish TypeScript Migration

- Converted remaining JS entry points (`src/app.tsx`, Firebase bootstrap, router modules) to TS/TSX so types flow end-to-end.
- Replaced ad-hoc `any` signatures in migrated actions/hooks with shared domain types under `src/types`.

## ✅ Tidy State + Data Layer

- Replaced home‑grown Redux plumbing with Redux Toolkit slices to shrink boilerplate, standardize async calls, and simplify optimistic updates.
- Introduced type-safe selectors and dispatch hooks (`useAppDispatch`, `useAppSelector`) to remove repeated `RootState = any` patterns.

## ✅ Drop Legacy Dependencies

- Removed jQuery usage (IP lookup, DOM height calculations) in favour of `fetch` and ResizeObserver.
- Audited Cloudinary integrations and replaced ad-hoc requests with helpers (no raw `XMLHttpRequest`).

## ✅ Routing & Entry Refresh

- Refactored `AppRouter` into a typed, React.lazy-driven route table with Suspense fallbacks for every view (`src/routers/AppRouter.tsx`).
- Bootstrapped the client from `src/app.tsx` with the typed store, theme, and a single i18n hydration flow bound to the language detector.
- Language detection now rides on `i18next-browser-languagedetector`, removing the old IP lookup side-effect (`src/i18n/i18n.js`).

## Styling Consistency

- ✅ Converted navigation + page-up strip to Emotion/MUI and dropped their SCSS imports.
- ✅ `_Footer.scss`: migrated to `Footer.styles.ts` using theme palette, spacing, and typography tokens.
- ✅ `_HomePage.scss`: replaced with Emotion/MUI layout + shared rich-text styling; SCSS partial removed after parity check.
- 🔧 `_Backoffice.scss`: fold form/table styling into the dashboard theme module, ensuring dark-mode palette tokens are respected by the new components.
- 🔧 `_GlobalUI.scss`: split global helpers into `GlobalStyles` + `ThemeOverrides`, mirroring existing button/input tokens before removing the catch-all partial.
- 🔧 `_WorkshopPage.scss`: port schedule cards to styled components, swapping hard-coded breakpoints for the theme's breakpoint helpers and documenting any bespoke print rules.
- 📋 Align residual layout helpers (e.g., `PageLayout.styles` derivatives) once their host features move off the legacy partials.

## Testing & Tooling

- Add React Testing Library smoke tests for critical screens (Contact submit flow, Teaching CRUD) and reducers/sagas once ported to RTK.
  - ✅ ContactPage submit path covered using MSW with Firebase/database mocks to assert persisted records and email dispatch.
  - ✅ TeachingPage hide/delete path covered with MSW-backed image delete handler and in-memory Firebase state.
  - ✅ Teaching slice thunks now exercised with the Firebase mock (load/add/delete/update/order/SEO/image/visibility).
  - ✅ Shared fixtures created for teaching CRUD scenarios to simplify future validation/UI tests.
  - ✅ Stand up UI-level validation coverage (TeachEditor / useTeachingPage) with empty-save guardrails.
  - ✅ Added bilingual teach validation tests to accept Hebrew-only drafts and reject whitespace-only rich text.
  - ✅ Scoped ESLint to the teaching feature with `tsconfig.eslint.json`, new lint script, and temporary TODOs for remaining Firebase typing gaps.
  - 🔧 Schedule a lint debt sweep: refactor legacy modules (e.g., older thunks/selectors) to resolve strict `@typescript-eslint` violations instead of broad rule suppression. (Store factory + dispatch hooks now typed; teaching hook suppression scoped. Consider addressing React Router v7 future-flag warnings in tests.)
  - ✅ Integrate ESLint/Prettier with a TS-aware config to enforce consistent formatting and catch leftover `any`s.\*
  - ✅ Extend `eslint-config-airbnb` (or existing baseline) with `@typescript-eslint` and React Testing Library plugins; add lint scripts to `package.json`.\*
  - ✅ Introduce a shared Prettier config aligned with the 4-space/single-quote house style and wire `lint-staged` for on-commit enforcement.\*
  - ✅ Add Husky pre-commit hook to run `yarn lint:staged` automatically. "husky test"
  - 🔧 Gate `yarn lint` and `yarn format:check` in CI alongside tests so divergence is caught before merge.

`*` New dependencies declared; run `yarn install` before linting.

## Build & Performance

- Enable modern bundling (Vite or Webpack 5) with tree-shaking, dynamic imports for admin-only views, and bundle analyzer targets.
  - Prototype Vite alongside current Webpack; compare cold start/HMR, verify compatibility with our Firebase/i18n setup, and document required polyfill/shim work (e.g., Firebase, Cloudinary upload widget).
  - If staying on Webpack, jump to v5, add `@loadable/component`-style code splitting, and wire `webpack-bundle-analyzer` to track regressions; record current bundle size baselines first.
  - Capture build metrics (dev server first paint, production bundle size, compress ratio) before/after each experiment so improvements are quantifiable.
- Introduce a service worker or preloading strategy for hero imagery/videos if page weight is still high.
  - Audit current Lighthouse/WebPageTest metrics; document LCP/CLS and largest static assets per locale.
  - Evaluate Workbox-based precaching for hero assets vs. srcset-based responsive loading; proof-of-concept whichever offers better control.
  - Gate new optimizations behind feature flags in case we need to roll back with A/B comparisons.

## Deployment & Config Hygiene

- Move Firebase keys/endpoints to `.env` with typed config readers; document required environment variables.
  - Create a central `src/config/firebase.ts` that reads from `process.env` and throws on missing keys in non-test environments. _(Typed database facade now lives in `src/firebase/types.ts`; real + mock implementations updated.)_
  - Update onboarding docs with required `.env.example` entries and regenerate secrets for any keys currently checked in.
- Add CI checks (tsc, lint, tests) before deploy to keep the new TypeScript surface healthy.
  - Wire GitHub Actions (or existing CI) with separate steps for `yarn build:prod`, `yarn lint`, `yarn test`, and `tsc --noEmit`.
  - Fail fast on config drift by running a script that asserts required env vars are present during CI setup.

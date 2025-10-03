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

## ✅ Styling Consistency
- Rebuilt the navigation bar and page-up strip with Emotion/MUI styling hooks, eliminating the remaining BEM-driven SCSS and aligning them with theme tokens.
- Removed legacy SCSS imports and helpers tied to navigation/pageup partials so new components default to the theme-based system.

## Testing & Tooling
- Add React Testing Library smoke tests for critical screens (Contact submit flow, Teaching CRUD) and reducers/sagas once ported to RTK.
  - Stand up fixtures and MSW handlers so Contact submissions can be asserted without hitting real endpoints.
  - Cover Teaching list/create/update/delete happy paths and at least one validation error to safeguard the CRUD surface.
  - Snapshot updated RTK slices by testing selector outputs and thunk success/failure branches; backfill legacy saga coverage before we remove them.
- Integrate ESLint/Prettier with a TS-aware config to enforce consistent formatting and catch leftover `any`s.
  - Extend `eslint-config-airbnb` (or existing baseline) with `@typescript-eslint` and React Testing Library plugins; add lint scripts to `package.json`.
  - Introduce a shared Prettier config aligned with the 4-space/single-quote house style and wire `lint-staged` for on-commit enforcement.
  - Gate `yarn lint` and `yarn format:check` in CI alongside tests so divergence is caught before merge.

## Build & Performance
- Enable modern bundling (Vite or Webpack 5) with tree-shaking, dynamic imports for admin-only views, and bundle analyzer targets.
  - Prototype Vite alongside current Webpack; compare cold start/HMR and verify compatibility with our Firebase/i18n setup.
  - If staying on Webpack, jump to v5, add `@loadable/component`-style code splitting, and wire `webpack-bundle-analyzer` to track regressions.
- Introduce a service worker or preloading strategy for hero imagery/videos if page weight is still high.
  - Audit current Lighthouse/WebPageTest metrics; document LCP/CLS and largest static assets per locale.
  - Evaluate Workbox-based precaching for hero assets vs. srcset-based responsive loading; proof-of-concept whichever offers better control.
  - Gate new optimizations behind feature flags in case we need to roll back with A/B comparisons.

## Deployment & Config Hygiene
- Move Firebase keys/endpoints to `.env` with typed config readers; document required environment variables.
  - Create a central `src/config/firebase.ts` that reads from `process.env` and throws on missing keys in non-test environments.
  - Update onboarding docs with required `.env.example` entries and regenerate secrets for any keys currently checked in.
- Add CI checks (tsc, lint, tests) before deploy to keep the new TypeScript surface healthy.
  - Wire GitHub Actions (or existing CI) with separate steps for `yarn build:prod`, `yarn lint`, `yarn test`, and `tsc --noEmit`.
  - Fail fast on config drift by running a script that asserts required env vars are present during CI setup.

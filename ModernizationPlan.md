# Modernization Plan

## Finish TypeScript Migration
- Convert remaining JS entry points (`src/app.js`, Firebase bootstrap, router modules) to TS/TSX so types flow end-to-end.
- Replace ad-hoc `any` signatures in freshly migrated actions/hooks with shared domain types; extract a `src/types` bundle for Firebase entities, SEO payloads, etc.

## Tidy State + Data Layer
- Replace home‑grown Redux plumbing with Redux Toolkit slices (or RTK Query) to shrink boilerplate, standardize async calls, and make optimistic updates safer.
- Introduce type-safe selectors and dispatch hooks (`useAppDispatch`, `useAppSelector`) to remove repeated `RootState = any` patterns.

## Drop Legacy Dependencies
- Remove jQuery usage (IP lookup, DOM height calculations); use `fetch` and `ResizeObserver`.
- Audit Cloudinary/`XMLHttpRequest` code; replace with `fetch`/SDK helpers and centralized upload utilities.

## Routing & Entry Refresh
- Refactor `AppRouter` and `src/app.js` into a typed composition that supports code-splitting (React.lazy) and Suspense fallbacks.
- Hydrate i18n once at bootstrap; eliminate the IP geolocation side-effect and move language detection into i18next detector config.

## Styling Consistency
- Consolidate global SCSS into CSS variables + modules or Emotion themes; migrate remaining BEM classes to styled components where practical.
- Define shared typography/spacing tokens so new components (Contact, Cv, Teaching) align visually.

## Testing & Tooling
- Add React Testing Library smoke tests for critical screens (Contact submit flow, Teaching CRUD) and reducers/sagas once ported to RTK.
- Integrate ESLint/Prettier with a TS-aware config to enforce consistent formatting and catch leftover `any`s.

## Build & Performance
- Enable modern bundling (Vite or Webpack 5) with tree-shaking, dynamic imports for admin-only views, and bundle analyzer targets.
- Introduce a service worker or preloading strategy for hero imagery/videos if page weight is still high.

## Deployment & Config Hygiene
- Move Firebase keys/endpoints to `.env` with typed config readers; document required environment variables.
- Add CI checks (tsc, lint, tests) before deploy to keep the new TypeScript surface healthy.

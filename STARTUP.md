# Startup Notes – Testing & Tooling Completion

## Context
- Objective: finish outstanding items under **Testing & Tooling** in `ModernizationPlan.md`.
- Progress to date:
  - MSW infrastructure + Firebase mock implemented.
  - Smoke tests for ContactPage & TeachingPage added and passing.
  - Redux `teachingSlice` thunk tests expanded (load/add/remove/update/order/SEO/image/visibility).
  - Reusable teaching fixtures added for slice/feature tests.
  - Teach editor validation prevents empty submissions (hook-level coverage for save flows).
  - TS/jest configs updated for new tooling.
  - ESLint overrides added for tests/mocks; tsconfig path aliases in place.
  - Airbnb-based ESLint stack + testing-library/jest-dom plugins wired alongside Prettier (4-space single quote house style).
  - Package scripts extended with `format`, `format:check`, `lint:staged`, `typecheck`, `ci:verify`; lint-staged config drafted.

## Outstanding Tasks (per plan)
1. **Assess remaining teaching edge cases**
   - Consider Hebrew/dual-language validation scenarios and selector coverage if regressions surface.
2. **Adopt new lint stack**
   - `eslint-config-airbnb(-typescript)` and testing-library plugins are declared but require `yarn install` to hydrate `yarn.lock`.
   - Plan staged cleanup to reduce legacy rule violations (e.g., `react/jsx-props-no-spreading`, import order).
3. **Hook lint-staged into day-to-day flow**
   - Add husky/pre-commit or document running `yarn lint:staged` manually until git hooks are in place.
4. **Lint debt sweep**
   - Identify priority files (e.g., `src/app.tsx`, Redux thunks) and refactor to remove `any` usage and unsafes; schedule staged clean-up.

## Current Status / Working Tree
- Modified files (unfinished work):
  - `.eslintrc.cjs`, `.prettierrc.json`, `package.json` (new lint/prettier stack + scripts declared; requires dependency install + CI wiring).
  - `src/tests/fixtures/teaching.ts` (new fixture helpers for teaching flows).
  - `src/store/slices/teachingSlice.test.ts` (expanded coverage for add/update/delete/image/visibility paths).
- `src/app.tsx`, `src/store/slices/*` (typed dispatch/getState tightened; teaching hook lint suppression scoped at top of file; legacy thunks still planned for cleanup).
- `src/store/configureStore.ts`, `src/store/hooks.ts` (store factory rebuilt with typed `rootReducer`, `PreloadedState` support, and direct `AppDispatch`; hooks return typed dispatch/selectors without casts).
- `src/components/contactpage/ContactFormCard.test.tsx`, `src/containers/teaching/TeachList.test.tsx` (tests run under theme/stated wrapper; order interactions and validation assertions stable).
- `src/components/contactpage/ContactFormCard.test.tsx`, `src/containers/teaching/TeachList.test.tsx` (tests updated to run under theme context and assert controlled ordering behaviour).
- Tests passing: `yarn test --runTestsByPath src/containers/ContactPage.test.tsx src/containers/teaching/TeachingPage.test.tsx src/store/slices/teachingSlice.test.ts`.
- `yarn typecheck` (tsc --noEmit) passes locally.
  - Shared Firebase database types added; jest mock updated to implement the typed interface.
  - Teaching slice and hooks now compile against typed `database.ref` calls; lingering `no-unsafe` suppression in `useTeachingPage.ts` awaits broader slice refactors.

## Next Steps Checklist
1. Flesh out teaching validation coverage (hook/UI level) and selectors per plan bullet.
2. Install updated lint dependencies (`yarn install`) and run `yarn lint` to inventory remaining violations (legacy thunk cleanup pending).
3. Husky pre-commit now runs `yarn lint:staged`; share rollout notes with the team.
4. Continue targeted lint debt sweep (prioritize older thunks/selectors once store typing rollout lands).
5. Decide whether to opt into React Router v7 future flags in test setup to silence console warnings.
6. Update `ModernizationPlan.md` when validation coverage + lint rollout deemed complete.

## Quick Commands
- Run targeted tests: `yarn test --runTestsByPath src/containers/ContactPage.test.tsx src/containers/teaching/TeachingPage.test.tsx src/store/slices/teachingSlice.test.ts`
- Type check: `yarn tsc --noEmit`
- Lint (for current file): `yarn eslint <file>` (requires fresh install for new Airbnb deps)
- Full lint (noise expected): `yarn lint`

Restart plan from this note after re-launching Codex. EOF

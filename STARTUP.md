# Startup Notes – Testing & Tooling Completion

## Context
- Objective: finish outstanding items under **Testing & Tooling** in `ModernizationPlan.md`.
- Progress to date:
  - MSW infrastructure + Firebase mock implemented.
  - Smoke tests for ContactPage & TeachingPage added and passing.
  - Redux `teachingSlice` thunk tests expanded (load/add/remove/update/order/SEO).
  - TS/jest configs updated for new tooling.
  - ESLint overrides added for tests/mocks; tsconfig path aliases in place.

## Outstanding Tasks (per plan)
1. **Add fixtures/tests for remaining Teaching CRUD paths**
   - Need dedicated tests for create/edit validation flows (e.g., verifying form-level validation logic, selector coverage, thunk error paths).
   - Consider mocking validation utilities (`validateContactForm`, etc.) or adding tests around UI components (TeachEditor, etc.).
2. **Integrate ESLint/Prettier with TS-aware configs**
   - Lint command currently reports thousands of legacy issues (e.g., `src/app.tsx`).
   - Decision pending: whether to refactor code to satisfy strict rules or relax rules for legacy modules.
3. **Wire lint-staged + CI scripts**
   - Add `lint`, `format:check`, `lint-staged` config, update `package.json` scripts, and plan GitHub Actions/other CI steps.
4. **Lint debt sweep**
   - Identify priority files (e.g., `src/app.tsx`, Redux thunks) and refactor to remove `any` usage and unsafes; schedule staged clean-up.

## Current Status / Working Tree
- Modified files (unfinished work):
  - `.eslintrc.cjs` (test overrides)
  - `src/app.tsx` (partial lint clean-up; further work needed)
  - `src/store/configureStore.ts`, `aboutSlice.ts`, `authSlice.ts`, `categoriesSlice.ts`, `cvSlice.ts`, `pointsSlice.ts`, `tableTemplateSlice.ts`, `teachingSlice.ts` (introduced `AppThunk` typing changes, may need to finalize dispatch/getState typing).
- Tests passing: `yarn test --runTestsByPath src/containers/ContactPage.test.tsx src/containers/teaching/TeachingPage.test.tsx src/store/slices/teachingSlice.test.ts`.
- `yarn tsc --noEmit` currently failing with typing gaps (e.g., `firebase.User` import, missing dispatch typings in slices/tests).
- `yarn lint` still reports existing project-wide errors; next step is to plan how to reduce them.

## Next Steps Checklist
1. Resolve TypeScript errors from `yarn tsc --noEmit` (firebase types, thunk typings, test helper typings).
2. Decide on lint strategy for legacy code: either relax rules or start targeted refactors.
3. Implement additional Teaching CRUD tests (create/edit validation + selectors).
4. Update `package.json` with lint/format scripts, configure `lint-staged`, and draft CI commands.
5. Once tooling is stable, update `ModernizationPlan.md` to mark Testing & Tooling complete and outline remaining Build & Performance tasks.

## Quick Commands
- Run targeted tests: `yarn test --runTestsByPath src/containers/ContactPage.test.tsx src/containers/teaching/TeachingPage.test.tsx src/store/slices/teachingSlice.test.ts`
- Type check: `yarn tsc --noEmit`
- Lint (for current file): `yarn eslint <file>`
- Full lint (noise expected): `yarn lint`

Restart plan from this note after re-launching Codex. EOF

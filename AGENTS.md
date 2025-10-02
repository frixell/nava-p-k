# Repository Guidelines

## Project Structure & Module Organization
`src/app.js` boots the React client, pulling feature code from `actions`, `reducers`, `containers`, and presentational pieces in `components` and `shared`. Cross-cutting utilities live in `src/utils`, Firebase auth helpers in `src/firebase`, translations in `src/i18n`, while SCSS sits under `src/styles`, static assets in `public`, and the Express edge is in `server/server.js`. Build and compiler settings are defined at the root in `webpack.config.js`, `babel.config.js`, and `tsconfig.json`.

## Build, Test, and Development Commands
- `yarn dev-server`: start the webpack dev server with hot reload for UI work.
- `yarn start`: serve the built bundle through Express for end-to-end checks.
- `yarn build:dev` / `yarn build:prod`: emit development or optimized bundles into `public/`.
- `yarn test`: run Jest via `jest.config.json` with CI-compatible defaults.

## Coding Style & Naming Conventions
Stick to modern ES modules, 4-space indentation, single quotes, and trailing commas where they aid diffs. Use PascalCase for React components and folders, camelCase for functions, Redux actions, and filenames like `eventTable.reducer.js`. Keep SCSS partials named after their component counterparts and import them through `src/styles/styles.scss`; avoid diverging formatting without a shared ESLint/Prettier config.

## Testing Guidelines
Jest plus Testing Library are wired through `src/tests/setupTests.js`; extend that file for shared matchers or mocks. Place new specs alongside the component as `*.test.jsx` (or `.tsx` when adding TypeScript) and favor user-focused Testing Library queries. Run `yarn test` before committing, document any gaps in the PR description, and target meaningful coverage for new behaviors.

## Commit & Pull Request Guidelines
Mirror the existing history with short, present-tense commit subjects (e.g., `design fixes`, `warnings fix`) and squash noisy WIP commits. Each PR should include a summary of intent, linked tickets, screenshots or GIFs for UI shifts, and a short test plan. Flag config updates—such as Firebase settings or routing changes—so reviewers can revalidate environment assumptions.

## Localization & Configuration Notes
Keep `translations.js` aligned with resources in `src/i18n`, updating both English and Hebrew strings whenever copy changes. Never commit secrets; load credentials with local `.env` files consumed by `dotenv`, and coordinate any `credentials.json` edits before merge.

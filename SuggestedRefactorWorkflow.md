## Page Refactor Workflow

1. **Inventory & Goal** – Review the legacy component (markup, classes, behaviour) and clarify which aspects must remain identical versus what should be modernised (hooks, Emotion styling, TypeScript typings).
2. **Design Token Mapping** – Identify hardcoded colours, typography sizes, spacing, and responsive breakpoints; map them to shared design tokens or CSS variables so the updated version stays visually consistent.
3. **Component Skeleton** – Create a functional TSX shell that wires up navigation/translation hooks and sets up the main structural wrappers (e.g., container, hero panel, CTA area).
4. **Progressive Styling Migration** – Recreate each legacy SCSS class as an Emotion styled component: copy values first, then consolidate hover/transition logic and add accessibility tweaks.
5. **Logic Integration** – Reintroduce business logic (language detection, navigation handlers, props from parent pages) using modern hooks, ensuring existing behaviour stays intact.
6. **Clean-up & Removal** – Once parity is achieved, remove the obsolete JS/SCSS files (or mark remaining dependencies) so only the new implementation is active.
7. **Extract Styling** – Move Emotion styled components into a dedicated `.styles.ts` module so layout logic and design tokens stay separate from render logic.
8. **Componentize** – Break the page into small, reusable subcomponents/hooks to keep files manageable and improve reusability.
9. **Verification** – Run `yarn tsc --noEmit`, smoke-test the UI, compare visuals/screenshots, and document follow-ups (e.g., shared tokens to extract) before closing the refactor. Aim to keep each page file under ~100 lines by leveraging shared components and stylesheets.

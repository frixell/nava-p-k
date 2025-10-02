# Home Page Modernization Map

## Entry Point: `src/containers/HomePage.js`
- Class component with ~600 lines controlling map view, sidebar, project modals, and category editing.
- Imports: `MapViewTest`, `SideBar`, `ProjectDetailsPage`, plus Redux actions (`startAddPoint`, `startEditProject`, `startAddCategory`, `startEditCategories`, `startToggleShowCategory`).
- Uses global Cloudinary upload widget, manual beforeunload handling, and direct DOM style tweaks.

## Supporting Components
- `SideBar.js`: renders category list, project entries, and social blocks. Depends heavily on `_HomePage.scss` selectors.
- `ProjectDetailsPage.js`: modal for project details; also class-based with nested editors.
- `MapViewTest.js`: mapping utility (ArcGIS via esri-loader) managing map interactions, geometry calculations, and popup rendering.
- Test/legacy files still present (`MapTest.js`, `LayerSaveTest.js`, `BuildingTest.js`, `PointTestBack.js`) but not routed; confirm if they can be archived.

## Styling Dependencies
- `_HomePage.scss` (in `src/styles/components`) controls layout for the sidebar, social icons, map overlays, buttons, etc.
- Social icon assets and toolbars inherit from legacy classes (e.g., `.homepage__pleased__...`, `.sidebar__text__box`). These need Emotion equivalents when migrating.

## Data Flow
- Redux state slices: `points`, `categories`, `navigation`. Actions mutate Firebase-backed data (`startAddPoint`, etc.).
- Local state tracks selected project, category order, open categories, and map-related toggles.
- Utility functions: heavy use of `isEqual`, manual JSON clone (`JSON.parse(JSON.stringify(...))`).

## Migration Considerations
1. **Segmentation**: split Home page into hooks for data (Redux selectors thunks), map rendering, sidebar UI, and project modals.
2. **Mapping Layer**: wrap the ArcGIS logic (`MapViewTest`) in a dedicated hook/component pair, gradually moving off the monolithic HOC approach.
3. **Sidebar UI**: convert to functional component with typed props and Emotion styling; extract repeated strings (Hebrew/English) to i18n.
4. **Category Management**: evaluate if inline category editing is required in the modernized UI; potentially move to a backoffice screen.
5. **Cleanup**: once migrated, delete `_HomePage.scss` and unused map/test files; ensure navigation routes only reference the new TypeScript modules.

## Current Directives (Oct 2025)
- `HomePage.tsx` must be rewritten as a functional React component that relies on Emotion for styles; keep each resulting file/component under ~100 lines where feasible.
- Break the legacy class implementation into smaller reusable pieces (map, sidebar, project details, toolbar, etc.) instead of one monolith.
- Legacy newsletter widgets (`HomePageIntouch`, `HomePageIntouchForm`) are deprecated—do not migrate or recreate them. Delete residual files/styles if they resurface.
- Continue purging `_HomePage.scss` selectors as pieces are migrated to Emotion so the stylesheet can be removed entirely at the end.
- Progress snapshot: controller logic now lives in `useHomePageController`, backoffice modals/toolbar/components sit under `src/containers/homepage/`, and the sidebar (now a functional hook-based component) plus layout panels are composed via Emotion. Continue migrating any remaining `_HomePage.scss` selectors into these components until the stylesheet can be removed entirely.

# Contact & Home Styling Notes

## Contact Page Assets
- The SCSS entry `src/styles/components/contact/_index.scss` (and its `_page.scss`, `_strip.scss`) still drive layout for `ContactStrip`, `ContactFollow`, etc.
- When migrating contact components to Emotion, remove the `@import './components/contact/index';` line from `styles.scss` and delete the SCSS folder.
- `ContactPage` itself has been simplified to just render `ContactStrip` and `Footer`; once the contact components are in Emotion, the container can be reworked much like `AboutPage`.

## Home Page
- The `HomePage` container still references legacy mapping UI (MapViewTest, PointTest, etc.) and depends on `_HomePage.scss` for structure.
- Removed components such as HomePageCarousel/HomePagePleased/HomePageIntouch can be ignored going forward; clean up any residual CSS selectors when the homepage is migrated to Emotion.
- Navigation/header/footer already share the new layout primitives; Home is the major remaining class-based page after this cleanup.

## Next Steps
1. Convert `ContactStrip`, `ContactFollow`, and `ContactContact` to functional TypeScript components with Emotion styles.
2. Extract shared layout tokens (spacing, typography) when porting the contact and home pages to keep styling consistent.
3. Contact migration complete—SCSS imports removed. Next, focus moves to Home page (`_HomePage.scss`).

---
## Home Page Migration Checklist
- `HomePage.js` imports legacy map helpers (`MapViewTest`, `PointTest`, etc.) and SCSS selectors from `_HomePage.scss`.
- Supporting containers still in use: `SideBar.js`, `ProjectDetailsPage.js`, `MapViewTest.js`; determine which legacy helpers (e.g., mapping tests) can be archived after confirming no routes rely on them.
- Map rendering runs through ArcGIS (esri-loader) in `MapViewTest.js`; assess effort to wrap it in hooks/components or replace with modern map lib.
- Redux actions required: `startAddPoint`, `startEditProject`, category mutations; ensure TypeScript definitions exist before migrating.
- Styling: `_HomePage.scss` controls sidebar, social, modal layout; translate to Emotion and inline tokens similar to About/Contact.
- After migration, prune unused imports (e.g., `AutosizeInput`, `Modal` replacements) and remove `_HomePage.scss`.

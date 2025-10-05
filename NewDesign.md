# Homepage Redesign Plan

## Discovery & Requirements (0.5–1 day)
- Audit current homepage/backoffice flows and catalog data sources (projects, categories, metrics, copy, assets).
- Confirm bilingual requirements, mobile breakpoints, and any analytics/SEO implications.

### Discovery Notes – 2025-10-05
- **Data sources:** homepage pulls `categories`, `points`, and `tableTemplate` directly from Firebase (`categories`, `points`, `tableTemplate` refs) via the Redux slices (`src/store/slices/categoriesSlice.ts`, `src/store/slices/pointsSlice.ts`, `src/store/slices/tableTemplateSlice.ts`). Each point carries `extendedContent` (HTML, image, table options) that drives the map markers and project detail drawer. Category visibility/order edits are persisted through the same Firebase paths.
- **Backoffice flows:** authenticated users get the `HomePageToolbar` + modals (`CategoryManagerModal`, `NewCategoryModal`) that call `startAddCategory`, `startEditCategories`, and `startToggleShowCategory`; project editing uses `startEditProject` and the Cloudinary upload widget (see `HomeProjectPanel` / `HomePageToolbar`). Any redesign must keep these hooks or provide equivalent admin surfaces.
- **Current layout behavior:** mobile breakpoint logic is a mix of hard-coded values (e.g., 768 px checks in `useHomePageController` and legacy SCSS) and MUI defaults (`theme.breakpoints.down('md')`). Viewport-specific logic (map/sidebar stacking, toolbar positioning) currently assumes 768 px as the primary switch.
- **Localization:** the site supports English and Hebrew via i18next (`src/i18n/i18n.js`) with per-field bilingual content for projects (`title`, `titleHebrew`, `extendedContent`). UI strings live in translation files; RTL layout toggles through the `i18n.language` checks across containers.
- **SEO/analytics:** the homepage sets the `<title>` through `react-helmet-async` based on the SEO state exposed by `useHomePageController`, but there are no built-in analytics hooks (no GA/gtag code present). The redesign can extend Helmet usage for meta/OG tags without migrating tracking scripts.
- **Assets:** hero/gallery assets and category colors are pulled from Firebase + Cloudinary. Existing palette lives in `theme.app.categoryPalette` and is re-derived inside `useHomePageController`; redesigning the map/legend will need to reconcile with those stored color assignments.

## Design System Alignment (1–1.5 days)
- Extend theme tokens with the new palette, typography scale, and spacing.
- Create primitives for portrait avatar framing, pill selectors, stat cards, and the dark metric band.
- Define asset specs (portrait, world map background, icons) for both English and Hebrew locales.

### Design System Notes – 2025-10-05
- **Palette alignment:**
  - Primary text/navigation: deep navy (`#0A1F33`) with 90% white background (`#F5F7FA`).
  - Accent/CTA (active pill, stat band): midnight blue (`#0B2744`), needs 4.5:1 contrast against white and light grey.
  - Neutral surfaces: light grey background (`#E7EDF3`) for pill hover, subtle divider at `#D8DEE6`.
  - Map markers should reuse category palette but audit values for consistency with new legend (may require light/dark variants).
- **Typography scale:**
  - Display headline ≈ 3.5rem/56px with 1.1 line-height, medium weight.
  - Subheading ≈ 1.5rem/24px regular.
  - Body copy / pill labels ≈ 1rem/16px medium; stat numerals ≈ 2.5rem/40px bold, captions ≈ 1rem.
  - Plan to extend `theme.app.typography` with `displayLg`, `displayMd`, and `statNumber` tokens plus shared letter-spacing.
- **Spacing rhythm:**
  - Hero vertical padding ≈ 6rem top and 4rem bottom; horizontal gutters ≈ 6vw (min 3rem).
  - Pill group spacing 0.75rem; stat cards grid gap 3rem.
  - Add spacing aliases (`xxl = 4rem`, `3xl = 6rem`) to `theme.app.spacing` for consistent layout.
- **Component primitives:**
  - `AvatarFrame`: circular 160px container with soft shadow/border; supports fallback initials.
  - `FilterPill` + `FilterDropdown`: pill supports selected/hover states and anchors an accessible dropdown list.
  - `StatCard`: handles number + label, variants for light/dark backgrounds.
  - `ImpactBand`: full-width dark section with three-column grid, responsive collapse under 768px.
- **Assets:**
  - Portrait image: 320×320px PNG/WebP with transparent background; provide Hebrew mirror if directional changes needed.
  - World map background: vector SVG (2400×1200) with neutral tint (#E3EBF2) and separate marker icons.
  - Metric icons (optional): 48×48px monochrome to match stat band.
  - Category icons (if any) need both 1× and 2× assets for retina.
- **Deliverables:** Update `src/styles/theme.ts` with new tokens, add storybook-style playground (or Chromatic screenshots) for the primitives, and note RTL variations before implementation begins.

#### Implementation Tasks
- [x] Extend `src/styles/theme.ts` with the updated color palette, typography scale, and spacing aliases.
- [x] Mirror new tokens in `ThemeOverrides`/`GlobalStyles` so legacy CSS variables stay in sync.
- [x] Build `AvatarFrame`, `FilterPill`, `FilterDropdown`, `StatCard`, and `ImpactBand` primitives that consume the tokens.
- [x] Capture usage guidelines/RTL notes alongside the components (docs or Storybook stories).

## Navigation Strip (0.5 day)
- Rebuild the top header with the simplified text menu and ensure sticky/scroll behavior matches expectations.
- Verify language switching and routing integrations continue to work.

### Navigation Notes – 2025-10-05
- **Target layout:** brand block (portrait + name) left-aligned, horizontal links on the right (`Research`, `Teaching`, `Publications`, `Contact`). Language toggle must remain available (icon or `HE/EN` pill) without overpowering the menu.
- **Behavior:** header height ~80px, sits on the light background, no shadow until scroll (optional subtle shadow after 24px). Mobile breakpoint collapses into a simple menu button that opens the dropdown list (reuse filter dropdown focus management).
- **Implementation:** navigation now applies a soft elevation once the page scrolls beyond ~24px while keeping the sticky header height consistent across breakpoints.
- **Existing constraints:** current `Navigation.tsx` mixes MUI AppBar/Toolbar with legacy CSS variables and dual toolbars for mobile/desktop. It also mutates `--toolbar-height` for layout spacing and manages i18n routing. We need to keep language switching + alias handling but simplify the rendering logic.
- **Design tokens:** use new navy palette (`colors.text.primary`, `colors.accent.primary`) and typography variants (`displayMd` for brand, `body` medium for links). Spacing should rely on `spacing.lg`/`spacing.xl` for padding.
- **Accessibility:** links require focus-visible states and underline on hover; language toggle should announce current language. Mobile menu must trap focus when open.

#### Implementation Tasks
- [x] Replace the MUI AppBar stack with a custom `NewNavigation` wrapper using Emotion + design tokens.
- [x] Preserve i18n routing (`langLink`, `langLinkEng`) and active-route highlighting with React Router.
- [x] Implement responsive behavior: horizontal menu ≥768 px, slide-down drawer <768 px with focus management.
- [ ] Add optional shadow/condensed state on scroll (design approval pending).

## Hero Section (1.5 days)
- Implement responsive layout with portrait, headline, subheading, and category summary.
- Surface copy/imagery through backoffice controls, including localization support and fallbacks.

### Hero Notes – 2025-10-05
- **Component scaffold:** `HomeHero.tsx` renders the portrait, headline/subheading, pill bar + dropdown, world map placeholder, and feeds metrics into `ImpactBand` for the dark strip.
- **Data mapping:** headline/subheading/labels come from i18n translations (`src/translations.js`); categories map from the Redux `categories` slice (respecting visibility for unauthenticated users); markers are plotted from the `points` slice using their lat/lon + category colors. Hero metrics still rely on translation defaults (future work: replace with live stats/backoffice config).
- **Homepage config:** optional hero data (portrait URL + metrics array) can flow through the `homepage` slice (`hero` field); when present it overrides the translation defaults so backoffice edits can wire in future.
- **Admin tooling:** toolbar now exposes a "Hero content" modal for authenticated users—Cloudinary upload for the portrait plus EN/HE value + label inputs for each metric. Changes persist via `startEditHomePage` and feed the hero immediately.
- **Project list:** a new "Featured Projects" grid renders beneath the hero, showing live Firebase points filtered by the selected category. Cards surface localized titles, category labels, trimmed descriptions, and reuse the new map markers for selection state.
- **Detail view:** when an unauthenticated visitor selects a card or marker, we show a summary panel with localized text while editors retain the legacy sidebar/ArcGIS tooling (only rendered for authenticated users).
- **Interactions:** selecting a pill or dropdown option drives `setOpenCategories` so the legacy sidebar/map react to the same state; “All” resets to no open category. Dropdown appears when more than five categories exist.
- **Pending items:** integrate real portrait asset (Cloudinary/backoffice hook), replace map placeholder with the finalized SVG + markers, and connect metrics to dynamic data.

#### Implementation Tasks
- [x] Build `HomeHero` component using design tokens and new primitives.
- [x] Wire hero translations (headline, subheading, labels, metrics) for EN/HE.
- [x] Hook hero filters into existing category state (`setOpenCategories`).
- [x] Replace placeholder map background with production asset + marker rendering.
- [x] Source portrait image via backoffice/Cloudinary (fallback initials in place).

## Filter Bar With Dropdown (1.5 days)
- Replace the legacy sidebar with the horizontal pill selector.
- Add an anchored dropdown that opens on click/enter to list the full category tree; sync selection state with Redux filters.
- Ensure keyboard focus states, RTL layout, and mobile interactions match accessibility guidelines.

## Map Presentation (2 days)
- Design and integrate the new world map canvas (static asset or interactive layer).
- Position map markers based on existing data, add hover/click states, and provide graceful mobile fallbacks.

### Map Notes – 2025-10-05
- New static SVG canvas renders in both the hero and main map panel; markers derive from live point coordinates and respect the active category filter.
- Authenticated users still fall back to the legacy ArcGIS map when "Add project" is enabled so existing editing flows continue to work.
- TODO: replace the fallback with a design-aligned editor experience or document the dual-mode behaviour.

## Impact Metrics Band (1 day)
- Build the “Global Cities / Themes / Comparative Insights” statistics strip.
- Wire metrics to live data or create configuration hooks; validate RTL rendering.

## Responsive & Accessibility Polish (1–1.5 days)
- Tune layouts across breakpoints, verify color contrast, semantics, and keyboard navigation.
- Update unit/UI tests and bilingual snapshots as needed.

## Backoffice & Content Ops (1 day)
- Extend admin tooling for new hero copy, portrait upload, metrics, and category ordering.
- Document workflows for content editors.

### Notes
- Homepage slice now supports a `hero` object (`portraitUrl`, `portraitPublicId`, `metrics[]`) and the admin toolbar modal can update them (Cloudinary upload + EN/HE label/value inputs).
- Hero portrait saves now clean up the previous Cloudinary asset whenever editors replace or remove the image.
- Follow-up: document the new workflow for editors and audit older portraits for manual cleanup if needed.
- Front-end Cloudinary widgets now read the account name and preset from environment variables instead of hard-coded IDs.
- App bootstrap now hydrates the homepage slice from Firebase so hero portrait + metrics persist across reloads.
- Body styles clamp horizontal overflow to prevent the new hero layout from introducing a sideways scroll bar on large screens.
- Navigation bar now respects language directionality: brand + menu align right-to-left in Hebrew while the language toggle anchors to the opposite edge without exceeding the viewport width.
- Removed the legacy header spacer; layout now relies on natural flow without the extra 64px gap.
- Hero section top padding reduced to `2rem` so content sits closer to the header while keeping the redesigned spacing rhythm intact.

## QA, Regression & Launch (1 day)
- Run full test suite, cross-browser QA, and gather stakeholder feedback.
- Prepare rollout checklist (analytics tags, performance baseline, deployment steps).

**Total Estimate:** ~10.5–12.5 engineering days (≈2–2.5 calendar weeks with reviews).

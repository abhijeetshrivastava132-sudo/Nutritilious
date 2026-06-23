# Changelog

## 2026-06-24

### Changed

- Refactored the app from a single large `index.html` into modular files.
- Added `src/css/base.css` for global styles.
- Added `src/css/components.css` for header, search, veg toggle, inner header, and bottom nav.
- Added `src/css/pages.css` for home, meal cards, empty states, subscription, and know-more page styles.
- Added `src/data/app-data.js` for categories, filters, and meal/provider mock data.
- Added `src/js/app.js` for rendering and page navigation behavior.

### Added

- `docs/ARCHITECTURE.md`
- `docs/DESIGN_RULES.md`
- `docs/TASKS.md`

### Notes

- The app remains static and renderable through `index.html`.
- Future development should be done feature-wise instead of growing one huge file.

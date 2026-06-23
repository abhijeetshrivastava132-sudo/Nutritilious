# Nutritilious Architecture

Nutritilious is now structured for feature-wise development instead of one huge `index.html` file.

## Current structure

```txt
Nutritilious/
  index.html
  src/
    css/
      base.css
      components.css
      pages.css
    data/
      app-data.js
    js/
      app.js
  docs/
    ARCHITECTURE.md
    DESIGN_RULES.md
    TASKS.md
    CHANGELOG.md
```

## File responsibility

### `index.html`
Page structure only. Keep it clean. Do not add large CSS or JS here.

### `src/css/base.css`
Global reset, CSS variables, body/app layout, reusable section layout.

### `src/css/components.css`
Header, location selector, search bar, veg toggle, inner header, bottom navigation.

### `src/css/pages.css`
Home page sections, category grid, offer cards, meal cards, empty pages, subscription page, know-more page.

### `src/data/app-data.js`
Temporary frontend data for categories, meals, and filters. Later this can be replaced by backend/API data.

### `src/js/app.js`
Rendering logic and page navigation behavior.

## Development rule

Do not grow one file endlessly. For every new feature, either edit the relevant module or create a new module.

Recommended max file size:

```txt
HTML: 250 lines
CSS module: 500 lines
JS module: 400 lines
Data file: 300 lines
```

## Future split plan

When app grows, split further:

```txt
src/css/
  base.css
  components.css
  home.css
  subscription.css
  cart.css
  track.css

src/js/
  app.js
  router.js
  render-home.js
  subscription.js
  cart.js
  track.js

src/data/
  categories.js
  meals.js
  subscriptions.js
  providers.js
```

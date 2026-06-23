# Nutritilious

Nutritilious is a location-based homemade food and tiffin service web app concept. It helps users discover nearby home cooks and tiffin providers based on rating, distance, price, menu, food photos, and delivery timing.

## Current status

This is a static frontend prototype. The codebase has been modularized so it can be developed for the next 2 months without turning into one huge file.

## Project structure

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

## How to run

Open `index.html` directly in a browser or deploy the repo on GitHub Pages/Vercel/Netlify.

## Main product idea

Users can:

- Search homemade food or tiffin services near their location.
- Compare providers by rating, price, distance, and timing.
- View daily menus and food photos.
- Choose regular tiffin/subscription plans in future.

## Development rule

Do not add large inline CSS or JavaScript inside `index.html`.

Use:

- `src/css/` for styles
- `src/js/` for behavior
- `src/data/` for temporary frontend data
- `docs/TASKS.md` for planned work

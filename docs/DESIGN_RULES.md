# Nutritilious Design Rules

Use this file as the fixed UI rulebook for future work.

## Brand direction

- Mobile-first web app.
- Clean food-delivery style UI inspired by Zomato/Swiggy/Blinkit patterns.
- Deep red/dark red header.
- White search box on dark header.
- Rounded cards and soft shadows.
- No horizontal scroll bugs.

## Header rules

- Location button should stay compact.
- Example location: `Lajpat Nagar Metro Station`.
- Sub-location: `Lajpat Nagar, Ring Road, New Delhi`.
- Search placeholder: `Search, order and enjoy`.
- Profile icon should have enough spacing from location text.

## Home rules

- Do not add the old top toggle/buttons: Food, Tiffin, Cooks, Request.
- Keep categories simple and visual.
- Category grid should stay 3x2 unless intentionally changed.
- Keep `Menu of the Day` as the main meal-list heading.

## Bottom navigation

Use exactly these primary tabs unless the product direction changes:

```txt
Home
Cart
Track
Subscription
```

Subscription is the place for tiffin/subscription flow.

## Interaction rules

- Veg toggle ON = green.
- Veg toggle OFF = red.
- Interested heart should be blank by default and filled after click.
- Back buttons should return to the previous logical page.

## Code rules

- No huge inline CSS in `index.html`.
- No huge inline JS in `index.html`.
- Keep reusable styles in `components.css`.
- Keep page-specific styles in `pages.css`.
- Keep frontend data in `src/data/`.
- Before adding a feature, check `TASKS.md`.

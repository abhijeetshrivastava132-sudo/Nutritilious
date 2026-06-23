# Nutritilious Task Tracker

Use this file to avoid random changes and keep development clean.

## Current status

- [x] Create modular project structure
- [x] Move CSS into `src/css/`
- [x] Move JS into `src/js/`
- [x] Move frontend data into `src/data/`
- [x] Add architecture and design docs
- [x] Add location selector step 1
  - [x] Header location click opens selector sheet
  - [x] Browser current-location permission flow
  - [x] Manual location input
  - [x] Save selected location in localStorage
  - [x] Update header location title/subtitle
- [x] Add reverse geocoding for detected GPS location
  - [x] Convert latitude/longitude into readable area/address
  - [x] Save readable address in localStorage
  - [x] Fallback to GPS coordinates if address lookup fails

## Next priority tasks

1. **Home UI polish**
   - Improve meal cards.
   - Add better food images.
   - Improve filters.

2. **Location system**
   - Add nearby provider filtering using latitude/longitude.
   - Add delivery radius and unavailable-area UI.
   - Add production-safe geocoding backend/API key later.

3. **Provider detail page**
   - Show menu by day and time.
   - Show food photos.
   - Show price and delivery timing.
   - Add rating and reviews.

4. **Cart flow**
   - Add item to cart.
   - Quantity controls.
   - Price summary.
   - Checkout CTA.

5. **Subscription flow**
   - Weekly/monthly tiffin plans.
   - Lunch/dinner selection.
   - Veg/non-veg preference.
   - Interested users list placeholder.

6. **Track order flow**
   - Order status UI.
   - Preparing, picked up, delivered states.
   - Future real-time location integration.

## Working rule

One task = one small change.

Before requesting a change, say the target feature clearly, for example:

```txt
Update subscription interested button only.
```

or

```txt
Add provider detail page.
```

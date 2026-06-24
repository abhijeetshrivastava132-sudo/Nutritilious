# Auth Decision

Nutritilious will use Firebase Authentication for the MVP login system.

## Selected flow

- Phone OTP login as the primary flow.
- Google login as the fast secondary flow.
- Anonymous guest login for browsing and low-friction testing.

## Not selected right now

- Password login, because forgot-password flow adds friction.
- Email link login, because the current app direction is phone-first like food delivery apps.

## Product note

Phone OTP improves trust for orders, but it sends real SMS and may cost money. During testing, prefer Google login or Guest mode when phone verification is not necessary.

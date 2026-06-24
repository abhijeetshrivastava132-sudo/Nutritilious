# Firebase Auth Setup for Nutritilious

This project uses Firebase Authentication without SMS OTP cost.

## Enabled login methods

- Email Link sign-in
- Anonymous sign-in for guest mode

## Firebase Console setup

1. Create a Firebase project.
2. Add a Web app in Project settings.
3. Copy the Web app config.
4. Paste the values into `src/js/firebase-config.js`.
5. Go to Authentication > Sign-in method.
6. Enable Email/Password.
7. Enable Email link (passwordless sign-in).
8. Enable Anonymous sign-in.
9. Go to Authentication > Settings > Authorized domains.
10. Add your deployed domain, for example:
   - `localhost`
   - your Netlify domain
   - your custom domain

## Why this flow

- No SMS OTP charge.
- No password to remember.
- No forgot-password flow.
- Guest users can browse/order quickly.

## Production note

For real orders, collect phone number during checkout and verify manually at first. Add paid SMS/WhatsApp verification only after real daily order volume starts.

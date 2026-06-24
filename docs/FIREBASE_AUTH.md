# Firebase Auth Setup for Nutritilious

This project uses Firebase Authentication for the MVP login page.

## Enabled login methods

- Phone OTP sign-in
- Google sign-in
- Anonymous sign-in for guest mode

## Firebase Console setup

1. Open Firebase Console.
2. Select the `nutrilicious-82877` project.
3. Go to Authentication > Sign-in method.
4. Enable Phone.
5. Enable Google.
6. Enable Anonymous.
7. Go to Authentication > Settings > Authorized domains.
8. Add your deployed domain, for example:
   - `localhost`
   - your Netlify domain
   - your custom domain

## App config

The Firebase Web App config is stored in:

```txt
src/js/firebase-config.js
```

The config is public by design. Security depends on Firebase Authentication provider settings, authorized domains, and database/security rules.

## Login UI

The login page is mounted by `src/js/app.js` and supports:

1. Phone number OTP login with invisible reCAPTCHA.
2. Google sign-in.
3. Guest mode using Firebase Anonymous Auth.

## Cost note

Phone OTP sends real SMS and can cost money depending on Firebase billing/pricing. Use Google and Guest mode for low-cost testing when possible.

# Auth Decision

For the MVP, Nutritilious will use Firebase Authentication without SMS OTP.

## Selected flow

- Email Link sign-in
- Anonymous guest login

## Not selected right now

- Firebase Phone OTP, because SMS cost is high for MVP usage.
- Password login, because forgot-password flow adds friction.
- Google-only login, because users may not prefer provider lock-in.

## Future

When real paid orders increase, add phone collection at checkout first. Add SMS/WhatsApp phone verification only after enough order volume justifies the cost.

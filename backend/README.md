# Backend setup

## 1) Install and run

- `npm install`
- `npm run dev`

## 2) Configure env

Copy `.env.example` to `.env` and fill all required values.

For WhatsApp OTP, these variables are mandatory:

- `WHATSAPP_ACCESS_TOKEN`
- `WHATSAPP_PHONE_NUMBER_ID`
- `WHATSAPP_TEMPLATE_NAME`
- `WHATSAPP_TEMPLATE_LANGUAGE` (default `fr`)

## 3) WhatsApp Cloud API requirements

- Your Meta app must be connected to a WhatsApp Business Account.
- The app should be in **Live** mode for real users.
- In development mode, only test recipients added in Meta can receive messages.
- The template in `WHATSAPP_TEMPLATE_NAME` must be approved and contain one body variable (the OTP code).
- Send numbers in international format without `+` (example: `261341234567`).

## 4) Behavior in local dev

If WhatsApp env vars are missing or message send fails in local mode, API returns a fallback `devCode` for testing.

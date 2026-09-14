# Contact form → EmailJS

The form sends straight from the browser with the EmailJS SDK (`@emailjs/browser`).
There is no API route or server code, so the site can be hosted anywhere — even as static files.

## 1. Email service

EmailJS → **Email Services** → `service_z8nx3vd` must be connected (e.g. your Gmail).

## 2. Template `template_is1k7ai`

EmailJS → **Email Templates** → open `template_is1k7ai` and set:

| Field      | Value                                                              |
| ---------- | ------------------------------------------------------------------ |
| Subject    | `New {{engagement}} enquiry from {{from_name}}`                    |
| To Email   | `kareemazam60@gmail.com`                                           |
| From Name  | `{{from_name}} (portfolio)`                                        |
| Reply To   | `{{reply_to}}`                                                     |
| Content    | **Edit Content → Code editor** → paste `docs/emailjs-template.html` |

- Keep **To Email** a fixed address, never a variable — then the form can only ever email you.
- Use `{{double braces}}` only. They HTML-escape the value; `{{{triple braces}}}` insert raw HTML and would let someone inject markup.

Variables the form sends:

| Variable      | Example                                              |
| ------------- | ---------------------------------------------------- |
| `from_name`   | Sara Ahmed                                           |
| `reply_to`    | sara@example.com                                     |
| `engagement`  | Freelance project / Full-time role / General enquiry |
| `scope`       | Web app, RTL / i18n (or "Not specified")             |
| `timeline`    | This quarter (or "Not specified")                    |
| `message`     | The visitor's message (line breaks kept)             |
| `received_at` | 14 Sept 2026, 17:40 (Cairo)                          |
| `site`        | your-domain.com                                      |

## 3. Public key → `.env`

EmailJS → Account → **General** → *Public Key* → `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`.

The public key is meant to be public: with it, someone can only send this template to your
fixed To Email. **Don't** put the private key in the site.

## 4. Security settings (Account → Security)

- Keep **Allow API for non-browser applications** **off** — scripts and servers then can't use your key; only real browsers can.
- Keep any "require private key" option **off** — the browser can't hold the private key, so sending would fail.
- Optional, strongest bot protection: turn on **reCAPTCHA v2** for the template. The form then needs a reCAPTCHA widget — ask for it to be added if spam gets through.

## 5. Run and deploy

- Restart `npm run dev` after editing `.env` (`NEXT_PUBLIC_` values are baked in when the app builds).
- On your host (e.g. Vercel → Project → Settings → Environment Variables) add the three
  `NEXT_PUBLIC_EMAILJS_*` variables, then redeploy. `.env` is git-ignored and never uploaded.

## What stops spam

| Layer             | What it does                                                                         |
| ----------------- | ------------------------------------------------------------------------------------ |
| Honeypot          | A hidden "website" field. Bots fill it; they see "Message sent" and nothing is sent. |
| Time trap         | Submits faster than 3 s after the page loads are treated as bots the same way.       |
| Headless blocking | The SDK's `blockHeadless` refuses automated (headless) browsers.                     |
| Rate limit        | The SDK's `limitRate` allows one message per browser per minute.                     |
| Validation        | Name, email, message length, max 3 links, no control characters; chips must match the allowed options. |
| Browser-only API  | With "non-browser applications" off, EmailJS rejects curl, bots and servers.         |
| Escaping          | Every value is HTML-escaped by EmailJS `{{ }}` — no script can run in the email.     |
| Fixed recipient   | The To Email lives in the template, so the form can't be used to email anyone else.  |

These checks run in the visitor's browser, so a determined attacker driving a real browser can
still get through — the worst case is spam in your own inbox. If that happens, enable reCAPTCHA (step 4).

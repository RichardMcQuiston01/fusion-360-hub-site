# Contact form

The Contact Us page (`src/pages/contact.astro`) posts to `public/api/contact.php`,
a small PHP script that emails the message through SendGrid. The site is static,
so this script and the settings file are the only server-side parts.

## One-time setup on Hostinger

The deploy uploads `api/contact.php` with the rest of the site. The settings file
holds the SendGrid key, so it is **never in git and never uploaded by the deploy**.
Create it once by hand:

1. In SendGrid, create an API key with **Mail Send** permission only, and verify
   the sender (a Single Sender address, or authenticate the `hiredhandhq.com`
   domain).
2. In Hostinger's **File Manager**, open the `fusion360` folder (the one that
   holds `index.html` and `api/`).
3. Create `contact-config.php` there, with the contents of
   `server/contact-config.example.php`, and fill in `sendgrid_api_key`, `from`
   and `to`.
4. Open the site, send a test message from `/contact/`, and check the inbox.

The deploy never overwrites or deletes this file (it only manages files it
uploaded). `public/.htaccess` also blocks the file from being requested
directly. Use File Manager, not FTP, to edit it: the FTP connection is not
encrypted.

## Delivery options

Set `delivery` in `contact-config.php`:

| Value      | Behaviour                                                  |
| ---------- | ---------------------------------------------------------- |
| `sendgrid` | SendGrid v3 API (needs `sendgrid_api_key`). Recommended.   |
| `mail`     | PHP `mail()`. No key, but more likely to land in spam.     |
| `log`      | Writes the message to the PHP error log. For testing only. |

## What the script checks

- POST only; the `Origin` header, when sent, must match the site's host.
- Subject must be one of the three choices; a valid reply email and a message are
  required; field lengths are capped.
- A hidden `website` field catches bots (they get a fake success).
- At most 5 messages per connection per hour (stored in a temp file).
- Line breaks are stripped from anything used in a header.
- The visitor's email is set as `Reply-To`; the `from` address is always the one
  in the settings file.

Failures are logged with `error_log`, with a descriptive reason, and the visitor
sees a short message pointing to the email address.

## Local testing

`bun run dev` does not run PHP. Build, copy `dist/` somewhere, add a
`contact-config.php` with `'delivery' => 'log'`, and run `php -S 127.0.0.1:8123`
in that folder.

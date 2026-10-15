# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project

Static hub site for the Fusion 360 add-ins, built with Astro and Tailwind CSS.
Each add-in's page is generated from `src/data/addins.ts`. The add-ins
themselves live in `RichardMcQuiston01/fusion-360-generator`. The site is served
from `https://fusion360.hiredhandhq.com`, with each add-in at `/<slug>` (for
example `/living-hinge`). Those URLs are in the add-ins' `bundle.json` files and
store listings, so do not change a slug without updating them.

## Development workflow

Follow the `git-workflow` skill (`.claude/skills/git-workflow/SKILL.md`):
feature branches off `dev`, PRs into `dev`, and `dev` → `main` by PR only when
a stage is done and tested. Use Conventional Commits.

## Commands

Package manager is Bun.

- `bun install` installs dependencies.
- `bun run dev` starts the dev server.
- `bun run build` type-checks (`astro check`) and builds to `dist/`.
- `bun run format:check` checks formatting with Prettier.

## Deployment

`.github/workflows/deploy.yml` builds the site and uploads `dist/` to the
`fusion360` folder on Hostinger over plain FTP whenever `main` changes (or when run by
hand from the Actions tab). It uses the repository secrets `FTP_SERVER`,
`FTP_PORT`, `FTP_USERNAME`, `FTP_PASS` and `FTP_FOLDER_PATH`. Never commit
credentials, and never deploy from a branch other than `main`. The server does
not support FTPS, so the connection is unencrypted; the FTP account is limited
to the `fusion360` folder to keep that acceptable.

The Contact Us form posts to `public/api/contact.php` (PHP, so it runs only on
the server; `bun run dev` does not run it). Its SendGrid key lives in
`contact-config.php` in the server's site folder, created by hand and never
committed or deployed. See `docs/contact-form.md`.

## Design and accessibility

- Colours and fonts come from `BRANDING.md` and are theme variables in
  `src/styles/global.css`. Use the tokens (`bg-paper`, `text-ink`, `text-muted`,
  `text-accent`, `border-border`, `border-control`), not raw colours.
- The site targets WCAG 2.2 level AA. Text needs 4.5:1 contrast and UI parts 3:1;
  input borders use `border-control`, not `border-border`. Keep a visible focus
  outline, underline links in text, give every control a label, keep targets at
  least 24 by 24 px, and respect reduced motion.
- The catalog view comes from the NPM package
  `@richardmcquiston01/custom-catalog-component` (repo
  `RichardMcQuiston01/catalog-component`). `src/components/Catalog.astro` renders
  it, and `src/styles/global.css` imports its stylesheet and maps its `--cc-*`
  variables to the site's tokens. Fix catalog behaviour in the package, not here,
  then bump the version.
- Check changes with axe-core and keyboard testing before merging, and test at
  320 px width.

## Content rules

- Free add-ins must be described as free with no limitations.
- Leave `storeUrl` as `null` until the add-in is published on the Autodesk App
  Store.
- Do not state support for macOS or Linux. The add-ins are Windows only.

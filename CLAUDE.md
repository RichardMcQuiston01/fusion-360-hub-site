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

## Content rules

- Free add-ins must be described as free with no limitations.
- Leave `storeUrl` as `null` until the add-in is published on the Autodesk App
  Store.
- Do not state support for macOS or Linux. The add-ins are Windows only.

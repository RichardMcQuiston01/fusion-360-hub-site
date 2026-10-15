# CHANGELOG

## Unreleased

- The hub page always uses the two-column layout (search, sort and filters on the
  left, results on the right on wide screens), even with few add-ins, by passing
  `sidebarMinItems={0}` to the catalog.
- Contact Us now sends a real message: the form posts to `public/api/contact.php`,
  which emails it through SendGrid (see `docs/contact-form.md`). The form gained
  Your Name and Your Email fields so we can reply.
- Renamed Support to Contact Us (`/contact/`, with `/support/` redirecting). It
  has a form that builds a `mailto:` link; Select Product shows for Product
  Support. The Accessibility page links to it.
- Added the Astro and Tailwind site: a hub page, a page for Living Hinge and
  Kerf Test, and support and privacy pages.
- Added the "Workshop" colour palette and fonts (Barlow Semi Condensed, Inter,
  self-hosted), with design tokens in `src/styles/global.css`.
- Added a reusable catalog view (`src/components/catalog`): search, filters,
  sorting, and a Grid / Carousel / List switch, with its state in the URL.
- Accessibility pass toward WCAG 2.2 AA: skip link, landmarks, labelled form
  controls, live result counts, visible focus, underlined links, reduced motion,
  and an Accessibility page.
- The catalog view now comes from the NPM package
  `@richardmcquiston01/custom-catalog-component` (0.1.0) instead of in-repo
  code. Names with numbers now sort naturally ("Gear 2" before "Gear 10").

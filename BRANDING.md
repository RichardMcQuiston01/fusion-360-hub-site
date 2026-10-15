# Branding

Working brand guide for the Fusion 360 Generators site and its add-ins. The
site name is a working title; update it here if the name changes.

Nothing in this file is applied to the site yet unless it says so. The layout
work will adopt the colours and fonts below.

## Principles

- **Workshop, not software.** Warm, tactile and practical, like a maker's bench.
- **Readable first.** Every text colour pair meets WCAG 2.2 AA (4.5:1 for text,
  3:1 for graphics and UI parts). The numbers below were measured, not guessed.
- **One source of truth.** Colours are defined once as theme variables (see
  "Design tokens") so a dark mode can be added without redoing the design.

## Colour palette

### Core colours

| Name       | Role                              | Hex       | RGB           |
| ---------- | --------------------------------- | --------- | ------------- |
| Paper      | Page background                   | `#FAF7F2` | 250, 247, 242 |
| White      | Cards and surfaces                | `#FFFFFF` | 255, 255, 255 |
| Walnut     | Main text (ink)                   | `#2B2622` | 43, 38, 34    |
| Driftwood  | Secondary text                    | `#5C534B` | 92, 83, 75    |
| Kiln       | Accent: links, buttons, headings  | `#A8400C` | 168, 64, 12   |
| Ember tint | Soft accent background for badges | `#FBE8DB` | 251, 232, 219 |

### Supporting colours

| Name           | Role                                    | Hex       | RGB           |
| -------------- | --------------------------------------- | --------- | ------------- |
| Sandstone      | Decorative borders and dividers         | `#D9CFC3` | 217, 207, 195 |
| Control border | Borders of inputs and checkboxes (3:1+) | `#857A6E` | 133, 122, 110 |
| Focus blue     | Keyboard focus ring                     | `#1D4ED8` | 29, 78, 216   |
| Free text      | "Free" badge text                       | `#14532D` | 20, 83, 45    |
| Free tint      | "Free" badge background                 | `#DCFCE7` | 220, 252, 231 |

### Graphic accent (logo and illustration only)

| Name  | Role                                        | Hex       | RGB         |
| ----- | ------------------------------------------- | --------- | ----------- |
| Ember | Bright "laser" accent for marks and artwork | `#E8590C` | 232, 89, 12 |

Ember is bright enough for graphics but **not for text**: it is 3.35:1 on Paper
and 3.58:1 on white, below the 4.5:1 text minimum. Use Kiln for text and links.

### Measured contrast

| Pair                    | Ratio   | Use                          |
| ----------------------- | ------- | ---------------------------- |
| Walnut on Paper         | 14.01:1 | Body text                    |
| Driftwood on Paper      | 7.03:1  | Secondary text               |
| Kiln on Paper           | 5.77:1  | Links, headings (text)       |
| Kiln on White           | 6.17:1  | Links on cards (text)        |
| White on Kiln           | 6.17:1  | Button text                  |
| Walnut on Ember tint    | 12.59:1 | Badge text                   |
| Kiln on Ember tint      | 5.19:1  | Accent badge text            |
| Free text on Free tint  | 8.30:1  | "Free" badge                 |
| Control border on Paper | 3.93:1  | Input borders (needs 3:1)    |
| Focus blue on Paper     | 6.27:1  | Focus ring (needs 3:1)       |
| Ember on Walnut         | 4.18:1  | Logo mark on dark            |
| Ember on Paper          | 3.35:1  | Logo mark on light (graphic) |
| Kiln on Walnut          | 2.43:1  | **Do not use** (fails)       |

## Logo palette

Use these for the logo and the Autodesk App Store icon. Keep it to **two colours
plus a background**.

| Version            | Mark                               | Background       | Notes                            |
| ------------------ | ---------------------------------- | ---------------- | -------------------------------- |
| Primary (light)    | Kiln `#A8400C`                     | Paper            | Default. 5.77:1                  |
| Accent mark        | Ember `#E8590C` + Walnut `#2B2622` | Paper            | Ember for the "cut" detail only  |
| Reversed (dark)    | Ember `#E8590C`                    | Walnut `#2B2622` | 4.18:1. Never use Kiln on Walnut |
| One colour (dark)  | Walnut `#2B2622`                   | White or Paper   | For stamps, engraving and print  |
| One colour (light) | White `#FFFFFF`                    | Walnut or Kiln   | For use on dark photos or fills  |

Give a logo designer or generator: Kiln `#A8400C`, Ember `#E8590C`, Walnut
`#2B2622`, Paper `#FAF7F2`.

### Logo ideas

The product is about turning settings into cut-ready geometry, so draw from the
tools themselves:

- **Kerf lattice:** the staggered slit pattern of a living hinge, simplified to a
  few rows of short dashes.
- **Gear or tab:** a single gear tooth or a jigsaw knob as a simple shape.
- **Cut line:** a dashed outline, with one Ember segment as the laser path.

Aim for a mark that stays readable at 16 px (browser tab) and at 512 px (store
icon), and works in one colour. Check Autodesk's current App Store requirements
for icon size and format before exporting.

### Logo rules

- Leave clear space around the logo equal to the height of its tallest letter.
- Do not use the Autodesk or Fusion logos, or imply Autodesk made or endorses
  the add-ins. The site footer already says it is not affiliated.
- Do not recolour outside the table above, add shadows, or stretch it.

## Typography

All three families are open source (SIL Open Font License) and free to use.

| Use             | Font                  | Weights       | Fallback stack                            |
| --------------- | --------------------- | ------------- | ----------------------------------------- |
| Headings        | Barlow Semi Condensed | 600, 700      | `system-ui, sans-serif`                   |
| Body and UI     | Inter                 | 400, 500, 600 | `system-ui, sans-serif`                   |
| Code and values | JetBrains Mono        | 400           | `ui-monospace, SFMono-Regular, monospace` |

- **Self-host the fonts** (for example the `@fontsource` packages) instead of
  loading them from a font CDN. The privacy page promises no third-party
  tracking, and a CDN request would tell the font provider about every visitor.
- Body text at least 16 px, line height about 1.5, and line length around 65
  characters. Do not set body text in the condensed heading font.

## Design tokens

Planned theme variables for Tailwind v4 (`src/styles/global.css`):

```css
@theme {
  --color-paper: #faf7f2;
  --color-surface: #ffffff;
  --color-ink: #2b2622;
  --color-muted: #5c534b;
  --color-accent: #a8400c;
  --color-accent-tint: #fbe8db;
  --color-border: #d9cfc3;
  --color-control: #857a6e;
  --color-focus: #1d4ed8;
  --color-free: #14532d;
  --color-free-tint: #dcfce7;
}
```

## Dark mode (planned)

A dark mode and a toggle are planned, not built. These starting values were
checked against WCAG AA:

| Token          | Hex       | Check                 |
| -------------- | --------- | --------------------- |
| Background     | `#1A1613` |                       |
| Surface        | `#241F1B` |                       |
| Ink            | `#F4EFE8` | 15.72:1 on background |
| Muted          | `#B8AEA3` | 8.24:1 on background  |
| Accent         | `#FF8A57` | 7.73:1 on background  |
| Button text    | `#1A0F08` | 8.09:1 on accent      |
| Control border | `#8C8174` | 4.71:1 on background  |
| Focus          | `#7DD3FC` | 10.78:1 on background |

The toggle should default to the visitor's system setting
(`prefers-color-scheme`), remember an explicit choice, and be keyboard
accessible.

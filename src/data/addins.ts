export type AddinPricing = 'free' | 'paid';

export type GroupSlug =
  | 'laser-cutting'
  | 'text-and-signs'
  | 'games-and-puzzles'
  | 'holidays'
  | 'home-and-garden'
  | 'organization'
  | 'electronics'
  | 'jewelry-and-accessories'
  | 'calibration';

export interface AddinGroup {
  slug: GroupSlug;
  name: string;
  description: string;
}

/**
 * Display order of the groups on the home page. A group with no add-ins is not
 * shown, so groups can be defined here before anything is assigned to them.
 */
export const groups: AddinGroup[] = [
  {
    slug: 'laser-cutting',
    name: 'Laser cutting',
    description: 'Patterns and parts that are ready to cut.',
  },
  {
    slug: 'text-and-signs',
    name: 'Text and signs',
    description: 'Lettering, stencils and signs.',
  },
  {
    slug: 'games-and-puzzles',
    name: 'Games and puzzles',
    description: 'Puzzles, game pieces and things to play with.',
  },
  {
    slug: 'holidays',
    name: 'Holidays',
    description: 'Ornaments, decorations and seasonal pieces.',
  },
  {
    slug: 'home-and-garden',
    name: 'Home and garden',
    description: 'Decor, plant markers and things for around the house.',
  },
  {
    slug: 'organization',
    name: 'Organization',
    description: 'Trays, dividers and organizers.',
  },
  {
    slug: 'electronics',
    name: 'Electronics',
    description: 'Stands, enclosures and mounts for devices.',
  },
  {
    slug: 'jewelry-and-accessories',
    name: 'Jewelry and accessories',
    description: 'Earrings, tags, keychains and wearables.',
  },
  {
    slug: 'calibration',
    name: 'Calibration and testing',
    description: 'Gauges for dialling in your machine and material.',
  },
];

export interface Addin {
  slug: string;
  name: string;
  group: GroupSlug;
  /** Date the add-in was added to this site (YYYY-MM-DD). */
  addedOn: string;
  tagline: string;
  description: string;
  pricing: AddinPricing;
  /** Autodesk App Store page. null until the listing is published. */
  storeUrl: string | null;
  features: string[];
  howToUse: string[];
  tips: string[];
}

export const addins: Addin[] = [
  {
    slug: 'living-hinge',
    name: 'Living Hinge',
    group: 'laser-cutting',
    addedOn: '2026-10-14',
    tagline: 'Draw a living-hinge (kerf-bend) slit pattern as a Fusion sketch.',
    description:
      'A living hinge lets rigid sheet material such as plywood, MDF or acrylic bend along one direction. The cuts are a staggered lattice of short slits. Living Hinge draws that lattice for you as a sketch on the XY plane, ready to laser cut.',
    pricing: 'free',
    storeUrl: null,
    features: [
      'Set the panel size, slit direction, slit length, bridge and line spacing',
      'Vertical slits let the panel roll left to right',
      'Optional panel border',
      'Optional DXF export, never overwriting an existing file',
      'Works offline, with no account',
    ],
    howToUse: [
      'Open Utilities, then Scripts and Add-Ins, and run Living Hinge.',
      'Set the panel size and the slit settings.',
      'Click OK. A Living Hinge sketch is added on the XY plane.',
      'Leave Save DXF after drawing ticked to also save a DXF for your laser software.',
    ],
    tips: [
      'Test your settings on scrap first. The right slit length and bridge depend on your material and its thickness.',
      'The bridge is the uncut link between slits in a line. It sets how strong the hinge is.',
    ],
  },
  {
    slug: 'kerf-test',
    name: 'Kerf Test',
    group: 'calibration',
    addedOn: '2026-10-14',
    tagline: 'Draw laser kerf test gauges so your joints and slots fit.',
    description:
      'Kerf is the width of material your laser removes. Kerf Test draws two gauges that let you measure it: a slot gauge and a kerf comb. Each is drawn as a cut sketch and an engrave sketch, so you can run them as separate laser layers.',
    pricing: 'free',
    storeUrl: null,
    features: [
      'Slot gauge: a plate of slots that step in width, each labelled with its width',
      'Kerf comb: a frame filled with equal bars, with the formula engraved on it',
      'Separate cut and engrave sketches for each gauge',
      'Optional DXF export, never overwriting an existing file',
      'Works offline, with no account',
    ],
    howToUse: [
      'Open Utilities, then Scripts and Add-Ins, and run Kerf Test.',
      'Choose the Slot gauge or the Kerf comb and set its sizes.',
      'Click OK. The cut and engrave sketches are added.',
      'Cut the gauge in the material you plan to use.',
    ],
    tips: [
      'Slot gauge: test-fit a piece of known thickness. The slot that fits snugly is the width to design for.',
      'Kerf comb: push the bars to one side and measure the gap. Kerf = gap / (bars + 1).',
    ],
  },
  {
    slug: 'stencil-text',
    name: 'Stencil Text',
    group: 'text-and-signs',
    addedOn: '2026-10-18',
    tagline: 'Turn text into a stencil plate, with the bridges already in.',
    description:
      'Letters with an enclosed centre, such as the middle of an O, A or B, would fall out of a stencil. Stencil Text ties each centre back to the plate with a bridge, a strip of plate left across the letter. You get the text and plate as sketches, and a stencil body with the letters cut through it.',
    pricing: 'paid',
    storeUrl: null,
    features: [
      'Type your text, one line per row, and set its size',
      'Bridges across every enclosed letter centre, with a width you choose',
      'Choose the bridge direction, plate margin, corner radius and thickness',
      'Adds a Stencil text sketch, a Stencil plate sketch and a Stencil body',
      'Optional DXF of the cut lines, never overwriting an existing file',
    ],
    howToUse: [
      'Open Utilities, then Scripts and Add-Ins, and run Stencil Text.',
      'Type your text and set the size, bridge width and direction, plate margin, corner radius and thickness.',
      'Click OK. The sketches and the Stencil body are added.',
      'Leave Save DXF after drawing ticked to also save the cut lines for your laser or cutter.',
    ],
    tips: [
      'Wider bridges make a stronger stencil but cover more of each letter. Try a few widths on scrap.',
      'Values outside the allowed limits are adjusted to the nearest limit.',
      'Fusion sets the font, line spacing and letter spacing, through its sketch text tool.',
    ],
  },
  {
    slug: 'jigsaw-puzzle',
    name: 'Jigsaw Puzzle',
    group: 'games-and-puzzles',
    addedOn: '2026-10-18',
    tagline: 'Draw a rectangular jigsaw puzzle with interlocking tabs.',
    description:
      'Jigsaw Puzzle draws a flat rectangular puzzle as a sketch: an outer cut border plus every interior piece edge. Each interior edge carries a round knob tab that is narrower at the neck than at the bulb, so neighbouring pieces lock together.',
    pricing: 'paid',
    storeUrl: null,
    features: [
      'Set the overall size and the pieces across and down, from 2 to 40 each way',
      'Choose the tab size',
      'A seed picks which way each tab points, so the same seed gives the same puzzle',
      'Knobs are true circular arcs, for a smooth cut',
      'Optional DXF, never overwriting an existing file',
    ],
    howToUse: [
      'Open Utilities, then Scripts and Add-Ins, and run Jigsaw Puzzle.',
      'Set the overall size, the pieces across and down, the tab size and a seed.',
      'Click OK. A Jigsaw puzzle sketch is added on the XY plane.',
      'Leave Save DXF after drawing ticked to also save a DXF for your laser software.',
    ],
    tips: [
      'Keep the seed to get the same puzzle again. Change it for a different tab layout.',
      'The tab size is a fraction of the smaller piece side, from 0.08 to 0.3. It is also limited so a knob never reaches the next grid line.',
      'The puzzle is a flat sketch. For 3D pieces, extrude the piece profiles in Fusion.',
    ],
  },
];

export function getAddin(slug: string): Addin | undefined {
  return addins.find((addin) => addin.slug === slug);
}

export function getGroup(slug: GroupSlug): AddinGroup {
  const group = groups.find((candidate) => candidate.slug === slug);
  if (!group) {
    throw new Error(`Unknown add-in group "${slug}" in src/data/addins.ts.`);
  }
  return group;
}

/** The groups that have at least one add-in, each with its add-ins. */
export function getGroupedAddins(): { group: AddinGroup; addins: Addin[] }[] {
  return groups
    .map((group) => ({
      group,
      addins: addins.filter((addin) => addin.group === group.slug),
    }))
    .filter((entry) => entry.addins.length > 0);
}

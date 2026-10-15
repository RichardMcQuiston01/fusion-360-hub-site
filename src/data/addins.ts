export type AddinPricing = 'free' | 'paid';

export interface Addin {
  slug: string;
  name: string;
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
];

export function getAddin(slug: string): Addin | undefined {
  return addins.find((addin) => addin.slug === slug);
}

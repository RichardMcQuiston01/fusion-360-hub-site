/**
 * Types and helpers for the reusable catalog view (src/components/catalog).
 * The catalog knows nothing about add-ins: give it items, groups and facets.
 */

export type CatalogViewName = 'grid' | 'carousel' | 'list';

export const CATALOG_VIEWS: { value: CatalogViewName; label: string }[] = [
  { value: 'grid', label: 'Grid' },
  { value: 'carousel', label: 'Carousel' },
  { value: 'list', label: 'List' },
];

export interface CatalogGroup {
  slug: string;
  name: string;
  description: string;
}

export interface CatalogFacetOption {
  value: string;
  label: string;
}

/** A filter such as price. Each item gives one value per facet key. */
export interface CatalogFacet {
  key: string;
  label: string;
  options: CatalogFacetOption[];
}

export interface CatalogItem {
  id: string;
  title: string;
  summary: string;
  href: string;
  /** Slug of the group this item belongs to. */
  group: string;
  /** Short label shown on the card, for example "Free". */
  badge: string;
  /** One value per facet key, for example { price: 'free' }. */
  facets: Record<string, string>;
  /** Everything a search should match, in any case. */
  searchText: string;
  /** ISO date (YYYY-MM-DD) used by the "Newest first" sort. */
  addedOn: string;
}

export const CATALOG_SORTS: { value: string; label: string }[] = [
  { value: 'name', label: 'Name (A to Z)' },
  { value: 'name-desc', label: 'Name (Z to A)' },
  { value: 'newest', label: 'Newest first' },
];

/** The groups that have at least one item, in the order given. */
export function groupCatalogItems(
  groups: CatalogGroup[],
  items: CatalogItem[]
): { group: CatalogGroup; items: CatalogItem[] }[] {
  return groups
    .map((group) => ({
      group,
      items: items.filter((item) => item.group === group.slug),
    }))
    .filter((entry) => entry.items.length > 0);
}

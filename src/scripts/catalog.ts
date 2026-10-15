/**
 * Behaviour for the catalog view (src/components/catalog/CatalogView.astro).
 *
 * Everything is rendered in the HTML, so the page works and can be indexed
 * without JavaScript. This script adds searching, filtering, sorting, the
 * Grid / Carousel / List switch and the carousel arrows. The state lives in
 * the URL (?q=hinge&price=free&view=list) so a view can be shared and the back
 * button works.
 */

type ViewName = 'grid' | 'carousel' | 'list';

const VIEWS: readonly ViewName[] = ['grid', 'carousel', 'list'];
const DEFAULT_SORT = 'name';
const VIEW_STORAGE_KEY = 'catalog-view';
const WIDE_SCREEN_QUERY = '(min-width: 64rem)';

interface CatalogState {
  query: string;
  filters: Map<string, Set<string>>;
  sort: string;
  view: ViewName;
}

function isViewName(value: string | null): value is ViewName {
  return value !== null && (VIEWS as readonly string[]).includes(value);
}

function readStoredView(): ViewName | null {
  try {
    const stored = window.localStorage.getItem(VIEW_STORAGE_KEY);
    return isViewName(stored) ? stored : null;
  } catch {
    // Storage can be blocked (private windows, site settings). That is fine.
    return null;
  }
}

function storeView(view: ViewName): void {
  try {
    window.localStorage.setItem(VIEW_STORAGE_KEY, view);
  } catch {
    // Not remembering the choice is harmless.
  }
}

function compareItems(sort: string, a: HTMLElement, b: HTMLElement): number {
  const titleA = a.dataset.title ?? '';
  const titleB = b.dataset.title ?? '';
  const byTitle = titleA.localeCompare(titleB, undefined, {
    sensitivity: 'base',
  });
  if (sort === 'name-desc') {
    return -byTitle;
  }
  if (sort === 'newest') {
    const addedA = a.dataset.added ?? '';
    const addedB = b.dataset.added ?? '';
    return addedA === addedB ? byTitle : addedA < addedB ? 1 : -1;
  }
  return byTitle;
}

function initCatalog(root: HTMLElement): void {
  const form = root.querySelector<HTMLFormElement>('[data-catalog-form]');
  const searchInput = root.querySelector<HTMLInputElement>(
    '[data-catalog-search]'
  );
  const sortSelect = root.querySelector<HTMLSelectElement>(
    '[data-catalog-sort]'
  );
  const facetInputs = Array.from(
    root.querySelectorAll<HTMLInputElement>('[data-catalog-facet]')
  );
  const viewInputs = Array.from(
    root.querySelectorAll<HTMLInputElement>('[data-catalog-view]')
  );
  const clearButton = root.querySelector<HTMLButtonElement>(
    '[data-catalog-clear]'
  );
  const status = root.querySelector<HTMLElement>('[data-catalog-status]');
  const emptyMessage = root.querySelector<HTMLElement>('[data-catalog-empty]');
  const facetsPanel = root.querySelector<HTMLElement>('[data-catalog-facets]');
  const toggleButton = root.querySelector<HTMLButtonElement>(
    '[data-catalog-filters-toggle]'
  );
  const toggleLabel = root.querySelector<HTMLElement>(
    '[data-catalog-filters-toggle-label]'
  );
  const groupSections = Array.from(
    root.querySelectorAll<HTMLElement>('[data-catalog-group]')
  );

  if (!form || !searchInput || !sortSelect) {
    console.error(
      'Catalog: the filter form is missing its search box or sort control, so filtering is off.'
    );
    return;
  }

  const defaultView: ViewName = isViewName(root.dataset.defaultView ?? null)
    ? (root.dataset.defaultView as ViewName)
    : 'carousel';
  const nounSingular = root.dataset.nounSingular ?? 'item';
  const nounPlural = root.dataset.nounPlural ?? 'items';
  const filtersCollapsible = root.dataset.layout === 'toolbar';
  const wideScreen = window.matchMedia(WIDE_SCREEN_QUERY);
  let filtersExpanded = false;

  const facetKeys = Array.from(
    new Set(facetInputs.map((input) => input.dataset.catalogFacet ?? ''))
  ).filter((key) => key !== '');

  // ----- State <-> inputs <-> URL -----

  function readInputs(): CatalogState {
    const filters = new Map<string, Set<string>>();
    for (const key of facetKeys) {
      filters.set(
        key,
        new Set(
          facetInputs
            .filter(
              (input) => input.dataset.catalogFacet === key && input.checked
            )
            .map((input) => input.value)
        )
      );
    }
    const checkedView =
      viewInputs.find((input) => input.checked)?.value ?? null;
    return {
      query: searchInput!.value.trim().toLowerCase(),
      filters,
      sort: sortSelect!.value,
      view: isViewName(checkedView) ? checkedView : defaultView,
    };
  }

  function writeInputs(params: URLSearchParams): void {
    searchInput!.value = params.get('q') ?? '';
    const sort = params.get('sort');
    sortSelect!.value = Array.from(sortSelect!.options).some(
      (option) => option.value === sort
    )
      ? (sort as string)
      : DEFAULT_SORT;
    for (const key of facetKeys) {
      const selected = new Set(
        (params.get(key) ?? '').split(',').filter(Boolean)
      );
      for (const input of facetInputs) {
        if (input.dataset.catalogFacet === key) {
          input.checked = selected.has(input.value);
        }
      }
    }
    const urlView = params.get('view');
    const view = isViewName(urlView)
      ? urlView
      : (readStoredView() ?? defaultView);
    for (const input of viewInputs) {
      input.checked = input.value === view;
    }
  }

  function writeUrl(state: CatalogState): void {
    const params = new URLSearchParams();
    if (state.query) {
      params.set('q', searchInput!.value.trim());
    }
    for (const [key, values] of state.filters) {
      if (values.size > 0) {
        params.set(key, Array.from(values).join(','));
      }
    }
    if (state.sort !== DEFAULT_SORT) {
      params.set('sort', state.sort);
    }
    if (state.view !== defaultView) {
      params.set('view', state.view);
    }
    const query = params.toString();
    const url = `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`;
    window.history.replaceState(null, '', url);
  }

  // ----- Applying the state to the page -----

  function matches(item: HTMLElement, state: CatalogState): boolean {
    const text = item.dataset.search ?? '';
    const termsMatch = state.query
      .split(/\s+/)
      .filter(Boolean)
      .every((term) => text.includes(term));
    if (!termsMatch) {
      return false;
    }
    for (const [key, values] of state.filters) {
      if (values.size === 0) {
        continue;
      }
      const itemValue = item.getAttribute(`data-facet-${key}`) ?? '';
      if (!values.has(itemValue)) {
        return false;
      }
    }
    return true;
  }

  function applyItems(state: CatalogState): number {
    let visibleTotal = 0;
    for (const section of groupSections) {
      const list = section.querySelector<HTMLElement>('[data-catalog-list]');
      if (!list) {
        continue;
      }
      const items = Array.from(
        list.querySelectorAll<HTMLElement>('[data-catalog-item]')
      );
      items.sort((a, b) => compareItems(state.sort, a, b));
      let visibleInSection = 0;
      for (const item of items) {
        const show = matches(item, state);
        item.hidden = !show;
        if (show) {
          visibleInSection += 1;
        }
        list.appendChild(item);
      }
      section.hidden = visibleInSection === 0;
      visibleTotal += visibleInSection;
    }
    return visibleTotal;
  }

  function updateStatus(visibleTotal: number): void {
    if (status) {
      const noun = visibleTotal === 1 ? nounSingular : nounPlural;
      status.textContent =
        visibleTotal === 0
          ? `No ${nounPlural} shown`
          : `${visibleTotal} ${noun} shown`;
    }
    if (emptyMessage) {
      emptyMessage.hidden = visibleTotal !== 0;
    }
  }

  function updateCarousels(): void {
    for (const section of groupSections) {
      const list = section.querySelector<HTMLElement>('[data-catalog-list]');
      const controls = section.querySelector<HTMLElement>(
        '[data-carousel-controls]'
      );
      const prev = section.querySelector<HTMLButtonElement>(
        '[data-carousel-prev]'
      );
      const next = section.querySelector<HTMLButtonElement>(
        '[data-carousel-next]'
      );
      if (!list || !controls || !prev || !next) {
        continue;
      }
      const overflows =
        root.dataset.view === 'carousel' &&
        list.scrollWidth > list.clientWidth + 1;
      controls.classList.toggle('hidden', !overflows);
      controls.classList.toggle('flex', overflows);
      prev.disabled = list.scrollLeft <= 0;
      next.disabled =
        list.scrollLeft + list.clientWidth >= list.scrollWidth - 1;
    }
  }

  function apply(options: { updateUrl: boolean }): void {
    const state = readInputs();
    root.dataset.view = state.view;
    updateStatus(applyItems(state));
    updateCarousels();
    if (options.updateUrl) {
      writeUrl(state);
    }
  }

  // ----- Collapsible facet filters (narrow screens and the toolbar layout) -----

  function updateFiltersPanel(): void {
    if (!facetsPanel || !toggleButton || !toggleLabel) {
      return;
    }
    const collapsible = filtersCollapsible || !wideScreen.matches;
    toggleButton.classList.toggle('hidden', !collapsible);
    toggleButton.classList.toggle('inline-flex', collapsible);
    facetsPanel.hidden = collapsible && !filtersExpanded;
    toggleButton.setAttribute('aria-expanded', String(!facetsPanel.hidden));
    toggleLabel.textContent = filtersExpanded ? 'Hide filters' : 'Show filters';
  }

  toggleButton?.addEventListener('click', () => {
    filtersExpanded = !filtersExpanded;
    updateFiltersPanel();
  });
  wideScreen.addEventListener('change', updateFiltersPanel);

  // ----- Carousel arrows -----

  for (const section of groupSections) {
    const list = section.querySelector<HTMLElement>('[data-catalog-list]');
    const prev = section.querySelector<HTMLButtonElement>(
      '[data-carousel-prev]'
    );
    const next = section.querySelector<HTMLButtonElement>(
      '[data-carousel-next]'
    );
    if (!list || !prev || !next) {
      continue;
    }
    const scrollByPage = (direction: 1 | -1): void => {
      const reduceMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;
      list.scrollBy({
        left: direction * list.clientWidth * 0.9,
        behavior: reduceMotion ? 'auto' : 'smooth',
      });
    };
    prev.addEventListener('click', () => scrollByPage(-1));
    next.addEventListener('click', () => scrollByPage(1));
    list.addEventListener('scroll', updateCarousels, { passive: true });
    new ResizeObserver(updateCarousels).observe(list);
  }

  // ----- Wiring -----

  form.addEventListener('submit', (event) => {
    event.preventDefault();
  });
  form.addEventListener('input', () => apply({ updateUrl: true }));
  form.addEventListener('change', () => apply({ updateUrl: true }));

  for (const input of viewInputs) {
    input.addEventListener('change', () => {
      if (input.checked && isViewName(input.value)) {
        storeView(input.value);
      }
      apply({ updateUrl: true });
    });
  }

  clearButton?.addEventListener('click', () => {
    writeInputs(new URLSearchParams());
    apply({ updateUrl: true });
    searchInput.focus();
  });

  window.addEventListener('popstate', () => {
    writeInputs(new URLSearchParams(window.location.search));
    apply({ updateUrl: false });
  });

  // ----- Start -----

  const initial = new URLSearchParams(window.location.search);
  writeInputs(initial);
  filtersExpanded = facetKeys.some((key) => initial.has(key));
  updateFiltersPanel();
  apply({ updateUrl: false });
}

document
  .querySelectorAll<HTMLElement>('[data-catalog]')
  .forEach((root) => initCatalog(root));

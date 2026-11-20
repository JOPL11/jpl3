// No imports on purpose: this file is safe to import from anywhere
// (Modal, RailNav, page) without creating circular dependencies.

// Order here = order on the rail.
export const SECTIONS = [
  { id: 'overview',   label: 'Overview' },
  { id: 'about',      label: 'About' },
  { id: 'services',   label: 'Services' },
  { id: 'contact',    label: 'Contact' },
];

// id -> () => <Content />, filled in by page.js
const modalFactories = {};

export function registerModalSections(map) {
  Object.assign(modalFactories, map);
}

export function getModalFactory(id) {
  return modalFactories[id] || null;
}

// Normalise ids coming from different places ('Playground', 'code', ...)
export function normalizeSectionId(id) {
  if (!id) return null;
  const s = String(id).toLowerCase();
  return s === 'code' ? 'react' : s;
}

// Modals whose rail navigates their OWN content instead of the global sections.
// `selector` matches the elements (inside the modal scroller) that get a tick.
// Add an entry to turn it on for another modal, e.g.  motion: { selector: '...' }
export const CONTENT_RAILS = {
  playground: { selector: '[class*="projectCard"]' },
  react:      { selector: '[class*="projectCard"]' },
  motion:     { selector: '[class*="projectCard"]' },
  product: false,
};


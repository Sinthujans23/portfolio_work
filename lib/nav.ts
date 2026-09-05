import { runViewTransition } from "./view-transition";

/**
 * Section navigation for the header, the mobile sheet and the command
 * palette. One helper so the three can't drift apart.
 *
 * The scroll itself is instant — `globals.css` sets `scroll-behavior: smooth`
 * on <html> and `scrollIntoView` inherits that unless a behaviour is named,
 * so `"instant"` is doing real work. The movement between sections is then
 * covered by a View Transition, which cross-fades the before and after, so
 * arriving reads as a page change rather than a jump cut.
 *
 * It also writes the hash, which `preventDefault` on the anchor otherwise
 * suppresses — without it sections aren't linkable and Back does nothing.
 */
export function goToSection(href: string) {
  const el = document.querySelector(href);
  if (!el) return;

  runViewTransition("nav", () => {
    el.scrollIntoView({ behavior: "instant", block: "start" });
    // pushState rather than `location.hash`, which would trigger a second
    // scroll of its own on top of the one above.
    history.pushState(null, "", href);
  });
}

/** Home is the top of the page, not a section, so it clears the hash. */
export function goToTop() {
  runViewTransition("nav", () => {
    window.scrollTo({ top: 0, behavior: "instant" });
    history.pushState(null, "", window.location.pathname);
  });
}

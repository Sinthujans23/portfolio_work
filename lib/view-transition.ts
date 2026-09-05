type ViewTransitionKind = "nav" | "theme";

type ViewTransition = { finished: Promise<void> };
type StartViewTransition = (callback: () => void) => ViewTransition;

/**
 * Runs a DOM change inside a View Transition.
 *
 * Both the theme switch and section navigation animate
 * `::view-transition-*(root)`, and they want completely different things — a
 * circular reveal versus a cross-fade. There is only one root, so the kind is
 * stamped on <html> as `data-vt` and the CSS keys off that. It is cleared
 * when the transition finishes so neither animation leaks into the other.
 *
 * Falls back to applying the change directly where the API is missing
 * (Firefox, older Safari) or where the visitor has asked for reduced motion.
 */
export function runViewTransition(kind: ViewTransitionKind, apply: () => void) {
  const root = document.documentElement;
  const start = (document as Document & { startViewTransition?: StartViewTransition })
    .startViewTransition;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!start || reduced) {
    apply();
    return;
  }

  root.dataset.vt = kind;
  const transition = start.call(document, apply);
  transition.finished.finally(() => {
    delete root.dataset.vt;
  });
}

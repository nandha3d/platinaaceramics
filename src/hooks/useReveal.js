import { useEffect } from 'react';

/**
 * Adds `.is-in` to every `.reveal` inside `scopeRef` as it scrolls into view.
 *
 * `scrollRootRef` is the element that actually scrolls. Inside the modal that is
 * the dialog panel; on the standalone product page nothing scrolls but the
 * window, so it is omitted and the observer falls back to the viewport. Getting
 * this wrong matters: `.reveal-seq` children start at opacity 0, so any scope
 * that never receives `.is-in` renders permanently blank.
 *
 * If IntersectionObserver is missing the classes are applied immediately, so
 * content is never hidden by a failed or absent script.
 */
export function useReveal(scopeRef, deps = [], scrollRootRef = null) {
  useEffect(() => {
    const scope = scopeRef.current;
    if (!scope) return undefined;

    const targets = scope.querySelectorAll('.reveal');
    if (!targets.length) return undefined;

    if (typeof IntersectionObserver === 'undefined') {
      targets.forEach((t) => t.classList.add('is-in'));
      return undefined;
    }

    const root = scrollRootRef?.current ?? null;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
        });
      },
      { root, rootMargin: '0px 0px -6% 0px', threshold: 0.04 }
    );

    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

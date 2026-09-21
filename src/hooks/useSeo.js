import { useEffect } from 'react';
import { applySeo } from '../lib/seo';

/**
 * Applies route metadata on mount and restores it on unmount.
 *
 * The dependency list is the caller's responsibility because `jsonLd` is usually
 * a fresh object each render; passing it directly would re-run the effect every
 * time and thrash the head.
 */
export function useSeo(seo, deps = []) {
  useEffect(() => applySeo(seo), deps); // eslint-disable-line react-hooks/exhaustive-deps
}

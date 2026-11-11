'use client';

import { useEffect, useState } from 'react';

/**
 * Whether the element with `targetId` has scrolled up under the compact header, i.e. past the line
 * `--compact-header-height` below the top of the viewport. False while it is on screen below that
 * line or still below the fold.
 */
export const useHasScrolledPast = (targetId: string): boolean => {
  const [hasScrolledPast, setHasScrolledPast] = useState(false);

  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target) return;

    const barHeight = parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue('--compact-header-height')
    );
    const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);

    const observer = new IntersectionObserver(
      ([entry]) => {
        // The observed area starts just below where the bar sits. The target counts as passed once
        // it has left that area through its top edge, not while it is still below the fold.
        // Compare against the area's top, not the viewport's: the observer only fires as the
        // target crosses that edge, when it is still on screen.
        const areaTop = entry.rootBounds?.top ?? 0;
        setHasScrolledPast(!entry.isIntersecting && entry.boundingClientRect.top < areaTop);
      },
      { rootMargin: `-${barHeight * rootFontSize}px 0px 0px 0px` }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [targetId]);

  return hasScrolledPast;
};

import { afterNextRender, DestroyRef, ElementRef, inject } from '@angular/core';

type Gsap = typeof import('gsap').gsap;
type ScrollTriggerStatic = typeof import('gsap/ScrollTrigger').ScrollTrigger;

/** What a GSAP setup function receives. */
export interface GsapTools {
  gsap: Gsap;
  ScrollTrigger: ScrollTriggerStatic;
}

let tools: Promise<GsapTools> | undefined;

/** Loads GSAP and ScrollTrigger once, on demand, so they stay out of the initial bundle. */
export function loadGsap(): Promise<GsapTools> {
  tools ??= Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
    ([{ gsap }, { ScrollTrigger }]) => {
      gsap.registerPlugin(ScrollTrigger);
      return { gsap, ScrollTrigger };
    },
  );
  return tools;
}

/**
 * Runs GSAP animations for the current component. Call it in the constructor.
 *
 * - Runs only in the browser, after the first render (safe with SSR and hydration).
 * - Skipped entirely when the user prefers reduced motion, so content is shown as is.
 * - Selector strings (e.g. `'.card'`) only match elements inside this component.
 * - ScrollTriggers use the page's scroll container: in this app the window never scrolls.
 * - Every animation and ScrollTrigger is reverted when the component is destroyed.
 *
 * @example
 * injectGsap(({ gsap }) => {
 *   gsap.from('.card', { y: 40, opacity: 0, stagger: 0.15, scrollTrigger: { trigger: '.cards' } });
 * });
 */
export function injectGsap(setup: (tools: GsapTools) => void): void {
  const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  let matchMedia: ReturnType<Gsap['matchMedia']> | undefined;
  let destroyed = false;

  inject(DestroyRef).onDestroy(() => {
    destroyed = true;
    matchMedia?.revert();
  });

  afterNextRender(async () => {
    const gsapTools = await loadGsap();
    // The component may be gone while GSAP was loading
    if (destroyed) {
      return;
    }

    gsapTools.ScrollTrigger.defaults({ scroller: findScrollContainer(host) });
    matchMedia = gsapTools.gsap.matchMedia(host);
    matchMedia.add('(prefers-reduced-motion: no-preference)', () => setup(gsapTools));
  });
}

/** Nearest ancestor (or the element itself) that scrolls vertically; the window if none. */
function findScrollContainer(element: HTMLElement): HTMLElement | Window {
  for (let node: HTMLElement | null = element; node; node = node.parentElement) {
    const { overflowY } = getComputedStyle(node);
    if (overflowY === 'auto' || overflowY === 'scroll') {
      return node;
    }
  }
  return window;
}

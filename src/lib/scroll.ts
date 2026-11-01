import { useEffect, type RefObject } from "react";
import {
  cancelFrame,
  frame,
  useMotionValue,
  type MotionValue,
} from "framer-motion";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type ScrollListener = (y: number) => void;
type MeasureListener = () => void;

const scrollListeners = new Set<ScrollListener>();
const measureListeners = new Set<MeasureListener>();

let lenis: Lenis | null = null;

/** Subscribe to scroll position updates from the shared smooth-scroll loop. Returns an unsubscribe fn. */
export function subscribeScroll(fn: ScrollListener): () => void {
  scrollListeners.add(fn);
  return () => {
    scrollListeners.delete(fn);
  };
}

const currentY = () => window.scrollY || window.pageYOffset || 0;

function notifyScroll() {
  const y = currentY();
  scrollListeners.forEach((fn) => fn(y));
}

let measurePending = false;
function requestMeasure() {
  if (measurePending) return;
  measurePending = true;
  requestAnimationFrame(() => {
    measurePending = false;
    measureListeners.forEach((fn) => fn());
    ScrollTrigger.refresh();
  });
}

/** Starts smooth scrolling. Returns a cleanup function. Call once, from the persistent layout. */
export function startSmoothScroll(): () => void {
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const cleanups: Array<() => void> = [];

  // Anything that can change the page height or an element's position must re-measure.
  const ro = new ResizeObserver(requestMeasure);
  ro.observe(document.body);
  window.addEventListener("resize", requestMeasure);
  window.addEventListener("load", requestMeasure);
  void document.fonts?.ready.then(requestMeasure);
  cleanups.push(() => {
    ro.disconnect();
    window.removeEventListener("resize", requestMeasure);
    window.removeEventListener("load", requestMeasure);
  });

  if (reduceMotion) {
    // Native scrolling only; consumers still get notified.
    window.addEventListener("scroll", notifyScroll, { passive: true });
    cleanups.push(() => window.removeEventListener("scroll", notifyScroll));
    return () => cleanups.forEach((fn) => fn());
  }

  lenis = new Lenis({
    lerp: 0.1,
    smoothWheel: true,
    syncTouch: false,
    autoRaf: false, // we drive it ourselves below
    anchors: true, // in-page "#expertise" links glide instead of jumping
  });

  const onLenisScroll = () => {
    notifyScroll();
    ScrollTrigger.update();
  };
  lenis.on("scroll", onLenisScroll);

  const raf = (data: { timestamp: number }) => lenis?.raf(data.timestamp);
  frame.update(raf, true);

  const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 80);

  cleanups.push(() => {
    window.clearTimeout(refresh);
    cancelFrame(raf);
    lenis?.off("scroll", onLenisScroll);
    lenis?.destroy();
    lenis = null;
  });

  return () => cleanups.forEach((fn) => fn());
}

export function scrollToTopInstant() {
  if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  notifyScroll();
  ScrollTrigger.update();
}

export function scrollToElement(el: HTMLElement, immediate: boolean) {
  if (lenis) {
    lenis.scrollTo(el, { immediate, force: immediate });
  } else {
    el.scrollIntoView({ behavior: immediate ? "instant" : "smooth" });
  }
}

export function lockScroll() {
  lenis?.stop();
}
export function unlockScroll() {
  lenis?.start();
}

type Edge = "start" | "center" | "end" | number;
type Offset = readonly [`${string} ${string}`, `${string} ${string}`];

const edgeValue = (token: string): number => {
  const t = token as Edge;
  if (t === "start") return 0;
  if (t === "center") return 0.5;
  if (t === "end") return 1;
  const n = parseFloat(token);
  return Number.isFinite(n) ? n : 0;
};

export function useScrollProgress(
  target: RefObject<HTMLElement | null>,
  offset: Offset,
): MotionValue<number> {
  const progress = useMotionValue(0);
  const offsetKey = offset.join("|");

  useEffect(() => {
    const el = target.current;
    if (!el) return;

    const [a, b] = offset;
    const [startEl, startVp] = a.split(" ").map(edgeValue);
    const [endEl, endVp] = b.split(" ").map(edgeValue);

    let from = 0;
    let to = 1;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      const top = rect.top + currentY();
      const vh = window.innerHeight;
      from = top + startEl * rect.height - startVp * vh;
      to = top + endEl * rect.height - endVp * vh;
    };

    const update = (y: number) => {
      const span = to - from;
      const raw = span === 0 ? 0 : (y - from) / span;
      progress.set(raw < 0 ? 0 : raw > 1 ? 1 : raw);
    };

    const onMeasure = () => {
      measure();
      update(currentY());
    };

    onMeasure();
    scrollListeners.add(update);
    measureListeners.add(onMeasure);
    return () => {
      scrollListeners.delete(update);
      measureListeners.delete(onMeasure);
    };
  }, [target, progress, offsetKey]);

  return progress;
}

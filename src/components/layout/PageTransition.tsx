import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import gsap from "gsap";
import TransitionLogo from "./TransitionLogo";
import { lockScroll, unlockScroll } from "../../lib/scroll";

/**
 * Column page transition.
 *
 *   1. A click on any internal link is intercepted (capture phase, so every <Link>/<NavLink> on the
 *      site gets the transition without being edited).
 *   2. 20 columns sweep in from the left, the TarVance mark draws itself, then fades out.
 *   3. The router navigates while the screen is fully covered.
 *   4. Once the new page has painted, the columns sweep away to the right.
 *
 * The same reveal plays once on first load.
 */

const BLOCK_COUNT = 20;

// Tweak the feel here.
const COVER = { duration: 0.4, stagger: 0.02, ease: "power2.out" } as const;
const REVEAL = { duration: 0.4, stagger: 0.02, ease: "power2.out" } as const;
const LOGO_DRAW = 1.1; // seconds to trace the logo
const FALLBACK_REVEAL_MS = 2500; // safety net if a navigation never changes the location

export default function PageTransition() {
  const navigate = useNavigate();
  const location = useLocation();

  const overlayRef = useRef<HTMLDivElement>(null);
  const isTransitioning = useRef(false);
  const pendingTo = useRef<string | null>(null);
  const revealRef = useRef<() => void>(() => {});
  const navigateRef = useRef(navigate);

  useEffect(() => {
    navigateRef.current = navigate;
  }, [navigate]);

  // Mount once: build the timelines, intercept link clicks, play the intro reveal.
  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      overlay.style.display = "none";
      return;
    }

    let fallbackTimer = 0;
    let introTimer = 0;
    let disposed = false;

    const ctx = gsap.context(() => {
      const blocks = gsap.utils.toArray<HTMLElement>("[data-block]");
      const logoOverlay = overlay.querySelector<HTMLElement>(
        "[data-logo-overlay]",
      )!;
      const drawn = gsap.utils.toArray<SVGGeometryElement>("[data-draw]");
      const filled = gsap.utils.toArray<SVGElement>("[data-fill]");
      const texts = gsap.utils.toArray<HTMLElement>("[data-logo-text]");

      const prepareLogo = () => {
        drawn.forEach((el) => {
          const length = el.getTotalLength();
          gsap.set(el, { strokeDasharray: length, strokeDashoffset: length });
        });
        gsap.set(filled, { fillOpacity: 0 });
        gsap.set(texts, { opacity: 0, y: 8 });
      };

      const finish = () => {
        isTransitioning.current = false;
        pendingTo.current = null;
        overlay.style.pointerEvents = "none";
        window.clearTimeout(fallbackTimer);
        unlockScroll();
      };

      // Columns sweep away to the right, revealing the new page.
      const reveal = () => {
        gsap
          .timeline({ onComplete: finish })
          .set(blocks, { transformOrigin: "right center", scaleX: 1 })
          .to(blocks, { scaleX: 0, ...REVEAL });
      };
      revealRef.current = reveal;

      // Columns sweep in from the left, the logo draws, then we navigate.
      const cover = (to: string) => {
        isTransitioning.current = true;
        pendingTo.current = to;
        overlay.style.pointerEvents = "auto";
        lockScroll();
        prepareLogo();

        gsap
          .timeline({
            onComplete: () => {
              navigateRef.current(to);
              // If the router never produces a new location, don't leave the user staring at a wall.
              fallbackTimer = window.setTimeout(() => {
                if (pendingTo.current) reveal();
              }, FALLBACK_REVEAL_MS);
            },
          })
          .set(blocks, { transformOrigin: "left center" })
          .to(blocks, { scaleX: 1, ...COVER })
          .set(logoOverlay, { opacity: 1 }, "-=0.2")
          .to(
            drawn,
            {
              strokeDashoffset: 0,
              duration: LOGO_DRAW,
              ease: "power2.inOut",
              stagger: 0.1,
            },
            "-=0.15",
          )
          .to(
            filled,
            { fillOpacity: 1, duration: 0.35, ease: "power1.out" },
            "-=0.35",
          )
          .to(
            texts,
            { opacity: 1, y: 0, duration: 0.35, stagger: 0.06 },
            "-=0.3",
          )
          .to(
            logoOverlay,
            { opacity: 0, duration: 0.25, ease: "power2.out" },
            "+=0.15",
          );
      };

      const onClick = (event: MouseEvent) => {
        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        )
          return;

        const anchor = (event.target as Element | null)?.closest?.("a");
        if (!anchor) return;
        if (anchor.target && anchor.target !== "_self") return;
        if (anchor.hasAttribute("download")) return;

        const href = anchor.getAttribute("href");
        if (!href || !href.startsWith("/") || href.startsWith("//")) return;

        const url = new URL(anchor.href, window.location.href);
        if (url.origin !== window.location.origin) return;

        // Same page: let the router handle it normally, no transition.
        if (
          url.pathname === window.location.pathname &&
          url.search === window.location.search
        )
          return;

        // From here on, the transition owns this navigation. preventDefault makes React Router's
        // <Link> skip its own navigation (it still runs the link's onClick, e.g. closing the menu).
        event.preventDefault();
        if (isTransitioning.current) return;
        // The router adds the site's base path (e.g. /tarvance on GitHub Pages) by itself,
        // so hand it a path WITHOUT that prefix or it gets doubled (/tarvance/tarvance/about).
        const base = import.meta.env.BASE_URL.replace(/\/$/, "");
        let routerPath = url.pathname;
        if (
          base &&
          (routerPath === base || routerPath.startsWith(`${base}/`))
        ) {
          routerPath = routerPath.slice(base.length) || "/";
        }
        cover(routerPath + url.search + url.hash);
      };
      document.addEventListener("click", onClick, true);

      // Intro: the page starts covered (see CSS) and the columns sweep away once fonts are ready.
      isTransitioning.current = true;
      prepareLogo();
      gsap.set(blocks, { transformOrigin: "right center", scaleX: 1 });
      const fontsReady = document.fonts?.ready ?? Promise.resolve();
      Promise.race([
        fontsReady,
        new Promise((resolve) => {
          introTimer = window.setTimeout(resolve, 900);
        }),
      ]).then(() => {
        if (!disposed) reveal();
      });

      return () => document.removeEventListener("click", onClick, true);
    }, overlay);

    return () => {
      disposed = true;
      window.clearTimeout(fallbackTimer);
      window.clearTimeout(introTimer);
      ctx.revert();
      isTransitioning.current = false;
      pendingTo.current = null;
    };
  }, []);

  // A new location has rendered while the screen is covered: wait for it to paint, then reveal.
  useEffect(() => {
    if (!pendingTo.current) return;
    let second = 0;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => revealRef.current());
    });
    return () => {
      cancelAnimationFrame(first);
      cancelAnimationFrame(second);
    };
  }, [location.key]);

  return (
    // The page starts covered (the columns are simply there); GSAP sweeps them away once the page is ready.
    <div
      ref={overlayRef}
      className="pointer-events-none fixed inset-0 z-200 flex overflow-hidden motion-reduce:hidden"
      aria-hidden="true"
    >
      {Array.from({ length: BLOCK_COUNT }, (_, i) => (
        <div
          key={i}
          data-block
          className="-mr-px h-full flex-[0_0_calc(5%+1px)] origin-right bg-tar-navy will-change-transform"
        />
      ))}
      <div
        data-logo-overlay
        className="pointer-events-none absolute inset-0 flex items-center justify-center bg-tar-navy opacity-0"
      >
        <TransitionLogo />
      </div>
    </div>
  );
}

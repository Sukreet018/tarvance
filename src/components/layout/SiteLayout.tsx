import { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FloatingContact from "./FloatingContact";
import Navbar from "./Navbar";
import Footer from "./Footer";
import PageTransition from "./PageTransition";
import {
  scrollToElement,
  scrollToTopInstant,
  startSmoothScroll,
} from "../../lib/scroll";

export default function SiteLayout() {
  const { pathname, hash } = useLocation();
  const previousPath = useRef(pathname);

  
  useEffect(() => startSmoothScroll(), []);
  useEffect(() => {
    const pathChanged = previousPath.current !== pathname;
    previousPath.current = pathname;

    const target = hash
      ? document.getElementById(decodeURIComponent(hash.slice(1)))
      : null;

    if (pathChanged || !hash) scrollToTopInstant();
    if (target) scrollToElement(target, pathChanged);
    ScrollTrigger.refresh();
  }, [pathname, hash]);

  return (
    <div className="min-h-screen bg-tar-paper text-tar-ink">
      <PageTransition />
      <Navbar />
      <main>
        <Outlet />
        <FloatingContact />
      </main>
      <Footer />
    </div>
  );
}

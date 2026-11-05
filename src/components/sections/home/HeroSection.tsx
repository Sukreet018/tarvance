import { useRef } from "react";
import { motion, useTransform } from "framer-motion";

import { Link } from "react-router-dom";
import DigitalEarth from "../../visuals/DigitalEarth";
import { useScrollProgress } from "../../../lib/scroll";
import { button } from "../../ui/button";

export default function HeroSection() {
  const ref = useRef<HTMLElement>(null);

  const scrollYProgress = useScrollProgress(ref, ["start start", "end start"]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -140]);
  const earthY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <section
      ref={ref}
      id="home"
      className="relative isolate min-h-svh overflow-hidden bg-[#030916] text-tar-cream"
    >
      <motion.div
        aria-hidden
        style={{ y: earthY, opacity: fade }}
        className="absolute inset-y-0 right-0 w-full cursor-grab opacity-50 will-change-[transform,opacity] touch-pan-y lg:w-[70%] lg:opacity-100"
      >
        <DigitalEarth fade={fade} />
      </motion.div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-linear-to-tr from-[#030916] via-[#030916]/75 to-transparent lg:via-[#030916]/55"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-linear-to-t from-[#030916] to-transparent"
      />

      <motion.div
        style={{ y, opacity: fade }}
        className="site-container relative z-10 flex min-h-svh flex-col justify-center py-32 will-change-[transform,opacity]"
      >
        <p className="motion-preset-fade motion-delay-200 font-mono text-[11px] uppercase tracking-[.28em] text-[#8bb6ff]">
          TarVance <span className="mx-2 text-[#8bb6ff]/40">/</span> Software
          studio
        </p>
        <h1 className="display-heading motion-preset-slide-up motion-duration-1000 mt-8 max-w-[11ch] text-[clamp(3rem,10.5vw,10rem)]">
          We build digital <em className="text-[#a9c4ff]">solutions.</em>
        </h1>
        <p className="motion-preset-fade motion-delay-500 mt-8 max-w-md text-lg leading-8 text-tar-cream/75">
          Strategy, design and engineering under one roof — for teams who want
          software that lasts past launch day.
        </p>
        <div className="motion-preset-fade motion-delay-700 mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
          <Link to="/contact" className={button("light", "lg")}>
            Start a project
          </Link>
          <a
            href="#expertise"
            className="border-b border-tar-cream/30 pb-1 text-sm text-tar-cream/80 transition hover:border-tar-cream"
          >
            See what we do
          </a>
        </div>
      </motion.div>

      {/*<a
        href="#expertise"
        aria-label="Scroll to services"
        className="site-container absolute inset-x-0 bottom-7 z-10 flex items-center justify-end font-mono text-[10px] uppercase tracking-[.2em] text-tar-cream/55 transition-colors hover:text-[#8bb6ff]"
      >
        Explore services{" "}
        <span aria-hidden="true" className="ml-3 text-[#8bb6ff]">
          ↓
        </span>
      </a>*/}
    </section>
  );
}

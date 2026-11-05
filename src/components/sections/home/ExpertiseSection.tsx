import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "framer-motion";

import { Link } from "react-router-dom";
import { services, type Service } from "../../../data/siteData";
import { useScrollProgress } from "../../../lib/scroll";
import Reveal from "../../ui/Reveal";
import SectionHeader from "../../ui/SectionHeader";
import { button } from "../../ui/button";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** One segment of the sticky left rail. Fills downwards as the reader moves through its chapter. */
function Segment({
  progress,
  index,
  count,
  label,
}: {
  progress: MotionValue<number>;
  index: number;
  count: number;
  label: string;
}) {
  const fill = useTransform(progress, (v: number) =>
    clamp01(v * count - index),
  );
  return (
    <div className="flex min-h-0 flex-1 flex-col items-center gap-2">
      <span className="font-mono text-[10px] tracking-widest text-[#3558a8]/70">
        {label}
      </span>
      <div className="w-0.5 flex-1 overflow-hidden rounded-full bg-tar-navy/12">
        <motion.div
          style={{ scaleY: fill }}
          className="h-full w-full origin-top bg-[#2b56d7] will-change-transform"
        />
      </div>
    </div>
  );
}

/** A single service, told as its own scroll chapter with layers that drift at different speeds. */
function Chapter({ service, index }: { service: Service; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const k = reduce ? 0 : 1;

  const p = useScrollProgress(ref, ["start end", "end start"]);
  const numeralY = useTransform(p, [0, 1], [90 * k, -90 * k]);
  const boxY = useTransform(p, [0, 1], [40 * k, -40 * k]);
  const photoY = useTransform(p, [0, 1], [`${-9 * k}%`, `${9 * k}%`]);
  const cardY = useTransform(p, [0, 1], [-60 * k, 60 * k]);

  const flip = index % 2 === 1;
  const Icon = service.icon;

  return (
    <article
      ref={ref}
      className="relative grid items-center gap-8 border-t border-tar-navy/10 py-10 sm:gap-12 sm:py-14 lg:min-h-svh lg:grid-cols-12 lg:gap-10 lg:py-24"
    >
      {/* Text */}
      <div className={`relative lg:col-span-5 ${flip ? "lg:col-start-8" : ""}`}>
        <motion.span
          aria-hidden
          style={{ y: numeralY }}
          className="pointer-events-none absolute -top-10 -left-2 sm:-top-16 select-none font-display text-[clamp(6rem,22vw,15rem)] leading-none text-[#2b56d7]/10 will-change-transform"
        >
          {service.number}
        </motion.span>

        <div className="relative">
          <Reveal>
            
            <h3 className="display-heading mt-5 text-4xl text-tar-navy sm:text-5xl lg:text-6xl">
              {service.title}
            </h3>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-6 max-w-md text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
              {service.description}
            </p>
            <Link
              to="/contact"
              className="group mt-8 inline-flex items-center gap-2 border-b border-[#244ec4]/30 pb-1 text-sm font-bold text-[#244ec4] transition hover:border-[#244ec4]"
            >
              Ask about this
            </Link>
          </Reveal>
        </div>
      </div>

      {/* Big photo box with an overlapping "Includes" card */}
      <div
        className={`lg:col-span-7 ${flip ? "lg:col-start-1 lg:row-start-1" : "lg:col-start-6"}`}
      >
        <div className="relative pb-8 sm:pb-10 sm:pr-6">
          <motion.div
            style={{ y: boxY }}
            className="relative h-60 overflow-hidden rounded-2xl bg-tar-navy shadow-[0_30px_80px_rgba(7,22,63,.28)] will-change-transform min-[480px]:h-72 sm:h-96 sm:rounded-3xl md:h-112 lg:h-176"
          >
            <motion.img
              src={`${import.meta.env.BASE_URL}services/${service.image}`}
              alt={service.title}
              loading="lazy"
              decoding="async"
              style={{ y: photoY }}
              className="absolute inset-0 h-full w-full scale-[1.2] object-cover will-change-transform"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-linear-to-t from-tar-navy/45 via-transparent to-transparent"
            />
            <span className="absolute top-3 left-3 flex h-10 w-10 sm:top-5 sm:left-5 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-tar-navy/80 text-[#8bb6ff]">
              <Icon size={22} strokeWidth={1.6} />
            </span>
          </motion.div>

          <motion.div
            style={{ y: cardY }}
            className={`absolute bottom-0 w-[46%] max-w-38 rounded-lg border border-tar-navy/10 bg-tar-paper p-2 shadow-[0_14px_30px_rgba(7,22,63,.18)] will-change-transform min-[480px]:w-[52%] min-[480px]:max-w-44 min-[480px]:p-2.5 sm:w-[68%] sm:max-w-xs sm:rounded-2xl sm:p-5 sm:shadow-[0_24px_55px_rgba(7,22,63,.18)] ${flip ? "right-2 sm:right-0" : "left-2 sm:left-auto sm:right-0"}`}
          >
            <p className="font-mono text-[8px] tracking-[.16em] text-[#3558a8] uppercase sm:text-[10px] sm:tracking-[.2em]">
              Includes
            </p>
            <ul className="mt-1 sm:mt-2">
              {service.tags.map((tag) => (
                <li
                  key={tag}
                  className="flex items-center gap-1.5 border-t border-tar-navy/10 py-0.5 text-[10px] leading-tight font-semibold text-tar-navy first:border-t-0 min-[480px]:py-1 min-[480px]:text-[11px] sm:gap-3 sm:py-2.5 sm:text-sm"
                >
                  <span className="h-1 w-1 shrink-0 rounded-full bg-[#2b56d7] sm:h-1.5 sm:w-1.5" />
                  {tag}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </article>
  );
}

export default function ExpertiseSection() {
  const listRef = useRef<HTMLDivElement>(null);
  const progress = useScrollProgress(listRef, ["start center", "end center"]);

  return (
    <section
      id="expertise"
      className="section-pad scroll-mt-24 overflow-x-clip bg-[#f1eee5]"
    >
      <div className="site-container">
        <Reveal>
          <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
            <SectionHeader
              eyebrow="What we do"
              title="Software and websites for your business."
              description="We build custom software and websites, and help customers find you online with Google Business Profile and SEO."
            />
            <Link
              to="/about"
              className={button("quiet", "lg", "self-start lg:self-auto")}
            >
              About us 
            </Link>
          </div>
        </Reveal>
      </div>

      {/* Full-width wrapper so the rail can sit at the far right edge of the screen */}
      <div ref={listRef} className="relative mt-10 sm:mt-16">
        <div className="pointer-events-none absolute inset-y-0 right-2 z-20 w-7 sm:right-4">
          <div className="pointer-events-auto sticky top-28 flex h-[min(70svh,30rem)] flex-col gap-3">
            {services.map((s, i) => (
              <Segment
                key={s.number}
                progress={progress}
                index={i}
                count={services.length}
                label={s.number}
              />
            ))}
          </div>
        </div>

        <div className="site-container pr-10 min-[1300px]:pr-0">
          {services.map((service, i) => (
            <Chapter key={service.number} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

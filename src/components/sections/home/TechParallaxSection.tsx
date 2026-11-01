import { useRef, useState, type CSSProperties } from "react";
import { motion, useTransform, type MotionValue } from "framer-motion";
import { useScrollProgress } from "../../../lib/scroll";
import { fadeBottom, skyGrid } from "../../ui/patterns";

// x/y are percentage positions; d controls parallax depth; s is the maximum size.
type Item = {
  n: string;
  x: number;
  y: number;
  d: number;
  s: number;
  logo?: string;
  hex?: string;
  short: string;
};

const stack: Item[] = [
  {
    n: "React",
    short: "R",
    x: 8,
    y: 14,
    d: 1.2,
    s: 84,
    logo: "react",
    hex: "61DAFB",
  },
  { n: "TypeScript", short: "TS", x: 30, y: 10, d: 0.5, s: 54 },
  {
    n: "Vite",
    short: "V",
    x: 52,
    y: 18,
    d: 1.7,
    s: 72,
    logo: "vite",
    hex: "A78BFA",
  },
  {
    n: "Node.js",
    short: "N",
    x: 76,
    y: 8,
    d: 0.9,
    s: 78,
    logo: "nodedotjs",
    hex: "6CC24A",
  },
  { n: "PostgreSQL", short: "PG", x: 4, y: 52, d: 0.6, s: 50 },
  {
    n: "Docker",
    short: "D",
    x: 22,
    y: 38,
    d: 1.5,
    s: 70,
    logo: "docker",
    hex: "2496ED",
  },
  { n: "Tailwind CSS", short: "TW", x: 40, y: 62, d: 0.8, s: 46 },
  {
    n: "Python",
    short: "Py",
    x: 62,
    y: 42,
    d: 1.3,
    s: 74,
    logo: "python",
    hex: "60A5FA",
  },
  { n: "GraphQL", short: "GQ", x: 82, y: 56, d: 0.45, s: 48 },
  {
    n: "Redis",
    short: "Re",
    x: 14,
    y: 76,
    d: 1.8,
    s: 64,
    logo: "redis",
    hex: "FF4438",
  },
  { n: "AWS", short: "AWS", x: 52, y: 80, d: 1.0, s: 52 },
  {
    n: "Figma",
    short: "F",
    x: 72,
    y: 74,
    d: 1.4,
    s: 66,
    logo: "figma",
    hex: "F5F5F5",
  },
  { n: "OpenAI", short: "AI", x: 90, y: 30, d: 0.7, s: 44 },
];

// Mobile-only technology marquee.
// Desktop and tablet retain the floating technology artwork.
const mobileMarqueeRows = [
  [
    "React",
    "TypeScript",
    "Vite",
    "Next.js",
    "Node.js",
    "Express",
    "FastAPI",
    "Python",
    "Golang",
    "GraphQL",
    "REST APIs",
    "Framer Motion",
    "Git",
    "JAX",
  ],
  [
    "PostgreSQL",
    "Docker",
    "Tailwind CSS",
    "Redis",
    "Valkey",
    "Qdrant",
    "AWS",
    "Microsoft Azure",
    "Google Cloud",
    "Jenkins",
    "Figma",
    "OpenAI",
    "MongoDB",
    "RabbitMQ",
    "Kafka",
    "Kubernetes",
    "GitHub Actions",
    "Terraform",
  ],
] as const;

function MobileMarqueeRow({
  items,
  reverse = false,
}: {
  items: readonly string[];
  reverse?: boolean;
}) {
  return (
    <div className="w-full overflow-hidden">
      <div
        className={`flex w-max flex-nowrap will-change-transform motion-reduce:animate-none ${
          reverse ? "animate-marquee-right" : "animate-marquee-left"
        }`}
      >
        {[0, 1].map((copy) => (
          <div
            className="flex shrink-0 items-center gap-[.65rem] pr-[.65rem]"
            key={copy}
          >
            {items.map((name) => (
              <span
                className="inline-flex min-h-[2.35rem] shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-[#a9c4ff]/18 bg-white/5 px-[.85rem] py-[.6rem] font-mono text-xs font-medium leading-none tracking-[-.015em] text-[#dbe6ff] shadow-[inset_0_1px_rgb(255_255_255/.035)]"
                key={`${copy}-${name}`}
              >
                <span
                  className="size-1.5 shrink-0 rounded-full bg-[#8bb6ff] shadow-[0_0_10px_rgb(139_182_255/.45)]"
                  aria-hidden="true"
                />
                {name}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Fall back to a short label when a remote logo cannot be loaded. */
function Logo({ item, className }: { item: Item; className: string }) {
  const [failed, setFailed] = useState(false);

  if (!item.logo || failed) {
    return (
      <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#a9c4ff]">
        {item.short}
      </span>
    );
  }

  return (
    <img
      src={`https://cdn.simpleicons.org/${item.logo}/${item.hex}`}
      alt=""
      aria-hidden="true"
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}

function Floating({
  item,
  p,
  i,
}: {
  item: Item;
  p: MotionValue<number>;
  i: number;
}) {
  const y = useTransform(p, [0, 1], [item.d * 44, item.d * -44]);
  const rotate = useTransform(p, [0, 1], [-item.d * 4, item.d * 4]);

  const size = `clamp(${Math.max(
    28,
    Math.round(item.s * 0.42),
  )}px, ${item.s * 0.07}vw, ${item.s}px)`;

  const fontSize = `clamp(${Math.max(
    12,
    Math.round(item.s * 0.35),
  )}px, ${item.s * 0.07}vw, ${item.s}px)`;

  const positionStyle: CSSProperties = {
    left: `clamp(62px, ${item.x}%, calc(100% - 62px))`,
    top: `clamp(30px, ${item.y}%, calc(100% - 30px))`,
  };

  return (
    <motion.div
      style={{ ...positionStyle, y, rotate }}
      className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 will-change-transform max-lg:opacity-[.78] lg:translate-x-0 lg:translate-y-0"
    >
      {/* Idle bob is a pure CSS animation (compositor), not 13 always-on JS animations. */}
      <div
        className="animate-bob"
        style={{
          animationDuration: `${4 + (i % 4)}s`,
          animationDelay: `${i * -0.7}s`,
        }}
      >
        {item.logo ? (
          <span
            className="flex items-center justify-center rounded-2xl border border-white/10 bg-white/8 lg:rounded-3xl"
            style={{ width: size, height: size }}
            title={item.n}
          >
            <Logo item={item} className="h-1/2 w-1/2" />
          </span>
        ) : (
          <span
            className="display-heading whitespace-nowrap text-[#a9c4ff]/85"
            style={{ fontSize }}
          >
            {item.n}
          </span>
        )}
      </div>
    </motion.div>
  );
}

export default function TechParallaxSection() {
  const ref = useRef<HTMLElement>(null);

  const scrollYProgress = useScrollProgress(ref, ["start end", "end start"]);

  // Transform (compositor) instead of animating backgroundPositionY, which forced a full repaint of
  // a large masked layer on every scroll frame.
  const grid = useTransform(scrollYProgress, [0, 1], [0, -160]);

  const scale = useTransform(
    scrollYProgress,
    [0.15, 0.5, 0.85],
    [0.94, 1, 0.94],
  );

  return (
    <section
      ref={ref}
      aria-labelledby="stack-heading"
      className="relative isolate flex min-h-135 items-center justify-center overflow-hidden bg-[#030916] py-24 text-tar-cream sm:min-h-150 sm:py-28 lg:h-screen lg:min-h-160 lg:py-0"
    >
      {/* Animated background grid */}
      <div
        aria-hidden="true"
        className={`${fadeBottom} absolute inset-0 overflow-hidden opacity-40`}
      >
        <motion.div
          style={{ y: grid }}
          className={`${skyGrid} absolute inset-x-0 top-0 h-[calc(100%+160px)] will-change-transform`}
        />
      </div>

      {/* Floating technology artwork: tablet and desktop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden md:block"
      >
        {stack.map((item, index) => (
          <Floating key={item.n} item={item} p={scrollYProgress} i={index} />
        ))}
      </div>

      {/* Background overlay for headline readability */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,#030916_0%,#030916eb_34%,#0309169c_62%,transparent_84%)] lg:bg-[radial-gradient(ellipse_at_center,#030916_0%,#030916d9_28%,transparent_62%)]"
      />

      <div className="site-container relative z-10 flex flex-col items-center text-center lg:h-full lg:justify-center">
        <motion.div style={{ scale }} className="flex flex-col items-center">
          <p className="font-mono text-[10px] uppercase tracking-[.28em] text-[#8bb6ff] sm:text-[11px]">
            The stack
          </p>

          <h2
            id="stack-heading"
            className="display-heading mt-5 max-w-5xl text-balance text-[clamp(2.1rem,6vw,5.5rem)]"
          >
            The tools behind <em className="text-[#a9c4ff]">our work.</em>
          </h2>
        </motion.div>

        {/* Two-row marquee: mobile only */}
        <div
          className="mt-9 ml-[calc(50%-50vw)] flex w-screen max-w-screen flex-col gap-3 overflow-hidden py-2 mask-[linear-gradient(to_right,transparent,#000_5%,#000_95%,transparent)] md:hidden"
          aria-hidden="true"
        >
          <MobileMarqueeRow items={mobileMarqueeRows[0]} />
          <MobileMarqueeRow items={mobileMarqueeRows[1]} reverse />
        </div>
      </div>

      {/* Accessible technology list */}
      <ul className="sr-only" aria-label="Technologies we work with">
        {[
          ...new Set([
            ...stack.map((item) => item.n),
            ...mobileMarqueeRows.flat(),
          ]),
        ].map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
    </section>
  );
}

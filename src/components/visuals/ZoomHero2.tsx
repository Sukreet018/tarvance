
import {
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";

import {
  easeInOut,
  motion,
  useMotionValue,
  useTransform,
} from "framer-motion";

import AsciiArt from "./AsciiArt2";
import { useScrollProgress } from "../../lib/scroll";

type Props = {
  label: string;
  text: string;
  focusAt?: number;
  caption?: string;
};

const ROUND = /[oOQ0]/;
const CLOSED = /[oOQ0eaAdbpqDBPRg]/;

function pickFrameLetter(text: string) {
  const mid = (text.length - 1) / 2;

  let best = -1;
  let bestScore = Infinity;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];

    if (!CLOSED.test(ch)) continue;

    const score =
      Math.abs(i - mid) +
      (ROUND.test(ch) ? 0 : 2.5);

    if (score < bestScore) {
      bestScore = score;
      best = i;
    }
  }

  return best >= 0 ? best : Math.floor(mid);
}

function counterOf(ch: string, font: string) {
  const S = 240;
  const pad = 30;

  const canvas = document.createElement("canvas");

  const ctx = canvas.getContext("2d", {
    willReadFrequently: true,
  })!;

  ctx.font = `${S}px ${font}`;

  const metrics = ctx.measureText(ch);

  const asc = metrics.fontBoundingBoxAscent;
  const desc = metrics.fontBoundingBoxDescent;

  const w = Math.ceil(metrics.width) + pad * 2;
  const h = Math.ceil(asc + desc) + pad * 2;

  canvas.width = w;
  canvas.height = h;

  ctx.font = `${S}px ${font}`;
  ctx.textBaseline = "alphabetic";
  ctx.fillText(ch, pad, pad + asc);

  const pixels = ctx.getImageData(
    0,
    0,
    w,
    h,
  ).data;

  const seen = new Uint8Array(w * h);

  const ink = (i: number) =>
    pixels[i * 4 + 3] > 127;

  const fill = (start: number) => {
    const stack = [start];

    let n = 0;
    let sx = 0;
    let sy = 0;

    seen[start] = 1;

    while (stack.length) {
      const i = stack.pop()!;

      const x = i % w;
      const y = Math.floor(i / w);

      n++;
      sx += x;
      sy += y;

      const neighbours = [
        x > 0 ? i - 1 : -1,
        x < w - 1 ? i + 1 : -1,
        y > 0 ? i - w : -1,
        y < h - 1 ? i + w : -1,
      ];

      for (const j of neighbours) {
        if (
          j >= 0 &&
          !seen[j] &&
          !ink(j)
        ) {
          seen[j] = 1;
          stack.push(j);
        }
      }
    }

    return { n, sx, sy };
  };

  // Mark all pixels connected to the outside.
  fill(0);

  let best: {
    n: number;
    cx: number;
    cy: number;
  } | null = null;

  for (let i = 0; i < w * h; i++) {
    if (seen[i] || ink(i)) continue;

    const result = fill(i);

    const cy = result.sy / result.n;

    if (
      result.n > 80 &&
      (!best || cy < best.cy)
    ) {
      best = {
        n: result.n,
        cx: result.sx / result.n,
        cy,
      };
    }
  }

  if (!best) {
    return {
      x: (w / 2 - pad) / S,
      y: (h / 2 - pad - asc) / S,
      r: 0.12,
      asc: asc / S,
      desc: desc / S,
    };
  }

  return {
    x: (best.cx - pad) / S,
    y: (best.cy - pad - asc) / S,
    r: Math.sqrt(best.n / Math.PI) / S,
    asc: asc / S,
    desc: desc / S,
  };
}

export default function ZoomHero({
  label,
  text,
  focusAt,
  caption,
}: Props) {
  const stage = useRef<HTMLDivElement>(null);
  const sticky = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLHeadingElement>(null);
  const letter = useRef<HTMLSpanElement>(null);

  const idx = focusAt ?? pickFrameLetter(text);

  const words = useMemo(() => {
    let i = 0;

    return text.split(" ").map((w) => {
      const start = i;

      i += w.length + 1;

      return { w, start };
    });
  }, [text]);

  const p = useScrollProgress(
    stage,
    ["start start", "end end"],
  );

  const geo = useRef({
    px: 0,
    py: 0,
    dx: 0,
    dy: 0,
    smax: 40,
  });

  const rev = useMotionValue(0);

  useLayoutEffect(() => {
    const measure = () => {
      const b = box.current;
      const l = letter.current;
      const s = sticky.current;

      if (!b || !l || !s) return;

      const previousTransform = b.style.transform;

      b.style.transform = "none";

      const styles = getComputedStyle(l);

      const fs = parseFloat(styles.fontSize);

      const lh =
        parseFloat(styles.lineHeight) || fs * 1.2;

      const geometry = counterOf(
        text[idx],
        styles.fontFamily,
      );

      const stageRect = s.getBoundingClientRect();
      const boxRect = b.getBoundingClientRect();
      const letterRect = l.getBoundingClientRect();

      b.style.transform = previousTransform;

      const px =
        letterRect.left -
        boxRect.left +
        geometry.x * fs;

      const py =
        letterRect.top -
        boxRect.top +
        (lh - (geometry.asc + geometry.desc) * fs) / 2 +
        (geometry.asc + geometry.y) * fs;

      const cx = stageRect.width / 2;
      const cy = stageRect.height / 2;

      geo.current = {
        px,
        py,

        dx:
          cx -
          (boxRect.left - stageRect.left + px),

        dy:
          cy -
          (boxRect.top - stageRect.top + py),

        smax:
          (Math.hypot(
            stageRect.width,
            stageRect.height,
          ) /
            2 /
            Math.max(geometry.r * fs, 1)) *
          0.8,
      };

      rev.set(rev.get() + 1);
    };

    measure();

    document.fonts?.ready.then(measure);

    window.addEventListener("resize", measure);

    return () => {
      window.removeEventListener("resize", measure);
    };
  }, [text, idx, rev]);

  const e = useTransform(
    p,
    [0.04, 0.88],
    [0, 1],
    { clamp: true },
  );

  const move = useTransform(
    e,
    [0, 0.5],
    [0, 1],
    {
      clamp: true,
      ease: easeInOut,
    },
  );

  const scale = useTransform(
    [e, rev],
    ([v]: number[]) =>
      Math.exp(
        Math.log(
          Math.max(geo.current.smax, 1.01),
        ) * v,
      ),
  );

  const transform = useTransform(
    [move, scale, rev],
    ([m, sc]: number[]) => {
      const g = geo.current;

      const tx =
        (1 - sc) * g.px + g.dx * m;

      const ty =
        (1 - sc) * g.py + g.dy * m;

      return `translate(${tx}px, ${ty}px) scale(${sc})`;
    },
  );

  const textOpacity = useTransform(
    p,
    [0.72, 0.9],
    [1, 0],
  );

  // Use the same scroll-driven progress as the headline.
  // The image begins at its complete composition and zooms towards
  // Plato and Aristotle as the letter frame expands.
  const zoom = useTransform(
    e,
    (v) => 1 + 4 * v,
  );

  const vignette = useTransform(
    e,
    [0, 0.35],
    [1, 0],
  );

  const hint = useTransform(
    p,
    [0, 0.06],
    [1, 0],
  );

  const cap = useTransform(
    p,
    [0.88, 0.98],
    [0, 1],
  );

  return (
    <div
      ref={stage}
      className="relative h-[420vh] bg-[#030916]"
    >
      <div
        ref={sticky}
        className="sticky top-0 h-svh overflow-hidden"
      >
        <AsciiArt
          zoom={zoom}
          src={`${import.meta.env.BASE_URL}Caspar_David_Friedrich_-_Wanderer_above_the_sea_of_fog.jpg`}
          focus={{ x: 1080, y: 690 }}
        />

        <motion.div
          aria-hidden
          style={{ opacity: vignette }}
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#030916b3_0%,#03091640_55%,#030916e6_100%)]"
        />

        <div className="absolute inset-0 flex items-center justify-center">
          <motion.h1
            ref={box}
            style={{
              transform,
              transformOrigin: "0 0",
              opacity: textOpacity,
            }}
            className="display-heading relative max-w-[16ch] px-6 text-center text-[clamp(2.6rem,7.5vw,7rem)] text-tar-cream"
          >
            {words.map(({ w, start }, i) => (
              <span key={start}>
                <span className="inline-block whitespace-nowrap">
                  {idx >= start &&
                  idx < start + w.length ? (
                    <>
                      {w.slice(0, idx - start)}

                      <span
                        ref={letter}
                        className="inline-block"
                      >
                        {w[idx - start]}
                      </span>

                      {w.slice(idx - start + 1)}
                    </>
                  ) : (
                    w
                  )}
                </span>

                {i < words.length - 1 ? " " : null}
              </span>
            ))}
          </motion.h1>
        </div>

        {caption && (
          <motion.p
            style={{ opacity: cap }}
            className="display-heading absolute inset-x-0 bottom-[14vh] px-6 text-center text-3xl italic text-tar-cream sm:text-5xl"
          >
            {caption}
          </motion.p>
        )}

        <motion.div
          style={{ opacity: hint }}
          className="absolute inset-x-0 top-28 text-center font-mono text-[11px] uppercase tracking-[.28em] text-[#8bb6ff]"
        >
          {label}
        </motion.div>

        <motion.div
          style={{ opacity: hint }}
          className="absolute inset-x-0 bottom-8 text-center font-mono text-[10px] uppercase tracking-[.3em] text-tar-cream/45"
        >
          Scroll to zoom ↓
        </motion.div>

        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-[#030916] to-transparent"
        />
      </div>
    </div>
  );
}

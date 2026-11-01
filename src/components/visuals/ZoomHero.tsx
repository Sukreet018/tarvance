import { useLayoutEffect, useMemo, useRef } from "react";
import { easeInOut, motion, useMotionValue, useTransform } from "framer-motion";
import AsciiArt from "./AsciiArt";
import { useScrollProgress } from "../../lib/scroll";

type Props = {
  label: string;
  text: string;
  /** Optional manual override. By default the letter nearest the middle of the sentence is used as the frame. */
  focusAt?: number;
  caption?: string;
};

/** Letters that have a closed counter (a hole) we can use as a window. Round ones read best as a frame. */
const ROUND = /[oOQ0]/;
const CLOSED = /[oOQ0eaAdbpqDBPRg]/;

/** Picks the letter at (or nearest to) the centre of the sentence that has a closed counter. */
function pickFrameLetter(text: string) {
  const mid = (text.length - 1) / 2;
  let best = -1,
    bestScore = Infinity;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (!CLOSED.test(ch)) continue;
    const score = Math.abs(i - mid) + (ROUND.test(ch) ? 0 : 2.5);
    if (score < bestScore) {
      bestScore = score;
      best = i;
    }
  }
  return best >= 0 ? best : Math.floor(mid);
}

/** Finds the (upper-most) enclosed counter of a glyph by flood-filling its rendered pixels. Returns em-relative geometry. */
function counterOf(ch: string, font: string) {
  const S = 240,
    pad = 30,
    c = document.createElement("canvas"),
    g = c.getContext("2d", { willReadFrequently: true })!;
  g.font = `${S}px ${font}`;
  const m = g.measureText(ch);
  const asc = m.fontBoundingBoxAscent,
    desc = m.fontBoundingBoxDescent,
    w = Math.ceil(m.width) + pad * 2,
    h = Math.ceil(asc + desc) + pad * 2;
  c.width = w;
  c.height = h;
  g.font = `${S}px ${font}`;
  g.textBaseline = "alphabetic";
  g.fillText(ch, pad, pad + asc);
  const px = g.getImageData(0, 0, w, h).data,
    seen = new Uint8Array(w * h),
    ink = (i: number) => px[i * 4 + 3] > 127;
  const fill = (start: number) => {
    const st = [start];
    let n = 0,
      sx = 0,
      sy = 0;
    seen[start] = 1;
    while (st.length) {
      const i = st.pop()!,
        x = i % w,
        y = (i / w) | 0;
      n++;
      sx += x;
      sy += y;
      for (const j of [
        x > 0 ? i - 1 : -1,
        x < w - 1 ? i + 1 : -1,
        y > 0 ? i - w : -1,
        y < h - 1 ? i + w : -1,
      ])
        if (j >= 0 && !seen[j] && !ink(j)) {
          seen[j] = 1;
          st.push(j);
        }
    }
    return { n, sx, sy };
  };
  fill(0); // everything connected to the corner is "outside"
  let best: { n: number; cx: number; cy: number } | null = null;
  for (let i = 0; i < w * h; i++)
    if (!seen[i] && !ink(i)) {
      const r = fill(i),
        cy = r.sy / r.n;
      if (r.n > 80 && (!best || cy < best.cy))
        best = { n: r.n, cx: r.sx / r.n, cy };
    }
  if (!best)
    return {
      x: (w / 2 - pad) / S,
      y: (h / 2 - pad - asc) / S,
      r: 0.12,
      asc: asc / S,
      desc: desc / S,
    };
  return {
    x: (best.cx - pad) / S,
    y: (best.cy - pad - asc) / S,
    r: Math.sqrt(best.n / Math.PI) / S,
    asc: asc / S,
    desc: desc / S,
  };
}

/**
 * Sticky stage. The whole sentence enlarges around the counter (the hole) of its centre letter, so the
 * letter becomes a frame that opens onto the ASCII artwork, which zooms in on the two fingertips about to meet.
 */
export default function ZoomHero({ label, text, focusAt, caption }: Props) {
  const stage = useRef<HTMLDivElement>(null),
    sticky = useRef<HTMLDivElement>(null),
    box = useRef<HTMLHeadingElement>(null),
    letter = useRef<HTMLSpanElement>(null);
  const idx = focusAt ?? pickFrameLetter(text);

  // Words are kept unbreakable so the line can only wrap on spaces, never in the middle of a word.
  const words = useMemo(() => {
    let i = 0;
    return text.split(" ").map((w) => {
      const start = i;
      i += w.length + 1;
      return { w, start };
    });
  }, [text]);

  // Lenis already eases the wheel. The old useSpring on top of it was a second, independent smoother
  // running on a different clock, which made the pinned headline shimmer against the page.
  const p = useScrollProgress(stage, ["start start", "end end"]);

  // Geometry of the frame letter, in the headline's own (untransformed) coordinates.
  // px/py: counter centre inside the headline. dx/dy: vector from the counter to the stage centre.
  const geo = useRef({ px: 0, py: 0, dx: 0, dy: 0, smax: 40 });
  const rev = useMotionValue(0); // bumped after every measure so the transform is recomputed

  useLayoutEffect(() => {
    const measure = () => {
      const b = box.current,
        l = letter.current,
        s = sticky.current;
      if (!b || !l || !s) return;
      // Measure the resting layout: temporarily drop the animated transform.
      const prev = b.style.transform;
      b.style.transform = "none";
      const cs = getComputedStyle(l),
        fs = parseFloat(cs.fontSize),
        lh = parseFloat(cs.lineHeight) || fs * 1.2,
        k = counterOf(text[idx], cs.fontFamily);
      const sr = s.getBoundingClientRect(),
        br = b.getBoundingClientRect(),
        lr = l.getBoundingClientRect();
      b.style.transform = prev;

      const px = lr.left - br.left + k.x * fs,
        py =
          lr.top -
          br.top +
          (lh - (k.asc + k.desc) * fs) / 2 +
          (k.asc + k.y) * fs;
      const cx = sr.width / 2,
        cy = sr.height / 2;
      geo.current = {
        px,
        py,
        dx: cx - (br.left - sr.left + px),
        dy: cy - (br.top - sr.top + py),
        // grow until the counter comfortably overshoots the screen corners
        smax:
          (Math.hypot(sr.width, sr.height) / 2 / Math.max(k.r * fs, 1)) * 0.8,
      };
      rev.set(rev.get() + 1);
    };
    measure();
    document.fonts?.ready.then(measure);
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [text, idx, rev]);

  const e = useTransform(p, [0.04, 0.88], [0, 1], { clamp: true });
  const move = useTransform(e, [0, 0.5], [0, 1], {
    clamp: true,
    ease: easeInOut,
  });
  const scale = useTransform([e, rev], ([v]: number[]) =>
    Math.exp(Math.log(Math.max(geo.current.smax, 1.01)) * v),
  );
  // transform-origin is the headline's top-left, so the counter's position is
  // fully described by the translate below (no stale origin to go out of sync).
  const transform = useTransform([move, scale, rev], ([m, sc]: number[]) => {
    const g = geo.current;
    const tx = (1 - sc) * g.px + g.dx * m,
      ty = (1 - sc) * g.py + g.dy * m;
    return `translate(${tx}px, ${ty}px) scale(${sc})`;
  });
  const textOpacity = useTransform(p, [0.72, 0.9], [1, 0]);
  const zoom = useTransform(e, (v) => 1 + 6.5 * v);
  const vignette = useTransform(e, [0, 0.35], [1, 0]);
  const hint = useTransform(p, [0, 0.06], [1, 0]);
  const cap = useTransform(p, [0.88, 0.98], [0, 1]);

  return (
    <div ref={stage} className="relative h-[420vh] bg-[#030916]">
      <div ref={sticky} className="sticky top-0  h-svh overflow-hidden">
        <AsciiArt zoom={zoom} />
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
                  {idx >= start && idx < start + w.length ? (
                    <>
                      {w.slice(0, idx - start)}
                      <span ref={letter} className="inline-block">
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

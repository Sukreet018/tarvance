import { useEffect, useRef } from "react";
import { cancelFrame, frame, type MotionValue } from "framer-motion";
import { geoEquirectangular, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import landTopology from "world-atlas/land-110m.json";
import { subscribeScroll } from "../../lib/scroll";


/* ------------------------------------------------------------------ */
/* Tunables                                                            */
/* ------------------------------------------------------------------ */
const SPACING = 7; // px between ASCII cells (smaller = denser)
const FONT_PX = 8; // glyph size (smaller letters)
const CELL_W = 6;
const CELL_H = 9;
const MAX_POINTS = 24000;
const BASE_TILT = 0.38;
const START_ROT = -1.05; // starts facing roughly Europe / Africa / India
const FONT = `600 ${FONT_PX}px "JetBrains Mono", ui-monospace, Menlo, Consolas, monospace`;

const LAND_COLORS = ["#1b4a9c", "#2563c9", "#3b82f6", "#6db4ff", "#b9e3ff"];
const COAST_COLORS = ["#4d8fe0", "#7ab8ff", "#a8d8ff", "#d4efff", "#ffffff"];

const LAND_RAMP = [":", "-", "=", "+", "*"];
const COAST_RAMP_A = ["=", "+", "*", "#", "#"];
const COAST_RAMP_B = ["+", "*", "#", "%", "%"];

// Data hubs (lat, lon)
const HUBS: [number, number][] = [
  [37.8, -122.4], // San Francisco
  [40.7, -74.0], // New York
  [-23.5, -46.6], // São Paulo
  [51.5, -0.1], // London
  [12.97, 77.6], // Bangalore
  [1.35, 103.8], // Singapore
  [35.7, 139.7], // Tokyo
  [-33.9, 151.2], // Sydney
];

// Arcs between hub indices
const LINKS: [number, number][] = [
  [0, 1],
  [1, 3],
  [3, 4],
  [4, 5],
  [5, 6],
  [0, 6],
  [1, 2],
  [5, 7],
];

/* ------------------------------------------------------------------ */
/* Geometry helpers                                                    */
/* ------------------------------------------------------------------ */
type Vec = [number, number, number];

const toVec = (latDeg: number, lonDeg: number, r = 1): Vec => {
  const lat = (latDeg * Math.PI) / 180;
  const lon = (lonDeg * Math.PI) / 180;
  return [
    Math.cos(lat) * Math.sin(lon) * r,
    Math.sin(lat) * r,
    Math.cos(lat) * Math.cos(lon) * r,
  ];
};

function buildArc(a: Vec, b: Vec, samples = 52): Vec[] {
  const dot = Math.min(
    1,
    Math.max(-1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]),
  );
  const omega = Math.acos(dot);
  const sin = Math.sin(omega) || 1;
  const out: Vec[] = [];

  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const k1 = Math.sin((1 - t) * omega) / sin;
    const k2 = Math.sin(t * omega) / sin;
    const lift = 1 + Math.sin(Math.PI * t) * 0.16 * (omega / Math.PI + 0.25);

    out.push([
      (a[0] * k1 + b[0] * k2) * lift,
      (a[1] * k1 + b[1] * k2) * lift,
      (a[2] * k1 + b[2] * k2) * lift,
    ]);
  }
  return out;
}

const HUB_VECS: Vec[] = HUBS.map(([la, lo]) => toVec(la, lo, 1.01));
const ARCS: Vec[][] = LINKS.map(([i, j]) =>
  buildArc(toVec(...HUBS[i]), toVec(...HUBS[j])),
);

/* ------------------------------------------------------------------ */
/* Land mask from real geography                                       */
/* ------------------------------------------------------------------ */
let landMask: { data: Uint8ClampedArray; w: number; h: number } | null = null;

function getLandMask() {
  if (landMask) return landMask;

  const w = 1440;
  const h = 720;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;

  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, w, h);

  const projection = geoEquirectangular()
    .scale(w / (2 * Math.PI))
    .translate([w / 2, h / 2]);

  const topo = landTopology as any;
  const land = feature(topo, topo.objects.land);

  ctx.fillStyle = "#fff";
  ctx.beginPath();
  geoPath(projection, ctx)(land as any);
  ctx.fill();

  landMask = { data: ctx.getImageData(0, 0, w, h).data, w, h };
  return landMask;
}

function isLand(latDeg: number, lonDeg: number) {
  const { data, w, h } = getLandMask();
  let lon = (((lonDeg + 180) % 360) + 360) % 360;
  const x = Math.min(w - 1, Math.floor((lon / 360) * w));
  const y = Math.min(h - 1, Math.max(0, Math.floor(((90 - latDeg) / 180) * h)));
  return data[(y * w + x) * 4] > 127;
}

/* ------------------------------------------------------------------ */
/* Sprite atlas                                                        */
/*                                                                     */
/* Every glyph lives in ONE canvas, so the GPU can batch thousands of  */
/* drawImage calls into a single draw instead of switching textures.   */
/* ------------------------------------------------------------------ */
const SPRITE_COUNT = 34; // 30 surface sprites + 3 arc sprites + 1 hub sprite
const ARC_DIM = 30;
const ARC_MID = 31;
const ARC_HOT = 32;
const HUB = 33;

// z (0..1) -> brightness level 0..4, precomputed so we don't call Math.pow per point
const LEVEL_LUT = new Uint8Array(256);
for (let i = 0; i < 256; i++) {
  LEVEL_LUT[i] = Math.min(4, (Math.pow(i / 255, 0.75) * 5) | 0);
}

function buildAtlas(dpr: number) {
  const cw = Math.ceil(CELL_W * dpr);
  const ch = Math.ceil(CELL_H * dpr);
  const atlas = document.createElement("canvas");
  atlas.width = cw * SPRITE_COUNT;
  atlas.height = ch;
  const c = atlas.getContext("2d")!;

  const put = (index: number, glyph: string, color: string) => {
    c.save();
    c.translate(index * cw, 0);
    c.beginPath();
    c.rect(0, 0, cw, ch);
    c.clip();
    c.scale(dpr, dpr);
    c.font = FONT;
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillStyle = color;
    c.fillText(glyph, CELL_W / 2, CELL_H / 2 + 0.5);
    c.restore();
  };

  // index = (kind * 5 + level) * 2 + variant ; kind 0 ocean, 1 land, 2 coast
  for (let kind = 0; kind < 3; kind++) {
    for (let L = 0; L < 5; L++) {
      for (let v = 0; v < 2; v++) {
        const index = (kind * 5 + L) * 2 + v;
        if (kind === 0) {
          put(index, v ? "·" : ".", `rgba(70,130,230,${0.14 + L * 0.07})`);
        } else if (kind === 1) {
          put(index, LAND_RAMP[Math.min(4, L + v)], LAND_COLORS[L]);
        } else {
          put(index, (v ? COAST_RAMP_B : COAST_RAMP_A)[L], COAST_COLORS[L]);
        }
      }
    }
  }
  put(ARC_DIM, ".", "rgba(120,200,255,0.55)");
  put(ARC_MID, "+", "rgba(170,225,255,0.9)");
  put(ARC_HOT, "*", "#ffffff");
  put(HUB, "@", "#ffffff");

  return { atlas, cw, ch };
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */
const TAU = Math.PI * 2;

// Small seeded RNG: the point cloud is identical every time it is rebuilt
function mulberry32(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const INTRO_SECONDS = 2.4;
const SPIN_SECONDS = 160; // one full turn
const PULSE_SECONDS = 3.6;
const PING_SECONDS = 2.4;

type Props = {
  /** Optional 0..1 opacity of the wrapper. When it reaches ~0 we stop drawing entirely. */
  fade?: MotionValue<number>;
};

export default function DigitalEarth({ fade }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const fadeRef = useRef(fade);
  fadeRef.current = fade;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const canvas = document.createElement("canvas");
    canvas.style.cssText = `width:100%;height:100%;display:block;cursor:grab;touch-action:pan-y;opacity:${
      reduceMotion ? 1 : 0
    };transition:opacity 1.2s cubic-bezier(.22,1,.36,1);`;
    mount.appendChild(canvas);
    const fadeIn = reduceMotion
      ? 0
      : requestAnimationFrame(() => {
          canvas.style.opacity = "1";
        });

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Everything below is derived from time + scroll inside ONE render pass,
    // so nothing here can drift out of sync with the page's smooth scroll.
    let dragRot = 0;
    let scrollY = window.scrollY || 0;
    let maxScroll = 1;
    let dirty = true; // only matters for reduced-motion, where nothing animates by itself

    let dragging = false;
    let lastPointerX = 0;
    const onPointerDown = (event: PointerEvent) => {
      dragging = true;
      lastPointerX = event.clientX;
      canvas.style.cursor = "grabbing";
      canvas.setPointerCapture(event.pointerId);
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!dragging) return;
      const delta = event.clientX - lastPointerX;
      lastPointerX = event.clientX;
      dragRot += delta * 0.006;
      dirty = true;
    };
    const onPointerUp = () => {
      dragging = false;
      canvas.style.cursor = "grab";
    };
    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);

    // Scroll position comes from the shared smooth-scroll loop (no extra smoothing layer on top)
    const unsubscribeScroll = subscribeScroll((y) => {
      scrollY = y;
      dirty = true;
    });
    const measureScroll = () => {
      maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight,
      );
    };
    measureScroll();

    // Per-size data
    let W = 0;
    let H = 0;
    let R = 0;
    let dpr = 1;
    let N = 0;
    let wx = new Float32Array(0);
    let wy = new Float32Array(0);
    let wz = new Float32Array(0);
    let meta = new Uint8Array(0); // kind * 10 + variant
    let atlas: HTMLCanvasElement | null = null;
    let cellW = 0;
    let cellH = 0;
    let visible = true;

    const build = () => {
      const a = buildAtlas(dpr);
      atlas = a.atlas;
      cellW = a.cw;
      cellH = a.ch;

      const total = Math.min(
        MAX_POINTS,
        Math.round((4 * Math.PI * R * R) / (SPACING * SPACING)),
      );

      const xs: number[] = [];
      const ys: number[] = [];
      const zs: number[] = [];
      const ms: number[] = [];

      const rand = mulberry32(20240601);
      const golden = Math.PI * (3 - Math.sqrt(5));
      const D2R = 180 / Math.PI;

      for (let i = 0; i < total; i++) {
        const y = 1 - (2 * (i + 0.5)) / total;
        const lat = Math.asin(y) * D2R;
        let lon = ((i * golden * D2R) % 360) - 180;
        if (lon < -180) lon += 360;

        const land = isLand(lat, lon);
        let kind = land ? 1 : 0;

        if (land) {
          const d = 1.6;
          if (
            !isLand(lat + d, lon) ||
            !isLand(lat - d, lon) ||
            !isLand(lat, lon + d) ||
            !isLand(lat, lon - d)
          ) {
            kind = 2;
          }
        } else if (rand() > 0.42) {
          continue; // keep the ocean sparse
        }

        const [x, yy, z] = toVec(lat, lon);
        xs.push(x);
        ys.push(yy);
        zs.push(z);
        ms.push(kind * 10 + (rand() > 0.8 ? 1 : 0));
      }

      N = xs.length;
      wx = Float32Array.from(xs);
      wy = Float32Array.from(ys);
      wz = Float32Array.from(zs);
      meta = Uint8Array.from(ms);
    };

    const resize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (!w || !h) return;

      const newR = Math.min(w, h) * 0.42;
      const sizeChanged = w !== W || h !== H;
      const newDpr = Math.min(window.devicePixelRatio || 1, 2);
      const dprChanged = newDpr !== dpr;

      W = w;
      H = h;
      dpr = newDpr;

      const pw = Math.round(w * dpr);
      const ph = Math.round(h * dpr);
      if (canvas.width !== pw) canvas.width = pw;
      if (canvas.height !== ph) canvas.height = ph;

      if (!N || dprChanged || (sizeChanged && Math.abs(newR - R) > 1.5)) {
        R = newR;
        build();
      }
      dirty = true;
    };

    let t0 = -1;

    const render = (timestamp: number) => {
      if (!visible || !N || !atlas) return;
      const f = fadeRef.current;
      if (f && f.get() < 0.01) return; // wrapper is fully faded out: nothing to see

      if (t0 < 0) t0 = timestamp;
      if (reduceMotion && !dirty) return;
      dirty = false;

      const t = (timestamp - t0) / 1000;

      // Intro (power2.out), idle spin, data pulses, hub pings — all pure functions of time
      const introP = reduceMotion ? 1 : Math.min(1, t / INTRO_SECONDS);
      const intro = 1 - Math.pow(1 - introP, 3);
      const reveal = intro;
      const scale = reduceMotion ? 1 : 0.94 + 0.06 * intro;
      const spin = reduceMotion ? 0 : ((t / SPIN_SECONDS) % 1) * TAU;
      const pulse = reduceMotion ? 0 : (t / PULSE_SECONDS) % 1;
      const pingBase = reduceMotion ? 0 : (t / PING_SECONDS) % 1;
      const ping = 1 - (1 - pingBase) * (1 - pingBase);

      const progress = Math.min(1, Math.max(0, scrollY / maxScroll));
      const rot = START_ROT + spin + dragRot + progress * Math.PI * 1.1;
      const tilt = BASE_TILT + progress * 0.14;

      const cosR = Math.cos(rot);
      const sinR = Math.sin(rot);
      const cosT = Math.cos(tilt);
      const sinT = Math.sin(tilt);
      const cut = 1 - 2 * reveal;

      // Draw in raw device pixels with integer coordinates: a straight 1:1 blit, no resampling.
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const Rs = R * scale * dpr;
      const hw = cellW / 2;
      const hh = cellH / 2;

      // Surface
      for (let i = 0; i < N; i++) {
        if (wy[i] < cut) continue;

        const x = wx[i] * cosR + wz[i] * sinR;
        const z0 = -wx[i] * sinR + wz[i] * cosR;
        const z = wy[i] * sinT + z0 * cosT;
        if (z < 0.03) continue;

        const y = wy[i] * cosT - z0 * sinT;
        const idx = meta[i] + (LEVEL_LUT[(z * 255) | 0] << 1);

        ctx.drawImage(
          atlas,
          idx * cellW,
          0,
          cellW,
          cellH,
          (cx + x * Rs - hw) | 0,
          (cy - y * Rs - hh) | 0,
          cellW,
          cellH,
        );
      }

      // Data arcs
      if (reveal > 0.85) {
        for (let a = 0; a < ARCS.length; a++) {
          const arc = ARCS[a];
          const n = arc.length;
          const head = ((pulse + a * 0.137) % 1) * n;

          for (let j = 0; j < n; j++) {
            const p = arc[j];
            const x = p[0] * cosR + p[2] * sinR;
            const z0 = -p[0] * sinR + p[2] * cosR;
            const z = p[1] * sinT + z0 * cosT;
            if (z < 0.02) continue;

            const y = p[1] * cosT - z0 * sinT;
            const d = (head - j + n) % n;
            const idx = d < 2.5 ? ARC_HOT : d < 9 ? ARC_MID : ARC_DIM;

            ctx.drawImage(
              atlas,
              idx * cellW,
              0,
              cellW,
              cellH,
              (cx + x * Rs - hw) | 0,
              (cy - y * Rs - hh) | 0,
              cellW,
              cellH,
            );
          }
        }

        // Hubs
        ctx.lineWidth = dpr;
        for (let k = 0; k < HUB_VECS.length; k++) {
          const p = HUB_VECS[k];
          const x = p[0] * cosR + p[2] * sinR;
          const z0 = -p[0] * sinR + p[2] * cosR;
          const z = p[1] * sinT + z0 * cosT;
          if (z < 0.08) continue;

          const y = p[1] * cosT - z0 * sinT;
          const sx = cx + x * Rs;
          const sy = cy - y * Rs;
          const hubPing = (ping + k * 0.13) % 1;

          ctx.beginPath();
          ctx.arc(sx, sy, (3 + hubPing * 11) * dpr, 0, TAU);
          ctx.strokeStyle = `rgba(150,215,255,${(1 - hubPing) * 0.65})`;
          ctx.stroke();

          ctx.drawImage(
            atlas,
            HUB * cellW,
            0,
            cellW,
            cellH,
            (sx - hw) | 0,
            (sy - hh) | 0,
            cellW,
            cellH,
          );
        }
      }
    };

    // One frame loop for everything: Framer's `render` step runs AFTER its `update` step,
    // which is where Lenis moves the page — so the globe always draws the freshest scroll position.
    const loop = (data: { timestamp: number }) => render(data.timestamp);
    frame.render(loop, true);

    const resizeObserver = new ResizeObserver(() => {
      resize();
      measureScroll();
    });
    resizeObserver.observe(mount);
    resizeObserver.observe(document.body); // page height changes -> scroll progress range changes
    resize();

    // Pause when off screen
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) dirty = true;
      },
      { threshold: 0 },
    );
    io.observe(mount);

    return () => {
      cancelFrame(loop);
      cancelAnimationFrame(fadeIn);
      unsubscribeScroll();
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
      resizeObserver.disconnect();
      io.disconnect();
      canvas.remove();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full cursor-grab"
    />
  );
}

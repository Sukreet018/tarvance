import { useEffect, useRef } from "react";
import { cancelFrame, frame, type MotionValue } from "framer-motion";

type Props = {
  zoom: MotionValue<number>;
  src?: string;
  focus?: { x: number; y: number };
};

const RAMP = [
  ["."],
  ["·", "'"],
  [":", "-"],
  ["+", "=", "ｱ"],
  ["ﾊ", "ﾐ", "ｳ", "*"],
  ["ﾋ", "ﾓ", "ﾘ", "1"],
  ["ﾅ", "0", "ﾏ", "7"],
  ["#", "ｾ", "ﾒ", "Z"],
  ["%", "ﾀ", "8", "M"],
  ["@", "W", "&", "B"],
];

const COLORS = [
  "#173796",
  "#1f4bb8",
  "#2a5fe0",
  "#3b78ff",
  "#5c92ff",
  "#82aaff",
  "#a9c4ff",
  "#cfdcff",
  "#ece8da",
  "#fffaf0",
];

const EDGES = ["-", "\\", "|", "/"];

const FONT =
  '"JetBrains Mono","Noto Sans Mono CJK JP","MS Gothic",monospace';

// The focal point is calibrated for the supplied School of Athens image.
// Re-calibrating to focus on Plato (red robe) and Aristotle (blue robe) at the center.
const DEFAULT_FOCUS = { x: 1060, y: 600 };

export default function AsciiArt({
  zoom,
  src = `${import.meta.env.BASE_URL}landscape.png`,
  focus = DEFAULT_FOCUS,
}: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = cv.current;
    const box = wrap.current;

    if (!canvas || !box) return;

    const ctx = canvas.getContext("2d", {
      alpha: true,
    });

    if (!ctx) return;

    let alive = true;
    let visible = true;
    let lastZoom = NaN;
    let lastDraw = 0;

    let lum = new Float32Array(0);
    let alpha = new Float32Array(0);

    let IW = 0;
    let IH = 0;

    let atlas: HTMLCanvasElement | null = null;

    let cw = 8;
    let ch = 14;

    let cols = 0;
    let rows = 0;

    let W = 0;
    let H = 0;

    let s0 = 1;

    const buildAtlas = () => {
      const a = document.createElement("canvas");

      a.width = cw * 4;
      a.height = ch * (RAMP.length + 1);

      const g = a.getContext("2d");

      if (!g) return;

      g.font = `${Math.round(ch * 0.88)}px ${FONT}`;
      g.textAlign = "center";
      g.textBaseline = "middle";

      RAMP.forEach((characters, level) => {
        g.fillStyle = COLORS[level];

        for (let v = 0; v < 4; v++) {
          g.fillText(
            characters[v % characters.length],
            v * cw + cw / 2,
            level * ch + ch / 2 + 1,
          );
        }
      });

      g.fillStyle = "#c9d9ff";

      EDGES.forEach((edge, index) => {
        g.fillText(
          edge,
          index * cw + cw / 2,
          RAMP.length * ch + ch / 2 + 1,
        );
      });

      atlas = a;
    };

    const resize = () => {
      if (!IW || !IH || !alive) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = box.getBoundingClientRect();

      if (!rect.width || !rect.height) return;

      // Make the ASCII character cells smaller for more characters and detail.
      const cssCell = Math.min(
        6, // Reduced from 9
        Math.max(3, Math.round(rect.width / 400)), // Adjusted base for smaller cell size
      );

      cw = Math.round(cssCell * dpr);
      ch = Math.round(cssCell * 1.75 * dpr);

      canvas.width =
        Math.ceil((rect.width * dpr) / cw) * cw;

      canvas.height =
        Math.ceil((rect.height * dpr) / ch) * ch;

      canvas.style.width = "100%";
      canvas.style.height = "100%";

      W = canvas.width;
      H = canvas.height;

      cols = W / cw;
      rows = H / ch;

      // Fit the complete image at zoom = 1.
      // Do not crop the painting at the initial position.
      s0 = Math.min(W / IW, H / IH);

      buildAtlas();

      lastZoom = NaN;

      frame.render(draw, true);
    };

    const sample = (
      data: Float32Array,
      u: number,
      v: number,
    ): number => {
      if (
        u < 0 ||
        v < 0 ||
        u >= IW - 1 ||
        v >= IH - 1
      ) {
        return 0;
      }

      const x = Math.floor(u);
      const y = Math.floor(v);

      const fx = u - x;
      const fy = v - y;

      const i = y * IW + x;

      return (
        data[i] * (1 - fx) * (1 - fy) +
        data[i + 1] * fx * (1 - fy) +
        data[i + IW] * (1 - fx) * fy +
        data[i + IW + 1] * fx * fy
      );
    };

    const draw = ({ timestamp: t }: { timestamp: number }) => {
      if (
        !alive ||
        !visible ||
        !atlas ||
        !IW ||
        !IH ||
        !W ||
        !H
      ) {
        return;
      }

      const z = Math.max(zoom.get(), 0.01);

      // Avoid redrawing at full display refresh rate when idle.
      if (z === lastZoom && t - lastDraw < 66) return;

      lastZoom = z;
      lastDraw = t;

      const k = s0 * z;

      if (k <= 0) return;

      const step = cw / k;

      // At zoom 1, use the geometric centre of the painting.
      // Progressively move the image centre towards the focal point.
      const pan = Math.max(
        0,
        0.5 + 0.5 * (1 - 1 / z), // Adjusted panning to focus on the center at low zoom
      );

      const centerX =
        IW / 2 + (focus.x - IW / 2) * pan;

      const centerY =
        IH / 2 + (focus.y - IH / 2) * pan;

      const sweep =
        (((t * 0.00016) % 1.5) - 0.25) * cols;

      const tick = Math.floor(t / 130);

      ctx.clearRect(0, 0, W, H);

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const u =
            centerX + ((x + 0.5) * cw - W / 2) / k;

          const v =
            centerY + ((y + 0.5) * ch - H / 2) / k;

          if (sample(alpha, u, v) < 0.12) continue;

          const l = sample(lum, u, v);

          let level =
            Math.min(
              1,
              Math.max(0, (l - 0.16) / 0.74),
            ) ** 1.15;

          // Moving scan line.
          level +=
            Math.max(
              0,
              1 - Math.abs(x - sweep) / 16,
            ) * 0.3;

          level = Math.min(
            RAMP.length - 1,
            Math.floor(level * RAMP.length),
          );

          const hash =
            (x * 73856093) ^ (y * 19349663);

          const flicker =
            (hash & 7) === 0 ? tick : 0;

          let row = level;

          let glyphColumn =
            ((hash >>> 3) + flicker) & 3;

          const gx =
            sample(lum, u + step, v) -
            sample(lum, u - step, v);

          const gy =
            sample(lum, u, v + step) -
            sample(lum, u, v - step);

          // Edge characters preserve the silhouettes of figures
          // and architectural features.
          if (
            level > 1 &&
            Math.hypot(gx, gy) > 0.17
          ) {
            const phi =
              (Math.atan2(gy, gx) +
                Math.PI / 2 +
                Math.PI * 2) %
              Math.PI;

            row = RAMP.length;

            glyphColumn =
              Math.round((phi / Math.PI) * 4) % 4;
          }

          ctx.drawImage(
            atlas,
            glyphColumn * cw,
            row * ch,
            cw,
            ch,
            x * cw,
            y * ch,
            cw,
            ch,
          );
        }
      }
    };

    const img = new Image();

    img.onload = () => {
      if (!alive) return;

      const offscreen = document.createElement("canvas");

      IW = offscreen.width = img.naturalWidth;
      IH = offscreen.height = img.naturalHeight;

      const g = offscreen.getContext("2d", {
        willReadFrequently: true,
      });

      if (!g) return;

      g.drawImage(img, 0, 0);

      const pixels = g.getImageData(
        0,
        0,
        IW,
        IH,
      ).data;

      lum = new Float32Array(IW * IH);
      alpha = new Float32Array(IW * IH);

      for (let i = 0; i < IW * IH; i++) {
        const p = i * 4;

        lum[i] =
          (0.299 * pixels[p] +
            0.587 * pixels[p + 1] +
            0.114 * pixels[p + 2]) /
          255;

        alpha[i] = pixels[p + 3] / 255;
      }

      resize();
      frame.render(draw, true);
    };

    img.onerror = () => {
      console.error(
        `Failed to load ASCII artwork: ${src}`,
      );
    };

    img.src = src;

    const resizeObserver = new ResizeObserver(resize);

    resizeObserver.observe(box);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;

        if (visible) {
          lastZoom = NaN;
          frame.render(draw, true);
        }
      },
    );

    intersectionObserver.observe(box);

    document.fonts
      .load('12px "JetBrains Mono"')
      .catch(() => undefined)
      .finally(() => {
        if (alive) {
          resize();
          frame.render(draw, true);
        }
      });

    return () => {
      alive = false;

      cancelFrame(draw);

      resizeObserver.disconnect();
      intersectionObserver.disconnect();

      img.onload = null;
      img.onerror = null;
    };
  }, [zoom, src, focus]);

  return (
    <div
      ref={wrap}
      className="absolute inset-0"
    >
      <canvas
        ref={cv}
        aria-hidden="true"
        className="block"
      />
    </div>
  );
}

import { useEffect, useRef } from "react";
import { cancelFrame, frame, type MotionValue } from "framer-motion";

type Props = {
  zoom: MotionValue<number>;
  src?: string;
  focus?: { x: number; y: number };
};

// Glyph ramp: sparse -> dense. Katakana mixed in for the matrix texture.
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
const FOCUS = { x: 526, y: 556 }; // source-pixel point between the two fingertips
const FONT = '"JetBrains Mono","Noto Sans Mono CJK JP","MS Gothic",monospace';

export default function AsciiArt({
  zoom,
  src = `${import.meta.env.BASE_URL}creation-of-adam.png`,
  focus = FOCUS,
}: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = cv.current!,
      box = wrap.current!,
      ctx = canvas.getContext("2d")!;
    let alive = true,
      visible = true,
      lastZoom = NaN,
      lastDraw = 0;
    let lum = new Float32Array(0),
      alpha = new Float32Array(0),
      IW = 0,
      IH = 0;
    let atlas: HTMLCanvasElement | null = null,
      cw = 8,
      ch = 14,
      cols = 0,
      rows = 0,
      W = 0,
      H = 0,
      s0 = 1;

    const buildAtlas = () => {
      const a = document.createElement("canvas");
      a.width = cw * 4;
      a.height = ch * (RAMP.length + 1);
      const g = a.getContext("2d")!;
      g.font = `${Math.round(ch * 0.88)}px ${FONT}`;
      g.textAlign = "center";
      g.textBaseline = "middle";
      RAMP.forEach((row, l) => {
        g.fillStyle = COLORS[l];
        for (let v = 0; v < 4; v++)
          g.fillText(row[v % row.length], v * cw + cw / 2, l * ch + ch / 2 + 1);
      });
      g.fillStyle = "#c9d9ff";
      EDGES.forEach((e, v) =>
        g.fillText(e, v * cw + cw / 2, RAMP.length * ch + ch / 2 + 1),
      );
      atlas = a;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2),
        r = box.getBoundingClientRect();
      const cssCell = Math.min(9, Math.max(5, Math.round(r.width / 250)));
      cw = Math.round(cssCell * dpr);
      ch = Math.round(cssCell * 1.75 * dpr);
      canvas.width = Math.ceil((r.width * dpr) / cw) * cw;
      canvas.height = Math.ceil((r.height * dpr) / ch) * ch;
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      W = canvas.width;
      H = canvas.height;
      cols = W / cw;
      rows = H / ch;
      s0 = Math.max(W / IW, H / (IH * 0.68)); // hands fill the width on desktop, the fingertips on mobile
      buildAtlas();
      lastZoom = NaN; // canvas was cleared by the resize: force the next frame to repaint
    };

    const samp = (arr: Float32Array, u: number, v: number) => {
      if (u < 0 || v < 0 || u >= IW - 1 || v >= IH - 1) return 0;
      const x = u | 0,
        y = v | 0,
        fx = u - x,
        fy = v - y,
        i = y * IW + x;
      return (
        arr[i] * (1 - fx) * (1 - fy) +
        arr[i + 1] * fx * (1 - fy) +
        arr[i + IW] * (1 - fx) * fy +
        arr[i + IW + 1] * fx * fy
      );
    };

    // Runs in framer-motion's render step, the same step that applies the zoom/scroll motion values,
    // so the ASCII art and the headline scaling over it are always drawn from the same scroll position.
    const draw = ({ timestamp: t }: { timestamp: number }) => {
      if (!visible || !atlas || !IW) return;
      const z = zoom.get();
      // Idle (not zooming): the matrix flicker/scan line only needs ~15fps, not a full repaint of
      // every glyph at display refresh rate. Any zoom change repaints immediately.
      if (z === lastZoom && t - lastDraw < 66) return;
      lastZoom = z;
      lastDraw = t;
      const k = s0 * z,
        step = cw / k,
        sweep = (((t * 0.00016) % 1.5) - 0.25) * cols,
        tick = Math.floor(t / 130);
      ctx.clearRect(0, 0, W, H);
      for (let y = 0; y < rows; y++)
        for (let x = 0; x < cols; x++) {
          const u = focus.x + ((x + 0.5) * cw - W / 2) / k,
            v = focus.y + ((y + 0.5) * ch - H / 2) / k;
          if (samp(alpha, u, v) < 0.12) continue;
          const l = samp(lum, u, v);
          let lvl = Math.min(1, Math.max(0, (l - 0.16) / 0.74)) ** 1.15;
          lvl += Math.max(0, 1 - Math.abs(x - sweep) / 16) * 0.3; // matrix scan line
          const level = Math.min(
            RAMP.length - 1,
            Math.floor(lvl * RAMP.length),
          );
          const h = (x * 73856093) ^ (y * 19349663),
            flicker = (h & 7) === 0 ? tick : 0;
          let row = level,
            col = ((h >>> 3) + flicker) & 3;
          const gx = samp(lum, u + step, v) - samp(lum, u - step, v),
            gy = samp(lum, u, v + step) - samp(lum, u, v - step);
          if (level > 1 && Math.hypot(gx, gy) > 0.17) {
            // outline glyphs follow the contour
            const phi =
              (Math.atan2(gy, gx) + Math.PI / 2 + Math.PI * 2) % Math.PI;
            row = RAMP.length;
            col = Math.round((phi / Math.PI) * 4) % 4;
          }
          ctx.drawImage(
            atlas,
            col * cw,
            row * ch,
            cw,
            ch,
            x * cw,
            y * ch,
            cw,
            ch,
          );
        }
    };

    const img = new Image();
    img.onload = () => {
      const o = document.createElement("canvas");
      IW = o.width = img.naturalWidth;
      IH = o.height = img.naturalHeight;
      const g = o.getContext("2d", { willReadFrequently: true })!;
      g.drawImage(img, 0, 0);
      const d = g.getImageData(0, 0, IW, IH).data;
      lum = new Float32Array(IW * IH);
      alpha = new Float32Array(IW * IH);
      for (let i = 0; i < IW * IH; i++) {
        lum[i] =
          (0.299 * d[i * 4] + 0.587 * d[i * 4 + 1] + 0.114 * d[i * 4 + 2]) /
          255;
        alpha[i] = d[i * 4 + 3] / 255;
      }
      resize();
    };
    img.src = src;
    const ro = new ResizeObserver(() => IW && resize());
    ro.observe(box);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
    });
    io.observe(box);
    (
      document.fonts?.load(`12px "JetBrains Mono"`) ?? Promise.resolve()
    ).finally(() => {
      if (alive) {
        IW && resize();
        frame.render(draw, true);
      }
    });
    return () => {
      alive = false;
      cancelFrame(draw);
      ro.disconnect();
      io.disconnect();
    };
  }, [zoom, src, focus]);

  return (
    <div ref={wrap} className="absolute inset-0">
      <canvas ref={cv} aria-hidden />
    </div>
  );
}

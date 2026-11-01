/**
 * Line-drawn TarVance mark used by the page transition.
 *
 * A JPEG can't be "drawn", so this is a vector trace of the TV monogram in /public/tarvance-logo.jpeg.
 * Every element marked `data-draw` gets its outline traced by GSAP (stroke-dashoffset), then the
 * elements marked `data-fill` fade their fill in. The two rings are outline-only.
 */
const CREAM = "#f4efe2";
const SKY = "#8bb6ff";

export default function TransitionLogo() {
  return (
    <div className="flex flex-col items-center">
      <svg
        viewBox="0 0 200 200"
        width="176"
        height="176"
        fill="none"
        strokeWidth="1.6"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {/* Double ring, as in the badge */}
        <circle data-draw cx="100" cy="100" r="93" stroke={CREAM} strokeWidth="1.8" />
        <circle data-draw cx="100" cy="100" r="88" stroke={SKY} strokeWidth="1" />

        {/* T */}
        <path
          data-draw
          data-fill
          stroke={CREAM}
          fill={CREAM}
          style={{ fillOpacity: 0 }}
          d="M51.6 36.4H122.7C119.5 42.5 115 45.4 108.5 45.4H92.1V95C92.1 100 94.5 105 98.4 108C87.5 105.5 79.1 97 79.1 86V45.4H65.5C59 45.4 54.8 42.5 51.6 36.4Z"
        />
        {/* V */}
        <path
          data-draw
          data-fill
          stroke={CREAM}
          fill={CREAM}
          style={{ fillOpacity: 0 }}
          d="M96.4 57.1H115.1L131.4 90.7L144.4 65C146 61.5 148.5 58.5 153.7 57.1L126.3 108.3Z"
        />
        {/* Swoosh under the monogram */}
        <path
          data-draw
          data-fill
          stroke={CREAM}
          fill={CREAM}
          style={{ fillOpacity: 0 }}
          d="M54.2 79C58 98 76 118 99 117.5C108 117.3 116 114.5 121.8 109C112 111.5 103 111 96 108.5C72 100 59 92 54.2 79Z"
        />
        {/* Dot */}
        <circle
          data-draw
          data-fill
          cx="145"
          cy="43.5"
          r="6.2"
          stroke={CREAM}
          fill={CREAM}
          style={{ fillOpacity: 0 }}
        />
      </svg>
      <p
        data-logo-text
        className="mt-1.5 font-display text-[2.1rem] leading-none tracking-[-.02em] text-tar-cream"
      >
        TarVance
      </p>
      <p
        data-logo-text
        className="mt-[.7rem] font-mono text-[.62rem] uppercase tracking-[.24em] text-[#8bb6ff]"
      >
        Build. Connect. Grow.
      </p>
    </div>
  );
}

/**
 * Button styles, written in plain Tailwind (this replaces the DaisyUI `btn` classes).
 * Usage:  <Link className={button("primary", "lg")} …>   or   button("quiet", "md", "mt-5")
 */
const base =
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-full font-bold leading-normal transition duration-200 disabled:cursor-not-allowed disabled:opacity-60";

const sizes = {
  md: "h-10 px-4 text-sm",
  lg: "min-h-[3.35rem] px-[1.4rem] text-lg",
} as const;

const variants = {
  /** Main call to action (royal blue). */
  primary:
    "border border-[#2b56d7] bg-[#2b56d7] text-white shadow-[0_12px_28px_rgba(43,86,215,.18)] hover:-translate-y-0.5 hover:border-[#1a42b9] hover:bg-[#1a42b9] hover:shadow-[0_16px_34px_rgba(43,86,215,.28)]",
  /** Outlined, for secondary actions on light backgrounds. */
  quiet:
    "border border-tar-navy/18 bg-transparent text-tar-navy hover:border-tar-navy/45 hover:bg-tar-blue/5",
  /** Cream pill, for dark backgrounds. */
  light: "bg-tar-cream text-tar-navy hover:bg-white",
  /** Solid navy, for light backgrounds. */
  navy: "bg-tar-navy text-tar-cream hover:bg-tar-royal",
  /** Thin outline in navy, pairs with `navy`. */
  outline: "border border-tar-navy/25 bg-transparent text-tar-navy hover:bg-tar-navy/5",
} as const;

export type ButtonVariant = keyof typeof variants;
export type ButtonSize = keyof typeof sizes;

export function button(
  variant: ButtonVariant,
  size: ButtonSize = "md",
  extra = "",
) {
  return `${base} ${sizes[size]} ${variants[variant]} ${extra}`.trim();
}

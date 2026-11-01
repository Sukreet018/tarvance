/**
 * Reusable Tailwind class strings for patterns that appear in more than one component.
 * Tailwind scans this file, so anything written here is generated just like inline classes.
 */

/** Faint sky-blue grid lines on a dark background (use with an absolutely positioned element). */
export const skyGrid =
  "bg-[linear-gradient(to_right,rgb(139_182_255/.075)_1px,transparent_1px),linear-gradient(to_bottom,rgb(139_182_255/.075)_1px,transparent_1px)] bg-size-[58px_58px]";

/** Fades an element out towards its bottom edge. */
export const fadeBottom =
  "[mask-image:linear-gradient(to_bottom,black,transparent_92%)]";

/** Cards that rise slightly on hover. */
export const cardLift =
  "transition duration-350 ease-[cubic-bezier(.2,.8,.2,1)] hover:-translate-y-[7px] hover:shadow-[0_24px_55px_rgba(7,22,63,.11)]";

/** Text inputs, selects and textareas. */
export const formControl =
  "w-full rounded-[13px] border border-tar-navy/15 bg-white/70 px-4 py-[.9rem] text-tar-ink outline-none transition placeholder:text-[#8790a2] focus:border-[#2b56d7] focus:ring-4 focus:ring-[#2b56d7]/10";

/** Labels above form fields. */
export const formLabel = "mb-[.45rem] block text-[.86rem] font-bold text-[#253351]";

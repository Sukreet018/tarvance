import type { Faq } from "../../seo/types";

/** Native <details> so the answers are in the page HTML for Google and AI crawlers, and need no JavaScript. */
export default function FaqList({ items }: { items: Faq[] }) {
  return (
    <div className="grid gap-3">
      {items.map((f) => (
        <details
          key={f.q}
          className="group rounded-2xl border border-tar-navy/10 bg-[#fbf8ee] p-5 sm:p-6"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg font-bold tracking-[-.02em] text-tar-navy">
            <h3 className="text-lg font-bold">{f.q}</h3>
            <span
              aria-hidden="true"
              className="text-xl text-[#244ec4] transition-transform group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">{f.a}</p>
        </details>
      ))}
    </div>
  );
}

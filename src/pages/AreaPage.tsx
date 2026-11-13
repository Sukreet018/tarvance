import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import Reveal from "../components/ui/Reveal";
import SectionHeader from "../components/ui/SectionHeader";
import FaqList from "../components/seo/FaqList";
import { button } from "../components/ui/button";
import { services } from "../data/siteData";
import { pages } from "../seo/types";

/** Location landing page. Its text lives in src/seo/seo.json so the pre-rendered HTML matches it exactly. */
export default function AreaPage({ path }: { path: string }) {
  const page = pages[path];
  if (!page) return null;

  return (
    <>
      <section className="bg-[#030916] pb-20 pt-40 text-tar-cream">
        <div className="site-container max-w-4xl">
          <span className="eyebrow text-[#8bb6ff]">{page.eyebrow ?? "TarVance"}</span>
          <h1 className="display-heading mt-5 text-4xl sm:text-5xl lg:text-6xl">{page.h1}</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-tar-cream/70">{page.intro}</p>
          <Link to="/contact" className={button("light", "lg", "mt-9")}>
            Get a free quote
          </Link>
        </div>
      </section>

      <section className="section-pad bg-tar-paper">
        <div className="site-container grid gap-10 lg:grid-cols-3">
          {(page.sections ?? []).map((s, i) => (
            <Reveal key={s.h2} delay={i * 0.06}>
              <article className="h-full rounded-2xl border border-tar-navy/10 bg-[#fbf8ee] p-6 sm:p-7">
                <h2 className="font-display text-2xl font-bold tracking-[-.03em] text-tar-navy">
                  {s.h2}
                </h2>
                {s.body.map((p) => (
                  <p key={p} className="mt-4 text-sm leading-7 text-slate-600">
                    {p}
                  </p>
                ))}
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section-pad bg-[#f1eee5]">
        <div className="site-container">
          <Reveal>
            <SectionHeader
              eyebrow="Services"
              title="What we can build for you."
              description="Software and websites first, with the search and support work that keeps customers finding you."
            />
          </Reveal>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <li
                key={s.title}
                className="rounded-2xl border border-tar-navy/10 bg-[#fbf8ee] p-6"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={18} className="shrink-0 text-[#244ec4]" />
                  <h3 className="font-display text-lg font-bold text-tar-navy">{s.title}</h3>
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-600">{s.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {page.faqs && (
        <section className="section-pad bg-tar-paper">
          <div className="site-container max-w-4xl">
            <Reveal>
              <SectionHeader eyebrow="Questions" title="Frequently asked." />
            </Reveal>
            <div className="mt-8">
              <FaqList items={page.faqs} />
            </div>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link to="/contact" className={button("primary", "lg")}>
                Start a project
              </Link>
              <Link to="/about" className={button("quiet", "lg")}>
                About TarVance
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
